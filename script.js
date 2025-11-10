// Global variables
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 300; // 5 minutes in seconds
let userName = '';

// Load questions from JSON
async function loadQuestions(quizType) {
  const response = await fetch(`json/${quizType}.json`);
  questions = await response.json();
  questions = questions.sort(() => Math.random() - 0.5).slice(0, 10); // Randomize and take 10
}

// Start timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `Time Left: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showResults();
    }
  }, 1000);
}

// Show question
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
      showResults();
      return;
    }
    const q = questions[currentQuestionIndex];
    document.getElementById('question').textContent = q.question;
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    q.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.textContent = option;
      button.onclick = () => handleAnswer(index);
      button.classList.add('option-btn');
      optionsContainer.appendChild(button);
    });
  }
  
  function handleAnswer(selectedIndex) {
    if (selectedIndex === questions[currentQuestionIndex].answer) {
      score++;
    }
    currentQuestionIndex++;
    showQuestion();
  }
  
  function showResults() {
    clearInterval(timer);
    localStorage.setItem('score', score);
    localStorage.setItem('total', questions.length);
    window.location.href = 'result.html';
  }
  
  // For name.html
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('name.html')) {
      document.getElementById('name-form').addEventListener('submit', (e) => {
        e.preventDefault();
        userName = document.getElementById('name').value;
        localStorage.setItem('userName', userName);
        const urlParams = new URLSearchParams(window.location.search);
        const quizType = urlParams.get('quiz');
        window.location.href = `quiz.html?quiz=${quizType}`;
      });
    }
  
    // For quiz.html
    if (window.location.pathname.includes('quiz.html')) {
      const urlParams = new URLSearchParams(window.location.search);
      const quizType = urlParams.get('quiz');
      loadQuestions(quizType).then(() => {
        startTimer();
        showQuestion();
      });
    }
  
    // For result.html
    if (window.location.pathname.includes('result.html')) {
      const score = localStorage.getItem('score');
      const total = localStorage.getItem('total');
      const userName = localStorage.getItem('userName');
      document.getElementById('result-text').textContent = `${userName}, you scored ${score}/${total}!`;
      // Simple line graph using Chart.js (included in result.html)
      const ctx = document.getElementById('scoreChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10'],
          datasets: [{
            label: 'Score Progress',
            data: Array.from({length: 10}, (_, i) => (i < parseInt(score)) ? 1 : 0), // Dummy data for visualization
            borderColor: '#667eea',
            fill: false
          }]
        }
      });
    }
  });