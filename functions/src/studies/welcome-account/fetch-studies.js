const axios = require("axios");

// fetches studies by email using flask API
module.exports = async (email) => {
  const ENDPOINT = `https://flask-fire-27eclhhcra-uc.a.run.app/queryStudiesByEmail?email=${email}`;
  const { data } = await axios.get(ENDPOINT);

  if (!data || data.status === "failure") {
    throw Error("No matching studies could be found");
  }

  return data.studies;
};
