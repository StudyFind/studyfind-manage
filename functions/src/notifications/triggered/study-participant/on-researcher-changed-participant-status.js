const { auth } = require("admin");
const { RESEARCHER_CHANGED_PARTICIPANT_STATUS } = require("../../__utils__/notification-codes");
const { getParticipant, addParticipantNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (change, context) => {
  const before = change.before.get("status");
  const after = change.after.get("status");
  if (before === after) return undefined;
  const { studyID, participantID } = context.params;

  const participant = await getParticipant(participantID);

  if (participant?.notifications?.email) {
    const user = await auth.getUser(participantID);
    const participantEmail = user.email;
    await sendEmail(
      participantEmail,
      "Researcher changed participant status subject",
      "Researcher changed participant status text"
    );
  }

  return addParticipantNotification(
    participantID,
    RESEARCHER_CHANGED_PARTICIPANT_STATUS,
    "Study participant status changed",
    `Your status for study ${studyID} has changed from ${before} to ${after}.`,
    `/mystudies/${studyID}/`
  );
};
