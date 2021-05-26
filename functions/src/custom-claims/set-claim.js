const admin = require("firebase-admin");

module.exports = (context, userside) => {
  const auth = admin.auth();

  if (!context.auth) throw Error("context.auth is not defined");
  if (!context.auth.token) throw Error("context.auth.token is not defined");

  const { uid } = context.auth;
  const { usertype } = context.auth.token;

  if (usertype) throw Error("usertype has already been set");

  auth.setCustomUserClaims(uid, { usertype: userside });
};
