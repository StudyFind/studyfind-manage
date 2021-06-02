const { firestore } = require("admin");
const { getDocument } = require("utils");
const { CREATE_STUDY } = require("../__utils__/notification-codes");

module.exports = async (snapshot) => {
  const studyID = snapshot.id;
  const researcherID = snapshot.get("researcher.id");

  const researcher = await getDocument(firestore.collection("researchers").doc(researcherID));
  const preference = researcher.notifications.categories.studies;

  return (
    preference &&
    firestore.collection("researchers").doc(researcherID).collection("notifications").add({
      time: Date.now(),
      code: CREATE_STUDY,
      meta: { studyID },
    })
  );
};
