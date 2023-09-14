import { client } from "../openAiClient";

export async function analyzeSentiment(textToAnalyze: string) {
  if (!client) {
    return null;
  }
  const completion = await client().getChatCompletions("gpt-35-turbo-16k", [
    {
      content: `Reply with either positive, negative or neutral with regards to this sentiment:'${textToAnalyze}'`,
      role: "assistant",
    },
  ]);
  return completion;
}

export async function rephraseComment(textToAnalyze: string) {
  if (!client) {
    return null;
  }
  const completion = await client().getChatCompletions("gpt-35-turbo-16k", [{ content: `Rephrase this text:'${textToAnalyze}'`, role: 'assistant' }]);
  return completion;
}

export async function translateComment(textToAnalyze: string) {
  if (!client) {
    return null;
  }
  const completion = await client().getChatCompletions("gpt-35-turbo-16k", [{ content: `Translate this text to Swahili:'${textToAnalyze}'`, role: 'assistant' }]);
  return completion;

};



export async function summarizePrComments(prComments: string) {
  if (!client) {
    return null;
  }
  const completion = await client().getChatCompletions("gpt-35-turbo-16k", [{ content: `Summarize these comments into different paragraphs by author:'${prComments}'`, role: 'assistant' }]);
  return completion;
}


