import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const API_BASE = "https://www.googleapis.com/youtube/v3";
const ONE_HOUR_MS = 60 * 60 * 1000;
const TWO_DAYS_MS = 2 * 24 * ONE_HOUR_MS;

// Helper: Get or cache playlist ID
async function getCachedPlaylistId(ctx: any, apiKey: string): Promise<string | null> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) {
      console.error("YOUTUBE_CHANNEL_ID is not set in env variables.");
      return null;
  }

  // In a robust system, we might cache this in a 'settings' table if fetched dynamically.
  // For now, assuming environment variable is the primary source or we fetch it once.
  // If YOUTUBE_CHANNEL_ID is just the handle (@...), we need to resolve it.
  
  let targetChannelId = channelId;

  // Simple check if it looks like a handle (starts with @)
  if (channelId.startsWith("@")) {
      // Need to resolve handle to ID
      const channelRes = await fetch(
        `${API_BASE}/search?part=id&q=${channelId}&type=channel&key=${apiKey}`
      );
      const channelData = await channelRes.json();
      if (channelData.items?.[0]?.id?.channelId) {
          targetChannelId = channelData.items[0].id.channelId;
      } else {
          console.error(`Could not resolve channel ID for handle ${channelId}`);
          return null;
      }
  }

  const channelInfoRes = await fetch(
    `${API_BASE}/channels?part=contentDetails&id=${targetChannelId}&key=${apiKey}`
  );
  const channelInfo = await channelInfoRes.json();
  
  if (!channelInfo.items?.[0]) {
      console.error("Channel info not found.");
      return null;
  }

  return channelInfo.items[0].contentDetails?.relatedPlaylists?.uploads || null;
}

// TIER 1: Quick poll - Check for new videos (every 5 min)
export const checkForNewVideos = internalAction({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.error("YOUTUBE_API_KEY is not set");
        return false;
    }

    const uploadsPlaylistId = await getCachedPlaylistId(ctx, apiKey);
    if (!uploadsPlaylistId) return false;

    // Fetch ONLY top 5 items with minimal fields to save quota
    const playlistRes = await fetch(
      `${API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=5&fields=items(snippet/resourceId/videoId,snippet/publishedAt)&key=${apiKey}`
    );
    const playlistData = await playlistRes.json();

    if (!playlistData.items) return false;

    // Get existing videos from DB to compare
    const existingVideoIds = await ctx.runQuery(internal.videos.getRecentVideoIds, { limit: 5 });

    // Check if any new videos found
    const newVideoIds = playlistData.items
      .filter((item: any) => !existingVideoIds.includes(item.snippet.resourceId.videoId))
      .map((item: any) => item.snippet.resourceId.videoId);

    if (newVideoIds.length > 0) {
      console.log(`Found ${newVideoIds.length} new videos, triggering full sync for them.`);
      // Fetch full details ONLY for the new videos immediately
      await fetchAndUpsertVideos(ctx, apiKey, newVideoIds);
      return true;
    }

    return false;
  },
});

// TIER 2: Update stats for recent videos (every 1 hour)
export const syncRecentStats = internalAction({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return;

    // Get videos that need stats updates (published in last 48h, stats updated > 1h ago)
    const videosToUpdate = await ctx.runQuery(
      internal.videos.getVideosNeedingStatsUpdate,
      { 
        publishedAfter: Date.now() - TWO_DAYS_MS,
        statsUpdatedBefore: Date.now() - ONE_HOUR_MS,
      }
    );

    if (videosToUpdate.length === 0) {
      return;
    }

    const videoIds = videosToUpdate.map(v => v.youtubeId).join(",");

    // Fetch only statistics for these videos
    const videosRes = await fetch(
      `${API_BASE}/videos?part=statistics&id=${videoIds}&key=${apiKey}`
    );
    const videosData = await videosRes.json();

    if (!videosData.items) return;

    // Update only the stats
    const updates = videosData.items.map((video: any) => ({
      youtubeId: video.id,
      viewCount: parseInt(video.statistics.viewCount || "0", 10),
      likeCount: parseInt(video.statistics.likeCount || "0", 10),
      commentCount: parseInt(video.statistics.commentCount || "0", 10),
      statsUpdatedAt: Date.now(),
    }));

    await ctx.runMutation(internal.videos.updateStatsBatch, { updates });
    console.log(`Updated stats for ${updates.length} videos`);
  },
});

// TIER 3: Full sync - Fetch all 50 videos (every 6 hours)
export const syncVideos = internalAction({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return;

    const uploadsPlaylistId = await getCachedPlaylistId(ctx, apiKey);
    if (!uploadsPlaylistId) return;

    // Fetch all 50 videos from playlist
    const playlistRes = await fetch(
      `${API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
    );
    const playlistData = await playlistRes.json();
    
    if (!playlistData.items) return;

    const videoIds = playlistData.items
      .map((item: any) => item.snippet.resourceId.videoId)
      .join(",");

    // Re-use the fetch helper
    await fetchAndUpsertVideos(ctx, apiKey, videoIds.split(','));
    console.log(`Full sync completed.`);
  },
});

// Helper function to fetch details and upsert
async function fetchAndUpsertVideos(ctx: any, apiKey: string, videoIds: string[]) {
    if (videoIds.length === 0) return;

    const idsString = videoIds.join(",");
    
    const videosRes = await fetch(
      `${API_BASE}/videos?part=snippet,statistics,contentDetails&id=${idsString}&key=${apiKey}`
    );
    const videosData = await videosRes.json();

    if (!videosData.items) return;

    const videos = videosData.items.map((video: any) => ({
      youtubeId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
      thumbnailHigh: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url,
      viewCount: parseInt(video.statistics.viewCount || "0", 10),
      likeCount: parseInt(video.statistics.likeCount || "0", 10),
      commentCount: parseInt(video.statistics.commentCount || "0", 10),
      duration: video.contentDetails.duration,
      publishedAt: new Date(video.snippet.publishedAt).getTime(),
      fetchedAt: Date.now(),
      statsUpdatedAt: Date.now(),
      tags: video.snippet.tags || [],
    }));

    await ctx.runMutation(internal.videos.upsertBatch, { videos });
}
