const fs = require("fs");
const path = require("path");
const { names } = require("../configs/carnames");
const { Car } = require("../models/Car");

exports.getCarName = async () => {
  return names[Math.floor(Math.random() * names.length)];
};

let carID;
const setCarID = () => {
  try {
    const filePath = path.join(__dirname, "../configs/counter.txt");
    carID = parseInt(fs.readFileSync(filePath, "utf8"));
    carID += 1;
    fs.writeFileSync(filePath, carID.toString());
  } catch (err) {
    console.error(err);
  }
};

exports.getCarID = () => {
  setCarID();
  return carID;
};

let raceID;
const setRaceID = () => {
  try {
    const filePath = path.join(__dirname, "../configs/racecounter.txt");
    raceID = parseInt(fs.readFileSync(filePath, "utf8"));
    raceID += 1;
    fs.writeFileSync(filePath, raceID.toString());
  } catch (err) {
    console.error(err);
  }
};

exports.getRaceID = () => {
  setRaceID();
  return raceID;
};

const getRandomString = async (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.getVehicleRegistrationID = async (length) => {
  const result = await getRandomString(length);
  const cars = await Car.findOne({
    registrationNo: result,
  });
  if (!cars) {
    return result;
  } else getVehicleRegistrationID(length);
};

exports.getFusion = async (car1, car2, rarity, maxFuel) => {
  const fusion = {};
  fusion.carBoostSlots = 0;
  fusion.carBoostSlotsFree = 0;
  fusion.carDrift = (car1.carDrift + car2.carDrift) / 2 + 30;
  fusion.carDriftup = 0;
  fusion.carExp = (car1.carExp + car2.carExp) / 2 + 1000;
  fusion.carFuel = maxFuel;
  fusion.carID = await this.getCarID();
  fusion.carImage = await getCarImage();
  fusion.carLevel = Math.floor((car1.carLevel + car2.carLevel) / 2 + 5);
  fusion.carMaxFuel = maxFuel;
  fusion.carName = await this.getCarName();
  fusion.carPower = (car1.carPower + car2.carPower) / 2 + 50;
  fusion.carPowerup = 0;
  fusion.carSpeed = (car1.carSpeed + car2.carSpeed) / 2 + 100;
  fusion.carSpeedup = 0;
  fusion.isFusion = true;
  fusion.isRegister = true;
  fusion.rarity = rarity;
  fusion.registrationNo = await this.getVehicleRegistrationID(7);
  fusion.sellPrice = (car1.sellPrice + car2.sellPrice) / 2 + 100;
  return fusion;
};

const setRarity = (rarity) => {
  return rarity[Math.floor(Math.random() * rarity.length)];
};

const setRandomInt = (max, min) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

exports.getNewCar = async (rarity) => {
  return {
    carBoostSlots: 0,
    carBoostSlotsFree: 0,
    carDrift: await setRandomInt(100, 50),
    carDriftup: 0,
    carExp: await setRandomInt(1000, 0),
    carID: await this.getCarID(),
    carImage: await getCarImage(),
    carLevel: await setRandomInt(20, 3),
    carName: await this.getCarName(),
    carPower: await setRandomInt(300, 100),
    carPowerup: 0,
    carSpeed: await setRandomInt(400, 100),
    carSpeedup: 0,
    rarity: await setRarity(rarity),
  };
};

const getCarImage = async () => {
  const filePath = path.join(
    __dirname,
    `../public/images/car/${await setRandomInt(1, 50)}.png`
  );

  return fs.readFileSync(filePath, "base64");
};

exports.carRace = async (cars) => {
  try {
    let race = {};
    let positions = [1, 2, 3, 4, 5];
    let carPositions = [];
    switch (cars[0].rarity) {
      case "Common":
        carPositions[0] = setRandomInt(5, 1);

        break;
      case "Classic":
        carPositions[0] = setRandomInt(4, 1);

        break;
      case "Super Car":
        carPositions[0] = setRandomInt(4, 1);

        break;
      case "Rare":
        carPositions[0] = setRandomInt(3, 1);

        break;
      case "Legendary":
        carPositions[0] = setRandomInt(2, 1);

        break;
      default:
        break;
    }
    positions.splice(positions.indexOf(carPositions[0]), 1);
    carPositions = [...carPositions, ...positions];
    race.positions = carPositions;
    race.raceID = await this.getRaceID();
    race.cars = [
      cars[0]._id,
      cars[1]._id,
      cars[2]._id,
      cars[3]._id,
      cars[4]._id,
    ];
    race.raceUser = cars[0].carOwner;
    race.raceCar = cars[0]._id;

    switch (carPositions[0]) {
      case 1:
        race.raceReward = 10;
        race.raceExp = 400;

        break;
      case 2:
        race.raceReward = 8;
        race.raceExp = 300;

        break;
      case 3:
        race.raceReward = 5;
        race.raceExp = 200;

        break;
      case 4:
        race.raceReward = 3;
        race.raceExp = 100;

        break;
      case 5:
        race.raceReward = 0;
        race.raceExp = 50;
        break;
      default:
        throw new Error("Invalid data for race...!");
    }
    return race;
  } catch (error) {
    throw new Error("Please contact admins...!");
  }
};
