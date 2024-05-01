'use strict';
var Model = require('../models/model');
var mongoose = require('mongoose');
const { DateTime } = require("luxon");

const { respondWithCode } = require('../utils/writer');
const Despesa = mongoose.model('despesa');

/**
 * Lista as despesas
 * Lista as despesas programadas do ano
 *
 * mes Integer  (optional)
 * pago boolean (optional)
 * categoria string (optional)
 * returns List
 **/
exports.despesaGET = function (mes, pago, categoria) {
  var filter = {};
  if (!!mes) {
    var now = DateTime.now();
    var inicio = DateTime.local(now.year, Number(mes), 1).toFormat('yyyy-MM-dd');
    var fim = DateTime.local(now.year, Number(mes), 1).endOf('month').toFormat('yyyy-MM-dd');
    filter.dataVencimento = {
      $gte: inicio,
      $lte: fim
    };
  };
  if (pago !== undefined) {
    filter.dataPagamento = { $exists: pago };
  };
  if (!!categoria) filter.categoria = categoria;

  return new Promise(async (resolve, reject) => {
    try {
      var result = await Despesa.find(filter);
      result = result.map(item=>Despesa.toObjectInstance(item));
      resolve(result);
    } catch (error) {
      reject(error);
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
exports.despesaIdDELETE = function (despesaId) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(despesaId);
      var despesa = await Despesa.findByIdAndDelete(id)
      if (!despesa) {
        resolve(respondWithCode(404, 'Despesa não encontrada'));
        return;
      }
      resolve(Despesa.toObjectInstance(despesa));
    } catch (error) {
      reject(error);
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
exports.despesaIdGET = function (despesaId) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(despesaId);

      var despesa = await Despesa.findById(id);
      if (!despesa) {
        resolve(respondWithCode(404, 'Despesa não encontrada'));
        return;
      }
      resolve(Despesa.toObjectInstance(despesa));

    } catch (error) {
      reject(error);
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
exports.despesaPOST = function (body) {
  return new Promise(async (resolve, reject) => {
    try {
      var despesa = new Despesa(body);
      despesa = await despesa.save();
      resolve(Despesa.toObjectInstance(despesa));
    } catch (error) {
      reject(error);
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
exports.despesaPUT = function (body) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(body._id);
      var despesa = await Despesa.findByIdAndUpdate(id, body);

      if (!despesa) {
        resolve(respondWithCode(404, 'Despesa não encontrada'));
        return;
      }
      resolve();
    } catch (error) {
      error.code = 422;
      reject(error);
    }
  });
}

