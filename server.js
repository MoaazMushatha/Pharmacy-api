const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
// const auth = require("./routes");
const myRoutes = require("./routes/authRoutes");
const pharmacyR = require("./routes/pharmacyRoutes");
const medR = require("./routes/medicineRoutes");
// const medAlt = require("./routes/medicineRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // Middleware to parse JSON

//  كل راوتر له prefix خاص فيه.
app.use("/api/auth", myRoutes); // or بنفع auth

app.use("/api/pharmacies", pharmacyR);
app.use("/api/medicines", medR);

// app.use("/api/medicines", medAlt);

// Test route
app.get("/", (req, res) => {
  res.send("API is working الامور تمام");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
