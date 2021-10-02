export const deleteDocumentsInQuery = async (query) => {
  const snapshot = await query.get();
  Promise.allSettled(snapshot.map((doc) => doc.ref.delete()));
};
