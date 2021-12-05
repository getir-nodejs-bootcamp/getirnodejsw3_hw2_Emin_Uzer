const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const fs = require("fs");
let db = [
  { id: 1, username: "Admin 1", email: "admin1@admin.com" },
  {
    id: 2,
    username: "Admin 2",
    email: "admin2@admin.com",
  },
  {
    id: 3,
    username: "Admin 3",
    email: "admin3@admin.com",
  },
  {
    id: 4,
    username: "Admin 4",
    email: "admin4@admin.com",
  },
];

app.use(express.json());

app.get("/api/posts", verifyToken, (req, res) => {
  res.json(db);
});

app.post("/api/posts", verifyToken, (req, res) => {
  res.send("Got a POST request");
  db.push(req.body);
  //TODO:LOG
});

app.patch("/api/posts/:id", verifyToken, (req, res) => {
  for (let index = 0; index < db.length; index++) {
    if (db[index].id == req.params.id) {
      db[index] = {
        ...db[index],
        ...req.body,
      };
      res.send("Got a PATCH request at /api/posts/" + req.params.id);
      break;
    }
  }
});

app.put("/api/posts/:id", verifyToken, (req, res) => {
  for (let index = 0; index < db.length; index++) {
    if (db[index].id == req.params.id) {
      db[index] = req.body;
      res.send("Got a PUT request at /api/posts/" + req.params.id);
      break;
    }
  }
});

app.delete("/api/posts/:id", verifyToken, (req, res) => {
  for (let index = 0; index < db.length; index++) {
    if (db[index].id == req.params.id) {
      db.splice(index, 1);
      res.send("Got a DELETE request at /api/posts/" + req.params.id);
      break;
    }
  }
});

app.post("/api/login", (req, res) => {
  const user = db[0];
  jwt.sign({ user }, "secretkey", (err, token) => {
    res.json({
      token,
    });
  });
});

app.get("*", (req, res) => {
  res.status(404).send("404 NOT FOUND");
});

const port = 9000;
app.listen(port, () => {
  console.log(`Port ${port} active`);
});

function verifyToken(req, res, next) {
  // Geth auth header value
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, "secretkey", (err, authData) => {
      if (err) {
        res.sendStatus(401);
      }
    });
    next();
  } else {
    res.sendStatus(401);
  }
}
