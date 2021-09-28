const { auth } = require("admin");
const { sendEmail } = require("utils");
const { CREATE_ACCOUNT } = require("../../__utils__/notification-codes");
const sendNotificationLocal = require("../../__utils__/send-notification-local");

module.exports = async (snapshot) => {
  const participantID = snapshot.id;

  const user = await auth.getUser(participantID);

  const participantName = user.displayName;
  const participantEmail = user.email;

  const notificationDetails = {
    code: CREATE_ACCOUNT,
    title: "Welcome to StudyFind!",
    description: `Your account has been successfully created as ${participantName}!`,
  };

  const welcomeEmailSubject = "Welcome to StudyFind!";
  const welcomeEmailBody = `
    Hello ${participantName},

    We're excited to have you on the StudyFind team!
    Now, you will be able to find and enroll in studies easier and faster than ever!
  `;

  Promise.allSettled([
    auth.setCustomUserClaims(participantID, { usertype: "participant" }),
    sendNotificationLocal(participantID, "participant", notificationDetails),
    sendEmail(participantEmail, welcomeEmailSubject, welcomeEmailBody),
  ]);
};
