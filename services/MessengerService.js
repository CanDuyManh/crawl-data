// Model && logic
const MessagesSchema = require('../models/MessagesSchema');

module.exports.findByIdAndRemove = async (messenger) => {
  let data = await MessagesSchema.findByIdAndRemove(messenger);
  return data;
};

module.exports.findOneAndUpdate = async (filter, update, option) => {
  let data = await MessagesSchema.findOneAndUpdate(filter, update, option);
  return data;
};

module.exports.save = async (messenger) => {
  let model = new MessagesSchema(messenger);
  let data = await model.save();
  return data;
};

module.exports.findById = async (messenger) => {
  let data = await MessagesSchema.findById(messenger);
  return data;
};

module.exports.find = async () => {
  let data = await MessagesSchema.find();
  return data;
};

module.exports.findOne = async (messenger) => {
  let data = await MessagesSchema.findOne(messenger);
  return data;
};
