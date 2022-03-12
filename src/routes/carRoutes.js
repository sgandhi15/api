const express = require("express");
const auth = require("../middlewares/auth");
const {
  getFusion,
  getVehicleRegistrationID,
  getNewCar,
  carRace,
} = require("../middlewares/helpers");
const { Car } = require("../models/Car");
const { Race } = require("../models/Race");

const router = express.Router();

// router.get("/car/:id", async (req, res) => {
//   const car = await Car.findById(req.params.id);
// });

// router.post("/car", auth, async (req, res) => {
//   const task = new Task({
//     ...req.body,
//     owner: req.user._id,
//   });

//   try {
//     await task.save();
//     res.status(201).send(task);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// router.get("/all", auth, async (req, res) => {
//   const match = {};
//   const sort = {};

//   if (req.query.completed) {
//     match.completed = req.query.completed === "true";
//   }

//   if (req.query.sortBy) {
//     const parts = req.query.sortBy.split(":");
//     sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
//   }

//   try {
//     await req.user
//       .populate({
//         path: "tasks",
//         match,
//         options: {
//           limit: parseInt(req.query.limit),
//           skip: parseInt(req.query.skip),
//           sort,
//         },
//       })
//       .execPopulate();
//     res.send(req.user.tasks);
//   } catch (error) {}
// });

// router.get("/car/:id", auth, async (req, res) => {
//   try {
//   } catch (error) {}
// });

