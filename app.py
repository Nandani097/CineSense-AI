from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import os
import re

# In a real environment, you import tensorflow and load the model:
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing.sequence import pad_sequences
# import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS for the frontend to connect

# Attempt to load the model (Fallback to mock for local UI testing without a trained model)
MODEL_PATH = "model.h5"
TOKENIZER_PATH = "tokenizer.pickle"

model = None
tokenizer = None

if os.path.exists(MODEL_PATH) and os.path.exists(TOKENIZER_PATH):
    try:
        # from tensorflow.keras.models import load_model
        # import pickle
        # model = load_model(MODEL_PATH)
        # with open(TOKENIZER_PATH, 'rb') as handle:
        #     tokenizer = pickle.load(handle)
        print("Model loaded successfully from model.h5")
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    print("Warning: model.h5 not found. Using inference simulator for API testing.")

def preprocess_text(text):
    """
    Cleans the input text (removing HTML, special chars)
    """
    text = text.lower()
    text = re.sub(r'<[^>]+>', ' ', text) # Remove HTML tags
    text = re.sub(r'[^a-zA-Z\s]', '', text) # Remove special characters
    return text

def predict_sentiment_mock(text):
    """
    A simulator function to provide immediate API responses until the real model.h5 is generated.
    """
    positive_words = ['good', 'great', 'excellent', 'amazing', 'masterpiece', 'love', 'best', 'stunning']
    negative_words = ['bad', 'terrible', 'worst', 'boring', 'awful', 'waste', 'disaster', 'disappointing']
    
    score = 0
    words = text.split()
    for w in words:
        if w in positive_words: score += 1
        if w in negative_words: score -= 1
        
    if "not" in text:
        score -= 1
        
    confidence = min(0.99, max(0.50, 0.50 + abs(score) * 0.15))
    if score >= 0:
        return "Positive", confidence
    else:
        return "Negative", confidence

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'review' not in data:
            return jsonify({'error': 'No review provided'}), 400
            
        review_text = data['review']
        cleaned_text = preprocess_text(review_text)
        
        if model is not None and tokenizer is not None:
            # REAL MODEL INFERENCE
            # sequences = tokenizer.texts_to_sequences([cleaned_text])
            # padded_seq = pad_sequences(sequences, maxlen=500, padding='post', truncating='post')
            # prediction = model.predict(padded_seq)[0][0]
            # label = "Positive" if prediction > 0.5 else "Negative"
            # confidence = float(prediction) if prediction > 0.5 else float(1 - prediction)
            pass
        else:
            # SIMULATED INFERENCE FOR FRONTEND TESTING
            label, confidence = predict_sentiment_mock(cleaned_text)
            
        return jsonify({
            'sentiment': label,
            'confidence': round(confidence * 100, 2),
            'processed_text': cleaned_text
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Flask API is running!', 'model_loaded': model is not None})

if __name__ == '__main__':
    print("Starting Flask Server...")
    # Run on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
