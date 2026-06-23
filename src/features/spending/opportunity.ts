import { OppCostItem } from './types';

/**
 * 기회비용 환산 기준값. 편집 가능한 상수.
 * 추후 사용자 설정으로 노출할 수 있도록 단일 배열로 관리.
 */
export const OPP_COST_ITEMS: readonly OppCostItem[] = [
  { key: 'chicken', label: '치킨', emoji: '🍗', unitPrice: 20000, unit: '마리' },
  { key: 'starbucks', label: '스타벅스', emoji: '☕️', unitPrice: 4500, unit: '잔' },
  { key: 'movie', label: '영화', emoji: '🎬', unitPrice: 14000, unit: '편' },
  { key: 'taxi', label: '택시', emoji: '🚕', unitPrice: 4800, unit: '번' },
  { key: 'transit', label: '버스/지하철', emoji: '🚇', unitPrice: 1500, unit: '번' },
] as const;

export type OppCostResult = OppCostItem & { count: number };

/** 금액을 각 기회비용 항목 개수로 환산 (내림) */
export function convert(amount: number): OppCostResult[] {
  const safe = Math.max(0, Math.floor(amount));
  return OPP_COST_ITEMS.map((item) => ({
    ...item,
    count: Math.floor(safe / item.unitPrice),
  }));
}

/** 결제 개입 문구용: 가장 체감되는 단일 환산 (개수가 1 이상인 첫 항목, 없으면 치킨) */
export function headlineConvert(amount: number): OppCostResult {
  const results = convert(amount);
  return results.find((r) => r.count >= 1) ?? results[0];
}
