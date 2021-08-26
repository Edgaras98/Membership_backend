const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const URI = process.env.URI;
const client = new MongoClient(URI);

//GET /memberships

app.get("/memberships", async (req, res) => {
  try {
    const con = await client.connect();
    const response = await con
      .db("testasNode")
      .collection("services")
      .find()
      .toArray();
    await con.close();
    res.send(response);
  } catch (e) {
    res.status(500).send({ msg: "Invalid data" });
  }
});

//POST /memberships

app.post("/memberships", async (req, res) => {
  try {
    const con = await client.connect();
    const response = await con
      .db("testasNode")
      .collection("services")
      .insertOne({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      })
      .toArray();
    await con.close();
    res.send(response);
  } catch (e) {
    res.status(500).send({ msg: "Invalid data" });
  }
});
//Get users order

app.get("/users/:order", async (req, res) => {
  try {
    const con = await client.connect();
    const getData = await con
      .db("testasNode")
      .collection("users")
      .find()
      .sort({ name: req.params.order?.toLowerCase() === "z-a" ? -1 : 1 })
      .toArray();
    await con.close();
    res.send(getData);
  } catch (err) {
    res.status(500).send({ err: "Please try again" });
  }
});

//Post Users

app.post("/users", async (req, res) => {
  try {
    const con = await client.connect();
    const response = await con
      .db("testasNode")
      .collection("users")
      .insertOne({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        service_id: req.body.service_id,
      })
      .toArray();
    await con.close();
    res.send(response);
  } catch (e) {
    res.status(500).send({ msg: "Invalid data" });
  }
});

// DELETE /memberships/:id

app.delete("/memberships/:id", async (req, res) => {
  try {
    const con = await client.connect();
    const response = await con
      .db("testasNode")
      .collection("services")
      .deleteOne({ _id: ObjectId(req.params.id) });
    await con.close();
    res.send(response);
  } catch (e) {
    res.status(500).send({ error: "could not delete" });
  }
});

// GET /users

app.get("/users", async (req, res) => {
  try {
    const con = await client.connect();
    const response = await con
      .db("testasNode")
      .collection("users")
      .find()
      .toArray();
    await con.close();
    res.send(response);
  } catch (e) {
    res.status(500).send({ msg: "Invalid data" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Server is running on port " + port));
