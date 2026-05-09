"use client";

import { Button } from "@lens/ui/components/button";
import { Textarea } from "@lens/ui/components/textarea";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IdeaInputProps {
	onSubmit: (idea: string) => void;
	isRunning: boolean;
	isPendingAuth: boolean;
}

export function IdeaInput({
	onSubmit,
	isRunning,
	isPendingAuth,
}: IdeaInputProps) {
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
			className={`relative transition-all duration-500 ${isRunning ? "opacity-60" : "opacity-100"}`}
		>
			<div
				className={`relative overflow-hidden rounded-2xl border bg-background transition-all duration-300 ${
					isRunning
						? "border-muted-foreground/20"
						: "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 hover:border-muted-foreground/30"
				}`}
			>
				<Textarea
					ref={textareaRef}
					value={idea}
					onChange={(e) => setIdea(e.target.value)}
					placeholder="e.g. An app that uses AI to summarize Zoom meetings automatically..."
					rows={isRunning ? 2 : 5}
					disabled={isRunning || isPendingAuth}
					className="resize-none border-0 bg-transparent p-4 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSubmit();
						}
					}}
					aria-label="Describe your idea"
					aria-describedby="input-hint"
				/>

				<div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
					<span
						id="input-hint"
						className="font-mono text-muted-foreground text-xs"
					>
						{isRunning ? "Analysis in progress…" : "Shift + Enter for new line"}
					</span>
					<Button
						onClick={handleSubmit}
						disabled={isRunning || !idea.trim() || isPendingAuth}
						size="sm"
						className="gap-2"
					>
						{isRunning ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Analyzing
							</>
						) : (
							<>
								<Send className="h-4 w-4" />
								Analyze
							</>
						)}
					</Button>
				</div>
			</div>

			{isRunning && (
				<div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/50 backdrop-blur-sm">
					<div className="flex items-center gap-3 rounded-full bg-card px-4 py-2 shadow-lg">
						<span className="relative flex h-3 w-3">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
							<span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
						</span>
						<span className="font-medium text-sm">
							AI Agents are working...
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
