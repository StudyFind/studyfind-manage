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
    link: `https://researcher.studyfind.org/study/${studyID}/details`,
    title: "Study Created",
    description: `${study.title} has been created`,
  };

  sendNotification(researcher, "researcher", notificationDetails);
};
