const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Customer = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  address2: {
    type: String
  },
  mobile_no: {
    type: String
  },
  alt_mobile_no: {
    type: String
  },
  dateOfJoin: {
    type: Date
  },
  membership: [
    {
      plan: String,
      start: Date,
      end: Date,
      active: Boolean
    }
  ]
});
module.exports = mongoose.model("Customer", Customer);
