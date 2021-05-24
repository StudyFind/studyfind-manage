const admin = require("firebase-admin");
// const sendEmail = require("../src/notifications/send-email");
const firestore = admin.firestore();

module.exports = async () => {
  const roundedTime = Math.floor((Date.now() % 604800000) / 1800000) * 1800000;
  const meetings = [];

  const meetingsSnapshot = await firestore
    .collection("meetings")
    .where("time", "==", roundedTime)
    .get();

  meetingsSnapshot.forEach((m) => meetings.push(m));

  if (!meetings.length) {
    return [];
  }

  return Promise.allSettled(
    meetings.map(async (meeting) => {
      const { studyID, researcherID, participantID } = meeting.data();

      const [researcherSnapshot, participantSnapshot] = Promise.all([
        await firestore.collection("researchers").doc(researcherID).get(),
        await firestore.collection("participants").doc(participantID).get(),
      ]);

      if (!researcherSnapshot.exists) {
        throw Error(`Referenced researcher ${researcherID} does not exist`);
      }

      if (!participantSnapshot.exists) {
        throw Error(`Referenced participant ${participantID} does not exist`);
      }

      const researcherName = researcherSnapshot.get("name");
      const participantName = participantSnapshot.get("name");

      return Promise.all([
        firestore.collection("researchers").doc(researcherID).collection("notifications").add({
          type: "upcomingMeeting",
          time: Date.now(),
          meta: {
            studyID,
            participantID,
            participantName,
          },
        }),
        firestore.collection("participants").doc(participantID).collection("notifications").add({
          type: "upcomingMeeting",
          time: Date.now(),
          meta: {
            studyID,
            researcherName,
          },
        }),
        // TODO: send emails to both researcher and participant depending on their notification preference
        // sendEmail(firestore, auth, researcher.id, email),
        // sendEmail(firestore, auth, m.participantID, email, false),
      ]);
    })
  );
};
