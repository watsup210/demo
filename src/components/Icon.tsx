import {
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BusFront,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  Footprints,
  Heart,
  History,
  Leaf,
  MapPin,
  Menu,
  Navigation,
  Route,
  Search,
  Settings2,
  Sparkles,
  TramFront,
  UserRound,
  X,
  CarFront,
} from "lucide-react";
const icons = {
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BusFront,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  Footprints,
  Heart,
  History,
  Leaf,
  MapPin,
  Menu,
  Navigation,
  Route,
  Search,
  Settings2,
  Sparkles,
  TramFront,
  UserRound,
  X,
  CarFront,
};
export type IconName = keyof typeof icons;
export default function Icon({
  name,
  size = 20,
  ...props
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const Component = icons[name];
  return (
    <Component size={size} strokeWidth={1.8} aria-hidden="true" {...props} />
  );
}
