const admin = require("firebase-admin");
const { firestore } = require("admin");

const appendStudyIDToParticipantEnrolled = async (participantID, studyID) => {
  firestore
    .collection("participants")
    .doc(participantID)
    .update({
      enrolled: admin.firestore.FieldValue.arrayUnion(studyID),
    });
};

module.exports = (snapshot, context) => {
  const participantID = snapshot.id;
  const studyID = context.studyID;

  appendStudyIDToParticipantEnrolled(participantID, studyID);
};
