'use strict';

var utils = require('../utils/writer.js');
var Conta = require('../service/ContaService');

module.exports.contaGET = function contaGET (req, res, next, moeda) {
  Conta.contaGET(moeda)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.contaIdDELETE = function contaIdDELETE (req, res, next, contaId) {
  Conta.contaIdDELETE(contaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.contaIdGET = function contaIdGET (req, res, next, contaId) {
  Conta.contaIdGET(contaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.contaPOST = function contaPOST (req, res, next, body) {
  Conta.contaPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.contaPUT = function contaPUT (req, res, next) {
  Conta.contaPUT()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
