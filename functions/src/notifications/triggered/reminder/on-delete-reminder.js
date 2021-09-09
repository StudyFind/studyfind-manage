const { auth } = require("admin");
const { RESEARCHER_DELETED_REMINDER } = require("../../__utils__/notification-codes");
const { getParticipant, addParticipantNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot) => {
  const reminder = snapshot.data();
  const { participantID, studyID, title } = reminder;

  const participant = await getParticipant(participantID);

  if (participant?.notifications?.email) {
    const user = await auth.getUser(participantID);
    const participantEmail = user.email;
    await sendEmail(participantEmail, "Delete reminder subject", "Delete reminder text");
  }

  return addParticipantNotification(
    participantID,
    RESEARCHER_DELETED_REMINDER,
    "Reminder Deleted",
    `The researcher of study ${studyID} has deleted your weekly reminder called ${title}.`,
    `/mystudies/${studyID}/reminders`
  );
};
