// utils/update-firestore-entry.js

module.exports = async ({ firestore, collection, document, data }) =>
    firestore.collection(collection).doc(document).update(data);