const { auth } = require("admin");
const { CREATE_ACCOUNT } = require("../../__utils__/notification-codes");
const { addParticipantNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot) => {
  const participantID = snapshot.id;
  const user = await auth.getUser(participantID);
  const participantName = user.displayName;
  const participantEmail = user.email;

  await Promise.all([
    auth.setCustomUserClaims(participantID, { usertype: "participant" }),
    sendEmail(
      participantEmail,
      "Create participant account title",
      "Create participant account text"
    ),
  ]);

  return addParticipantNotification(
    participantID,
    CREATE_ACCOUNT,
    "Participant account created!",
    `Your account has been successfully created as ${participantName}!`
  );
};
