const { auth } = require("admin");
const moment = require("moment");
const { RESEARCHER_CREATED_MEETING } = require("../../__utils__/notification-codes");
const { getParticipant, addParticipantNotification } = require("../../__utils__/database");
const sendEmail = require("../../__utils__/send-email");

module.exports = async (snapshot) => {
  const meeting = snapshot.data();
  const { participantID, studyID, time } = meeting;

  const participant = await getParticipant(participantID);

  if (participant?.notifications?.email) {
    const user = await auth.getUser(participantID);
    const participantEmail = user.email;
    await sendEmail(participantEmail, "Create meeting subject", "Create meeting text");
  }

  return addParticipantNotification(
    participantID,
    RESEARCHER_CREATED_MEETING,
    "New Meeting",
    `The researcher of study ${studyID} has set up a meeting with you at ${moment(time).format(
      "LLL"
    )}.`,
    `/mystudies/${studyID}/meetings`
  );
};
