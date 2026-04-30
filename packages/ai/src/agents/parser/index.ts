import { invokeLLMWithStructure } from "@/llm";
import { ParsedIdeaSchema, type ParsedIdea } from "@/graph/schemas";

import { PARSER_PROMPT } from "./prompt";

export async function runParser(rawIdea: string): Promise<ParsedIdea> {
  return invokeLLMWithStructure({
    schema: ParsedIdeaSchema,
    messages: [
      { role: "system", content: PARSER_PROMPT },
      { role: "user", content: rawIdea },
    ],
  });
}
