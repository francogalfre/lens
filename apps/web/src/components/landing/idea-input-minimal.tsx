"use client";

import { Button } from "@lens/ui/components/button";
import { Textarea } from "@lens/ui/components/textarea";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IdeaInputMinimalProps {
	onSubmit: (idea: string) => void;
	isRunning: boolean;
	isPendingAuth: boolean;
	className?: string;
}

export function IdeaInputMinimal({
	onSubmit,
	isRunning,
	isPendingAuth,
	className,
}: IdeaInputMinimalProps) {
	const [idea, setIdea] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		const saved = sessionStorage.getItem("pendingIdea");
		if (saved) {
			setIdea(saved);
			sessionStorage.removeItem("pendingIdea");
		}
	}, []);

	useEffect(() => {
		if (isRunning && textareaRef.current) {
			textareaRef.current.blur();
		}
	}, [isRunning]);

	const handleSubmit = () => {
		if (!idea.trim() || isRunning) return;
		onSubmit(idea);
	};

	return (
		<div
			className={`relative w-full min-w-0 transition-all duration-500 ${className ?? ""} ${isRunning ? "opacity-60" : "opacity-100"}`}
		>
			<div
				className={`relative w-full min-w-0 overflow-hidden rounded-xl border bg-black/30 backdrop-blur-sm transition-all duration-300 ${
					isRunning
						? "border-white/5"
						: "border-[rgba(255,62,62,0.15)] focus-within:border-[rgba(255,62,62,0.5)] focus-within:ring-2 focus-within:ring-[rgba(255,62,62,0.15)]"
				}`}
			>
				<Textarea
					ref={textareaRef}
					value={idea}
					onChange={(e) => setIdea(e.target.value)}
					placeholder="Describe your startup idea... (e.g. 'An AI tool that...')"
					rows={6}
					disabled={isRunning || isPendingAuth}
					className="resize-none border-0 bg-transparent p-5 text-base text-white/90 shadow-none placeholder:text-white/25 focus-visible:ring-0 focus-visible:ring-offset-0"
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSubmit();
						}
					}}
					aria-label="Describe your idea"
				/>

				<div className="flex items-center justify-end border-white/[0.03] border-t px-4 py-3">
					<Button
						onClick={handleSubmit}
						disabled={isRunning || !idea.trim() || isPendingAuth}
						className="bg-[#FF3E3E] px-5 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E63535]"
					>
						{isRunning ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Analyzing
							</>
						) : (
							<>
								Analyze
								<Send className="ml-1 h-4 w-4" />
							</>
						)}
					</Button>
				</div>
			</div>

			{isRunning && (
				<div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-sm">
					<div className="flex items-center gap-3 rounded-full border border-white/[0.05] bg-black/60 px-4 py-2 shadow-lg">
						<span className="relative flex h-3 w-3">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF3E3E] opacity-75" />
							<span className="relative inline-flex h-3 w-3 rounded-full bg-[#FF3E3E]" />
						</span>
						<span className="font-medium text-sm text-white">
							AI Agents are working...
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
