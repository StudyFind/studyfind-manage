const axios = require("axios");

// fetches study by nctID using flask API
module.exports = async (nctID) => {
    const { data } = await axios.get(
        `https://flask-fire-27eclhhcra-uc.a.run.app/autoFillStudy?nctID=${nctID}`
    );

    if (!data || data.status === "failure") {
        throw Error("Entered ID does not exist");
    }

    return data.study;
}