'use strict';

var utils = require('../utils/writer.js');
var Cotacao = require('../service/CotacaoService');

module.exports.cotacaoYahooGET = function cocotacaoYahooGETntaGET (req, res, next, simbolo) {
  Cotacao.cotacaoYahooGET(simbolo)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.handleError(res, response);
    });
}

