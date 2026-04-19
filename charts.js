// Chart Configuration defaults
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', sans-serif";

let charts = {};

function initCharts() {
  // 1. Sentiment Pie Chart
  const pieCtx = document.getElementById('sentimentPieChart').getContext('2d');
  charts.pie = new Chart(pieCtx, {
    type: 'doughnut',
    data: {
      labels: ['Positive', 'Negative'],
      datasets: [{
        data: [EDA_DATA.sentimentDist.positive, EDA_DATA.sentimentDist.negative],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0
      }]
    },
    options: { responsive: true, cutout: '70%' }
  });

  // 2. Review Length Distribution
  const lenCtx = document.getElementById('lengthChart').getContext('2d');
  charts.len = new Chart(lenCtx, {
    type: 'bar',
    data: {
      labels: EDA_DATA.reviewLengthBins.labels,
      datasets: [
        { label: 'Positive', data: EDA_DATA.reviewLengthBins.positive, backgroundColor: '#10b981' },
        { label: 'Negative', data: EDA_DATA.reviewLengthBins.negative, backgroundColor: '#ef4444' }
      ]
    },
    options: { responsive: true, scales: { y: { stacked: false } } }
  });

  // 3. Top Words Charts
  const posCtx = document.getElementById('posWordsChart').getContext('2d');
  charts.posWords = new Chart(posCtx, {
    type: 'bar',
    data: {
      labels: EDA_DATA.topPositiveWords.labels,
      datasets: [{ label: 'Frequency', data: EDA_DATA.topPositiveWords.counts, backgroundColor: '#34d399' }]
    },
    options: { responsive: true, indexAxis: 'y' }
  });

  const negCtx = document.getElementById('negWordsChart').getContext('2d');
  charts.negWords = new Chart(negCtx, {
    type: 'bar',
    data: {
      labels: EDA_DATA.topNegativeWords.labels,
      datasets: [{ label: 'Frequency', data: EDA_DATA.topNegativeWords.counts, backgroundColor: '#f87171' }]
    },
    options: { responsive: true, indexAxis: 'y' }
  });

  // 4. Genre Sentiment
  const genCtx = document.getElementById('genreChart').getContext('2d');
  charts.genre = new Chart(genCtx, {
    type: 'bar',
    data: {
      labels: EDA_DATA.genreSentiment.labels,
      datasets: [
        { label: '% Positive', data: EDA_DATA.genreSentiment.positive, backgroundColor: '#10b981' },
        { label: '% Negative', data: EDA_DATA.genreSentiment.negative, backgroundColor: '#ef4444' }
      ]
    },
    options: { responsive: true, scales: { y: { stacked: true, max: 100 } } }
  });

  // 5. Model Training History
  const accCtx = document.getElementById('accChart').getContext('2d');
  new Chart(accCtx, {
    type: 'line',
    data: {
      labels: EDA_DATA.trainingHistory.epochs,
      datasets: [
        { label: 'Train Acc', data: EDA_DATA.trainingHistory.trainAcc, borderColor: '#3b82f6', tension: 0.3 },
        { label: 'Val Acc', data: EDA_DATA.trainingHistory.valAcc, borderColor: '#8b5cf6', tension: 0.3 }
      ]
    }
  });

  const lossCtx = document.getElementById('lossChart').getContext('2d');
  new Chart(lossCtx, {
    type: 'line',
    data: {
      labels: EDA_DATA.trainingHistory.epochs,
      datasets: [
        { label: 'Train Loss', data: EDA_DATA.trainingHistory.trainLoss, borderColor: '#f59e0b', tension: 0.3 },
        { label: 'Val Loss', data: EDA_DATA.trainingHistory.valLoss, borderColor: '#ef4444', tension: 0.3 }
      ]
    }
  });
}

function showEDA(tab) {
  document.querySelectorAll('.eda-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('eda-' + tab).classList.add('active');
  event.target.classList.add('active');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initCharts);
