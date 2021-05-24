const admin = require("firebase-admin");
const cleanStudy = require("./clean-study");
const fetchStudy = require("./fetch-study");
const generateQuestions = require("./generate-questions");
const firestore = admin.firestore();

const ensureNewStudy = async (nctID) => {
  const study = await firestore.collection("studies").doc(nctID);

  if (study && study.published) {
    throw Error(`Study with nctID '${nctID}' already exists in database`);
  }
};

const checkOwnership = (contactEmail, userEmail) => {
  const userEmailLower = userEmail.toLowerCase();
  const contactEmailLower = contactEmail.toLowerCase();

  if (userEmailLower !== contactEmailLower) {
    throw Error("Ownership cannot be verified");
  }
};

module.exports = async (data, context) => {
  try {
    const { uid, email, emailVerified } = context.auth;
    const { nctID } = data;

    if (!nctID) throw Error("Parameter nctID needs to be defined");
    if (!emailVerified) throw Error("User email is not verified");

    ensureNewStudy();

    const fetched = await fetchStudy(nctID);
    const questions = generateQuestions(fetched.additionalCriteria);

    checkOwnership(fetched.contactEmail, email);

    const cleaned = cleanStudy(fetched, { questions, uid, email });
    return await firestore.collection("studies").doc(nctID).set(cleaned);
  } catch (e) {
    return { error: e.message };
  }
};
