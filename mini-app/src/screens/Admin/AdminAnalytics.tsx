import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import {
  useLanguage,
  type AppLanguage,
} from "../../context/LanguageContext";

import "./AdminAnalytics.css";

type Props = {
  onBack: () => void;
};

type Revenue = {
  currency: string;
  grossCents: number;
  last30Cents: number;
  sales: number;
  last30Sales: number;
};

type AnalyticsResponse = {
  success: boolean;
  generatedAt: string;

  users: {
    total: number;
    new7Days: number;
    new30Days: number;
    previous30Days: number;
    growthPercent: number;
  };

  coaches: {
    total: number;
    activeVerified: number;
  };

  premium: {
    activeUsers: number;
  };

  programs: {
    total: number;
    published: number;
  };

  workouts: {
    completed: number;
    completed30Days: number;
  };

  sales: {
    total: number;
    last30Days: number;
  };

  revenue: Revenue[];
};

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;

  loading: string;
  error: string;
  retry: string;

  totalUsers: string;
  new7: string;
  new30: string;
  growth: string;

  coaches: string;
  premium: string;
  programs: string;
  workouts: string;

  published: string;
  verified: string;
  last30: string;

  sales: string;
  programRevenue: string;
  noRevenue: string;
  total: string;
};

const COPY: Record<
  AppLanguage,
  Copy
