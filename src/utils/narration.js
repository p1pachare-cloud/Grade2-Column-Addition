// src/utils/narration.js
// Phase narration scripts — text must exactly match UI component text (strict parity)
// CONTENT POLICY: Only paragraphs and questions narrated — NEVER titles/headings

import { say, ask, cheer, emphasize, think, instruct, encourage } from './audio.js';

// ─── Phase 1 — Wonder ────────────────────────────────────────────
export function wonderNarration() {
  return [
    ask("Are you ready for a counting adventure with big numbers?"),
    say("Today we will learn how to add and subtract numbers all the way up to one thousand!"),
    ask("A baker baked three hundred and forty-seven muffins. She sold one hundred and eighty-five. How many are still in the shop?"),
    emphasize("That is a BIG number challenge! Can you crack the column code?"),
  ];
}

// ─── Phase 2 — Story panels ──────────────────────────────────────
export function storyPanel1Narration() {
  return [
    say("Mei Ling has two hundred and thirty-four books. Mike has one hundred and fifty-eight books."),
  ];
}

export function storyPanel2Narration() {
  return [
    ask("How many books do they have altogether? Let's use the column method to find out!"),
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
    say("Finally the hundreds. Two plus one equals three hundred. Two hundred and thirty-four plus one hundred and fifty-eight equals three hundred and ninety-two. Amazing!"),
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
    instruct("Let us build the numbers using base-ten blocks first. Drag the hundreds flats, tens rods, and ones cubes into the correct columns."),
  ];
}

export function simulateStation2Intro() {
  return [
    instruct("Now let us add the columns one at a time. Start with the ones! The ones add up to more than nine. Time to regroup! Press the regroup button."),
  ];
}

export function simulateStation3Intro() {
  return [
    instruct("Well done! Now let us try subtraction. When the top digit is smaller, we need to borrow. Press borrow to take one ten from the tens column. It breaks into ten ones!"),
  ];
}

// ─── Phase 4 — Practice feedback ─────────────────────────────────
export function correctNarration() {
  return [cheer("Brilliant! Your column method is perfect!")];
}

export function incorrectNarration() {
  return [encourage("Hmm, not quite! Let us check our columns again.")];
}

export function hint1Narration() {
  return [think("Remember, always add the ones first, then the tens, then the hundreds.")];
}

// ─── Phase 5 — Reflect ───────────────────────────────────────────
export function reflectQuestionNarration() {
  return [
    cheer("You have done something incredible today. You learned to add and subtract hundreds!"),
    ask("Can you explain to LearnFlow how regrouping works in your own words?"),
  ];
}
