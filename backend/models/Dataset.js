const mongoose = require("mongoose");

const DatasetSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  features: { type: [Number], required: true }, 
  prediction: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Dataset", DatasetSchema);
