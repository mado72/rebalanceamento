'use strict';


/**
 * Adiciona uma nova despesa
 * Adiciona uma nova despesa
 *
 * body Despesa Cria uma nova despesa
 * despesaId Long ID da despesa
 * returns Despesa
 **/
exports.adicionaDespesa = function(body,despesaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "despesa" : "Impostos",
  "valores" : [ 0.8008281904610115, 0.8008281904610115 ],
  "id" : 100,
  "diaPagamento" : 2
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
exports.atualizarDespesa = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "despesa" : "Impostos",
  "valores" : [ 0.8008281904610115, 0.8008281904610115 ],
  "id" : 100,
  "diaPagamento" : 2
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Busca os dados de uma despesa pelo Id
 * Returna uma única despesa
 *
 * despesaId Long ID da despesa
 * returns Despesa
 **/
exports.obterDespesaId = function(despesaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "despesa" : "Impostos",
  "valores" : [ 0.8008281904610115, 0.8008281904610115 ],
  "id" : 100,
  "diaPagamento" : 2
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Retorna as despesas programadas para o mês
 * O mês deve ser informado para apresentar as despesas mensais
 *
 * mes BigDecimal Define o mês da pesquisa
 * returns List
 **/
exports.obterDespesasMes = function(mes) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "despesa" : "Impostos",
  "valores" : [ 0.8008281904610115, 0.8008281904610115 ],
  "id" : 100,
  "diaPagamento" : 2
}, {
  "despesa" : "Impostos",
  "valores" : [ 0.8008281904610115, 0.8008281904610115 ],
  "id" : 100,
  "diaPagamento" : 2
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Lista as despesas
 * Lista as despesas programadas do ano
 *
 * returns List
 **/
exports.obterDespesasProgramadas = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "despesa" : "Impostos",
  "valores" : [ 0.8008281904610115, 0.8008281904610115 ],
  "id" : 100,
  "diaPagamento" : 2
}, {
  "despesa" : "Impostos",
  "valores" : [ 0.8008281904610115, 0.8008281904610115 ],
  "id" : 100,
  "diaPagamento" : 2
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
exports.removeDespesa = function(despesaId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

