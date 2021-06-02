const formatDoc = require("./format-doc");

module.exports = async (query) => {
  const doc = await query.get();

  if (!doc.exists) {
    return null;
  }

  return formatDoc(doc);
};
