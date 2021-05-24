const admin = require("firebase-admin");
const mergeStudy = require("./merge-study");
const fetchStudy = require("../create-study/fetch-study");
const firestore = admin.firestore();

const getStudy = async (nctID) => {
  const study = await firestore.collection("studies").doc(nctID).get();
  return study.data();
};

const assertOwnership = (researcherID, userID) => {
  if (researcherID !== userID) {
    throw Error(`User ${userID} is not allowed to update this study`);
  }
};

module.exports = async (data, context) => {
  try {
    const { uid } = context.auth;
    const { nctID } = data;

    if (!nctID) throw Error("Parameter nctID needs to be defined");

    const fetchedStudy = await fetchStudy(nctID);
    const currentStudy = await getStudy(nctID);

    assertOwnership(currentStudy.researcher.id, uid);

    const updatedFields = mergeStudy(fetchedStudy);

    return await firestore.collection("studies").doc(nctID).update(updatedFields);
  } catch (e) {
    return { error: e.message };
  }
};
