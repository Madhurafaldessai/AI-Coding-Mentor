export const hintCosts: Record<number, number> = { 1: 0, 2: 5, 3: 10, 4: 20 };
export const levelForXp = (xp: number) => Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
export const xpForLevel = (level: number) => level * level * 100;
export const completionXp = (baseXp: number, maxHint: number) => Math.max(10, baseXp + (maxHint <= 1 ? 20 : 0) - (hintCosts[maxHint] ?? 20));
