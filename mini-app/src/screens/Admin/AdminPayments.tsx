import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import {
  useLanguage,
  type AppLanguage,
} from "../../context/LanguageContext";

import "./AdminPayments.css";

type Props = {
  onBack: () => void;
};

type UserInfo = {
  id: number;
  firstName: string;
  lastName: string | null;
  username: string | null;
  email: string | null;
};

type Subscription = {
  id: number;
  provider: string;
  platform: string;
  productId: string;
  plan: string;
  status: string;
  transactionId: string | null;
  originalTransactionId:
    string | null;
  purchasedAt: string | null;
  expiresAt: string | null;
  lastVerifiedAt:
    string | null;
  createdAt: string;
  user: UserInfo;
};

type Purchase = {
  id: number;
  provider: string;
  platform: string;
  productId: string;
  transactionId: string;
  originalTransactionId:
    string | null;
  amountCents: number | null;
  currency: string | null;
  purchasedAt: string;
  verifiedAt: string;
  createdAt: string;
  user: UserInfo;

  program: {
    id: number;
    name: string;
  };
};

type Revenue = {
  currency: string;
  amountCents: number;
  sales: number;
};

type Response = {
  success: boolean;

  summary: {
    subscriptions: number;
    activeSubscriptions: number;
    programPurchases: number;
    programRevenue:
      Revenue[];
  };

  subscriptions:
    Subscription[];

  programPurchases:
    Purchase[];
};

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  search: string;
  placeholder: string;
  loading: string;
  error: string;
  retry: string;

  subscriptions: string;
  active: string;
  purchases: string;
  revenue: string;

  premiumSubscriptions:
    string;
  programPurchases:
    string;
  noSubscriptions:
    string;
  noPurchases: string;

  user: string;
  provider: string;
  platform: string;
  plan: string;
  status: string;
  amount: string;
  program: string;
  purchased: string;
  expires: string;
  transaction: string;
  verified: string;
};

const COPY: Record<
  AppLanguage,
  Copy
