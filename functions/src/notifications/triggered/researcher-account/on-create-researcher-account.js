const { auth, firestore } = require("admin");
const { CREATE_ACCOUNT } = require("../../__utils__/notification-codes");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot) => {
  const researcherID = snapshot.id;
  const researcherName = snapshot.get("name");
  const researcherEmail = snapshot.get("email");

  await auth.setCustomUserClaims(researcherID, { usertype: "researcher" });

  // TODO: Send welcome email, promise all
  await sendEmail(
    researcherEmail,
    "Create researcher account subject",
    "Create researcher account text"
  );

  return firestore
    .collection("researchers")
    .doc(researcherID)
    .collection("notifications")
    .add({
      code: CREATE_ACCOUNT,
      time: Date.now(),
      link: "",
      title: "Researcher account created!",
      description: `Your account has been successfully created as ${researcherName}!`,
      read: false,
    });
};
