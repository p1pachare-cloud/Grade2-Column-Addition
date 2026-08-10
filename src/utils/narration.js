// src/utils/narration.js
// Phase narration scripts — text must exactly match UI component text (strict parity)
// CONTENT POLICY: Only paragraphs and questions narrated — NEVER titles/headings

import { say, ask, cheer, emphasize, think, instruct, encourage } from './audio.js';

// ─── Phase 1 — Wonder ────────────────────────────────────────────
export function wonderNarration() {
  return [
    ask("Are you ready for a counting adventure with Wei Ming?"),
    say("Today we will learn how to add and subtract numbers all the way up to one thousand!"),
    ask("Wei Ming baked three hundred and forty-seven muffins. He sold one hundred and eighty-five. How many are still in the shop?"),
    emphasize("That is a BIG number challenge! Can you crack the column code with Wei Ming?"),
  ];
}

// ─── Phase 2 — Story panels ──────────────────────────────────────
export function storyPanel1Narration() {
  return [
    say("Wei Ming has two hundred and thirty-four books. His friend has one hundred and fifty-eight books."),
  ];
}

export function storyPanel2Narration() {
  return [
    ask("How many books does Wei Ming have altogether? Let's use the column method to find out!"),
  ];
}

export function storyPanel3Narration() {
  return [
    instruct("First, we line up the numbers in columns. Hundreds under hundreds, Tens under tens, Ones under ones."),
  ];
}

export function storyPanel4Narration() {
  return [
    emphasize("We always start with the ones column first. Four ones plus eight ones equals twelve ones. That is more than nine!"),
  ];
}

export function storyPanel5Narration() {
  return [
    emphasize("When we have ten or more ones, we regroup! Ten ones become one ten. We write two in the ones column and carry one to the tens."),
  ];
}

export function storyPanel6Narration() {
  return [
    say("Now add the tens. One carried, plus three, plus five equals nine. Write nine in the tens column."),
  ];
}

export function storyPanel7Narration() {
  return [
    say("Finally the hundreds. Two plus one equals three hundred. Two hundred and thirty-four plus one hundred and fifty-eight equals three hundred and ninety-two. Amazing job, Wei Ming!"),
  ];
}

export const STORY_NARRATIONS = [
  storyPanel1Narration,
  storyPanel2Narration,
  storyPanel3Narration,
  storyPanel4Narration,
  storyPanel5Narration,
  storyPanel6Narration,
  storyPanel7Narration,
];

// ─── Phase 3 — Simulate stations ─────────────────────────────────
export function simulateStation1Intro() {
  return [
    instruct("Let us help Wei Ming build the numbers using base-ten blocks. Drag the hundreds flats, tens rods, and ones cubes into the correct columns."),
  ];
}

export function simulateStation2Intro() {
  return [
    instruct("Now let us add the columns one at a time. Start with the ones! The ones add up to more than nine. Time to regroup! Press the regroup button."),
  ];
}

export function simulateStation3Intro() {
  return [
    instruct("Well done! Now let us try subtraction with Wei Ming. When the top digit is smaller, we need to borrow. Press borrow to take one ten from the tens column!"),
  ];
}

// ─── Phase 4 — Practice feedback & Questions ─────────────────────
export function questionNarration(questionText) {
  if (!questionText) return [ask("Can you solve this question?")];
  return [ask(questionText)];
}

export function hintNarration(hintText) {
  if (!hintText) return [think("Remember, always add the ones first, then the tens, then the hundreds.")];
  return [think(hintText)];
}

export function correctNarration(msg) {
  return [cheer(msg || "Brilliant! Your column method is perfect!")];
}

export function incorrectNarration(msg) {
  return [encourage(msg || "Hmm, not quite! Let us check our columns again.")];
}

export function hint1Narration() {
  return [think("Remember, always add the ones first, then the tens, then the hundreds.")];
}

// ─── Phase 5 — Reflect ───────────────────────────────────────────
export function reflectQuestionNarration() {
  return [
    cheer("You and Wei Ming have done something incredible today. You learned to add and subtract hundreds!"),
    ask("Can you explain how regrouping works in your own words?"),
  ];
}
