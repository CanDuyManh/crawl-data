const mongoose = require('mongoose');
const uri = "mongodb+srv://manh:123@cluster0.wruvb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log("open Connect");

const { Schema } = mongoose;

module.exports.Schema = Schema;
module.exports.mongoose = mongoose;
