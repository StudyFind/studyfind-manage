const { addResearcherNotification } = require("../../__utils__/database");

module.exports = async (snapshot, code) => {
  const study = snapshot.data();
  addResearcherNotification(study.researcher.id, code, { study });
};
