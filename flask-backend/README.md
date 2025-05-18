# Flask Backend for Phishing Detection

This Flask application serves as the machine learning backend for the Phishing Detection web extension. It handles feature extraction, prediction, and automatic model retraining.

##  Machine Learning Model

The system uses a **Random Forest Classifier** as the primary model for phishing detection with the following characteristics:

- **Accuracy**: 96.7% on the test dataset
- **Hyperparameters**:
  - n_estimators: 100
  - max_depth: 5
  - min_samples_split: 7
  - min_samples_leaf: 7

We've also experimented with a neural network approach:
```python
class Net(nn.Module):
    def __init__(self, input_dim):
        super(Net, self).__init__()
        self.model = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )
    
    def forward(self, x):
        return self.model(x)
```

This neural network achieved an accuracy of approximately 90%, which was lower than our Random Forest implementation.

##  Dataset

The system uses the **Frontiers URL-Based Dataset** for phishing detection. This dataset contains:

- A collection of legitimate and phishing URLs
- Feature vectors extracted from each URL
- Binary classification labels (safe or phishing)

The dataset is continually expanded through:
1. User feedback verification
2. New URL scans
3. Automatic model retraining

##  Automatic Model Retraining

One of the core features of this system is its ability to continuously improve through automatic retraining:

1. New URLs are scanned and added to the dataset
2. User feedback is collected and verified
3. Every 10 new samples, the model is automatically retrained
4. Updated models are saved and immediately deployed

```python
def retrain(features_df, prediction):
    global count
    count += 1

    # Add "Type" column and move it to the front
    features_df["Type"] = prediction
    columns = ["Type"] + [col for col in features_df.columns if col != "Type"]
    features_df = features_df[columns]

    # Load the existing dataset
    df = pd.read_csv("./ML/dataset/Dataset.csv")

    # Ensure column order matches existing dataset
    features_df = features_df[df.columns]

    # Append and save
    updated_df = pd.concat([df, features_df], ignore_index=True)
    updated_df.to_csv("./ML/dataset/Dataset.csv", index=False)

    # Retrain every 10 samples
    if count % 10 == 0:
        train_model()
```

##  API Endpoints

### POST /predict
Analyzes a URL and predicts whether it's phishing or safe.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "features": {
    "feature1": 0.23,
    "feature2": 1.0,
    "...": "..."
  },
  "prediction": "safe"
}
```

### POST /update-dataset
Updates the dataset with a verified prediction for a URL.

**Request:**
```json
{
  "url": "https://example.com",
  "geminiResponse": "phishing"
}
```

**Response:**
```json
{
  "message": "Dataset updated successfully"
}
```

##  Feature Extraction

The system extracts various features from URLs including:
- Domain-based features
- URL string characteristics
- HTML and JavaScript content analysis
- SSL certificate information
- Host-based features

The `extract_features` function in `utils/feature_extractor.py` handles this process.

##  Setup and Installation

1. Clone the repository
2. Navigate to the flask-backend directory:
   ```bash
   cd flask-backend
   ```
3. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the Flask server:
   ```bash
   python app.py
   ```

The server will start on http://localhost:5001

##  Dependencies

- Flask
- pandas
- scikit-learn
- joblib
- numpy
- requests
- beautifulsoup4

##  Model Performance Improvement

The model's performance has improved over time:
- Initial accuracy: ~90% (Neural Network)
- Current accuracy: 96% (Random Forest)

We're continuously improving the model through:
- Building better neural networks
- Feature engineering
- Hyperparameter tuning
- Dataset expansion
- User feedback incorporation
