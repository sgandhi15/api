const express = require("express");
const { Race } = require("../models/Race");

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const cars = await Race.find();
    res.send(cars);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/one", async (req, res) => {
  try {
    console.log(req.body.id);
    const races = await Race.find({
      raceCar: req.body.id,
    });

    if (!races) throw new Error("No race found for this car...!");
    res.status(200).send(races);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
