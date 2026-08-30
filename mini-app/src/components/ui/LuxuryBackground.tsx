import "./LuxuryBackground.css";

import vasylPhoto from "../../assets/vasyl-ua.jpg";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function LuxuryBackground({
  children,
  className = "",
}: Props) {
  return (
    <div className={`luxury-background ${className}`}>
      <img
        src={vasylPhoto}
        className="luxury-background-image"
        alt=""
        aria-hidden="true"
      />

      <div className="luxury-background-overlay" />

      <div className="luxury-background-vignette" />

      <div className="luxury-background-content">
        {children}
      </div>
    </div>
  );
}