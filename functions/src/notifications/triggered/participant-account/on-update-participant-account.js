const { firestore } = require("admin");

module.exports = async (snapshot, context) => {
  const uid = snapshot.after.id;
  const prev = snapshot.before.data();
  const dat = snapshot.after.data();
  if (prev.timezone !== dat.timezone) {
    const timezone = dat["timezone"];
    const studies = dat["enrolled"];

    const result = await Promise.allSettled(
      studies.map((study) => {
        return firestore
          .collection("studies")
          .doc(study)
          .collection("participants")
          .doc(uid)
          .update({ timezone: timezone });
      })
    );
  }
  return null;
};
