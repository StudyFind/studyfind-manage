module.exports = jest.fn(
    async (auth, uid) => ({ uid, displayName: uid, email: uid })
)
