require("dotenv").config();
require("express-async-errors");

//security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

// routers
const authRouter = require("./routes/auth");
const teamRouter = require("./routes/team");
const playerRouter = require("./routes/player");
const matchesRouter = require("./routes/match");
const playGroundsRouter = require("./routes/playGround");
const usersRouter = require("./routes/user");
const productRouter = require("./routes/products");
const tweetsRouter = require("./routes/tweets");
const likesRouter = require("./routes/likes");
const commentsRouter = require("./routes/comments");
const ordersRouter = require("./routes/orders");
const vediosRouter = require("./routes/vedios");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1); // fot the deployment to trust the hosting server
app.use(
  rateLimiter({
    WindowMs: 15 * 60 * 1000, // 15 min
    max: 100, // linit each ip to 100 requistes per windowMs
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  res.send("<h1>PS_Sport API</h1>");
});

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/players", playerRouter);
app.use("/api/v1/matches", matchesRouter);
app.use("/api/v1/playGrounds", playGroundsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/likes", likesRouter);
app.use("/api/v1/tweets", tweetsRouter);
app.use("/api/v1/orders", authenticateUser, ordersRouter);
app.use("/api/v1/vedios", vediosRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