> = {
  en: {
    eyebrow: "IRONAGE ADMIN",
    title:
      "PAYMENTS & SUBSCRIPTIONS",
    subtitle:
      "TRUSTED PAYMENT RECORDS",
    search: "SEARCH",
    placeholder:
      "Name, username or email",
    loading:
      "LOADING PAYMENTS...",
    error:
      "FAILED TO LOAD PAYMENTS",
    retry: "RETRY",
    subscriptions:
      "SUBSCRIPTIONS",
    active:
      "ACTIVE PREMIUM",
    purchases:
      "PROGRAM PURCHASES",
    revenue:
      "PROGRAM REVENUE",
    premiumSubscriptions:
      "PREMIUM SUBSCRIPTIONS",
    programPurchases:
      "PROGRAM PURCHASES",
    noSubscriptions:
      "NO SUBSCRIPTIONS FOUND",
    noPurchases:
      "NO PROGRAM PURCHASES FOUND",
    user: "USER",
    provider: "PROVIDER",
    platform: "PLATFORM",
    plan: "PLAN",
    status: "STATUS",
    amount: "AMOUNT",
    program: "PROGRAM",
    purchased: "PURCHASED",
    expires: "EXPIRES",
    transaction:
      "TRANSACTION",
    verified: "VERIFIED",
  },

  uk: {
    eyebrow: "IRONAGE ADMIN",
    title:
      "ПЛАТЕЖІ ТА ПІДПИСКИ",
    subtitle:
      "ПЕРЕВІРЕНІ ПЛАТІЖНІ ДАНІ",
    search: "ПОШУК",
    placeholder:
      "Ім’я, username або email",
    loading:
      "ЗАВАНТАЖЕННЯ ПЛАТЕЖІВ...",
    error:
      "НЕ ВДАЛОСЯ ЗАВАНТАЖИТИ ПЛАТЕЖІ",
    retry: "ПОВТОРИТИ",
    subscriptions:
      "ПІДПИСКИ",
    active:
      "АКТИВНИЙ PREMIUM",
    purchases:
      "ПОКУПКИ ПРОГРАМ",
    revenue:
      "ДОХІД ВІД ПРОГРАМ",
    premiumSubscriptions:
      "PREMIUM ПІДПИСКИ",
    programPurchases:
      "ПОКУПКИ ПРОГРАМ",
    noSubscriptions:
      "ПІДПИСОК НЕ ЗНАЙДЕНО",
    noPurchases:
      "ПОКУПОК ПРОГРАМ НЕ ЗНАЙДЕНО",
    user: "КОРИСТУВАЧ",
    provider: "ПРОВАЙДЕР",
    platform: "ПЛАТФОРМА",
    plan: "ПЛАН",
    status: "СТАТУС",
    amount: "СУМА",
    program: "ПРОГРАМА",
    purchased: "КУПЛЕНО",
    expires: "ДІЄ ДО",
    transaction:
      "ТРАНЗАКЦІЯ",
    verified:
      "ПЕРЕВІРЕНО",
  },

  ru: {
    eyebrow: "IRONAGE ADMIN",
    title:
      "ПЛАТЕЖИ И ПОДПИСКИ",
    subtitle:
      "ПРОВЕРЕННЫЕ ПЛАТЁЖНЫЕ ДАННЫЕ",
    search: "ПОИСК",
    placeholder:
      "Имя, username или email",
    loading:
      "ЗАГРУЗКА ПЛАТЕЖЕЙ...",
    error:
      "НЕ УДАЛОСЬ ЗАГРУЗИТЬ ПЛАТЕЖИ",
    retry: "ПОВТОРИТЬ",
    subscriptions:
      "ПОДПИСКИ",
    active:
      "АКТИВНЫЙ PREMIUM",
    purchases:
      "ПОКУПКИ ПРОГРАММ",
    revenue:
      "ДОХОД ОТ ПРОГРАММ",
    premiumSubscriptions:
      "PREMIUM ПОДПИСКИ",
    programPurchases:
      "ПОКУПКИ ПРОГРАММ",
    noSubscriptions:
      "ПОДПИСКИ НЕ НАЙДЕНЫ",
    noPurchases:
      "ПОКУПКИ ПРОГРАММ НЕ НАЙДЕНЫ",
    user: "ПОЛЬЗОВАТЕЛЬ",
    provider: "ПРОВАЙДЕР",
    platform: "ПЛАТФОРМА",
    plan: "ПЛАН",
    status: "СТАТУС",
    amount: "СУММА",
    program: "ПРОГРАММА",
    purchased: "КУПЛЕНО",
    expires:
      "ДЕЙСТВУЕТ ДО",
    transaction:
      "ТРАНЗАКЦИЯ",
    verified:
      "ПРОВЕРЕНО",
  },

  bg: {
    eyebrow: "IRONAGE ADMIN",
    title:
      "ПЛАЩАНИЯ И АБОНАМЕНТИ",
    subtitle:
      "ПРОВЕРЕНИ ДАННИ ЗА ПЛАЩАНИЯ",
    search: "ТЪРСЕНЕ",
    placeholder:
      "Име, username или email",
    loading:
      "ЗАРЕЖДАНЕ НА ПЛАЩАНИЯТА...",
    error:
      "ПЛАЩАНИЯТА НЕ МОЖАХА ДА СЕ ЗАРЕДЯТ",
    retry:
      "ОПИТАЙ ОТНОВО",
    subscriptions:
      "АБОНАМЕНТИ",
    active:
      "АКТИВЕН PREMIUM",
    purchases:
      "ПОКУПКИ НА ПРОГРАМИ",
    revenue:
      "ПРИХОДИ ОТ ПРОГРАМИ",
    premiumSubscriptions:
      "PREMIUM АБОНАМЕНТИ",
    programPurchases:
      "ПОКУПКИ НА ПРОГРАМИ",
    noSubscriptions:
      "НЯМА АБОНАМЕНТИ",
    noPurchases:
      "НЯМА ПОКУПКИ НА ПРОГРАМИ",
    user: "ПОТРЕБИТЕЛ",
    provider: "ДОСТАВЧИК",
    platform: "ПЛАТФОРМА",
    plan: "ПЛАН",
    status: "СТАТУС",
    amount: "СУМА",
    program: "ПРОГРАМА",
    purchased: "КУПЕНО",
    expires: "ИЗТИЧА",
    transaction:
      "ТРАНЗАКЦИЯ",
    verified:
      "ПОТВЪРДЕНО",
  },

  es: {
    eyebrow: "IRONAGE ADMIN",
    title:
      "PAGOS Y SUSCRIPCIONES",
    subtitle:
      "REGISTROS DE PAGO VERIFICADOS",
    search: "BUSCAR",
    placeholder:
      "Nombre, usuario o email",
    loading:
      "CARGANDO PAGOS...",
    error:
      "NO SE PUDIERON CARGAR LOS PAGOS",
    retry: "REINTENTAR",
    subscriptions:
      "SUSCRIPCIONES",
    active:
      "PREMIUM ACTIVO",
    purchases:
      "COMPRAS DE PROGRAMAS",
    revenue:
      "INGRESOS DE PROGRAMAS",
    premiumSubscriptions:
      "SUSCRIPCIONES PREMIUM",
    programPurchases:
      "COMPRAS DE PROGRAMAS",
    noSubscriptions:
      "NO HAY SUSCRIPCIONES",
    noPurchases:
      "NO HAY COMPRAS",
    user: "USUARIO",
    provider: "PROVEEDOR",
    platform: "PLATAFORMA",
    plan: "PLAN",
    status: "ESTADO",
    amount: "IMPORTE",
    program: "PROGRAMA",
    purchased: "COMPRADO",
    expires: "EXPIRA",
    transaction:
      "TRANSACCIÓN",
    verified:
      "VERIFICADO",
  },

  fr: {
    eyebrow: "IRONAGE ADMIN",
    title:
      "PAIEMENTS & ABONNEMENTS",
    subtitle:
      "DONNÉES DE PAIEMENT VÉRIFIÉES",
    search: "RECHERCHER",
    placeholder:
      "Nom, identifiant ou email",
    loading:
      "CHARGEMENT DES PAIEMENTS...",
    error:
      "IMPOSSIBLE DE CHARGER LES PAIEMENTS",
    retry: "RÉESSAYER",
    subscriptions:
      "ABONNEMENTS",
    active:
      "PREMIUM ACTIF",
    purchases:
      "ACHATS DE PROGRAMMES",
    revenue:
      "REVENUS DES PROGRAMMES",
    premiumSubscriptions:
      "ABONNEMENTS PREMIUM",
    programPurchases:
      "ACHATS DE PROGRAMMES",
    noSubscriptions:
      "AUCUN ABONNEMENT",
    noPurchases:
      "AUCUN ACHAT DE PROGRAMME",
    user: "UTILISATEUR",
    provider: "FOURNISSEUR",
    platform: "PLATEFORME",
    plan: "PLAN",
    status: "STATUT",
    amount: "MONTANT",
    program: "PROGRAMME",
    purchased: "ACHETÉ",
    expires: "EXPIRE",
    transaction:
      "TRANSACTION",
    verified:
      "VÉRIFIÉ",
  },

  de: {
    eyebrow: "IRONAGE ADMIN",
    title:
      "ZAHLUNGEN & ABOS",
    subtitle:
      "VERIFIZIERTE ZAHLUNGSDATEN",
    search: "SUCHEN",
    placeholder:
      "Name, Benutzername oder E-Mail",
    loading:
      "ZAHLUNGEN WERDEN GELADEN...",
    error:
      "ZAHLUNGEN KONNTEN NICHT GELADEN WERDEN",
    retry:
      "ERNEUT VERSUCHEN",
    subscriptions:
      "ABONNEMENTS",
    active:
      "AKTIVES PREMIUM",
    purchases:
      "PROGRAMMKÄUFE",
    revenue:
      "PROGRAMMUMSATZ",
    premiumSubscriptions:
      "PREMIUM-ABONNEMENTS",
    programPurchases:
      "PROGRAMMKÄUFE",
    noSubscriptions:
      "KEINE ABONNEMENTS",
    noPurchases:
      "KEINE PROGRAMMKÄUFE",
    user: "BENUTZER",
    provider: "ANBIETER",
    platform: "PLATTFORM",
    plan: "PLAN",
    status: "STATUS",
    amount: "BETRAG",
    program: "PROGRAMM",
    purchased: "GEKAUFT",
    expires: "LÄUFT AB",
    transaction:
      "TRANSAKTION",
    verified:
      "VERIFIZIERT",
  },

  pt: {
    eyebrow: "IRONAGE ADMIN",
    title:
      "PAGAMENTOS E SUBSCRIÇÕES",
    subtitle:
      "REGISTOS DE PAGAMENTO VERIFICADOS",
    search: "PESQUISAR",
    placeholder:
      "Nome, utilizador ou email",
    loading:
      "A CARREGAR PAGAMENTOS...",
    error:
      "NÃO FOI POSSÍVEL CARREGAR OS PAGAMENTOS",
    retry:
      "TENTAR NOVAMENTE",
    subscriptions:
      "SUBSCRIÇÕES",
    active:
      "PREMIUM ATIVO",
    purchases:
      "COMPRAS DE PROGRAMAS",
    revenue:
      "RECEITA DE PROGRAMAS",
    premiumSubscriptions:
      "SUBSCRIÇÕES PREMIUM",
    programPurchases:
      "COMPRAS DE PROGRAMAS",
    noSubscriptions:
      "NÃO HÁ SUBSCRIÇÕES",
    noPurchases:
      "NÃO HÁ COMPRAS DE PROGRAMAS",
    user: "UTILIZADOR",
    provider: "FORNECEDOR",
    platform: "PLATAFORMA",
    plan: "PLANO",
    status: "ESTADO",
    amount: "VALOR",
    program: "PROGRAMA",
    purchased: "COMPRADO",
    expires: "EXPIRA",
    transaction:
      "TRANSAÇÃO",
    verified:
      "VERIFICADO",
  },
};

