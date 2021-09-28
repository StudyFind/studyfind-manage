const admin = require("firebase-admin");
const { firestore } = require("admin");

const removeStudyIDFromParticipantArray = async (studyID, arrayName) => {
  const snapshot = await firestore
    .collection("participants")
    .where(arrayName, "array-contains", studyID)
    .get();

  snapshot.map((doc) =>
    doc.ref.update({
      [arrayName]: admin.firestore.FieldValue.arrayRemove(studyID),
    })
  );
};

module.exports = (snapshot) => {
  const studyID = snapshot.id;

  removeStudyIDFromParticipantArray(studyID, "enrolled");
  removeStudyIDFromParticipantArray(studyID, "saved");
};
