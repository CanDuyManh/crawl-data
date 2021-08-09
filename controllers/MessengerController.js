// Model && logic
const MessengerService = require('../services/MessengerService');
const express = require('express');

/** get all messenger .
 * @param {express.Request} req - Request
 * @param {express.Response} res - Response
 */
module.exports.GetMessenger = async (req, res) => {
  try {
    let messenger = await MessengerService.find();
    res.json(messenger);
  } catch (error) {
    res.status.json(error);
  }
};

/** get messenger by id .
 * @param {express.Request} req - Request
 * @param {express.Response} res - Response
 */
module.exports.GetMessengerById = async (req, res) => {
  try {
    let messengerId = req.params.id;
    let messenger = await MessengerService.findById(messengerId);
    res.json(messenger);
  } catch (error) {
    res.status.json(error);
  }
};

/** delete messenger by id.
 * @param {express.Request} req - Request
 * @param {express.Response} res - Response
 */
module.exports.DeleteMessengerById = async (req, res) => {
  try {
    let messengerId = req.params.id;
    let messenger = await MessengerService.findByIdAndRemove(messengerId);
    res.json(messenger);
  } catch (error) {
    res.status.json(error);
  }
};
