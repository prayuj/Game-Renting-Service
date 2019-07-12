const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Game = new Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  items: [
    {
      console: String,
      serial_no: String,
      status: String,
      responsible: String,
      description: String,
      mrp: String
    }
  ]
});
module.exports = mongoose.model("Game", Game);
