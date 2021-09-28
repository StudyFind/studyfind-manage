const { firestore } = require("admin");

module.exports = async (to, text) => {
  return firestore.collection("sms").add({
    to,
    message: { channelId: "811868e46653456db8e54ff84034702d", type: "text", to, content: { text } },
  });
};

//append link, merge master, redo delete acc
