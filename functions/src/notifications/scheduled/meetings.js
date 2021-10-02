const { auth } = require("admin");

const { firestore } = require("admin");
const { getDocument, getCollection } = require("utils");
const { MEETING_NOW } = require("../__utils__/notification-codes");
const { addParticipantNotification, addResearcherNotification } = require("../__utils__/database");
const sendEmail = require("../__utils__/send-email");
const sendPhone = require("../__utils__/send-phone");

const getCurrentTimeRoundedTo30Minutes = () => {
  const MILLIS_UTC_NOW = Date.now();
  const MILLIS_IN_30_MINS = 1800000;
  return MILLIS_IN_30_MINS + Math.floor(MILLIS_UTC_NOW / MILLIS_IN_30_MINS) * MILLIS_IN_30_MINS;
};

const add30Minutes = (time) => {
  const MILLIS_IN_30_MINS = 1800000;
  return MILLIS_IN_30_MINS + time;
};

// sends notifications 30 minutes before meeting
module.exports = async () => {
  const roundedTime = add30Minutes(getCurrentTimeRoundedTo30Minutes());

  const meetingsRef = firestore.collection("meetings").where("time", "==", roundedTime);
  const meetings = await getCollection(meetingsRef);

  return Promise.allSettled(
    meetings.map(async (meeting) => {
      const { studyID, researcherID, participantID, link } = meeting;

      const researcherRef = firestore.collection("researchers").doc(researcherID);
      const participantRef = firestore.collection("participants").doc(participantID);
      const studyParticipantRef = firestore
        .collection("studies")
        .doc(studyID)
        .participants(participantID);

      const [researcher, participant, studyParticipant, researcherUser] = await Promise.all([
        getDocument(researcherRef),
        getDocument(participantRef),
        getDocument(studyParticipantRef),
        auth.getUser(researcherID),
      ]);

      const participantFakename = studyParticipant.fakename;

      if (!researcher) throw Error(`Referenced researcher ${researcherID} does not exist`);
      if (!participant) throw Error(`Referenced participant ${participantID} does not exist`);

      const participantSubject = `Upcoming Meeting`;
      const participantText = `You have a meeting with ${researcherUser.displayName} in 30 minutes`;
      const researcherSubject = `Upcoming Meeting`;
      const researcherText = `Your meeting with ${participantFakename} from study ${studyID} is in 30 minutes`;

      if (participant.notifications?.email) {
        const user = await auth.getUser(participantID);
        const participantEmail = user.email;
        await sendEmail(
          participantEmail,
          participantSubject,
          `${participantText}: ${link}\n To unsubscribe from these notifications, please visit: https://studyfind.org/account/notifications/`
        );
      }

      if (participant.notifications?.phone) {
        const participantPhone = participant.phone;
        participantPhone &&
          /\d\d\d\d\d\d\d\d\d\d/.test(participantPhone) &&
          (await sendPhone(
            `+1${participantPhone}`,
            `${participantText}: ${link}\n To unsubscribe visit: https://studyfind.org/account/notifications/`
          ));
      }

      if (researcher.notifications?.email) {
        const researcherEmail = researcherUser.email;
        await sendEmail(
          researcherEmail,
          researcherSubject,
          `${researcherText}: ${link}\n To unsubscribe from these notifications, please visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
        );
      }

      if (researcher.notifications?.phone) {
        const researcherPhone = researcher.phone;
        researcherPhone &&
          /\d\d\d\d\d\d\d\d\d\d/.test(researcherPhone) &&
          (await sendPhone(
            `+1${researcherPhone}`,
            `${researcherText}: ${link}\n To unsubscribe visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
          ));
      }

      await Promise.all(
        addParticipantNotification(
          participantID,
          MEETING_NOW,
          participantSubject,
          participantText,
          link
        ),
        addResearcherNotification(
          researcherID,
          MEETING_NOW,
          researcherSubject,
          researcherText,
          link
        )
      );
    })
  );
};
