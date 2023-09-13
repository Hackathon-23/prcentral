import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import commentTemplate from "./adaptiveCards/comment-pr.json";
import { notificationApp } from "./internal/initialize";
import { analyzeSentiment } from "./internal/analyzeSentiment";

const CommentEventEntryPoint = async (res, req) => {
  const { resource } = req.body;
  const { pullRequest, comment } = resource;

  // For now: Find the member who created the PR and make sure it's not the same person who left the comment
  const member = await notificationApp.notification.findMember(
    async (m) =>
      m.account.email === pullRequest.createdBy.uniqueName &&
      pullRequest.createdBy.uniqueName !== comment.author.uniqueName
  );

  let emoji = "🧐";

  try {
    const sentiment = (
      await analyzeSentiment(req.body.resource.comment.content)
    ).choices[0].message.content;
    console.log("TRYING ....", sentiment);

    if (!sentiment) {
    } else if (sentiment.toLowerCase().includes("positive")) {
      emoji = "😄";
    } else if (sentiment.toLowerCase().includes("negative")) {
      emoji = "😡";
    } else if (sentiment.toLowerCase().includes("neutral")) {
      emoji = "😐";
    }
  } catch (e) {
    console.log("An error occurred while generating sentiment.");
  }

  if (member) {
    await member.sendAdaptiveCard(
      AdaptiveCards.declare<any>(commentTemplate).render({
        ...req.body,
        message: { ...req.body.message, emoji },
      })
    );
  }
  return res.status(200).send("Comment Notification Sent");
};

export default CommentEventEntryPoint;
