const { firestore } = require("admin");
const { getDocument } = require("utils");
const { PARTICIPANT_ENROLLED } = require("../../__utils__/notification-codes");

const sendNotification = require("../../__utils__/send-notification");

module.exports = async (snapshot, context) => {
  const participantID = snapshot.id;

  const study = getDocument(firestore.collection("studies").doc(context.params.studyID));
  const researcher = getDocument(firestore.collection("researchers").doc(study.researcher.id));

  const notificationDetails = {
    code: PARTICIPANT_ENROLLED,
    title: "New Participant Enrolled",
    description: `A new participant ${participantID} has enrolled in your study`,
    link: `https://researcher.studyfind.org/study/${context.params.studyID}/participants/${participantID}/questions`,
  };

  sendNotification(researcher, "researcher", notificationDetails);
};
