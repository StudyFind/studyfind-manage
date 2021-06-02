module.exports = (data) => ({
  // current unix timestamp (in milliseconds)
  updatedAt: Date.now(),

  type: data.type,
  title: data.title,
  description: data.shortDescription,

  age: `${data.minAge}-${data.maxAge}`,
  sex: data.sex,
  control: data.control,

  locations: data.locations,
  conditions: data.conditions,
});
