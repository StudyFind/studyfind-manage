const { auth } = require("admin");
const { CREATE_ACCOUNT } = require("../../__utils__/notification-codes");
const { addResearcherNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot) => {
  const researcherID = snapshot.id;
  const user = await auth.getUser(researcherID);
  const researcherName = user.displayName;
  const researcherEmail = user.email;

  await Promise.all([
    auth.setCustomUserClaims(researcherID, { usertype: "researcher" }),
    sendEmail(
      researcherEmail,
      "Create researcher account subject",
      "Create researcher account text"
    ),
  ]);

  return addResearcherNotification(
    researcherID,
    CREATE_ACCOUNT,
    "Researcher account created!",
    `Hello ${researcherName}! Welcome to StudyFind!`
  );
};
