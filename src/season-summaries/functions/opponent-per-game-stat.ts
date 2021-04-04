import { generatePerGameStatsByTableId } from './per-game-stats';
export const generateOpponentPerGameStats = (html: string) => generatePerGameStatsByTableId(html, 'opponent-stats-per_game');

