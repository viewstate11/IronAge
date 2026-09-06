import "./ProfileFeature.css";

type Props = {
  title: string;
  subtitle?: string;
  onBack: () => void;
};

export default function ProfileFeature({
  title,
  subtitle,
  onBack,
}: Props) {
  return (
    <main className="profile-feature">
      <div className="profile-feature__shell">
        <header className="profile-feature__header">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
          >
            ←
          </button>

          <div>
            <span>IRONAGE</span>
            <h1>{title}</h1>
          </div>
        </header>

        <section className="profile-feature__card">
          <div className="profile-feature__mark">
            IA
          </div>

          <span className="profile-feature__eyebrow">
            IRONAGE SYSTEM
          </span>

          <h2>{title}</h2>

          <p>
            {subtitle ||
              "This IRONAGE module is being connected to the platform."}
          </p>

          <div className="profile-feature__status">
            <span>STATUS</span>
            <strong>IN DEVELOPMENT</strong>
          </div>

          <button
            type="button"
            className="profile-feature__back"
            onClick={onBack}
          >
            <span>BACK TO PROFILE</span>
            <b>→</b>
          </button>
        </section>
      </div>
    </main>
  );
}
