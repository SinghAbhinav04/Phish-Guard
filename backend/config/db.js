const mongoose = require("mongoose")
const MongoURI = process.env.MongoURI

console.log(MongoURI)
function connectMongoDB(){
    return mongoose.connect(MongoURI)
}

module.exports = connectMongoDB