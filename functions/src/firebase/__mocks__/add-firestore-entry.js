module.exports = jest.fn(
    async ({ firestore, collection, document, data }) => ({
        _path: {
            segments: [collection, `TEST_${collection}_ID`]
        }
    })
)