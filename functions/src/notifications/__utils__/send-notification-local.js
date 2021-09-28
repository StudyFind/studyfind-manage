const moment = require("moment-timezone");

const { firestore } = require("admin");

module.exports = async (userID, userType, notificationDetails) => {
  const now = moment().utc().valueOf();

  const notification = {
    ...notificationDetails,
    read: false,
    time: now,
  };

  return firestore
    .collection(`${userType}s`)
    .doc(userID)
    .collection("notifications")
    .add(notification);
};
