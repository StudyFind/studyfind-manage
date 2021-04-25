const verifyIdToken = require("./verify-id-token");
const getUser = require("./get-user");

// fetches user associated with idToken
module.exports = async (auth, idToken) => {
    try {
        const decodedToken = await verifyIdToken(auth, idToken);
        const user = await getUser(auth, decodedToken.uid);
        return user;
    } catch (error) {
        throw Error(`User token '${idToken}' is not valid`);
    }
}
