const express = require("express")
const feedbackRouter = express.Router()
const {handlePostFeedback} = require("../controllers/feedback.js")

feedbackRouter.post("/",handlePostFeedback)

module.exports = feedbackRouter