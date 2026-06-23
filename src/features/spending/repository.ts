import AsyncStorage from '@react-native-async-storage/async-storage';

import { Expense, Game } from './types';

const GAMES_KEY = 'cmm.games';
const EXPENSES_KEY = 'cmm.expenses';

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
};
