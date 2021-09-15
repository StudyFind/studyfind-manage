const { throwError } = require("utils");

const cleanStudy = require("./__utils__/clean-study");
const fetchStudy = require("./__utils__/fetch-study");
const generateQuestions = require("./__utils__/generate-questions");

module.exports = async (data, context) => {
  const { uid } = context.auth;
  const { email } = context.auth.token;
  const { nctID } = data;

  if (!uid) throwError("unauthenticated", "User not logged in");
  if (!nctID) throwError("invalid-argument", "Parameter nctID needs to be defined");

  const fetched = await fetchStudy(nctID);
  const questions = generateQuestions(fetched.additionalCriteria);
  const cleaned = cleanStudy(fetched, { uid, email, questions });

  return cleaned;
};
