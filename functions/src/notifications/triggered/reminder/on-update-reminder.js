const { auth } = require("admin");
const {
  RESEARCHER_UPDATED_REMINDER,
  PARTICIPANT_CONFIRMED_REMINDER,
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

  const arrayEqual = (arr1, arr2) => {
    return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
  };

  if (
    before.title !== after.title ||
    before.startDate !== after.startDate ||
    before.endDate !== after.endDate ||
    !arrayEqual(before.times, after.times)
  ) {
    const { participantID, studyID } = after;
    const participant = await getParticipant(participantID);

    if (participant?.notifications?.email) {
      const user = await auth.getUser(participantID);
      const participantEmail = user.email;
      await sendEmail(participantEmail, "Update reminder subject", "Update reminder text");
    }

    addParticipantNotification(
      participantID,
      RESEARCHER_UPDATED_REMINDER,
      "Reminder Updated",
      `The researcher of study ${studyID} has updated a reminder called ${after.title}.`,
      `/mystudies/${studyID}/reminders`
    );
  }

  if (!before.confirmedByParticipant && after.confirmedByParticipant) {
    const { participantID, researcherID, title, studyID } = after;
    const researcher = await getResearcher(researcherID);

    if (researcher?.notifications?.email) {
      const user = await auth.getUser(researcherID);
      const researcherEmail = user.email;
      await sendEmail(researcherEmail, "Update reminder subject", "Update reminder text");
    }

    addResearcherNotification(
      researcherID,
      PARTICIPANT_CONFIRMED_REMINDER,
      "Reminder confirmed",
      `${participantName}${participantID} confirmed ${title} reminder.`,
      `/study/${studyID}/participants/reminders/${participantID}`
    );
  }
};
