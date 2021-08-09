// Model && logic
const ConversationService = require('../services/ConversationService');
const express = require('express');
const crawlConversationWorker = require('../workers/crawlConversationWorker');
const MessengerService = require('../services/MessengerService');

/** conversation save all .
 * @param {express.Request} req - Request
 * @param {express.Response} res - Response
 */
module.exports.PostConversation = async (req, res) => {
  try {
    const pageToken = req.cookies.token;
    crawlConversationWorker.CreateJob(pageToken);
    res.json({ data: "data" });
  } catch (error) {
    res.status(500).json(error);
  }
};

/** conversation get all .
 * @param {express.Request} req - Request
 * @param {express.Response} res - Response
 */
module.exports.GetAllConversation = async (req, res) => {
  try {
    let conversation = await ConversationService.find();
    res.json(conversation);
  } catch (error) {
    res.status.json(error);
  }
};

/** conversation get by id .
 * @param {express.Request} req - Request
 * @param {express.Response} res - Response
 */
module.exports.GetConversationById = async (req, res) => {
  try {
    let conversationId = req.params.id;
    let conversation = await ConversationService.findById(conversationId);
    res.json(conversation);
  } catch (error) {
    res.status.json(error);
  }
};

/** conversation delete by id .
 * @param {express.Request} req - Request
 * @param {express.Response} res - Response
 */
module.exports.DeleteConversationById = async (req, res) => {
  try {
    let conversationId = req.params.id;
    let conversation = await ConversationService.findByIdAndRemove(conversationId);
    conversation.child.map((v, k) => {
      deleteMessenger(v);
    });
    res.json(conversation);
  } catch (error) {
    res.status.json(error);
  }
};

const deleteMessenger = async (messageId) => {
  await MessengerService.findByIdAndRemove(messageId);
};
