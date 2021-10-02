const { firestore } = require("admin");
const { getDocument } = require("utils");
const { CREATE_STUDY } = require("../../__utils__/notification-codes");

const sendNotification = require("../../__utils__/send-notification");

module.exports = async (snapshot) => {
  const study = snapshot.data();

  const studyID = snapshot.id;
  const researcherID = study.researcher.id;

  const researcher = await getDocument(firestore.collection("researchers").doc(researcherID));

  const notificationDetails = {
    code: CREATE_STUDY,
    title: "Study Created",
    description: `Your study titled "${study.title}" has been created`,
    link: `https://researcher.studyfind.org/study/${studyID}/details`,
  };

  return sendNotification(researcher, "researcher", notificationDetails);
};
