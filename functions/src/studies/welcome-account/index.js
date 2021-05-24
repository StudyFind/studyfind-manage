const admin = require("firebase-admin");
const fetchStudies = require("./fetch-studies");
const generateQuestions = require("../create-study/generate-questions");
const cleanStudy = require("../create-study/clean-study");
const firestore = admin.firestore();

module.exports = async (_, context) => {
  try {
    const { uid, email } = context.auth;

    const fetchedStudies = await fetchStudies(email);

    const cleanedStudies = fetchedStudies.map((study) => {
      const studyWithQuestions = generateQuestions(study);
      return cleanStudy({ ...studyWithQuestions, uid });
    });

    await Promise.all(
      cleanedStudies.map((study) => firestore.collection("studies").doc(study.nctID).set(study))
    );

    return { studies: cleanedStudies };
  } catch (error) {
    return { error };
  }
};
