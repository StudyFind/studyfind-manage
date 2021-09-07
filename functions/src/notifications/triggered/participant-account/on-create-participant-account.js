const { auth, firestore } = require("admin");
const { CREATE_ACCOUNT } = require("../../__utils__/notification-codes");
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

  return firestore
    .collection("participants")
    .doc(participantID)
    .collection("notifications")
    .add({
      code: CREATE_ACCOUNT,
      time: Date.now(),
      link: "",
      title: "Participant account created!",
      description: `Your account has been successfully created as ${participantName}!`,
      read: false,
    });
};
