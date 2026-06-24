/**
 * 디자인 프로토타입에서 쓰인 라인 아이콘들 (lucide 계열)을
 * react-native-svg Path로 옮긴 모음. 모두 stroke 기반(채움 없음).
 */
import Svg, { Path, type SvgProps } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
  /** 선 두께 (기본 1.8) */
  width?: number;
} & SvgProps;

/** stroke 아이콘 공통 래퍼 */
function Icon({ size = 22, color = 'currentColor', width = 1.8, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}>
      {children}
    </Svg>
  );
}

/** 홈 (집) */
export function HomeIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <Path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Path d="M9 21V12h6v9" />
    </Icon>
  );
}

/** 내역 (목록) */
export function ListIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <Path d="M8 6h12" />
      <Path d="M8 12h12" />
      <Path d="M8 18h12" />
      <Path d="M3.5 6h.01" />
      <Path d="M3.5 12h.01" />
      <Path d="M3.5 18h.01" />
    </Icon>
  );
}

/** 그래프 (막대 차트) */
export function ChartIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <Path d="M3 3v18h18" />
      <Path d="M18 17V8" />
      <Path d="M13 17V5" />
      <Path d="M8 17v-4" />
    </Icon>
  );
}

/** 환산 (좌우 화살표) */
export function ConvertIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <Path d="m17 2 4 4-4 4" />
      <Path d="M21 6H7" />
      <Path d="m7 22-4-4 4-4" />
      <Path d="M3 18h14" />
    </Icon>
  );
}

/** 알림 종 (결제 감지 트리거) */
export function BellIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Icon>
  );
}

/** 오른쪽 셰브론 */
export function ChevronIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <Path d="m9 6 6 6-6 6" />
    </Icon>
  );
}

/** 더하기 (FAB) */
export function PlusIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <Path d="M12 5v14" />
      <Path d="M5 12h14" />
    </Icon>
  );
}
