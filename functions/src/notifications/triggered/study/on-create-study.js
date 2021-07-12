const onTriggerStudy = require("./on-trigger-study");
module.exports = async (snapshot) => onTriggerStudy(snapshot, "CREATE_STUDY");

/*

Researcher
----------
title: "New Study"
body: "You created a new study ${meta.study.id}`
icon: FiFilePlus
color: "green.500"
background: "green.100"

*/
