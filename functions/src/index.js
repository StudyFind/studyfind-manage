const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// =========================== //
// ======== TRIGGERED ======== //
// =========================== //

// NOTIFICATION
const onCreateResearcherNotification = require("./notifications/triggered/researcher/on-create-researcher");
const onDeleteResearcherNotification = require("./notifications/triggered/researcher/on-delete-researcher");

const onCreateParticipantNotification = require("./notifications/triggered/participant/on-create-participant");
const onDeleteParticipantNotification = require("./notifications/triggered/participant/on-delete-participant");

const onCreateStudyNotification = require("./notifications/triggered/study/on-create-study");
const onDeleteStudyNotification = require("./notifications/triggered/study/on-delete-study");

const onCreateReminderNotification = require("./notifications/triggered/reminder/on-create-reminder");
const onUpdateReminderNotification = require("./notifications/triggered/reminder/on-update-reminder");
const onDeleteReminderNotification = require("./notifications/triggered/reminder/on-delete-reminder");

const onCreateMeetingNotification = require("./notifications/triggered/meeting/on-create-meeting");
const onUpdateMeetingNotification = require("./notifications/triggered/meeting/on-update-meeting");
const onDeleteMeetingNotification = require("./notifications/triggered/meeting/on-delete-meeting");

const onCreateStudyParticipantNotification = require("./notifications/triggered/study-participant/on-create-study-participant");
const onUpdateStudyParticipantNotification = require("./notifications/triggered/study-participant/on-create-study-participant");

// MAINTENANCE
const onDeleteStudyMaintenance = require("./maintenance/on-delete-study");

const onUpdateResearcherMaintenance = require("./maintenance/on-update-researcher");
const onDeleteResearcherMaintenance = require("./maintenance/on-delete-researcher");

const onUpdateParticipantMaintenance = require("./maintenance/on-update-participant");
const onDeleteParticipantMaintenance = require("./maintenance/on-delete-participant");

const setUsertypeCustomClaim = require("./claims/set-usertype-custom-claim");

const researchersRef = functions.firestore.document("researchers/{researcherID}");
const participantsRef = functions.firestore.document("participants/{participantID}");
const studiesRef = functions.firestore.document("studies/{studyID}");
const remindersRef = functions.firestore.document("reminders/{reminderID}");
const meetingsRef = functions.firestore.document("meetings/{meetingID}");
const studyParticipantsRef = functions.firestore.document(
  "studies/{studyID}/participants/{participantID}"
);

exports.onCreateResearcher = researchersRef.onCreate((snapshot, context) => {
  onCreateResearcherNotification(snapshot, context);
  setUsertypeCustomClaim(snapshot.id, "RESEARCHER");
});
exports.onUpdateResearcher = researchersRef.onUpdate(onUpdateResearcherMaintenance);
exports.onDeleteResearcher = researchersRef.onDelete((snapshot, context) => {
  onDeleteResearcherNotification(snapshot, context);
  onDeleteResearcherMaintenance(snapshot, context);
});

exports.onCreateParticipant = participantsRef.onCreate((snapshot, context) => {
  onCreateParticipantNotification(snapshot, context);
  setUsertypeCustomClaim(snapshot.id, "PARTICIPANT");
});
exports.onUpdateResearcher = researchersRef.onUpdate(onUpdateParticipantMaintenance);
exports.onDeleteParticipant = participantsRef.onDelete((snapshot, context) => {
  onDeleteParticipantNotification(snapshot, context);
  onDeleteParticipantMaintenance(snapshot, context);
});

exports.onCreateStudy = studiesRef.onCreate(onCreateStudyNotification);
exports.onDeleteStudy = studiesRef.onDelete((snapshot, context) => {
  onDeleteStudyNotification(snapshot, context);
  onDeleteStudyMaintenance(snapshot, context);
});

exports.onCreateReminder = remindersRef.onCreate(onCreateReminderNotification);
exports.onUpdateReminder = remindersRef.onUpdate(onUpdateReminderNotification);
exports.onDeleteReminder = remindersRef.onDelete(onDeleteReminderNotification);

exports.onCreateMeeting = meetingsRef.onCreate(onCreateMeetingNotification);
exports.onUpdateMeeting = meetingsRef.onUpdate(onUpdateMeetingNotification);
exports.onDeleteMeeting = meetingsRef.onDelete(onDeleteMeetingNotification);

exports.onCreateStudyParticipant = studyParticipantsRef.onCreate(
  onCreateStudyParticipantNotification
);
exports.onUpdateStudyParticipant = studyParticipantsRef.onCreate(
  onUpdateStudyParticipantNotification
);

// =========================== //
// ======== SCHEDULED ======== //
// =========================== //
const remindersRunner = require("./notifications/scheduled/reminders");
const meetingsRunner = require("./notifications/scheduled/meetings");

exports.notificationsRunner = functions.pubsub
  .schedule("*/30 * * * *")
  .onRun(() => Promise.allSettled([remindersRunner(), meetingsRunner()]));
