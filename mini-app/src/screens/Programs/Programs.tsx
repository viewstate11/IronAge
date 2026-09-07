import {
  useEffect,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import "./Programs.css";

type ProgramCard = {
  id: number;
  coachId: number;

  name: string;
  description: string | null;

  durationWeeks: number | null;

  priceCents: number | null;
  currency: string;

  coach: {
    id: number;
    firstName: string;
    lastName: string | null;
    username: string | null;

    coachProfile: {
      displayName: string;
      specialization: string | null;
      photoUrl: string | null;
      isVerified: boolean;
    } | null;
  };

  _count: {
    workouts: number;
    assignments: number;
  };
};

type ProgramsResponse = {
  success: boolean;
  programs: ProgramCard[];
};

type Props = {
  onBack: () => void;

  onOpenProgram: (
    programId: number
  ) => void;
};

function formatPrice(
  priceCents: number | null,
  currency: string
): string {
  if (
    priceCents === null ||
    priceCents <= 0
  ) {
    return "FREE";
  }

  try {
    return new Intl.NumberFormat(
      undefined,
      {
        style: "currency",
        currency,
      }
    ).format(
      priceCents / 100
    );
  } catch {
    return `${(
      priceCents / 100
    ).toFixed(2)} ${currency}`;
  }
}

export default function Programs({
  onBack,
  onOpenProgram,
}: Props) {
  const [
    programs,
    setPrograms,
  ] = useState<ProgramCard[]>([]);

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

  async function loadPrograms() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.get<ProgramsResponse>(
          "/programs",
          telegramAuthOptions()
        );

      setPrograms(
        Array.isArray(
          response.programs
        )
          ? response.programs
          : []
      );
    } catch (err) {
      console.error(
        "IRONAGE PROGRAMS LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load programs"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPrograms();
  }, []);

  return (
    <main className="programs-page">
      <div className="programs-shell">

        <header className="programs-header">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
          >
            ←
          </button>

          <div>
            <span>
              IRONAGE
            </span>

            <h1>
              PROGRAMS
            </h1>

            <p>
              TRAIN WITH VERIFIED COACHES
            </p>
          </div>
        </header>


        <section className="programs-intro">
          <span>
            IRONAGE MARKETPLACE
          </span>

          <h2>
            CHOOSE YOUR
            <strong>
              {" "}PROGRAM
            </strong>
          </h2>

          <p>
            Professional training programs
            approved and published by IRONAGE.
          </p>
        </section>


        {loading && (
          <section className="programs-state">
            <strong>
              LOADING PROGRAMS...
            </strong>
          </section>
        )}


        {!loading && error && (
          <section className="programs-state">
            <strong>
              PROGRAMS NOT AVAILABLE
            </strong>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadPrograms()
              }
            >
              RETRY
            </button>
          </section>
        )}


        {!loading &&
          !error &&
          programs.length === 0 && (
            <section className="programs-state">
              <strong>
                NO PUBLISHED PROGRAMS YET
              </strong>

              <p>
                New IRONAGE programs
                will appear here after
                admin approval.
              </p>
            </section>
          )}


        {!loading &&
          !error &&
          programs.length > 0 && (
            <section className="programs-grid">
              {programs.map(
                (program) => {
                  const coach =
                    program.coach
                      .coachProfile;

                  return (
                    <article
                      key={
                        program.id
                      }
                      className="program-card"
                    >
                      <div className="program-card__top">
                        <span>
                          VERIFIED PROGRAM
                        </span>

                        <strong>
                          {formatPrice(
                            program.priceCents,
                            program.currency
                          )}
                        </strong>
                      </div>

                      <h2>
                        {program.name}
                      </h2>

                      <p className="program-card__description">
                        {program.description ||
                          "Professional IRONAGE training program."}
                      </p>

                      <div className="program-card__coach">
                        <div className="program-card__photo">
                          {coach?.photoUrl ? (
                            <img
                              src={
                                coach.photoUrl
                              }
                              alt={
                                coach.displayName
                              }
                            />
                          ) : (
                            <span>
                              {(coach?.displayName ||
                                program.coach
                                  .firstName ||
                                "I")
                                .slice(
                                  0,
                                  1
                                )
                                .toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div>
                          <strong>
                            {coach?.displayName ||
                              `${program.coach.firstName} ${program.coach.lastName || ""}`.trim()}
                          </strong>

                          <span>
                            {coach?.specialization ||
                              "IRONAGE COACH"}
                          </span>
                        </div>

                        {coach?.isVerified && (
                          <b>
                            ✓
                          </b>
                        )}
                      </div>

                      <div className="program-card__stats">
                        <div>
                          <strong>
                            {program.durationWeeks ??
                              "—"}
                          </strong>

                          <span>
                            WEEKS
                          </span>
                        </div>

                        <div>
                          <strong>
                            {
                              program
                                ._count
                                .workouts
                            }
                          </strong>

                          <span>
                            WORKOUTS
                          </span>
                        </div>

                        <div>
                          <strong>
                            {
                              program
                                ._count
                                .assignments
                            }
                          </strong>

                          <span>
                            ATHLETES
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="program-card__open"
                        onClick={() =>
                          onOpenProgram(
                            program.id
                          )
                        }
                      >
                        <span>
                          VIEW PROGRAM
                        </span>

                        <b>
                          →
                        </b>
                      </button>
                    </article>
                  );
                }
              )}
            </section>
          )}

      </div>
    </main>
  );
}
