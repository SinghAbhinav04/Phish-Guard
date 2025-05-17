const express = require("express")
const scanRouter = express.Router()
const {handleScanPost} = require("../controllers/scan.js")

scanRouter.post("/",handleScanPost)

module.exports = scanRouter