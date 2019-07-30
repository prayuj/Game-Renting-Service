const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

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
  zip: {
    type: String
  },
  city: {
    type: String
  },
  membership: [
    {
      plan: String,
      start: Date,
      end: Date,
      active: Boolean
    }
  ],
  secret: {
    type: String
  }
});

Customer.index({ name: "text" });

module.exports = mongoose.model("Customer", Customer);
