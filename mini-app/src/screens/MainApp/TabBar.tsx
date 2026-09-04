import type { ReactNode } from "react";
import "./TabBar.css";

import {
  useLanguage,
} from "../../context/LanguageContext";

export type Tab =
  | "home"
  | "workout"
  | "nutrition"
  | "progress"
  | "profile"
  | "ai";

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

type TabItem = {
  id: Tab;
  label: string;
  icon: ReactNode;
};

const tabs: TabItem[] = [
  {
    id: "home",
    label: "tab.home",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V21h13V9.5" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
    ),
  },
  {
    id: "workout",
    label: "tab.workout",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9v6" />
        <path d="M3.5 10.5v3" />
        <path d="M18 9v6" />
        <path d="M20.5 10.5v3" />
        <path d="M6 12h12" />
        <path d="M8 7v10" />
        <path d="M16 7v10" />
      </svg>
    ),
  },
  {
    id: "nutrition",
    label: "tab.nutrition",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21C7 18.5 4 14.5 4 9.5 8.5 9 11 11 12 14c1-3 3.5-5 8-4.5 0 5-3 9-8 11.5Z" />
        <path d="M12 14c0-4 1.5-6.5 4-8" />
      </svg>
    ),
  },
  {
    id: "progress",
    label: "tab.progress",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 4-4 3 2 5-6" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "tab.profile",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21c.7-4 3-6 7-6s6.3 2 7 6" />
      </svg>
    ),
  },
  {
    id: "ai",
    label: "tab.ai",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="m5.6 5.6 2.8 2.8" />
        <path d="m15.6 15.6 2.8 2.8" />
        <path d="m18.4 5.6-2.8 2.8" />
        <path d="m8.4 15.6-2.8 2.8" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    ),
  },
];

export default function TabBar({
  active,
  onChange,
}: Props) {
  const { t } = useLanguage();

  return (
    <nav
      className="ironage-tabbar"
      aria-label={t("tab.navigation")}
    >
      <div className="ironage-tabbar__inner">
        {tabs.map((tab) => {
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              className={`ironage-tab ${
                isActive
                  ? "ironage-tab--active"
                  : ""
              }`}
              onClick={() => onChange(tab.id)}
              aria-current={
                isActive
                  ? "page"
                  : undefined
              }
            >
              <span className="ironage-tab__icon">
                {tab.icon}
              </span>

              <span className="ironage-tab__label">
                {t(tab.label)}
              </span>

              <span className="ironage-tab__indicator" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
