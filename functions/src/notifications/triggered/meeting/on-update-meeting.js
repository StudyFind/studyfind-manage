const { firestore } = require("admin");
const { getDocument } = require("utils");
const {
  RESEARCHER_UPDATED_MEETING,
  PARTICIPANT_CONFIRMED_MEETING,
} = require("../../__utils__/notification-codes");

const sendNotification = require("../../__utils__/send-notification");

module.exports = async (change) => {
  const before = change.before.data();
  const after = change.after.data();

  // PARTICIPANT

  const hasNameChanged = before.name !== after.name;
  const hasLinkChanged = before.link !== after.link;
  const hasTimeChanged = before.time !== after.time;

  if (hasNameChanged || hasLinkChanged || hasTimeChanged) {
    const meeting = after;

    const studyRef = firestore.collection("studies").doc(meeting.studyID);
    const participantRef = firestore.collection("participants").doc(meeting.participantID);

    const [study, participant] = await Promise.allSettled([
      getDocument(studyRef),
      getDocument(participantRef),
    ]);

    const notificationDetails = {
      code: RESEARCHER_UPDATED_MEETING,
      title: "Meeting Updated",
      description: `${study.researcher.name} has updated the meeting titled "${meeting.name}". Click here to view!`,
      link: `https://studyfind.org/your-studies/${meeting.studyID}/meetings`,
    };

    sendNotification(participant, "participant", notificationDetails);
  }

  // RESEARCHER

  const hasParticipantConfirmed = !before.confirmedByParticipant && after.confirmedByParticipant;

  if (hasParticipantConfirmed) {
    const meeting = after;

    const researcher = await getDocument(
      firestore.collection("researchers").doc(meeting.researcherID)
    );

    const notificationDetails = {
      code: PARTICIPANT_CONFIRMED_MEETING,
      title: "Meeting Updated",
      description: `Participant ${meeting.participantID} has confirmed your meeting titled "${meeting.name}"`,
      link: `https://researcher.studyfind.org/study/${meeting.studyID}/participants/${meeting.participantID}/meetings`,
    };

    sendNotification(researcher, "researcher", notificationDetails);
  }
};
