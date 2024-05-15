'use strict';
var mongoose = require('mongoose');

const { respondWithCode } = require('../utils/writer');
const Recebimento = mongoose.model('recebimento');

/**
 * Lista os recebimentos
 * Lista os recebimentos programados
 * returns List
 **/
exports.recebimentoGET = function () {
  return new Promise(async (resolve, reject) => {
    try {
      var result = await Recebimento.find({});
      result = result.map(item=>Recebimento.toObjectInstance(item));
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Remove um recebimento
 * Remove um recebimento
 *
 * recebimentoId Long ID da recebimento
 * no response value expected for this operation
 **/
exports.recebimentoIdDELETE = function (recebimentoId) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(recebimentoId);
      var recebimento = await Recebimento.findByIdAndDelete(id)
      if (!recebimento) {
        resolve(respondWithCode(404, 'Recebimento não encontrado'));
        return;
      }
      resolve(Recebimento.toObjectInstance(recebimento));
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Busca os dados de um recebimento pelo Id
 * Returna um único recebimento
 *
 * recebimentoId Long ID da recebimento
 * returns Recebimento
 **/
exports.recebimentoIdGET = function (recebimentoId) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(recebimentoId);

      var recebimento = await Recebimento.findById(id);
      if (!recebimento) {
        resolve(respondWithCode(404, 'Recebimento não encontrado'));
        return;
      }
      resolve(Recebimento.toObjectInstance(recebimento));

    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Adiciona um recebimento
 * Adiciona um recebimento
 *
 * body Recebimento Cria um recebimento
 * returns Recebimento
 **/
exports.recebimentoPOST = function (body) {
  return new Promise(async (resolve, reject) => {
    try {
      var recebimento = new Recebimento(body);
      recebimento = await recebimento.save();
      resolve(Recebimento.toObjectInstance(recebimento));
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Atualiza um recebimento
 * Atualiza um recebimento identificada pelo seu id
 *
 * body Recebimento Dados da recebimento
 * returns Recebimento
 **/
exports.recebimentoPUT = function (body) {
  return new Promise(async (resolve, reject) => {
    try {
      var id = new mongoose.Types.ObjectId(body._id);
      var recebimento = await Recebimento.findByIdAndUpdate(id, body);

      if (!recebimento) {
        resolve(respondWithCode(404, 'Recebimento não encontrado'));
        return;
      }
      resolve();
    } catch (error) {
      error.code = 422;
      reject(error);
    }
  });
}

