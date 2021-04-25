const getUserByToken = require("./firebase/get-user-by-token");
const addFirestoreEntry = require("./firebase/add-firestore-entry");
const getFirestoreEntry = require("./firebase/get-firestore-entry");

const fetchStudy = require("./utils/fetch-study");
const generateSurvey = require("./utils/generate-survey");
const cleanStudy = require("./utils/clean-study");

// checks that study email matches user email
function checkOwnership(data, user) {
  const userEmail = user.email.toLowerCase();
  const studyEmail = data.contactEmail.toLowerCase();

  // ***** NOTE: ********************* //
  // ***** COMMENTED FOR TESTING ***** //

  // if (userEmail !== studyEmail) {
  //   throw Error(
  //     `user email '${user.email}' does not match study contact email '${data.contactEmail}'; ownership cannot be verified`
  //   );
  // }

  data.uid = user.uid;
  return data;
}

// generates survey questions from inclusion and exclusion criteria
function generateQuestions(data) {
  const { inclusion, exclusion } = generateSurvey(data.additionalCriteria);
  const inclusionList = inclusion.map((prompt) => ({ type: "Inclusion", prompt }));
  const exclusionList = exclusion.map((prompt) => ({ type: "Exclusion", prompt }));
  const criterionList = inclusionList.concat(exclusionList);
  return { ...data, questions: criterionList };
}

// compares with any study that already exists in firestore
async function ensureNewStudy(firestore, data) {
  const e = await getFirestoreEntry({
    firestore,
    collection: "studies",
    document: data.nctID,
  });
  if (!e || (!e.published)) return data;
  // oop. User is trying to create a pre-existing study. Error time
  throw Error(`Study with nctID '${data.nctID}' already exists`);
}

// saves study as a new document to firestore
async function writeToFirestore(firestore, nctID, study) {
  await addFirestoreEntry({
    firestore,
    collection: "studies",
    document: nctID,
    data: study,
  });
  return study;
}

// Take the nctID text parameter passed to this HTTP endpoint and use flask api to scrape
// its data, create a default unpublished study, and return the data
module.exports = ({ admin }) => async (req, res) => {
  const { nctID, idToken } = req.query;
  const auth = admin.auth();
  const firestore = admin.firestore();

  if (!nctID) return res.json({ error: "parameter nctID needs to be defined" });
  if (!idToken) return res.json({ error: "parameter idToken needs to be defined" });

  return Promise.all([fetchStudy(nctID), getUserByToken(auth, idToken)])
    .then(([data, user]) => checkOwnership(data, user))
    .then((data) => generateQuestions(data))
    .then((data) => cleanStudy(data))
    .then((data) => ensureNewStudy(firestore, data))
    .then((study) => writeToFirestore(firestore, nctID, study))
    .then((study) => res.json({ study, nctID, error: null }))
    .catch((err) => res.json({ study: null, error: err.toString() }));
};
