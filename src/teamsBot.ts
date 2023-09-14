
import { ActivityHandler } from "botbuilder";
import { rephraseComment, translateComment } from "./internal/gptActions";

// An empty teams activity handler.
// You can add your customization code here to extend your bot logic if needed.
export class TeamsBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      console.log(context.activity.value.event, "Context");
      switch (context.activity.value.event) {
        case "rephrase":
          const rephrased = await rephraseComment(context.activity.value.value);
          context.sendActivity(rephrased.choices[0].message.content);
          next();
          break;

        case "translate":
          const translation = await translateComment(context.activity.value.value);
          //context.sendActivity(translation);
          next();
          break;
        case "summarize":
          break;
        case "suggest":
          break;
        default:
          next();
      }
    });
  }
}