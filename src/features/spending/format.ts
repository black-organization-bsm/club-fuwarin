/** 1234567 -> "1,234,567" */
export function formatNumber(amount: number): string {
  return Math.floor(amount).toLocaleString('ko-KR');
}

/** 1234567 -> "1,234,567원" */
export function formatWon(amount: number): string {
  return `${formatNumber(amount)}원`;
}

/** ISO -> "6월 23일" */
export function formatDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
