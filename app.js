// Menu Toggle
function toggleMenu() {
  const links = document.getElementById('navLinks');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
}

// Character Counter
function updateCounter(el) {
  document.getElementById('charCounter').innerText = `${el.value.length} / 1000 characters`;
}

function clearReview() {
  document.getElementById('reviewInput').value = '';
  updateCounter(document.getElementById('reviewInput'));
  document.getElementById('resultContent').classList.add('hidden');
  document.getElementById('resultPlaceholder').classList.remove('hidden');
}

function loadReview(type) {
  const ta = document.getElementById('reviewInput');
  if(type === 'positive') ta.value = "An absolute masterpiece. The acting, direction, and story were all top-notch. I loved every minute of it and highly recommend it!";
  if(type === 'negative') ta.value = "Terrible waste of time and money. The plot made no sense, the acting was wooden, and it was incredibly boring. Do not watch this disaster.";
  if(type === 'mixed') ta.value = "The visual effects were stunning and the music was great, but the story was weak and the characters were underdeveloped. An okay watch, but not amazing.";
  updateCounter(ta);
}

// Sentiment Analysis logic connected to Python Flask API
async function analyzeReview() {
  const text = document.getElementById('reviewInput').value.trim();
  if(!text) { alert("Please enter a review."); return; }

  const btnText = document.getElementById('btnText');
  const loader = document.getElementById('btnLoader');
  btnText.innerText = "Analyzing via Python API...";
  
  try {
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review: text })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const isPositive = data.sentiment === 'Positive';
    const confidence = data.confidence;

    // UI Updates
    document.getElementById('resultPlaceholder').classList.add('hidden');
    document.getElementById('resultContent').classList.remove('hidden');
    
    document.getElementById('resultLabel').innerText = data.sentiment;
    document.getElementById('resultLabel').className = "result-label " + (isPositive ? "positive" : "negative");
    document.getElementById('resultEmoji').innerText = isPositive ? "😊" : "😞";
    document.getElementById('resultSublabel').innerText = isPositive ? "The model predicts favorable sentiment." : "The model predicts unfavorable sentiment.";
    
    document.getElementById('confPct').innerText = confidence + "%";
    document.getElementById('confBar').style.width = confidence + "%";

    // Simple keyword highlighting for display (since API just returns sentiment)
    const words = text.split(/\s+/);
    let highlighted = "";
    const posW = ['good', 'great', 'excellent', 'amazing', 'masterpiece', 'love', 'best', 'stunning'];
    const negW = ['bad', 'terrible', 'worst', 'boring', 'awful', 'waste', 'disaster', 'disappointing'];
    
    words.forEach(w => {
      let clean_w = w.toLowerCase().replace(/[^a-z]/g, '');
      if(posW.includes(clean_w)) highlighted += `<span class="hl-pos">${w}</span> `;
      else if(negW.includes(clean_w)) highlighted += `<span class="hl-neg">${w}</span> `;
      else highlighted += `${w} `;
    });
    
    document.getElementById('highlightedText').innerHTML = highlighted;

  } catch (error) {
    console.error("Error calling Python API:", error);
    alert("Could not connect to the Python Flask API. Make sure app.py is running on port 5000!");
  } finally {
    btnText.innerText = "🔍 Predict Sentiment";
  }
}

// Explorer
function renderReviews(data) {
  const grid = document.getElementById('reviewGrid');
  grid.innerHTML = '';
  document.getElementById('explorerCount').innerText = `Showing ${data.length} reviews`;
  
  data.forEach(r => {
    const el = document.createElement('div');
    el.className = 'review-card';
    el.innerHTML = `
      <div class="rc-header">
        <div><div class="rc-movie">${r.movie}</div><div class="rc-year">${r.year} · ${r.genre}</div></div>
        <div class="rc-rating">★ ${r.rating}</div>
      </div>
      <div class="rc-body">"${r.review}"</div>
      <div class="rc-footer">
        <div class="rc-sentiment ${r.sentiment}">
          ${r.sentiment==='positive' ? '😊 Positive' : '😞 Negative'}
        </div>
        <div style="font-size:0.8rem;color:#94a3b8">Conf: ${r.confidence}%</div>
      </div>
    `;
    grid.appendChild(el);
  });
}

let currentFilter = 'all';
function filterReviews(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  searchReviews();
}

function sortReviews() {
  searchReviews();
}

function searchReviews() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const sort = document.getElementById('sortSelect').value;
  
  let filtered = SAMPLE_REVIEWS.filter(r => {
    const matchType = currentFilter === 'all' || r.sentiment === currentFilter;
    const matchSearch = r.movie.toLowerCase().includes(query) || r.review.toLowerCase().includes(query);
    return matchType && matchSearch;
  });

  filtered.sort((a,b) => b[sort] - a[sort]);
  renderReviews(filtered);
}

// Initialize Explorer
document.addEventListener('DOMContentLoaded', () => {
  renderReviews(SAMPLE_REVIEWS);
});
