const { auth } = require("admin");
const { sendEmail } = require("utils");
const { CREATE_ACCOUNT } = require("../../__utils__/notification-codes");

const sendNotificationLocal = require("../../__utils__/send-notification-local");

module.exports = async (snapshot) => {
  const researcherID = snapshot.id;

  const user = await auth.getUser(researcherID);

  const notificationDetails = {
    code: CREATE_ACCOUNT,
    title: "Welcome to StudyFind!",
    description: `Your account has been successfully created as "${user.displayName}". Please verify your email to start creating studies!`,
    link: "https://researcher.studyfind.org",
  };

  const welcomeEmailSubject = "Welcome to StudyFind!";
  const welcomeEmailBody = `
    Hello ${user.displayName},

    We're excited to have you on the StudyFind team!
    Now, you will be able to coordinate and communicate with participants easier and faster than ever!
  `;

  return Promise.allSettled([
    auth.setCustomUserClaims(researcherID, { usertype: "researcher" }),
    sendNotificationLocal(researcherID, "researcher", notificationDetails),
    sendEmail(user.email, welcomeEmailSubject, welcomeEmailBody),
  ]);
};
