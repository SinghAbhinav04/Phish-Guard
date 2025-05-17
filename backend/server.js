const express = require("express")
const cors = require("cors")
require('dotenv').config();
const connectMongoDB = require("./config/db.js")

const scanRouter = require("./routers/scan.js")
const historyRouter = require("./routers/history.js")
const feedbackRouter = require("./routers/feedback.js")


const app = express()

const port = process.env.PORT||5000


app.use(cors({
  origin: [
    'http://localhost:5173', 
    'chrome-extension://cbclpmjjnncnmhiiipfejhkipcdhoddm'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

  app.use(express.json())
app.use(express.urlencoded({extended:false}))

connectMongoDB()
.then(()=>{console.log("MongoDb connected")})
.catch((err)=>{console.log(err)})

app.get("/api",(req,res)=>{
  res.send("hey")
})
app.use("/api/scan",scanRouter)
app.use("/api/history",historyRouter)
app.use("/api/feedback",feedbackRouter)

app.listen(port,()=>{console.log(`Server started on ${port}`)})

