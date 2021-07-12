const {
  getStudyParticipant,
  addParticipantNotification,
  addResearcherNotification,
} = require("../../__utils__/database");

module.exports = async (snapshot, code) => {
  const reminder = snapshot.data();
  const studyParticipant = await getStudyParticipant(reminder.studyID, reminder.participantID);

  addResearcherNotification(reminder.researcherID, code, { reminder, studyParticipant });
  addParticipantNotification(reminder.participantID, code, { reminder, studyParticipant });
};
