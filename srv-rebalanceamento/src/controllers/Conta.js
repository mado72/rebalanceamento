'use strict';

var utils = require('../utils/writer.js');
var Conta = require('../service/ContaService');

module.exports.adicionarConta = function adicionarConta (req, res, next, body) {
  Conta.adicionarConta(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.atualizarConta = function atualizarConta (req, res, next, body, contaId) {
  Conta.atualizarConta(body, contaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterConta = function obterConta (req, res, next, contaId) {
  Conta.obterConta(contaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterContas = function obterContas (req, res, next) {
  Conta.obterContas()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterContasMoeda = function obterContasMoeda (req, res, next, moeda) {
  Conta.obterContasMoeda(moeda)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.removerConta = function removerConta (req, res, next, contaId) {
  Conta.removerConta(contaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
