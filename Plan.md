# Matteo Frontend V2 - Build From Scratch Plan

This document serves as the master blueprint for rebuilding the Matteo platform as a high-fidelity, SSR-capable application using TanStack Start and Convex.

---

## Phase 1: Core Infrastructure & Layout ✅ COMPLETE
1.  **Scaffold Routes:** Implement file-based routing in `src/routes/`.
    - `__root.tsx`: Global layout with `PixelLayout`, Header, Footer, and Background Grid.
    - `index.tsx`: Landing page with high-fidelity pixel-art hero section.
2.  **Aesthetic Setup:**
    - Configure `src/styles.css` with Tailwind v4 CSS-first configuration (using `@theme` and custom variables).
    - Import "Press Start 2P" / "VT323" fonts directly in CSS.
    - Define `--shadow-pixel` and steps-based animations in CSS.
3.  **Core Components:**
    - `PixelButton.tsx`: Reusable button using `motion` (Framer Motion) with `whileHover` and `transition={{ ease: "steps(n)" }}`.
    - `PixelCard.tsx`: Bordered container with the pixel-art depth effect using `motion.div`.

---

## Phase 2: Authentic Authentication (Better Auth + Convex) ✅ COMPLETE
1.  **Schema Definition:** Update `convex/schema.ts` with the canonical Users, Sessions, Accounts, and Verifications tables.
2.  **Server Logic:** 
    - Implement `src/lib/auth.ts` to bridge Better Auth and Convex.
    - Setup `src/routes/api/auth.$.ts` to expose the required auth endpoints.
3.  **Frontend Integration:**
    - Create `src/lib/auth-client.ts` for the client-side auth state.
    - Build the `SignInModal.tsx` as a high-fidelity pixel-art UI.
    - Implement `beforeLoad` route protection for sensitive pages.

---

## Phase 3: High-Fidelity Blog System (SSR + SEO) ✅ COMPLETE
1.  **Dynamic Routing:**
    - `src/routes/blog/index.tsx`: Paginated list of blog posts.
    - `src/routes/blog/$slug.tsx`: Dynamic post detail with SEO/OG meta tags.
2.  **SSR Loading:**
    - Use TanStack Start `loaders` to fetch post data on the server.
    - Implement a `meta` function in `$slug.tsx` to generate dynamic Open Graph tags for social sharing.
3.  **User Features:**
    - Protected `src/routes/blog/new.tsx` for creating posts.
    - Per-user unique blog URLs (e.g., `/user/$username/blog`).

---

## Phase 4: Quiz System ✅ COMPLETE
1.  **Quiz Logic:**
    - `src/routes/quiz/$id.tsx`: Interactive quiz player.
    - Unique shareable results pages with custom OG tags for social validation.
2.  **Animations & Feel:**
    - Use `motion` (Framer Motion) for all UI transitions.
    - Ensure all animations use `ease: "steps()"` to maintain the "retro" frame-by-frame aesthetic.
    - Use `layoutId` for smooth layout transitions between cards and pages.

---

## Phase 5: Videos Feature (YouTube Integration) 🆕 NEW

### 5.1 YouTube Data API Integration

**Channel:** `https://www.youtube.com/@Matteeoos27`

#### API Strategy & Optimization
1. **Server-Side Caching with Convex:**
   - Store fetched videos in `convex/schema.ts` → `videos` table
   - Cache refresh: Every 6 hours (configurable via cron job)
   - Store: videoId, title, description, thumbnail, viewCount, publishedAt, duration
   - This prevents hitting YouTube API quota on every user request

2. **TanStack Query Integration:**
   - Use `@tanstack/react-query` for client-side caching
   - `staleTime: 5 * 60 * 1000` (5 minutes) - data considered fresh
   - `gcTime: 30 * 60 * 1000` (30 minutes) - keep in cache
   - Deduplicate requests across components
   - Optimistic UI with background refetching

3. **Convex HTTP Actions for YouTube API:**
   - `convex/youtube.ts`: HTTP action to fetch from YouTube Data API
   - Called only by server (never client) to protect API key
   - Batch fetch: Get latest 50 videos per request
   - Store in Convex database for fast queries

#### Database Schema Addition
```typescript
// convex/schema.ts
videos: defineTable({
  youtubeId: v.string(),
  title: v.string(),
  description: v.optional(v.string()),
  thumbnail: v.string(),
  thumbnailHigh: v.optional(v.string()),
  viewCount: v.number(),
  likeCount: v.optional(v.number()),
  commentCount: v.optional(v.number()),
  duration: v.optional(v.string()),
  publishedAt: v.number(),
  fetchedAt: v.number(),
  tags: v.optional(v.array(v.string())),
})
.index("by_youtube_id", ["youtubeId"])
.index("by_published", ["publishedAt"])
.index("by_views", ["viewCount"]),
```

#### Implementation Files
1. **`convex/youtube.ts`** - YouTube API fetcher (HTTP Action)
   - `syncVideos`: Fetch latest videos from channel
   - `getChannelStats`: Get channel statistics
   - Protected with `YOUTUBE_API_KEY` environment variable

