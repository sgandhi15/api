const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { cronJob } = require("./configs/cron");
const { connectDB } = require("./configs/db");
const path = require("path");

const carRoutes = require("./routes/carRoutes");
const raceRoutes = require("./routes/raceRoutes");
const priceRoutes = require("./routes/priceRouter");

if (process.env.NODE_ENV === "dev") require("dotenv").config();

const app = express();

connectDB();
// Checking more
// cronJob();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.get("/", (req, res) => res.status(200).send("Hello there...!"));
app.use("/car", carRoutes);
app.use("/race", raceRoutes);
app.use("/price", priceRoutes);

app.listen(3001, () =>
  console.log(`Server started on PORT ${process.env.PORT}`)
);
