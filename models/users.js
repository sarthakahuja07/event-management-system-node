const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
  },
  {
    timestamps: true
  }
);
// Compile model from schema
var Users = mongoose.model("Users", userSchema);
module.exports = Users;
