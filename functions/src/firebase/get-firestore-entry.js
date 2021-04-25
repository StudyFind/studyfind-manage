// utils/get-firestore-entry.js

module.exports = async ({ firestore, collection, document }) => {
  const resp = await firestore.collection(collection).doc(document).get();
  return resp.data();
};
