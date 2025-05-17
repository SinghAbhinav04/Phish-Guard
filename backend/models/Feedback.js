const mongoose = require("mongoose")

const FeedbackSchema = new mongoose.Schema({
    url: { type: String, required: true },
    userFeedback: { type: String, required: false },
    type:{type:String , enum: ['phishing', 'safe'] , required:true},
    verified: { type: Boolean, default: false }, 
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("Feedback", FeedbackSchema);
  