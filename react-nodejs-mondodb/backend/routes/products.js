const Router = require("express").Router;
const db = require("../db");
const router = Router();
const { ObjectId } = require("mongodb");

// Get list of products products
router.get("/", (req, res, next) => {
  // Return a list of dummy products
  // Later, this data will be fetched from MongoDB
  const queryPage = req.query.page;
  const pageSize = 5;
  let resultProducts = [];
  db.getDb()
    .db()
    .collection("products")
    .find()
    .forEach((p) => resultProducts.push(p))
    .then((_) => res.status(200).json(resultProducts));

  // if (queryPage) {
  //   resultProducts = products.slice(
  //     (queryPage - 1) * pageSize,
  //     queryPage * pageSize
  //   );
  // }
  // res.json(resultProducts);
});

// Get single product
router.get("/:id", (req, res, next) => {
  db.getDb()
    .db()
    .collection("products")
    .findOne({ _id: new ObjectId(req.params.id) })
    .then((productDoc) => res.status(200).json(productDoc));
});

// Add new product
// Requires logged in user
router.post("", (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price), // store this as 128bit decimal in MongoDB
    image: req.body.image,
  };
  console.log(newProduct);
  db.getDb()
    .db()
    .collection("products")
    .insertOne(newProduct)
    .then((p) => {
      res.status(201).json({ message: "Product added", productId: "DUMMY" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Edit existing product
// Requires logged in user
router.patch("/:id", (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price), // store this as 128bit decimal in MongoDB
    image: req.body.image,
  };
  console.log(updatedProduct);

  db.getDb()
    .db()
    .collection("products")
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...updatedProduct } }
    )
    .then((ret) => {
      console.log(ret);
      res.status(200).json({ message: "Product updated", productId: "DUMMY" });
    })
    .catch((e) => {
      res.status(500).json({ errorMessage: e.message });
    });
});

// Delete a product
// Requires logged in user
router.delete("/:id", (req, res, next) => {
  db.getDb()
    .db()
    .collection("products")
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then((ret) => {
      console.log(ret);
      res.status(200).json({ message: "Product deleted" });
    })
    .catch((e) => {
      res.status(500).json({ errorMessage: e.message });
    });
});

module.exports = router;
