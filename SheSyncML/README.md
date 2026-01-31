# PCOS Prediction System

A comprehensive machine learning system for predicting Polycystic Ovary Syndrome (PCOS) using both clinical data and ultrasound images. This project implements two models:

1. **XGBoost Classifier** - For tabular clinical data prediction
2. **ResNet50 CNN** - For ultrasound image classification

## 🎯 Features

- **Dual Prediction Modes**: 
  - Clinical data-based prediction using XGBoost
  - Ultrasound image-based prediction using ResNet50
- **RESTful API**: FastAPI-based endpoints for easy integration
- **High Accuracy**: 
  - XGBoost model achieves ~91% accuracy
  - ResNet50 model achieves ~87% accuracy with 0.931 AUC score
- **Production Ready**: Includes model serialization and API endpoints

## 📋 Prerequisites

- Python 3.8 or higher
- pip package manager

## 🚀 Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd sheml
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure model files are present**:
   - `pcos_xgb_model.pkl` - Trained XGBoost model
   - `scaler.pkl` - Feature scaler for tabular data
   - `best_resnet50_pcos.pth` - Trained ResNet50 model weights

## 🏃 Running the Application

### Start the FastAPI server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Or with auto-reload for development:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- **API Base URL**: `http://localhost:8000`
- **Interactive API Docs**: `http://localhost:8000/docs`
- **Alternative Docs**: `http://localhost:8000/redoc`

## 📡 API Endpoints

### 1. Predict PCOS from Clinical Data

**Endpoint**: `POST /predict`

**Description**: Predicts PCOS based on clinical features using the XGBoost model.

**Request Body** (JSON):
```json
{
  "Age (yrs)": 25.0,
  "Weight (Kg)": 65.0,
  "Height(Cm)": 165.0,
  "BMI": 23.9,
  "Blood Group": 1.0,
  "Pulse rate(bpm)": 72.0,
  "RR (breaths/min)": 18.0,
  "Hb(g/dl)": 12.5,
  "Cycle(R/I)": 1.0,
  "Cycle length(days)": 28.0,
  "Marraige Status (Yrs)": 2.0,
  "Pregnant(Y/N)": 0.0,
  "No. of aborptions": 0.0,
  "I   beta-HCG(mIU/mL)": 5.0,
  "II    beta-HCG(mIU/mL)": 5.0,
  "FSH(mIU/mL)": 6.5,
  "LH(mIU/mL)": 8.0,
  "FSH/LH": 0.81,
  "Hip(inch)": 36.0,
  "Waist(inch)": 32.0,
  "Waist:Hip Ratio": 0.89,
  "TSH (mIU/L)": 2.5,
  "AMH(ng/mL)": 4.5,
  "PRL(ng/mL)": 15.0,
  "Vit D3 (ng/mL)": 30.0,
  "PRG(ng/mL)": 0.5,
  "RBS(mg/dl)": 90.0,
  "Weight gain(Y/N)": 0.0,
  "hair growth(Y/N)": 0.0,
  "Skin darkening (Y/N)": 0.0,
  "Hair loss(Y/N)": 0.0,
  "Pimples(Y/N)": 0.0,
  "Fast food (Y/N)": 0.0,
  "Reg.Exercise(Y/N)": 1.0,
  "BP _Systolic (mmHg)": 120.0,
  "BP _Diastolic (mmHg)": 80.0,
  "Follicle No. (L)": 8.0,
  "Follicle No. (R)": 8.0,
  "Avg. F size (L) (mm)": 5.0,
  "Avg. F size (R) (mm)": 5.0,
  "Endometrium (mm)": 8.0
}
```

**Response**:
```json
{
  "PCOS_Predicted": 0,
  "Probability_of_PCOS": 0.15
}
```

**Example using cURL**:
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "Age (yrs)": 25.0,
    "Weight (Kg)": 65.0,
    "Height(Cm)": 165.0,
    "BMI": 23.9,
    ...
  }'
