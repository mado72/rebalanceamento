'use strict';


/**
 * Autentica um serviço
 * Retorna um token válido para as futuras requisições
 *
 * xAPIKEY UUID Key
 * returns String
 **/
exports.auth = function(xAPIKEY) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['text/plain'] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImFwaSIsImlhdCI6MTUxNjIzOTAyMn0.5CJAabRWeYijCbUBQAdYZDs-tfxlP41By5-qpZMIy0E";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

