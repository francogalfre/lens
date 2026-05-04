import { CallbackHandler } from "@langfuse/langchain";
import type { SessionConfig } from "./session";

export function createLangfuseHandler(session: SessionConfig): CallbackHandler {
  const handler = new CallbackHandler({
    sessionId: session.sessionId,
    userId: session.userId,
    tags: session.tags,
  });

  (handler as any).customMetadata = session.metadata;

  return handler;
}
