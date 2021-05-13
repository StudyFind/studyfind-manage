const admin = require("firebase-admin");
const sendEmail = require("../send-email");

module.exports = async (snapshot, context) => {
  const firestore = admin.firestore();
  const { studyID } = context.params;

  const studySnapshot = await firestore.collection("studies").doc(studyID).get();
  const researcher = studySnapshot.get("researcher");
  const fakename = snapshot.get("fakename");

  // TODO: check if this setting is enabled
  // await sendEmail(firestore, admin.auth(), study.researcher.id, {
  //   subject: note.title,
  //   html: note.description,
  // });

  return firestore
    .collection("researchers")
    .doc(researcher.id)
    .collection("notifications")
    .add({
      type: "newParticipant",
      time: Date.now(),
      meta: {
        studyID,
        participantID: snapshot.id,
        participantName: fakename,
      },
    });
};
