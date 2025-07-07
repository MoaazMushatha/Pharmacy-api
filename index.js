const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
// const auth = require("./routes");
const myRoutes = require("./routes/authRoutes");
const pharmacyR = require("./routes/pharmacyRoutes");
const medR = require("./routes/medicineRoutes");
const errorHandler = require("./middlewares/errorHandler");
// const medAlt = require("./routes/medicineRoutes");
const returnJson = require('./my_modules/json_response/returnJson')
const routes = require('./routes')

global.returnJson = returnJson

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // Middleware to parse JSON

//  كل راوتر له prefix خاص فيه.
// app.use("/auth", myRoutes); // or بنفع auth
// app.use("/pharmacies", pharmacyR);
// app.use("/medicines", medR);

// app.use("/medicines", medAlt);

routes(app)

// Test route
app.get("/", (req, res) => {
  res.send("API is working الامور تمام");
});

// Global Error Handler
app.use((error, req, res, next) => {
  return returnJson(res, error.statucCode, false, error.message, null)
})
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});