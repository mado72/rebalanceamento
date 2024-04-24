'use strict';


/**
 * Adiciona uma conta
 * Adiciona uma conta ao portifólio
 *
 * body Conta Dados da conta
 * returns Conta
 **/
exports.adicionarConta = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "moeda" : "REAL",
  "conta" : "Itaú",
  "id" : 15,
  "saldo" : 150.23
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Atualiza uma conta
 * Atualiza uma conta identificada pelo seu id
 *
 * body Conta Dados da conta
 * contaId Long Id da conta
 * returns Conta
 **/
exports.atualizarConta = function(body,contaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "moeda" : "REAL",
  "conta" : "Itaú",
  "id" : 15,
  "saldo" : 150.23
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Obtém uma conta
 * Obtém uma conta identificada pelo seu id
 *
 * contaId Long Id da conta
 * returns Carteira
 **/
exports.obterConta = function(contaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "objetivo" : 0.01,
  "classe" : "ACAO",
  "moeda" : "REAL",
  "nome" : "Ações",
  "id" : 100
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Obtém lista de contas do portifólio
 * Recebe um array de Conta
 *
 * returns List
 **/
exports.obterContas = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "moeda" : "REAL",
  "conta" : "Itaú",
  "id" : 15,
  "saldo" : 150.23
}, {
  "moeda" : "REAL",
  "conta" : "Itaú",
  "id" : 15,
  "saldo" : 150.23
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Obter contas de uma moeda
 * Retorna array de contas
 *
 * moeda Moeda Moeda a pesquisar
 * returns List
 **/
exports.obterContasMoeda = function(moeda) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "moeda" : "REAL",
  "conta" : "Itaú",
  "id" : 15,
  "saldo" : 150.23
}, {
  "moeda" : "REAL",
  "conta" : "Itaú",
  "id" : 15,
  "saldo" : 150.23
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Remove uma conta
 * Remove uma conta identificada pelo seu id
 *
 * contaId Long Id da conta
 * no response value expected for this operation
 **/
exports.removerConta = function(contaId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

