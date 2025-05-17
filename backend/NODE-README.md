# Node.js Backend for Phishing Detection

This Node.js application serves as the API backend for the Phishing Detection web extension, handling data management, caching, feedback collection, and communication with the Flask ML service.

##  Architecture

The Node.js backend follows a modular architecture with:

- **Express.js**: Web server framework
- **Mongoose**: MongoDB ODM for data management
- **Axios**: HTTP client for communicating with the Flask backend
- **RESTful API Structure**: Organized routes and controllers

##  Data Models

### Dataset Model

Stores URL scans and predictions:

```javascript
const DatasetSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  features: { type: [Number], required: true },
  prediction: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
```

### Feedback Model

Collects user feedback for verification and model improvement:

```javascript
const FeedbackSchema = new mongoose.Schema({
  url: { type: String, required: true },
  userFeedback: { type: String, required: false },
  type: { type: String, enum: ['phishing', 'safe'], required: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
```

##  API Routes

The API is organized into three main routers:

```javascript
app.use("/api/scan", scanRouter)
app.use("/api/history", historyRouter)
app.use("/api/feedback", feedbackRouter)
```

### 1. Scan Router

Handles URL scanning and caching:

- **POST /api/scan**
  - Accepts a URL for scanning
  - Checks if URL exists in database cache
  - If not cached, communicates with Flask backend
  - Stores results for future reference

```javascript
async function handleScanPost(req, res) {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const existing = await Dataset.findOne({ url });

    if (existing) {
      return res.json({ result: existing.prediction, fromCache: true });
    }

    const flaskResponse = await axios.post("http://localhost:5001/predict", { url });
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
```

### 2. History Router

Provides access to scan history:

- **GET /api/history**
  - Returns the 10 most recent scans
  - Sorted by creation date (newest first)

```javascript
async function getHistory(req, res) {
  try {
    const data = await Dataset.find().sort({ createdAt: -1 }).limit(10);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch history' });
  }
}
```

### 3. Feedback Router

Manages user feedback and model updating:

- **POST /api/feedback**
  - Collects user feedback on scanning results
  - Verifies feedback using an external service (Gemini)
  - Updates dataset and triggers model retraining when needed

```javascript
async function handlePostFeedback(req, res) {
  try {
    const { url, userFeedback, type } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" })
    }

    const feedback = new Feedback({ url, userFeedback, type })
    await feedback.save()

    const flaskResponse = await axios.post("http://localhost:5001/predict", { url });
    const { features, prediction } = flaskResponse.data;
    const featuresArray = Object.values(features);

    const geminiResponse = await verifyUrl(url, prediction);
    console.log(geminiResponse)

    const existingDataset = await Dataset.findOne({ url: url })
    if (existingDataset) {
      await Dataset.updateOne({ url: url }, { $set: { features: featuresArray, prediction: geminiResponse } })
    } else {
      const dataset = new Dataset({ url, features: featuresArray, prediction: geminiResponse })
      await dataset.save()
    }

    if (geminiResponse != prediction) {
      const updatedResponse = await axios.post("http://localhost:5001/update-dataset", { url, geminiResponse });
      console.log(updatedResponse)
    }

    return res.json({ prediction: prediction })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Server side error" })
  }
}
```

##  Integration with ML Backend

The Node.js backend communicates with the Flask ML backend through HTTP requests:

1. **URL Scanning**: Sends URLs to Flask for feature extraction and prediction
2. **Dataset Updates**: Forwards verified feedback to update the ML dataset
3. **Model Retraining**: Indirectly triggers model retraining via feedback verification

##  Verification Service

The backend uses an AI service (Gemini) to verify user feedback:

```javascript 
const verifyUrl = require("../services/geminiResponse.js")
```

This service helps:
- Validate user-submitted feedback
- Resolve contradictions between model predictions and user reports
- Improve dataset quality for model retraining

##  Setup and Installation

1. Clone the repository
2. Navigate to the node-backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   ```bash
   cp .env.example .env
   # EDIT .env with your MongoDB connection String and Gemini API_KEY
   ```
5. Start the server:
   ```bash
   node server.js
   ```

The server will start on http://localhost:5000

##  Dependencies

- **express**: Web server framework
- **mongoose**: MongoDB object modeling
- **axios**: HTTP client for API requests
- **cors**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable management

##  Data Flow

1. **URL Scanning**:
   - Frontend submits URL to Node.js API
   - API checks database cache
   - If not cached, forwards to Flask for prediction
   - Stores result and returns to frontend

2. **User Feedback**:
   - Frontend submits user feedback
   - API stores feedback and requests verification
   - Updates dataset with verified information
   - Triggers model retraining when necessary

3. **History Access**:
   - Frontend requests scan history
   - API fetches recent scans from database
   - Returns formatted data to frontend

##  Security Considerations

- Input validation for all API endpoints
- Verification of user feedback to prevent data poisoning
- Rate limiting for API endpoints (to be implemented)
- Data validation before storage
