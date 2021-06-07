const { auth, firestore } = require("admin");
const { CREATE_ACCOUNT } = require("../__utils__/notification-codes");

module.exports = async (snapshot) => {
  const researcherID = snapshot.id;
  const researcherName = snapshot.get("name");

  await auth.setCustomUserClaims(researcherID, { usertype: "researcher" });

  return firestore.collection("researchers").doc(researcherID).collection("notifications").add({
    time: Date.now(),
    code: CREATE_ACCOUNT,
    meta: { researcherName },
  });
};
