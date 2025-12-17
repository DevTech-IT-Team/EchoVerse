const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isAdmin: {
        type: Boolean,
        default: false
    },
  dob:Date,contactNumber:String,
   role: { type: String, default: "user" }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
