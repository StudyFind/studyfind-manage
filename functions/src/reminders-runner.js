// functions/src/reminders-runner.js
const { logger } = require("firebase-functions");
const getOffset = require("./utils/offset-time");
const moment = require('moment');
require('moment-timezone');


/**
 * Perform a given async action for each timezone (all 24).
 * @param {number} now current timestamp
 * @param {function} fn action to perform for each timezone time. Will be passed timezone time and offset
 * @returns {[Promise<any>]} list of promises corresponding to action taken for each timezone
 */
const forEachTimezone = async(now, fn) => {
	const HOUR = 3600000; // in milliseconds: mill * seconds * minutes == 1000 * 60 * 60 == 
	const offsets = Array.from(
		Array.from(Array(24).keys()).map(t => HOUR * (t-12))
	);
	return Promise.allSettled(offsets.map(o => fn(now+o, o)));
}

/**
 * Perform a given async action for each reminder that potentially needs to be set. We don't
 * exactly know the timezone of each reminder, so query range +-12 and attach to user timezone.
 * Relevant query docs: https://firebase.google.com/docs/firestore/query-data/queries
 * @param {number} now current timestamp
 * @param {function} fn action to perform with each pending reminder. Will be passed a firestore snapshot
 * @param {firestore} firestore firestore ref
 * @returns {[Promise<any>]} list of promises corresponding to the action taken for each reminder
 */
const forEachPendingReminder = async (globalTime, fn, firestore) => {
	// for each timezone offset...
	return forEachTimezone(globalTime, async(timezoneTime, timezoneOffset) => {

		// find all planned reminders
		const remindersData = await firestore.collection("reminders")
			.where("times", "array-contains", getOffset(timezoneTime))
			.where("endDate", ">", timezoneTime)
			.get();
		let reminders = [];
		remindersData.forEach(r => reminders.push(r));
		reminders = reminders.filter(r => r.data().startDate <= timezoneTime); // filter if haven't started yet
		if (reminders.length === 0) return [];
		// for each planned reminder...
		return Promise.allSettled(reminders.map(async r => {
			// get participant timezone
			const participantData = await firestore
				.collection("participants").doc(r.get('participantID'))
				.get();
			const participantTimezone = participantData.get('timezone');
			const participantOffset = moment().tz(participantTimezone).utcOffset() * 60 * 1000; // convert minutes to milliseconds
			if (participantOffset !== timezoneOffset) return null;
			return fn(r);
		}));

	})
		.then(resp => resp.map(r => r.value).flat());

}


/**
 * Detects errors, figures out what happened and presents everything readably
 * @param {[Promise<any>]} r list of promises corresponding to each each participant-update transaction sent 
 */
const logResponse = r => {
	logger.info(`scheduled reminders run: ${r.length} participants have been updated`);

	const errors = r.filter(i => i.status !== "fulfilled").map(i => i.reason);
	if (errors.length === 0) return

	console.error(`${r.length} scheduled reminders run with ${errors.length} errors detected:\n${errors.map(r => r.stack).join("\n")}`);
}


module.exports = ({ admin }) => async () => {
	const firestore = admin.firestore();
	const now = Date.now();

	// STEPS:
	// do a query filter for all reminders that need to be sent
	//   by time (adjusting for timezone), start+endDate
	// open transaction for each reminder, append to user, update reminder lastReminded

	const resp = await forEachPendingReminder(now, async snap => {
		// for each pending reminder	
		const r = snap.data();
		return firestore.runTransaction(async t => {
			// get referenced study participant
			const participant = await t.get(firestore
				.collection("studies").doc(r.studyID)
				.collection("participants").doc(r.participantID)
			);
			if (!participant.exists) throw Error(`Participant ${r.participantID} from study ${r.studyID} not found`);
			const data = participant.data();

			// update their reminders
			await t.update(
				firestore.collection("studies").doc(r.studyID)
				.collection("participants").doc(r.participantID),
				{ currentReminders: data.currentReminders ? data.currentReminders.concat(r.title) : [r.title] }
			);
			return true
		})
	}, firestore);

	logResponse(resp);

	return resp;
}
