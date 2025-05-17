from flask import Flask, request, jsonify
import joblib
from utils.feature_extractor import extract_features
from utils.retrain import retrain

app = Flask(__name__)
model = joblib.load("model/phishing_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    feature_df = extract_features(url)
    prediction = model.predict(feature_df.values)[0]
    print(prediction)
    
    prediction_string = "phising" if prediction == 1 else "safe"

    if prediction ==1:
        retrain(feature_df, prediction)
    feature_dict = feature_df.to_dict(orient='records')[0]

    return jsonify({
        "features": feature_dict,
        "prediction": prediction_string  
    })

@app.route("/update-dataset", methods=["POST"])
def update_dataset():
    data = request.get_json()
    url = data.get("url")
    prediction = data.get("geminiResponse")
    if not url or prediction is None:
        return jsonify({"error": "URL and prediction are required"}), 400
    feature_df = extract_features(url)
    retrain(feature_df, prediction)
    return jsonify({"message": "Dataset updated successfully"}), 200



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
