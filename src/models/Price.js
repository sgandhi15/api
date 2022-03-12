const { default: mongoose } = require("mongoose");

const priceSchema = mongoose.Schema(
  {
    carUnboxPrice: {
      type: Number,
      min: 0,
      default: 1,
    },
    carRegistrationPrice: {
      type: Number,
      min: 0,
      default: 1,
    },
    carNameChangePrice: {
      type: Number,
      min: 0,
      default: 1,
    },
    carSlotPrice: {
      type: Number,
      min: 0,
      default: 1,
    },
    carBoosterPrice: {
      type: Number,
      min: 0,
      default: 1,
    },
    carRefuelPrice: {
      type: Number,
      min: 0,
      default: 1,
    },
    carFusionPrice: {
      type: Number,
      min: 0,
      default: 1,
    },
    carQuickRacePrice: {
      type: Number,
      min: 0,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

exports.Price = mongoose.model("Price", priceSchema);
