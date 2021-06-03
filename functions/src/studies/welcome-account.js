const { firestore } = require("admin");
const { throwError } = require("utils");

const cleanStudy = require("./__utils__/clean-study");
const fetchStudies = require("./__utils__/fetch-studies");
const generateQuestions = require("./__utils__/generate-questions");

module.exports = async (_, context) => {
  const { uid } = context.auth;
  const { email } = context.auth.token;

  if (!uid) throwError("unauthenticated", "User not logged in");

  const fetchedStudies = await fetchStudies(email);

  const cleanedStudies = fetchedStudies.map((fetched) => {
    const questions = generateQuestions(fetched.additionalCriteria);
    return [fetched.nctID, cleanStudy(fetched, { uid, email, questions })];
  });

  await Promise.all(
    cleanedStudies.map(([id, study]) => firestore.collection("studies").doc(id).set(study))
  );
};
