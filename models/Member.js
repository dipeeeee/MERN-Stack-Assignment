const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  fullname:     { type: String, required: true },
  emailAddress: { type: String, required: true, unique: true },
  secretCode:   { type: String, required: true }
});

module.exports = mongoose.model('Member', MemberSchema);
