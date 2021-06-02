const { firestore } = require("admin");

const cleanStudy = require("__utils__/clean-study");
const fetchStudies = require("__utils__/fetch-studies");
const generateQuestions = require("__utils__/generate-questions");

module.exports = async (_, context) => {
  const { uid } = context.auth;
  const { email } = context.auth.token;

  const fetchedStudies = await fetchStudies(email);

  const cleanedStudies = fetchedStudies.map((study) => {
    const questions = generateQuestions(study);
    return [study.nctID, cleanStudy(study, { uid, email, questions })];
  });

  await Promise.all(
    cleanedStudies.map(([id, study]) => firestore.collection("studies").doc(id).set(study))
  );
};
