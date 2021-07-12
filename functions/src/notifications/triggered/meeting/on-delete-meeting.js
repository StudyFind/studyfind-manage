const onTriggerMeeting = require("./on-trigger-meeting");
module.exports = async (snapshot) => onTriggerMeeting(snapshot, "DELETE_MEETING");

/*

Participant
-----------
title: "Meeting Deleted"
body: `The researcher from study ${meta.meeting.studyID} has deleted a meeting with you at ${moment(meta.meeting.time).format("LLL")}`
icon: FaCalendarTimes
color: "red.500"
background: "red.100"
link: "https://researcher.studyfind.org/study/${studyID}/participant/${participantID}"

Researcher
----------
title: "Meeting Deleted"
body: `You deleted a meeting with participant ${meta.studyParticipant.fakename} for study ${meta.meeting.studyID} at ${moment(meta.meeting.time).format("LLL")}`
icon: FaCalendarTimes
color: "red.500"
background: "red.100"

*/
