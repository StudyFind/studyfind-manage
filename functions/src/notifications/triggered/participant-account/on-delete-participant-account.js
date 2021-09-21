const { firestore } = require("admin");

module.exports = async (snapshot, context) => {
  //Delete all the participant messages and reminders

  //1. Get doc id to determine which meetings to delete
  //const data = snap.data();
  const uid = snapshot.id;

  //2. create a query that selects documents with that id as a member
  const q = firestore.collection("meetings").where("participantID", "==", uid);

  //3. iterate through meetings in the query and delete them
  q.get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
      return true;
    })
    .catch(() => {
      return false;
    });

  const q2 = firestore.collection("reminders").where("participantID", "==", uid);

  q2.get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
      return true;
    })
    .catch(() => {
      return false;
    });
};
// TODO: Send goodbye email
