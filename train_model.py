import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Bidirectional, Dense, Dropout
import pickle

# --- 1. DATA PREPARATION ---
print("Loading dataset...")
# Assuming you have a CSV with 'review' and 'sentiment' columns
# df = pd.read_csv('IMDB_Dataset.csv')
# For demonstration, creating dummy data so the script runs
df = pd.DataFrame({
    'review': ['I loved this movie', 'Terrible waste of time', 'Stunning masterpiece', 'Boring and dull'],
    'sentiment': ['positive', 'negative', 'positive', 'negative']
})

df['sentiment'] = df['sentiment'].apply(lambda x: 1 if x == 'positive' else 0)

# Parameters
vocab_size = 10000
max_length = 500
trunc_type = 'post'
padding_type = 'post'
oov_tok = "<OOV>"

print("Tokenizing text...")
tokenizer = Tokenizer(num_words=vocab_size, oov_token=oov_tok)
tokenizer.fit_on_texts(df['review'])

# Save Tokenizer for later use in Flask API
with open('tokenizer.pickle', 'wb') as handle:
    pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)

sequences = tokenizer.texts_to_sequences(df['review'])
padded = pad_sequences(sequences, maxlen=max_length, padding=padding_type, truncating=trunc_type)

labels = np.array(df['sentiment'])

# --- 2. BUILD THE MODEL ---
print("Building Bidirectional LSTM Model...")
model = Sequential([
    Embedding(vocab_size, 128, input_length=max_length),
    Bidirectional(LSTM(128, return_sequences=True)),
    Dropout(0.3),
    Bidirectional(LSTM(64)),
    Dense(64, activation='relu'),
    Dropout(0.2),
    Dense(1, activation='sigmoid')
])

model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
model.summary()

# --- 3. TRAIN THE MODEL ---
# In a real scenario, use more epochs, early stopping, and validation data
print("Training Model...")
# history = model.fit(padded, labels, epochs=10, validation_split=0.2, batch_size=64)
# We train for 1 epoch on the dummy data just to verify it works
model.fit(padded, labels, epochs=1)

# --- 4. SAVE THE MODEL ---
print("Saving model to model.h5...")
model.save("model.h5")
print("Training Complete! The model and tokenizer are saved.")
