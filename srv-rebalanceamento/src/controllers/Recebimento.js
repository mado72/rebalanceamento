'use strict';

var utils = require('../utils/writer.js');
var Recebimento = require('../service/RecebimentoService.js');

module.exports.recebimentoGET = function recebimentoGET (req, res, next) {
  Recebimento.recebimentoGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.recebimentoIdDELETE = function recebimentoIdDELETE (req, res, next, recebimentoId) {
  Recebimento.recebimentoIdDELETE(recebimentoId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.recebimentoIdGET = function recebimentoIdGET (req, res, next, recebimentoId) {
  Recebimento.recebimentoIdGET(recebimentoId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.recebimentoPOST = function recebimentoPOST (req, res, next, body) {
  Recebimento.recebimentoPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};

module.exports.recebimentoPUT = function recebimentoPUT (req, res, next, body) {
  Recebimento.recebimentoPUT(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
};
