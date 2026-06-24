/**
 * 첫 실행용 시드 데이터.
 *
 * 디자인 프로토타입(클럽 말랑말랑.dc.html)의 화면을 그대로 재현하기 위한 데모
 * 데이터다. 저장소가 완전히 비어 있을 때(최초 1회)만 주입한다.
 *
 * 날짜는 "이번 달"에 고정되도록 실행 시점의 연·월을 기준으로 생성한다.
 * (오늘이 며칠이든 홈/내역의 "이번 달" 화면이 채워져 보이도록)
 */

import type { Expense, Game } from './types';

/** 시드 게임 — 고정 id를 써서 지출과 안정적으로 연결한다. */
export const SEED_GAMES: Game[] = [
  { id: 'ba', name: '블루 아카이브', emoji: '🔵', color: '#3f6fd1', createdAt: new Date().toISOString() },
  { id: 'nk', name: '니케', emoji: '🔴', color: '#cf4747', createdAt: new Date().toISOString() },
  { id: 'mk', name: '명조', emoji: '🟡', color: '#c2922f', createdAt: new Date().toISOString() },
];

/** 이번 달 D일 정오의 ISO 문자열 */
function thisMonthDay(day: number): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), day, 12, 0, 0).toISOString();
}

/** N개월 전 15일 정오의 ISO 문자열 (그래프 과거 막대용) */
function monthsAgoMid(monthsAgo: number): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - monthsAgo, 15, 12, 0, 0).toISOString();
}

/**
 * 이번 달 내역 9건 — 합계 ₩285,000.
 * (게임별: 블아 142,000 · 니케 89,000 · 명조 54,000 → 디자인과 일치)
 */
const CURRENT_MONTH: Omit<Expense, 'id'>[] = [
  { gameId: 'ba', amount: 30000, memo: '월간 패키지', source: 'auto', spentAt: thisMonthDay(21) },
  { gameId: 'nk', amount: 30000, memo: '유료 10연', source: 'auto', spentAt: thisMonthDay(21) },
  { gameId: 'mk', amount: 12000, memo: '월간 카드', source: 'manual', spentAt: thisMonthDay(18) },
  { gameId: 'ba', amount: 99000, memo: '천장 충전', source: 'auto', spentAt: thisMonthDay(15) },
  { gameId: 'mk', amount: 23000, memo: '보너스 충전', source: 'auto', spentAt: thisMonthDay(13) },
  { gameId: 'nk', amount: 49000, memo: '보석 패키지', source: 'auto', spentAt: thisMonthDay(10) },
  { gameId: 'ba', amount: 13000, memo: '일일 패키지', source: 'manual', spentAt: thisMonthDay(8) },
  { gameId: 'mk', amount: 19000, memo: '배틀패스', source: 'auto', spentAt: thisMonthDay(5) },
  { gameId: 'nk', amount: 10000, memo: '코스튬', source: 'manual', spentAt: thisMonthDay(3) },
];

/**
 * 그래프(최근 6개월)용 과거 월 합계 — 디자인의 막대값(만원)을 재현.
 * 직전 달(168,000) 덕분에 홈의 "전월 대비 +70%" 뱃지도 성립한다.
 * (이번 달 화면들은 월 필터로 가려지므로 이 더미는 그래프에만 보인다)
 */
const PAST_MONTHS: { monthsAgo: number; gameId: string; amount: number }[] = [
  { monthsAgo: 5, gameId: 'ba', amount: 92000 }, // 1월
  { monthsAgo: 4, gameId: 'nk', amount: 128000 }, // 2월
  { monthsAgo: 3, gameId: 'mk', amount: 86000 }, // 3월
  { monthsAgo: 2, gameId: 'ba', amount: 205000 }, // 4월
  { monthsAgo: 1, gameId: 'nk', amount: 168000 }, // 5월
];

/** id를 채워 완성한 시드 지출 배열을 만든다. */
export function buildSeedExpenses(makeId: () => string): Expense[] {
  const current = CURRENT_MONTH.map((e) => ({ ...e, id: makeId() }));
  const past = PAST_MONTHS.map(({ monthsAgo, gameId, amount }) => ({
    id: makeId(),
    gameId,
    amount,
    memo: '이전 달 합계',
    source: 'auto' as const,
    spentAt: monthsAgoMid(monthsAgo),
  }));
  return [...current, ...past];
}
