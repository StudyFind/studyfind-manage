const sendEmail = require("../../__utils__/send-email");

module.exports = async (user) => {
  const participantEmail = user.email;
  await sendEmail(participantEmail, "Delete email subject", "Delete email text");
};