2. **`convex/videos.ts`** - Video queries and mutations
   - `list`: Get paginated videos (from cache)
   - `getById`: Get single video by youtubeId
   - `getMostViewed`: Get top N most viewed videos
   - `getRecent`: Get latest N videos
   - `updateStats`: Update view/like counts

3. **`src/routes/videos/index.tsx`** - Videos listing page
   - Grid layout with PixelCard components
   - Filtering: All, Most Viewed, Recent
   - Infinite scroll or pagination
   - Search functionality

4. **`src/routes/videos/$id.tsx`** - Video detail/player page
   - Embedded YouTube player (iframe)
   - Video metadata display
   - Related videos sidebar
   - Share functionality

### 5.2 API Quota Optimization Strategy

**YouTube Data API Quota: 10,000 units/day**

| Operation | Cost | Our Usage |
|-----------|------|-----------|
| search.list | 100 units | Avoid - use playlistItems instead |
| playlistItems.list | 1 unit | Get channel uploads |
| videos.list | 1 unit | Get video details |
| channels.list | 1 unit | Get channel info |

**Our Approach:**
1. **Initial Sync:** Fetch all videos once (uses ~100 units for 50 videos)
2. **Incremental Sync:** Every 6 hours, only fetch new videos (uses ~5-10 units)
3. **Store Everything:** Never re-fetch what's already in database
4. **Client Never Hits API:** All requests go to Convex cache

**Cron Job Setup:**
```typescript
// convex/crons.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "sync-youtube-videos",
  { hours: 6 },
  internal.youtube.syncVideos
);

export default crons;
```

---

## Phase 6: UI/UX Enhancement (Minecraft.net Inspired) 🆕 NEW

### 6.1 Design Reference Analysis

**Source:** https://www.minecraft.net/en-us

#### Key UI Patterns to Implement:
1. **Hero Sections:** Full-width with parallax background, bold typography
2. **Card Grid System:** Masonry-like layout with hover animations
3. **Mega Navigation:** Rich dropdown menus with image tiles
4. **Content Categories:** Tabs/filters with animated transitions
5. **Featured Content:** Larger cards for promoted items
6. **Subtle Animations:** Smooth reveals on scroll, hover effects

### 6.2 Special Effects System

#### Enchanted Effect (Most Viewed Content)
**Inspired by:** Minecraft enchanted items purple shimmer

```css
/* src/styles.css */
@keyframes enchanted-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.enchanted {
  position: relative;
  overflow: hidden;
}

.enchanted::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(138, 43, 226, 0.3) 25%,
    rgba(186, 85, 211, 0.5) 50%,
    rgba(138, 43, 226, 0.3) 75%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: enchanted-shimmer 3s linear infinite;
  pointer-events: none;
  mix-blend-mode: overlay;
}
```

#### Gold Effect (Most Recent Content)
**Inspired by:** Minecraft gold items glow

```css
/* src/styles.css */
@keyframes gold-pulse {
  0%, 100% { 
    box-shadow: 
      0 0 5px #FFD700,
      0 0 10px #FFA500,
      0 0 15px #FF8C00,
      inset 0 0 5px rgba(255, 215, 0, 0.2);
  }
  50% { 
    box-shadow: 
      0 0 10px #FFD700,
      0 0 20px #FFA500,
      0 0 30px #FF8C00,
      inset 0 0 10px rgba(255, 215, 0, 0.4);
  }
}

.gold-glow {
  animation: gold-pulse 2s ease-in-out infinite;
  border-color: #FFD700 !important;
}

.gold-glow::after {
  content: 'NEW';
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  font-family: 'Press Start 2P', cursive;
  font-size: 8px;
  padding: 4px 8px;
  border: 2px solid #000;
}
```

### 6.3 Component Enhancements

#### ContentCard Component (with Effects)
```tsx
// src/components/pixel/ContentCard.tsx
interface ContentCardProps {
  type: 'video' | 'blog' | 'quiz';
  isMostViewed?: boolean;  // Apply enchanted effect
  isRecent?: boolean;       // Apply gold effect (within 7 days)
  data: VideoData | BlogData | QuizData;
}
```

**Effect Logic:**
- **Enchanted (Most Viewed):** Top 3 items by view count per category
- **Gold (Recent):** Items published within last 7 days
- **Both can apply:** A new video that's also trending

### 6.4 Layout Animation System

#### Page Transitions
```tsx
// Use motion's AnimatePresence for route transitions
<AnimatePresence mode="wait">
  <motion.div
    key={router.state.location.pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Outlet />
  </motion.div>
</AnimatePresence>
```

#### Staggered Grid Animations
```tsx
// Cards appear one by one
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { ease: "easeOut" }
  }
};
```

#### Scroll-Triggered Animations
```tsx
// Use motion's whileInView
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6 }}
>
```

### 6.5 Homepage Redesign

**Inspired by:** minecraft.net homepage structure

#### Sections:
1. **Hero Banner** (Full viewport)
   - Featured video or announcement
   - Animated background (parallax)
   - CTA buttons with pixel styling

