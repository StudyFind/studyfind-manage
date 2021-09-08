const { auth, firestore } = require("admin");
const { getDocument } = require("utils");
const { PARTICIPANT_ENROLLED } = require("../../__utils__/notification-codes");
const { getResearcher, addResearcherNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot, context) => {
  const participantFakename = snapshot.get("fakename");

  const { studyID } = context.params;
  const study = await getDocument(firestore.collection("studies").doc(studyID));

  const researcherID = study.researcher.id;
  const researcher = await getResearcher(researcherID);

  if (researcher?.notifications?.email) {
    const user = await auth.getUser(researcherID);
    const researcherEmail = user.email;
    await sendEmail(researcherEmail, "Participant enrolled subject", "Participant enrolled text");
  }

  return addResearcherNotification(
    researcherID,
    PARTICIPANT_ENROLLED,
    "New participant enrollment",
    `Participant ${participantFakename} has enrolled in your study ${studyID}!`,
    `/study/${studyID}/participants`
  );
};
