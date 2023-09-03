const { queryParser } = require('express-query-parser');

module.exports.queryParser = queryParser ({
  parseNull: true,
  parseUndefined: true,
  parseBoolean: true,
  parseNumber: true,
});
