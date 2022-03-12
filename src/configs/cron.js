const cron = require("node-cron");
const { Car } = require("../models/Car");
//12 hour job for increasing fuel
exports.cronJob = cron.schedule("0 0 */12 * * *", async function () {
  const cars = await Car.find({ isRegistered: true });
  //12 hour job for // Checking
  cars.map((car) => {
    if (car.carFuel <= car.carMaxFuel) {
      car.carFuel += 15;
      if (car.carFuel > car.carMaxFuel) {
        car.carFuel = car.carMaxFuel;
      }
    }
  });
});
