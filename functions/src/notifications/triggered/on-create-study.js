const { firestore } = require("admin");
const { getDocument } = require("utils");
const { CREATE_STUDY } = require("../__utils__/notification-codes");

const { sendEmail } = require("../__utils__/send-email");
const { sendPhone } = require("../__utils__/send-phone");

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
  const preference = researcher.preferences.notifications.categories.studies;

  const subject = "New study created";
  const text = "A new study has been created in your account";

  if (preference) {
    await Promise.all([
      sendEmail("yohan@studyfind.org", subject, text),
      sendPhone("+14704245335", subject, text),
      sendDatabaseNotification(researcherID, studyID),
    ]);
  }
};
