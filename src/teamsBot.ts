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
      console.log(context.activity.value.event, "Context");
      switch (context.activity.value.event) {
        case "rephrase":
          const title = "Rephrasing is complete ✅";
          const rephrased = await rephraseComment(context.activity.value.value);
          const content = rephrased.choices[0].message.content;
          const card = CardFactory.adaptiveCard(
            resultOutputCard({ title, content })
          );
          context.sendActivity({ attachments: [card] });
          next();
          break;

        case "translate":
          const translation = await translateComment(context.activity.value.value);
          //context.sendActivity(translation);
          next();
          break;
        case "summary":
          const summary = await summarizePrComments(pullRequestComments[context.activity.value.value].join("\n"));
          console.log(summary, 'summary');
          context.sendActivity(summary.choices[0].message.content);
          break;
        case "suggest":
          break;
        default:
          next();
      }
    });
  }
}
