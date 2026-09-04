import {
  useEffect,
  useState,
} from "react";

import {
  api,
  telegramAuthOptions,
} from "../../api/client";

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
          : "Failed to load coach"
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
    "IRONAGE COACH";

  const assignedDate =
    assignedAt
      ? new Date(
          assignedAt
        ).toLocaleDateString()
      : null;

  return (
    <main className="my-coach-page">
      <div className="my-coach-shell">
        <header className="my-coach-header">
          <button
            type="button"
            className="my-coach-back"
            onClick={onBack}
            aria-label="Back"
          >
            ←
          </button>

          <div>
            <span>
              IRONAGE COACHING
            </span>

            <h1>
              MY COACH
            </h1>

            <p>
              YOUR COACH · YOUR PLAN · YOUR RESULTS
            </p>
          </div>
        </header>

        {loading && (
          <section className="my-coach-state">
            <strong>
              LOADING COACH...
            </strong>
          </section>
        )}

        {!loading &&
          error && (
            <section className="my-coach-state my-coach-state--error">
              <strong>
                COACH LOAD ERROR
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
                RETRY
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
                  NO COACH YET
                </span>

                <h2>
                  FIND YOUR COACH
                </h2>

                <p>
                  Choose an IRONAGE coach who can create your training plan and monitor your progress.
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
                  FIND A COACH
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
                    YOUR COACH
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
                      "IRONAGE COACH"}
                  </p>
                </div>
              </section>

              {profile.bio && (
                <section className="my-coach-about">
                  <span>
                    ABOUT
                  </span>

                  <p>
                    {profile.bio}
                  </p>
                </section>
              )}

              <section className="my-coach-status">
                <div>
                  <span>
                    COACH STATUS
                  </span>

                  <strong>
                    {profile.isActive
                      ? "ACTIVE"
                      : "INACTIVE"}
                  </strong>
                </div>

                <div className="my-coach-status__dot" />
              </section>

              {assignedDate && (
                <section className="my-coach-meta">
                  <span>
                    COACHING STARTED
                  </span>

                  <strong>
                    {assignedDate}
                  </strong>
                </section>
              )}

              {coach.username && (
                <section className="my-coach-meta">
                  <span>
                    USERNAME
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
                  OPEN MY PROGRAM
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
