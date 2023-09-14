import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import mergeRequestTemplate from "./adaptiveCards/merge-request.json";
import { notificationApp } from "./internal/initialize";

const MergeRequestEntryPoint = async (res, req) => {
  const sampleBody = {
    created_by_name: "John Doe",
    submitted_date: "2019-04-14T18:33:12+0800",
    creater_email: "johndoe@contoso.com",
    status: "PASSED",
    description:
      "This is a sample merge request notification This is a sample merge request notification This is a sample merge request notification This is a sample merge request notification",
    status_url: "https://adaptivecards.io/content/pending.png",
    approval_date: "2019-07-15T22:33:12+0800",
    approver: "Peter",
    approver_email: "peter@contoso.com",
    pr_link: "https://adaptivecards.io",
  };

  const { approver } = req.body;
  const member = await notificationApp.notification.findMember(
    async (m) =>
      m.account.email.toLocaleLowerCase() ===
      `${approver}@wc061.onmicrosoft.com`.toLocaleLowerCase()
  );

  if (member) {
    await member.sendAdaptiveCard(
      AdaptiveCards.declare<any>(mergeRequestTemplate).render(sampleBody)
    );
    return res.status(200).send("Merge Request Notification Sent to Approver");
  }

  for (const target of await notificationApp.notification.installations()) {
    await target.sendAdaptiveCard(
      AdaptiveCards.declare<any>(mergeRequestTemplate).render(
        req.body ?? sampleBody
      )
    );
  }
  return res.status(200).send("Merge Request Notification Sent to all users");
};

export default MergeRequestEntryPoint;
