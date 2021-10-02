const { auth } = require("admin");
const { sendEmail } = require("utils");

module.exports = async (snapshot) => {
  const participantID = snapshot.id;

  const user = await auth.getUser(participantID);

  const participantName = user.displayName;
  const participantEmail = user.email;

  const goodbyeSurveyLink = "https://google.com";
  const goodbyeEmailSubject = "StudyFind will miss you!";
  const goodbyeEmailBody = `
    Hi ${participantName},

    Dear {participant name},

    Your account has been deleted, but we hope someday you change your mind. Please know our door is always open, and we'd love to have you back. We would appreciate it if you could answer a few questions on what we could have done better.

    Survey Link: ${goodbyeSurveyLink}

    If this is truly is goodbye, we want to thank you once again for being part of the StudyFind community.
  `;

  sendEmail(participantEmail, goodbyeEmailSubject, goodbyeEmailBody);
};
