/** 클럽 말랑말랑 — 도메인 타입 */

/** 사용자가 등록한 가챠 게임 */
export type Game = {
  id: string;
  name: string;
  /** 카드에 표시할 이모지 */
  emoji: string;
  /** ISO 문자열 */
  createdAt: string;
};

/** 한 건의 지출 기록 */
export type Expense = {
  id: string;
  gameId: string;
  /** 원(KRW), 양의 정수 */
  amount: number;
  memo?: string;
  /** 지출 일자 ISO 문자열 */
  spentAt: string;
};

/** 기회비용 환산 기준 항목 */
export type OppCostItem = {
  key: string;
  label: string;
  emoji: string;
  /** 1개당 가격(원) */
  unitPrice: number;
  /** 세는 단위 (마리/잔/편...) */
  unit: string;
};
