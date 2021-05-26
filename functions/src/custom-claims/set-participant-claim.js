const setClaim = require("./set-claim");
module.exports = (_, context) => setClaim(context, "participant");
