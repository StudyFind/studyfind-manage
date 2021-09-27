const onTriggerStudy = require("./on-trigger-study");
const { firestore } = require("admin");
module.exports = async (snapshot, context) => {
  onTriggerStudy(snapshot, "CREATE_STUDY");
  const uid = snapshot.id;

  const q = firestore.collection("participants").where("enrolled", "array-contains", uid);
  const promise = await q
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const ref = doc.ref;
        const dat = doc.data();
        const arr = dat.enrolled;

        const index = arr.indexOf(uid);
        if (index > -1) {
          arr.splice(index, 1);
        }
        return ref.set(arr);
      });
      return null;
    })
    .catch(() => {
      return promise;
    });
};

/*

Researcher
----------
title: "Study Deleted"
body: "You deleted study ${meta.study.id}`
icon: FiFileMinus
color: "red.500"
background: "red.100"

*/
