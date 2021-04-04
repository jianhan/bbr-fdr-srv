import { generatePerGameStatsByTableId } from './per-game-stats';
export const generateTeamStats = (html: string) => generatePerGameStatsByTableId(html, 'team-stats-base');
