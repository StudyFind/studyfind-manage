const formatDoc = require("./format-doc");

module.exports = async (query) => {
  const collection = [];
  const snapshot = await query.get();

  snapshot.forEach((doc) => collection.push(formatDoc(doc)));

  return collection;
};
