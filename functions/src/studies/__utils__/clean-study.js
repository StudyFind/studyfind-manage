module.exports = (data, extra) => {
  return {
    // current unix timestamp (in milliseconds)
    createdAt: Date.now(),
    updatedAt: Date.now(),

    // status
    published: false,
    activated: false,

    type: data.type,
    title: data.title,
    description: data.shortDescription,

    age: `${data.minAge}-${data.maxAge}`,
    sex: data.sex,
    control: data.control,

    questions: extra.questions,
    locations: data.locations,
    conditions: data.conditions,

    researcher: {
      id: extra.uid,
      name: data.contactName,
      email: extra.email,
    },
  };
};
