const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 4000;
const customerRoutes = express.Router();
let Customer = require("./customer.model");

app.use(cors());
app.use(bodyParser.json());
app.use("/customer", customerRoutes);

customerRoutes.route("/").get(function(req, res) {
  Customer.find(
    { "membership.active": true },
    { _id: 1, name: 1, email: 1, "membership.$": 1 },
    (err, customers) => {
      if (err) {
        console.log(err);
      } else {
        res.json(customers);
      }
    }
  );
});

customerRoutes.route("/add").post(function(req, res) {
  let customer = new Customer(req.body);
  customer
    .save()
    .then(cust => {
      res
        .status(200)
        .json({ cust: "customer added successfully " + customer._id });
    })
    .catch(err => {
      res.status(400).send("adding new customer failed");
    });
});

mongoose.connect("mongodb://127.0.0.1:27017/gamerent", {
  useNewUrlParser: true
});
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established succesfully");
});

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
