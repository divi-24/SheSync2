# from fastapi import FastAPI
# from pydantic import BaseModel
# import joblib
# import numpy as np
# import pandas as pd

# # Initialize app
# app = FastAPI(
#     title="PCOS Prediction API",
#     description="Predicts PCOS using a trained XGBoost model",
#     version="1.0"
# )

# # Load model and scaler
# model = joblib.load("pcos_xgb_model.pkl")
# scaler = joblib.load("scaler.pkl")

# # Use *exact* column names from your X
# FEATURE_COLUMNS = [
#     'Age (yrs)', 'Weight (Kg)', 'Height(Cm)', 'BMI', 'Blood Group',
#     'Pulse rate(bpm)', 'RR (breaths/min)', 'Hb(g/dl)', 'Cycle(R/I)',
#     'Cycle length(days)', 'Marraige Status (Yrs)', 'Pregnant(Y/N)',
#     'No. of aborptions', 'I   beta-HCG(mIU/mL)', 'II    beta-HCG(mIU/mL)',
#     'FSH(mIU/mL)', 'LH(mIU/mL)', 'FSH/LH', 'Hip(inch)', 'Waist(inch)',
#     'Waist:Hip Ratio', 'TSH (mIU/L)', 'AMH(ng/mL)', 'PRL(ng/mL)',
#     'Vit D3 (ng/mL)', 'PRG(ng/mL)', 'RBS(mg/dl)', 'Weight gain(Y/N)',
#     'hair growth(Y/N)', 'Skin darkening (Y/N)', 'Hair loss(Y/N)',
#     'Pimples(Y/N)', 'Fast food (Y/N)', 'Reg.Exercise(Y/N)',
#     'BP _Systolic (mmHg)', 'BP _Diastolic (mmHg)', 'Follicle No. (L)',
#     'Follicle No. (R)', 'Avg. F size (L) (mm)', 'Avg. F size (R) (mm)',
#     'Endometrium (mm)'
# ]

# # Dynamically create input schema
# class PCOSInput(BaseModel):
#     __annotations__ = {col: float for col in FEATURE_COLUMNS}

# @app.post("/predict")
# def predict_pcos(input_data: PCOSInput):
#     # Convert input to a dataframe with the same columns as training data
#     input_dict = input_data.dict()
#     X_input = pd.DataFrame([input_dict])[FEATURE_COLUMNS]

#     # Apply scaling using the fitted scaler
#     X_scaled = scaler.transform(X_input)

#     # Predict
#     pred = model.predict(X_scaled)[0]
#     prob = model.predict_proba(X_scaled)[0][1]

#     return {
#         "PCOS_Predicted": int(pred),
#         "Probability_of_PCOS": float(prob)
#     }



from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from io import BytesIO
from PIL import Image
import torch
import torch.nn as nn
from torchvision import models, transforms

# ======================================================
# 1️⃣ Initialize app
# ======================================================
app = FastAPI(
    title="PCOS Prediction API",
    description="Predicts PCOS from clinical data and ultrasound images",
    version="2.0"
)

# ======================================================
# 2️⃣ Load XGBoost model and scaler (Tabular)
# ======================================================
model_tabular = joblib.load("pcos_xgb_model.pkl")
scaler = joblib.load("scaler.pkl")

FEATURE_COLUMNS = [
    'Age (yrs)', 'Weight (Kg)', 'Height(Cm)', 'BMI', 'Blood Group',
    'Pulse rate(bpm)', 'RR (breaths/min)', 'Hb(g/dl)', 'Cycle(R/I)',
    'Cycle length(days)', 'Marraige Status (Yrs)', 'Pregnant(Y/N)',
    'No. of aborptions', 'I   beta-HCG(mIU/mL)', 'II    beta-HCG(mIU/mL)',
    'FSH(mIU/mL)', 'LH(mIU/mL)', 'FSH/LH', 'Hip(inch)', 'Waist(inch)',
    'Waist:Hip Ratio', 'TSH (mIU/L)', 'AMH(ng/mL)', 'PRL(ng/mL)',
    'Vit D3 (ng/mL)', 'PRG(ng/mL)', 'RBS(mg/dl)', 'Weight gain(Y/N)',
    'hair growth(Y/N)', 'Skin darkening (Y/N)', 'Hair loss(Y/N)',
    'Pimples(Y/N)', 'Fast food (Y/N)', 'Reg.Exercise(Y/N)',
    'BP _Systolic (mmHg)', 'BP _Diastolic (mmHg)', 'Follicle No. (L)',
    'Follicle No. (R)', 'Avg. F size (L) (mm)', 'Avg. F size (R) (mm)',
    'Endometrium (mm)'
]

class PCOSInput(BaseModel):
    __annotations__ = {col: float for col in FEATURE_COLUMNS}


@app.post("/predict")
def predict_pcos(input_data: PCOSInput):
    input_dict = input_data.dict()
    X_input = pd.DataFrame([input_dict])[FEATURE_COLUMNS]

    X_scaled = scaler.transform(X_input)
    pred = model_tabular.predict(X_scaled)[0]
    prob = model_tabular.predict_proba(X_scaled)[0][1]

    return {
        "PCOS_Predicted": int(pred),
        "Probability_of_PCOS": float(prob)
    }

# ======================================================
# 3️⃣ Load ResNet50 Image Model
# ======================================================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define the same model architecture used during training
# Try to load pretrained weights, but fall back if SSL/certificate issues occur
try:
    model_cnn = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2)
except Exception as e:
    print(f"Warning: Could not load pretrained weights ({e}). Using untrained model.")
    model_cnn = models.resnet50(weights=None)
    
num_ftrs = model_cnn.fc.in_features
model_cnn.fc = nn.Sequential(
    nn.Linear(num_ftrs, 128),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(128, 2)
)

# Load trained weights
model_cnn.load_state_dict(torch.load("best_resnet50_pcos.pth", map_location=device))
model_cnn.to(device)
model_cnn.eval()

# Define image transform (same as validation transform)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# ======================================================
# 4️⃣ Image Prediction Endpoint
# ======================================================
@app.post("/predict_image")
async def predict_pcos_from_image(file: UploadFile = File(...)):
    # Read image bytes
    contents = await file.read()
    image = Image.open(BytesIO(contents)).convert("RGB")

    # Preprocess
    img_tensor = transform(image).unsqueeze(0).to(device)

    # Predict
    with torch.no_grad():
        outputs = model_cnn(img_tensor)
        probs = torch.softmax(outputs, dim=1)
        pred_class = torch.argmax(probs, dim=1).item()
        prob_visible = probs[0][1].item()  # probability of class "Visible"

    label_map = {0: "Not Visible", 1: "Visible"}
    result = {
        "Predicted_Label": label_map[pred_class],
        "Probability_Visible": float(prob_visible),
        "Probability_Not_Visible": float(probs[0][0].item())
    }

    return result
