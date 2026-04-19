<img width="1888" height="910" alt="image" src="https://github.com/user-attachments/assets/4542ef7f-93d3-4f17-8fe2-2a5b9ffb939e" />

<img width="1225" height="912" alt="image" src="https://github.com/user-attachments/assets/bd1077f8-c06a-4c47-832c-1b1f5d138a6f" />
## 📖 Project Overview
This project was built for **Problem: Entertainment and Media**. 
With millions of movies and shows available, understanding audience preferences and sentiment volatility is a major challenge. **CineSense-AI** is an end-to-end NLP pipeline that uses Deep Learning to automatically classify movie reviews as Positive or Negative, helping platforms gauge true audience sentiment.
## ✨ Key Features
* **Deep Learning Model:** Built with a 2-layer Bidirectional LSTM to capture forward and backward context in text.
* **REST API:** A Python Flask backend that serves real-time model predictions.
* **Interactive Dashboard:** A premium, responsive UI built with Vanilla JS and Chart.js to test the live sentiment endpoint.
* **Data Preprocessing:** Handles tokenization, HTML tag removal, stop-word filtering, and sequence padding (trained on the 50K IMDB Movie Reviews Dataset).
## 🛠️ Technology Stack
* **Frontend:** HTML5, CSS3, JavaScript (Chart.js)
* **Backend:** Python, Flask, Flask-CORS
* **Machine Learning:** TensorFlow / Keras, NumPy, Pandas, Scikit-learn
## 🚀 How to Run Locally
### 1. Setup the Backend
Clone the repository and install the dependencies:
```bash
git clone https://github.com/Nandani097/CineSense-AI.git
cd CineSense-AI
pip install -r requirements.txt
