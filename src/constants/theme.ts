/**
 * 클럽 말랑말랑 — 다크 테마 디자인 토큰.
 *
 * 디자인 핸드오프(클럽 말랑말랑.dc.html)는 단일 다크 테마를 전제로 한다.
 * 따라서 light/dark를 토글하지 않고 둘 다 같은 다크 팔레트를 가리키게 해
 * (useTheme는 항상 dark 반환) 어디서 읽어도 동일한 색이 나오도록 고정한다.
 */

import '@/global.css';

import { Platform } from 'react-native';

/** 프로토타입에서 추출한 다크 표면/텍스트 토큰 */
const dark = {
  /** 화면 스크롤 영역 배경 (#1b1c20) */
  background: '#1b1c20',
  /** 카드/입력 표면 (#262830) */
  backgroundElement: '#262830',
  /** 선택/한 단계 밝은 표면 */
  backgroundSelected: '#2f313a',
  /** 본문 기본 텍스트 */
  text: '#eef0f4',
  /** 보조 텍스트(라벨) */
  textSecondary: '#9b9ea8',
  /** 3차 텍스트(메타·캡션) */
  textTertiary: '#7e818b',
  /** 카드 테두리 */
  border: '#33353e',
  /** 리스트 행 구분선 */
  divider: '#2c2e36',
  /** 상단 앱바 배경 */
  appBar: '#1f2025',
  /** 앱바 하단 경계선 */
  appBarBorder: '#2e3039',
  /** 하단 내비 배경 */
  bottomNav: '#15161a',
  /** 하단 내비 상단 경계선 */
  bottomNavBorder: '#2a2c34',
} as const;

/** light도 dark와 동일 객체를 가리켜 강제 다크 고정 */
export const Colors = {
  light: dark,
  dark,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** 클럽 말랑말랑 브랜드 톤 (다크 + 블루 액센트) */
export const Brand = {
  /** 주 액센트(버튼·활성 탭·FAB) */
  primary: '#4d8df7',
  /** 다크 표면 위 액센트 텍스트(살짝 밝게) */
  primaryText: '#6fa8f0',
  /** 액센트 soft 배경 (rgba로 표면 위에 은은하게) */
  primarySoft: 'rgba(77,141,247,0.12)',
  /** 액센트 soft 텍스트 */
  primarySoftText: '#cfe0fb',
  /** 경고/상승/삭제 계열 */
  danger: '#f0664d',
  /** 경고 텍스트(밝은 변형) */
  dangerText: '#ff8068',
  /** 카드 라운드 */
  cardRadius: 16,
  /** 바텀시트 라운드 */
  sheetRadius: 26,
  /** 알약/원형 */
  pillRadius: 999,
} as const;

/**
 * 게임별 색상 팔레트.
 * 시드 게임(블아·니케·명조)은 고정 색을 갖고, 사용자가 추가하는 게임은
 * 이 배열에서 순서대로 색을 배정한다(포스터 대신 색 카드로 표현).
 */
export const GAME_COLORS = [
  '#3f6fd1', // ba 블루
  '#cf4747', // nk 레드
  '#c2922f', // mk 골드
  '#3aa17e', // green
  '#8b5cf6', // violet
  '#d9789f', // pink
] as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** 커스텀 셸 치수 */
export const AppBarHeight = 52;
export const BottomNavHeight = 64;
/** FAB가 하단 내비 위로 떠 있을 여유 */
export const FabClearance = 88;

export const MaxContentWidth = 800;
