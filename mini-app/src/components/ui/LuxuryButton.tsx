import React from "react";
import "./luxuryButton.css";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function LuxuryButton({
  children,
  onClick,
  active = false,
  icon,
  className = "",
  disabled = false,
}: Props) {
  return (
    <button
      type="button"
      className={[
        "luxury-button",
        active ? "luxury-button--active" : "",
        disabled ? "luxury-button--disabled" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <span className="luxury-button__icon">
          {icon}
        </span>
      )}

      <span className="luxury-button__label">
        {children}
      </span>
    </button>
  );
}