module.exports = jest.fn(
    async (admin, idToken) => ({ uid: idToken })
)
