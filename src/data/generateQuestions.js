// src/data/generateQuestions.js
import fs from 'fs';
import path from 'path';

const NAMES = ['Mei Ling', 'Raj', 'Wei Ming', 'Priya', 'Ahmad', 'Siti', 'Jun', 'Ryan', 'Xiao Hong', 'Devi'];
const OBJECTS = ['stamps', 'marbles', 'stickers', 'books', 'buttons', 'beads', 'cookies', 'eggs', 'seeds', 'muffins'];
const SETTINGS = ['school library', 'hawker stall', 'community garden', 'void deck', 'playground', 'supermarket', 'sports day', 'class collection', 'school bookshop'];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function decompose(n) {
  return {
    H: Math.floor(n / 100),
    T: Math.floor((n % 100) / 10),
    O: n % 10
  };
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateOptions(correct, isAddition, regroup_ones, regroup_tens) {
  const options = new Set();
  options.add(correct);
  
  // Distractor 1: Forgot carry/borrow in ones (off by 10)
  if (regroup_ones) {
    options.add(isAddition ? correct - 10 : correct + 10);
  } else {
    options.add(correct - 10);
  }
  
  // Distractor 2: Forgot carry/borrow in tens (off by 100)
  if (regroup_tens) {
    options.add(isAddition ? correct - 100 : correct + 100);
  } else {
    options.add(correct - 100);
  }
  
  // Distractor 3: Carried twice or simple offset
  options.add(correct + 10);
  options.add(correct - 1);
  options.add(correct + 1);
  options.add(correct + 2);
  options.add(correct - 2);

  const filtered = Array.from(options)
    .filter(o => o > 0 && o <= 1000 && o !== null)
    .slice(0, 4);

  // If we don't have 4 options, pad them
  while (filtered.length < 4) {
    const r = correct + rand(-20, 20);
    if (r > 0 && r <= 1000 && !filtered.includes(r)) {
      filtered.push(r);
    }
  }

  return shuffle(filtered);
}

const questions = [];

// Helper to add question
function addQ(q) {
  questions.push(q);
}

// 1. col_add_no_regroup (World 0, Type Q1)
for (let i = 1; i <= 10; i++) {
  let top, bot, h1, t1, o1, h2, t2, o2;
  do {
    h1 = rand(1, 4); t1 = rand(0, 4); o1 = rand(0, 4);
    h2 = rand(1, 4); t2 = rand(0, 4); o2 = rand(0, 4);
    top = h1 * 100 + t1 * 10 + o1;
    bot = h2 * 100 + t2 * 10 + o2;
  } while (top + bot > 999);

  const ans = top + bot;
  const topDec = decompose(top);
  const botDec = decompose(bot);
  const ansDec = decompose(ans);

  addQ({
    id: `Q1_${String(i).padStart(3, '0')}`,
    type: 'col_add_no_regroup',
    world: 0,
    difficulty: i <= 5 ? 1 : i <= 8 ? 2 : 3,
    topNumber: top,
    bottomNumber: bot,
    operation: '+',
    answer: ans,
    topH: topDec.H, topT: topDec.T, topO: topDec.O,
    bottomH: botDec.H, bottomT: botDec.T, bottomO: botDec.O,
    answerH: ansDec.H, answerT: ansDec.T, answerO: ansDec.O,
    regroup_ones: false,
    regroup_tens: false,
    questionText: `${top} + ${bot} = ?`,
    visual: 'column',
    options: generateOptions(ans, true, false, false),
    correctAnswer: ans,
    hint1: `Add column by column, starting with the ones.`,
    hint2: `Ones: ${o1} + ${o2} = ${o1+o2}. Tens: ${t1} + ${t2} = ${t1+t2}. Hundreds: ${h1} + ${h2} = ${h1+h2}.`,
    explanation: `Start from ones: ${o1} + ${o2} = ${o1+o2}. Next, tens: ${t1} + ${t2} = ${t1+t2}. Finally, hundreds: ${h1} + ${h2} = ${h1+h2}. So, the answer is ${ans}.`
  });
}

// 2. col_add_regroup_ones (World 1, Type Q2)
for (let i = 1; i <= 10; i++) {
  let top, bot, h1, t1, o1, h2, t2, o2;
  do {
    h1 = rand(1, 4); t1 = rand(0, 4); o1 = rand(5, 9);
    h2 = rand(1, 4); t2 = rand(0, 4); o2 = rand(5, 9);
    top = h1 * 100 + t1 * 10 + o1;
    bot = h2 * 100 + t2 * 10 + o2;
  } while (top + bot > 999 || (o1 + o2) < 10 || (t1 + t2 + 1) >= 10);

  const ans = top + bot;
  const topDec = decompose(top);
  const botDec = decompose(bot);
  const ansDec = decompose(ans);

  addQ({
    id: `Q2_${String(i).padStart(3, '0')}`,
    type: 'col_add_regroup_ones',
    world: 1,
    difficulty: i <= 4 ? 1 : i <= 8 ? 2 : 3,
    topNumber: top,
    bottomNumber: bot,
    operation: '+',
    answer: ans,
    topH: topDec.H, topT: topDec.T, topO: topDec.O,
    bottomH: botDec.H, bottomT: botDec.T, bottomO: botDec.O,
    answerH: ansDec.H, answerT: ansDec.T, answerO: ansDec.O,
    regroup_ones: true,
    regroup_tens: false,
    carry_value: 1,
    questionText: `${top} + ${bot} = ?`,
    visual: 'column',
    options: generateOptions(ans, true, true, false),
    correctAnswer: ans,
    hint1: `Look at the ones column: ${o1} + ${o2} = ${o1+o2}. Since this is 10 or more, you must regroup!`,
    hint2: `Write ${(o1+o2)%10} in the ones place and carry 1 to the tens column. Then add: 1 + ${t1} + ${t2} = ${t1+t2+1}.`,
    explanation: `Ones: ${o1} + ${o2} = ${o1+o2} (write ${(o1+o2)%10}, carry 1). Tens: 1 (carried) + ${t1} + ${t2} = ${t1+t2+1}. Hundreds: ${h1} + ${h2} = ${h1+h2}. Answer: ${ans}.`
  });
}

// 3. col_add_regroup_tens (World 2, Type Q3)
for (let i = 1; i <= 10; i++) {
  let top, bot, h1, t1, o1, h2, t2, o2;
  do {
    h1 = rand(1, 4); t1 = rand(5, 9); o1 = rand(0, 4);
    h2 = rand(1, 4); t2 = rand(5, 9); o2 = rand(0, 4);
    top = h1 * 100 + t1 * 10 + o1;
    bot = h2 * 100 + t2 * 10 + o2;
  } while (top + bot > 999 || (o1 + o2) >= 10 || (t1 + t2) < 10);

  const ans = top + bot;
  const topDec = decompose(top);
  const botDec = decompose(bot);
  const ansDec = decompose(ans);

  addQ({
    id: `Q3_${String(i).padStart(3, '0')}`,
    type: 'col_add_regroup_tens',
    world: 2,
    difficulty: i <= 4 ? 1 : i <= 7 ? 2 : 3,
    topNumber: top,
    bottomNumber: bot,
    operation: '+',
    answer: ans,
    topH: topDec.H, topT: topDec.T, topO: topDec.O,
    bottomH: botDec.H, bottomT: botDec.T, bottomO: botDec.O,
    answerH: ansDec.H, answerT: ansDec.T, answerO: ansDec.O,
    regroup_ones: false,
    regroup_tens: true,
    carry_value: 1, // carry from tens to hundreds
    questionText: `${top} + ${bot} = ?`,
    visual: 'column',
    options: generateOptions(ans, true, false, true),
    correctAnswer: ans,
    hint1: `Ones column: ${o1} + ${o2} = ${o1+o2} (no carry). Tens column: ${t1} + ${t2} = ${t1+t2}. That's 10 or more tens!`,
    hint2: `Regroup 10 tens into 1 hundred. Write ${(t1+t2)%10} in the tens column and carry 1 to the hundreds.`,
    explanation: `Ones: ${o1} + ${o2} = ${o1+o2}. Tens: ${t1} + ${t2} = ${t1+t2} (write ${(t1+t2)%10}, carry 1 to hundreds). Hundreds: 1 (carried) + ${h1} + ${h2} = ${h1+h2+1}. Answer: ${ans}.`
  });
}

// 4. col_add_regroup_both (World 3, Type Q4)
for (let i = 1; i <= 10; i++) {
  let top, bot, h1, t1, o1, h2, t2, o2;
  do {
    h1 = rand(1, 4); t1 = rand(4, 8); o1 = rand(5, 9);
    h2 = rand(1, 4); t2 = rand(4, 8); o2 = rand(5, 9);
    top = h1 * 100 + t1 * 10 + o1;
    bot = h2 * 100 + t2 * 10 + o2;
  } while (top + bot > 999 || (o1 + o2) < 10 || (t1 + t2 + 1) < 10);

  const ans = top + bot;
  const topDec = decompose(top);
  const botDec = decompose(bot);
  const ansDec = decompose(ans);

  addQ({
    id: `Q4_${String(i).padStart(3, '0')}`,
    type: 'col_add_regroup_both',
    world: 3,
    difficulty: i <= 3 ? 1 : i <= 7 ? 2 : 3,
    topNumber: top,
    bottomNumber: bot,
    operation: '+',
    answer: ans,
    topH: topDec.H, topT: topDec.T, topO: topDec.O,
    bottomH: botDec.H, bottomT: botDec.T, bottomO: botDec.O,
    answerH: ansDec.H, answerT: ansDec.T, answerO: ansDec.O,
    regroup_ones: true,
    regroup_tens: true,
    carry_value: 2, // both carried
    questionText: `${top} + ${bot} = ?`,
    visual: 'column',
    options: generateOptions(ans, true, true, true),
    correctAnswer: ans,
    hint1: `This problem requires regrouping twice! Start with ${o1} + ${o2} in the ones.`,
    hint2: `Ones: ${o1} + ${o2} = ${o1+o2} (carry 1). Tens: 1 + ${t1} + ${t2} = ${t1+t2+1} (carry 1). Hundreds: 1 + ${h1} + ${h2} = ${h1+h2+1}.`,
    explanation: `Ones: ${o1} + ${o2} = ${o1+o2} (write ${(o1+o2)%10}, carry 1). Tens: 1 (carried) + ${t1} + ${t2} = ${t1+t2+1} (write ${(t1+t2+1)%10}, carry 1). Hundreds: 1 (carried) + ${h1} + ${h2} = ${h1+h2+1}. Answer: ${ans}.`
  });
}

// 5. col_sub_no_borrow (World 4, Type Q5)
for (let i = 1; i <= 10; i++) {
  let top, bot, h1, t1, o1, h2, t2, o2;
  do {
    h1 = rand(3, 9); t1 = rand(3, 9); o1 = rand(3, 9);
    h2 = rand(1, h1 - 1); t2 = rand(0, t1); o2 = rand(0, o1);
    top = h1 * 100 + t1 * 10 + o1;
    bot = h2 * 100 + t2 * 10 + o2;
  } while (top - bot <= 0);

  const ans = top - bot;
  const topDec = decompose(top);
  const botDec = decompose(bot);
  const ansDec = decompose(ans);

  addQ({
    id: `Q5_${String(i).padStart(3, '0')}`,
    type: 'col_sub_no_borrow',
    world: 4,
    difficulty: i <= 5 ? 1 : i <= 8 ? 2 : 3,
    topNumber: top,
    bottomNumber: bot,
    operation: '-',
    answer: ans,
    topH: topDec.H, topT: topDec.T, topO: topDec.O,
    bottomH: botDec.H, bottomT: botDec.T, bottomO: botDec.O,
    answerH: ansDec.H, answerT: ansDec.T, answerO: ansDec.O,
    regroup_ones: false,
    regroup_tens: false,
    questionText: `${top} − ${bot} = ?`,
    visual: 'column',
    options: generateOptions(ans, false, false, false),
    correctAnswer: ans,
    hint1: `Subtract column by column: Ones first, then Tens, then Hundreds. No borrowing needed!`,
    hint2: `Ones: ${o1} − ${o2} = ${o1-o2}. Tens: ${t1} − ${t2} = ${t1-t2}. Hundreds: ${h1} − ${h2} = ${h1-h2}.`,
    explanation: `Subtract column by column: Ones: ${o1} − ${o2} = ${o1-o2}. Tens: ${t1} − ${t2} = ${t1-t2}. Hundreds: ${h1} − ${h2} = ${h1-h2}. Answer: ${ans}.`
  });
}

// 6. col_sub_borrow_tens (World 5, Type Q6)
for (let i = 1; i <= 10; i++) {
  let top, bot, h1, t1, o1, h2, t2, o2;
  do {
    h1 = rand(3, 9); t1 = rand(3, 9); o1 = rand(0, 4);
    h2 = rand(1, h1 - 1); t2 = rand(0, t1 - 1); o2 = rand(5, 9);
    top = h1 * 100 + t1 * 10 + o1;
    bot = h2 * 100 + t2 * 10 + o2;
  } while (top - bot <= 0 || o1 >= o2 || (t1 - 1) < t2);

  const ans = top - bot;
  const topDec = decompose(top);
  const botDec = decompose(bot);
  const ansDec = decompose(ans);

  addQ({
    id: `Q6_${String(i).padStart(3, '0')}`,
    type: 'col_sub_borrow_tens',
    world: 5,
    difficulty: i <= 4 ? 1 : i <= 8 ? 2 : 3,
    topNumber: top,
    bottomNumber: bot,
    operation: '-',
    answer: ans,
    topH: topDec.H, topT: topDec.T, topO: topDec.O,
    bottomH: botDec.H, bottomT: botDec.T, bottomO: botDec.O,
    answerH: ansDec.H, answerT: ansDec.T, answerO: ansDec.O,
    regroup_ones: true,
    regroup_tens: false,
    borrow_tens: true,
    questionText: `${top} − ${bot} = ?`,
    visual: 'column',
    options: generateOptions(ans, false, true, false),
    correctAnswer: ans,
    hint1: `In the ones column, ${o1} is smaller than ${o2}. You need to borrow 1 ten from the tens column!`,
    hint2: `Borrowing 1 ten makes the tens digit ${t1 - 1} and the ones digit ${o1 + 10}. Now subtract: ${o1 + 10} − ${o2} = ${o1 + 10 - o2}.`,
    explanation: `Ones: borrow 1 ten to make ${o1+10} ones. ${o1+10} − ${o2} = ${o1+10-o2}. Tens: ${t1-1} − ${t2} = ${t1-1-t2}. Hundreds: ${h1} − ${h2} = ${h1-h2}. Answer: ${ans}.`
  });
}

// 7. col_sub_borrow_hundreds (World 6, Type Q7)
for (let i = 1; i <= 10; i++) {
  let top, bot, h1, t1, o1, h2, t2, o2;
  do {
    h1 = rand(3, 9); t1 = rand(0, 4); o1 = rand(5, 9);
    h2 = rand(1, h1 - 1); t2 = rand(5, 9); o2 = rand(0, o1);
    top = h1 * 100 + t1 * 10 + o1;
    bot = h2 * 100 + t2 * 10 + o2;
  } while (top - bot <= 0 || o1 < o2 || t1 >= t2 || (h1 - 1) < h2);

  const ans = top - bot;
  const topDec = decompose(top);
  const botDec = decompose(bot);
  const ansDec = decompose(ans);

  addQ({
    id: `Q7_${String(i).padStart(3, '0')}`,
    type: 'col_sub_borrow_hundreds',
    world: 6,
    difficulty: i <= 3 ? 1 : i <= 7 ? 2 : 3,
    topNumber: top,
    bottomNumber: bot,
    operation: '-',
    answer: ans,
    topH: topDec.H, topT: topDec.T, topO: topDec.O,
    bottomH: botDec.H, bottomT: botDec.T, bottomO: botDec.O,
    answerH: ansDec.H, answerT: ansDec.T, answerO: ansDec.O,
    regroup_ones: false,
    regroup_tens: true,
    borrow_hundreds: true,
    questionText: `${top} − ${bot} = ?`,
    visual: 'column',
    options: generateOptions(ans, false, false, true),
    correctAnswer: ans,
    hint1: `In the tens column, ${t1} is smaller than ${t2}. You need to borrow 1 hundred from the hundreds column!`,
    hint2: `Borrowing 1 hundred makes the hundreds digit ${h1 - 1} and the tens digit ${t1 + 10}. Now subtract: ${t1 + 10} − ${t2} = ${t1 + 10 - t2}.`,
    explanation: `Ones: ${o1} − ${o2} = ${o1-o2}. Tens: borrow 1 hundred to make ${t1+10} tens. ${t1+10} − ${t2} = ${t1+10-t2}. Hundreds: ${h1-1} − ${h2} = ${h1-1-h2}. Answer: ${ans}.`
  });
}

// 8. col_sub_borrow_two (World 7, Type Q8)
for (let i = 1; i <= 10; i++) {
  let top, bot, h1, t1, o1, h2, t2, o2;
  do {
    h1 = rand(3, 9); t1 = rand(1, 8); o1 = rand(0, 4);
    h2 = rand(1, h1 - 1); t2 = rand(t1, 9); o2 = rand(5, 9);
    top = h1 * 100 + t1 * 10 + o1;
    bot = h2 * 100 + t2 * 10 + o2;
  } while (top - bot <= 0 || o1 >= o2 || (t1 - 1) >= t2 || (h1 - 1) < h2);

  const ans = top - bot;
  const topDec = decompose(top);
  const botDec = decompose(bot);
  const ansDec = decompose(ans);

  addQ({
    id: `Q8_${String(i).padStart(3, '0')}`,
    type: 'col_sub_borrow_two',
    world: 7,
    difficulty: i <= 2 ? 1 : i <= 6 ? 2 : 3,
    topNumber: top,
    bottomNumber: bot,
    operation: '-',
    answer: ans,
    topH: topDec.H, topT: topDec.T, topO: topDec.O,
    bottomH: botDec.H, bottomT: botDec.T, bottomO: botDec.O,
    answerH: ansDec.H, answerT: ansDec.T, answerO: ansDec.O,
    regroup_ones: true,
    regroup_tens: true,
    borrow_tens: true,
    borrow_hundreds: true,
    questionText: `${top} − ${bot} = ?`,
    visual: 'column',
    options: generateOptions(ans, false, true, true),
    correctAnswer: ans,
    hint1: `This problem requires borrowing from tens first, and then from hundreds!`,
    hint2: `Ones borrow from tens: ones become ${o1+10}, tens become ${t1-1}. Then tens need to borrow from hundreds: tens become ${t1-1+10}, hundreds become ${h1-1}.`,
    explanation: `Ones: borrow from tens, ${o1+10} − ${o2} = ${o1+10-o2}. Tens: left with ${t1-1}, borrow from hundreds to get ${t1-1+10} tens, ${t1-1+10} − ${t2} = ${t1-1+10-t2}. Hundreds: left with ${h1-1}, ${h1-1} − ${h2} = ${h1-1-h2}. Answer: ${ans}.`
  });
}

// 9. word_add (World 8, Type Q9)
for (let i = 1; i <= 10; i++) {
  let top, bot, h1, t1, o1, h2, t2, o2;
  do {
    h1 = rand(1, 4); t1 = rand(0, 8); o1 = rand(0, 9);
    h2 = rand(1, 4); t2 = rand(0, 8); o2 = rand(0, 9);
    top = h1 * 100 + t1 * 10 + o1;
    bot = h2 * 100 + t2 * 10 + o2;
  } while (top + bot > 999);

  const ans = top + bot;
  const topDec = decompose(top);
  const botDec = decompose(bot);
  const ansDec = decompose(ans);

  const charName = NAMES[(i - 1) % NAMES.length];
  const objName = OBJECTS[(i - 1) % OBJECTS.length];
  const setting = SETTINGS[(i - 1) % SETTINGS.length];
  
  let scenario = '';
  if (i % 2 === 1) {
    scenario = `${charName} has ${top} ${objName}. He buys another ${bot} ${objName} at the ${setting}. How many ${objName} does he have altogether?`;
  } else {
    scenario = `There are ${top} ${objName} in the ${setting}. ${charName} adds ${bot} more ${objName}. How many ${objName} are there in total?`;
  }

  const regroup_ones = (o1 + o2) >= 10;
  const regroup_tens = (t1 + t2 + (regroup_ones ? 1 : 0)) >= 10;

  addQ({
    id: `Q9_${String(i).padStart(3, '0')}`,
    type: 'word_add',
    world: 8,
    difficulty: i <= 4 ? 1 : i <= 7 ? 2 : 3,
    topNumber: top,
    bottomNumber: bot,
    operation: '+',
    answer: ans,
    topH: topDec.H, topT: topDec.T, topO: topDec.O,
    bottomH: botDec.H, bottomT: botDec.T, bottomO: botDec.O,
    answerH: ansDec.H, answerT: ansDec.T, answerO: ansDec.O,
    regroup_ones,
    regroup_tens,
    questionText: scenario,
    visual: 'word_problem',
    options: generateOptions(ans, true, regroup_ones, regroup_tens),
    correctAnswer: ans,
    hint1: `This is an addition problem. You need to calculate: ${top} + ${bot}.`,
    hint2: `Set up the numbers in columns: ${top} + ${bot}. Add ones first, then tens, then hundreds.`,
    explanation: `${top} + ${bot} = ${ans}. Set up columns and add: Ones column sum is ${o1 + o2}, Tens column sum is ${t1 + t2 + (regroup_ones ? 1 : 0)}, Hundreds column sum is ${h1 + h2 + (regroup_tens ? 1 : 0)}. So, the total is ${ans} ${objName}.`
  });
}

// 10. word_sub (World 9, Type Q10)
for (let i = 1; i <= 10; i++) {
  let top, bot, h1, t1, o1, h2, t2, o2;
  do {
    h1 = rand(3, 9); t1 = rand(1, 9); o1 = rand(0, 9);
    h2 = rand(1, h1 - 1); t2 = rand(0, 9); o2 = rand(0, 9);
    top = h1 * 100 + t1 * 10 + o1;
    bot = h2 * 100 + t2 * 10 + o2;
  } while (top - bot <= 0);

  const ans = top - bot;
  const topDec = decompose(top);
  const botDec = decompose(bot);
  const ansDec = decompose(ans);

  const charName = NAMES[(i - 1) % NAMES.length];
  const objName = OBJECTS[(i - 1) % OBJECTS.length];
  const setting = SETTINGS[(i - 1) % SETTINGS.length];
  
  let scenario = '';
  if (i % 2 === 1) {
    scenario = `${charName} had ${top} ${objName}. She sold ${bot} ${objName} at the ${setting}. How many ${objName} does she have left?`;
  } else {
    scenario = `There were ${top} ${objName} in the ${setting}. ${charName} took away ${bot} of them. How many ${objName} are left now?`;
  }

  const regroup_ones = o1 < o2;
  const regroup_tens = (t1 - (regroup_ones ? 1 : 0)) < t2;

  addQ({
    id: `Q10_${String(i).padStart(3, '0')}`,
    type: 'word_sub',
    world: 9,
    difficulty: i <= 3 ? 1 : i <= 7 ? 2 : 3,
    topNumber: top,
    bottomNumber: bot,
    operation: '-',
    answer: ans,
    topH: topDec.H, topT: topDec.T, topO: topDec.O,
    bottomH: botDec.H, bottomT: botDec.T, bottomO: botDec.O,
    answerH: ansDec.H, answerT: ansDec.T, answerO: ansDec.O,
    regroup_ones,
    regroup_tens,
    questionText: scenario,
    visual: 'word_problem',
    options: generateOptions(ans, false, regroup_ones, regroup_tens),
    correctAnswer: ans,
    hint1: `This is a subtraction problem. You need to calculate: ${top} − ${bot}.`,
    hint2: `Set up the numbers in columns: ${top} − ${bot}. Start with the ones and borrow if needed.`,
    explanation: `${top} − ${bot} = ${ans}. Set up columns and subtract: ${top} − ${bot} = ${ans}. So, ${ans} ${objName} are left.`
  });
}

// Write the output to src/data/questionBank.js
const code = `// src/data/questionBank.js
// AUTO-GENERATED by generateQuestions.js — do not edit manually

const questionBank = ${JSON.stringify(questions, null, 2)};

export default questionBank;
`;

fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'questionBank.js'), code);
console.log('Successfully generated 100 questions in src/data/questionBank.js!');
