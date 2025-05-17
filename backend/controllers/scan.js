const Dataset = require("../models/Dataset");
const axios = require("axios");

async function handleScanPost(req, res) {
  console.log("Req")
  const { url } = req.body;
  console.log(url)
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const existing = await Dataset.findOne({ url });

    if (existing) {
      return res.json({ result: existing.prediction, fromCache: true });
    }

    const flaskResponse = await axios.post("http://localhost:5001/predict", { url });
    console.log(flaskResponse.data)
    const { features, prediction } = flaskResponse.data;

    const featuresArray = Object.values(features);

    const newScan = new Dataset({ url, features: featuresArray, prediction });
    await newScan.save();

    res.json({ result: prediction, fromCache: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scan failed" });
  }
}

module.exports = { handleScanPost };
