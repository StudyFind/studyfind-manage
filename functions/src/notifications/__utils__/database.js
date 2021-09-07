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

const addParticipantNotification = (uid, code, title, description, link = "") => {
  firestore.collection("participants").doc(uid).collection("notifications").add({
    code,
    time: Date.now(),
    link,
    title,
    description,
    read: false,
  });
};

const addResearcherNotification = (uid, code, title, description, link = "") => {
  firestore.collection("researchers").doc(uid).collection("notifications").add({
    code,
    time: Date.now(),
    link,
    title,
    description,
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
