'use strict';

var utils = require('../utils/writer.js');
var Despesa = require('../service/DespesaService');

module.exports.adicionaDespesa = function adicionaDespesa (req, res, next, body, despesaId) {
  Despesa.adicionaDespesa(body, despesaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.atualizarDespesa = function atualizarDespesa (req, res, next, body) {
  Despesa.atualizarDespesa(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterDespesaId = function obterDespesaId (req, res, next, despesaId) {
  Despesa.obterDespesaId(despesaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterDespesasMes = function obterDespesasMes (req, res, next, mes) {
  Despesa.obterDespesasMes(mes)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterDespesasProgramadas = function obterDespesasProgramadas (req, res, next) {
  Despesa.obterDespesasProgramadas()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.removeDespesa = function removeDespesa (req, res, next, despesaId) {
  Despesa.removeDespesa(despesaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
