// returns default entry from given study data. Designed to be adjustable
// @param data <obj> - data object scraped from nct website by flask app
// @param user <obj> - firebase user object authoring this study
module.exports = (data) => {
  return {
    published: false,
    activated: false,
    updatedAt: Date.now(),
    nctID: data.nctID,
    title: data.title,
    status: data.recruitmentStatus,
    description: data.shortDescription,
    researcher: {
      id: data.uid,
      name: data.contactName,
      email: data.contactEmail,
    },
    sex: data.sex,
    age: `${data.minAge}-${data.maxAge}`,
    control: data.control,
    questions: data.questions,
    locations: data.locations,
    conditions: data.conditions,
  };
};
