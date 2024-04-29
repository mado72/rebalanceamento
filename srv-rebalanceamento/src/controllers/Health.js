'use strict';

var utils = require('../utils/writer.js');

module.exports.healthCheckGET = (req, res, next, xAPIKEY) => {
  utils.writeJson(res, "Funcionando");
};
