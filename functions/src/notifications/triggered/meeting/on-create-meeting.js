const { auth } = require("admin");
const moment = require("moment");
const { RESEARCHER_CREATED_MEETING } = require("../../__utils__/notification-codes");
const { getParticipant, addParticipantNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");
const sendPhone = require("../../__utils__/send-phone");

module.exports = async (snapshot) => {
  const meeting = snapshot.data();
  const { participantID, researcherID, time, link } = meeting;
  const participant = await getParticipant(participantID);
  const researcherUser = await auth.getUser(researcherID);

  const subject = "Researcher Created Meeting!";
  const text = `${researcherUser.displayName} has created a meeting with you at ${moment(time)
    .tz(participant.timezone.region)
    .format("LLL")}`;

  if (participant?.notifications?.email) {
    const user = await auth.getUser(participantID);
    const participantEmail = user.email;
    await sendEmail(
      participantEmail,
      subject,
      `${text}: ${link}\n To unsubscribe from these notifications, please visit: https://studyfind.org/account/notifications/`
    );
  }

  if (participant?.notifications?.phone) {
    const participantPhone = participant.phone;
    participantPhone &&
      /\d\d\d\d\d\d\d\d\d\d/.test(participantPhone) &&
      (await sendPhone(
        `+1${participantPhone}`,
        `${text}: ${link}\n To unsubscribe visit: https://studyfind.org/account/notifications/`
      ));
  }

  return addParticipantNotification(participantID, RESEARCHER_CREATED_MEETING, subject, text, link);
};
