import pandas as pd
from script import train_model

count = 0

def retrain(features_df, prediction):
    global count
    count += 1

    # Add "Type" column and move it to the front
    features_df["Type"] = prediction
    columns = ["Type"] + [col for col in features_df.columns if col != "Type"]
    features_df = features_df[columns]

    # Load the existing dataset
    df = pd.read_csv("/Users/abhinavsingh/Desktop/Ip/flask-backend/ML/dataset/Dataset.csv")

    # Ensure column order matches existing dataset
    features_df = features_df[df.columns]

    # Append and save
    updated_df = pd.concat([df, features_df], ignore_index=True)
    updated_df.to_csv("/Users/abhinavsingh/Desktop/Ip/flask-backend/ML/dataset/Dataset.csv", index=False)

    # Retrain every 10 samples
    if count % 10 == 0:
        train_model()
