// functions/src/meeting-runner.js
const { logger } = require("firebase-functions");
const getOffset = require("./utils/offset-time");
const defaults = require("./utils/make-notification");
const sendEmail = require("./firebase/send-email");

/**
 * Perform a given async action for each meeting scheduled for now
 * @param {number} now current timestamp
 * @param {function} fn action to perform for each scheduled meeting
 * @param {firestore} firestore firestore ref
 */
const forEachScheduledMeeting = async (now, fn, firestore) => {
	const offset = getOffset(now);
	const meetingsData = await firestore.collection("meetings")
		.where("time", "==", offset)
		.get();
	if (meetingsData.empty) return [];

	const meetings = [];
	meetingsData.forEach(m => meetings.push(m));
	return Promise.allSettled(meetings.map(fn));
}

/**
 * Detects errors, figures out what happened and presents everything readably
 * @param {[Promise<any>]} r list of promises corresponding to each action taken on scheduled meetings 
 */
const logResponse = r => {
	if (r.length <= 0) return;
	logger.info(`scheduled meetings notification run: ${r.length} meetings notified`);

	const errors = r.filter(i => i.status !== "fulfilled").map(i => i.reason);
	if (errors.length <= 0) return;
	console.error(`${r.length} meeting notifications run with ${errors.length} errors detected:\n${errors.map(r => r.stack).join("\n")}`);
}

module.exports = ({ admin }) => async () => {
	const firestore = admin.firestore();
	const auth = admin.auth();
	const now = Date.now();

	// note: reminders runner has similar structure
	// more comments there

	const resp = await forEachScheduledMeeting(now, async snap => {
		// build notification
		const m = snap.data();
		const notification = {
			...defaults(),
			title: "Meeting Happening Now!",
			description: "You have a pending meeting",
			type: "Meeting",
			time: now,
		}
		const email = {
			subject: notification.title,
			html: `<p>${notification.description}</p>`
		}

		// get referenced study researcher id
		const studySnap = await firestore.collection("studies").doc(m.studyID).get();
		if (!studySnap.exists)
			throw Error(`Study ${m.studyID} referenced does not exist`);
		const researcher = studySnap.get("researcher");

		return Promise.all([
			// update researcher / participant notifications
			firestore.collection("researchers").doc(researcher.id).collection("notifications").add(notification),
			firestore.collection("participants").doc(m.participantID).collection("notifications").add(notification),
			// send emails to both researcher and participant
			sendEmail(firestore, auth, researcher.id, email),
			sendEmail(firestore, auth, m.participantID, email, false),
		])
	}, firestore);

	logResponse(resp);

	return resp;
}
