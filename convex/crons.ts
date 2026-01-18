import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
	"sync-youtube-videos",
	{ hours: 6 },
	internal.youtube.syncVideos,
);

export default crons;
