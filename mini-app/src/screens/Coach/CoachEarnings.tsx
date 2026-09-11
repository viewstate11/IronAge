import {
  useEffect,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import {
  useLanguage,
  type AppLanguage,
} from "../../context/LanguageContext";

import "./CoachEarnings.css";

type Props = {
  onBack: () => void;
};

type CurrencyTotal = {
  currency: string;
  grossCents: number;
  commissionCents: number;
  netCents: number;
  sales: number;
};

type Transaction = {
  id: number;
  userId: number;

  program: {
    id: number;
    name: string;
  };

  provider: string;
  platform: string;

  amountCents: number;
  currency: string;

  commissionCents: number;
  netCents: number;

  purchasedAt: string;
};

type EarningsResponse = {
  success: boolean;

  coach: {
    displayName: string;
  };

  commissionBps: number;

  stats: {
    programs: number;
    activePrograms: number;
    sales: number;
  };

  totals: CurrencyTotal[];

  transactions: Transaction[];
};

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;

  loading: string;
  failed: string;
  retry: string;

  gross: string;
  net: string;
  commission: string;
  sales: string;
  programs: string;

  platformFee: string;
  transactions: string;
  noTransactions: string;
  noTransactionsSubtitle: string;

  program: string;
  date: string;
};

const COPY: Record<
  AppLanguage,
  Copy
