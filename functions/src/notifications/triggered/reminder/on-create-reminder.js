const { auth } = require("admin");
const { RESEARCHER_CREATED_REMINDER } = require("../../__utils__/notification-codes");
const { getParticipant, addParticipantNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot) => {
  const reminder = snapshot.data();
  const { participantID, studyID, title } = reminder;

  const participant = await getParticipant(participantID);

  if (participant?.notifications?.email) {
    const user = await auth.getUser(participantID);
    const participantEmail = user.email;
    await sendEmail(participantEmail, "Create reminder subject", "Create reminder text");
  }

  return addParticipantNotification(
    participantID,
    RESEARCHER_CREATED_REMINDER,
    "New Reminder",
    `The researcher of study ${studyID} has set up a weekly reminder for you called ${title}.`,
    `/mystudies/${studyID}/reminders`
  );
};
