const { firestore } = require("admin");

module.exports = async (email, notificationDetails, notificationSettingsLink) => {
  return firestore.collection("mail").add({
    to: email,
    message: {
      subject: notificationDetails.title,
      html: `
        ${notificationDetails.description}

        Click <a href="${notificationDetails.link}">here</a> to view updates
        Click <a href="${notificationSettingsLink}">here</a> to update notification settings
      `,
    },
  });
};
