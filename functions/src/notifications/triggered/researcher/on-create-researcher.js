const { auth } = require("admin");
const { sendEmail } = require("utils");
const { CREATE_ACCOUNT } = require("../../__utils__/notification-codes");

const sendNotificationLocal = require("../../__utils__/send-notification-local");

module.exports = async (snapshot) => {
  const researcherID = snapshot.id;

  const user = await auth.getUser(researcherID);

  const researcherName = user.displayName;
  const researcherEmail = user.email;

  const notificationDetails = {
    code: CREATE_ACCOUNT,
    title: "Welcome to StudyFind!",
    description: `Your account has been successfully created as ${researcherName}!`,
  };

  const welcomeEmailSubject = "Welcome to StudyFind!";
  const welcomeEmailBody = `
    Hello ${researcherName},

    We're excited to have you on the StudyFind team!
    Now, you will be able to coordinate and communicate with participants easier and faster than ever!
  `;

  Promise.allSettled([
    auth.setCustomUserClaims(researcherID, { usertype: "researcher" }),
    sendNotificationLocal(researcherID, "researcher", notificationDetails),
    sendEmail(researcherEmail, welcomeEmailSubject, welcomeEmailBody),
  ]);
};
