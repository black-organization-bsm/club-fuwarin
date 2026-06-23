import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { makeId, repository } from './repository';
import { Expense, Game } from './types';

type SpendingContextValue = {
  ready: boolean;
  games: Game[];
  expenses: Expense[];
  addGame: (input: { name: string; emoji: string }) => Promise<Game>;
  addExpense: (input: { gameId: string; amount: number; memo?: string; spentAt?: string }) => Promise<Expense>;
  removeExpense: (id: string) => Promise<void>;
  removeGame: (id: string) => Promise<void>;
};

const SpendingContext = createContext<SpendingContextValue | null>(null);

export function SpendingProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [g, e] = await Promise.all([repository.getGames(), repository.getExpenses()]);
      if (!mounted) return;
      setGames(g);
      setExpenses(e);
      setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 함수형 업데이터로 최신 state를 읽어 갱신하고, 계산된 next를 그대로 영속화한다.
  // (closure에 잡힌 stale 배열로 인한 빠른 연속 추가 시 레코드 유실 방지)
  const persistGames = useCallback(async (updater: (prev: Game[]) => Game[]) => {
    let next: Game[] = [];
    setGames((prev) => (next = updater(prev)));
    try {
      await repository.saveGames(next);
    } catch {
      Alert.alert('저장 실패', '게임 정보를 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
    return next;
  }, []);

  const persistExpenses = useCallback(async (updater: (prev: Expense[]) => Expense[]) => {
    let next: Expense[] = [];
    setExpenses((prev) => (next = updater(prev)));
    try {
      await repository.saveExpenses(next);
    } catch {
      Alert.alert('저장 실패', '지출 기록을 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
    return next;
  }, []);

  const addGame = useCallback(
    async ({ name, emoji }: { name: string; emoji: string }) => {
      const game: Game = { id: makeId(), name: name.trim(), emoji, createdAt: new Date().toISOString() };
      await persistGames((prev) => [...prev, game]);
      return game;
    },
    [persistGames],
  );

  const addExpense = useCallback(
    async ({ gameId, amount, memo, spentAt }: { gameId: string; amount: number; memo?: string; spentAt?: string }) => {
      const expense: Expense = {
        id: makeId(),
        gameId,
        amount: Math.max(0, Math.floor(amount)),
        memo: memo?.trim() || undefined,
        spentAt: spentAt ?? new Date().toISOString(),
      };
      await persistExpenses((prev) => [...prev, expense]);
      return expense;
    },
    [persistExpenses],
  );

  const removeExpense = useCallback(
    async (id: string) => {
      await persistExpenses((prev) => prev.filter((e) => e.id !== id));
    },
    [persistExpenses],
  );

  const removeGame = useCallback(
    async (id: string) => {
      await persistGames((prev) => prev.filter((g) => g.id !== id));
      await persistExpenses((prev) => prev.filter((e) => e.gameId !== id));
    },
    [persistGames, persistExpenses],
  );

  const value = useMemo<SpendingContextValue>(
    () => ({ ready, games, expenses, addGame, addExpense, removeExpense, removeGame }),
    [ready, games, expenses, addGame, addExpense, removeExpense, removeGame],
  );

  return <SpendingContext value={value}>{children}</SpendingContext>;
}

export function useSpending(): SpendingContextValue {
  const ctx = use(SpendingContext);
  if (!ctx) throw new Error('useSpending must be used within SpendingProvider');
  return ctx;
}
