const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let Transaction = new Schema({
  customer_id: {
    type: ObjectId
  },
  game_id: {
    type: ObjectId
  },
  item_id: {
    type: ObjectId
  },
  date_issue: {
    type: Date
  },
  date_return: {
    type: Date
  },
  return: {
    type: Boolean
  }
});
module.exports = mongoose.model("Transaction", Transaction);
