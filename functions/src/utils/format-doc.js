// takes firestore document snapshot as input and returns object storing both doc id and doc data
module.exports = (doc) => ({ id: doc.id, ...doc.data() });
