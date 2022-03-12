const express = require("express");

const auth = require("../middlewares/userAuth");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  res.send();
});

router.post("/logout", auth, async (req, res) => {
  try {
  } catch (error) {}
});

router.post("/logoutall", auth, async (req, res) => {
  try {
  } catch (error) {}
});

router.post("/login", async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
  } catch (error) {
    if (error.keyValue)
      return res.status(400).send({
        message: `  ${Object.keys(
          error.keyValue
        )} already exist please use unique one...!`,
      });
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
