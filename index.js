const express = require("express");
require("dotenv").config();
const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const Url = require("./models/url");

const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error(error);
  });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl", async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || !/^https?:\/\/.+/.test(originalUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const shortUrl = nanoid(6);
  const url = new Url({ shortUrl, originalUrl });

  await url.save();

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const { short_url } = req.params;
  const url = await Url.findOne(short_url);

  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send("Short URL not found");
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
