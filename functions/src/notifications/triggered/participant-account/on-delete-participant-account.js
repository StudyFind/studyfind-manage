const { auth } = require("admin");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot) => {
  const participantID = snapshot.id;
  const user = await auth.getUser(participantID);
  const participantName = user.displayName;
  const participantEmail = user.email;

  const subject = "StudyFind will miss you!";
  //removed references to survey
  const text = `"Dear ${participantName},\n Your account has been deleted, but we hope someday you change your mind. Please know our door is always open, and we'd love to have you back. If this is truly is goodbye, we want to thank you once again for being part of the StudyFind community.\n`;

  await sendEmail(participantEmail, subject, text);
};
