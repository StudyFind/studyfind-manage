const { auth } = require("admin");
const { RESEARCHER_DELETED_REMINDER } = require("../../__utils__/notification-codes");
const { getParticipant, addParticipantNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");
const sendPhone = require("../../__utils__/send-phone");

module.exports = async (snapshot) => {
  const reminder = snapshot.data();
  const { participantID, researcherID, title } = reminder;
  const participant = await getParticipant(participantID);
  const researcherUser = await auth.getUser(researcherID);

  const subject = "Researcher Deleted Reminder";
  const text = `${researcherUser.displayName} has deleted your weekly reminder called ${title}.`;

  if (participant?.notifications?.email) {
    const user = await auth.getUser(participantID);
    const participantEmail = user.email;
    await sendEmail(
      participantEmail,
      subject,
      `${text}\n To unsubscribe from these notifications, please visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
    );
  }

  if (participant?.notifications?.phone) {
    const participantPhone = participant.phone;
    participantPhone &&
      /\d\d\d\d\d\d\d\d\d\d/.test(participantPhone) &&
      (await sendPhone(
        `+1${participantPhone}`,
        `${text}\n To unsubscribe visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
      ));
  }

  return addParticipantNotification(participantID, RESEARCHER_DELETED_REMINDER, subject, text);
};
