const functions = require("firebase-functions");

// ======== CLAIMS ======== //
const setResearcherClaim = require("./src/custom-claims/set-researcher-claim");
const setParticipantClaim = require("./src/custom-claims/set-participant-claim");

exports.setResearcherClaim = functions.https.onCall(setResearcherClaim);
exports.setParticipantClaim = functions.https.onCall(setParticipantClaim);

// ======== STUDIES ======== //
const createStudy = require("./src/studies/create-study");
const updateStudy = require("./src/studies/update-study");
const welcomeAccount = require("./src/studies/welcome-account");

exports.createStudy = functions.https.onCall(createStudy);
exports.updateStudy = functions.https.onCall(updateStudy);
exports.welcomeAccount = functions.https.onCall(welcomeAccount);

// ======== TRIGGERED ======== //
const onCreateAccount = require("./src/notifications/triggered/on-create-account");
const onCreateStudy = require("./src/notifications/triggered/on-create-study");
const onDeleteStudy = require("./src/notifications/triggered/on-delete-study");
const onNewParticipant = require("./src/notifications/triggered/on-new-participant");

const researcherRef = functions.firestore.document("researchers/{researcherID}");
const studyRef = functions.firestore.document("studies/{studyID}");
const studyParticipantRef = functions.firestore.document(
  "studies/{studyID}/participants/{participantID}"
);

exports.onCreateAccount = researcherRef.onCreate(onCreateAccount);
exports.onCreateStudy = studyRef.onCreate(onCreateStudy);
exports.onDeleteStudy = studyRef.onDelete(onDeleteStudy);
exports.onNewParticipant = studyParticipantRef.onCreate(onNewParticipant);

// ======== SCHEDULED ======== //
const remindersRunner = require("./src/notifications/scheduled/reminders");
const meetingsRunner = require("./src/notifications/scheduled/meetings");

exports.remindersRunner = functions.pubsub
  .schedule("*/30 * * * *")
  .onRun(() => Promise.allSettled([remindersRunner(), meetingsRunner()]));