2. **Quick Stats Bar**
   - Total videos, blog posts, quizzes
   - Animated counters on scroll

3. **Featured Content Grid**
   - 1 large featured card + 4 smaller cards
   - Enchanted/gold effects applied
   - Category tabs (Videos, Blogs, Quizzes)

4. **Latest Videos Section**
   - Horizontal scrollable carousel
   - Play button overlay with hover effect
   - View count and date badges

5. **Recent Blog Posts**
   - 3-column masonry grid
   - Excerpt preview on hover
   - Author avatar and read time

6. **Quiz Spotlight**
   - Single featured quiz with stats
   - "Take Quiz" CTA
   - Leaderboard preview

7. **Newsletter/Discord CTA**
   - Full-width banner
   - Pixel-art background
   - Email input with PixelButton

### 6.6 Implementation Priority

| Priority | Component | Effort |
|----------|-----------|--------|
| P0 | YouTube API integration | 3h |
| P0 | Videos table schema | 30m |
| P0 | Video caching system | 2h |
| P1 | Videos page UI | 2h |
| P1 | Enchanted effect CSS | 1h |
| P1 | Gold effect CSS | 1h |
| P2 | ContentCard component | 2h |
| P2 | Homepage redesign | 4h |
| P2 | Layout animations | 2h |
| P3 | Page transitions | 1h |
| P3 | Scroll animations | 1h |

---

## Phase 7: Performance Optimization 🆕 NEW

### 7.1 TanStack Query Configuration

```typescript
// src/integrations/tanstack-query/root-provider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000,   // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});
```

### 7.2 Convex Query Optimization

1. **Use Indexes:** All queries use proper indexes
2. **Pagination:** Offset-based for simplicity
3. **Selective Fields:** Only fetch needed fields
4. **Batch Operations:** Group related queries

### 7.3 Image Optimization

1. **Lazy Loading:** All images below fold
2. **Responsive Images:** Multiple sizes via YouTube API
3. **Blur Placeholders:** Low-quality image previews
4. **CDN Caching:** YouTube thumbnail CDN

### 7.4 Bundle Optimization

1. **Code Splitting:** Per-route bundles
2. **Tree Shaking:** Remove unused code
3. **Lazy Components:** Dynamic imports for heavy components

---

## Environment Variables Required

```bash
# YouTube Data API
YOUTUBE_API_KEY=<your-youtube-api-key>
YOUTUBE_CHANNEL_ID=<channel-id-for-Matteeoos27>

# Existing
GITHUB_CLIENT_ID=<github-oauth-app-id>
GITHUB_CLIENT_SECRET=<github-oauth-app-secret>
CONVEX_DEPLOYMENT=<your-convex-deployment>
```

---

## File Structure (Phase 5-7)

```
src/
├── components/
│   └── pixel/
│       ├── ContentCard.tsx      # NEW - unified card with effects
│       ├── EnchantedOverlay.tsx # NEW - shimmer effect
│       ├── GoldBadge.tsx        # NEW - gold glow effect
│       ├── VideoPlayer.tsx      # NEW - YouTube embed
│       └── StatsCounter.tsx     # NEW - animated counters
├── routes/
│   └── videos/
│       ├── index.tsx            # Video listing page
│       └── $id.tsx              # Video detail page
├── hooks/
│   ├── useVideos.ts             # TanStack Query hooks for videos
│   └── useContentEffects.ts     # Determine enchanted/gold effects
└── styles.css                   # Add effect animations

convex/
├── schema.ts                    # Add videos table
├── videos.ts                    # Video queries
├── youtube.ts                   # YouTube API HTTP actions
└── crons.ts                     # Scheduled video sync
```

---

## Success Criteria

### Phase 5 (Videos)
- [ ] Videos load from Convex cache (not YouTube API)
- [ ] Sync job runs every 6 hours
- [ ] API quota usage < 100 units/day
- [ ] Videos page loads < 500ms
- [ ] Video player embedded and working

### Phase 6 (UI/UX)
- [ ] Enchanted effect on most viewed content
- [ ] Gold effect on recent content (< 7 days)
- [ ] Staggered grid animations working
- [ ] Page transitions smooth
- [ ] Homepage redesigned with all sections

### Phase 7 (Performance)
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No unnecessary API calls

---

## Notes

1. **YouTube Channel ID:** Need to fetch from `@Matteeoos27` handle
   - Use Channels API with `forHandle` parameter
   - Store channel ID in environment variable

2. **API Key Security:**
   - Never expose in client code
   - Only use in Convex HTTP actions
   - Set up domain restrictions in Google Cloud Console

3. **Fallback Strategy:**
   - If YouTube API fails, show cached data
   - Display "Last updated X ago" timestamp
   - Graceful degradation with skeleton loading

4. **Testing:**
   - Mock YouTube API responses for tests
   - Test effect calculations independently
   - E2E test video playback

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 5: Videos | 1-2 days | YouTube API key |
| Phase 6: UI/UX | 2-3 days | Phase 5 complete |
| Phase 7: Performance | 1 day | Phases 5-6 complete |

**Total: 4-6 days of development**
