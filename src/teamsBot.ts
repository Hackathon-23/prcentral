import { ActivityHandler } from "botbuilder";

// An empty teams activity handler.
// You can add your customization code here to extend your bot logic if needed.
export class TeamsBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      console.log("The message context", context.activity);
      console.log("The message context", context.activity.type);
    })
  }
}
