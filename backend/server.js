const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 4000;
const customerRoutes = express.Router();
const gameRoutes = express.Router();
const transactionRoutes = express.Router();
let Customer = require("./customer.model");
let Game = require("./game.model");
let Transaction = require("./transaction.model");

app.use(cors());
app.use(bodyParser.json());
app.use("/customer", customerRoutes);
app.use("/game", gameRoutes);
app.use("/transaction", transactionRoutes);

customerRoutes.route("/").get(function(req, res) {
  Customer.aggregate([
    {
      $unwind: "$membership"
    },
    {
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "customer_id",
        as: "transactions"
      }
    },
    {
      $project: {
        name: 1,
        membership: 1,
        email: 1,
        dateOfJoin: 1,
        noOfGames: {
          $size: {
            $filter: {
              input: "$transactions",
              as: "transactions",
              cond: {
                $eq: ["$$transactions.return", false]
              }
            }
          }
        }
      }
    },
    {
      $group: {
        _id: "$_id",
        noOfGames: {
          $first: "$noOfGames"
        },
        name: { $first: "$name" },
        email: { $first: "$email" },
        dateOfJoin: { $first: "$dateOfJoin" },
        maxStart: {
          $max: "$membership.start"
        },
        noOfGames: { $first: "$noOfGames" },
        membership: {
          $push: {
            _id: "$membership._id",
            plan: "$membership.plan",
            start: "$membership.start",
            end: "$membership.end",
            active: "$membership.active"
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        dateOfJoin: 1,
        noOfGames: 1,
        latestMembership: {
          $setDifference: [
            {
              $map: {
                input: "$membership",
                as: "membership",
                in: {
                  $cond: [
                    {
                      $eq: ["$maxStart", "$$membership.start"]
                    },
                    "$$membership",
                    false
                  ]
                }
              }
            },
            [false]
          ]
        }
      }
    },
    {
      $unwind: "$latestMembership"
    },
    {
      $sort: {
        name: 1
      }
    }
  ])
    .then(docs => res.status(200).json(docs))
    .catch(err => res.status(500).json(err));
});

gameRoutes.route("/").get(function(req, res) {
  Game.aggregate([
    {
      $project: {
        numberAvailable: {
          $size: {
            $filter: {
              input: "$items",
              as: "item",
              cond: { $eq: ["$$item.status", "Available"] }
            }
          }
        },
        numberPS4Available: {
          $size: {
            $filter: {
              input: "$items",
              as: "item",
              cond: {
                $and: [
                  { $eq: ["$$item.status", "Available"] },
                  { $eq: ["$$item.console", "PS4"] }
                ]
              }
            }
          }
        },
        numberXBOXAvailable: {
          $size: {
            $filter: {
              input: "$items",
              as: "item",
              cond: {
                $and: [
                  { $eq: ["$$item.status", "Available"] },
                  { $eq: ["$$item.console", "XBOX One"] }
                ]
              }
            }
          }
        },
        _id: 1,
        name: 1,
        description: 1,
        items: 1
      }
    },
    {
      $sort: {
        name: 1
      }
    }
  ])
    .then(docu => res.status(200).json(docu))
    .catch(err => res.status(500).json(err));
});

customerRoutes.route("/dashboard").get(function(req, res) {
  Customer.find(
    {},
    "name email dateOfJoin",
    {
      _id: 1,
      sort: {
        dateOfJoin: -1
      },
      limit: 5
    },
    (err, customers) => {
      if (err) {
        console.log(err);
      } else {
        res.json(customers);
      }
    }
  );
});

gameRoutes.route("/dashboard/issue").get(function(req, res) {
  Transaction.aggregate([
    {
      $lookup: {
        from: "customers",
        localField: "customer_id",
        foreignField: "_id",
        as: "customerInfo"
      }
    },
    { $unwind: "$customerInfo" },
    {
      $lookup: {
        from: "games",
        localField: "game_id",
        foreignField: "_id",
        as: "gameInfo"
      }
    },
    { $unwind: "$gameInfo" },
    { $unwind: "$gameInfo.items" },
    {
      $match: { $expr: { $eq: ["$item_id", "$gameInfo.items._id"] } }
    },
    {
      $sort: {
        date_issue: -1
      }
    },
    {
      $limit: 5
    }
  ])
    .then(resp => {
      res.status(200).json(resp);
    })
    .catch(err => res.status(500).json(err));
});

gameRoutes.route("/dashboard/return").get(function(req, res) {
  Transaction.aggregate([
    { $match: { return: true } },
    {
      $lookup: {
        from: "customers",
        localField: "customer_id",
        foreignField: "_id",
        as: "customerInfo"
      }
    },
    { $unwind: "$customerInfo" },
    {
      $lookup: {
        from: "games",
        localField: "game_id",
        foreignField: "_id",
        as: "gameInfo"
      }
    },
    { $unwind: "$gameInfo" },
    { $unwind: "$gameInfo.items" },
    {
      $match: { $expr: { $eq: ["$item_id", "$gameInfo.items._id"] } }
    },
    {
      $sort: {
        date_return: -1
      }
    },
    {
      $limit: 5
    }
  ])
    .then(resp => {
      res.status(200).json(resp);
    })
    .catch(err => res.status(500).json(err));
});

customerRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Customer.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    { $unwind: "$membership" },
    {
      $sort: {
        "membership.active": -1
      }
    },
    {
      $group: {
        _id: "$_id",
        membership: { $push: "$membership" },
        dateOfJoin: { $first: "$dateOfJoin" },
        name: { $first: "$name" },
        email: { $first: "$email" },
        address: { $first: "$address" },
        address2: { $first: "$address2" },
        mobile_no: { $first: "$mobile_no" },
        alt_mobile_no: { $first: "$alt_mobile_no" },
        city: { $first: "$city" },
        zip: { $first: "$zip" }
      }
    }
  ])
    .then(docs => res.status(200).json(docs[0]))
    .catch(err => res.status(400).json(err));
});

gameRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Game.aggregate([
    {
      $project: {
        numberAvailable: {
          $size: {
            $filter: {
              input: "$items",
              as: "item",
              cond: { $eq: ["$$item.status", "Available"] }
            }
          }
        },
        numberPS4Available: {
          $size: {
            $filter: {
              input: "$items",
              as: "item",
              cond: {
                $and: [
                  { $eq: ["$$item.status", "Available"] },
                  { $eq: ["$$item.console", "PS4"] }
                ]
              }
            }
          }
        },
        numberXBOXAvailable: {
          $size: {
            $filter: {
              input: "$items",
              as: "item",
              cond: {
                $and: [
                  { $eq: ["$$item.status", "Available"] },
                  { $eq: ["$$item.console", "XBOX One"] }
                ]
              }
            }
          }
        },
        _id: 1,
        name: 1,
        description: 1,
        items: 1
      }
    },
    {
      $match: {
        _id: mongoose.Types.ObjectId(id)
      }
    }
  ])
    .then(docu => res.status(200).json(docu[0]))
    .catch(err => res.status(500).json(err));
});

customerRoutes.route("/history/:id").get(function(req, res) {
  let id = req.params.id;
  Transaction.aggregate([
    {
      $match: {
        customer_id: mongoose.Types.ObjectId(id)
      }
    },
    {
      $lookup: {
        from: "games",
        localField: "game_id",
        foreignField: "_id",
        as: "gameInfo"
      }
    },
    { $unwind: "$gameInfo" },
    { $unwind: "$gameInfo.items" },
    {
      $match: { $expr: { $eq: ["$item_id", "$gameInfo.items._id"] } }
    },
    {
      $sort: {
        date_issue: -1
      }
    }
  ])
    .then(resp => {
      res.status(200).json(resp);
    })
    .catch(err => res.status(500).json(err));
});

gameRoutes.route("/history/:id").get(function(req, res) {
  let id = req.params.id;
  Transaction.aggregate([
    {
      $match: {
        game_id: mongoose.Types.ObjectId(id)
      }
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer_id",
        foreignField: "_id",
        as: "customerInfo"
      }
    },
    { $unwind: "$customerInfo" },
    {
      $lookup: {
        from: "games",
        localField: "game_id",
        foreignField: "_id",
        as: "gameInfo"
      }
    },
    { $unwind: "$gameInfo" },
    { $unwind: "$gameInfo.items" },
    {
      $match: { $expr: { $eq: ["$item_id", "$gameInfo.items._id"] } }
    },
    {
      $sort: {
        date_issue: -1
      }
    }
  ])
    .then(resp => {
      res.status(200).json(resp);
    })
    .catch(err => res.status(500).json(err));
});