> = {
  en: {
    eyebrow: "COACH TOOLS",
    title: "EARNINGS",
    subtitle:
      "Revenue from verified sales of your training programs.",

    loading:
      "Loading earnings...",
    failed:
      "Failed to load earnings.",
    retry: "RETRY",

    gross: "GROSS REVENUE",
    net: "NET EARNINGS",
    commission: "PLATFORM FEE",
    sales: "SALES",
    programs: "ACTIVE PROGRAMS",

    platformFee:
      "IRONAGE platform commission",
    transactions:
      "TRANSACTIONS",
    noTransactions:
      "NO SALES YET",
    noTransactionsSubtitle:
      "Verified program sales will appear here.",

    program: "PROGRAM",
    date: "DATE",
  },

  uk: {
    eyebrow:
      "ІНСТРУМЕНТИ ТРЕНЕРА",
    title: "ДОХІД",
    subtitle:
      "Дохід від підтверджених продажів ваших тренувальних програм.",

    loading:
      "Завантаження доходу...",
    failed:
      "Не вдалося завантажити дані про дохід.",
    retry: "ПОВТОРИТИ",

    gross: "ВАЛОВИЙ ДОХІД",
    net: "ЧИСТИЙ ДОХІД",
    commission:
      "КОМІСІЯ ПЛАТФОРМИ",
    sales: "ПРОДАЖІ",
    programs:
      "АКТИВНІ ПРОГРАМИ",

    platformFee:
      "Комісія платформи IRONAGE",
    transactions:
      "ТРАНЗАКЦІЇ",
    noTransactions:
      "ПРОДАЖІВ ЩЕ НЕМАЄ",
    noTransactionsSubtitle:
      "Підтверджені продажі програм з’являться тут.",

    program: "ПРОГРАМА",
    date: "ДАТА",
  },

  ru: {
    eyebrow:
      "ИНСТРУМЕНТЫ ТРЕНЕРА",
    title: "ДОХОД",
    subtitle:
      "Доход от подтверждённых продаж ваших тренировочных программ.",

    loading:
      "Загрузка дохода...",
    failed:
      "Не удалось загрузить данные о доходе.",
    retry: "ПОВТОРИТЬ",

    gross: "ВАЛОВОЙ ДОХОД",
    net: "ЧИСТЫЙ ДОХОД",
    commission:
      "КОМИССИЯ ПЛАТФОРМЫ",
    sales: "ПРОДАЖИ",
    programs:
      "АКТИВНЫЕ ПРОГРАММЫ",

    platformFee:
      "Комиссия платформы IRONAGE",
    transactions:
      "ТРАНЗАКЦИИ",
    noTransactions:
      "ПРОДАЖ ПОКА НЕТ",
    noTransactionsSubtitle:
      "Подтверждённые продажи программ появятся здесь.",

    program: "ПРОГРАММА",
    date: "ДАТА",
  },

  bg: {
    eyebrow:
      "ИНСТРУМЕНТИ ЗА ТРЕНЬОРА",
    title: "ПРИХОДИ",
    subtitle:
      "Приходи от потвърдени продажби на вашите тренировъчни програми.",

    loading:
      "Зареждане на приходите...",
    failed:
      "Приходите не можаха да се заредят.",
    retry: "ОПИТАЙ ОТНОВО",

    gross: "БРУТНИ ПРИХОДИ",
    net: "НЕТНИ ПРИХОДИ",
    commission:
      "ТАКСА НА ПЛАТФОРМАТА",
    sales: "ПРОДАЖБИ",
    programs:
      "АКТИВНИ ПРОГРАМИ",

    platformFee:
      "Комисиона на платформата IRONAGE",
    transactions:
      "ТРАНЗАКЦИИ",
    noTransactions:
      "ВСЕ ОЩЕ НЯМА ПРОДАЖБИ",
    noTransactionsSubtitle:
      "Потвърдените продажби на програми ще се появят тук.",

    program: "ПРОГРАМА",
    date: "ДАТА",
  },

  es: {
    eyebrow:
      "HERRAMIENTAS DEL ENTRENADOR",
    title: "INGRESOS",
    subtitle:
      "Ingresos de ventas verificadas de tus programas de entrenamiento.",

    loading:
      "Cargando ingresos...",
    failed:
      "No se pudieron cargar los ingresos.",
    retry: "REINTENTAR",

    gross: "INGRESOS BRUTOS",
    net: "INGRESOS NETOS",
    commission:
      "COMISIÓN DE PLATAFORMA",
    sales: "VENTAS",
    programs:
      "PROGRAMAS ACTIVOS",

    platformFee:
      "Comisión de la plataforma IRONAGE",
    transactions:
      "TRANSACCIONES",
    noTransactions:
      "AÚN NO HAY VENTAS",
    noTransactionsSubtitle:
      "Las ventas verificadas aparecerán aquí.",

    program: "PROGRAMA",
    date: "FECHA",
  },

  fr: {
    eyebrow:
      "OUTILS DU COACH",
    title: "REVENUS",
    subtitle:
      "Revenus issus des ventes vérifiées de vos programmes.",

    loading:
      "Chargement des revenus...",
    failed:
      "Impossible de charger les revenus.",
    retry: "RÉESSAYER",

    gross: "REVENU BRUT",
    net: "REVENU NET",
    commission:
      "COMMISSION PLATEFORME",
    sales: "VENTES",
    programs:
      "PROGRAMMES ACTIFS",

    platformFee:
      "Commission de la plateforme IRONAGE",
    transactions:
      "TRANSACTIONS",
    noTransactions:
      "AUCUNE VENTE",
    noTransactionsSubtitle:
      "Les ventes vérifiées apparaîtront ici.",

    program: "PROGRAMME",
    date: "DATE",
  },

  de: {
    eyebrow:
      "COACH-WERKZEUGE",
    title: "EINNAHMEN",
    subtitle:
      "Einnahmen aus verifizierten Verkäufen deiner Trainingsprogramme.",

    loading:
      "Einnahmen werden geladen...",
    failed:
      "Einnahmen konnten nicht geladen werden.",
    retry: "ERNEUT VERSUCHEN",

    gross: "BRUTTOUMSATZ",
    net: "NETTOEINNAHMEN",
    commission:
      "PLATTFORMGEBÜHR",
    sales: "VERKÄUFE",
    programs:
      "AKTIVE PROGRAMME",

    platformFee:
      "IRONAGE Plattformprovision",
    transactions:
      "TRANSAKTIONEN",
    noTransactions:
      "NOCH KEINE VERKÄUFE",
    noTransactionsSubtitle:
      "Verifizierte Programmverkäufe erscheinen hier.",

    program: "PROGRAMM",
    date: "DATUM",
  },

  pt: {
    eyebrow:
      "FERRAMENTAS DO TREINADOR",
    title: "RECEITAS",
    subtitle:
      "Receitas de vendas verificadas dos teus programas de treino.",

    loading:
      "A carregar receitas...",
    failed:
      "Não foi possível carregar as receitas.",
    retry: "TENTAR NOVAMENTE",

    gross: "RECEITA BRUTA",
    net: "RECEITA LÍQUIDA",
    commission:
      "COMISSÃO DA PLATAFORMA",
    sales: "VENDAS",
    programs:
      "PROGRAMAS ATIVOS",

    platformFee:
      "Comissão da plataforma IRONAGE",
    transactions:
      "TRANSAÇÕES",
    noTransactions:
      "AINDA NÃO HÁ VENDAS",
    noTransactionsSubtitle:
      "As vendas verificadas aparecerão aqui.",

    program: "PROGRAMA",
    date: "DATA",
  },
};

function money(
  cents: number,
  currency: string,
  language: AppLanguage
) {
  const localeMap: Record<
    AppLanguage,
    string
  > = {
    en: "en-US",
    uk: "uk-UA",
    ru: "ru-RU",
    bg: "bg-BG",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    pt: "pt-PT",
  };

  return new Intl.NumberFormat(
    localeMap[language],
    {
      style: "currency",
      currency,
    }
  ).format(
    cents / 100
  );
}

