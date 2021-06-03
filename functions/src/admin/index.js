const admin = require("firebase-admin");

const auth = admin.auth();
const firestore = admin.firestore();

module.exports = { auth, firestore };
