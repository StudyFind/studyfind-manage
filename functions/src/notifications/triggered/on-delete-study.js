const admin = require("firebase-admin");
const sendEmail = require("../send-email");

module.exports = async (snapshot, context) => {
  const firestore = admin.firestore();
  const study = snapshot.data();

  // TODO: check if this setting is enabled
  // await sendEmail(firestore, admin.auth(), study.researcher.id, {
  //   subject: note.title,
  //   html: note.description,
  // });

  return firestore
    .collection("researchers")
    .doc(study.researcher.id)
    .collection("notifications")
    .add({
      type: "deleteStudy",
      time: Date.now(),
      meta: { studyID: snapshot.id },
    });
};
