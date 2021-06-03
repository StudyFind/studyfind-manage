const axios = require("axios");
const { throwError } = require("utils");

// fetches study by nctID using flask API
module.exports = async (nctID) => {
  const ENDPOINT = `https://flask-fire-27eclhhcra-uc.a.run.app/autoFillStudy?nctID=${nctID}`;
  const { data } = await axios.get(ENDPOINT);

  if (!data || data.status === "failure") {
    throwError("invalid-argument", "Entered ID does not exist");
  }

  return data.study;
};
