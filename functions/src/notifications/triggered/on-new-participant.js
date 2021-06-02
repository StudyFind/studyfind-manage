const admin = require("firebase-admin");
const getDocument = require("../../utils/get-document");
const { NEW_PARTICIPANT } = require("../__utils__/notification-codes");

module.exports = async (snapshot, context) => {
  const firestore = admin.firestore();
  const { studyID } = context.params;

  const study = await getDocument(firestore.collection("studies").doc(studyID));
  const researcherID = study.researcher.id;
  const researcher = await getDocument(firestore.collection("researchers").doc(researcherID));
  const preference = researcher.notifications.categories.participants;
  const participantID = snapshot.id;
  const participantFakename = snapshot.get("fakename");

  return (
    preference &&
    firestore.collection("researchers").doc(researcherID).collection("notifications").add({
      time: Date.now(),
      code: NEW_PARTICIPANT,
      meta: {
        studyID,
        participantID,
        participantFakename,
      },
    })
  );
};
