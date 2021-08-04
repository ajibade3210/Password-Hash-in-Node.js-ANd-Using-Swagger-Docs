const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const app = express();
const userRoute = require("./user.routes");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Password Hashing",
      version: "1.0.0",
      description: "Password hashing using crypto",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  // ["routes/*.js"]
  apis: ["./user.routes.js"],
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const PORT = process.env.PORT || 5000;

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// moongoose.Promise = global.Promise;
//connect to database
mongoose
  .connect("mongodb://localhost:27017/hasher", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(() => {
    "Could Not Connect To MongoDB....", process.exit();
  });

// require('./user.routes')()
app.use("/", userRoute);

app.listen(PORT, () => console.log("APP is Running On Port:", PORT));
