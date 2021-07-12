const onTriggerReminder = require("./on-trigger-reminder");
module.exports = async (snapshot) => onTriggerReminder(snapshot, "CREATE_REMINDER");

/*

Participant
-----------
title: "New Reminder"
body: `The researcher from study ${meta.reminder.studyID} has created a new weekly reminder for you titled ${meta.reminder.title}`
icon: FaClock
color: "green.500"
background: "green.100"

Researcher
----------
title: "New Reminder"
body: "You created a reminder for participant ${meta.studyParticipant.fakename} for study ${meta.reminder.studyID} titled ${meta.reminder.title}`
icon: FaClock
color: "green.500"
background: "green.100"

*/
