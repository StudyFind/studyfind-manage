const admin = require("firebase-admin");
const sendEmail = require("../send-email");

module.exports = async (snapshot, context) => {
  const firestore = admin.firestore();
  const { researcherID } = context.params;

  // TODO: check if this setting is enabled
  // await sendEmail(firestore, admin.auth(), researcherID, {
  //   subject: note.title,
  //   html: note.description,
  // });

  // TODO: get usertype custom claim and add it to the respective collection

  return firestore.collection("researchers").doc(researcherID).collection("notifications").add({
    type: "createAccount",
    time: Date.now(),
    meta: {},
  });
};
