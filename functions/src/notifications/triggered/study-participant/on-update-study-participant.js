const { firestore } = require("admin");
const { getDocument } = require("utils");
const { RESEARCHER_CHANGED_PARTICIPANT_STATUS } = require("../../__utils__/notification-codes");

const sendNotification = require("../../__utils__/send-notification");

module.exports = async (change, context) => {
  const before = change.before.data();
  const after = change.after.data();

  const hasStatusChanged = before.status !== after.status;

  if (hasStatusChanged) {
    const participant = await getDocument(firestore.collection("participants").doc(context.params));

    const notificationDetails = {
      code: RESEARCHER_CHANGED_PARTICIPANT_STATUS,
      link: `https://studyfind.org/your-studies`,
      title: "New Participant Enrolled",
      description: `Your status for study ${context.params.studyID} has changed from ${before.status} to ${after.status}`,
    };

    sendNotification(participant, "participant", notificationDetails);
  }
};
