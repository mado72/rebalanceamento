'use strict';

var utils = require('../utils/writer.js');
var Despesa = require('../service/DespesaService');

module.exports.despesaGET = function despesaGET (req, res, next, mes) {
  Despesa.despesaGET(mes)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.despesaIdDELETE = function despesaIdDELETE (req, res, next, despesaId) {
  Despesa.despesaIdDELETE(despesaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.despesaIdGET = function despesaIdGET (req, res, next, despesaId) {
  Despesa.despesaIdGET(despesaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.despesaPOST = function despesaPOST (req, res, next, body) {
  Despesa.despesaPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.despesaPUT = function despesaPUT (req, res, next, body) {
  Despesa.despesaPUT(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
