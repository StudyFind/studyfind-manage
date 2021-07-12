const onTriggerReminder = require("./on-trigger-reminder");
module.exports = async (snapshot) => onTriggerReminder(snapshot, "DELETE_REMINDER");

/*

Participant
-----------
title: "Reminder Deleted"
body: `The researcher from study ${meta.reminder.studyID} has deleted the weekly reminder titled ${meta.reminder.title}`
icon: FaClock
color: "red.500"
background: "red.100"

Researcher
----------
title: "Reminder Deleted"
body: "You deleted a reminder for participant ${meta.studyParticipant.fakename} for study ${meta.reminder.studyID} titled ${meta.reminder.title}`
icon: FaClock
color: "red.500"
background: "red.100"

*/
