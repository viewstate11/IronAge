import {
  useEffect,
  useState,
} from "react";

import {
  Capacitor,
} from "@capacitor/core";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import {
  IronAgeStoreKit,
} from "../../native/ironAgeStoreKit";

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

  appleProductId:
    string | null;

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

type PurchaseResponse = {
  success: boolean;
  hasAccess: boolean;
  assignmentId: number;

  purchase: {
    id: number;
    provider: "APPLE";
    productId: string;
    transactionId: string;
  };

  entitlement: {
    id: number;
    source: "PURCHASE";
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

  const [
    purchasing,
    setPurchasing,
  ] = useState(false);

  const [
    purchaseError,
    setPurchaseError,
  ] = useState<string | null>(
    null
  );

  const [
    restoring,
    setRestoring,
  ] = useState(false);

  const [
    restoreError,
    setRestoreError,
  ] = useState<string | null>(
    null
  );

  const isNativeIOS =
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === "ios";

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

  async function restoreAppleProgram() {
    if (
      restoring ||
      hasAccess ||
      !program ||
      program.priceCents === null ||
      program.priceCents <= 0
    ) {
      return;
    }

    if (!isNativeIOS) {
      setRestoreError(
        "Restore purchases is available in the IRONAGE iOS app."
      );
      return;
    }

    if (!program.appleProductId) {
      setRestoreError(
        "This program is not configured for App Store purchase yet."
      );
      return;
    }

    try {
      setRestoring(true);
      setRestoreError(null);

      const restored =
        await IronAgeStoreKit.restorePurchases();

      const matchingTransaction =
        restored.transactions.find(
          transaction =>
            transaction.productId ===
            program.appleProductId
        );

      if (!matchingTransaction) {
        throw new Error(
          "No previous App Store purchase was found for this program"
        );
      }

      const response =
        await api.post<PurchaseResponse>(
          `/programs/${program.id}/purchase/apple`,
          {
            signedTransaction:
              matchingTransaction.signedTransaction,
          },
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        response.hasAccess !== true
      ) {
        throw new Error(
          "Program restore verification failed"
        );
      }

      const finish =
        await IronAgeStoreKit.finishTransaction({
          transactionId:
            matchingTransaction.transactionId,
        });

      if (
        !finish ||
        finish.success !== true
      ) {
        throw new Error(
          "StoreKit restored transaction finish failed"
        );
      }

      setHasAccess(true);
    } catch (err) {
      console.error(
        "IRONAGE APPLE PROGRAM RESTORE UI ERROR:",
        err
      );

      setRestoreError(
        err instanceof Error
          ? err.message
          : "Program restore failed"
      );
    } finally {
      setRestoring(false);
    }
  }

  async function purchaseAppleProgram() {
    if (
      purchasing ||
      hasAccess ||
      !program ||
      program.priceCents === null ||
      program.priceCents <= 0
    ) {
      return;
    }

    if (!isNativeIOS) {
      setPurchaseError(
        "Program purchase is available in the IRONAGE iOS app."
      );
      return;
    }

    if (!program.appleProductId) {
      setPurchaseError(
        "This program is not configured for App Store purchase yet."
      );
      return;
    }

    try {
      setPurchasing(true);
      setPurchaseError(null);

      const purchase =
        await IronAgeStoreKit.purchase({
          productId:
            program.appleProductId,
        });

      if (
        purchase.status ===
        "CANCELLED"
      ) {
        setPurchaseError(
          "Purchase cancelled."
        );
        return;
      }

      if (
        purchase.status ===
        "PENDING"
      ) {
        setPurchaseError(
          "Purchase is pending Apple approval."
        );
        return;
      }

      if (
        !purchase.signedTransaction
      ) {
        throw new Error(
          "Apple signed transaction is missing"
        );
      }

      const response =
        await api.post<PurchaseResponse>(
          `/programs/${program.id}/purchase/apple`,
          {
            signedTransaction:
              purchase.signedTransaction,
          },
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        response.hasAccess !== true
      ) {
        throw new Error(
          "Program purchase verification failed"
        );
      }

      const finish =
        await IronAgeStoreKit.finishTransaction({
          transactionId:
            purchase.transactionId,
        });

      if (
        !finish ||
        finish.success !== true
      ) {
        throw new Error(
          "StoreKit transaction finish failed"
        );
      }

      setHasAccess(true);
    } catch (err) {
      console.error(
        "IRONAGE APPLE PROGRAM PURCHASE UI ERROR:",
        err
      );

      setPurchaseError(
        err instanceof Error
          ? err.message
          : "Program purchase failed"
      );
    } finally {
      setPurchasing(false);
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
                  : !program.appleProductId
                    ? "App Store purchase is not configured for this program yet."
                    : isNativeIOS
                      ? "Purchase securely through the App Store and unlock this program."
                      : "Purchase this program in the IRONAGE iOS app."}
          </p>

          {claimError && (
            <p
              role="alert"
              className="program-detail__access-error"
            >
              {claimError}
            </p>
          )}

          {purchaseError && (
            <p
              role="alert"
              className="program-detail__access-error"
            >
              {purchaseError}
            </p>
          )}

          {restoreError && (
            <p
              role="alert"
              className="program-detail__access-error"
            >
              {restoreError}
            </p>
          )}

          <button
            type="button"
            disabled={
              claiming ||
              purchasing ||
              restoring ||
              (
                !hasAccess &&
                program.priceCents === null
              ) ||
              (
                !hasAccess &&
                program.priceCents !== null &&
                program.priceCents > 0 &&
                (
                  !isNativeIOS ||
                  !program.appleProductId
                )
              )
            }
            onClick={() => {
              if (hasAccess) {
                onOpenMyProgram(
                  program.id
                );

                return;
              }

              if (
                program.priceCents === 0
              ) {
                void claimFreeProgram();
                return;
              }

              if (
                program.priceCents !== null &&
                program.priceCents > 0
              ) {
                void purchaseAppleProgram();
              }
            }}
          >
            {claiming
              ? "GETTING PROGRAM..."
              : purchasing
                ? "PROCESSING PURCHASE..."
                : hasAccess
                  ? "OPEN MY PROGRAM"
                  : program.priceCents === 0
                    ? "GET PROGRAM"
                    : program.priceCents === null
                      ? "COMING SOON"
                      : !program.appleProductId
                        ? "PURCHASE COMING SOON"
                        : isNativeIOS
                          ? "PURCHASE"
                          : "AVAILABLE IN IOS APP"}
          </button>

          {!hasAccess &&
            isNativeIOS &&
            program.priceCents !== null &&
            program.priceCents > 0 &&
            program.appleProductId && (
              <button
                type="button"
                className="program-detail__restore"
                disabled={
                  restoring ||
                  purchasing
                }
                onClick={() =>
                  void restoreAppleProgram()
                }
              >
                {restoring
                  ? "RESTORING..."
                  : "RESTORE PURCHASES"}
              </button>
            )}
        </section>

      </div>
    </main>
  );
}
