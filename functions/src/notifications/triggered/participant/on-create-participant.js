const { auth } = require("admin");
const { sendEmail } = require("utils");
const { CREATE_ACCOUNT } = require("../../__utils__/notification-codes");
const sendNotificationLocal = require("../../__utils__/send-notification-local");

module.exports = async (snapshot) => {
  const participantID = snapshot.id;

  const user = await auth.getUser(participantID);

  const notificationDetails = {
    code: CREATE_ACCOUNT,
    title: "Welcome to StudyFind!",
    description: `Your account has been successfully created as ${user.displayName}. Please verify your email to start enrolling in studies!`,
    link: "https://studyfind.org",
  };

  const welcomeEmailSubject = "Welcome to StudyFind!";
  const welcomeEmailBody = `
    Hello ${user.displayName},

    We're excited to have you on the StudyFind team!
    Now, you will be able to find and enroll in studies easier and faster than ever!
  `;

  Promise.allSettled([
    auth.setCustomUserClaims(participantID, { usertype: "participant" }),
    sendNotificationLocal(participantID, "participant", notificationDetails),
    sendEmail(user.email, welcomeEmailSubject, welcomeEmailBody),
  ]);
};
