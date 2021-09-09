const { auth } = require("admin");
const moment = require("moment");
const {
  RESEARCHER_UPDATED_MEETING,
  PARTICIPANT_CONFIRMED_MEETING,
} = require("../../__utils__/notification-codes");
const {
  getParticipant,
  addParticipantNotification,
  getResearcher,
  addResearcherNotification,
} = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (change) => {
  const before = change.before.data();
  const after = change.after.data();

  if (before.name !== after.name || before.link !== after.link || before.time !== after.time) {
    const { participantID, studyID, time } = after;
    const participant = await getParticipant(participantID);

    if (participant?.notifications?.email) {
      const user = await auth.getUser(participantID);
      const participantEmail = user.email;
      await sendEmail(participantEmail, "Update meeting subject", "Update meeting text");
    }

    addParticipantNotification(
      participantID,
      RESEARCHER_UPDATED_MEETING,
      "Meeting Updated",
      `The researcher of study ${studyID} has updated a meeting with you at ${moment(time).format(
        "LLL"
      )}.`,
      `/mystudies/${studyID}/meetings`
    );
  }

  if (!before.confirmedByParticipant && after.confirmedByParticipant) {
    const { participantID, researcherID, studyID, time } = after;
    const researcher = await getResearcher(researcherID);

    if (researcher?.notifications?.email) {
      const user = await auth.getUser(researcherID);
      const researcherEmail = user.email;
      await sendEmail(researcherEmail, "Update meeting subject", "Update meeting text");
    }

    addResearcherNotification(
      researcherID,
      PARTICIPANT_CONFIRMED_MEETING,
      "Meeting confirmed",
      `Participant ${participantID} has confirmed your meeting with them at ${moment(time).format(
        "LLL"
      )}.`,
      `/study/${studyID}/participants/meetings/${participantID}`
    );
  }
};
