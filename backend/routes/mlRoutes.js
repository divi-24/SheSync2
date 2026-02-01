/**
 * ML Routes - Proxy to Python ML Model API
 * Forwards requests to the SheSyncML FastAPI server
 */

import express from 'express';

const router = express.Router();
const ML_PYTHON_URL = process.env.ML_PYTHON_API_URL || "http://localhost:8000";

/**
 * POST /api/ml/predict
 * PCOS prediction using tabular clinical data
 * Proxies to Python ML API /predict endpoint
 */
router.post('/predict', async (req, res) => {
  try {
    const clinicalData = req.body;

    if (!clinicalData || Object.keys(clinicalData).length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Clinical data is required',
      });
    }

    // Forward request to Python ML API
    const response = await fetch(`${ML_PYTHON_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clinicalData),
    });

    if (!response.ok) {
      throw new Error(`ML API error: ${response.statusText}`);
    }

    const result = await response.json();

    res.json({
      success: true,
      PCOS_Predicted: result.PCOS_Predicted,
      Probability_of_PCOS: result.Probability_of_PCOS,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[ML Route] Prediction error:', error.message);
    res.status(502).json({
      error: 'Prediction failed',
      message: error.message,
      hint: `Make sure Python ML API is running at ${ML_PYTHON_URL}`,
    });
  }
});

/**
 * POST /api/ml/predict_image
 * PCOS prediction from ultrasound image
 * Proxies to Python ML API /predict_image endpoint
 */
router.post('/predict_image', async (req, res) => {
  try {
    console.log('[ML Route] Received image prediction request');
    console.log('[ML Route] Request file:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'No file');
    
    // Get file from request
    let file = null;

    // Try multer (if configured)
    if (req.file) {
      file = req.file;
    }

    if (!file) {
      console.error('[ML Route] No file received');
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Image file is required',
      });
    }

    console.log(`[ML Route] Processing image: ${file.originalname}`);

    // Create FormData for file upload
    const formData = new FormData();
    
    // Append file with proper format for multer
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append('file', blob, file.originalname);

    console.log(`[ML Route] Forwarding to Python API: ${ML_PYTHON_URL}/predict_image`);

    // Forward request to Python ML API
    const response = await fetch(`${ML_PYTHON_URL}/predict_image`, {
      method: 'POST',
      body: formData,
    });

    console.log(`[ML Route] Python API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ML Route] Python API error: ${response.statusText}`, errorText);
      throw new Error(`ML API error: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[ML Route] Got results from Python API:', result);

    res.json({
      success: true,
      Predicted_Label: result.Predicted_Label,
      Probability_Visible: result.Probability_Visible,
      Probability_Not_Visible: result.Probability_Not_Visible,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[ML Route] Image prediction error:', error.message);
    res.status(502).json({
      error: 'Image prediction failed',
      message: error.message,
      hint: `Make sure Python ML API is running at ${ML_PYTHON_URL}`,
    });
  }
});

/**
 * GET /api/ml/health
 * Check if ML APIs are operational
 */
router.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${ML_PYTHON_URL}/docs`);
    
    res.json({
      success: true,
      status: 'operational',
      backend: 'running',
      pythonMLAPI: response.ok ? 'connected' : 'unreachable',
      pythonMLURL: ML_PYTHON_URL,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'error',
      message: error.message,
      pythonMLURL: ML_PYTHON_URL,
      hint: 'Make sure Python ML API (SheSyncML) is running',
    });
  }
});

export default router;
