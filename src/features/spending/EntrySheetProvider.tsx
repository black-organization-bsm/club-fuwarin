import { createContext, use, useCallback, useMemo, useState } from 'react';

import { EntrySheet, type EntryValues } from '@/components/entry-sheet';
import { PaymentInterventionOverlay } from '@/components/payment-intervention-overlay';
import { monthSpent } from './aggregate';
import { useSpending } from './SpendingProvider';
import type { Expense } from './types';

type EntrySheetContextValue = {
  /** 빈 폼으로 직접 기록 시트 열기 (특정 게임을 미리 고를 수도 있음) */
  openNew: (gameId?: string) => void;
  /** 기존 내역을 수정 시트로 열기 */
  openEdit: (expense: Expense) => void;
  /** 결제 감지 개입 오버레이 미리보기 열기 */
  openDetection: () => void;
};

const EntrySheetContext = createContext<EntrySheetContextValue | null>(null);

type SheetState =
  | { open: false }
  | { open: true; mode: 'new'; initial: EntryValues }
  | { open: true; mode: 'edit'; editingId: string; initial: EntryValues };

/** 감지 데모용 고정 샘플 (디자인의 니케 ₩30,000 · 유료 10연) */
const DETECTION_SAMPLE = { amount: 30000, memo: '유료 10연' };

/**
 * 직접 기록 시트 / 결제 감지 오버레이 / FAB를 한곳에서 관리하는 호스트.
 * 탭 셸을 감싸 어느 탭에서든 동일한 시트를 띄운다.
 */
export function EntrySheetProvider({ children }: { children: React.ReactNode }) {
  const { games, expenses, addExpense, updateExpense, removeExpense } = useSpending();

  const [sheet, setSheet] = useState<SheetState>({ open: false });
  const [detection, setDetection] = useState<{ open: boolean; gameId: string }>({ open: false, gameId: '' });
  const [busy, setBusy] = useState(false);
  // 열 때마다 1씩 증가시켜 EntrySheet의 key로 쓴다 → 매 오픈마다 폼이 새로 초기화됨.
  const [seq, setSeq] = useState(0);

  const openNew = useCallback(
    (gameId?: string) => {
      setSeq((n) => n + 1);
      setSheet({ open: true, mode: 'new', initial: { gameId: gameId ?? games[0]?.id ?? '', amount: 0, memo: '' } });
    },
    [games],
  );

  const openEdit = useCallback((expense: Expense) => {
    setSeq((n) => n + 1);
    setSheet({
      open: true,
      mode: 'edit',
      editingId: expense.id,
      initial: { gameId: expense.gameId, amount: expense.amount, memo: expense.memo ?? '' },
    });
  }, []);

  const openDetection = useCallback(() => {
    // 두 번째 게임(시드 기준 니케)을 기본 감지 대상으로, 없으면 첫 게임.
    const target = games[1]?.id ?? games[0]?.id ?? '';
    setDetection({ open: true, gameId: target });
  }, [games]);

  const closeSheet = useCallback(() => setSheet({ open: false }), []);

  const handleSave = useCallback(
    async (values: EntryValues) => {
      if (sheet.open && sheet.mode === 'edit') {
        await updateExpense(sheet.editingId, { gameId: values.gameId, amount: values.amount, memo: values.memo });
      } else {
        await addExpense({ ...values, source: 'manual' });
      }
      closeSheet();
    },
    [sheet, addExpense, updateExpense, closeSheet],
  );

  const handleDelete = useCallback(async () => {
    if (sheet.open && sheet.mode === 'edit') {
      await removeExpense(sheet.editingId);
    }
    closeSheet();
  }, [sheet, removeExpense, closeSheet]);

  const confirmDetection = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      await addExpense({ gameId: detection.gameId, ...DETECTION_SAMPLE, source: 'auto' });
      setDetection({ open: false, gameId: '' });
    } finally {
      setBusy(false);
    }
  }, [busy, addExpense, detection.gameId]);

  const value = useMemo<EntrySheetContextValue>(
    () => ({ openNew, openEdit, openDetection }),
    [openNew, openEdit, openDetection],
  );

  const detectionGameName = games.find((g) => g.id === detection.gameId)?.name ?? '게임';
  const monthAfter = monthSpent(expenses) + DETECTION_SAMPLE.amount;

  return (
    <EntrySheetContext value={value}>
      {children}

      <EntrySheet
        key={seq}
        visible={sheet.open}
        mode={sheet.open ? sheet.mode : 'new'}
        games={games}
        initial={sheet.open ? sheet.initial : { gameId: '', amount: 0, memo: '' }}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={closeSheet}
      />

      <PaymentInterventionOverlay
        visible={detection.open}
        gameName={detectionGameName}
        amount={DETECTION_SAMPLE.amount}
        monthTotalAfter={monthAfter}
        confirming={busy}
        onConfirm={confirmDetection}
        onClose={() => setDetection({ open: false, gameId: '' })}
      />
    </EntrySheetContext>
  );
}

export function useEntrySheet(): EntrySheetContextValue {
  const ctx = use(EntrySheetContext);
  if (!ctx) throw new Error('useEntrySheet must be used within EntrySheetProvider');
  return ctx;
}
