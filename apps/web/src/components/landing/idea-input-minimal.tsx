"use client";

import {
	ArrowPathIcon,
	ArrowUpIcon,
	PaperClipIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
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
	const [files, setFiles] = useState<File[]>([]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

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

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files;
		if (!selected) return;
		setFiles((prev) => [...prev, ...Array.from(selected)]);
		e.target.value = "";
	};

	const removeFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
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
					rows={4}
					disabled={isRunning || isPendingAuth}
					className="resize-none border-0 bg-transparent px-5 pt-5 pb-2 text-[15px] text-foreground shadow-none placeholder:text-foreground/35 focus-visible:ring-0 focus-visible:ring-offset-0"
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSubmit();
						}
					}}
					aria-label="Describe your idea"
				/>

				{files.length > 0 && (
					<div className="flex flex-wrap gap-1.5 px-5 pb-2">
						{files.map((file, i) => (
							<span
								key={`${file.name}-${i}`}
								className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2 py-1 font-mono text-[11px] text-foreground/70"
							>
								<PaperClipIcon className="h-3 w-3" />
								<span className="max-w-[140px] truncate">{file.name}</span>
								<button
									type="button"
									onClick={() => removeFile(i)}
									className="text-foreground/40 hover:text-foreground"
									aria-label={`Remove ${file.name}`}
								>
									<XMarkIcon className="h-3 w-3" />
								</button>
							</span>
						))}
					</div>
				)}

				<div className="flex items-center justify-between px-3 pb-3">
					<div className="flex items-center gap-1">
						<input
							ref={fileInputRef}
							type="file"
							className="hidden"
							multiple
							onChange={handleFileSelect}
							accept=".pdf,.txt,.md,.doc,.docx"
							aria-label="Attach files"
						/>
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={isRunning || isPendingAuth}
							className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground/50 transition-colors hover:bg-secondary/60 hover:text-foreground disabled:opacity-40"
							aria-label="Attach a document"
						>
							<PaperClipIcon className="h-4 w-4" />
						</button>
					</div>

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
