//TODO use auth trigger instead? functions.auth.user().onDelete
const { auth } = require("admin");
const { DELETE_ACCOUNT } = require("../../__utils__/notification-codes");
const { addResearcherNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot) => {
  const researcherID = snapshot.id;
  const user = await auth.getUser(researcherID);
  //const researcherName = user.displayName;
  const researcherEmail = user.email;

  await Promise.all([
    auth.setCustomUserClaims(researcherID, { usertype: "researcher" }),
    sendEmail(
      researcherEmail,
      "Delete researcher account subject",
      "Dear ${participant name} Your account has been deleted, but we hope some day you change your mind. Please know our door is always open, and we'd love to have you back. We would appreciate if you could answer a few questions on what we could have done better. {survey link} If this is truly is goodbye, we want to thank you once again, for being part of the StudyFind community."
    ),
  ]);

  return addResearcherNotification(
    researcherID,
    DELETE_ACCOUNT,
    "Researcher account Deleted!",
    `Your account was deleted.`
  );
};





