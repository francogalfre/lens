"use client";

import { ArrowPathIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@lens/ui/components/textarea";
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

	const canSubmit = idea.trim().length > 0 && !isRunning && !isPendingAuth;

	return (
		<div
			className={`relative w-full min-w-0 transition-opacity duration-500 ${className ?? ""} ${isRunning ? "opacity-60" : "opacity-100"}`}
		>
			<div className="group relative w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card/40 shadow-[0_1px_0_0_rgba(0,0,0,0.02)] backdrop-blur-sm transition-all duration-300 focus-within:border-foreground/25 focus-within:bg-card/60 focus-within:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] dark:focus-within:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.4)]">
				<Textarea
					ref={textareaRef}
					value={idea}
					onChange={(e) => setIdea(e.target.value)}
					placeholder="Describe an idea, a product, a problem worth solving…"
					rows={6}
					disabled={isRunning || isPendingAuth}
					className="w-full resize-none border-0 bg-transparent px-5 pt-5 pb-3 text-base text-foreground shadow-none placeholder:text-foreground/35 focus-visible:ring-0 focus-visible:ring-offset-0"
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSubmit();
						}
					}}
					aria-label="Describe your idea"
				/>

				<div className="flex items-center justify-end px-3 pb-3">
					<button
						type="button"
						onClick={handleSubmit}
						disabled={!canSubmit}
						className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background transition-all duration-200 hover:scale-[1.04] hover:bg-foreground/90 disabled:scale-100 disabled:bg-foreground/20 disabled:text-foreground/40"
						aria-label="Submit idea"
					>
						{isRunning ? (
							<ArrowPathIcon className="h-4 w-4 animate-spin" />
						) : (
							<ArrowUpIcon className="h-4 w-4" strokeWidth={2.5} />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
