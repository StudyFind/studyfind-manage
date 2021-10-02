const getDocument = require("./get-document");
const getCollection = require("./get-collection");
const throwError = require("./throw-error");
const sendEmail = require("./send-email");

module.exports = { sendEmail, getDocument, getCollection, throwError };
