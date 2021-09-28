const { auth } = require("admin");
const { RESEARCHER_CHANGED_PARTICIPANT_STATUS } = require("../../__utils__/notification-codes");
const { getParticipant, addParticipantNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");
const sendPhone = require("../../__utils__/send-phone");

module.exports = async (change, context) => {
  const before = change.before.get("status");
  const after = change.after.get("status");
  if (before === after) return undefined;
  const { studyID, participantID } = context.params;
  const participant = await getParticipant(participantID);

  const subject = "Researcher Changed Participant Status!";
  const text = `Your status in study ${studyID} is now ${after}`;

  if (participant?.notifications?.email) {
    const user = await auth.getUser(participantID);
    const participantEmail = user.email;
    await sendEmail(
      participantEmail,
      subject,
      `${text}: ${`https://studyfind.org/mystudies/${studyID}/`}\n To unsubscribe from these notifications, please visit: https://studyfind.org/account/notifications/`
    );
  }

  if (participant?.notifications?.phone) {
    const participantPhone = participant.phone;
    participantPhone &&
      /\d\d\d\d\d\d\d\d\d\d/.test(participantPhone) &&
      (await sendPhone(
        `+1${participantPhone}`,
        `${text}: ${`https://studyfind.org/mystudies/${studyID}/`}\n To unsubscribe visit: https://studyfind.org/account/notifications/`
      ));
  }

  return addParticipantNotification(
    participantID,
    RESEARCHER_CHANGED_PARTICIPANT_STATUS,
    subject,
    text,
    `/mystudies/${studyID}/`
  );
};
