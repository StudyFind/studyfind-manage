const { firestore } = require("admin");
const { getDocument } = require("utils");
const { RESEARCHER_CREATED_REMINDER } = require("../../__utils__/notification-codes");

const sendNotification = require("../../__utils__/send-notification");

module.exports = async (snapshot) => {
  const reminder = snapshot.data();

  const studyRef = firestore.collection("studies").doc(reminder.studyID);
  const participantRef = firestore.collection("participants").doc(reminder.participantID);

  const [study, participant] = await Promise.allSettled([
    getDocument(studyRef),
    getDocument(participantRef),
  ]);

  const notificationDetails = {
    code: RESEARCHER_CREATED_REMINDER,
    link: `https://studyfind.org/your-studies/${reminder.studyID}/reminders`,
    title: "New Reminder",
    description: `${study.researcher.name} has created the reminder titled "${reminder.title}" for you. Click here to view and confirm!`,
  };

  sendNotification(participant, "participant", notificationDetails);
};
