const admin = require("firebase-admin");

const auth = admin.auth();
const firestore = admin.firestore();
const storage = admin.storage();

module.exports = { auth, firestore, storage };
