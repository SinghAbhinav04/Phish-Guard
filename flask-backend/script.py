import pandas as pd 
from sklearn.ensemble import RandomForestClassifier
import joblib



def train_model():
    data = pd.read_csv("./ML/dataset/Dataset.csv")
    print(data.tail())
    y= data["Type"]
    X = data.drop(columns=["Type"])

    rfc = RandomForestClassifier(random_state=42)
    rfc.fit(X,y)

    joblib.dump(rfc,"./model/phishing_model.pkl")

