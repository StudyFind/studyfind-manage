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
  getStudyParticipant,
} = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");
const sendPhone = require("../../__utils__/send-phone");

module.exports = async (change) => {
  const before = change.before.data();
  const after = change.after.data();

  if (before.name !== after.name || before.link !== after.link || before.time !== after.time) {
    const { participantID, researcherID, studyID, time } = after;
    const participant = await getParticipant(participantID);
    const researcherUser = await auth.getUser(researcherID);

    const subject = "Researcher Updated Meeting";
    const text = `${researcherUser.displayName} has updated your meeting at ${moment(time)
      .tz(participant.timezone.region)
      .format("LLL")}`;

    if (participant?.notifications?.email) {
      const user = await auth.getUser(participantID);
      const participantEmail = user.email;
      await sendEmail(
        participantEmail,
        subject,
        `${text}: ${`/mystudies/${studyID}/meetings`}\n To unsubscribe from these notifications, please visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
      );
    }

    if (participant?.notifications?.phone) {
      const participantPhone = participant.phone;
      participantPhone &&
        /\d\d\d\d\d\d\d\d\d\d/.test(participantPhone) &&
        (await sendPhone(
          `+1${participantPhone}`,
          `${text}: ${`/mystudies/${studyID}/meetings`}\n To unsubscribe visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
        ));
    }

    addParticipantNotification(
      participantID,
      RESEARCHER_UPDATED_MEETING,
      subject,
      text,
      `/mystudies/${studyID}/meetings`
    );
  }

  if (!before.confirmedByParticipant && after.confirmedByParticipant) {
    const { participantID, researcherID, studyID, time } = after;
    const studyParticipant = await getStudyParticipant(studyID, participantID);
    const researcher = await getResearcher(researcherID);

    const subject = "Participant Confirmed Meeting!";
    const text = `${
      studyParticipant.fakename
    } (${participantID}) has confirmed your meeting at ${moment(time)
      .tz(researcher.timezone.region)
      .format("LLL")}`;

    if (researcher?.notifications?.email) {
      const user = await auth.getUser(researcherID);
      const researcherEmail = user.email;
      await sendEmail(
        researcherEmail,
        subject,
        `${text}: ${`/study/${studyID}/participants/meetings/${participantID}`}\n To unsubscribe from these notifications, please visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
      );
    }

    if (researcher?.notifications?.phone) {
      const researcherPhone = researcher.phone;
      researcherPhone &&
        /\d\d\d\d\d\d\d\d\d\d/.test(researcherPhone) &&
        (await sendPhone(
          `+1${researcherPhone}`,
          `${text}: ${`/study/${studyID}/participants/meetings/${participantID}`}\n To unsubscribe visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
        ));
    }

    addResearcherNotification(
      researcherID,
      PARTICIPANT_CONFIRMED_MEETING,
      subject,
      text,
      `/study/${studyID}/participants/meetings/${participantID}`
    );
  }
};
