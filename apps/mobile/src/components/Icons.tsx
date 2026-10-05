/**
 * Theme-aware lucide icons.
 *
 * Icons take their colour as a prop rather than a style, so they need the same
 * palette mapping the Themed primitives apply. Screens import icons from here
 * instead of 'lucide-react-native' and every icon colour follows the theme.
 */
import * as Lucide from 'lucide-react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useThemedColor } from '@/components/Themed';

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  fill?: string;
  absoluteStrokeWidth?: boolean;
};

type LucideIcon = React.ComponentType<IconProps>;

function themedIcon(Icon: LucideIcon, name: string) {
  const Wrapped = ({ color, ...rest }: IconProps) => {
    const mapColor = useThemedColor();
    return <Icon {...rest} color={mapColor(color ?? '#000000')} />;
  };
  Wrapped.displayName = `ThemedIcon(${name})`;
  return Wrapped;
}

export const AlertTriangle = themedIcon(Lucide.AlertTriangle, 'AlertTriangle');
export const ArrowUp = themedIcon(Lucide.ArrowUp, 'ArrowUp');
export const BarChart3 = themedIcon(Lucide.BarChart3, 'BarChart3');
export const Bot = themedIcon(Lucide.Bot, 'Bot');
export const CalendarClock = themedIcon(Lucide.CalendarClock, 'CalendarClock');
export const Check = themedIcon(Lucide.Check, 'Check');
export const ChevronDown = themedIcon(Lucide.ChevronDown, 'ChevronDown');
export const ChevronLeft = themedIcon(Lucide.ChevronLeft, 'ChevronLeft');
export const ChevronRight = themedIcon(Lucide.ChevronRight, 'ChevronRight');
export const ChevronUp = themedIcon(Lucide.ChevronUp, 'ChevronUp');
export const CloudSun = themedIcon(Lucide.CloudSun, 'CloudSun');
export const Copy = themedIcon(Lucide.Copy, 'Copy');
export const ExternalLink = themedIcon(Lucide.ExternalLink, 'ExternalLink');
export const FileText = themedIcon(Lucide.FileText, 'FileText');
export const Globe = themedIcon(Lucide.Globe, 'Globe');
export const KeyRound = themedIcon(Lucide.KeyRound, 'KeyRound');
export const LayoutDashboard = themedIcon(Lucide.LayoutDashboard, 'LayoutDashboard');
export const LogOut = themedIcon(Lucide.LogOut, 'LogOut');
export const Minus = themedIcon(Lucide.Minus, 'Minus');
export const Monitor = themedIcon(Lucide.Monitor, 'Monitor');
export const Moon = themedIcon(Lucide.Moon, 'Moon');
export const Package = themedIcon(Lucide.Package, 'Package');
export const Pill = themedIcon(Lucide.Pill, 'Pill');
export const Plus = themedIcon(Lucide.Plus, 'Plus');
export const Receipt = themedIcon(Lucide.Receipt, 'Receipt');
export const RefreshCw = themedIcon(Lucide.RefreshCw, 'RefreshCw');
export const RotateCcw = themedIcon(Lucide.RotateCcw, 'RotateCcw');
export const Search = themedIcon(Lucide.Search, 'Search');
export const Settings = themedIcon(Lucide.Settings, 'Settings');
export const ShieldCheck = themedIcon(Lucide.ShieldCheck, 'ShieldCheck');
export const Sparkles = themedIcon(Lucide.Sparkles, 'Sparkles');
export const Sun = themedIcon(Lucide.Sun, 'Sun');
export const Trash2 = themedIcon(Lucide.Trash2, 'Trash2');
export const TriangleAlert = themedIcon(Lucide.TriangleAlert, 'TriangleAlert');
export const User = themedIcon(Lucide.User, 'User');
export const UserRound = themedIcon(Lucide.UserRound, 'UserRound');
export const Users = themedIcon(Lucide.Users, 'Users');
export const X = themedIcon(Lucide.X, 'X');
