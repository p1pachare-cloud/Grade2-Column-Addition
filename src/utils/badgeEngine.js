// src/utils/badgeEngine.js

export const BADGES = [
  {
    id: 'place_value_pioneer',
    label: '🏅 Column Pioneer',
    description: 'Complete Wonder and Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'block_builder',
    label: '🥈 Concrete Builder',
    description: 'Complete all 3 simulation stations',
    condition: (s) => s.simStationsComplete.every(Boolean),
  },
  {
    id: 'hundreds_hero',
    label: '🥇 Column King',
    description: 'Score 80%+ on Play phase',
    condition: (s) => {
      const answered = s.worldScores.filter(ws => ws !== null);
      if (answered.length < 5) return false;
      const total = s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
      const maxPossible = answered.length * 10;
      return maxPossible > 0 && (total / maxPossible) >= 0.8;
    },
  },
  {
    id: 'perfect_hundreds',
    label: '💎 Perfect Columns',
    description: 'Score 10/10 in any single world',
    condition: (s) => s.worldScores.some(ws => ws === 10),
  },
  {
    id: 'streak_legend',
    label: '🔥 Streak Legend',
    description: 'Achieve a 10-answer streak',
    condition: (s) => (s.maxStreak || 0) >= 10,
  },
  {
    id: 'number_word_wizard',
    label: '🔢 Word Problem Wizard',
    description: 'Correctly answer 5 word problems',
    condition: (s) => (s.wordFormCorrect || 0) >= 5,
  },
  {
    id: 'pattern_spotter',
    label: '📊 Borrow Master',
    description: 'Correctly answer 5 borrowing questions',
    condition: (s) => (s.patternCorrect || 0) >= 5, // Requires 5 borrowing questions correct
  },
  {
    id: 'full_journey',
    label: '🌟 Full Journey',
    description: 'Complete all 5 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
];

export function checkBadges(state) {
  return BADGES
    .filter(b => !state.badges.includes(b.id) && b.condition(state))
    .map(b => b.id);
}

export function getBadgeById(id) {
  return BADGES.find(b => b.id === id);
}
