const { auth } = require("admin");
const moment = require("moment-timezone");

const { firestore } = require("admin");
const { getDocument, getCollection } = require("utils");
const { REMINDER_NOW } = require("../__utils__/notification-codes");
const { addParticipantNotification } = require("../__utils__/database");
const sendEmail = require("../__utils__/send-email");
const sendPhone = require("../__utils__/send-phone");

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
      const timezoneTime = Date.now() + offsetInMilliseconds;
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

        if (participant.timezone === timezoneName) {
          const subject = `${reminder.title}`;
          const text = `This is a reminder for study ${reminder.studyID}.`;

          if (participant.notifications?.email) {
            const user = await auth.getUser(reminder.participantID);
            const participantEmail = user.email;
            await sendEmail(
              participantEmail,
              subject,
              `${text}\n To unsubscribe from these notifications, please visit: https://studyfind.org/account/notifications/`
            );
          }

          if (participant.notifications?.phone) {
            const participantPhone = participant.phone;
            participantPhone &&
              /\d\d\d\d\d\d\d\d\d\d/.test(participantPhone) &&
              (await sendPhone(
                `+1${participantPhone}`,
                `${subject}\n To unsubscribe visit: https://studyfind.org/account/notifications/`
              ));
          }

          addParticipantNotification(reminder.participantID, REMINDER_NOW, subject, text);
        }
      })
    );
  });
};
