const admin = require("firebase-admin");
const getOffset = require("./utils/offset-time");
const sendEmail = require("../src/notifications/send-email");
const moment = require("moment");
require("moment-timezone");
const firestore = admin.firestore();

const forEachTimezone = async (fn) => {
  const timezones = moment.tz.zonesForCountry("US", true);

  return Promise.allSettled(
    timezones.map(({ name, offset }) => {
      const offsetInMilliseconds = offset * 60 * 1000;
      const timezoneTime = Date.now() + offsetInMilliseconds;
      const timezoneDate = moment(timezoneTime).tz(name).format("YYYY-MM-DD");
      return fn(timezoneTime, timezoneDate, name);
    })
  );
};

module.exports = async () => {
  // for each timezone offset...
  return forEachTimezone(async (timezoneTime, timezoneDate, timezoneName) => {
    // find all planned reminders

    const remindersSnapshot = await firestore
      .collection("reminders")
      .where("times", "array-contains", getOffset(timezoneTime))
      .where("endDate", ">=", timezoneDate)
      .where("startDate", "<=", timezoneDate)
      .get();

    const reminders = [];

    remindersSnapshot.forEach((r) => reminders.push(r));

    if (!reminders.length) {
      return [];
    }

    return Promise.allSettled(
      reminders.map(async (reminder) => {
        const reminderTitle = reminder.get("title");
        const participantID = reminder.get("participantID");

        const participantSnapshot = await firestore
          .collection("participants")
          .doc(participantID)
          .get();

        const participantTimezone = participantSnapshot.get("timezone");

        if (participantTimezone !== timezoneName) {
          return null;
        }

        return Promise.all([
          firestore
            .collection("participants")
            .doc(participantID)
            .collection("notifications")
            .add({
              type: "upcomingReminder",
              time: Date.now(),
              meta: { title: reminderTitle },
            }),
          // TODO: send emails to both participant depending on their notification preference
          // sendEmail(firestore, auth, researcher.id, email),
          // sendEmail(firestore, auth, m.participantID, email, false),
        ]);
      })
    );
  });
};
