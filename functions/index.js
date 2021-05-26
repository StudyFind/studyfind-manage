const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// ======================== //
// ======== CLAIMS ======== //
// ======================== //
const setResearcherClaim = require("./src/custom-claims/set-researcher-claim");
const setParticipantClaim = require("./src/custom-claims/set-participant-claim");

exports.setResearcherClaim = functions.https.onCall(setResearcherClaim);
exports.setParticipantClaim = functions.https.onCall(setParticipantClaim);

// ========================= //
// ======== STUDIES ======== //
// ========================= //
const createStudy = require("./src/studies/create-study");
const updateStudy = require("./src/studies/update-study");
const welcomeAccount = require("./src/studies/welcome-account");

exports.createStudy = functions.https.onCall(createStudy);
exports.updateStudy = functions.https.onCall(updateStudy);
exports.welcomeAccount = functions.https.onCall(welcomeAccount);

// =========================== //
// ======== TRIGGERED ======== //
// =========================== //
const onCreateAccount = require("./src/notifications/triggered/on-create-account");
const onCreateStudy = require("./src/notifications/triggered/on-create-study");
const onDeleteStudy = require("./src/notifications/triggered/on-delete-study");
const onNewParticipant = require("./src/notifications/triggered/on-new-participant");

exports.onCreateAccount = functions.firestore
  .document("researchers/{researcherID}")
  .onCreate(onCreateAccount);
exports.onCreateStudy = functions.firestore.document("studies/{studyID}").onCreate(onCreateStudy);
exports.onDeleteStudy = functions.firestore.document("studies/{studyID}").onDelete(onDeleteStudy);
exports.onNewParticipant = functions.firestore
  .document("studies/{studyID}/participants/{participantID}")
  .onCreate(onNewParticipant);

// =========================== //
// ======== SCHEDULED ======== //
// =========================== //
const remindersRunner = require("./src/notifications/scheduled/reminders");
const meetingsRunner = require("./src/notifications/scheduled/meetings");

exports.notificationsRunner = functions.pubsub
  .schedule("*/30 * * * *")
  .onRun(() => Promise.allSettled([remindersRunner(), meetingsRunner()]));
