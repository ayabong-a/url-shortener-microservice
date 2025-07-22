const express = require("express");
require("dotenv").config();
const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const Url = require("./models/url");
const dns = require("dns");
const { URL } = require("url");

const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error(error));

const invalidUrlMessage = "invalid url";

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl", async (req, res) => {
  const { original_url } = req.body;
  let hostname;

  try {
    const parsedUrl = new URL(original_url);
    hostname = parsedUrl.hostname;
  } catch (err) {
    return res.json({ error: invalidUrlMessage });
  }

  dns.lookup(hostname, async (err) => {
    if (err) return res.json({ error: invalidUrlMessage });

    let existing = await Url.findOne({ original_url });
    if (existing) {
      return res.json({
        original_url: existing.original_url,
        short_url: existing.short_url,
      });
    }

    const short_url = nanoid(6).toLowerCase();
    const newUrl = new Url({ original_url, short_url });

    await newUrl.save();
    res.json({ original_url, short_url });
  });
});

app.get("/api/shorturl", async (req, res) => {
  const { short_url, error } = req.query;

  if (error) {
    return res.json({ error });
  }

  const url = await Url.findOne({ short_url });
  if (!url) return res.status(404).json({ error: invalidUrlMessage });

  res.json({
    original_url: url.original_url,
    short_url: url.short_url,
  });
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const { short_url } = req.params;

  const foundUrl = await Url.findOne({ short_url });
  if (foundUrl) {
    return res.redirect(foundUrl.original_url);
  } else {
    return res.json({ error: invalidUrlMessage });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${listener.address().port}`);
});