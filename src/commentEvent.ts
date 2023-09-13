import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import commentTemplate from "./adaptiveCards/comment-pr.json";
import { notificationApp } from "./internal/initialize";

const CommentEventEntryPoint = async (res, req) => {
    const { resource } = req.body;
    const { pullRequest, comment } = resource;

    // For now: Find the member who created the PR and make sure it's not the same person who left the comment
    const member = await notificationApp.notification.findMember(
      async (m) =>
        m.account.email === pullRequest.createdBy.uniqueName &&
        pullRequest.createdBy.uniqueName !== comment.author.uniqueName
    );

    if (member) {
      await member.sendAdaptiveCard(
        AdaptiveCards.declare<any>(commentTemplate).render(req.body)
      );
    }
    return res.status(200).send("Comment Notification Sent");
}

export default CommentEventEntryPoint;