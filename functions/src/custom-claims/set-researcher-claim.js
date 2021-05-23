const admin = require("firebase-admin");

module.exports = (_, context) => {
  const auth = admin.auth();
  const { uid, customClaims } = context.auth;

  if (!customClaims.usertype) {
    auth.setCustomUserClaims(uid, { usertype: "researcher" });
  }
};
