const { auth } = require("admin");
const { CREATE_ACCOUNT } = require("../../__utils__/notification-codes");
const { addResearcherNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot) => {
  const researcherID = snapshot.id;
  const user = await auth.getUser(researcherID);
  const researcherName = user.displayName;
  const researcherEmail = user.email;

  const subject = "Researcher Account Created!";
  const text = `Hello ${researcherName}! Welcome to StudyFind!`;

  await Promise.all([
    auth.setCustomUserClaims(researcherID, { usertype: "researcher" }),
    sendEmail(researcherEmail, subject, text),
  ]);

  return addResearcherNotification(researcherID, CREATE_ACCOUNT, subject, text);
};
