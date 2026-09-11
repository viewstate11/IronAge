import {
  useEffect,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import { useLanguage } from "../../context/LanguageContext";

import "./CoachProfile.css";

type Props = {
  coachId: number;
  onBack: () => void;
  onConnected: () => void;
};

type CoachData = {
  id: number;
  userId: number;
  displayName: string;
  bio: string | null;
  specialization: string | null;
  photoUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;

  stats: {
    clients: number;
    workouts: number;
    programs: number;
  };

  user: {
    id: number;
    firstName: string;
    lastName: string | null;
    username: string | null;
  };
};

type CoachResponse = {
  success: boolean;
  coach: CoachData;
};

type ConnectResponse = {
  success: boolean;
  alreadyConnected?: boolean;
  relationship?: {
    id: number;
    coachId: number;
    clientId: number;
  };
};

export default function CoachProfile({
  coachId,
  onBack,
  onConnected,
}: Props) {
  const { t } = useLanguage();

  const [coach, setCoach] =
    useState<CoachData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const [connecting, setConnecting] =
    useState(false);

  const [
    connectError,
    setConnectError,
  ] = useState<string | null>(
    null
  );

  const [
    connected,
    setConnected,
  ] = useState(false);

  async function loadCoach() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.get<CoachResponse>(
          `/coaches/marketplace/${coachId}`,
          telegramAuthOptions()
        );

      if (
        !response ||
        !response.coach
      ) {
        throw new Error(
          t("coachProfile.invalidResponse")
        );
      }

      setCoach(
        response.coach
      );
    } catch (err) {
      console.error(
        "IRONAGE COACH PROFILE LOAD ERROR:",
        err
      );

      setError(
        t("coachProfile.failedToLoad")
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCoach();
  }, [coachId]);

  async function connectCoach() {
    if (
      connecting ||
      connected
    ) {
      return;
    }

    try {
      setConnecting(true);
      setConnectError(null);

      const response =
        await api.post<ConnectResponse>(
          `/coaches/${coachId}/connect`,
          {},
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true
      ) {
        throw new Error(
          t("coachProfile.connectionFailed")
        );
      }

      setConnected(true);
    } catch (err) {
      console.error(
        "IRONAGE COACH CONNECT ERROR:",
        err
      );

      setConnectError(
        t("coachProfile.failedToChoose")
      );
    } finally {
      setConnecting(false);
    }
  }

  if (loading) {
    return (
      <main className="coach-profile">
        <div className="coach-profile__content">
          <section className="coach-profile__state">
            <strong>
              {t("coachProfile.loading")}
            </strong>
          </section>
        </div>
      </main>
    );
  }

  if (
    error ||
    !coach
  ) {
    return (
      <main className="coach-profile">
        <div className="coach-profile__content">
          <header className="coach-profile__top">
            <button
              type="button"
              onClick={onBack}
              aria-label={t("common.back")}
            >
              ←
            </button>
          </header>

          <section className="coach-profile__state">
            <strong>
              {t("coachProfile.notAvailable")}
            </strong>

            <p>
              {error ??
                t("coachProfile.notFound")}
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
        </div>
      </main>
    );
  }

  return (
    <main className="coach-profile">
      <div className="coach-profile__content">
        <header className="coach-profile__top">
          <button
            type="button"
            onClick={onBack}
            aria-label={t("common.back")}
          >
            ←
          </button>

          <span>
            {t("coachProfile.ironageCoach")}
          </span>
        </header>

        <section className="coach-profile__hero">
          <div className="coach-profile__photo">
            {coach.photoUrl ? (
              <img
                src={coach.photoUrl}
                alt={
                  coach.displayName
                }
              />
            ) : (
              <span>
                {coach.displayName
                  .slice(0, 1)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div className="coach-profile__name">
            <div>
              <h1>
                {coach.displayName}
              </h1>

              {coach.isVerified && (
                <span>
                  ✓
                </span>
              )}
            </div>

            <p>
              {coach.specialization ??
                t("coachProfile.ironageCoach")}
            </p>
          </div>
        </section>

        <section className="coach-profile__stats">
          <div>
            <strong>
              {coach.stats.clients}
            </strong>
            <span>
              {t("coachProfile.clients")}
            </span>
          </div>

          <div>
            <strong>
              {coach.stats.programs}
            </strong>
            <span>
              {t("coachProfile.programs")}
            </span>
          </div>

          <div>
            <strong>
              {coach.stats.workouts}
            </strong>
            <span>
              {t("coachProfile.workouts")}
            </span>
          </div>
        </section>

        <section className="coach-profile__about">
          <span>
            {t("coachProfile.about")}
          </span>

          <p>
            {coach.bio ??
              t("coachProfile.defaultBio")}
          </p>
        </section>

        {coach.user.username && (
          <section className="coach-profile__meta">
            <span>
              {t("coachProfile.username")}
            </span>

            <strong>
              @{coach.user.username}
            </strong>
          </section>
        )}

        {connectError && (
          <section className="coach-profile__error">
            {connectError}
          </section>
        )}

        {!connected ? (
          <button
            type="button"
            className="coach-profile__choose"
            disabled={connecting}
            onClick={() =>
              void connectCoach()
            }
          >
            <span>
              {connecting
                ? t("coachProfile.connecting")
                : t("coachProfile.choose")}
            </span>

            <b>→</b>
          </button>
        ) : (
          <section className="coach-profile__success">
            <span>
              ✓
            </span>

            <div>
              <strong>
                {t("coachProfile.selected")}
              </strong>

              <p>
                {coach.displayName} {t("coachProfile.nowYourCoach")}
              </p>
            </div>

            <button
              type="button"
              onClick={
                onConnected
              }
            >
              {t("coachProfile.continue")} →
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