const LOCALES:
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

function formatDate(
  value: string | null,
  language: AppLanguage
) {
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
    LOCALES[language],
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(date);
}

function formatMoney(
  amount: number | null,
  currency: string | null,
  language: AppLanguage
) {
  if (
    amount === null ||
    !currency
  ) {
    return "—";
  }

  try {
    return new Intl.NumberFormat(
      LOCALES[language],
      {
        style: "currency",
        currency,
      }
    ).format(
      amount / 100
    );
  } catch {
    return `${(
      amount / 100
    ).toFixed(2)} ${currency}`;
  }
}

function shortId(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  if (
    value.length <= 22
  ) {
    return value;
  }

  return `${value.slice(
    0,
    9
  )}…${value.slice(-9)}`;
}

function userName(
  user: UserInfo
) {
  const name =
    [
      user.firstName,
      user.lastName,
    ]
      .filter(Boolean)
      .join(" ");

  return (
    name ||
    user.username ||
    user.email ||
    `#${user.id}`
  );
}

export default function AdminPayments({
  onBack,
}: Props) {
  const {
    language,
  } = useLanguage();

  const copy =
    useMemo(
      () =>
        COPY[language],
      [language]
    );

  const [
    data,
    setData,
  ] =
    useState<Response | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(false);

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError(false);

      const params =
        new URLSearchParams();

      params.set(
        "limit",
        "50"
      );

      if (search) {
        params.set(
          "search",
          search
        );
      }

      const response =
        await api.get<Response>(
          `/admin/payments?${params.toString()}`,
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true
      ) {
        throw new Error(
          "Invalid admin payments response"
        );
      }

      setData(response);
    } catch (loadError) {
      console.error(
        "IRONAGE ADMIN PAYMENTS UI ERROR:",
        loadError
      );

      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [search]);

  function submitSearch(
    event: FormEvent
  ) {
    event.preventDefault();

    setSearch(
      searchInput.trim()
    );
  }

  return (
    <main className="admin-payments">
      <div className="admin-payments__shell">
        <header className="admin-payments__header">
          <button
            type="button"
            className="admin-payments__back"
            onClick={onBack}
            aria-label="Back"
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

        <form
          className="admin-payments__search"
          onSubmit={
            submitSearch
          }
        >
          <input
            value={
              searchInput
            }
            onChange={event =>
              setSearchInput(
                event.target.value
              )
            }
            placeholder={
              copy.placeholder
            }
          />

          <button type="submit">
            {copy.search}
          </button>
        </form>

        {loading && (
          <div className="admin-payments__state">
            {copy.loading}
          </div>
        )}

        {!loading &&
          error && (
            <div className="admin-payments__state">
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
          data && (
            <>
              <section className="admin-payments__stats">
                <article>
                  <span>
                    {
                      copy.subscriptions
                    }
                  </span>

                  <strong>
                    {
                      data.summary
                        .subscriptions
                    }
                  </strong>
                </article>

                <article>
                  <span>
                    {copy.active}
                  </span>

                  <strong>
                    {
                      data.summary
                        .activeSubscriptions
                    }
                  </strong>
                </article>

                <article>
                  <span>
                    {copy.purchases}
                  </span>

                  <strong>
                    {
                      data.summary
                        .programPurchases
                    }
                  </strong>
                </article>
              </section>

              <section className="admin-payments__section">
                <div className="admin-payments__section-title">
                  <span>
                    IRONAGE
                  </span>

                  <h2>
                    {copy.revenue}
                  </h2>
                </div>

                {data.summary
                  .programRevenue
                  .length === 0 ? (
                  <div className="admin-payments__empty">
                    —
                  </div>
                ) : (
                  <div className="admin-payments__revenue">
                    {data.summary.programRevenue.map(
                      item => (
                        <article
                          key={
                            item.currency
                          }
                        >
                          <span>
                            {
                              item.currency
                            }
                          </span>

                          <strong>
                            {formatMoney(
                              item.amountCents,
                              item.currency,
                              language
                            )}
                          </strong>

                          <small>
                            {
                              item.sales
                            }{" "}
                            {copy.purchases}
                          </small>
                        </article>
                      )
                    )}
                  </div>
                )}
              </section>

              <section className="admin-payments__section">
                <div className="admin-payments__section-title">
                  <span>
                    PREMIUM
                  </span>

                  <h2>
                    {
                      copy.premiumSubscriptions
                    }
                  </h2>
                </div>

                {data.subscriptions
                  .length === 0 ? (
                  <div className="admin-payments__empty">
                    {
                      copy.noSubscriptions
                    }
                  </div>
                ) : (
                  <div className="admin-payments__list">
                    {data.subscriptions.map(
                      item => (
                        <article
                          key={
                            item.id
                          }
                          className="admin-payments__card"
                        >
                          <div className="admin-payments__card-head">
                            <div>
                              <small>
                                USER #
                                {
                                  item
                                    .user
                                    .id
                                }
                              </small>

                              <h3>
                                {userName(
                                  item.user
                                )}
                              </h3>

                              {item.user
                                .email && (
                                <p>
                                  {
                                    item
                                      .user
                                      .email
                                  }
                                </p>
                              )}
                            </div>

                            <span className="admin-payments__status">
                              {
                                item.status
                              }
                            </span>
                          </div>

                          <div className="admin-payments__meta">
                            <div>
                              <span>
                                {
                                  copy.plan
                                }
                              </span>
                              <strong>
                                {
                                  item.plan
                                }
                              </strong>
                            </div>

                            <div>
                              <span>
                                {
                                  copy.provider
                                }
                              </span>
                              <strong>
                                {
                                  item.provider
                                }
                              </strong>
                            </div>

                            <div>
                              <span>
                                {
                                  copy.platform
                                }
                              </span>
                              <strong>
                                {
                                  item.platform
                                }
                              </strong>
                            </div>

                            <div>
                              <span>
                                {
                                  copy.purchased
                                }
                              </span>
                              <strong>
                                {formatDate(
                                  item.purchasedAt ??
                                    item.createdAt,
                                  language
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>
                                {
                                  copy.expires
                                }
                              </span>
                              <strong>
                                {formatDate(
                                  item.expiresAt,
                                  language
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>
                                {
                                  copy.transaction
                                }
                              </span>
                              <strong>
                                {shortId(
                                  item.transactionId
                                )}
                              </strong>
                            </div>
                          </div>
                        </article>
                      )
                    )}
                  </div>
                )}
              </section>

              <section className="admin-payments__section">
                <div className="admin-payments__section-title">
                  <span>
                    PROGRAMS
                  </span>

                  <h2>
                    {
                      copy.programPurchases
                    }
                  </h2>
                </div>

                {data.programPurchases
                  .length === 0 ? (
                  <div className="admin-payments__empty">
                    {
                      copy.noPurchases
                    }
                  </div>
                ) : (
                  <div className="admin-payments__list">
                    {data.programPurchases.map(
                      item => (
                        <article
                          key={
                            item.id
                          }
                          className="admin-payments__card"
                        >
                          <div className="admin-payments__card-head">
                            <div>
                              <small>
                                USER #
                                {
                                  item
                                    .user
                                    .id
                                }
                              </small>

                              <h3>
                                {userName(
                                  item.user
                                )}
                              </h3>

                              {item.user
                                .email && (
                                <p>
                                  {
                                    item
                                      .user
                                      .email
                                  }
                                </p>
                              )}
                            </div>

                            <strong className="admin-payments__amount">
                              {formatMoney(
                                item.amountCents,
                                item.currency,
                                language
                              )}
                            </strong>
                          </div>

                          <div className="admin-payments__program">
                            {
                              item.program
                                .name
                            }
                          </div>

                          <div className="admin-payments__meta">
                            <div>
                              <span>
                                {
                                  copy.provider
                                }
                              </span>
                              <strong>
                                {
                                  item.provider
                                }
                              </strong>
                            </div>

                            <div>
                              <span>
                                {
                                  copy.platform
                                }
                              </span>
                              <strong>
                                {
                                  item.platform
                                }
                              </strong>
                            </div>

                            <div>
                              <span>
                                {
                                  copy.purchased
                                }
                              </span>
                              <strong>
                                {formatDate(
                                  item.purchasedAt,
                                  language
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>
                                {
                                  copy.verified
                                }
                              </span>
                              <strong>
                                {formatDate(
                                  item.verifiedAt,
                                  language
                                )}
                              </strong>
                            </div>

                            <div className="admin-payments__wide">
                              <span>
                                {
                                  copy.transaction
                                }
                              </span>
                              <strong>
                                {shortId(
                                  item.transactionId
                                )}
                              </strong>
                            </div>
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
