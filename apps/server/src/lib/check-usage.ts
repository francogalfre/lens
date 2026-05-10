import { db } from "@lens/db";
import { dailyUsage } from "@lens/db/schema/daily_usage";
import { subscriptions } from "@lens/db/schema/subscriptions";
import { and, eq, sql } from "drizzle-orm";

const FREE_LIMIT = 1;
const PREMIUM_LIMIT = 3;

export type UsageCheckResult =
	| { allowed: true; count: number; limit: number }
	| { allowed: false; count: number; limit: number };

export async function checkAndIncrementUsage(
	userId: string,
): Promise<UsageCheckResult> {
	const activeSub = await db
		.select({ id: subscriptions.id })
		.from(subscriptions)
		.where(
			and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")),
		)
		.limit(1);

	const limit = activeSub.length > 0 ? PREMIUM_LIMIT : FREE_LIMIT;
	const date = new Date().toISOString().slice(0, 10);

	const result = await db.execute<{ count: number }>(sql`
		INSERT INTO daily_usage (id, user_id, date, count, created_at)
		VALUES (${crypto.randomUUID()}, ${userId}, ${date}, 1, NOW())
		ON CONFLICT (user_id, date)
		DO UPDATE SET count = daily_usage.count + 1
		WHERE daily_usage.count < ${limit}
		RETURNING count
	`);

	if (result.rows.length === 0) {
		const current = await db
			.select({ count: dailyUsage.count })
			.from(dailyUsage)
			.where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.date, date)))
			.limit(1);

		return { allowed: false, count: current[0]?.count ?? limit, limit };
	}

	return { allowed: true, count: result.rows[0]?.count ?? 1, limit };
}
