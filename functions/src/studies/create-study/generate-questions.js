const InclusionsMatcher = /(?:inclusions?\s*criteria:)((?:\n|.)*?)(?:exclusions?\s*criteria:)/gi;
const ExclusionsMatcher = /(?:exclusions? criteria:)((?:\n|.)*?)$/gi;
const SubpointMatcher = /(\n.*:\n(?:\n|.)*)(?:\n\n)/gi;

const generateSurvey = (criteria) => {
  const inclusionRaw = criteria.matchAll(InclusionsMatcher).next().value;
  const exclusionRaw = criteria.matchAll(ExclusionsMatcher).next().value;

  return {
    inclusion: inclusionRaw ? makeCriteria(inclusionRaw[1]) : [],
    exclusion: exclusionRaw ? makeCriteria(exclusionRaw[1]) : [],
  };
};

const clean = (array) => {
  return array.split("\n").filter((i) => i.trim() !== "");
};

const flatten = (subpoints) => {
  return `${subpoints[0]} ${subpoints.slice(1).join(", ")}\n`;
};

const makeCriteria = (s) => {
  const points = s.replace(SubpointMatcher, (_, $1) => {
    const subpoints = clean($1);
    return flatten(subpoints);
  });

  return clean(points);
};

module.exports = (criteria) => {
  const { inclusion, exclusion } = generateSurvey(criteria);

  const inclusionList = inclusion.map((prompt) => ({ type: "Inclusion", prompt }));
  const exclusionList = exclusion.map((prompt) => ({ type: "Exclusion", prompt }));

  return inclusionList.concat(exclusionList);
};
