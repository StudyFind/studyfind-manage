const { firestore } = require("admin");

module.exports = async (change, context) => {
  //Updating a researcher name updates their name in their studies

  //1. Get old doc and new doc to see if name was changed

  const old = change.before.data();
  const current = change.after.data();
  if (old["name"] !== current["name"]) {
    const uid = change.after.id;
    //2. create a query that selects documents owned by that id

    const q = firestore.collection("studies").where("researcher.id", "==", uid);
    //3. iterate through studies in the query and update them
    const promise = await q
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({ "researcher.name": current["name"] });
        });
        return true;
      })
      .catch(() => {
        return promise;
      });
  }
};
