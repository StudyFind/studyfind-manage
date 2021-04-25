const InclusionsMatcher = /(?:inclusions?\s*criteria:)((?:\n|.)*?)(?:exclusions?\s*criteria:)/gi;
const ExclusionsMatcher = /(?:exclusions? criteria:)((?:\n|.)*?)$/gi;
const SubpointMatcher = /(\n.*:\n(?:\n|.)*)(?:\n\n)/gi;

module.exports = (criteria) => {
  const inclusionRaw = criteria.matchAll(InclusionsMatcher).next().value;
  const exclusionRaw = criteria.matchAll(ExclusionsMatcher).next().value;

  return {
    inclusion: inclusionRaw ? makeCriteria(inclusionRaw[1]) : [],
    exclusion: exclusionRaw ? makeCriteria(exclusionRaw[1]) : [],
  };
};

function clean(array) {
  return array.split("\n").filter((i) => i.trim() !== "");
}

function flatten(subpoints) {
  return `${subpoints[0]} ${subpoints.slice(1).join(", ")}\n`;
}

function makeCriteria(s) {
  const points = s.replace(SubpointMatcher, (_, $1) => {
    const subpoints = clean($1);
    return flatten(subpoints);
  });

  return clean(points);
}
