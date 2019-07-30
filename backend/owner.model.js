const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Owner = new Schema({
  email: {
    type: String
  },
  password: {
    type: String
  }
});
module.exports = mongoose.model("Owner", Owner);
