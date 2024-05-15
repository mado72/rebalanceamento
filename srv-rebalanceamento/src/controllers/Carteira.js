'use strict';

var utils = require('../utils/writer.js');
var Carteira = require('../service/CarteiraService');

module.exports.adicionarAtivo = function adicionarAtivo (req, res, next, body) {
  Carteira.adicionarAtivo(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.adicionarCarteira = function adicionarCarteira (req, res, next, body) {
  Carteira.adicionarCarteira(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.atualizarAtivo = function atualizarAtivo (req, res, next, body, ativoId) {
  Carteira.atualizarAtivo(body, ativoId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.atualizarCarteira = function atualizarCarteira (req, res, next, body, carteiraId) {
  Carteira.atualizarCarteira(body, carteiraId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.atualizarCarteiraAtivos = function atualizarCarteiraAtivos (req, res, next, body, carteiraId) {
  Carteira.atualizarCarteiraAtivos(body, carteiraId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterAtivo = function obterAtivo (req, res, next, ativoId) {
  Carteira.obterAtivo(ativoId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterAtivoPorClasse = function obterAtivoPorClasse (req, res, next, classe) {
  Carteira.obterAtivoPorClasse(classe)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterAtivos = function obterAtivos (req, res, next) {
  Carteira.obterAtivos()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterCarteira = function obterCarteira (req, res, next, carteiraId) {
  Carteira.obterCarteira(carteiraId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterCarteiraAtivos = function obterCarteiraAtivos (req, res, next, carteiraId) {
  Carteira.obterCarteiraAtivos(carteiraId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterCarteiras = function obterCarteiras (req, res, next) {
  Carteira.obterCarteiras()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterCarteirasClasse = function obterCarteirasClasse (req, res, next, classe) {
  Carteira.obterCarteirasClasse(classe)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterCarteirasClasseMoeda = function obterCarteirasClasseMoeda (req, res, next, classe, moeda) {
  Carteira.obterCarteirasClasseMoeda(classe, moeda)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.obterCarteirasMoeda = function obterCarteirasMoeda (req, res, next, moeda) {
  Carteira.obterCarteirasMoeda(moeda)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.removerAtivo = function removerAtivo (req, res, next, ativoId) {
  Carteira.removerAtivo(ativoId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.removerCarteira = function removerCarteira (req, res, next, carteiraId) {
  Carteira.removerCarteira(carteiraId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
