const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    nonce: {
      // default: Math.floor(Math.random() * 1000000),
      // required: [true, "Nonce required...!"],
    },
    level: {
      default: 1,
      type: Number,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

exports.User = mongoose.model("User", userSchema);