```

### 2. Predict PCOS from Ultrasound Image

**Endpoint**: `POST /predict_image`

**Description**: Predicts whether polycystic ovary is visible in an ultrasound image using ResNet50.

**Request**: Multipart form data with image file

**Response**:
```json
{
  "Predicted_Label": "Visible",
  "Probability_Visible": 0.92,
  "Probability_Not_Visible": 0.08
}
```

**Example using cURL**:
```bash
curl -X POST "http://localhost:8000/predict_image" \
  -F "file=@path/to/ultrasound_image.jpg"
```

**Example using Python**:
```python
import requests

url = "http://localhost:8000/predict_image"
with open("ultrasound_image.jpg", "rb") as f:
    files = {"file": f}
    response = requests.post(url, files=files)
    print(response.json())
```

## 📊 Model Details

### XGBoost Model (Tabular Data)
- **Algorithm**: XGBoost Classifier
- **Features**: 37 clinical features
- **Accuracy**: ~91%
- **Cross-validation**: 5-fold stratified CV
- **Preprocessing**: StandardScaler normalization

### ResNet50 Model (Image Classification)
- **Architecture**: ResNet50 (pretrained on ImageNet)
- **Task**: Binary classification (Visible/Not Visible)
- **Accuracy**: ~87%
- **AUC Score**: 0.931
- **Input Size**: 224x224 RGB images
- **Fine-tuning**: Transfer learning with frozen feature extractor

## 📁 Project Structure

```
sheml/
├── main.py                          # FastAPI application
├── requirements.txt                 # Python dependencies
├── pcos_xgb_model.pkl              # Trained XGBoost model
├── scaler.pkl                      # Feature scaler
├── best_resnet50_pcos.pth         # Trained ResNet50 weights
├── PCOS_Classification.ipynb       # XGBoost training notebook
├── PCOS_detection.ipynb            # ResNet50 training notebook
├── PCOS_data_without_infertility.xlsx  # Training data
├── PCOS_infertility.csv            # Additional training data
└── README.md                        # This file
```

## 🔬 Training the Models

The models were trained using Jupyter notebooks:

1. **PCOS_Classification.ipynb**: Trains the XGBoost model on clinical data
2. **PCOS_detection.ipynb**: Trains the ResNet50 model on ultrasound images

To retrain the models, run the respective notebooks with the training data.

## 🛠️ Development

### Testing the API

You can test the API using the interactive Swagger UI at `http://localhost:8000/docs` or using tools like:
- Postman
- cURL
- Python `requests` library

### Example Python Client

```python
import requests
import json

# Clinical data prediction
url = "http://localhost:8000/predict"
data = {
    "Age (yrs)": 25.0,
    "Weight (Kg)": 65.0,
    # ... include all required features
}
response = requests.post(url, json=data)
print(response.json())

# Image prediction
url = "http://localhost:8000/predict_image"
with open("image.jpg", "rb") as f:
    files = {"file": f}
    response = requests.post(url, files=files)
    print(response.json())
```

## ⚠️ Important Notes

1. **Model Files**: Ensure all model files (`pcos_xgb_model.pkl`, `scaler.pkl`, `best_resnet50_pcos.pth`) are present in the project directory before running the API.

2. **Feature Names**: When using the `/predict` endpoint, ensure all feature names match exactly (including spaces and capitalization) as defined in the model.

3. **Image Format**: The `/predict_image` endpoint accepts common image formats (JPEG, PNG, etc.) and automatically converts them to RGB.

4. **GPU Support**: The ResNet50 model will use GPU if available (CUDA), otherwise it falls back to CPU.

## 📝 License

This project is for educational and research purposes. Please ensure proper medical validation before using in clinical settings.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or issues, please open an issue in the repository.

---

**Disclaimer**: This tool is for research and educational purposes only. It should not be used as a substitute for professional medical diagnosis, advice, or treatment. Always consult with qualified healthcare providers for medical decisions.
