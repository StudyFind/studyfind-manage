const { firestore } = require("admin");
const { getDocument } = require("utils");

const getParticipant = async (uid) => {
  return getDocument(firestore.collection("participants").doc(uid));
};

const getResearcher = async (uid) => {
  return getDocument(firestore.collection("researchers").doc(uid));
};

const getStudyParticipant = async (studyID, participantID) => {
  return getDocument(
    firestore.collection("studies").doc(studyID).collection("participants").doc(participantID)
  );
};

const addParticipantNotification = (uid, code, meta) => {
  firestore.collection("participants").doc(uid).add({
    code,
    meta,
    time: Date.now(),
    read: false,
  });
};

const addResearcherNotification = (uid, code, meta) => {
  firestore.collection("researchers").doc(uid).add({
    code,
    meta,
    time: Date.now(),
    read: false,
  });
};

module.exports = {
  getParticipant,
  getResearcher,
  getStudyParticipant,
  addParticipantNotification,
  addResearcherNotification,
};
