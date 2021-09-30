const { firestore } = require("admin");
const { getDocument } = require("utils");
const { RESEARCHER_DELETED_MEETING } = require("../../__utils__/notification-codes");

const sendNotification = require("../../__utils__/send-notification");

module.exports = async (snapshot) => {
  const meeting = snapshot.data();

  const studyRef = firestore.collection("studies").doc(meeting.studyID);
  const participantRef = firestore.collection("participants").doc(meeting.participantID);

  const [study, participant] = await Promise.allSettled([
    getDocument(studyRef),
    getDocument(participantRef),
  ]);

  const notificationDetails = {
    code: RESEARCHER_DELETED_MEETING,
    title: "Meeting Deleted",
    description: `${study.researcher.name} has deleted the meeting titled "${meeting.name}". Click here to view!`,
    link: `https://studyfind.org/your-studies/${meeting.studyID}/meetings`,
  };

  sendNotification(participant, "participant", notificationDetails);
};
