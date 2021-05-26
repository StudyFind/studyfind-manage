const inclusionsMatcher = /(?:inclusions?\s*criteria:)((?:\n|.)*?)(?:exclusions?\s*criteria:)/gi;
const exclusionsMatcher = /(?:exclusions? criteria:)((?:\n|.)*?)$/gi;
const subpointMatcher = /(\n.*:\n(?:\n|.)*)(?:\n\n)/gi;

const clean = (array) => {
  return array.split("\n").filter((i) => i.trim() !== "");
};

const flatten = (subpoints) => {
  return `${subpoints[0]} ${subpoints.slice(1).join(", ")}\n`;
};

const makeCriteria = (s) => {
  const points = s.replace(subpointMatcher, (_, $1) => flatten(clean($1)));
  return clean(points);
};

const generateSurvey = (criteria) => {
  const inclusionRaw = criteria.matchAll(inclusionsMatcher).next().value;
  const exclusionRaw = criteria.matchAll(exclusionsMatcher).next().value;

  return {
    inclusion: inclusionRaw ? makeCriteria(inclusionRaw[1]) : [],
    exclusion: exclusionRaw ? makeCriteria(exclusionRaw[1]) : [],
  };
};

module.exports = (criteria) => {
  const { inclusion, exclusion } = generateSurvey(criteria);
  const inclusionList = inclusion.map((prompt) => ({ type: "Inclusion", prompt }));
  const exclusionList = exclusion.map((prompt) => ({ type: "Exclusion", prompt }));
  return inclusionList.concat(exclusionList);
};
