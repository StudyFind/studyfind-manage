const { firestore } = require("admin");

module.exports = async (email, notificationDetails, notificationSettingsLink) => {
  return firestore.collection("mail").add({
    to: email,
    message: {
      subject: notificationDetails.title,
      text: `
        ${notificationDetails.description}

        Click here to view updates: ${notificationDetails.link}
        Click here to update notification settings: ${notificationSettingsLink}
      `,
    },
  });
};
