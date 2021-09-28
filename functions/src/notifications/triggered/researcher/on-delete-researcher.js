const { auth } = require("admin");
const { sendEmail } = require("utils");

module.exports = async (snapshot) => {
  const participantID = snapshot.id;

  const user = await auth.getUser(participantID);

  const participantName = user.displayName;
  const participantEmail = user.email;

  const goodbyeSurveyLink = "https://google.com";
  const goodbyeEmailSubject = "We're sad to see you go...";
  const goodbyeEmailBody = `
    Hi ${participantName},

    We at StudyFind appreciated working with you and are sad to see you go. We would truly appreciate learning the reason behind your cancelation, so we can continue improving our services. Click <a href="${goodbyeSurveyLink}">here</a> to tell us what we could have done differently. We want to thank you for choosing StudyFind and hope you'll join again in the future.

    Sincerely,
    The StudyFind Team
  `;

  sendEmail(participantEmail, goodbyeEmailSubject, goodbyeEmailBody);
};
