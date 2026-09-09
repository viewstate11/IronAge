import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getMyPayments,
  type PaymentSubscription,
  type ProgramPayment,
} from "../../api/client";

import {
  useLanguage,
} from "../../context/LanguageContext";

import "./Payments.css";

type Props = {
  onBack: () => void;
};

type PaymentRow =
  | {
      kind: "subscription";
      date: string;
      subscription: PaymentSubscription;
    }
  | {
      kind: "program";
      date: string;
      purchase: ProgramPayment;
    };

function formatDate(
  value: string | null,
  locale: string
): string {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(date);
}

function formatMoney(
  amountCents: number | null,
  currency: string | null,
  locale: string
): string {
  if (
    amountCents === null ||
    !currency
  ) {
    return "—";
  }

  try {
    return new Intl.NumberFormat(
      locale,
      {
        style: "currency",
        currency,
      }
    ).format(
      amountCents / 100
    );
  } catch {
    return `${(
      amountCents / 100
    ).toFixed(2)} ${currency}`;
  }
}

function shortTransactionId(
  value: string | null
): string {
  if (!value) {
    return "—";
  }

  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(
    0,
    8
  )}…${value.slice(-8)}`;
}

export default function Payments({
  onBack,
}: Props) {
  const {
    language,
    t,
  } = useLanguage();

  const [
    subscriptions,
    setSubscriptions,
  ] = useState<
    PaymentSubscription[]
  >([]);

  const [
    programPurchases,
    setProgramPurchases,
  ] = useState<
    ProgramPayment[]
  >([]);

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

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getMyPayments();

        if (!mounted) {
          return;
        }

        setSubscriptions(
          response.subscriptions
        );

        setProgramPurchases(
          response.programPurchases
        );
      } catch (loadError) {
        console.error(
          "IRONAGE PAYMENTS SCREEN ERROR:",
          loadError
        );

        if (!mounted) {
          return;
        }

        setError(
          t(
            "payments.loadFailed"
          )
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [t]);

  const locale =
    language === "uk"
      ? "uk-UA"
      : language === "ru"
        ? "ru-RU"
        : language === "bg"
          ? "bg-BG"
          : language === "de"
            ? "de-DE"
            : language === "fr"
              ? "fr-FR"
              : language === "es"
                ? "es-ES"
                : language === "pt"
                  ? "pt-PT"
                  : "en-US";

  const rows =
    useMemo<PaymentRow[]>(() => {
      return [
        ...subscriptions.map(
          subscription => ({
            kind:
              "subscription" as const,

            date:
              subscription.purchasedAt ??
              subscription.createdAt,

            subscription,
          })
        ),

        ...programPurchases.map(
          purchase => ({
            kind:
              "program" as const,

            date:
              purchase.purchasedAt,

            purchase,
          })
        ),
      ].sort(
        (a, b) =>
          new Date(
            b.date
          ).getTime() -
          new Date(
            a.date
          ).getTime()
      );
    }, [
      subscriptions,
      programPurchases,
    ]);

  const totalCount =
    rows.length;

  const activeSubscriptions =
    subscriptions.filter(
      item =>
        item.status === "ACTIVE"
    ).length;

  return (
    <main className="payments-screen">
      <div className="payments-screen__shell">

        <header className="payments-screen__header">
          <button
            type="button"
            className="payments-screen__back"
            onClick={onBack}
            aria-label={t("common.back")}
          >
            ←
          </button>

          <div>
            <span>
              IRONAGE
            </span>

            <h1>
              {t("payments.title")}
            </h1>

            <p>
              {t(
                "payments.subtitle"
              )}
            </p>
          </div>
        </header>

        <section className="payments-screen__stats">
          <article>
            <span>
              {t(
                "payments.transactions"
              )}
            </span>

            <strong>
              {totalCount}
            </strong>
          </article>

          <article>
            <span>
              {t(
                "payments.activeSubscriptions"
              )}
            </span>

            <strong>
              {activeSubscriptions}
            </strong>
          </article>

          <article>
            <span>
              {t(
                "payments.programPurchases"
              )}
            </span>

            <strong>
              {programPurchases.length}
            </strong>
          </article>
        </section>

        <section className="payments-screen__section">
          <div className="payments-screen__section-title">
            01 · {t(
              "payments.history"
            )}
          </div>

          {loading && (
            <div className="payments-screen__state">
              {t(
                "common.loading"
              )}
            </div>
          )}

          {!loading &&
            error && (
              <div className="payments-screen__state payments-screen__state--error">
                {error}
              </div>
            )}

          {!loading &&
            !error &&
            rows.length === 0 && (
              <div className="payments-screen__state">
                <strong>
                  {t(
                    "payments.emptyTitle"
                  )}
                </strong>

                <span>
                  {t(
                    "payments.emptyDescription"
                  )}
                </span>
              </div>
            )}

          {!loading &&
            !error &&
            rows.map(row => {
              if (
                row.kind ===
                "subscription"
              ) {
                const item =
                  row.subscription;

                return (
                  <article
                    key={`subscription-${item.id}`}
                    className="payments-screen__card"
                  >
                    <div className="payments-screen__card-top">
                      <div>
                        <span className="payments-screen__type">
                          {t(
                            "payments.subscription"
                          )}
                        </span>

                        <h2>
                          {item.plan ===
                          "MONTHLY"
                            ? t(
                                "premium.monthly"
                              )
                            : item.plan ===
                                "YEARLY"
                              ? t(
                                  "premium.yearly"
                                )
                              : item.plan}
                        </h2>
                      </div>

                      <strong
                        className={
                          item.status ===
                          "ACTIVE"
                            ? "payments-screen__status payments-screen__status--active"
                            : "payments-screen__status"
                        }
                      >
                        {item.status}
                      </strong>
                    </div>

                    <div className="payments-screen__details">
                      <div>
                        <span>
                          {t(
                            "payments.date"
                          )}
                        </span>

                        <strong>
                          {formatDate(
                            item.purchasedAt ??
                              item.createdAt,
                            locale
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          {t(
                            "payments.expires"
                          )}
                        </span>

                        <strong>
                          {formatDate(
                            item.expiresAt,
                            locale
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          {t(
                            "payments.provider"
                          )}
                        </span>

                        <strong>
                          {item.provider}
                        </strong>
                      </div>

                      <div>
                        <span>
                          {t(
                            "payments.platform"
                          )}
                        </span>

                        <strong>
                          {item.platform}
                        </strong>
                      </div>
                    </div>

                    <div className="payments-screen__transaction">
                      <span>
                        {t(
                          "payments.transaction"
                        )}
                      </span>

                      <strong
                        title={
                          item.transactionId ??
                          undefined
                        }
                      >
                        {shortTransactionId(
                          item.transactionId
                        )}
                      </strong>
                    </div>
                  </article>
                );
              }

              const item =
                row.purchase;

              return (
                <article
                  key={`program-${item.id}`}
                  className="payments-screen__card"
                >
                  <div className="payments-screen__card-top">
                    <div>
                      <span className="payments-screen__type">
                        {t(
                          "payments.program"
                        )}
                      </span>

                      <h2>
                        {item.program.name}
                      </h2>
                    </div>

                    <strong className="payments-screen__amount">
                      {formatMoney(
                        item.amountCents,
                        item.currency,
                        locale
                      )}
                    </strong>
                  </div>

                  <div className="payments-screen__details">
                    <div>
                      <span>
                        {t(
                          "payments.date"
                        )}
                      </span>

                      <strong>
                        {formatDate(
                          item.purchasedAt,
                          locale
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        {t(
                          "payments.provider"
                        )}
                      </span>

                      <strong>
                        {item.provider}
                      </strong>
                    </div>

                    <div>
                      <span>
                        {t(
                          "payments.platform"
                        )}
                      </span>

                      <strong>
                        {item.platform}
                      </strong>
                    </div>

                    <div>
                      <span>
                        {t(
                          "payments.currency"
                        )}
                      </span>

                      <strong>
                        {item.currency ??
                          "—"}
                      </strong>
                    </div>
                  </div>

                  <div className="payments-screen__transaction">
                    <span>
                      {t(
                        "payments.transaction"
                      )}
                    </span>

                    <strong
                      title={
                        item.transactionId
                      }
                    >
                      {shortTransactionId(
                        item.transactionId
                      )}
                    </strong>
                  </div>
                </article>
              );
            })}
        </section>

      </div>
    </main>
  );
}
