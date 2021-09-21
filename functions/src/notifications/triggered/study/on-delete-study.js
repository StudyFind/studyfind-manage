const onTriggerStudy = require("./on-trigger-study");
const { firestore } = require("admin");
module.exports = async (snapshot) => {
  onTriggerStudy(snapshot, "CREATE_STUDY");
  const uid = snapshot.id;

  const q = firestore.collection("participants").where("enrolled", "array-contains", uid);
  q.get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const ref = doc.ref;
        const arr = doc.get();
        const index = arr.indexOf(uid);
        if (index > -1) {
          arr.splice(index, 1);
        }
        ref.set(arr);
      });
      return true;
    })
    .catch(() => {
      return false;
    });
  return true;
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
