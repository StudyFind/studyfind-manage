const { auth } = require("admin");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot) => {
  const researcherID = snapshot.id;
  const user = await auth.getUser(researcherID);
  const researcherName = user.displayName;
  const researcherEmail = user.email;

  const subject = `${researcherName} Account Deletion Request`;
  //removed references to survey and pricing for now, not sure how to access
  const text = `Dear ${researcherName},\n We at StudyFind appreciated working with you. As per your request, your subscription has been ended. We want to thank you for choosing StudyFind and hope you'll join again in the future.\n Sincerely,\n The StudyFind Team`;

  await sendEmail(researcherEmail, subject, text);
};
