var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listSchema = new Schema({
  user_id: String,
  name: String,
  sended: String,
  messageID: String
});

var Fb = mongoose.model('Fb', listSchema);

module.exports = Fb;
