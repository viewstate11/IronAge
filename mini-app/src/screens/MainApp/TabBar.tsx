import "./TabBar.css";

type Tab =
  | "home"
  | "workout"
  | "nutrition"
  | "ai"
  | "progress"
  | "profile";

type Props = {
  active: string;
  change: (value: string) => void;
};

const tabs: {
  id: Tab;
  icon: string;
  label: string;
}[] = [
  {
    id: "home",
    icon: "🏠",
    label: "Головна",
  },
  {
    id: "workout",
    icon: "💪",
    label: "Тренування",
  },
  {
    id: "nutrition",
    icon: "🍽️",
    label: "Харчування",
  },
  {
    id: "ai",
    icon: "⚔️",
    label: "AI Trainer",
  },
  {
    id: "progress",
    icon: "📈",
    label: "Прогрес",
  },
  {
    id: "profile",
    icon: "👤",
    label: "Профіль",
  },
];

export default function TabBar({
  active,
  change,
}: Props) {
  return (
    <nav
      className="tab-bar"
      aria-label="Основна навігація"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tab-item ${
            active === tab.id
              ? "active"
              : ""
          }`}
          onClick={() => change(tab.id)}
          aria-label={tab.label}
          aria-current={
            active === tab.id
              ? "page"
              : undefined
          }
        >
          <span className="tab-icon">
            {tab.icon}
          </span>

          <span className="tab-label">
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
}