const { firestore } = require("admin");
const getDocument = require("utils");

const mergeStudy = require("../__utils__/merge-study");
const fetchStudy = require("../__utils__/fetch-study");

const assertOwnership = (researcherID, userID) => {
  if (researcherID !== userID) {
    throw Error(`User ${userID} is not allowed to update this study`);
  }
};

module.exports = async (data, context) => {
  const { uid } = context.auth;
  const { nctID } = data;

  if (!uid) throw Error("User not logged in");
  if (!nctID) throw Error("Parameter nctID must be defined");

  const fetchedStudy = await fetchStudy(nctID);
  const currentStudy = await getDocument(firestore.collection("studies").doc(nctID));

  assertOwnership(currentStudy.researcher.id, uid);

  const updatedFields = mergeStudy(fetchedStudy);

  await firestore.collection("studies").doc(nctID).update(updatedFields);
};