//auth
router.post("/race", async (req, res) => {
  try {
    if (!req.body) throw new Error("No data provided with request...!");
    const car = await Car.findOne({ _id: req.body.id });
    if (!car) throw new Error("No car found...!");
    if (car.carFuel < 15) throw new Error("Please refuel your car");
    const AICars = await Car.aggregate([
      { $match: { _id: { $not: { $eq: req.body.id } } } },
      { $sample: { size: 4 } },
    ]);

    const cars = [car, ...AICars];
    const raceResult = await new Race(await carRace(cars));
    car.carFuel -= 15;
    const newData = await car.save();
    const carsData = [newData._doc, ...AICars];
    await raceResult.save();
    res.status(200).send([carsData, raceResult]);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/quickrace", async (req, res) => {
  try {
    if (!req.body) throw new Error("No data provided with request...!");
    const car = await Car.findOne({ _id: req.body.id });
    if (!car) throw new Error("No car found...!");
    const AICars = await Car.aggregate([
      { $match: { _id: { $not: { $eq: req.body.id } } } },
      { $sample: { size: 4 } },
    ]);

    const cars = [car, ...AICars];
    const raceResult = await new Race(await carRace(cars));
    const newData = await car.save();
    const carsData = [newData._doc, ...AICars];
    await raceResult.save();
    res.status(200).send([carsData, raceResult]);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/one", async (req, res) => {
  try {
    const car = await Car.findById(req.body.id);
    if (!car) throw new Error("No car found for this id...!");
    res.status(200).send({ message: "Car found...!", ...car._doc });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//All cars//Sorting baki/// -1 index remove
router.get("/all", async (req, res) => {
  try {
    const cars = await Car.find();
    res.send(cars);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

////////////////////////////////////////////////////////////////
// Done
router.post("/registration", async (req, res) => {
  try {
    if (!req.body) throw new Error("No data provided with request...!");
    const car = await Car.findOne({ _id: req.body.id });
    if (!car) throw new Error("No car found...!");
    if (car.registrationNo !== "?")
      return res.status(400).send("Car already registered");
    car.registrationNo = await getVehicleRegistrationID(7);
    car.isRegister = true;
    await car.save();
    res
      .status(200)
      .send({ message: "Car registered successfully...!", ...car._doc });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//auth
router.post("/changename", async (req, res) => {
  try {
    if (!req.body) throw new Error("No data provided with request...!");
    const car = await Car.findOne({ _id: req.body.id });
    if (!car) throw new Error("No car found...!");
    car.carName = req.body.newName;
    await car.save();
    res
      .status(200)
      .send({ message: "Name changed successfully...!", ...car._doc });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//auth
router.post("/buypowerups", async (req, res) => {
  try {
    if (!req.body) throw new Error("No data provided with request...!");
    const car = await Car.findOne({ _id: req.body.id });
    if (!car) throw new Error("No car found...!");
    if (car.carBoostSlotsFree === 0)
      throw new Error("Please purchase slots before buying boosters...!");
    switch (req.body.boost) {
      case "power":
        car.carPower += req.body.boostCount * 30;
        car.carPowerup = req.body.boostCount;
        car.sellPrice += req.body.boostCount * 50;
        car.carBoostSlotsFree -= 1;
        car.carExp += req.body.boostCount * 3000;
        break;
      case "drift":
        car.carDrift += req.body.boostCount * 30;
        car.carDriftup = req.body.boostCount;
        car.sellPrice += req.body.boostCount * 50;
        car.carBoostSlotsFree -= 1;
        break;
      case "speed":
        car.carSpeed += req.body.boostCount * 25;
        car.carSpeedup = req.body.boostCount;
        car.sellPrice += req.body.boostCount * 30;
        car.carBoostSlotsFree -= 1;
        break;
      default:
        throw new Error("Please provide valid booster to purchase...!");
    }
    await car.save();
    res
      .status(200)
      .send({ message: "Booster purchase completed...!", ...car._doc });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//auth
router.post("/buyslot", async (req, res) => {
  try {
    if (!req.body) throw new Error("No data provided with request...!");
    const car = await Car.findOne({ _id: req.body.id });
    if (!car) throw new Error("No car found...!");
    car.carBoostSlots += 1;
    car.carBoostSlotsFree += 1;
    await car.save();
    res
      .status(200)
      .send({ message: "Slot purchase complete...!", ...car._doc });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//user authenticate
router.get("/new", async (req, res) => {
  try {
    // if (req.body === undefined) throw new Error("Please send proper data");
    // let rarity;
    // if (req.user.level <= 8) rarity = ["Common"];
    // else if (req.user.level > 8 && req.user.level <= 30)
    //   rarity = ["Common", "Classic"];
    // else if (req.user.level > 30) rarity = ["Common", "Classic", "Super Car"];
    let rarity = ["Common", "Classic", "Super Car", "Rare"];
    const car = await new Car(await getNewCar(rarity));
    if (!car) throw new Error("Error getting new car...!");
    await car.save();
    res.status(200).json({ message: "Successfully saved to db", ...car._doc });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

//auth
router.post("/paidfuelfull", async (req, res) => {
  try {
    if (!req.body) throw new Error("No data provided with request...!");
    const car = await Car.findOne({ _id: req.body.id });
    if (!car) throw new Error("No car found...!");
    car.carFuel = car.carMaxFuel;
    await car.save();
    res
      .status(201)
      .send({ message: "Fuel purchase completed...!", ...car._doc });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//auth
router.post("/paidfuel", async (req, res) => {
  try {
    if (!req.body) throw new Error("No data provided with request...!");
    const car = await Car.findOne({ _id: req.body.id });
    if (!car) throw new Error("No car found...!");
    car.carFuel += 15;
    if (car.carFuel > car.carMaxFuel) car.carFuel = car.carMaxFuel;
    await car.save();
    res
      .status(201)
      .send({ message: "Fuel purchased successfully...!", ...car._doc });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//auth
router.post("/fusion", async (req, res) => {
  try {
    if (!req.body) throw new Error("No data provided with request...!");
    const car1 = await Car.findOne({ _id: req.body.car1 });
    const car2 = await Car.findOne({ _id: req.body.car2 });
    if (!car1 || !car2) throw new Error("No car found...!");

    let fusionCar = {};
    if (car1.rarity === "Common" && car2.rarity === "Common") {
      fusionCar = await getFusion(car1, car2, "Super Car", 100);
    } else if (
      (car1.rarity === "Classic" && car2.rarity === "Super Car") ||
      (car1.rarity === "Super Car" && car2.rarity === "Classic")
    ) {
      fusionCar = await getFusion(car1, car2, "Rare", 115);
    } else if (
      (car1.rarity === "Super Car" && car2.rarity === "Rare") ||
      (car1.rarity === "Rare" && car2.rarity === "Super Car")
    ) {
      fusionCar = await getFusion(car1, car2, "Legendary", 130);
    } else {
      fusionCar = await getNewCar(["Rare"]);
    }

    const fusion = new Car(fusionCar);
    car1.carID = -1;
    car2.carID = -1;
    await fusion.save();
    await car1.save();
    await car2.save();
    res
      .status(200)
      .send({ message: "Fusion completed successfully...!", ...fusion._doc });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
