const moment = require("moment-timezone");

const { firestore } = require("admin");
const { getDocument, getCollection } = require("utils");

const { MEETING } = require("../__utils__/notification-codes");

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
      const { studyID, researcherID, participantID } = meeting;

      const researcherRef = firestore.collection("researchers").doc(researcherID);
      const participantRef = firestore.collection("participants").doc(participantID);
      const studyParticipantRef = firestore
        .collection("studies")
        .doc(studyID)
        .participants(participantID);

      const [researcher, participant, studyParticipant] = await Promise.all([
        getDocument(researcherRef),
        getDocument(participantRef),
        getDocument(studyParticipantRef),
      ]);

      const participantFakename = studyParticipant.fakename;

      if (!researcher) throw Error(`Referenced researcher ${researcherID} does not exist`);
      if (!participant) throw Error(`Referenced participant ${participantID} does not exist`);

      const participantTime = moment(roundedTime).tz(participant.timezone).format("h:mma");
      const researcherTime = moment(roundedTime).tz(researcher.timezone).format("h:mma");

      const researcherNotification = {
        title: `Meeting ${meeting.title} at ${researcherTime}`,
        body: `You have a upcoming meeting with participant ${participantFakename} for study ${studyID} in 30 minutes`,
        code: MEETING,
        time: Date.now(),
        meta: { participantID, meetingID: meeting.id },
      };

      const participantNotification = {
        title: `Meeting ${meeting.title} at ${participantTime}`,
        body: `You have a upcoming meeting with researcher ${researcher.name} for study ${studyID} in 30 minutes`,
        code: MEETING,
        time: Date.now(),
        meta: { participantID, meetingID: meeting.id },
      };

      await Promise.all([sendResearcherNotification(), sendParticipantNotification()]);
    })
  );
};
