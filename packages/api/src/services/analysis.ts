import { db } from "@lens/db";
import { analyses } from "@lens/db/schema/analyses";
import { eq, sql } from "drizzle-orm";

export async function createAnalysis(params: {
	userId: string;
	rawIdea: string;
}): Promise<string> {
	const id = crypto.randomUUID();
	await db.insert(analyses).values({
		id,
		userId: params.userId,
		rawIdea: params.rawIdea,
		agentData: {},
	});
	return id;
}

export async function patchAnalysis(
	id: string,
	patch: {
		parsedIdea?: unknown;
		synthesis?: unknown;
		agentData?: { name: string; data: unknown };
	},
): Promise<void> {
	const updates: Record<string, unknown> = {};

	if (patch.parsedIdea !== undefined) updates.parsedIdea = patch.parsedIdea;
	if (patch.synthesis !== undefined) updates.synthesis = patch.synthesis;
	if (patch.agentData) {
		updates.agentData = sql`jsonb_set(coalesce(${analyses.agentData}, '{}'::jsonb), ARRAY[${patch.agentData.name}], ${JSON.stringify(patch.agentData.data)}::jsonb, true)`;
	}

	if (Object.keys(updates).length === 0) return;

	await db.update(analyses).set(updates).where(eq(analyses.id, id));
}

export async function deleteAnalysis(id: string): Promise<void> {
	await db.delete(analyses).where(eq(analyses.id, id));
}
