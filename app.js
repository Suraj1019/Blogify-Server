require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const errorHandler = require("./utilities/errorHandler");
const authMiddleware = require("./utilities/auth");
const upload = require("./utilities/multer");
const app = express();

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);
app.use(express.json());
app.use(`/auth`, authRouter);
app.use(`/posts`, postRouter);
app.post(`/upload`, authMiddleware, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send({
    url: req.file.path,
  });
});

app.get("/", (req, res) => {
  res.send("Welome to blogify");
});

app.all("*", (req, res) => {
  let err = new Error("Page not found");
  err.status = 404;
  throw err;
});
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`app is listening at port ${process.env.PORT}`);
});
