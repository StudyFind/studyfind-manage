const { firestore } = require("admin");
const { getDocument } = require("utils");
const { CREATE_STUDY } = require("../__utils__/notification-codes");

const sendEmailNotification = async () => {
  return firestore.collection("mail").add({
    to: "yohan@studyfind.org",
    message: {
      subject: "New Study Created",
      text: "A new study has been created in your account",
    },
  });
};

const sendDatabaseNotification = async (researcherID, studyID) => {
  return firestore.collection("researchers").doc(researcherID).collection("notifications").add({
    time: Date.now(),
    code: CREATE_STUDY,
    meta: { studyID },
  });
};

module.exports = async (snapshot) => {
  const studyID = snapshot.id;
  const researcherID = snapshot.get("researcher.id");

  const researcher = await getDocument(firestore.collection("researchers").doc(researcherID));
  const preference = researcher.notifications.categories.studies;

  if (preference) {
    await Promise.all([sendEmailNotification(), sendDatabaseNotification(researcherID, studyID)]);
  }
};
