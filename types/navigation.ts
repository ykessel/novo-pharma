import type { LucideIcon } from 'lucide-react-native';

export interface TabItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

export interface FloatingTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
  onTabLongPress?: (key: string) => void;
}
