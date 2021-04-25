const getUserByToken = require("./firebase/get-user-by-token");
const getFirestoreEntry = require("./firebase/get-firestore-entry");
const updateFirestoreEntry = require("./firebase/update-firestore-entry");

const fetchStudyData = require("./utils/fetch-study");
const cleanStudy = require("./utils/clean-study");

// updates existing study in firestore
async function updateFirestore(firestore, nctID, study) {
  const { status, age, sex, control, locations, conditions } = study;
  const updateData = { status, age, sex, control, locations, conditions, updatedAt: Date.now() };
  await updateFirestoreEntry({
    firestore,
    collection: "studies",
    document: nctID,
    data: updateData,
  });
  return study;
}

async function assertOwnership(data, study, user) {
  data.uid = study.researcher.id;

  if (study.researcher.id !== user.uid)
    throw Error(`User ${user.uid} is not allowed to update this study`);
  return data;
}

// Take the nctID text parameter and rescrape associated
// study while preserving some persistant fields
module.exports = ({ admin }) => async (req, res) => {
  const { nctID, idToken } = req.query;
  const auth = admin.auth();
  const firestore = admin.firestore();

  if (!nctID) return res.json({ error: "parameter nctID needs to be defined" });
  if (!idToken) return res.json({ error: "parameter idToken needs to be defined" });

  return Promise.all([
    fetchStudyData(nctID),
    getFirestoreEntry({ firestore, collection: "studies", document: nctID }),
    getUserByToken(auth, idToken),
  ])
    .then(([data, study, user]) => assertOwnership(data, study, user))
    .then((data) => cleanStudy(data))
    .then((study) => updateFirestore(firestore, nctID, study))
    .then((study) => res.json({ study, nctID, error: null }))
    .catch((err) => res.json({ study: null, error: err.toString() }));
};
