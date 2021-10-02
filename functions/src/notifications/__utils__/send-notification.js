const { auth } = require("admin");

const sendNotificationEmail = require("../../__utils__/send-notification-email");
const sendNotificationPhone = require("../../__utils__/send-notification-phone");
const sendNotificationLocal = require("./send-notification-local");

module.exports = async (userData, userType, notificationDetails) => {
  const promises = [sendNotificationLocal(userData.id, userType, notificationDetails)];

  const emailEnabled = userData?.notifications?.email;
  const phoneEnabled = userData?.notifications?.phone;

  const notificationSettingsLink = {
    participant: `https://studyfind.org/account/notifications`,
    researcher: `https://researcher.studyfind.org/account/notifications`,
  }[userType];

  const user = await auth.getUser(userData.id);
  const plan = user.customClaims.userplan;

  if (plan === "standard" && emailEnabled) {
    const email = user.email;

    promises.append(sendNotificationEmail(email, notificationDetails, notificationSettingsLink));
  }

  if (plan === "premium" && phoneEnabled) {
    const phone = userData.phone;

    // checks if phone is valid (has 10 digits)
    if (phone.length === 10 && phone.match(/^[0-9]+$/) !== null) {
      promises.append(sendNotificationPhone(phone, notificationDetails, notificationSettingsLink));
    }
  }

  Promise.allSettled(promises);
};
