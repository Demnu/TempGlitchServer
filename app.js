const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const orders = require("./routes/orders");
const recipes = require("./routes/recipes");
const products = require("./routes/products");
const roasting = require("./routes/roasting");
const user = require("./routes/user");
const { spawn } = require("child_process");
const path = require("path");
const auth = require("./middleware/auth");
var cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

require("dotenv").config();
const counter = require("./counter");
const port = 3000;
app.use(function (req, res, next) {
  res.header("Access-Control-Expose-Headers", "X-Total-Count, Content-Range");
  res.header("Access-Control-Allow-Origin", "http://localhost:3001"),
    res.header("Access-Control-Allow-Credentials", "true"),
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH"
    ),
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-custom-header"
    );
  next();
});
app.options("/*", (_, res) => {
  res.sendStatus(200);
});

app.use("/api/v1/orders", orders);
app.use("/api/v1/recipes", recipes);
app.use("/api/v1/products", products);
app.use("/api/v1/roasting", roasting);
app.use("/api/v1/user", user);

app.use(express.static(path.join(__dirname, "build")));

app.get("/api/v1/refresh", function (req, res) {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).send("You are not authenticated!");
  }
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const start = async () => {
  try {
    console.log("logging into db");
    await connectDB(process.env.MONGO_URI);
    // counter.output();
    console.log("logged in");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};


start();
