const { firestore } = require("admin");

module.exports = async (to, text) => {
  return firestore.collection("sms").add({
    to,
    message: { channelId: "3c9a0fc00c3541b4900fed78a71589fe", type: "text", to, content: { text } },
  });
};
