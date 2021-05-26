const admin = require("firebase-admin");

module.exports = (_, context) => {
  const auth = admin.auth();
  const { uid } = context.auth;
  const { usertype, email_verified } = context.auth.token;

  if (!email_verified && !usertype) {
    auth.setCustomUserClaims(uid, { usertype: "participant" });
  }
};
