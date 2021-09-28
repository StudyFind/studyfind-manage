const { auth } = require("admin");
const { RESEARCHER_CREATED_REMINDER } = require("../../__utils__/notification-codes");
const { getParticipant, addParticipantNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");
const sendPhone = require("../../__utils__/send-phone");

module.exports = async (snapshot) => {
  const reminder = snapshot.data();
  const { participantID, researcherID, studyID, title } = reminder;
  const participant = await getParticipant(participantID);
  const researcherUser = await auth.getUser(researcherID);

  const subject = "Researcher Created Reminder!";
  const text = `${researcherUser.displayName} has set up a weekly reminder called ${title} for you.`;

  if (participant?.notifications?.email) {
    const user = await auth.getUser(participantID);
    const participantEmail = user.email;
    await sendEmail(
      participantEmail,
      subject,
      `${text}: ${`/mystudies/${studyID}/reminders`}\n To unsubscribe from these notifications, please visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
    );
  }

  if (participant?.notifications?.phone) {
    const participantPhone = participant.phone;
    participantPhone &&
      /\d\d\d\d\d\d\d\d\d\d/.test(participantPhone) &&
      (await sendPhone(
        `+1${participantPhone}`,
        `${text}: ${`/mystudies/${studyID}/reminders`}\n To unsubscribe visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
      ));
  }

  return addParticipantNotification(
    participantID,
    RESEARCHER_CREATED_REMINDER,
    subject,
    text,
    `/mystudies/${studyID}/reminders`
  );
};
