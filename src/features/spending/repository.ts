import AsyncStorage from '@react-native-async-storage/async-storage';

import { buildSeedExpenses, SEED_GAMES } from './seed';
import { Expense, Game } from './types';

const GAMES_KEY = 'cmm.games';
const EXPENSES_KEY = 'cmm.expenses';
/** 시드를 이미 1회 주입했는지 표식 (사용자가 전부 지워도 재주입하지 않도록) */
const SEEDED_KEY = 'cmm.seeded';

async function readArray<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

async function writeArray<T>(key: string, value: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

/** 충돌 가능성이 낮은 간단한 ID 생성 (timestamp + 랜덤) */
export function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const repository = {
  async getGames(): Promise<Game[]> {
    return readArray<Game>(GAMES_KEY);
  },

  async getExpenses(): Promise<Expense[]> {
    return readArray<Expense>(EXPENSES_KEY);
  },

  async saveGames(games: Game[]): Promise<void> {
    await writeArray(GAMES_KEY, games);
  },

  async saveExpenses(expenses: Expense[]): Promise<void> {
    await writeArray(EXPENSES_KEY, expenses);
  },

  /**
   * 최초 실행이면 디자인 데모 데이터를 1회 주입한다.
   * 이미 시드했거나 데이터가 있으면 건드리지 않는다.
   * @returns 시드를 새로 주입했으면 그 데이터, 아니면 null
   */
  async seedIfFirstRun(): Promise<{ games: Game[]; expenses: Expense[] } | null> {
    const seeded = await AsyncStorage.getItem(SEEDED_KEY);
    if (seeded) return null;

    const [games, expenses] = await Promise.all([
      readArray<Game>(GAMES_KEY),
      readArray<Expense>(EXPENSES_KEY),
    ]);
    // 표식은 없지만 이전 버전에서 만든 데이터가 있으면 그대로 둔다.
    if (games.length > 0 || expenses.length > 0) {
      await AsyncStorage.setItem(SEEDED_KEY, '1');
      return null;
    }

    const seedGames = SEED_GAMES;
    const seedExpenses = buildSeedExpenses(makeId);
    await Promise.all([
      writeArray(GAMES_KEY, seedGames),
      writeArray(EXPENSES_KEY, seedExpenses),
      AsyncStorage.setItem(SEEDED_KEY, '1'),
    ]);
    return { games: seedGames, expenses: seedExpenses };
  },
};
