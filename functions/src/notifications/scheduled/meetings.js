const moment = require("moment-timezone");

const { firestore } = require("admin");
const { getDocument, getCollection } = require("utils");

const { MEETING_NOW } = require("../__utils__/notification-codes");
const sendNotification = require("notifications/__utils__/send-notification");

const getCurrentTimeRoundedTo30Minutes = () => {
  const MILLIS_UTC_NOW = moment().utc().valueOf();
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
        .collection("participants")
        .doc(participantID);

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

      const researcherNotificationDetails = {
        code: MEETING_NOW,
        title: `Meeting ${meeting.name} at ${researcherTime}`,
        description: `You have a upcoming meeting with participant ${participantFakename} for study ${studyID} in 30 minutes`,
        link: meeting.link,
      };

      const participantNotificationDetails = {
        code: MEETING_NOW,
        title: `Meeting ${meeting.name} at ${participantTime}`,
        description: `You have a upcoming meeting with participant ${participantFakename} for study ${studyID} in 30 minutes`,
        link: meeting.link,
      };

      await Promise.all([
        sendNotification(researcher, "researcher", researcherNotificationDetails),
        sendNotification(participant, "participant", participantNotificationDetails),
      ]);
    })
  );
};
