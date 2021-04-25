const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const context = { admin };

// ***** Http Functions *****

// note that switch func contains all http functions
const switchFunc = require("./src/switch-func");
exports.studies = functions.https.onRequest(switchFunc(context));
// const makeStudy = require('./src/make-study');
// exports.makeStudy = functions.https.onRequest(makeStudy(context));

// ***** Cron Functions *****
// note, these will not work in emulator. Automatic testing is paramount

const remindersRunner = require("./src/reminders-runner.js")(context);
const meetingRunner = require("./src/meeting-runner")(context);
exports.remindersRunner = functions.pubsub.schedule("*/30 * * * *").onRun(async () => await Promise.allSettled([
    remindersRunner(),
    meetingRunner(),
]));

// ***** Cloud Trigger Functions ******

const {
    onCreateStudy, onDeleteStudy,
    onNewParticipant,
    onCreateResearcherAccount } = require("./src/notification-triggers.js");
exports.createStudyNotificationTrigger = functions.firestore.document("studies/{studyID}")
    .onCreate(onCreateStudy(context));
exports.deleteStudyNotificationTrigger = functions.firestore.document("studies/{studyID}")
    .onDelete(onDeleteStudy(context));
exports.newParticipantNotificationTrigger = functions.firestore.document("studies/{studyID}/participants/{participantID}")
    .onCreate(onNewParticipant(context));
exports.newResearcherAccountNotificationTrigger = functions.firestore.document("researchers/{researcherID}")
    .onCreate(onCreateResearcherAccount(context));