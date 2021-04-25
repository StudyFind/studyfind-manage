const fetchStudiesByEmail = require("./utils/fetch-studies-by-email");
const generateSurvey = require("./utils/generate-survey");
const cleanStudy = require("./utils/clean-study");

function generateQuestions(data) {
  const { inclusion, exclusion } = generateSurvey(data.additionalCriteria);
  const inclusionList = inclusion.map((prompt) => ({ type: "Inclusion", prompt }));
  const exclusionList = exclusion.map((prompt) => ({ type: "Exclusion", prompt }));
  const criterionList = inclusionList.concat(exclusionList);
  return { ...data, questions: criterionList };
}

module.exports = ({ admin }) => async (req, res) => {
  try {
    const { idToken } = req.query;

    const auth = admin.auth();
    const firestore = admin.firestore();

    const decodedToken = await auth.verifyIdToken(idToken);

    const user = await auth.getUser(decodedToken.uid);
    const studies = await fetchStudiesByEmail(user.email);

    const formatted = studies.map((study) => {
      const { uid } = user;
      const studyWithQuestions = generateQuestions(study);
      return cleanStudy({ ...studyWithQuestions, uid });
    });

    await Promise.all(
      formatted.map((study) => firestore.collection("studies").doc(study.nctID).set(study))
    );

    res.json({ studies: formatted, error: null });
  } catch (error) {
    res.json({ studies: null, error });
  }
};
