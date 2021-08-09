const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

console.log("open Connect");

const { Schema } = mongoose;

module.exports.Schema = Schema;
module.exports.mongoose = mongoose;
