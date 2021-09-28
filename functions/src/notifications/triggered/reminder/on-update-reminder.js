const { auth, firestore } = require("admin");
const {
  RESEARCHER_UPDATED_REMINDER,
  PARTICIPANT_CONFIRMED_REMINDER,
} = require("../../__utils__/notification-codes");
const {
  getParticipant,
  addParticipantNotification,
  getResearcher,
  addResearcherNotification,
  getStudyParticipant,
} = require("../../__utils__/database");
const { getDocument } = require("utils");
const sendEmail = require("../../__utils__/send-email");
const sendPhone = require("../../__utils__/send-phone");

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
    const { participantID, studyID, title } = after;
    const participant = await getParticipant(participantID);
    const study = await getDocument(firestore.collection("studies").doc(studyID));

    const subject = "Researcher Updated Reminder!";
    const text = `Study ${study.title} has updated your reminder called ${title}`;

    if (participant?.notifications?.email) {
      const user = await auth.getUser(participantID);
      const participantEmail = user.email;
      await sendEmail(
        participantEmail,
        subject,
        `${text}: ${`/mystudies/${studyID}/reminders`}\n To unsubscribe from these notifications, please visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
      );
    }

    if (participant?.notifications?.phone) {
      const participantPhone = participant.phone;
      participantPhone &&
        /\d\d\d\d\d\d\d\d\d\d/.test(participantPhone) &&
        (await sendPhone(
          `+1${participantPhone}`,
          `${text}: ${`/mystudies/${studyID}/reminders`}\n To unsubscribe visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
        ));
    }

    addParticipantNotification(
      participantID,
      RESEARCHER_UPDATED_REMINDER,
      subject,
      text,
      `/mystudies/${studyID}/reminders`
    );
  }

  if (!before.confirmedByParticipant && after.confirmedByParticipant) {
    const { participantID, researcherID, title, studyID } = after;
    const studyParticipant = await getStudyParticipant(studyID, participantID);
    const researcher = await getResearcher(researcherID);

    const subject = "Participant Confirmed Reminder!";
    const text = `${studyParticipant.fakename} (${participantID}) confirmed reminder ${title}`;

    if (researcher?.notifications?.email) {
      const user = await auth.getUser(researcherID);
      const researcherEmail = user.email;
      await sendEmail(
        researcherEmail,
        subject,
        `${text}: ${`/study/${studyID}/participants/reminders/${participantID}`}\n To unsubscribe from these notifications, please visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
      );
    }

    if (researcher?.notifications?.phone) {
      const researcherPhone = researcher.phone;
      researcherPhone &&
        /\d\d\d\d\d\d\d\d\d\d/.test(researcherPhone) &&
        (await sendPhone(
          `+1${researcherPhone}`,
          `${text}: ${`/study/${studyID}/participants/reminders/${participantID}`}\n To unsubscribe visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
        ));
    }

    addResearcherNotification(
      researcherID,
      PARTICIPANT_CONFIRMED_REMINDER,
      subject,
      text,
      `/study/${studyID}/participants/reminders/${participantID}`
    );
  }
};
