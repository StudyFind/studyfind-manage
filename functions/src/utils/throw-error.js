const functions = require("firebase-functions");

/*
Error Codes
===========
"ok"
"cancelled"
"unknown"
"invalid-argument"
"deadline-exceeded"
"not-found"
"already-exists"
"permission-denied"
"resource-exhausted"
"failed-precondition"
"aborted"
"out-of-range"
"unimplemented"
"internal"
"unavailable"
"data-loss"
"unauthenticated"
*/

module.exports = (code, message) => {
  throw new functions.https.HttpsError(code, message, { code, message });
};
