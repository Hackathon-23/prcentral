
import { ActivityHandler } from "botbuilder";
import { rephraseMessage } from "./internal/analyzeSentiment";

// An empty teams activity handler.
// You can add your customization code here to extend your bot logic if needed.
export class TeamsBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      console.log("The message context", JSON.stringify(context.activity.value, null, 2));
      const rephrased = await rephraseMessage(context.activity.value.value);

      console.log("after rephrasing", JSON.stringify(rephrased, null,2));
    })
  }   
}
