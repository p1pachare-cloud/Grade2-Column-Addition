// src/utils/scoring.js

export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}

export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 5) return 1;
  return 0;
}

export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 5;
}

export function getTotalStars(worldScores) {
  return worldScores.reduce((sum, ws) => sum + calcStars(ws || 0), 0);
}

export function getWorldName(index) {
  const names = [
    'Sunny Market',
    'Biscuit Factory',
    'Hawker Centre',
    'Library Tower',
    'MRT Station',
    'Science Garden',
    'Community Park',
    'Sports Hall',
    'Marina Bay',
    'Number Palace',
  ];
  return names[index] || `World ${index + 1}`;
}

export function getWorldEmoji(index) {
  const emojis = ['🌅','🏭','🍜','📚','🚇','🌿','🌳','⚽','🌆','🏛️'];
  return emojis[index] || '🌟';
}
