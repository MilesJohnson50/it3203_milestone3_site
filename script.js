
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.menu');

  if (navToggle && menu) {
    navToggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    menu.addEventListener('click', (event) => {
      if (event.target.tagName === 'A' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const form = document.getElementById('quizForm');
  const results = document.getElementById('results');
  const resetBtn = document.getElementById('resetBtn');

  const key = {
    q1: { type: 'text', answers: ['hypertext transfer protocol'], points: 20 },
    q2: { type: 'single', answer: 'GET', points: 20 },
    q3: { type: 'single', answer: '404', points: 20 },
    q4: { type: 'single', answer: 'etag', points: 20 },
    q5: { type: 'multi', answers: ['udp', 'hol', 'migrate'], points: 20 }
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let total = 0;
    let correctCount = 0;
    const details = [];

    const q1Input = form.q1.value || "";
    const q1 = q1Input.trim().toLowerCase();
    const q1ok = key.q1.answers.includes(q1);
    if (q1ok) { total += key.q1.points; correctCount++; }
    details.push(renderDetail(1, q1ok, q1Input || "—", "Hypertext Transfer Protocol", key.q1.points));

    const q2 = form.q2.value || "";
    const q2ok = q2 === key.q2.answer;
    if (q2ok) { total += key.q2.points; correctCount++; }
    details.push(renderDetail(2, q2ok, q2 || "—", "GET", key.q2.points));

    const q3 = form.q3.value || "";
    const q3ok = q3 === key.q3.answer;
    if (q3ok) { total += key.q3.points; correctCount++; }
    details.push(renderDetail(3, q3ok, q3 || "—", "404", key.q3.points));

    const q4 = form.q4.value || "";
    const q4Labels = {
      auth: "Authorization & Accept",
      etag: "ETag & Last-Modified",
      ctype: "Content-Type & Accept"
    };
    const q4GivenLabel = q4 ? (q4Labels[q4] || q4) : "—";
    const q4CorrectLabel = q4Labels["etag"];
    const q4ok = q4 === key.q4.answer;
    if (q4ok) { total += key.q4.points; correctCount++; }
    details.push(renderDetail(4, q4ok, q4GivenLabel, q4CorrectLabel, key.q4.points));

    const selected = Array.from(form.querySelectorAll('input[name="q5"]:checked')).map(i => i.value);
    const correct = key.q5.answers;
    const setEq = (a, b) => a.length === b.length && a.every(v => b.includes(v));
    const q5ok = setEq(selected.slice().sort(), correct.slice().sort());
    if (q5ok) { total += key.q5.points; correctCount++; }

    const labelMap = {
      udp: "QUIC uses UDP as its transport.",
      hol: "QUIC reduces head-of-line blocking effects.",
      tcp: "HTTP/3 requires TCP to multiplex streams.",
      migrate: "QUIC supports connection migration with Connection IDs."
    };

    const displaySelected = selected.length
      ? selected.map(v => labelMap[v] || v).join(" | ")
      : "—";
    const displayCorrect = correct.map(v => labelMap[v]).join(" | ");

    details.push(renderDetail(5, q5ok, displaySelected, displayCorrect, key.q5.points));

    const passed = total >= 70;
    const summary = `
      <h2 class="results-heading">Quiz Results</h2>
      <div class="results-summary">
        <p>Overall result:
          <span class="badge ${passed ? "badge-pass" : "badge-fail"}">
            ${passed ? "PASS" : "FAIL"}
          </span>
        </p>
        <p>Total score:
          <span class="score-chip">
            <span>${total}</span>
            <span>/ 100</span>
          </span>
          <span class="${passed ? "result-pass" : "result-fail"}">
            (${correctCount} of 5 questions correct)
          </span>
        </p>
      </div>
    `;

    results.innerHTML = summary + `<hr><ol class="detail-list">${details.join("")}</ol>`;
    results.hidden = false;
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  resetBtn?.addEventListener("click", () => {
    results.innerHTML = "";
    results.hidden = true;
  });

  function renderDetail(n, ok, given, expected, pts){
    const state = ok ? "Correct" : "Incorrect";
    const cls = ok ? "answer-correct" : "answer-wrong";
    const earned = ok ? pts : 0;
    return `
      <li>
        <p><strong>Question ${n}:</strong>
          <span class="${cls}">${state}</span>
          <span class="score-chip">${earned}/${pts}</span>
        </p>
        <p class="answer-neutral">Your answer: ${escapeHtml(given)}</p>
        <p class="answer-neutral">Correct answer: ${escapeHtml(expected)}</p>
      </li>
    `;
  }

  function escapeHtml(value){
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }
});
