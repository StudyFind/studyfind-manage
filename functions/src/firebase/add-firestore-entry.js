// utils/add-firestore-entry.js

module.exports = async ({ firestore, collection, document, data }) =>
  document
    ? firestore.collection(collection).doc(document).set(data)
    : firestore.collection(collection).add(data);
