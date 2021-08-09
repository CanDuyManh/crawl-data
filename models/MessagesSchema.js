const { Schema, mongoose } = require('../commons/ConnectDB');
const MessagesSchema = new Schema({
  message: String,
  from: String,
  created_time: Schema.Types.Date
},
{ collection: 'messages' });
module.exports = mongoose.model('messages', MessagesSchema);
