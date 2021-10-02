const { firestore } = require("admin");

module.exports = async (to, subject, text) => {
  return firestore.collection("mail").add({
    to,
    message: {
      subject,
      text,
    },
  });
};
