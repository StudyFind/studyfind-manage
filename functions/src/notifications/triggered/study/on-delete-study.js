const onTriggerStudy = require("./on-trigger-study");
module.exports = async (snapshot) => onTriggerStudy(snapshot, "CREATE_STUDY");

/*

Researcher
----------
title: "Study Deleted"
body: "You deleted study ${meta.study.id}`
icon: FiFileMinus
color: "red.500"
background: "red.100"

*/
