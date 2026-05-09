import React from 'react';
import { SvgProps } from 'react-native-svg';

// ── Import all custom SVGs ────────────────────────────────────────────────────
import Apple from '../../assets/icons/apple.svg';
import ArrowRight from '../../assets/icons/arrowRight.svg';
import ArrowUpRight from '../../assets/icons/arrowUpRight.svg';
import Award from '../../assets/icons/award.svg';
import Back from '../../assets/icons/back.svg';
import Bell from '../../assets/icons/bell.svg';
import Book from '../../assets/icons/book.svg';
import Brain from '../../assets/icons/brain.svg';
import Calendar from '../../assets/icons/calendar.svg';
import Chart from '../../assets/icons/chart.svg';
import Check from '../../assets/icons/check.svg';
import ChevronDown from '../../assets/icons/chevronDown.svg';
import ChevronRight from '../../assets/icons/chevronRight.svg';
import ChevronUp from '../../assets/icons/chevronUp.svg';
import Circle from '../../assets/icons/circle.svg';
import Clock from '../../assets/icons/clock.svg';
import Close from '../../assets/icons/close.svg';
import Cloud from '../../assets/icons/cloud.svg';
import CloudOff from '../../assets/icons/cloudOff.svg';
import Coffee from '../../assets/icons/coffee.svg';
import Download from '../../assets/icons/download.svg';
import Droplet from '../../assets/icons/droplet.svg';
import Dumbbell from '../../assets/icons/dumbbell.svg';
import Edit from '../../assets/icons/edit.svg';
import Eye from '../../assets/icons/eye.svg';
import EyeOff from '../../assets/icons/eyeOff.svg';
import Filter from '../../assets/icons/filter.svg';
import Flag from '../../assets/icons/flag.svg';
import Flame from '../../assets/icons/flame.svg';
import Globe from '../../assets/icons/globe.svg';
import Google from '../../assets/icons/google.svg';
import Help from '../../assets/icons/help.svg';
import Home from '../../assets/icons/home.svg';
import Inbox from '../../assets/icons/inbox.svg';
import List from '../../assets/icons/list.svg';
import Lock from '../../assets/icons/lock.svg';
import Logout from '../../assets/icons/logout.svg';
import Mail from '../../assets/icons/mail.svg';
import Menu from '../../assets/icons/menu.svg';
import Moon from '../../assets/icons/moon.svg';
import More from '../../assets/icons/more.svg';
import Paint from '../../assets/icons/paint.svg';
import Plus from '../../assets/icons/plus.svg';
import Refresh from '../../assets/icons/refresh.svg';
import Repeat from '../../assets/icons/repeat.svg';
import Search from '../../assets/icons/search.svg';
import Settings from '../../assets/icons/settings.svg';
import Shield from '../../assets/icons/shield.svg';
import Star from '../../assets/icons/star.svg';
import Sun from '../../assets/icons/sun.svg';
import Tag from '../../assets/icons/tag.svg';
import Target from '../../assets/icons/target.svg';
import Trash from '../../assets/icons/trash.svg';
import TrendUp from '../../assets/icons/trendUp.svg';
import User from '../../assets/icons/user.svg';
import Wifi from '../../assets/icons/wifi.svg';
import WifiOff from '../../assets/icons/wifiOff.svg';
import Zap from '../../assets/icons/zap.svg';

// ── Icon name → component map ────────────────────────────────────────────────
const ICON_MAP = {
  apple: Apple,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  award: Award,
  back: Back,
  bell: Bell,
  book: Book,
  brain: Brain,
  calendar: Calendar,
  chart: Chart,
  check: Check,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  circle: Circle,
  clock: Clock,
  close: Close,
  cloud: Cloud,
  cloudOff: CloudOff,
  coffee: Coffee,
  download: Download,
  droplet: Droplet,
  dumbbell: Dumbbell,
  edit: Edit,
  eye: Eye,
  eyeOff: EyeOff,
  filter: Filter,
  flag: Flag,
  flame: Flame,
  globe: Globe,
  google: Google,
  help: Help,
  home: Home,
  inbox: Inbox,
  list: List,
  lock: Lock,
  logout: Logout,
  mail: Mail,
  menu: Menu,
  moon: Moon,
  more: More,
  paint: Paint,
  plus: Plus,
  refresh: Refresh,
  repeat: Repeat,
  search: Search,
  settings: Settings,
  shield: Shield,
  star: Star,
  sun: Sun,
  tag: Tag,
  target: Target,
  trash: Trash,
  trendUp: TrendUp,
  user: User,
  wifi: Wifi,
  wifiOff: WifiOff,
  zap: Zap,
} as const;

export type IconName = keyof typeof ICON_MAP;

export function isValidIconName(name: string): name is IconName {
  return name in ICON_MAP;
}

interface IconProps extends SvgProps {
  name: IconName;
  size?: number;
  color?: string;
}

/**
 * Renders a custom SVG icon from the assets/icons directory.
 * All icons are stroke-based and respect the `color` prop via currentColor.
 */
export function Icon({ name, size = 24, color = '#1C1C2E', style, ...rest }: IconProps) {
  const SvgComponent = ICON_MAP[name];
  if (!SvgComponent) return null;
  return (
    <SvgComponent
      width={size}
      height={size}
      stroke={color}
      color={color}
      style={style}
      {...rest}
    />
  );
}
