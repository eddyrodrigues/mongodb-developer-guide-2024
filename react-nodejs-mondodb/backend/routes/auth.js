const Router = require("express").Router;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = Router();

const db = require("../db");

const createToken = () => {
  return jwt.sign({}, "secret", { expiresIn: "1h" });
};

router.post("/login", (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Check if user login is valid
  // If yes, create token and return it to client
  bcrypt
    .hash(pw, 12)
    .then((hashedPW) => {
      // Store hashedPW in database
      db.getDb()
        .db()
        .collection("users")
        .findOne({ email: email })
        .then((userDoc) => {
          return bcrypt.compare(pw, userDoc.password);
        })
        .then((r) => {
          console.log(r);
          if (r) {
            const token = createToken();
            res.status(201).json({ token: token, user: { email } });
          } else {
            res.status(401).json({ message: "authentication failed" });
          }
        })
        .catch((err) => {
          console.log(err);
          res
            .status(500)
            .json({ message: "Creating the user failed." + err.message });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Creating the user failed." });
    });
});

router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Hash password before storing it in database => Encryption at Rest
  bcrypt
    .hash(pw, 12)
    .then((hashedPW) => {
      // Store hashedPW in database
      db.getDb()
        .db()
        .collection("users")
        .insertOne({ email: email, password: hashedPW })
        .then((r) => {
          const token = createToken();
          res
            .status(201)
            .json({ token: token, user: { email: "dummy@dummy.com" } });
        })
        .catch((err) => {
          console.log(err);
          res
            .status(500)
            .json({ message: "Creating the user failed." + err.message });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Creating the user failed." });
    });
  // Add user to database
});

module.exports = router;
