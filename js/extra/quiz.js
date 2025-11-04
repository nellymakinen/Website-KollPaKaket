/* Implementerar ett interaktivt quiz om näringslära.

Funktioner:
Frågor med flervalsalternativ.
Användaren får poäng för rätt svar.
Resultat visas efter sista frågan.
*/
document.addEventListener("DOMContentLoaded", () => {
  const questions = getQuizQuestions();
  const quizContainer = document.getElementById("quiz");
  const resultContainer = document.getElementById("result");

  let score = 0;
  let current = 0;

  function renderQuestion() {
    const q = questions[current];
    quizContainer.innerHTML = `
      <h3>${q.question}</h3>
      <ul>
        ${renderOptions(q.options)}
      </ul>
    `;
    attachEventListeners();
  }

  function renderOptions(options) {
    return options.map(opt => `<li><button>${opt}</button></li>`).join("");
  }

  function attachEventListeners() {
    quizContainer.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => checkAnswer(btn.textContent));
    });
  }

  function checkAnswer(selected) {
    if (selected === questions[current].answer) score++;
    current++;
    if (current < questions.length) {
      renderQuestion();
    } else {
      showFinalResult();
    }
  }

  function showFinalResult() {
    quizContainer.innerHTML = "";
    resultContainer.innerHTML = `<h4>Du fick ${score} av ${questions.length} rätt!</h4>`;
  }

  function getQuizQuestions() {
    return [
      {
        question: "Vilken makronutrient är kroppens främsta energikälla?",
        options: ["Protein", "Kolhydrater", "Fett"],
        answer: "Kolhydrater"
      },
      {
        question: "Vilket vitamin är fettlösligt?",
        options: ["Vitamin C", "Vitamin B12", "Vitamin D"],
        answer: "Vitamin D"
      },
      {
        question: "Vilken mineral är viktig för syretransport i blodet?",
        options: ["Magnesium", "Järn", "Kalcium"],
        answer: "Järn"
      },
      {
        question: "Vilket ämne räknas INTE som en mikronutrient?",
        options: ["Folat", "Protein", "Vitamin K"],
        answer: "Protein"
      }
    ];
  }

  renderQuestion();
});
