const { firestore } = require("admin");
const { getDocument } = require("utils");

const {
  RESEARCHER_UPDATED_REMINDER,
  PARTICIPANT_CONFIRMED_REMINDER,
} = require("../../__utils__/notification-codes");

const sendNotification = require("../../__utils__/send-notification");

module.exports = async (change) => {
  const before = change.before.data();
  const after = change.after.data();

  const isArrayEqual = (arr1, arr2) => {
    return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
  };

  const hasTitleChanged = before.title !== after.title;
  const hasStartDateChanged = before.startDate !== after.startDate;
  const hasEndDateChanged = before.endDate !== after.endDate;
  const hasTimesChanged = !isArrayEqual(before.times, after.times);

  if (hasTitleChanged || hasStartDateChanged || hasEndDateChanged || hasTimesChanged) {
    const reminder = after;

    const studyRef = firestore.collection("studies").doc(reminder.studyID);
    const participantRef = firestore.collection("participants").doc(reminder.participantID);

    const [study, participant] = await Promise.allSettled([
      getDocument(studyRef),
      getDocument(participantRef),
    ]);

    const notificationDetails = {
      code: RESEARCHER_UPDATED_REMINDER,
      title: "Reminder Updated",
      description: `${study.researcher.name} has updated the reminder titled "${reminder.title}"`,
      link: `https://studyfind.org/your-studies/${reminder.studyID}/reminders`,
    };

    sendNotification(participant, "participant", notificationDetails);
  }

  const hasParticipantConfirmed = !before.confirmedByParticipant && after.confirmedByParticipant;

  if (hasParticipantConfirmed) {
    const reminder = after;

    const researcher = await getDocument(
      firestore.collection("researchers").doc(reminder.researcherID)
    );

    const notificationDetails = {
      code: PARTICIPANT_CONFIRMED_REMINDER,
      title: "Reminder Updated",
      description: `Participant ${reminder.participantID} has confirmed your reminder titled "${reminder.name}"`,
      link: `https://researcher.studyfind.org/study/${reminder.studyID}/participants/${reminder.participantID}/reminders`,
    };

    sendNotification(researcher, "researcher", notificationDetails);
  }
};
