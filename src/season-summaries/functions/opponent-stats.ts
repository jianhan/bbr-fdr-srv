import { generatePerGameStatsByTableId } from './per-game-stats';
export const opponentOpponentStats = (html: string) => generatePerGameStatsByTableId(html, 'opponent-stats-base');
