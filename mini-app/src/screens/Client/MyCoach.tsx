import {
  useEffect,
  useState,
} from "react";

import {
  api,
  telegramAuthOptions,
} from "../../api/client";

import { useLanguage } from "../../context/LanguageContext";

import "./MyCoach.css";

type CoachProfileData = {
  id: number;
  displayName: string;
  bio: string | null;
  specialization: string | null;
  photoUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
};

type CoachUser = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  coachProfile: CoachProfileData | null;
};

type MyCoachResponse = {
  success: boolean;
  coach: CoachUser | null;
  assignedAt: string | null;
};

type Props = {
  onBack: () => void;
  onFindCoach: () => void;
  onOpenProgram: () => void;
};

export default function MyCoach({
  onBack,
  onFindCoach,
  onOpenProgram,
}: Props) {
  const { language, t } = useLanguage();

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const [
    coach,
    setCoach,
  ] = useState<CoachUser | null>(
    null
  );

  const [
    assignedAt,
    setAssignedAt,
  ] = useState<string | null>(
    null
  );

  async function loadCoach() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.get<MyCoachResponse>(
          "/coaches/my-coach",
          telegramAuthOptions()
        );

      setCoach(
        response.coach ?? null
      );

      setAssignedAt(
        response.assignedAt ?? null
      );
    } catch (loadError) {
      console.error(
        "IRONAGE MY COACH LOAD ERROR:",
        loadError
      );

      setError(
        loadError instanceof Error
          ? loadError.message
          : t("myCoach.failedToLoad")
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCoach();
  }, []);

  const profile =
    coach?.coachProfile ??
    null;

  const displayName =
    profile?.displayName ||
    [
      coach?.firstName,
      coach?.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    t("myCoach.defaultCoach");

  const assignedDate =
    assignedAt
      ? new Date(
          assignedAt
        ).toLocaleDateString(
          {
            en: "en-GB",
            es: "es-ES",
            uk: "uk-UA",
            ru: "ru-RU",
            fr: "fr-FR",
            de: "de-DE",
            pt: "pt-PT",
            bg: "bg-BG",
          }[language]
        )
      : null;

  return (
    <main className="my-coach-page">
      <div className="my-coach-shell">
        <header className="my-coach-header">
          <button
            type="button"
            className="my-coach-back"
            onClick={onBack}
            aria-label={t("common.back")}
          >
            ←
          </button>

          <div>
            <span>
              {t("myCoach.coaching")}
            </span>

            <h1>
              {t("myCoach.title")}
            </h1>

            <p>
              {t("myCoach.subtitle")}
            </p>
          </div>
        </header>

        {loading && (
          <section className="my-coach-state">
            <strong>
              {t("myCoach.loading")}
            </strong>
          </section>
        )}

        {!loading &&
          error && (
            <section className="my-coach-state my-coach-state--error">
              <strong>
                {t("myCoach.loadError")}
              </strong>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadCoach()
                }
              >
                {t("common.retry")}
              </button>
            </section>
          )}

        {!loading &&
          !error &&
          !coach && (
            <>
              <section className="my-coach-empty">
                <div className="my-coach-empty__icon">
                  IA
                </div>

                <span>
                  {t("myCoach.noCoach")}
                </span>

                <h2>
                  {t("myCoach.findYourCoach")}
                </h2>

                <p>
                  {t("myCoach.emptyDescription")}
                </p>
              </section>

              <button
                type="button"
                className="my-coach-primary"
                onClick={
                  onFindCoach
                }
              >
                <span>
                  {t("myCoach.findCoach")}
                </span>

                <b>
                  →
                </b>
              </button>
            </>
          )}

        {!loading &&
          !error &&
          coach &&
          profile && (
            <>
              <section className="my-coach-card">
                <div className="my-coach-photo">
                  {profile.photoUrl ? (
                    <img
                      src={
                        profile.photoUrl
                      }
                      alt={
                        displayName
                      }
                    />
                  ) : (
                    <span>
                      {displayName
                        .slice(
                          0,
                          1
                        )
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="my-coach-info">
                  <span>
                    {t("myCoach.yourCoach")}
                  </span>

                  <div className="my-coach-name">
                    <h2>
                      {displayName}
                    </h2>

                    {profile.isVerified && (
                      <b>
                        ✓
                      </b>
                    )}
                  </div>

                  <p>
                    {profile.specialization ||
                      t("myCoach.defaultCoach")}
                  </p>
                </div>
              </section>

              {profile.bio && (
                <section className="my-coach-about">
                  <span>
                    {t("myCoach.about")}
                  </span>

                  <p>
                    {profile.bio}
                  </p>
                </section>
              )}

              <section className="my-coach-status">
                <div>
                  <span>
                    {t("myCoach.coachStatus")}
                  </span>

                  <strong>
                    {profile.isActive
                      ? t("myCoach.active")
                      : t("myCoach.inactive")}
                  </strong>
                </div>

                <div className="my-coach-status__dot" />
              </section>

              {assignedDate && (
                <section className="my-coach-meta">
                  <span>
                    {t("myCoach.started")}
                  </span>

                  <strong>
                    {assignedDate}
                  </strong>
                </section>
              )}

              {coach.username && (
                <section className="my-coach-meta">
                  <span>
                    {t("myCoach.username")}
                  </span>

                  <strong>
                    @{coach.username}
                  </strong>
                </section>
              )}

              <button
                type="button"
                className="my-coach-primary"
                onClick={
                  onOpenProgram
                }
              >
                <span>
                  {t("myCoach.openProgram")}
                </span>

                <b>
                  →
                </b>
              </button>
            </>
          )}
      </div>
    </main>
  );
}
