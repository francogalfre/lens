import { useCallback, useState } from "react";
import { toast } from "sonner";

import type { AnalysisData } from "@/types/analysis";

export function useExportPdf() {
	const [isExporting, setIsExporting] = useState(false);

	const exportToPdf = useCallback(
		async (analysis: AnalysisData) => {
			if (isExporting) return;
			setIsExporting(true);

			try {
				const jsPDFModule = await import("jspdf");
				const jsPDF = jsPDFModule.default;

				const doc = new jsPDF({
					orientation: "portrait",
					unit: "mm",
					format: "a4",
				});

				const pageWidth = 210;
				const pageHeight = 297;
				const margin = 20;
				const contentWidth = pageWidth - margin * 2;
				let y = margin;

				const colors = {
					foreground: "#111111",
					mutedForeground: "#6b7280",
					accent: "#f3f4f6",
					border: "#e5e7eb",
				};

				const cleanText = (text: string): string => {
					if (!text) return "";

					return text
						.replace(/\p{Cc}/gu, "")
						.replace(/\u00AD/g, "")
						.replace(/[\u200B-\u200D\uFEFF]/g, "")
						.replace(/—/g, "-")
						.replace(/–/g, "-")
						.replace(/"/g, '"')
						.replace(/"/g, '"')
						.replace(/'/g, "'")
						.replace(/'/g, "'")
						.replace(/\s+/g, " ")
						.trim();
				};

				const checkPageBreak = (needed: number) => {
					if (y + needed > pageHeight - margin) {
						doc.addPage();
						y = margin;
					}
				};

				const writeText = (
					text: string,
					fontSize: number,
					isBold = false,
					textColor?: string,
				) => {
					doc.setFontSize(fontSize);
					doc.setFont("helvetica", isBold ? "bold" : "normal");
					doc.setTextColor(textColor ?? colors.foreground);
					const lines = doc.splitTextToSize(cleanText(text), contentWidth);
					doc.text(lines, margin, y);
					y += lines.length * 5 + 4;
				};

				const writeSectionTitle = (title: string, spaceBefore = 15) => {
					y += spaceBefore;
					checkPageBreak(30);
					doc.setDrawColor(colors.border);
					doc.line(margin, y, pageWidth - margin, y);
					y += 8;
					doc.setFontSize(12);
					doc.setFont("helvetica", "bold");
					doc.setTextColor(colors.foreground);
					doc.text(title, margin, y);
					y += 8;
				};

				const writeField = (label: string, value: string) => {
					checkPageBreak(15);
					doc.setFontSize(9);
					doc.setFont("helvetica", "bold");
					doc.setTextColor(colors.mutedForeground);
					doc.text(label.toUpperCase(), margin, y);
					y += 4;
					writeText(value, 10);
				};

				const writeList = (title: string, items: string[]) => {
					checkPageBreak(20);
					doc.setFontSize(9);
					doc.setFont("helvetica", "bold");
					doc.setTextColor(colors.mutedForeground);
					doc.text(title.toUpperCase(), margin, y);
					y += 4;

					items.forEach((item) => {
						checkPageBreak(8);
						doc.setFontSize(9);
						doc.setFont("helvetica", "normal");
						doc.setTextColor(colors.foreground);
						const lines = doc.splitTextToSize(
							`• ${cleanText(item)}`,
							contentWidth - 6,
						);
						doc.text(lines, margin + 2, y);
						y += lines.length * 5;
					});
					y += 4;
				};

				doc.setFont("helvetica", "normal");

				doc.setFontSize(24);
				doc.setFont("helvetica", "bold");
				doc.setTextColor(colors.foreground);
				doc.text("LENS", margin, y);
				y += 8;

				doc.setFontSize(9);
				doc.setFont("helvetica", "normal");
				doc.setTextColor(colors.mutedForeground);
				doc.text("AI-Powered Startup Idea Analysis", margin, y);
				y += 10;

				doc.setDrawColor(colors.border);
				doc.line(margin, y, pageWidth - margin, y);
				y += 12;

				checkPageBreak(30);
				doc.setFontSize(12);
				doc.setFont("helvetica", "bold");
				doc.setTextColor(colors.foreground);
				doc.text("ORIGINAL IDEA", margin, y);
				y += 8;

				doc.setFillColor(colors.accent);
				doc.rect(margin, y, contentWidth, 20, "F");
				doc.setFontSize(10);
				doc.setFont("helvetica", "normal");
				doc.setTextColor(colors.foreground);
				const ideaLines = doc.splitTextToSize(
					cleanText(analysis.rawIdea),
					contentWidth - 6,
				);
				doc.text(ideaLines, margin + 3, y + 6);
				y += 28;

				if (analysis.parsedIdea) {
					writeSectionTitle("PARSED IDEA", 0);
					const p = analysis.parsedIdea;
					if (p.problem) writeField("Problem", p.problem);
					if (p.solution) writeField("Solution", p.solution);
					if (p.targetAudience) writeField("Target", p.targetAudience);
					if (p.techDomain) writeField("Domain", p.techDomain);
					if (p.category) writeField("Category", p.category);
				}

				if (analysis.research) {
					writeSectionTitle("MARKET RESEARCH");

					if (analysis.research.marketContext) {
						checkPageBreak(20);
						doc.setFontSize(9);
						doc.setFont("helvetica", "bold");
						doc.setTextColor(colors.mutedForeground);
						doc.text("CONTEXT", margin, y);
						y += 4;
						writeText(analysis.research.marketContext, 10);
					}

					if (analysis.research.competitors?.length) {
						checkPageBreak(20);
						doc.setFontSize(9);
						doc.setFont("helvetica", "bold");
						doc.setTextColor(colors.mutedForeground);
						doc.text("COMPETITORS", margin, y);
						y += 5;

						analysis.research.competitors.forEach((c) => {
							checkPageBreak(12);
							doc.setFontSize(10);
							doc.setFont("helvetica", "bold");
							doc.setTextColor(colors.foreground);
							doc.text(cleanText(c.name || "—"), margin, y);
							y += 4;

							if (c.description) {
								doc.setFontSize(9);
								doc.setFont("helvetica", "normal");
								doc.setTextColor(colors.mutedForeground);
								const descLines = doc.splitTextToSize(
									cleanText(c.description),
									contentWidth,
								);
								doc.text(descLines, margin, y);
								y += descLines.length * 4;
							}
							y += 4;
						});
					}

					if (analysis.research.opportunities?.length) {
						writeList("Opportunities", analysis.research.opportunities);
					}
				}

				if (analysis.critique) {
					writeSectionTitle("CRITIQUE");

					if (analysis.critique.weaknesses?.length) {
						writeList("Weaknesses", analysis.critique.weaknesses);
					}
					if (analysis.critique.risks?.length) {
						writeList("Risks", analysis.critique.risks);
					}
					if (analysis.critique.deadlyAssumptions?.length) {
						writeList("Assumptions", analysis.critique.deadlyAssumptions);
					}
				}

				if (analysis.opportunities) {
					writeSectionTitle("OPPORTUNITIES");

					if (analysis.opportunities.strengths?.length) {
						writeList("Strengths", analysis.opportunities.strengths);
					}
					if (analysis.opportunities.opportunities?.length) {
						writeList("Opportunities", analysis.opportunities.opportunities);
					}
					if (analysis.opportunities.differentiators?.length) {
						writeList(
							"Differentiators",
							analysis.opportunities.differentiators,
						);
					}
				}

				if (analysis.feasibility) {
					writeSectionTitle("FEASIBILITY");

					if (analysis.feasibility.complexity) {
						writeField("Complexity", analysis.feasibility.complexity);
					}
					if (analysis.feasibility.estimatedTimeline) {
						writeField("Timeline", analysis.feasibility.estimatedTimeline);
					}
					if (analysis.feasibility.techStack?.length) {
						writeField("Tech Stack", analysis.feasibility.techStack.join(", "));
					}
					if (analysis.feasibility.mainChallenges?.length) {
						writeList("Challenges", analysis.feasibility.mainChallenges);
					}
				}

				if (analysis.synthesis) {
					writeSectionTitle("FINAL VERDICT");

					checkPageBreak(30);
					doc.setFillColor(colors.foreground);
					doc.rect(margin, y, 30, 22, "F");
					doc.setTextColor(colors.accent);
					doc.setFontSize(24);
					doc.setFont("helvetica", "bold");
					doc.text(
						analysis.synthesis.overallScore.toFixed(1),
						margin + 15,
						y + 14,
						{
							align: "center",
						},
					);
					doc.setFontSize(7);
					doc.text("SCORE", margin + 15, y + 18, { align: "center" });
					y += 26;

					if (analysis.synthesis.scores) {
						checkPageBreak(20);
						const scores = analysis.synthesis.scores;
						const scoreData = [
							{ label: "MARKET", value: scores.market.toFixed(1) },
							{ label: "DIFF.", value: scores.differentiation.toFixed(1) },
							{ label: "FEAS.", value: scores.feasibility.toFixed(1) },
							{ label: "RISK", value: scores.risk.toFixed(1) },
						];
						const colWidth = contentWidth / 4;
						scoreData.forEach((s, i) => {
							doc.setFillColor(colors.accent);
							doc.rect(margin + i * colWidth, y, colWidth - 2, 12, "F");
							doc.setFontSize(12);
							doc.setFont("helvetica", "bold");
							doc.setTextColor(colors.foreground);
							doc.text(s.value, margin + i * colWidth + colWidth / 2, y + 8, {
								align: "center",
							});
							doc.setFontSize(6);
							doc.setFont("helvetica", "normal");
							doc.setTextColor(colors.mutedForeground);
							doc.text(s.label, margin + i * colWidth + colWidth / 2, y + 10, {
								align: "center",
							});
						});
						y += 16;
					}

					if (analysis.synthesis.verdict) {
						checkPageBreak(20);
						y += 4;
						doc.setFontSize(10);
						doc.setFont("helvetica", "bold");
						doc.setTextColor(colors.foreground);
						doc.text("VERDICT", margin, y);
						y += 5;
						writeText(analysis.synthesis.verdict, 10);
					}

					if (analysis.synthesis.summary) {
						checkPageBreak(20);
						doc.setFontSize(10);
						doc.setFont("helvetica", "bold");
						doc.setTextColor(colors.foreground);
						doc.text("SUMMARY", margin, y);
						y += 5;
						writeText(analysis.synthesis.summary, 9);
					}

					if (analysis.synthesis.topRecommendations?.length) {
						checkPageBreak(30);
						y += 4;
						doc.setFontSize(10);
						doc.setFont("helvetica", "bold");
						doc.setTextColor(colors.foreground);
						doc.text("TOP RECOMMENDATIONS", margin, y);
						y += 6;

						analysis.synthesis.topRecommendations.forEach((r) => {
							checkPageBreak(10);
							doc.setFontSize(9);
							doc.setFont("helvetica", "normal");
							doc.setTextColor(colors.foreground);
							const lines = doc.splitTextToSize(
								`• ${cleanText(r)}`,
								contentWidth - 6,
							);
							doc.text(lines, margin + 2, y);
							y += lines.length * 5 + 2;
						});
					}
				}

				doc.setFontSize(7);
				doc.setTextColor(colors.mutedForeground);
				doc.text("Generated by Lens", pageWidth / 2, pageHeight - 8, {
					align: "center",
				});

				doc.save(`lens-analysis-${Date.now()}.pdf`);
				toast.success("PDF exported successfully");
			} catch (error) {
				console.error("Failed to export PDF:", error);
				toast.error("Failed to export PDF");
			} finally {
				setIsExporting(false);
			}
		},
		[isExporting],
	);

	return { exportToPdf, isExporting };
}
