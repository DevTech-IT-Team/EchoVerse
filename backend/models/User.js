const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  dob:Date,contactNumber:String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
