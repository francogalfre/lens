import { analysisGraph } from "../ai/src/graph/index";

const stream = await analysisGraph.stream(
  {
    rawIdea:
      "Una app que usa IA para resumir reuniones de Zoom automáticamente",
  },
  { streamMode: "values" },
);

for await (const event of stream) {
  const [nodeName, update] = Object.entries(event)[0];
  console.log(`✓ ${nodeName} completado`, update.completedAgents ?? "");
}
