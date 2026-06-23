import { Expense, Game } from './types';

/** Date -> YYYY-MM 키 (로컬 기준). 모든 월키 포맷의 단일 출처. */
export function monthKeyFromDate(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}`;
}

/** ISO 문자열 -> YYYY-MM 키 (로컬 기준) */
export function monthKey(isoDate: string): string {
  return monthKeyFromDate(new Date(isoDate));
}

/** 현재 달의 YYYY-MM */
export function currentMonthKey(now: Date = new Date()): string {
  return monthKeyFromDate(now);
}

export function sum(expenses: Expense[]): number {
  return expenses.reduce((acc, e) => acc + e.amount, 0);
}

/** 이번 달 합계 */
export function monthSpent(expenses: Expense[], key = currentMonthKey()): number {
  return sum(expenses.filter((e) => monthKey(e.spentAt) === key));
}

/** 게임별 누적 합계 맵 (gameId -> 합계) */
export function spentByGame(expenses: Expense[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const e of expenses) {
    map[e.gameId] = (map[e.gameId] ?? 0) + e.amount;
  }
  return map;
}

export type MonthlyPoint = { key: string; label: string; total: number };

/** 최근 N개월(현재 포함) 월별 합계, 과거→현재 순 */
export function recentMonths(expenses: Expense[], count = 6, now: Date = new Date()): MonthlyPoint[] {
  const points: MonthlyPoint[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthKeyFromDate(d);
    points.push({
      key,
      label: `${d.getMonth() + 1}월`,
      total: sum(expenses.filter((e) => monthKey(e.spentAt) === key)),
    });
  }
  return points;
}

/** 게임 누적액 내림차순 정렬 */
export function gamesByTotal(games: Game[], expenses: Expense[]): { game: Game; total: number }[] {
  const totals = spentByGame(expenses);
  return games
    .map((game) => ({ game, total: totals[game.id] ?? 0 }))
    .sort((a, b) => b.total - a.total);
}
