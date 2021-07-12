const onTriggerStudy = require("./on-trigger-study");
module.exports = async (snapshot) => onTriggerStudy(snapshot, "CREATE_STUDY");

/*

Researcher
----------
title: "Study Updated"
body: "You updated study ${meta.study.id}`
icon: FiFile
color: "blue.500"
background: "blue.100"

*/
