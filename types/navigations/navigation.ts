import type { LucideIcon } from "lucide-react";

export interface NavigationChildItem {
  title: string;
  href: string;
}

export interface NavigationItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  children?: NavigationChildItem[];
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}
