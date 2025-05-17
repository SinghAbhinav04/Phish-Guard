const Feedback = require("../models/Feedback.js")
const Dataset = require("../models/Dataset.js")
const verifyUrl = require("../services/geminiResponse.js")
const axios = require("axios")

async function handlePostFeedback(req, res){
    try{
        const {url, userFeedback , type} = req.body;
        if(!url){
            return res.status(400).json({error:"URL is required"})
        }

        const feedback = new Feedback({url , userFeedback , type})
        await feedback.save()

        const flaskResponse = await axios.post("http://localhost:5001/predict", { url });
        const { features, prediction } = flaskResponse.data;
        const featuresArray = Object.values(features);

        const geminiResponse = await verifyUrl(url,prediction);
        console.log(geminiResponse)

        const existingDataset = await Dataset.findOne({url:url})
        if(existingDataset){
            await Dataset.updateOne({url:url}, {$set:{features:featuresArray, prediction:geminiResponse}})
        }else{
            const dataset = new Dataset({url ,features:featuresArray, prediction:geminiResponse})
            await dataset.save()
        }

        if(geminiResponse != prediction){
            const updatedResponse = await axios.post("http://localhost:5001/update-dataset", { url, geminiResponse });
            console.log(updatedResponse)
        }


        return res.json({prediction:prediction})

    }catch(err){
        console.log(err)
        return res.status(500).json({error:"Server side error"})
    }
}

async function handleDeepScan(req , res){
    try{
        const {url, type} = req.body(url,type)

        if(!url || !type){
            return res.status(400).json({message:"URL/type is Required"})
        }

        const prediction = await axios.post("http://localhost:5001/deepscan", {url , type})
        

    }catch(err){
        console.log(err)
        return res.status(500).json({error:"Server side error"})
    }
}

module.exports = {handlePostFeedback}