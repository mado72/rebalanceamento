'use strict';


/**
 * Lista as despesas
 * Lista as despesas programadas do ano
 *
 * mes Integer  (optional)
 * returns List
 **/
exports.despesaGET = function(mes) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "dataPagamento" : "2020-01-01T00:00:00.000+00:00",
  "despesa" : "Impostos",
  "dataVencimento" : "2020-01-01T00:00:00.000+00:00",
  "categoria" : "Custo Fixo",
  "valor" : 202.1,
  "origem" : "origem",
  "periodicidade" : "SMN",
  "liquidacao" : "CONTA",
  "_id" : "_id",
  "contaLiquidacao" : "contaLiquidacao",
  "dataFinal" : "2020-01-01T00:00:00.000+00:00"
}, {
  "dataPagamento" : "2020-01-01T00:00:00.000+00:00",
  "despesa" : "Impostos",
  "dataVencimento" : "2020-01-01T00:00:00.000+00:00",
  "categoria" : "Custo Fixo",
  "valor" : 202.1,
  "origem" : "origem",
  "periodicidade" : "SMN",
  "liquidacao" : "CONTA",
  "_id" : "_id",
  "contaLiquidacao" : "contaLiquidacao",
  "dataFinal" : "2020-01-01T00:00:00.000+00:00"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Remove uma nova despesa
 * Remove uma nova despesa
 *
 * despesaId Long ID da despesa
 * no response value expected for this operation
 **/
exports.despesaIdDELETE = function(despesaId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Busca os dados de uma despesa pelo Id
 * Returna uma única despesa
 *
 * despesaId Long ID da despesa
 * returns Despesa
 **/
exports.despesaIdGET = function(despesaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "dataPagamento" : "2020-01-01T00:00:00.000+00:00",
  "despesa" : "Impostos",
  "dataVencimento" : "2020-01-01T00:00:00.000+00:00",
  "categoria" : "Custo Fixo",
  "valor" : 202.1,
  "origem" : "origem",
  "periodicidade" : "SMN",
  "liquidacao" : "CONTA",
  "_id" : "_id",
  "contaLiquidacao" : "contaLiquidacao",
  "dataFinal" : "2020-01-01T00:00:00.000+00:00"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Adiciona uma nova despesa
 * Adiciona uma nova despesa
 *
 * body Despesa Cria uma nova despesa
 * returns Despesa
 **/
exports.despesaPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "dataPagamento" : "2020-01-01T00:00:00.000+00:00",
  "despesa" : "Impostos",
  "dataVencimento" : "2020-01-01T00:00:00.000+00:00",
  "categoria" : "Custo Fixo",
  "valor" : 202.1,
  "origem" : "origem",
  "periodicidade" : "SMN",
  "liquidacao" : "CONTA",
  "_id" : "_id",
  "contaLiquidacao" : "contaLiquidacao",
  "dataFinal" : "2020-01-01T00:00:00.000+00:00"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Atualiza uma despesa
 * Atualiza uma despesa identificada pelo seu id
 *
 * body Despesa Dados da despesa
 * returns Despesa
 **/
exports.despesaPUT = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "dataPagamento" : "2020-01-01T00:00:00.000+00:00",
  "despesa" : "Impostos",
  "dataVencimento" : "2020-01-01T00:00:00.000+00:00",
  "categoria" : "Custo Fixo",
  "valor" : 202.1,
  "origem" : "origem",
  "periodicidade" : "SMN",
  "liquidacao" : "CONTA",
  "_id" : "_id",
  "contaLiquidacao" : "contaLiquidacao",
  "dataFinal" : "2020-01-01T00:00:00.000+00:00"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

