const mAuth = {
    // actually present methods
    verifyIdToken: jest.fn(async (token) => ({
        uid: token, // note, real firebase token !== uid
    })),
    getUser: jest.fn(async (uid) => mAuth.data[uid]),
    // not actually present but useful for mocking
    data: {},
    reset: () => { mAuth.data = {} },
};

const auth = () => mAuth;

module.exports = auth;