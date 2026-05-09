import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const analyses = pgTable("analyses", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	rawIdea: text("raw_idea").notNull(),
	parsedIdea: jsonb("parsed_idea"),
	synthesis: jsonb("synthesis"),
	agentData: jsonb("agent_data"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
