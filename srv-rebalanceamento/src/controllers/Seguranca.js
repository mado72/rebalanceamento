'use strict';

var utils = require('../utils/writer.js');
var Seguranca = require('../service/SegurancaService');

module.exports.auth = function auth (req, res, next, xAPIKEY) {
  Seguranca.auth(xAPIKEY)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
