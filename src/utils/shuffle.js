// src/utils/shuffle.js
// Fisher-Yates shuffle + number helpers

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(bank) {
  // Group by type
  const byType = {};
  bank.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });
  // Pick 10 from each type (shuffled), then final shuffle of all 100
  const selected = Object.values(byType).flatMap(qs => shuffleArray(qs).slice(0, 10));
  return shuffleArray(selected);
}

// ─── Number generators ───────────────────────────────────────────
export function randomThreeDigit(easy = false) {
  if (easy) return (Math.floor(Math.random() * 9) + 1) * 100;
  const h = Math.floor(Math.random() * 9) + 1;
  const t = Math.floor(Math.random() * 10);
  const o = Math.floor(Math.random() * 10);
  return h * 100 + t * 10 + o;
}

export function randomMultipleOf100() {
  return (Math.floor(Math.random() * 9) + 1) * 100;
}

// ─── Word form converter ─────────────────────────────────────────
const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function toWordForm(n) {
  if (n === 0)    return 'zero';
  if (n === 1000) return 'one thousand';
  const h = Math.floor(n / 100);
  const remainder = n % 100;
  const t = Math.floor(remainder / 10);
  const o = remainder % 10;
  let word = '';
  if (h > 0) word += `${ONES[h]} hundred`;
  if (remainder > 0) {
    word += h > 0 ? ' and ' : '';
    if (remainder < 20) {
      word += ONES[remainder];
    } else {
      word += TENS[t];
      if (o > 0) word += `-${ONES[o]}`;
    }
  }
  return word; // e.g. "two hundred and thirty-five"
}

export function toWordFormCapitalized(n) {
  const w = toWordForm(n);
  return w.charAt(0).toUpperCase() + w.slice(1);
}

export function toExpandedForm(n) {
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const o = n % 10;
  const parts = [];
  if (h > 0) parts.push(`${h * 100}`);
  if (t > 0) parts.push(`${t * 10}`);
  if (o > 0) parts.push(`${o}`);
  if (parts.length === 0) return '0';
  return parts.join(' + ');
}

// ─── MCQ distractor generation ───────────────────────────────────
function swapDigits(n, pos1, pos2) {
  const digits = [Math.floor(n / 100), Math.floor((n % 100) / 10), n % 10];
  [digits[pos1], digits[pos2]] = [digits[pos2], digits[pos1]];
  const result = digits[0] * 100 + digits[1] * 10 + digits[2];
  return result > 0 && result <= 1000 ? result : null;
}

export function generateDistractors3Digit(correct, count = 3) {
  const distractors = new Set();
  const strategies = [
    () => correct + 100,
    () => correct - 100,
    () => swapDigits(correct, 0, 1),
    () => swapDigits(correct, 1, 2),
    () => swapDigits(correct, 0, 2),
    () => correct + 10,
    () => correct - 10,
    () => correct + 1,
    () => correct - 1,
    () => Math.floor(correct / 100) * 100,
    () => Math.floor(correct / 10) * 10,
  ];
  const shuffledStrats = shuffleArray(strategies);
  for (const fn of shuffledStrats) {
    if (distractors.size >= count) break;
    const d = fn();
    if (d && d > 0 && d <= 1000 && d !== correct) distractors.add(d);
  }
  // Fill remaining if needed
  while (distractors.size < count) {
    const d = randomThreeDigit();
    if (d !== correct) distractors.add(d);
  }
  return shuffleArray([correct, ...Array.from(distractors).slice(0, count)]);
}
