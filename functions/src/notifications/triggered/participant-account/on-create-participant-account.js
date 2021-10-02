const { auth } = require("admin");
const { CREATE_ACCOUNT } = require("../../__utils__/notification-codes");
const { addParticipantNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot) => {
  const participantID = snapshot.id;
  const user = await auth.getUser(participantID);
  const participantName = user.displayName;
  const participantEmail = user.email;

  const subject = "Participant account created!";
  const text = `Welcome ${participantName}! We're excited to have you here!`;

  await Promise.all([
    auth.setCustomUserClaims(participantID, { usertype: "participant" }),
    sendEmail(participantEmail, subject, text),
  ]);

  return addParticipantNotification(participantID, CREATE_ACCOUNT, subject, text);
};
