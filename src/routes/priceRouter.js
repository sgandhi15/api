const express = require("express");
const { Price } = require("../models/Price");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const price = await Price.find();

    if (price === []) {
      const newPrice = await new Price();
      await newPrice.save();
    }
    res.send(price[0]);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
