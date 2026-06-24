/** 1234567 -> "1,234,567" */
export function formatNumber(amount: number): string {
  return Math.floor(amount).toLocaleString('ko-KR');
}

/** 1234567 -> "1,234,567원" */
export function formatWon(amount: number): string {
  return `${formatNumber(amount)}원`;
}

/** 1234567 -> "₩1,234,567" (디자인의 통화 표기) */
export function formatKRW(amount: number): string {
  return `₩${formatNumber(amount)}`;
}

/** ISO -> "6월 23일" */
export function formatDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
