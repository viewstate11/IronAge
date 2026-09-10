import {
  useEffect,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import "./Programs.css";

import {
  useLanguage,
} from "../../context/LanguageContext";

import {
  translateRaw,
} from "../../i18n/runtimeTranslator";

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
  currency: string,
  tr: (value: string) => string
): string {
  if (
    priceCents === null ||
    priceCents <= 0
  ) {
    return tr("FREE");
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
  const { language } =
    useLanguage();

  const tr = (
    value: string
  ) =>
    translateRaw(
      value,
      language
    );

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
        tr("Failed to load programs")
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
            aria-label={tr("Back")}
          >
            ←
          </button>

          <div>
            <span>
              IRONAGE
            </span>

            <h1>
              {tr("PROGRAMS")}
            </h1>

            <p>
              {tr("TRAIN WITH VERIFIED COACHES")}
            </p>
          </div>
        </header>


        <section className="programs-intro">
          <span>
            {tr("IRONAGE MARKETPLACE")}
          </span>

          <h2>
            {tr("CHOOSE YOUR PROGRAM")}
          </h2>

          <p>
            {tr(
              "Professional training programs approved and published by IRONAGE."
            )}
          </p>
        </section>


        {loading && (
          <section className="programs-state">
            <strong>
              {tr("LOADING PROGRAMS...")}
            </strong>
          </section>
        )}


        {!loading && error && (
          <section className="programs-state">
            <strong>
              {tr("PROGRAMS NOT AVAILABLE")}
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
              {tr("RETRY")}
            </button>
          </section>
        )}


        {!loading &&
          !error &&
          programs.length === 0 && (
            <section className="programs-state">
              <strong>
                {tr("NO PUBLISHED PROGRAMS YET")}
              </strong>

              <p>
                {tr(
                  "New IRONAGE programs will appear here after admin approval."
                )}
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
                          {tr("VERIFIED PROGRAM")}
                        </span>

                        <strong>
                          {formatPrice(
                            program.priceCents,
                            program.currency,
                            tr
                          )}
                        </strong>
                      </div>

                      <h2>
                        {program.name}
                      </h2>

                      <p className="program-card__description">
                        {program.description ||
                          tr(
                            "Professional IRONAGE training program."
                          )}
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
                              tr("IRONAGE COACH")}
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
                            {tr("WEEKS")}
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
                            {tr("WORKOUTS")}
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
                            {tr("ATHLETES")}
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
                          {tr("VIEW PROGRAM")}
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