> = {
  en: {
    eyebrow: "IRONAGE ADMIN",
    title: "ANALYTICS",
    subtitle:
      "REAL PLATFORM DATA · LIVE METRICS",
    loading:
      "LOADING ANALYTICS...",
    error:
      "FAILED TO LOAD ANALYTICS",
    retry: "RETRY",
    totalUsers:
      "TOTAL USERS",
    new7: "NEW · 7 DAYS",
    new30:
      "NEW · 30 DAYS",
    growth:
      "30-DAY GROWTH",
    coaches: "COACHES",
    premium:
      "ACTIVE PREMIUM",
    programs: "PROGRAMS",
    workouts:
      "COMPLETED WORKOUTS",
    published: "PUBLISHED",
    verified:
      "ACTIVE VERIFIED",
    last30:
      "LAST 30 DAYS",
    sales:
      "PROGRAM SALES",
    programRevenue:
      "PROGRAM REVENUE",
    noRevenue:
      "NO PAID PROGRAM SALES YET",
    total: "TOTAL",
  },

  uk: {
    eyebrow: "IRONAGE ADMIN",
    title: "АНАЛІТИКА",
    subtitle:
      "РЕАЛЬНІ ДАНІ ПЛАТФОРМИ · LIVE МЕТРИКИ",
    loading:
      "ЗАВАНТАЖЕННЯ АНАЛІТИКИ...",
    error:
      "НЕ ВДАЛОСЯ ЗАВАНТАЖИТИ АНАЛІТИКУ",
    retry: "ПОВТОРИТИ",
    totalUsers:
      "УСЬОГО КОРИСТУВАЧІВ",
    new7:
      "НОВІ · 7 ДНІВ",
    new30:
      "НОВІ · 30 ДНІВ",
    growth:
      "РІСТ ЗА 30 ДНІВ",
    coaches: "ТРЕНЕРИ",
    premium:
      "АКТИВНИЙ PREMIUM",
    programs: "ПРОГРАМИ",
    workouts:
      "ЗАВЕРШЕНІ ТРЕНУВАННЯ",
    published:
      "ОПУБЛІКОВАНО",
    verified:
      "АКТИВНІ ПІДТВЕРДЖЕНІ",
    last30:
      "ОСТАННІ 30 ДНІВ",
    sales:
      "ПРОДАЖІ ПРОГРАМ",
    programRevenue:
      "ДОХІД ВІД ПРОГРАМ",
    noRevenue:
      "ПОКИ НЕМАЄ ПЛАТНИХ ПРОДАЖІВ",
    total: "ВСЬОГО",
  },

  ru: {
    eyebrow: "IRONAGE ADMIN",
    title: "АНАЛИТИКА",
    subtitle:
      "РЕАЛЬНЫЕ ДАННЫЕ ПЛАТФОРМЫ · LIVE МЕТРИКИ",
    loading:
      "ЗАГРУЗКА АНАЛИТИКИ...",
    error:
      "НЕ УДАЛОСЬ ЗАГРУЗИТЬ АНАЛИТИКУ",
    retry: "ПОВТОРИТЬ",
    totalUsers:
      "ВСЕГО ПОЛЬЗОВАТЕЛЕЙ",
    new7:
      "НОВЫЕ · 7 ДНЕЙ",
    new30:
      "НОВЫЕ · 30 ДНЕЙ",
    growth:
      "РОСТ ЗА 30 ДНЕЙ",
    coaches: "ТРЕНЕРЫ",
    premium:
      "АКТИВНЫЙ PREMIUM",
    programs: "ПРОГРАММЫ",
    workouts:
      "ЗАВЕРШЁННЫЕ ТРЕНИРОВКИ",
    published:
      "ОПУБЛИКОВАНО",
    verified:
      "АКТИВНЫЕ ПОДТВЕРЖДЁННЫЕ",
    last30:
      "ПОСЛЕДНИЕ 30 ДНЕЙ",
    sales:
      "ПРОДАЖИ ПРОГРАММ",
    programRevenue:
      "ДОХОД ОТ ПРОГРАММ",
    noRevenue:
      "ПОКА НЕТ ПЛАТНЫХ ПРОДАЖ",
    total: "ВСЕГО",
  },

  bg: {
    eyebrow: "IRONAGE ADMIN",
    title: "АНАЛИЗИ",
    subtitle:
      "РЕАЛНИ ДАННИ · LIVE МЕТРИКИ",
    loading:
      "ЗАРЕЖДАНЕ НА АНАЛИЗИТЕ...",
    error:
      "АНАЛИЗИТЕ НЕ МОЖАХА ДА СЕ ЗАРЕДЯТ",
    retry:
      "ОПИТАЙ ОТНОВО",
    totalUsers:
      "ОБЩО ПОТРЕБИТЕЛИ",
    new7:
      "НОВИ · 7 ДНИ",
    new30:
      "НОВИ · 30 ДНИ",
    growth:
      "РАСТЕЖ ЗА 30 ДНИ",
    coaches: "ТРЕНЬОРИ",
    premium:
      "АКТИВЕН PREMIUM",
    programs: "ПРОГРАМИ",
    workouts:
      "ЗАВЪРШЕНИ ТРЕНИРОВКИ",
    published:
      "ПУБЛИКУВАНИ",
    verified:
      "АКТИВНИ ПОТВЪРДЕНИ",
    last30:
      "ПОСЛЕДНИ 30 ДНИ",
    sales:
      "ПРОДАЖБИ НА ПРОГРАМИ",
    programRevenue:
      "ПРИХОДИ ОТ ПРОГРАМИ",
    noRevenue:
      "ВСЕ ОЩЕ НЯМА ПЛАТЕНИ ПРОДАЖБИ",
    total: "ОБЩО",
  },

  es: {
    eyebrow: "IRONAGE ADMIN",
    title: "ANALÍTICA",
    subtitle:
      "DATOS REALES · MÉTRICAS LIVE",
    loading:
      "CARGANDO ANALÍTICA...",
    error:
      "NO SE PUDO CARGAR LA ANALÍTICA",
    retry: "REINTENTAR",
    totalUsers:
      "USUARIOS TOTALES",
    new7:
      "NUEVOS · 7 DÍAS",
    new30:
      "NUEVOS · 30 DÍAS",
    growth:
      "CRECIMIENTO · 30 DÍAS",
    coaches:
      "ENTRENADORES",
    premium:
      "PREMIUM ACTIVO",
    programs: "PROGRAMAS",
    workouts:
      "ENTRENAMIENTOS COMPLETADOS",
    published:
      "PUBLICADOS",
    verified:
      "ACTIVOS VERIFICADOS",
    last30:
      "ÚLTIMOS 30 DÍAS",
    sales:
      "VENTAS DE PROGRAMAS",
    programRevenue:
      "INGRESOS DE PROGRAMAS",
    noRevenue:
      "AÚN NO HAY VENTAS PAGADAS",
    total: "TOTAL",
  },

  fr: {
    eyebrow: "IRONAGE ADMIN",
    title: "ANALYTIQUE",
    subtitle:
      "DONNÉES RÉELLES · MÉTRIQUES LIVE",
    loading:
      "CHARGEMENT...",
    error:
      "IMPOSSIBLE DE CHARGER LES ANALYSES",
    retry:
      "RÉESSAYER",
    totalUsers:
      "UTILISATEURS",
    new7:
      "NOUVEAUX · 7 JOURS",
    new30:
      "NOUVEAUX · 30 JOURS",
    growth:
      "CROISSANCE · 30 JOURS",
    coaches: "COACHS",
    premium:
      "PREMIUM ACTIF",
    programs:
      "PROGRAMMES",
    workouts:
      "ENTRAÎNEMENTS TERMINÉS",
    published:
      "PUBLIÉS",
    verified:
      "ACTIFS VÉRIFIÉS",
    last30:
      "30 DERNIERS JOURS",
    sales:
      "VENTES DE PROGRAMMES",
    programRevenue:
      "REVENUS DES PROGRAMMES",
    noRevenue:
      "AUCUNE VENTE PAYANTE",
    total: "TOTAL",
  },

  de: {
    eyebrow: "IRONAGE ADMIN",
    title: "ANALYTICS",
    subtitle:
      "ECHTE DATEN · LIVE-METRIKEN",
    loading:
      "ANALYTICS WERDEN GELADEN...",
    error:
      "ANALYTICS KONNTEN NICHT GELADEN WERDEN",
    retry:
      "ERNEUT VERSUCHEN",
    totalUsers:
      "BENUTZER GESAMT",
    new7:
      "NEU · 7 TAGE",
    new30:
      "NEU · 30 TAGE",
    growth:
      "WACHSTUM · 30 TAGE",
    coaches: "COACHES",
    premium:
      "AKTIVES PREMIUM",
    programs:
      "PROGRAMME",
    workouts:
      "ABGESCHLOSSENE TRAININGS",
    published:
      "VERÖFFENTLICHT",
    verified:
      "AKTIV VERIFIZIERT",
    last30:
      "LETZTE 30 TAGE",
    sales:
      "PROGRAMMVERKÄUFE",
    programRevenue:
      "PROGRAMMUMSATZ",
    noRevenue:
      "NOCH KEINE BEZAHLTEN VERKÄUFE",
    total: "GESAMT",
  },

  pt: {
    eyebrow: "IRONAGE ADMIN",
    title: "ANÁLISE",
    subtitle:
      "DADOS REAIS · MÉTRICAS LIVE",
    loading:
      "A CARREGAR ANÁLISES...",
    error:
      "NÃO FOI POSSÍVEL CARREGAR AS ANÁLISES",
    retry:
      "TENTAR NOVAMENTE",
    totalUsers:
      "UTILIZADORES",
    new7:
      "NOVOS · 7 DIAS",
    new30:
      "NOVOS · 30 DIAS",
    growth:
      "CRESCIMENTO · 30 DIAS",
    coaches:
      "TREINADORES",
    premium:
      "PREMIUM ATIVO",
    programs:
      "PROGRAMAS",
    workouts:
      "TREINOS CONCLUÍDOS",
    published:
      "PUBLICADOS",
    verified:
      "ATIVOS VERIFICADOS",
    last30:
      "ÚLTIMOS 30 DIAS",
    sales:
      "VENDAS DE PROGRAMAS",
    programRevenue:
      "RECEITA DE PROGRAMAS",
    noRevenue:
      "AINDA NÃO HÁ VENDAS PAGAS",
    total: "TOTAL",
  },
};

