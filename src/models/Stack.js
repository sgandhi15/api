//             lockDigit: "Jan 28, 1:25:35 PM",

const mongoose = require("mongoose");

const stackSchema = mongoose.Schema(
  {
    stackID: {
      type: Number,
      required: true,
    },
    stackImage: {
      type: String,
      required: true,
    },
    stackName: {
      type: String,
      required: true,
    },
    stackApr: {}, // dont know yet
    stackAprDigit: {},
    stackStatus: {
      type: String,
      required: true,
      enum: {
        values: ["profit", "loss"],
        message: "{VALUE} is not supported",
      },
    },
    stackStatusDigit: {}, //dont know yet
    stackDigit: {}, //dont know yet
    stackLock: {}, //dont know yet
    stack: {}, //dky
    stackLockDigit: {}, //dky
  },
  {
    timestamps: true,
  }
);

exports.Stack = mongoose.model("Stack", stackSchema);
