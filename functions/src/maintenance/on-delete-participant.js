const { firestore } = require("admin");
const { deleteDocumentsInQuery } = require("./__utils__");

module.exports = (snapshot) => {
  // Delete all meeting, reminder and study-participant documents connected to participant account

  const uid = snapshot.id;
  const enrolled = snapshot.get("enrolled");

  const remindersQuery = firestore.collection("reminders").where("participantID", "==", uid);
  const meetingsQuery = firestore.collection("meetings").where("participantID", "==", uid);

  Promise.allSettled([
    deleteDocumentsInQuery(remindersQuery),
    deleteDocumentsInQuery(meetingsQuery),

    Promise.allSettled(
      enrolled.map((studyID) => {
        return firestore
          .collection("studies")
          .doc(studyID)
          .collection("participants")
          .doc(uid)
          .delete();
      })
    ),
  ]);
};
