const { firestore } = require("admin");
const { deleteDocumentsInQuery } = require("./__utils__");

module.exports = (snapshot) => {
  // Delete all meeting, reminder and study documents connected to researcher account

  const uid = snapshot.id;

  const remindersQuery = firestore.collection("reminders").where("researcherID", "==", uid);
  const meetingsQuery = firestore.collection("meetings").where("researcherID", "==", uid);
  const studiesQuery = firestore.collection("studies").where("researcher.id", "==", uid);

  deleteDocumentsInQuery(remindersQuery);
  deleteDocumentsInQuery(meetingsQuery);
  deleteDocumentsInQuery(studiesQuery);
};
