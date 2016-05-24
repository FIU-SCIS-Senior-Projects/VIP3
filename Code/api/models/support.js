var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SupportSchema = new Schema({
    user_id: { type: String },
    header: { type: String, required: true },
    verifyCode: { type: String },
    date: { type: Number },
});

module.exports = mongoose.model('Support', SupportSchema);
