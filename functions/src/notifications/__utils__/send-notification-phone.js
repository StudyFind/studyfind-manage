const { firestore } = require("admin");

module.exports = async (phone, notificationDetails, notificationSettingsLink) => {
  const formattedPhone = `+1${phone}`;

  return firestore.collection("sms").add({
    to: formattedPhone,
    channelId: "3c9a0fc00c3541b4900fed78a71589fe",
    type: "text",
    content: {
      text: `
        ${notificationDetails.title}

        ${notificationDetails.description}

        Click here to view updates: ${notificationDetails.link}
        Click here to update notification settings: ${notificationSettingsLink}
      `,
    },
  });
};