function formatMoney(
  cents: number,
  currency: string,
  language: AppLanguage
) {
  const locales:
    Record<
      AppLanguage,
      string
    > = {
      en: "en-US",
      es: "es-ES",
      uk: "uk-UA",
      ru: "ru-RU",
      fr: "fr-FR",
      de: "de-DE",
      pt: "pt-PT",
      bg: "bg-BG",
    };

  try {
    return new Intl.NumberFormat(
      locales[language],
      {
        style: "currency",
        currency,
      }
    ).format(
      cents / 100
    );
  } catch {
    return `${(
      cents / 100
    ).toFixed(2)} ${currency}`;
  }
}

export default function AdminAnalytics({
  onBack,
}: Props) {
  const {
    language,
    t,
  } = useLanguage();

  const copy =
    useMemo(
      () =>
        COPY[language],
      [language]
    );

  const [
    analytics,
    setAnalytics,
  ] =
    useState<
      AnalyticsResponse | null
    >(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] =
    useState(false);

  async function load() {
    try {
      setLoading(true);
      setError(false);

      const response =
        await api.get<AnalyticsResponse>(
          "/admin/analytics",
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true
      ) {
        throw new Error(
          "Invalid analytics response"
        );
      }

      setAnalytics(
        response
      );
    } catch (loadError) {
      console.error(
        "IRONAGE ADMIN ANALYTICS UI ERROR:",
        loadError
      );

      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const growth =
    analytics?.users
      .growthPercent ?? 0;

  return (
    <main className="admin-analytics">
      <div className="admin-analytics__shell">
        <header className="admin-analytics__header">
          <button
            type="button"
            className="admin-analytics__back"
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
          <div className="admin-analytics__state">
            {copy.loading}
          </div>
        )}

        {!loading &&
          error && (
            <div className="admin-analytics__state">
              <p>
                {copy.error}
              </p>

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
          analytics && (
            <>
              <section className="admin-analytics__hero-grid">
                <article className="admin-analytics__hero">
                  <span>
                    {
                      copy.totalUsers
                    }
                  </span>

                  <strong>
                    {
                      analytics
                        .users
                        .total
                    }
                  </strong>
                </article>

                <article className="admin-analytics__hero">
                  <span>
                    {copy.growth}
                  </span>

                  <strong
                    className={
                      growth >= 0
                        ? "admin-analytics__positive"
                        : "admin-analytics__negative"
                    }
                  >
                    {growth >= 0
                      ? "+"
                      : ""}
                    {growth}%
                  </strong>
                </article>
              </section>

              <section className="admin-analytics__grid">
                <article>
                  <span>
                    {copy.new7}
                  </span>

                  <strong>
                    {
                      analytics
                        .users
                        .new7Days
                    }
                  </strong>
                </article>

                <article>
                  <span>
                    {copy.new30}
                  </span>

                  <strong>
                    {
                      analytics
                        .users
                        .new30Days
                    }
                  </strong>
                </article>

                <article>
                  <span>
                    {
                      copy.coaches
                    }
                  </span>

                  <strong>
                    {
                      analytics
                        .coaches
                        .total
                    }
                  </strong>

                  <small>
                    {
                      analytics
                        .coaches
                        .activeVerified
                    }{" "}
                    {copy.verified}
                  </small>
                </article>

                <article>
                  <span>
                    {
                      copy.premium
                    }
                  </span>

                  <strong>
                    {
                      analytics
                        .premium
                        .activeUsers
                    }
                  </strong>
                </article>

                <article>
                  <span>
                    {
                      copy.programs
                    }
                  </span>

                  <strong>
                    {
                      analytics
                        .programs
                        .total
                    }
                  </strong>

                  <small>
                    {
                      analytics
                        .programs
                        .published
                    }{" "}
                    {copy.published}
                  </small>
                </article>

                <article>
                  <span>
                    {
                      copy.workouts
                    }
                  </span>

                  <strong>
                    {
                      analytics
                        .workouts
                        .completed
                    }
                  </strong>

                  <small>
                    {
                      analytics
                        .workouts
                        .completed30Days
                    }{" "}
                    {copy.last30}
                  </small>
                </article>

                <article>
                  <span>
                    {copy.sales}
                  </span>

                  <strong>
                    {
                      analytics
                        .sales
                        .total
                    }
                  </strong>

                  <small>
                    {
                      analytics
                        .sales
                        .last30Days
                    }{" "}
                    {copy.last30}
                  </small>
                </article>
              </section>

              <section className="admin-analytics__revenue">
                <div className="admin-analytics__section-title">
                  <span>
                    IRONAGE
                  </span>

                  <h2>
                    {
                      copy.programRevenue
                    }
                  </h2>
                </div>

                {analytics
                  .revenue
                  .length === 0 ? (
                  <div className="admin-analytics__empty">
                    {
                      copy.noRevenue
                    }
                  </div>
                ) : (
                  <div className="admin-analytics__revenue-list">
                    {analytics.revenue.map(
                      item => (
                        <article
                          key={
                            item.currency
                          }
                        >
                          <div>
                            <span>
                              {
                                item.currency
                              }
                            </span>

                            <strong>
                              {formatMoney(
                                item.grossCents,
                                item.currency,
                                language
                              )}
                            </strong>
                          </div>

                          <div className="admin-analytics__revenue-meta">
                            <span>
                              {
                                copy.total
                              }{" "}
                              {
                                item.sales
                              }{" "}
                              {copy.sales}
                            </span>

                            <span>
                              {
                                copy.last30
                              }:{" "}
                              {formatMoney(
                                item.last30Cents,
                                item.currency,
                                language
                              )}
                            </span>
                          </div>
                        </article>
                      )
                    )}
                  </div>
                )}
              </section>
            </>
          )}
      </div>
    </main>
  );
}
