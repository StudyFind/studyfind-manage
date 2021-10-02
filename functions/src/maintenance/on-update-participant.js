const { firestore } = require("admin");

module.exports = (snapshot) => {
  const uid = snapshot.after.id;
  const before = snapshot.before.data();
  const after = snapshot.after.data();

  const hasTimezoneChanged = before.timezone !== after.timezone;
  const hasAvailabilityChanged = before.availability !== after.availability;

  if (hasTimezoneChanged || hasAvailabilityChanged) {
    const { timezone, availability, enrolled } = after;

    Promise.allSettled(
      enrolled.map((studyID) => {
        return firestore
          .collection("studies")
          .doc(studyID)
          .collection("participants")
          .doc(uid)
          .update({ timezone, availability });
      })
    );
  }
};
