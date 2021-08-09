const { Schema, mongoose } = require('../commons/ConnectDB');
const ConversationsSchema = new Schema({
  fbID: String,
  name: String,
  child: [{ type: Schema.Types.ObjectId, ref: 'messages' }],
},
{ collection: 'conversations' });
module.exports = mongoose.model('conversations', ConversationsSchema);
