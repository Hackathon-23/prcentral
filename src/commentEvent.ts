import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import commentTemplate from "./adaptiveCards/comment-pr.json";
import { notificationApp } from "./internal/initialize";
import { analyzeSentiment, rephraseComment } from "./internal/gptActions";
import { url } from "inspector";

export const CommentEventEntryPoint = async (res, req) => {
  const { resource } = req.body;
  const { pullRequest, comment } = resource;

  // For now: Find the member who created the PR and make sure it's not the same person who left the comment
  const member = await notificationApp.notification.findMember(
    async (m) =>
      m.account.email === pullRequest.createdBy.uniqueName
    //&& pullRequest.createdBy.uniqueName !== comment.author.uniqueName
  );

  console.log("members"+member);
  
  

  let emoji = "🧐";
  let commentScroll = Date.parse(req.body.resource.comment.publishedDate)/1000;
  let newCommentUrlTimestamp= commentScroll.toFixed();
  

    const sentiment = (
      await analyzeSentiment(req.body.resource.comment.content)
    ).choices[0].message.content;

    if (!sentiment) {
    } else if (sentiment.toLowerCase().includes("positive")) {
      emoji = "😄";
    } else if (sentiment.toLowerCase().includes("negative")) {
      emoji = "😡";
    } else if (sentiment.toLowerCase().includes("neutral")) {
      emoji = "😐";
    }
  
  const baseUrl =  req.body.resource.pullRequest.repository.remoteUrl.split("@"); 
  const newUrl = 'https://'+baseUrl[1]+'/pullrequest/'+req.body.resource.pullRequest.pullRequestId+'#'+newCommentUrlTimestamp;

  if (member) {
    sendAdaptiveCardMethod(member,req, req.body.message, emoji, newUrl);
  }

  if(comment.author.uniqueName && sentiment && sentiment.toLowerCase().includes("negative")){
    const phrased = rephraseComment(req.body.message);
    const feedback = "Hey"+ comment.author.uniqueName +", you left a comment on " + pullRequest.createdBy.uniqueName + " PR and it was abit harsh. This is how you can make it better." + phrased;
    sendAdaptiveCardMethod(comment.author.uniqueName,req, feedback, emoji, newUrl);
   
  }
  return res.status(200).send("Comment Notification Sent");
};

export const sendAdaptiveCardMethod = async (user:any, req: any, comment:string, emoji:any, newUrl: string) => {

  await user.sendAdaptiveCard(
    AdaptiveCards.declare<any>(commentTemplate).render({
      ...req.body,
      message: { comment, emoji },
      commentUrl: newUrl
    })
  );


}

//export default CommentEventEntryPoint;
