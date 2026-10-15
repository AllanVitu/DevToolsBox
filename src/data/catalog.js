import { TOOLS } from './tools';
import { LESSONS } from './lessons';
import { CHEATSHEETS } from './cheatsheets';

// Nouveautés de la version 3 (champ `added` dans les registres et le front matter).
export const NEW_TOOLS = TOOLS.filter((t) => t.added);
export const NEW_LESSONS = LESSONS.filter((l) => l.added);
export const NEW_SHEETS = CHEATSHEETS.filter((c) => c.added);

export const COUNTS = {
  tools: TOOLS.length,
  lessons: LESSONS.length,
  sheets: CHEATSHEETS.length,
};
