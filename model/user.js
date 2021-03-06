const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  role: {
    type: String,
    default: 'guest',
    enum: ['guest', 'admin'],
  },
  token: { type: String },
  refreshtoken: { type: String },
});

module.exports = mongoose.model("user", userSchema);