export default function CoachEarnings({
  onBack,
}: Props) {
  const { language, t } = useLanguage();

  const copy =
    COPY[language];

  const [
    data,
    setData,
  ] =
    useState<EarningsResponse | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.get<EarningsResponse>(
          "/coach-earnings/me",
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true
      ) {
        throw new Error(
          "Invalid earnings response"
        );
      }

      setData(response);
    } catch (loadError) {
      console.error(
        "IRONAGE COACH EARNINGS UI ERROR:",
        loadError
      );

      setError(copy.failed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const primary =
    data?.totals?.[0] ?? {
      currency: "EUR",
      grossCents: 0,
      commissionCents: 0,
      netCents: 0,
      sales: 0,
    };

  return (
    <main className="coach-earnings">
      <div className="coach-earnings__shell">
        <header className="coach-earnings__header">
          <button
            type="button"
            className="coach-earnings__back"
            onClick={onBack}
            aria-label={t("common.back")}
          >
            ←
          </button>

          <div>
            <span>
              {copy.eyebrow}
            </span>

            <h1>
              {copy.title}
            </h1>

            <p>
              {copy.subtitle}
            </p>
          </div>
        </header>

        {loading && (
          <div className="coach-earnings__state">
            {copy.loading}
          </div>
        )}

        {!loading &&
          error && (
            <div className="coach-earnings__state">
              <p>{error}</p>

              <button
                type="button"
                onClick={() => {
                  void load();
                }}
              >
                {copy.retry}
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          data && (
            <>
              <section className="coach-earnings__hero">
                <span>
                  {copy.net}
                </span>

                <strong>
                  {money(
                    primary.netCents,
                    primary.currency,
                    language
                  )}
                </strong>

                <small>
                  {data.coach.displayName}
                </small>
              </section>

              <section className="coach-earnings__stats">
                <article>
                  <span>
                    {copy.gross}
                  </span>

                  <strong>
                    {money(
                      primary.grossCents,
                      primary.currency,
                      language
                    )}
                  </strong>
                </article>

                <article>
                  <span>
                    {copy.sales}
                  </span>

                  <strong>
                    {data.stats.sales}
                  </strong>
                </article>

                <article>
                  <span>
                    {copy.programs}
                  </span>

                  <strong>
                    {
                      data.stats
                        .activePrograms
                    }
                  </strong>
                </article>

                <article>
                  <span>
                    {copy.commission}
                  </span>

                  <strong>
                    {money(
                      primary
                        .commissionCents,
                      primary.currency,
                      language
                    )}
                  </strong>
                </article>
              </section>

              <section className="coach-earnings__commission">
                <span>
                  {copy.platformFee}
                </span>

                <strong>
                  {(
                    data.commissionBps /
                    100
                  ).toFixed(2)}
                  %
                </strong>
              </section>

              {data.totals.length >
                1 && (
                <section className="coach-earnings__currencies">
                  {data.totals.map(
                    total => (
                      <article
                        key={
                          total.currency
                        }
                      >
                        <span>
                          {
                            total.currency
                          }
                        </span>

                        <strong>
                          {money(
                            total.netCents,
                            total.currency,
                            language
                          )}
                        </strong>
                      </article>
                    )
                  )}
                </section>
              )}

              <section className="coach-earnings__history">
                <h2>
                  {copy.transactions}
                </h2>

                {data.transactions
                  .length === 0 ? (
                  <div className="coach-earnings__empty">
                    <strong>
                      {
                        copy.noTransactions
                      }
                    </strong>

                    <p>
                      {
                        copy.noTransactionsSubtitle
                      }
                    </p>
                  </div>
                ) : (
                  data.transactions.map(
                    transaction => (
                      <article
                        key={
                          transaction.id
                        }
                        className="coach-earnings__transaction"
                      >
                        <div>
                          <span>
                            {
                              copy.program
                            }
                          </span>

                          <strong>
                            {
                              transaction
                                .program
                                .name
                            }
                          </strong>

                          <small>
                            {new Date(
                              transaction.purchasedAt
                            ).toLocaleDateString()}
                          </small>
                        </div>

                        <div className="coach-earnings__transaction-money">
                          <strong>
                            {money(
                              transaction.netCents,
                              transaction.currency,
                              language
                            )}
                          </strong>

                          <small>
                            {
                              transaction.platform
                            }
                          </small>
                        </div>
                      </article>
                    )
                  )
                )}
              </section>
            </>
          )}
      </div>
    </main>
  );
}
