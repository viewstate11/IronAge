import {
  useEffect,
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

import "./AdminUsers.css";

type Props = {
  onBack: () => void;
};

type AdminUser = {
  id: number;
  firstName: string;
  lastName: string | null;
  username: string | null;
  telegramId: string | null;
  webId: string | null;
  languageCode: string | null;
  onboardingCompleted: boolean;
  premiumPlan: string | null;
  level: number;
  xp: number;
  workouts: number;
  streak: number;
  createdAt: string;

  isCoach: boolean;
  isClient: boolean;
  coachId: number | null;

  coachProfile: {
    displayName: string;
    isVerified: boolean;
    isActive: boolean;
  } | null;

  authIdentities: Array<{
    provider:
      | "EMAIL"
      | "GOOGLE"
      | "APPLE";
    email: string | null;
    emailVerified: boolean;
  }>;

  latestSubscription: {
    plan: string;
    status: string;
    expiresAt: string | null;
  } | null;
};

type UsersResponse = {
  success: boolean;

  users: AdminUser[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  search: string;
  searchPlaceholder: string;
  loading: string;
  error: string;
  retry: string;
  total: string;
  noUsers: string;
  athlete: string;
  coach: string;
  client: string;
  premium: string;
  free: string;
  verified: string;
  inactive: string;
  joined: string;
  auth: string;
  level: string;
  workouts: string;
  previous: string;
  next: string;
};

const COPY: Record<
  AppLanguage,
  Copy
> = {
  en: {
    eyebrow: "IRONAGE ADMIN",
    title: "USERS",
    subtitle:
      "Manage and review IRONAGE accounts.",
    search: "SEARCH",
    searchPlaceholder:
      "Name, username or email",
    loading: "LOADING USERS...",
    error:
      "FAILED TO LOAD USERS",
    retry: "RETRY",
    total: "TOTAL USERS",
    noUsers: "NO USERS FOUND",
    athlete: "ATHLETE",
    coach: "COACH",
    client: "CLIENT",
    premium: "PREMIUM",
    free: "FREE",
    verified: "VERIFIED",
    inactive: "INACTIVE",
    joined: "JOINED",
    auth: "AUTH",
    level: "LEVEL",
    workouts: "WORKOUTS",
    previous: "PREVIOUS",
    next: "NEXT",
  },

  uk: {
    eyebrow: "IRONAGE ADMIN",
    title: "КОРИСТУВАЧІ",
    subtitle:
      "Перегляд і керування акаунтами IRONAGE.",
    search: "ПОШУК",
    searchPlaceholder:
      "Ім’я, username або email",
    loading:
      "ЗАВАНТАЖЕННЯ КОРИСТУВАЧІВ...",
    error:
      "НЕ ВДАЛОСЯ ЗАВАНТАЖИТИ КОРИСТУВАЧІВ",
    retry: "ПОВТОРИТИ",
    total:
      "УСЬОГО КОРИСТУВАЧІВ",
    noUsers:
      "КОРИСТУВАЧІВ НЕ ЗНАЙДЕНО",
    athlete: "СПОРТСМЕН",
    coach: "ТРЕНЕР",
    client: "КЛІЄНТ",
    premium: "PREMIUM",
    free: "FREE",
    verified: "ПІДТВЕРДЖЕНО",
    inactive: "НЕАКТИВНИЙ",
    joined: "РЕЄСТРАЦІЯ",
    auth: "ВХІД",
    level: "РІВЕНЬ",
    workouts: "ТРЕНУВАННЯ",
    previous: "НАЗАД",
    next: "ДАЛІ",
  },

  ru: {
    eyebrow: "IRONAGE ADMIN",
    title: "ПОЛЬЗОВАТЕЛИ",
    subtitle:
      "Просмотр и управление аккаунтами IRONAGE.",
    search: "ПОИСК",
    searchPlaceholder:
      "Имя, username или email",
    loading:
      "ЗАГРУЗКА ПОЛЬЗОВАТЕЛЕЙ...",
    error:
      "НЕ УДАЛОСЬ ЗАГРУЗИТЬ ПОЛЬЗОВАТЕЛЕЙ",
    retry: "ПОВТОРИТЬ",
    total:
      "ВСЕГО ПОЛЬЗОВАТЕЛЕЙ",
    noUsers:
      "ПОЛЬЗОВАТЕЛИ НЕ НАЙДЕНЫ",
    athlete: "СПОРТСМЕН",
    coach: "ТРЕНЕР",
    client: "КЛИЕНТ",
    premium: "PREMIUM",
    free: "FREE",
    verified: "ПОДТВЕРЖДЁН",
    inactive: "НЕАКТИВЕН",
    joined: "РЕГИСТРАЦИЯ",
    auth: "ВХОД",
    level: "УРОВЕНЬ",
    workouts: "ТРЕНИРОВКИ",
    previous: "НАЗАД",
    next: "ДАЛЕЕ",
  },

  bg: {
    eyebrow: "IRONAGE ADMIN",
    title: "ПОТРЕБИТЕЛИ",
    subtitle:
      "Преглед и управление на IRONAGE акаунти.",
    search: "ТЪРСЕНЕ",
    searchPlaceholder:
      "Име, username или email",
    loading:
      "ЗАРЕЖДАНЕ НА ПОТРЕБИТЕЛИТЕ...",
    error:
      "ПОТРЕБИТЕЛИТЕ НЕ МОЖАХА ДА СЕ ЗАРЕДЯТ",
    retry: "ОПИТАЙ ОТНОВО",
    total:
      "ОБЩО ПОТРЕБИТЕЛИ",
    noUsers:
      "НЯМА НАМЕРЕНИ ПОТРЕБИТЕЛИ",
    athlete: "СПОРТИСТ",
    coach: "ТРЕНЬОР",
    client: "КЛИЕНТ",
    premium: "PREMIUM",
    free: "FREE",
    verified: "ПОТВЪРДЕН",
    inactive: "НЕАКТИВЕН",
    joined: "РЕГИСТРАЦИЯ",
    auth: "ВХОД",
    level: "НИВО",
    workouts: "ТРЕНИРОВКИ",
    previous: "НАЗАД",
    next: "НАПРЕД",
  },

  es: {
    eyebrow: "IRONAGE ADMIN",
    title: "USUARIOS",
    subtitle:
      "Revisa y gestiona cuentas de IRONAGE.",
    search: "BUSCAR",
    searchPlaceholder:
      "Nombre, usuario o email",
    loading:
      "CARGANDO USUARIOS...",
    error:
      "NO SE PUDIERON CARGAR LOS USUARIOS",
    retry: "REINTENTAR",
    total: "USUARIOS TOTALES",
    noUsers:
      "NO SE ENCONTRARON USUARIOS",
    athlete: "ATLETA",
    coach: "ENTRENADOR",
    client: "CLIENTE",
    premium: "PREMIUM",
    free: "FREE",
    verified: "VERIFICADO",
    inactive: "INACTIVO",
    joined: "REGISTRO",
    auth: "ACCESO",
    level: "NIVEL",
    workouts: "ENTRENAMIENTOS",
    previous: "ANTERIOR",
    next: "SIGUIENTE",
  },

  fr: {
    eyebrow: "IRONAGE ADMIN",
    title: "UTILISATEURS",
    subtitle:
      "Consultez et gérez les comptes IRONAGE.",
    search: "RECHERCHER",
    searchPlaceholder:
      "Nom, identifiant ou email",
    loading:
      "CHARGEMENT DES UTILISATEURS...",
    error:
      "IMPOSSIBLE DE CHARGER LES UTILISATEURS",
    retry: "RÉESSAYER",
    total:
      "UTILISATEURS AU TOTAL",
    noUsers:
      "AUCUN UTILISATEUR TROUVÉ",
    athlete: "ATHLÈTE",
    coach: "COACH",
    client: "CLIENT",
    premium: "PREMIUM",
    free: "FREE",
    verified: "VÉRIFIÉ",
    inactive: "INACTIF",
    joined: "INSCRIPTION",
    auth: "CONNEXION",
    level: "NIVEAU",
    workouts: "ENTRAÎNEMENTS",
    previous: "PRÉCÉDENT",
    next: "SUIVANT",
  },

  de: {
    eyebrow: "IRONAGE ADMIN",
    title: "BENUTZER",
    subtitle:
      "IRONAGE-Konten prüfen und verwalten.",
    search: "SUCHEN",
    searchPlaceholder:
      "Name, Benutzername oder E-Mail",
    loading:
      "BENUTZER WERDEN GELADEN...",
    error:
      "BENUTZER KONNTEN NICHT GELADEN WERDEN",
    retry:
      "ERNEUT VERSUCHEN",
    total: "BENUTZER GESAMT",
    noUsers:
      "KEINE BENUTZER GEFUNDEN",
    athlete: "ATHLET",
    coach: "COACH",
    client: "KUNDE",
    premium: "PREMIUM",
    free: "FREE",
    verified: "VERIFIZIERT",
    inactive: "INAKTIV",
    joined: "REGISTRIERT",
    auth: "ANMELDUNG",
    level: "LEVEL",
    workouts: "TRAININGS",
    previous: "ZURÜCK",
    next: "WEITER",
  },

  pt: {
    eyebrow: "IRONAGE ADMIN",
    title: "UTILIZADORES",
    subtitle:
      "Revê e gere contas IRONAGE.",
    search: "PESQUISAR",
    searchPlaceholder:
      "Nome, utilizador ou email",
    loading:
      "A CARREGAR UTILIZADORES...",
    error:
      "NÃO FOI POSSÍVEL CARREGAR OS UTILIZADORES",
    retry:
      "TENTAR NOVAMENTE",
    total:
      "TOTAL DE UTILIZADORES",
    noUsers:
      "NENHUM UTILIZADOR ENCONTRADO",
    athlete: "ATLETA",
    coach: "TREINADOR",
    client: "CLIENTE",
    premium: "PREMIUM",
    free: "FREE",
    verified: "VERIFICADO",
    inactive: "INATIVO",
    joined: "REGISTO",
    auth: "ACESSO",
    level: "NÍVEL",
    workouts: "TREINOS",
    previous: "ANTERIOR",
    next: "SEGUINTE",
  },
};

export default function AdminUsers({
  onBack,
}: Props) {
  const { language, t } =
    useLanguage();

  const copy =
    COPY[language];

  const [
    users,
    setUsers,
  ] =
    useState<AdminUser[]>([]);

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

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    pagination,
    setPagination,
  ] = useState({
    page: 1,
    limit: 25,
    total: 0,
    pages: 1,
  });

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);

      const params =
        new URLSearchParams();

      params.set(
        "page",
        String(page)
      );

      params.set(
        "limit",
        "25"
      );

      if (search) {
        params.set(
          "search",
          search
        );
      }

      const response =
        await api.get<UsersResponse>(
          `/admin/users?${params.toString()}`,
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        !Array.isArray(
          response.users
        )
      ) {
        throw new Error(
          "Invalid admin users response"
        );
      }

      setUsers(
        response.users
      );

      setPagination(
        response.pagination
      );
    } catch (loadError) {
      console.error(
        "IRONAGE ADMIN USERS UI ERROR:",
        loadError
      );

      setError(
        copy.error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, [page, search]);

  function submitSearch(
    event: FormEvent
  ) {
    event.preventDefault();

    setPage(1);

    setSearch(
      searchInput.trim()
    );
  }

  return (
    <main className="admin-users">
      <div className="admin-users__shell">
        <header className="admin-users__header">
          <button
            type="button"
            className="admin-users__back"
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

        <form
          className="admin-users__search"
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
              copy.searchPlaceholder
            }
          />

          <button type="submit">
            {copy.search}
          </button>
        </form>

        <section className="admin-users__summary">
          <span>
            {copy.total}
          </span>

          <strong>
            {pagination.total}
          </strong>
        </section>

        {loading && (
          <div className="admin-users__state">
            {copy.loading}
          </div>
        )}

        {!loading &&
          error && (
            <div className="admin-users__state">
              <p>{error}</p>

              <button
                type="button"
                onClick={() => {
                  void loadUsers();
                }}
              >
                {copy.retry}
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          users.length === 0 && (
            <div className="admin-users__state">
              {copy.noUsers}
            </div>
          )}

        {!loading &&
          !error &&
          users.length > 0 && (
            <section className="admin-users__list">
              {users.map(user => {
                const email =
                  user.authIdentities
                    .find(
                      identity =>
                        identity.email
                    )
                    ?.email ??
                  null;

                const providers =
                  user.authIdentities
                    .map(
                      identity =>
                        identity.provider
                    );

                if (
                  user.telegramId
                ) {
                  providers.push(
                    "TELEGRAM" as never
                  );
                }

                const premium =
                  Boolean(
                    user.premiumPlan ||
                    user
                      .latestSubscription
                      ?.status ===
                      "ACTIVE"
                  );

                return (
                  <article
                    key={user.id}
                    className="admin-users__card"
                  >
                    <div className="admin-users__card-top">
                      <div>
                        <small>
                          ID {user.id}
                        </small>

                        <h2>
                          {[
                            user.firstName,
                            user.lastName,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              " "
                            )}
                        </h2>

                        {user.username && (
                          <p>
                            @
                            {
                              user.username
                            }
                          </p>
                        )}

                        {email && (
                          <p>
                            {email}
                          </p>
                        )}
                      </div>

                      <span
                        className={
                          premium
                            ? "admin-users__plan admin-users__plan--premium"
                            : "admin-users__plan"
                        }
                      >
                        {premium
                          ? copy.premium
                          : copy.free}
                      </span>
                    </div>

                    <div className="admin-users__badges">
                      {!user.isCoach &&
                        !user.isClient && (
                          <span>
                            {
                              copy.athlete
                            }
                          </span>
                        )}

                      {user.isClient && (
                        <span>
                          {
                            copy.client
                          }
                        </span>
                      )}

                      {user.isCoach && (
                        <span>
                          {copy.coach}
                        </span>
                      )}

                      {user
                        .coachProfile
                        ?.isVerified && (
                        <span className="admin-users__badge--gold">
                          {
                            copy.verified
                          }
                        </span>
                      )}

                      {user
                        .coachProfile &&
                        !user
                          .coachProfile
                          .isActive && (
                          <span className="admin-users__badge--danger">
                            {
                              copy.inactive
                            }
                          </span>
                        )}
                    </div>

                    <div className="admin-users__meta">
                      <div>
                        <span>
                          {copy.auth}
                        </span>

                        <strong>
                          {providers
                            .length
                            ? Array.from(
                                new Set(
                                  providers
                                )
                              ).join(
                                " · "
                              )
                            : "—"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          {copy.level}
                        </span>

                        <strong>
                          {
                            user.level
                          }
                        </strong>
                      </div>

                      <div>
                        <span>
                          {
                            copy.workouts
                          }
                        </span>

                        <strong>
                          {
                            user.workouts
                          }
                        </strong>
                      </div>

                      <div>
                        <span>
                          {copy.joined}
                        </span>

                        <strong>
                          {new Date(
                            user.createdAt
                          ).toLocaleDateString()}
                        </strong>
                      </div>
                    </div>

                    {user.isClient &&
                      user.coachId && (
                        <div className="admin-users__coach-link">
                          Coach ID:{" "}
                          {
                            user.coachId
                          }
                        </div>
                      )}
                  </article>
                );
              })}
            </section>
          )}

        {!loading &&
          !error &&
          pagination.pages > 1 && (
            <footer className="admin-users__pagination">
              <button
                type="button"
                disabled={
                  page <= 1
                }
                onClick={() =>
                  setPage(
                    current =>
                      Math.max(
                        1,
                        current - 1
                      )
                  )
                }
              >
                {copy.previous}
              </button>

              <span>
                {pagination.page}
                {" / "}
                {pagination.pages}
              </span>

              <button
                type="button"
                disabled={
                  page >=
                  pagination.pages
                }
                onClick={() =>
                  setPage(
                    current =>
                      current + 1
                  )
                }
              >
                {copy.next}
              </button>
            </footer>
          )}
      </div>
    </main>
  );
}
