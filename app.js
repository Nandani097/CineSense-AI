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

// Sentiment Analysis logic
function analyzeReview() {
  const text = document.getElementById('reviewInput').value.trim();
  if(!text) { alert("Please enter a review."); return; }

  const btnText = document.getElementById('btnText');
  const loader = document.getElementById('btnLoader');
  btnText.innerText = "Analyzing...";
  
  setTimeout(() => {
    let score = 0;
    let posWordsFound = [];
    let negWordsFound = [];
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    words.forEach(w => {
      if(POS_WORDS.has(w)) { score++; posWordsFound.push(w); }
      if(NEG_WORDS.has(w)) { score--; negWordsFound.push(w); }
    });

    // Basic negation detection
    if(text.toLowerCase().includes("not good") || text.toLowerCase().includes("wasn't great")) score -= 2;
    
    const isPositive = score >= 0;
    const confidence = Math.min(100, Math.max(50, 50 + Math.abs(score) * 10));

    // UI Updates
    document.getElementById('resultPlaceholder').classList.add('hidden');
    document.getElementById('resultContent').classList.remove('hidden');
    
    document.getElementById('resultLabel').innerText = isPositive ? "Positive" : "Negative";
    document.getElementById('resultLabel').className = "result-label " + (isPositive ? "positive" : "negative");
    document.getElementById('resultEmoji').innerText = isPositive ? "😊" : "😞";
    document.getElementById('resultSublabel').innerText = isPositive ? "The review expresses favorable sentiment." : "The review expresses unfavorable sentiment.";
    
    document.getElementById('confPct').innerText = confidence + "%";
    document.getElementById('confBar').style.width = confidence + "%";

    document.getElementById('rmWords').innerText = words.length;
    document.getElementById('rmPos').innerText = posWordsFound.length;
    document.getElementById('rmNeg').innerText = negWordsFound.length;
    document.getElementById('rmScore').innerText = score;

    let highlighted = text;
    posWordsFound.forEach(w => {
      const reg = new RegExp(`\\b${w}\\b`, 'gi');
      highlighted = highlighted.replace(reg, `<span class="hl-pos">${w}</span>`);
    });
    negWordsFound.forEach(w => {
      const reg = new RegExp(`\\b${w}\\b`, 'gi');
      highlighted = highlighted.replace(reg, `<span class="hl-neg">${w}</span>`);
    });
    document.getElementById('highlightedText').innerHTML = highlighted;

    const cloud = document.getElementById('keywordCloud');
    cloud.innerHTML = '';
    [...new Set(posWordsFound)].forEach(w => {
      const el = document.createElement('span'); el.className='kw-badge pos'; el.innerText='+ '+w; cloud.appendChild(el);
    });
    [...new Set(negWordsFound)].forEach(w => {
      const el = document.createElement('span'); el.className='kw-badge neg'; el.innerText='- '+w; cloud.appendChild(el);
    });

    btnText.innerText = "🔍 Analyze Sentiment";
  }, 800);
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
