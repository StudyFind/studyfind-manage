const {
  getStudyParticipant,
  addParticipantNotification,
  addResearcherNotification,
} = require("../../__utils__/database");

module.exports = async (snapshot, code) => {
  const meeting = snapshot.data();
  const studyParticipant = await getStudyParticipant(meeting.studyID, meeting.participantID);

  addResearcherNotification(meeting.researcherID, code, { meeting, studyParticipant });
  addParticipantNotification(meeting.participantID, code, { meeting, studyParticipant });
};
