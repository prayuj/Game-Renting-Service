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

customerRoutes.route("/issue/:id").get(function(req, res) {
  let id = req.params.id;
  console.log(id);
  Customer.find(
    {
      _id: id
    },
    {
      game: {
        $elemMatch: {
          return: false
        }
      },
      membership: {
        $elemMatch: {
          active: true
        }
      }
    },
    (err, customer) => {
      if (err) console.log(err);
      else {
        res.status(200).json(customer);
        console.log(JSON.stringify(customer));
      }
    }
  );
});

customerRoutes.route("/return/:id").get(function(req, res) {
  let id = req.params.id;
  console.log(id);
  Customer.find(
    {
      _id: id
    },
    (err, customer) => {
      if (err) console.log(err);
      else {
        res.status(200).json(customer);
        console.log(JSON.stringify(customer));
      }
    }
  );
});

customerRoutes.route("/return/:id").post(function(req, res) {
  let id = req.params.id;
  let game_id = req.body.game_id;
  let item_id = req.body.item_id;
  console.log(id, game_id, item_id);

  Customer.findOneAndUpdate(
    { _id: id, "game.game_id": game_id, "game.item_id": item_id },
    {
      $set: {
        "game.$.return": true,
        "game.$.dateReturn": new Date()
      }
    },
    (err, doc) => {
      if (err) res.status(400).json({ status: "Unsuccesful" });
      else {
        console.log(JSON.stringify(doc));
        Game.findOneAndUpdate(
          {
            _id: game_id,
            "items._id": item_id
          },
          {
            $set: {
              "items.$.status": "Available",
              "items.$.responsible": "Owner"
            }
          },
          (error, docu) => {
            if (error) res.status(400).json({ status: "Unsuccesful" });
            else {
              console.log(JSON.stringify(docu));
              res.status(200).json({ status: "Succesful" });
            }
          }
        );
      }
    }
  );
});

gameRoutes.route("/issue").post(function(req, res) {
  let game_id = req.body.game_id;
  let cust_id = req.body.cust_id;
  let game_console = req.body.console;
  console.log(game_id, cust_id, game_console);

  let item_id;

  Game.find(
    {
      _id: game_id,
      items: {
        $elemMatch: { console: game_console, status: "Available" }
      }
    },
    { "items.$": 1 },
    (err, documents) => {
      console.log(documents);
      if (err) console.log(err);
      else if (documents[0]) {
        item_id = documents[0].items[0]._id;
        console.log(documents[0].items[0]._id);
        if (item_id) {
          console.log("Hello");
          Game.findOneAndUpdate(
            { _id: game_id, "items._id": item_id },
            {
              $set: {
                "items.$.status": "Unavailable",
                "items.$.responsible": cust_id
              }
            },
            function(err, doc) {
              if (err) console.log(err);
              else res.status(200).json({ game_item_id: item_id });
            }
          );
        }
      } else {
        res.status(200).json({ game_item_id: "Not Available" });
      }
    }
  );
});

customerRoutes.route("/issue/:id").post(function(req, res) {
  console.log(req.params.id, req.body);
  // Customer.findByIdAndUpdate(
  //   req.params.id,
  //   req.body,
  //   { new: true, upsert: true },
  //   (err, document) => {
  //     console.log(JSON.stringify(document));
  //     res.status(200).json({ result: "successful" });
  //   }
  // );

  Customer.updateOne(
    { _id: req.params.id },
    {
      $push: {
        game: req.body
      }
    },
    { upsert: true },
    (err, document) => {
      console.log(JSON.stringify(document));
      if (err) res.status(400).json({ result: "unsuccessful" });
      else res.status(200).json({ result: "successful" });
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
