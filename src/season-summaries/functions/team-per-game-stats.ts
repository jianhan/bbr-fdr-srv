import { generatePerGameStatsByTableId } from './per-game-stats';
export const generateTeamPerGameStats = (html: string) => generatePerGameStatsByTableId(html, 'team-stats-per_game');
