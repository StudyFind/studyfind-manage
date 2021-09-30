const { auth } = require("admin");

module.exports = async (uid, usertype) => {
  auth.setCustomUserClaims(uid, { usertype });
};
