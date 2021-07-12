const onTriggerMeeting = require("./on-trigger-meeting");
module.exports = async (snapshot) => onTriggerMeeting(snapshot, "UPDATE_MEETING");

/*

Participant
-----------
title: "Meeting Updated"
body: `The researcher from study ${meta.meeting.studyID} has updated a meeting with you at ${moment(meta.meeting.time).format("LLL")}`
icon: FaCalendarTimes
color: "blue.500"
background: "blue.100"

Researcher
----------
title: "Meeting Updated"
body: `You deleted a meeting with participant ${meta.studyParticipant.fakename} for study ${meta.meeting.studyID} at ${moment(meta.meeting.time).format("LLL")}`
icon: FaCalendarTimes
color: "blue.500"
background: "blue.100"

*/
