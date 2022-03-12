const mongoose = require("mongoose");

const raceSchema = mongoose.Schema(
  {
    cars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
      },
    ],
    raceID: {
      type: Number,
    },
    raceTime: {
      type: Date,
      default: new Date(),
    },
    raceReward: {
      type: Number,
      required: true,
    },
    raceCar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    raceExp: {
      type: Number,
      required: true,
    },
    raceUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    positions: [
      {
        type: Number,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

exports.Race = mongoose.model("Race", raceSchema);
