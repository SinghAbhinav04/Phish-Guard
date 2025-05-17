const Dataset = require("../models/Dataset.js")

async function getHistory(req , res){
        try {
          const data = await Dataset.find().sort({ createdAt: -1 }).limit(10);
          res.json(data);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Could not fetch history' });
        }
}

module.exports = { getHistory }