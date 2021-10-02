const { auth, firestore } = require("admin");
const { getDocument } = require("utils");
const { PARTICIPANT_ENROLLED } = require("../../__utils__/notification-codes");
const { getResearcher, addResearcherNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");
const sendPhone = require("../../__utils__/send-phone");

module.exports = async (snapshot, context) => {
  const studyParticipant = snapshot.data();
  const { studyID } = context.params;
  const study = await getDocument(firestore.collection("studies").doc(studyID));
  const researcherID = study.researcher.id;
  const researcher = await getResearcher(researcherID);

  const subject = "New participant enrollment";
  const text = `${studyParticipant.fakename} has enrolled in study ${studyID}`;

  if (researcher?.notifications?.email) {
    const user = await auth.getUser(researcherID);
    const researcherEmail = user.email;
    await sendEmail(
      researcherEmail,
      subject,
      `${text}: ${`https://studyfind-researcher.firebaseapp.com/study/${studyID}/participants/`}\n To unsubscribe from these notifications, please visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
    );
  }

  if (researcher?.notifications?.phone) {
    const researcherPhone = researcher.phone;
    researcherPhone &&
      /\d\d\d\d\d\d\d\d\d\d/.test(researcherPhone) &&
      (await sendPhone(
        `+1${researcherPhone}`,
        `${text}: ${`https://studyfind-researcher.firebaseapp.com/study/${studyID}/participants/`}\n To unsubscribe visit: https://studyfind-researcher.firebaseapp.com/account/notifications/`
      ));
  }

  return addResearcherNotification(
    researcherID,
    PARTICIPANT_ENROLLED,
    subject,
    text,
    `/study/${studyID}/participants/`
  );
};
