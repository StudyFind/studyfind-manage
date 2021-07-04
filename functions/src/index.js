const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// ========================= //
// ======== STUDIES ======== //
// ========================= //
const createStudy = require("./studies/create-study");
const updateStudy = require("./studies/update-study");
const welcomeAccount = require("./studies/welcome-account");

exports.createStudy = functions.https.onCall(createStudy);
exports.updateStudy = functions.https.onCall(updateStudy);
exports.welcomeAccount = functions.https.onCall(welcomeAccount);

// ========================================= //
// ======== TRIGGERED NOTIFICATIONS ======== //
// ========================================= //
const onCreateResearcherAccount = require("./notifications/triggered/on-create-researcher-account");
const onCreateParticipantAccount = require("./notifications/triggered/on-create-participant-account");

const onCreateStudy = require("./notifications/triggered/on-create-study");
const onDeleteStudy = require("./notifications/triggered/on-delete-study");
const onNewParticipant = require("./notifications/triggered/on-new-participant");
const onCreateMeeting = require("./notifications/triggered/on-create-meetings");

exports.onResearcherCreateAccount = functions.firestore
  .document("researchers/{researcherID}")
  .onCreate(onCreateResearcherAccount);

exports.onParticipantCreateAccount = functions.firestore
  .document("participants/{participantID}")
  .onCreate(onCreateParticipantAccount);

exports.onCreateStudy = functions.firestore.document("studies/{studyID}").onCreate(onCreateStudy);
exports.onDeleteStudy = functions.firestore.document("studies/{studyID}").onDelete(onDeleteStudy);
exports.onCreateMeeting = functions.firestore.document("meetings/{studyID}").onCreate(onCreateMeeting);
exports.onNewParticipant = functions.firestore
  .document("studies/{studyID}/participants/{participantID}")
  .onCreate(onNewParticipant);

// ========================================= //
// ======== SCHEDULED NOTIFICATIONS ======== //
// ========================================= //
const remindersRunner = require("./notifications/scheduled/reminders");
const meetingsRunner = require("./notifications/scheduled/meetings");

exports.notificationsRunner = functions.pubsub
  .schedule("*/30 * * * *")
  .onRun(() => Promise.allSettled([remindersRunner(), meetingsRunner()]));
