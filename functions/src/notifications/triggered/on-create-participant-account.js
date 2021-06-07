const { auth, firestore } = require("admin");
const { CREATE_ACCOUNT } = require("../__utils__/notification-codes");

module.exports = async (snapshot) => {
  const participantID = snapshot.id;
  const participantName = snapshot.get("name");

  await auth.setCustomUserClaims(participantID, { usertype: "participant" });

  return firestore.collection("participants").doc(participantID).collection("notifications").add({
    time: Date.now(),
    code: CREATE_ACCOUNT,
    meta: { participantName },
  });
};
