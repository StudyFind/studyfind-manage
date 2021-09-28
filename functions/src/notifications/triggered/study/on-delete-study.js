const { firestore } = require("admin");
const { getDocument } = require("utils");
const { DELETE_STUDY } = require("../../__utils__/notification-codes");

const sendNotification = require("../../__utils__/send-notification");

module.exports = async (snapshot) => {
  const study = snapshot.data();

  const researcherID = study.researcher.id;

  const researcher = await getDocument(firestore.collection("researchers").doc(researcherID));

  const notificationDetails = {
    code: DELETE_STUDY,
    link: `https://researcher.studyfind.org`,
    title: "Study Deleted",
    description: `${study.title} has been deleted`,
  };

  sendNotification(researcher, "researcher", notificationDetails);
};
