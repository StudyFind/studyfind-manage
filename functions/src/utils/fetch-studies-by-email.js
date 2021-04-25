const axios = require("axios");

// fetches study by nctID using flask API
module.exports = async (email) => {
  const { data } = await axios.get(
    `https://flask-fire-27eclhhcra-uc.a.run.app/queryStudiesByEmail?email=${email}`
  );

  if (!data || data.status === "failure") {
    throw Error({ message: "Entered ID does not exist" });
  }

  return data.studies;
};
