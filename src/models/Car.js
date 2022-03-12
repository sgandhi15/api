const mongoose = require("mongoose");

const carSchema = mongoose.Schema(
  {
    carBoostSlots: {
      type: Number,
      min: 0,
      default: 0,
    },
    carBoostSlotsFree: {
      type: Number,
      min: 0,
      default: 0,
    },
    carDrift: {
      type: Number,
      min: 1,
      required: [true, "Please provide valid car drift level...!"],
    },
    carDriftup: {
      type: Number,
      min: 0,
      default: 0,
    },
    carExp: {
      type: Number,
      min: 1,
      required: [true, "Please provide valid car exp...!"],
    },
    carFuel: {
      type: Number,
      min: 0,
      max: 130,
    },
    carID: {
      type: Number,
    },
    carImage: {
      type: String,
      required: true,
    },
    carLevel: {
      type: Number,
      default: 0,
    },
    carMaxFuel: {
      type: Number,
      min: 60,
      max: 130,
    },
    carName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      required: [true, "Please provide valid name for car name...!"],
    },
    carPower: {
      type: Number,
      min: 1,
      required: [true, "Please provide valid car power...!"],
    },
    carPowerup: {
      type: Number,
      min: 0,
      default: 0,
    },
    //baki
    carOwner: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "User",
    },
    carSpeed: {
      type: Number,
      min: 1,
      required: [true, "Please provide valid car speed...!"],
    },
    carSpeedup: {
      type: Number,
      min: 0,
      default: 0,
    },
    isFusion: {
      type: Boolean,
      default: false,
    },
    isRegister: {
      type: Boolean,
      default: false,
    },
    rarity: {
      required: true,
      type: String,
      enum: {
        values: ["Common", "Classic", "Super Car", "Rare", "Legendary"],
        message: "{VALUE} is not supported",
      },
    },
    registrationNo: {
      type: String,
      default: "?",
    },
    sellPrice: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

carSchema.pre("save", async function (next) {
  if (this.isFusion === false)
    if (this.createdAt === this.updatedAt) {
      if (this.rarity === "Common") {
        this.carMaxFuel = 60;
        this.carFuel = 60;
        this.sellPrice = 60;
      } else if (this.rarity === "Classic") {
        this.carMaxFuel = 75;
        this.carFuel = 75;
        this.sellPrice = 75;
      } else if (this.rarity === "Super Car") {
        this.carMaxFuel = 100;
        this.carFuel = 100;
        this.sellPrice = 100;
      } else if (this.rarity === "Rare") {
        this.carMaxFuel = 115;
        this.carFuel = 115;
        this.sellPrice = 115;
      } else if (this.rarity === "Legendary") {
        this.carMaxFuel = 130;
        this.carFuel = 130;
        this.sellPricace = 130;
      }
    }

  //carImage base 64
  next();
});

exports.Car = mongoose.model("Car", carSchema);
