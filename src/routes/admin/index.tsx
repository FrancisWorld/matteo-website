import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { Ban, FileText, Trash2, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { PixelButton } from "@/components/pixel/PixelButton";
import { PixelCard } from "@/components/pixel/PixelCard";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/admin/")({
	component: AdminDashboard,
});

function AdminDashboard() {
	const [activeTab, setActiveTab] = useState<"users" | "content">("users");

	return (
		<div className="space-y-8">
			<div className="flex gap-4 border-b-4 border-muted pb-4">
				<TabButton
					label="USERS"
					icon={<Users size={16} />}
					isActive={activeTab === "users"}
					onClick={() => setActiveTab("users")}
				/>
				<TabButton
					label="CONTENT"
					icon={<FileText size={16} />}
					isActive={activeTab === "content"}
					onClick={() => setActiveTab("content")}
				/>
			</div>

			<AnimatePresence mode="wait">
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.2 }}
				>
					{activeTab === "users" ? <UsersList /> : <ContentList />}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

function TabButton({
	label,
	icon,
	isActive,
	onClick,
}: {
	label: string;
	icon: React.ReactNode;
	isActive: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-2 px-4 py-2 font-pixel transition-colors relative ${
				isActive
					? "text-primary"
					: "text-muted-foreground hover:text-foreground"
			}`}
		>
			{icon}
			{label}
			{isActive && (
				<motion.div
					layoutId="admin-tab"
					className="absolute bottom-[-18px] left-0 right-0 h-4 bg-primary"
				/>
			)}
		</button>
	);
}

function UsersList() {
	const users = useQuery(api.admin.listUsers);
	const banUser = useMutation(api.admin.banUser);

	if (!users) return <div className="font-pixel">LOADING USERS...</div>;

	return (
		<div className="space-y-4">
			{users.map((user: any) => (
				<PixelCard
					key={user._id}
					className="flex justify-between items-center p-4"
				>
					<div className="flex items-center gap-4">
						{user.image && (
							<img
								src={user.image}
								alt={user.name}
								className="w-10 h-10 rounded-none border-2 border-foreground"
							/>
						)}
						<div>
							<div className="font-pixel">{user.name}</div>
							<div className="text-xs text-muted-foreground font-body">
								{user.email}
							</div>
						</div>
						{user.role && (
							<span className="px-2 py-1 text-xs font-pixel bg-muted border border-foreground">
								{user.role.toUpperCase()}
							</span>
						)}
					</div>
					<div className="flex gap-2">
						{user.role !== "banned" && user.role !== "admin" && (
							<PixelButton
								size="sm"
								variant="destructive"
								onClick={async () => {
									if (confirm("Are you sure you want to ban this user?")) {
										await banUser({ userId: user._id });
									}
								}}
							>
								<Ban size={16} className="mr-1" /> BAN
							</PixelButton>
						)}
					</div>
				</PixelCard>
			))}
		</div>
	);
}

function ContentList() {
	const posts = useQuery(api.posts.list, { limit: 50 });
	const quizzes = useQuery(api.quizzes.list, { limit: 50 });
	const deletePost = useMutation(api.admin.deletePost);
	const deleteQuiz = useMutation(api.admin.deleteQuiz);

	if (!posts || !quizzes)
		return <div className="font-pixel">LOADING CONTENT...</div>;

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-2xl font-pixel mb-4">BLOG POSTS</h2>
				<div className="space-y-4">
					{posts.map((post: any) => (
						<PixelCard
							key={post._id}
							className="flex justify-between items-center p-4"
						>
							<div>
								<div className="font-pixel">{post.title}</div>
								<div className="text-xs text-muted-foreground font-body">
									By {post.authorName} •{" "}
									{new Date(post.publishedAt).toLocaleDateString()}
								</div>
							</div>
							<PixelButton
								size="sm"
								variant="destructive"
								onClick={async () => {
									if (confirm("Delete this post?")) {
										await deletePost({ postId: post._id });
									}
								}}
							>
								<Trash2 size={16} />
							</PixelButton>
						</PixelCard>
					))}
				</div>
			</div>

			<div>
				<h2 className="text-2xl font-pixel mb-4">QUIZZES</h2>
				<div className="space-y-4">
					{quizzes.map((quiz: any) => (
						<PixelCard
							key={quiz._id}
							className="flex justify-between items-center p-4"
						>
							<div>
								<div className="font-pixel">{quiz.title}</div>
								<div className="text-xs text-muted-foreground font-body">
									{quiz.difficulty?.toUpperCase()} • {quiz.questions.length}{" "}
									Questions
								</div>
							</div>
							<PixelButton
								size="sm"
								variant="destructive"
								onClick={async () => {
									if (confirm("Delete this quiz?")) {
										await deleteQuiz({ quizId: quiz._id });
									}
								}}
							>
								<Trash2 size={16} />
							</PixelButton>
						</PixelCard>
					))}
				</div>
			</div>
		</div>
	);
}
