const { firestore } = require("admin");
const { getDocument } = require("utils");
const { NEW_MESSAGE } = require("../../__utils__/notification-codes");

const sendNotification = require("../../__utils__/send-notification");

module.exports = async (snapshot, context) => {
  const message = snapshot.data();

  const participantID = context.params.participantID;
  const studyID = context.params.studyID;

  if (message.user === participantID) {
    // participant sent message
    const [study, participant] = await Promise.allSettled([
      getDocument(firestore.collection("studies").doc(studyID)),
      getDocument(firestore.collection("participants").doc(participantID)),
    ]);

    const notificationDetails = {
      code: NEW_MESSAGE,
      link: `https://studyfind.org/your-studies/${studyID}/messages`,
      title: "New Message",
      description: `${study.researcher.name} has sent you a message`,
    };

    sendNotification(participant, "participant", notificationDetails);
  } else {
    // researcher sent message

    const researcher = await getDocument(firestore.collection("researchers").doc(message.user));

    const notificationDetails = {
      code: NEW_MESSAGE,
      link: `https://researcher.studyfind.org/study/${studyID}/participants/${participantID}/messages`,
      title: "New Message",
      description: `Participant ${participantID} has sent you a message`,
    };

    sendNotification(researcher, "researcher", notificationDetails);
  }
};
