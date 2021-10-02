const moment = require("moment-timezone");

const { firestore } = require("admin");
const { getDocument } = require("utils");
const { RESEARCHER_CREATED_MEETING } = require("../../__utils__/notification-codes");

const sendNotification = require("../../__utils__/send-notification");

module.exports = async (snapshot) => {
  const meeting = snapshot.data();

  const studyRef = firestore.collection("studies").doc(meeting.studyID);
  const participantRef = firestore.collection("participants").doc(meeting.participantID);

  const [study, participant] = await Promise.allSettled([
    getDocument(studyRef),
    getDocument(participantRef),
  ]);

  const notificationDetails = {
    code: RESEARCHER_CREATED_MEETING,
    link: `https://studyfind.org/your-studies/${meeting.studyID}/meetings`,
    title: "New Meeting",
    description: `${study.researcher.name} has created the meeting titled "${
      meeting.name
    }" with you at ${moment(meeting.time).tz(participant.timezone).format("LLL")} (${moment
      .tz(participant.timezone)
      .zoneAbbr()})`,
  };

  sendNotification(participant, "participant", notificationDetails);
};
