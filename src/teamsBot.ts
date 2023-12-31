import { ActivityHandler, CardFactory } from "botbuilder";
import { rephraseComment, translateComment, summarizePrComments } from "./internal/gptActions";


import { pullRequestComments } from "./store";

const resultOutputCard = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => ({
  type: "AdaptiveCard",
  body: [
    {
      type: "TextBlock",
      size: "Medium",
      weight: "Bolder",
      text: title,
      wrap: true,
    },
    {
      type: "Container",
      items: [
        {
          type: "TextBlock",
          text: content,
          wrap: true,
          separator: true,
        },
      ],
      style: "emphasis",
    },
    {
      type: "TextBlock",
      horizontalAlignment: "Left",
      color: "Warning",
      text: "⚠️ This AI-generated response may contain inaccuracies",
      wrap: true,
      size: "Small",
      weight: "Lighter",
    },
  ],
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.6",
});

// An empty teams activity handler.
// You can add your customization code here to extend your bot logic if needed.
export class TeamsBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      switch (context.activity.value.event) {
        case "rephrase":
          const title = "Rephrasing is complete ✅";
          const rephrased = await rephraseComment(context.activity.value.value);
          const rephrasedContent = rephrased.choices[0].message.content;
          const card = CardFactory.adaptiveCard(
            resultOutputCard({ title, content: rephrasedContent })
          );
          await context.sendActivity({ attachments: [card] });
          next();
          break;

        case "translate":
          const translation = await translateComment(context.activity.value.value);
          try {
            const title = "Translation is complete ✅"
            const translatedContent = translation.choices[0].message.content;
            const card = CardFactory.adaptiveCard(
              resultOutputCard({ title, content: translatedContent })
            );
            await context.sendActivity({ attachments: [card] });
            next();
          } catch (e) {
            console.error("An error occurred while generating the translations", e);
          }
          break;

        case "summary":
          try {
            const title = `Summarization of Pull Request #${context.activity.value.value} comments is complete ✅`;
            const pr = pullRequestComments[context.activity.value.value]
            const mappedComments = pr.map((comment, index) => `${index + 1}. ${comment.author} commented ${comment.comment}`).join("\n");
            const summary = await summarizePrComments(mappedComments);
            const content = summary.choices[0].message.content;
            const card = CardFactory.adaptiveCard(
              resultOutputCard({ title, content })
            );
            await context.sendActivity({ attachments: [card] });
            next();
          } catch (e) {
            console.error("An error occurred while generating the summary", e);
          }
          break;
        case "suggest":
          break;
        default:
          next();
      }
    });
  }
}
