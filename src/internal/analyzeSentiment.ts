import { env } from "process";
import { client } from "../openAiClient";

export async function analyzeSentiment(textToAnalyze: string) {
  if (!client) {
    return null;
  }
  const completion = await client().getChatCompletions("gpt-35-turbo-16k", [
    {
      content: `Reply with either positive or negative with regards to this sentiment:'${textToAnalyze}'`,
      role: "assistant",
    },
  ]);
  return completion;
}
