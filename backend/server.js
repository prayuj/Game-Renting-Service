const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 4000;
const customerRoutes = express.Router();
const gameRoutes = express.Router();
let Customer = require("./customer.model");
let Game = require("./game.model");

app.use(cors());
app.use(bodyParser.json());
app.use("/customer", customerRoutes);
app.use("/game", gameRoutes);

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

gameRoutes.route("/").get(function(req, res) {
  Game.find({ "items.status": "Available" }, (err, customers) => {
    if (err) {
      console.log(err);
    } else {
      res.json(customers);
    }
  });
});

customerRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Customer.findById(id, function(err, cust) {
    res.json(cust);
  });
});

gameRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Game.findById(id, function(err, game) {
    res.json(game);
  });
});

customerRoutes.route("/plan/:id").get(function(req, res) {
  let id = req.params.id;
  Customer.findById(id, function(err, cust) {
    res.json(cust.membership);
  });
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

gameRoutes.route("/add").post(function(req, res) {
  let game = new Game(req.body);
  game
    .save()
    .then(game => {
      res.status(200).json({ game: "game added successfully " + game._id });
    })
    .catch(err => {
      res.status(400).send("adding new customer failed");
    });
});

customerRoutes.route("/update/:id").post(function(req, res) {
  Customer.findById(req.params.id, function(err, cust) {
    if (!cust) res.status(404).send("data is not found");
    else {
      console.log(req.body);
      cust.name = req.body.name;
      cust.email = req.body.email;
      cust.address = req.body.address;
      cust.address2 = req.body.address2;
      cust.city = req.body.city;
      cust.zip = req.body.zip;
      cust.modile_no = req.body.modile_no;
      cust.alt_modile_no = req.body.alt_modile_no;

      cust
        .save()
        .then(cust => {
          res.status(200).json("Customer updated!");
        })
        .catch(err => {
          res.status(400).send("Update not possible");
        });
    }
  });
});

gameRoutes.route("/update/:id").post(function(req, res) {
  console.log(req.body);
  Game.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { upsert: true },
    function(err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send("succesfully saved");
    }
  );
});

customerRoutes.route("/add_plan/:id").post(function(req, res) {
  console.log(req.body);
  Customer.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { upsert: true },
    function(err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send("succesfully saved");
    }
  );
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
