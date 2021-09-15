const { firestore } = require("admin");

module.exports = async (snap, context) => {
  //Delete all the researchers studies

  //1. Get doc id to determine which studies to delete
  //const data = snap.data();
  const uid = snap.id;
  //2. create a query that selects documents owned by that id

  // const studiesRef = collection(firestore, "studies");
  // const q = query(studiesRef, where("researcher.id", "==", uid));

  const q = firestore.collection("studies").where("researcher.id", "==", uid);
  //3. iterate through studies in the query and delete them
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
};

// TODO: Send goodbye email
