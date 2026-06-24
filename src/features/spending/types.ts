/** 클럽 말랑말랑 — 도메인 타입 */

/** 지출이 어떻게 기록됐는지 — Android 결제 알림 자동 감지 vs 직접 입력 */
export type ExpenseSource = 'auto' | 'manual';

/** 사용자가 등록한 가챠 게임 */
export type Game = {
  id: string;
  name: string;
  /** 카드에 표시할 이모지 */
  emoji: string;
  /** 게임 카드/세그먼트에 쓰는 대표 색 (#hex) */
  color: string;
  /** ISO 문자열 */
  createdAt: string;
};

/** 한 건의 지출 기록 */
export type Expense = {
  id: string;
  gameId: string;
  /** 원(KRW), 양의 정수 */
  amount: number;
  /** 항목명(예: "월간 패키지"). 디자인의 '항목' 필드. */
  memo?: string;
  /** 자동 감지 / 직접 기록. 미지정 시 'manual'로 간주. */
  source?: ExpenseSource;
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
