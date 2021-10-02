const { auth } = require("admin");
const moment = require("moment-timezone");

const { firestore } = require("admin");
const { getDocument, getCollection } = require("utils");
const { REMINDER_NOW } = require("../__utils__/notification-codes");
const sendNotification = require("notifications/__utils__/send-notification");

const getWeeklyOffset = (time) => {
  const MILLIS_IN_WEEK = 604800000;
  const MILLIS_IN_30_MINS = 1800000;
  return Math.floor((time % MILLIS_IN_WEEK) / MILLIS_IN_30_MINS) * MILLIS_IN_30_MINS;
};

const forEachTimezone = async (fn) => {
  const timezones = moment.tz.zonesForCountry("US", true);

  return Promise.allSettled(
    timezones.map(({ name, offset }) => {
      const offsetInMilliseconds = offset * 60 * 1000;
      const timezoneTime = moment().utc().valueOf() + offsetInMilliseconds;
      const timezoneDate = moment(timezoneTime).tz(name).format("YYYY-MM-DD");
      return fn(timezoneTime, timezoneDate, name);
    })
  );
};

module.exports = async () => {
  return forEachTimezone(async (timezoneTime, timezoneDate, timezoneName) => {
    const reminders = await getCollection(
      firestore
        .collection("reminders")
        .where("times", "array-contains", getWeeklyOffset(timezoneTime))
        .where("endDate", ">=", timezoneDate)
        .where("startDate", "<=", timezoneDate)
    );

    return Promise.allSettled(
      reminders.map(async (reminder) => {
        const participantRef = firestore.collection("participants").doc(reminder.participantID);
        const participant = await getDocument(participantRef);

        return (
          participant.timezone === timezoneName &&
          sendNotification(participant, "participant", {
            code: REMINDER_NOW,
            title: reminder.title,
            description: `This is a reminder set by the researcher to notify you. Click here to view the reminder details`,
            link: `https://studyfind.org/your-studies/${reminder.studyID}/reminders`,
          })
        );
      })
    );
  });
};