gameRoutes.route("/items/:id").get(function(req, res) {
  let id = req.params.id;
  Game.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(id)
      }
    },
    {
      $unwind: "$items"
    },
    {
      $addFields: {
        convertedId: {
          $cond: [
            { $eq: ["$items.responsible", "Owner"] },
            "$items.responsible",
            { $toObjectId: "$items.responsible" }
          ]
        }
      }
    },
    {
      $lookup: {
        from: "customers",
        localField: "convertedId",
        foreignField: "_id",
        as: "customerInfo"
      }
    }
  ])
    .then(resp => {
      res.status(200).json(resp);
    })
    .catch(err => res.status(500).json(err));
});

customerRoutes.route("/issue/:id").get(function(req, res) {
  let id = mongoose.Types.ObjectId(req.params.id);
  console.log(id);
  Customer.aggregate([
    {
      $match: {
        _id: id
      }
    },
    {
      $unwind: "$membership"
    },
    {
      $match: {
        "membership.active": true
      }
    },
    {
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "customer_id",
        as: "transactions"
      }
    },
    {
      $project: {
        name: 1,
        membership: 1,
        noOfGames: {
          $size: {
            $filter: {
              input: "$transactions",
              as: "transactions",
              cond: {
                $eq: ["$$transactions.return", false]
              }
            }
          }
        }
      }
    },
    {
      $group: {
        _id: "$_id",
        plan: {
          $first: "$membership.plan"
        },
        noOfGames: {
          $first: "$noOfGames"
        },
        name: { $first: "$name" }
      }
    }
  ]).then(docs => res.status(200).json(docs[0]));
});

customerRoutes.route("/issue/:id").post(function(req, res) {
  let customer_id = mongoose.Types.ObjectId(req.params.id);
  Game.find(
    {
      _id: mongoose.Types.ObjectId(req.body.game_id),
      items: {
        $elemMatch: { console: req.body.console, status: "Available" }
      }
    },
    { "items.$": 1 },
    (err, documents) => {
      console.log(JSON.stringify(documents));
      if (err) console.log(err);
      else if (documents.length) {
        console.log("There exist");
        item_id = documents[0].items[0]._id;
        console.log(documents[0].items[0]._id);
        Game.findOneAndUpdate(
          {
            _id: mongoose.Types.ObjectId(req.body.game_id),
            "items._id": item_id
          },
          {
            $set: {
              "items.$.status": "Unavailable",
              "items.$.responsible": customer_id
            }
          },
          function(err, doc) {
            if (err) console.log(err);
            else {
              let document_to_insert = {
                customer_id: customer_id,
                game_id: req.body.game_id,
                item_id: item_id,
                date_issue: new Date(),
                return: false
              };
              let transaction = new Transaction(document_to_insert);
              console.log(JSON.stringify(document_to_insert));
              transaction
                .save()
                .then(game => {
                  res.status(200).json({ game: transaction._id });
                })
                .catch(err => {
                  res.status(400).json(err);
                });
            }
          }
        );
      } else {
        res.status(200).json({ game: "Not Available" });
      }
    }
  );
});

gameRoutes.route("/issue/get").get(function(req, res) {
  Game.find(
    { "items.status": "Available" },
    "_id name",
    {
      sort: {
        name: 1
      }
    },
    (err, doc) => {
      res.status(200).json(doc);
    }
  );
});

customerRoutes.route("/return/all").get(function(req, res) {
  let id = req.params.id;
  Transaction.aggregate([
    {
      $match: {
        return: false
      }
    },
    {
      $lookup: {
        from: "games",
        localField: "game_id",
        foreignField: "_id",
        as: "gameInfo"
      }
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer_id",
        foreignField: "_id",
        as: "customerInfo"
      }
    },
    { $unwind: "$gameInfo" },
    { $unwind: "$customerInfo" },
    { $unwind: "$gameInfo.items" },
    {
      $match: { $expr: { $eq: ["$item_id", "$gameInfo.items._id"] } }
    }
  ])
    .then(resp => {
      res.status(200).json(resp);
    })
    .catch(err => res.status(500).json(err));
});

