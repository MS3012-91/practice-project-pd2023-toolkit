const bd = require('../models');
const CONSTANTS = require('../constants');

module.exports.createWhereForAllContests = (
  typeIndex,
  contestId,
  industry,
  awardSort
) => {
  const object = {
    where: {},
    order: [],
  };
  if (typeIndex) {
    Object.assign(object.where, { contestType: getPredicateTypes(typeIndex) });
  }
  if (contestId) {
    Object.assign(object.where, { id: contestId });
  }
  if (industry) {
    Object.assign(object.where, { industry });
  }
  if (awardSort) {
    object.order.push(['prize', awardSort]);
  }
  Object.assign(object.where, {
    status: {
      [bd.Sequelize.Op.or]: [
        CONSTANTS.CONTEST_STATUS_FINISHED,
        CONSTANTS.CONTEST_STATUS_ACTIVE,
      ],
    },
  });
  object.order.push(['id', 'desc']);
  return object;
};

function getPredicateTypes(index) {
  return { [bd.Sequelize.Op.or]: [types[index].split(',')] };
}

const types = [
  '',
  'name,tagline,logo',
  'name',
  'tagline',
  'logo',
  'name,tagline',
  'logo,tagline',
  'name,logo',
];

module.exports.paginateTest = (req) => {
  const { page, results } = req.query;
  let limit;
  let offset;
  if (!page) {
    offset = 0;
    limit = results;
  } else if (!results) {
    offset = (page - 1) * 10;
    limit = 10;
  } else {
    (offset = (page - 1) * results), (limit = results);
  }
  return { offset, limit };
};
