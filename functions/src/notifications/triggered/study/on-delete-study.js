const { auth } = require("admin");
const { DELETE_STUDY } = require("../../__utils__/notification-codes");
const { getResearcher, addResearcherNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot) => {
  const studyID = snapshot.id;
  const study = snapshot.data();
  const researcherID = study.researcher.id;

  const researcher = await getResearcher(researcherID);

  if (researcher?.notifications?.email) {
    const user = await auth.getUser(researcherID);
    const researcherEmail = user.email;
    await sendEmail(researcherEmail, "Delete study subject", "Delete study text");
  }

  return addResearcherNotification(
    researcherID,
    DELETE_STUDY,
    "Study Deleted",
    `You deleted study ${studyID}.`
  );
};
