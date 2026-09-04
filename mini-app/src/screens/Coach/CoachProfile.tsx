import {
  useEffect,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

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
          "Invalid coach profile response"
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
        err instanceof Error
          ? err.message
          : "Failed to load coach"
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
          "Coach connection failed"
        );
      }

      setConnected(true);
    } catch (err) {
      console.error(
        "IRONAGE COACH CONNECT ERROR:",
        err
      );

      setConnectError(
        err instanceof Error
          ? err.message
          : "Failed to choose coach"
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
              LOADING COACH...
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
              aria-label="Back"
            >
              ←
            </button>
          </header>

          <section className="coach-profile__state">
            <strong>
              COACH NOT AVAILABLE
            </strong>

            <p>
              {error ??
                "Coach not found"}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadCoach()
              }
            >
              RETRY
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
            aria-label="Back"
          >
            ←
          </button>

          <span>
            IRONAGE COACH
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
                "IRONAGE COACH"}
            </p>
          </div>
        </section>

        <section className="coach-profile__stats">
          <div>
            <strong>
              {coach.stats.clients}
            </strong>
            <span>
              CLIENTS
            </span>
          </div>

          <div>
            <strong>
              {coach.stats.programs}
            </strong>
            <span>
              PROGRAMS
            </span>
          </div>

          <div>
            <strong>
              {coach.stats.workouts}
            </strong>
            <span>
              WORKOUTS
            </span>
          </div>
        </section>

        <section className="coach-profile__about">
          <span>
            ABOUT COACH
          </span>

          <p>
            {coach.bio ??
              "Professional IRONAGE coach ready to build your training plan."}
          </p>
        </section>

        {coach.user.username && (
          <section className="coach-profile__meta">
            <span>
              USERNAME
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
                ? "CONNECTING..."
                : "CHOOSE THIS COACH"}
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
                COACH SELECTED
              </strong>

              <p>
                {coach.displayName} is now your coach.
              </p>
            </div>

            <button
              type="button"
              onClick={
                onConnected
              }
            >
              CONTINUE →
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
