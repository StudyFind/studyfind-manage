const { auth } = require("admin");
const moment = require("moment");
const { RESEARCHER_DELETED_MEETING } = require("../../__utils__/notification-codes");
const { getParticipant, addParticipantNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot) => {
  const meeting = snapshot.data();
  const { participantID, studyID, time } = meeting;

  const participant = await getParticipant(participantID);

  if (participant?.notifications?.email) {
    const user = await auth.getUser(participantID);
    const participantEmail = user.email;
    await sendEmail(participantEmail, "Delete meeting subject", "Delete meeting text");
  }

  return addParticipantNotification(
    participantID,
    RESEARCHER_DELETED_MEETING,
    "Meeting Deleted",
    `The researcher of study ${studyID} has deleted a meeting with you at ${moment(time).format(
      "LLL"
    )}.`,
    `/mystudies/${studyID}/meetings`
  );
};
