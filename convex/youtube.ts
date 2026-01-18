import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// const CHANNEL_ID = "UCq2E_x5Q5k3X5g5g5g5g5g5"; // Placeholder, need actual ID or fetch from handle
const API_BASE = "https://www.googleapis.com/youtube/v3";

export const syncVideos = internalAction({
	args: {},
	handler: async (ctx) => {
		const apiKey = process.env.YOUTUBE_API_KEY;
		if (!apiKey) {
			console.error("YOUTUBE_API_KEY is not set");
			return;
		}

		// 1. Get Channel Uploads Playlist ID
		// In a real app, you might query by handle first if CHANNEL_ID isn't constant
		// For @Matteeoos27, we'd search for the channel ID first
		
		// Let's assume we search by handle if we don't have the ID hardcoded yet
		let channelId = process.env.YOUTUBE_CHANNEL_ID;
		
		if (!channelId) {
			const channelRes = await fetch(
				`${API_BASE}/search?part=id&q=@Matteeoos27&type=channel&key=${apiKey}`
			);
			const channelData = await channelRes.json();
			if (channelData.items?.[0]?.id?.channelId) {
				channelId = channelData.items[0].id.channelId;
			} else {
				console.error("Could not find channel ID for @Matteeoos27");
				return;
			}
		}

		// 2. Get "Uploads" playlist ID
		const channelInfoRes = await fetch(
			`${API_BASE}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
		);
		const channelInfo = await channelInfoRes.json();
		const uploadsPlaylistId = channelInfo.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

		if (!uploadsPlaylistId) {
			console.error("Could not find uploads playlist");
			return;
		}

		// 3. Get recent videos from playlist
		const playlistRes = await fetch(
			`${API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
		);
		const playlistData = await playlistRes.json();
		
		if (!playlistData.items) return;

		const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(",");

		// 4. Get video details (views, duration, etc)
		const videosRes = await fetch(
			`${API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`
		);
		const videosData = await videosRes.json();

		if (!videosData.items) return;

		// 5. Process and store
		const videos = videosData.items.map((video: any) => ({
			youtubeId: video.id,
			title: video.snippet.title,
			description: video.snippet.description,
			thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
			thumbnailHigh: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url,
			viewCount: parseInt(video.statistics.viewCount || "0", 10),
			likeCount: parseInt(video.statistics.likeCount || "0", 10),
			commentCount: parseInt(video.statistics.commentCount || "0", 10),
			duration: video.contentDetails.duration, // ISO 8601 format (e.g. PT15M33S)
			publishedAt: new Date(video.snippet.publishedAt).getTime(),
			fetchedAt: Date.now(),
			tags: video.snippet.tags || [],
		}));

		// Call mutation to upsert videos
		await ctx.runMutation(internal.videos.upsertBatch, { videos });
	},
});
