'use strict';


/**
 * Adiciona um ativo
 * Adiciona um ativo ao portifólio
 *
 * body Ativo Dados do Ativo
 * returns Ativo
 **/
exports.adicionarAtivo = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "simbolo" : "NYSE:GOOGL",
  "setor" : "Tecnologia",
  "ativo" : "GOOGLE",
  "classe" : "ACAO",
  "moeda" : "REAL",
  "id" : 100,
  "descricao" : "Google na NYSE"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Adiciona uma carteira
 * Adiciona uma carteira ao portifólio
 *
 * body Carteira Dados da carteira
 * returns Carteira
 **/
exports.adicionarCarteira = function(body) {
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
 * Atualiza um ativo
 * Atualiza um ativo identificado pelo seu id
 *
 * body Ativo Dados do ativo
 * ativoId Long Id do ativo
 * no response value expected for this operation
 **/
exports.atualizarAtivo = function(body,ativoId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Atualiza uma carteira
 * Atualiza uma carteira identificada pelo seu id
 *
 * body Carteira Dados da carteira
 * carteiraId Long Id da carteira
 * returns Carteira
 **/
exports.atualizarCarteira = function(body,carteiraId) {
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
 * Atualiza as alocações de um conjunto de ativos em uma carteira
 * Atualiza as alocações de um conjunto de ativos em uma carteira identificada pelo seu id
 *
 * body List Dados das alocações
 * carteiraId Long Id da carteira
 * returns List
 **/
exports.atualizarCarteiraAtivos = function(body,carteiraId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "objetivo" : 0.02,
  "ativoId" : 102,
  "carteiraId" : 100
}, {
  "objetivo" : 0.02,
  "ativoId" : 102,
  "carteiraId" : 100
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Obtém um ativo
 * Obtém um ativo pelo seu id
 *
 * ativoId Long Id do ativo
 * returns Ativo
 **/
exports.obterAtivo = function(ativoId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "simbolo" : "NYSE:GOOGL",
  "setor" : "Tecnologia",
  "ativo" : "GOOGLE",
  "classe" : "ACAO",
  "moeda" : "REAL",
  "id" : 100,
  "descricao" : "Google na NYSE"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Obtém ativos de uma classe
 * Obtém ativos identificados pela sua classe
 *
 * classe Classe Classe do ativo
 * returns Carteira
 **/
exports.obterAtivoPorClasse = function(classe) {
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
 * Lista os ativos disponíveis
 * Lista os ativos cadastrados
 *
 * returns List
 **/
exports.obterAtivos = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "simbolo" : "NYSE:GOOGL",
  "setor" : "Tecnologia",
  "ativo" : "GOOGLE",
  "classe" : "ACAO",
  "moeda" : "REAL",
  "id" : 100,
  "descricao" : "Google na NYSE"
}, {
  "simbolo" : "NYSE:GOOGL",
  "setor" : "Tecnologia",
  "ativo" : "GOOGLE",
  "classe" : "ACAO",
  "moeda" : "REAL",
  "id" : 100,
  "descricao" : "Google na NYSE"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Obtém uma carteira
 * Obtém uma carteira identificada pelo seu id
 *
 * carteiraId Long Id da carteira
 * returns Carteira
 **/
exports.obterCarteira = function(carteiraId) {
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
 * Obtém as alocações dos ativos de uma carteira
 * Obtém os ativos de uma carteira identificada pelo seu id
 *
 * carteiraId Long Id da carteira
 * returns List
 **/
exports.obterCarteiraAtivos = function(carteiraId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "objetivo" : 0.02,
  "ativoId" : 102,
  "carteiraId" : 100
}, {
  "objetivo" : 0.02,
  "ativoId" : 102,
  "carteiraId" : 100
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Obtém lista de carteiras do portifólio
 * Recebe um array de Carteira
 *
 * returns List
 **/
exports.obterCarteiras = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "objetivo" : 0.01,
  "classe" : "ACAO",
  "moeda" : "REAL",
  "nome" : "Ações",
  "id" : 100
}, {
  "objetivo" : 0.01,
  "classe" : "ACAO",
  "moeda" : "REAL",
  "nome" : "Ações",
  "id" : 100
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Obtém lista de carteiras de uma classe
 * Obtém array de carteiras que utilizam uma classe
 *
 * classe Classe Código da classe
 * returns Carteira
 **/
exports.obterCarteirasClasse = function(classe) {
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
 * Obtém lista de carteiras de uma classe e de uma moeda
 * Obtém array de carteiras que utilizam uma classe
 *
 * classe Classe Código da classe
 * moeda Moeda Código da moeda
 * returns Carteira
 **/
exports.obterCarteirasClasseMoeda = function(classe,moeda) {
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
 * Obtém lista de carteiras de uma moeda
 * Obtém array de carteiras que utilizam uma moeda
 *
 * moeda Moeda Código da moeda
 * returns Carteira
 **/
exports.obterCarteirasMoeda = function(moeda) {
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
 * Remove um ativo
 * Remove um ativo identificado pelo seu id
 *
 * ativoId Long Id do ativo
 * no response value expected for this operation
 **/
exports.removerAtivo = function(ativoId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Remove uma carteira
 * Remove uma carteira identificada pelo seu id
 *
 * carteiraId Long Id da carteira
 * no response value expected for this operation
 **/
exports.removerCarteira = function(carteiraId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

