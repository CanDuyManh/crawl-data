// Model && logic
const ConversationsSchema = require('../models/ConversationsSchema');

module.exports.findByIdAndRemove = async (conversation) => {
  let data = await ConversationsSchema.findByIdAndRemove(conversation);
  return data;
};

module.exports.findOneAndUpdate = async (filter, update, option) => {
  let data = await ConversationsSchema.findOneAndUpdate(filter, update, option);
  return data;
};

module.exports.save = async (conversation) => {
  let model = new ConversationsSchema(conversation);
  let data = await model.save();
  return data;
};

module.exports.findById = async (conversation) => {
  let data = await ConversationsSchema.findById(conversation);
  return data;
};

module.exports.find = async () => {
  let data = await ConversationsSchema.find();
  return data;
};

module.exports.findOne = async (conversation) => {
  let data = await ConversationsSchema.findOne(conversation);
  return data;
};
