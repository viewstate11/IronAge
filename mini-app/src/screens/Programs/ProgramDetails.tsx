import {
  useEffect,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import "./ProgramDetails.css";

type ProgramData = {
  id: number;
  coachId: number;

  name: string;
  description: string | null;

  durationWeeks:
    number | null;

  priceCents:
    number | null;

  currency:
    string;

  coach: {
    id: number;
    firstName: string;
    lastName: string | null;

    coachProfile: {
      displayName: string;
      specialization: string | null;
      photoUrl: string | null;
      isVerified: boolean;
    } | null;
  };


  _count: {
    workouts:
      number;

    assignments:
      number;
  };
};

type Response = {
  success: boolean;
  program: ProgramData;
  hasAccess: boolean;
};

type ClaimResponse = {
  success: boolean;
  hasAccess: boolean;
  assignmentId: number;
  entitlement: {
    id: number;
    source: "FREE_CLAIM";
  };
};

type Props = {
  programId: number;
  onBack: () => void;

  onOpenCoach: (
    coachId: number
  ) => void;

  onOpenMyProgram: (
    programId: number
  ) => void;
};

function formatPrice(
  priceCents: number | null,
  currency: string
): string {
  if (priceCents === null) {
    return "PRICE TBA";
  }

  if (priceCents === 0) {
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

export default function ProgramDetails({
  programId,
  onBack,
  onOpenCoach,
  onOpenMyProgram,
}: Props) {
  const [
    program,
    setProgram,
  ] = useState<ProgramData | null>(
    null
  );

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
    hasAccess,
    setHasAccess,
  ] = useState(false);

  const [
    claiming,
    setClaiming,
  ] = useState(false);

  const [
    claimError,
    setClaimError,
  ] = useState<string | null>(
    null
  );

  async function loadProgram() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.get<Response>(
          `/programs/${programId}`,
          telegramAuthOptions()
        );

      if (!response.program) {
        throw new Error(
          "Program not found"
        );
      }

      setProgram(
        response.program
      );

      setHasAccess(
        Boolean(
          response.hasAccess
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load program"
      );
    } finally {
      setLoading(false);
    }
  }

  async function claimFreeProgram() {
    if (
      claiming ||
      hasAccess ||
      !program ||
      program.priceCents !== 0
    ) {
      return;
    }

    try {
      setClaiming(true);
      setClaimError(null);

      const response =
        await api.post<ClaimResponse>(
          `/programs/${program.id}/claim`,
          {},
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        response.hasAccess !== true
      ) {
        throw new Error(
          "Program claim failed"
        );
      }

      setHasAccess(true);
    } catch (err) {
      console.error(
        "IRONAGE FREE PROGRAM CLAIM UI ERROR:",
        err
      );

      setClaimError(
        err instanceof Error
          ? err.message
          : "Failed to get program"
      );
    } finally {
      setClaiming(false);
    }
  }

  useEffect(() => {
    void loadProgram();
  }, [programId]);

  if (loading) {
    return (
      <main className="program-detail">
        <div className="program-detail__state">
          LOADING PROGRAM...
        </div>
      </main>
    );
  }

  if (
    error ||
    !program
  ) {
    return (
      <main className="program-detail">
        <div className="program-detail__shell">
          <button
            type="button"
            className="program-detail__back"
            onClick={onBack}
          >
            ←
          </button>

          <div className="program-detail__state">
            <strong>
              PROGRAM NOT AVAILABLE
            </strong>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadProgram()
              }
            >
              RETRY
            </button>
          </div>
        </div>
      </main>
    );
  }

  const coach =
    program.coach
      .coachProfile;

  return (
    <main className="program-detail">
      <div className="program-detail__shell">

        <header className="program-detail__header">
          <button
            type="button"
            className="program-detail__back"
            onClick={onBack}
          >
            ←
          </button>

          <span>
            IRONAGE PROGRAM
          </span>
        </header>


        <section className="program-detail__hero">
          <span>
            VERIFIED PROGRAM
          </span>

          <h1>
            {program.name}
          </h1>

          <p>
            {program.description ||
              "Professional IRONAGE training program."}
          </p>

          <div className="program-detail__price">
            {formatPrice(
              program.priceCents,
              program.currency
            )}
          </div>
        </section>


        <section
          className="program-detail__coach"
          onClick={() =>
            onOpenCoach(
              program.coachId
            )
          }
        >
          <div className="program-detail__coach-photo">
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
                    .firstName)
                  .slice(0,1)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <span>
              COACH
            </span>

            <strong>
              {coach?.displayName ||
                program.coach
                  .firstName}
              {coach?.isVerified
                ? " ✓"
                : ""}
            </strong>

            <p>
              {coach?.specialization ||
                "IRONAGE COACH"}
            </p>
          </div>

          <b>
            →
          </b>
        </section>


        <section className="program-detail__stats">
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
        </section>


        <section className="program-detail__access">
          <span>
            PROGRAM CONTENT
          </span>

          <h2>
            FULL TRAINING PLAN PROTECTED
          </h2>

          <p>
            Exercises, sets, repetitions and coach instructions
            become available only after program access is granted.
          </p>
        </section>


        <section className="program-detail__access">
          <span>
            PROGRAM ACCESS
          </span>

          <h2>
            READY TO TRAIN?
          </h2>

          <p>
            {hasAccess
              ? "This program is available in your IRONAGE account."
              : program.priceCents === 0
                ? "Get this program free and start training."
                : program.priceCents === null
                  ? "Program access is not available yet."
                  : "Secure purchase access will be connected in the payment module."}
          </p>

          {claimError && (
            <p
              role="alert"
              className="program-detail__access-error"
            >
              {claimError}
            </p>
          )}

          <button
            type="button"
            disabled={
              claiming ||
              (
                !hasAccess &&
                program.priceCents !== 0
              )
            }
            onClick={() => {
              if (hasAccess) {
                onOpenMyProgram(
                  program.id
                );

                return;
              }

              if (program.priceCents === 0) {
                void claimFreeProgram();
              }
            }}
          >
            {claiming
              ? "GETTING PROGRAM..."
              : hasAccess
                ? "OPEN MY PROGRAM"
                : program.priceCents === 0
                  ? "GET PROGRAM"
                  : program.priceCents === null
                    ? "COMING SOON"
                    : "PURCHASE COMING SOON"}
          </button>
        </section>

      </div>
    </main>
  );
}