customerRoutes.route("/return/:id").get(function(req, res) {
  let id = req.params.id;
  Transaction.aggregate([
    {
      $match: {
        customer_id: mongoose.Types.ObjectId(id)
      }
    },
    {
      $match: {
        return: false
      }
    },
    {
      $lookup: {
        from: "games",
        localField: "game_id",
        foreignField: "_id",
        as: "gameInfo"
      }
    },
    { $unwind: "$gameInfo" },
    { $unwind: "$gameInfo.items" },
    {
      $match: { $expr: { $eq: ["$item_id", "$gameInfo.items._id"] } }
    }
  ])
    .then(resp => {
      res.status(200).json(resp);
    })
    .catch(err => res.status(500).json(err));
});

customerRoutes.route("/return/:id").post(function(req, res) {
  let id = req.params.id;
  let transaction_id = req.body.transaction_id;
  let game_id = req.body.game_id;
  let item_id = req.body.item_id;

  Transaction.findOneAndUpdate(
    { _id: transaction_id },
    {
      $set: {
        return: true,
        date_return: new Date()
      }
    },
    (err, doc) => {
      if (err) res.status(400).json({ status: "Unsuccesful" });
      else {
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
  console.log(req.body.city);
  Customer.findById(req.params.id, function(err, cust) {
    if (!cust) res.status(404).send("data is not found");
    else {
      console.log(cust.city);
      cust.name = req.body.name;
      cust.email = req.body.email;
      cust.address = req.body.address;
      cust.address2 = req.body.address2;
      cust.city = req.body.city;
      console.log(cust.city);
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

transactionRoutes.route("/").get(function(req, res) {
  Transaction.aggregate([
    {
      $lookup: {
        from: "games",
        localField: "game_id",
        foreignField: "_id",
        as: "gameInfo"
      }
    },
    {
      $unwind: "$gameInfo"
    },
    {
      $unwind: "$gameInfo.items"
    },
    {
      $match: {
        $expr: {
          $eq: ["$item_id", "$gameInfo.items._id"]
        }
      }
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer_id",
        foreignField: "_id",
        as: "customerInfo"
      }
    },
    {
      $unwind: "$customerInfo"
    },
    {
      $sort: {
        date_issue: -1
      }
    }
  ]).then(docs => res.status(200).json(docs));
});

transactionRoutes.route("/:id").get(function(req, res) {
  Transaction.aggregate([
    {
      $lookup: {
        from: "games",
        localField: "game_id",
        foreignField: "_id",
        as: "gameInfo"
      }
    },
    {
      $unwind: "$gameInfo"
    },
    {
      $unwind: "$gameInfo.items"
    },
    {
      $match: {
        $expr: {
          $eq: ["$item_id", "$gameInfo.items._id"]
        }
      }
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer_id",
        foreignField: "_id",
        as: "customerInfo"
      }
    },
    {
      $unwind: "$customerInfo"
    },
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.params.id)
      }
    },

    {
      $sort: {
        date_issue: -1
      }
    }
  ]).then(docs => res.status(200).json(docs[0]));
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

function updateMembership() {
  console.log("Hello");
  let todayDate = new Date();
  Customer.aggregate([
    {
      $unwind: "$membership"
    },
    {
      $match: {
        "membership.active": true
      }
    }
  ]).then(docs => {
    for (let i = 0; i < docs.length; i++) {
      let end_date = docs[i].membership.end;
      if (end_date.getTime() < todayDate.getTime()) {
        console.log(docs[i]);
        Customer.updateOne(
          { _id: docs[i]._id, "membership._id": docs[i].membership._id },
          {
            $set: {
              "membership.$.active": false
            }
          },
          (error, res) => {
            if (error) console.log(error);
            else console.log(res);
          }
        );
      }
    }
  });
}

setInterval(updateMembership, 5000);
