const onTriggerMeeting = require("./on-trigger-meeting");
module.exports = async (snapshot) => onTriggerMeeting(snapshot, "CREATE_MEETING");

/*

Participant
-----------
title: "New Meeting"
body: `The researcher from study ${meta.meeting.studyID} has set up a meeting with you at ${moment(meta.meeting.time).format("LLL")}`
icon: FaCalendarPlus
color: "green.500"
background: "green.100"

Researcher
----------
title: "New Meeting"
body: `You created a meeting with participant ${meta.studyParticipant.fakename} for study ${meta.meeting.studyID} at ${moment(meta.meeting.time).format("LLL")}`
icon: FaCalendarPlus
color: "green.500"
background: "green.100"

*/
