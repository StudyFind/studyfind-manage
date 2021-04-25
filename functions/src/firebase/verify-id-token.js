// utils/verify-id-token.js

module.exports = async (auth, idToken) => {
  if (!idToken) {
    return null;
  }
  return auth.verifyIdToken(idToken);
};
