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
    title: "Study Deleted",
    description: `Your study titled "${study.title}" has been deleted. Click here to create another study!`,
    link: `https://researcher.studyfind.org/create`,
  };

  sendNotification(researcher, "researcher", notificationDetails);
};
