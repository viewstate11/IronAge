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

import "./AdminCoaches.css";

type Props = {
  onBack: () => void;
};

type PendingCoach = {
  id: number;
  userId: number;
  displayName: string;
  bio: string | null;
  specialization: string | null;
  photoUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  user: {
    id: number;
    firstName: string;
    lastName: string | null;
    username: string | null;
    createdAt: string;
  };
};

type PendingResponse = {
  success: boolean;
  coaches: PendingCoach[];
  total: number;
};

type ActionResponse = {
  success: boolean;
  status: "APPROVED" | "REJECTED";
};

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  loading: string;
  error: string;
  retry: string;
  pending: string;
  noPending: string;
  noPendingText: string;
  specialization: string;
  submitted: string;
  approve: string;
  approving: string;
  reject: string;
  rejecting: string;
  about: string;
};

const COPY: Record<AppLanguage, Copy> = {
  en: {
    eyebrow: "IRONAGE ADMIN",
    title: "COACH APPROVAL",
    subtitle: "REVIEW · APPROVE · CONTROL",
    loading: "LOADING COACH APPLICATIONS...",
    error: "ADMIN LOAD ERROR",
    retry: "RETRY",
    pending: "PENDING COACHES",
    noPending: "NO PENDING COACHES",
    noPendingText: "There are no coach applications waiting for review.",
    specialization: "SPECIALIZATION",
    submitted: "SUBMITTED",
    approve: "APPROVE",
    approving: "APPROVING...",
    reject: "REJECT",
    rejecting: "REJECTING...",
    about: "ABOUT",
  },

  es: {
    eyebrow: "ADMIN IRONAGE",
    title: "APROBACIÓN DE ENTRENADORES",
    subtitle: "REVISAR · APROBAR · CONTROLAR",
    loading: "CARGANDO SOLICITUDES...",
    error: "ERROR DEL PANEL ADMIN",
    retry: "REINTENTAR",
    pending: "ENTRENADORES PENDIENTES",
    noPending: "NO HAY SOLICITUDES",
    noPendingText: "No hay solicitudes de entrenadores pendientes de revisión.",
    specialization: "ESPECIALIZACIÓN",
    submitted: "ENVIADO",
    approve: "APROBAR",
    approving: "APROBANDO...",
    reject: "RECHAZAR",
    rejecting: "RECHAZANDO...",
    about: "SOBRE EL ENTRENADOR",
  },

  uk: {
    eyebrow: "IRONAGE ADMIN",
    title: "ПЕРЕВІРКА ТРЕНЕРІВ",
    subtitle: "ПЕРЕВІРКА · СХВАЛЕННЯ · КОНТРОЛЬ",
    loading: "ЗАВАНТАЖЕННЯ ЗАЯВОК...",
    error: "ПОМИЛКА ADMIN PANEL",
    retry: "СПРОБУВАТИ ЗНОВУ",
    pending: "ЗАЯВКИ ТРЕНЕРІВ",
    noPending: "НЕМАЄ НОВИХ ЗАЯВОК",
    noPendingText: "Зараз немає профілів тренерів, які очікують перевірки.",
    specialization: "СПЕЦІАЛІЗАЦІЯ",
    submitted: "ПОДАНО",
    approve: "СХВАЛИТИ",
    approving: "СХВАЛЕННЯ...",
    reject: "ВІДХИЛИТИ",
    rejecting: "ВІДХИЛЕННЯ...",
    about: "ПРО ТРЕНЕРА",
  },

  ru: {
    eyebrow: "IRONAGE ADMIN",
    title: "ПРОВЕРКА ТРЕНЕРОВ",
    subtitle: "ПРОВЕРКА · ОДОБРЕНИЕ · КОНТРОЛЬ",
    loading: "ЗАГРУЗКА ЗАЯВОК...",
    error: "ОШИБКА ADMIN PANEL",
    retry: "ПОВТОРИТЬ",
    pending: "ЗАЯВКИ ТРЕНЕРОВ",
    noPending: "НЕТ НОВЫХ ЗАЯВОК",
    noPendingText: "Сейчас нет профилей тренеров, ожидающих проверки.",
    specialization: "СПЕЦИАЛИЗАЦИЯ",
    submitted: "ПОДАНО",
    approve: "ОДОБРИТЬ",
    approving: "ОДОБРЕНИЕ...",
    reject: "ОТКЛОНИТЬ",
    rejecting: "ОТКЛОНЕНИЕ...",
    about: "О ТРЕНЕРЕ",
  },

  fr: {
    eyebrow: "IRONAGE ADMIN",
    title: "VALIDATION DES COACHS",
    subtitle: "VÉRIFIER · APPROUVER · CONTRÔLER",
    loading: "CHARGEMENT DES CANDIDATURES...",
    error: "ERREUR ADMIN",
    retry: "RÉESSAYER",
    pending: "COACHS EN ATTENTE",
    noPending: "AUCUNE CANDIDATURE",
    noPendingText: "Aucun profil coach n'attend actuellement de validation.",
    specialization: "SPÉCIALISATION",
    submitted: "SOUMIS",
    approve: "APPROUVER",
    approving: "APPROBATION...",
    reject: "REJETER",
    rejecting: "REJET...",
    about: "À PROPOS",
  },

  de: {
    eyebrow: "IRONAGE ADMIN",
    title: "COACH-FREIGABE",
    subtitle: "PRÜFEN · FREIGEBEN · KONTROLLIEREN",
    loading: "COACH-ANTRÄGE WERDEN GELADEN...",
    error: "ADMIN-FEHLER",
    retry: "ERNEUT VERSUCHEN",
    pending: "AUSSTEHENDE COACHES",
    noPending: "KEINE OFFENEN ANTRÄGE",
    noPendingText: "Derzeit warten keine Coach-Profile auf Prüfung.",
    specialization: "SPEZIALISIERUNG",
    submitted: "EINGEREICHT",
    approve: "FREIGEBEN",
    approving: "FREIGABE...",
    reject: "ABLEHNEN",
    rejecting: "ABLEHNUNG...",
    about: "ÜBER DEN COACH",
  },

  pt: {
    eyebrow: "IRONAGE ADMIN",
    title: "APROVAÇÃO DE TREINADORES",
    subtitle: "REVISAR · APROVAR · CONTROLAR",
    loading: "CARREGANDO SOLICITAÇÕES...",
    error: "ERRO DO ADMIN",
    retry: "TENTAR NOVAMENTE",
    pending: "TREINADORES PENDENTES",
    noPending: "NENHUMA SOLICITAÇÃO",
    noPendingText: "Não há perfis de treinadores aguardando análise.",
    specialization: "ESPECIALIZAÇÃO",
    submitted: "ENVIADO",
    approve: "APROVAR",
    approving: "APROVANDO...",
    reject: "REJEITAR",
    rejecting: "REJEITANDO...",
    about: "SOBRE",
  },

  bg: {
    eyebrow: "IRONAGE ADMIN",
    title: "ОДОБРЕНИЕ НА ТРЕНЬОРИ",
    subtitle: "ПРЕГЛЕД · ОДОБРЕНИЕ · КОНТРОЛ",
    loading: "ЗАРЕЖДАНЕ НА ЗАЯВКИТЕ...",
    error: "ГРЕШКА В ADMIN PANEL",
    retry: "ОПИТАЙ ОТНОВО",
    pending: "ЧАКАЩИ ТРЕНЬОРИ",
    noPending: "НЯМА НОВИ ЗАЯВКИ",
    noPendingText: "В момента няма профили на треньори, които чакат преглед.",
    specialization: "СПЕЦИАЛИЗАЦИЯ",
    submitted: "ПОДАДЕНО",
    approve: "ОДОБРИ",
    approving: "ОДОБРЯВАНЕ...",
    reject: "ОТХВЪРЛИ",
    rejecting: "ОТХВЪРЛЯНЕ...",
    about: "ЗА ТРЕНЬОРА",
  },
};

export default function AdminCoaches({
  onBack,
}: Props) {
  const {
    language,
  } = useLanguage();

  const copy =
    useMemo(
      () => COPY[language],
      [language]
    );

  const [
    coaches,
    setCoaches,
  ] = useState<PendingCoach[]>([]);

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
    action,
    setAction,
  ] = useState<{
    userId: number;
    type: "approve" | "reject";
  } | null>(null);

  async function loadPending() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.get<PendingResponse>(
          "/admin/coaches/pending",
          telegramAuthOptions()
        );

      setCoaches(
        Array.isArray(response.coaches)
          ? response.coaches
          : []
      );
    } catch (loadError) {
      console.error(
        "IRONAGE ADMIN COACHES LOAD ERROR:",
        loadError
      );

      setError(
        loadError instanceof Error
          ? loadError.message
          : copy.error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPending();
  }, []);

  async function performAction(
    userId: number,
    type: "approve" | "reject"
  ) {
    try {
      setAction({
        userId,
        type,
      });

      setError(null);

      const response =
        await api.post<ActionResponse>(
          `/admin/coaches/${userId}/${type}`,
          {},
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true
      ) {
        throw new Error(
          "Admin action failed"
        );
      }

      setCoaches(
        current =>
          current.filter(
            coach =>
              coach.userId !== userId
          )
      );
    } catch (actionError) {
      console.error(
        "IRONAGE ADMIN COACH ACTION ERROR:",
        actionError
      );

      setError(
        actionError instanceof Error
          ? actionError.message
          : copy.error
      );
    } finally {
      setAction(null);
    }
  }

  return (
    <main className="admin-coaches">
      <div className="admin-coaches__shell">
        <header className="admin-coaches__header">
          <button
            type="button"
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

        <section className="admin-coaches__summary">
          <span>
            {copy.pending}
          </span>

          <strong>
            {coaches.length}
          </strong>
        </section>

        {loading && (
          <section className="admin-coaches__state">
            <strong>
              {copy.loading}
            </strong>
          </section>
        )}

        {!loading &&
          error && (
            <section className="admin-coaches__state admin-coaches__state--error">
              <strong>
                {copy.error}
              </strong>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadPending()
                }
              >
                {copy.retry}
              </button>
            </section>
          )}

        {!loading &&
          !error &&
          coaches.length === 0 && (
            <section className="admin-coaches__empty">
              <div>
                ✓
              </div>

              <strong>
                {copy.noPending}
              </strong>

              <p>
                {copy.noPendingText}
              </p>
            </section>
          )}

        {!loading &&
          coaches.length > 0 && (
            <section className="admin-coaches__list">
              {coaches.map(
                coach => {
                  const isApproving =
                    action?.userId ===
                      coach.userId &&
                    action.type ===
                      "approve";

                  const isRejecting =
                    action?.userId ===
                      coach.userId &&
                    action.type ===
                      "reject";

                  const busy =
                    isApproving ||
                    isRejecting;

                  return (
                    <article
                      key={coach.id}
                      className="admin-coaches__card"
                    >
                      <div className="admin-coaches__identity">
                        <div className="admin-coaches__photo">
                          {coach.photoUrl ? (
                            <img
                              src={coach.photoUrl}
                              alt={coach.displayName}
                            />
                          ) : (
                            <span>
                              {coach.displayName
                                .slice(0, 1)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div>
                          <span>
                            #{coach.userId}
                          </span>

                          <h2>
                            {coach.displayName}
                          </h2>

                          <p>
                            {coach.user.username
                              ? `@${coach.user.username}`
                              : [
                                  coach.user.firstName,
                                  coach.user.lastName,
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                          </p>
                        </div>
                      </div>

                      {coach.specialization && (
                        <section className="admin-coaches__field">
                          <span>
                            {copy.specialization}
                          </span>

                          <strong>
                            {coach.specialization}
                          </strong>
                        </section>
                      )}

                      {coach.bio && (
                        <section className="admin-coaches__field">
                          <span>
                            {copy.about}
                          </span>

                          <p>
                            {coach.bio}
                          </p>
                        </section>
                      )}

                      <section className="admin-coaches__field">
                        <span>
                          {copy.submitted}
                        </span>

                        <strong>
                          {new Date(
                            coach.createdAt
                          ).toLocaleDateString()}
                        </strong>
                      </section>

                      <div className="admin-coaches__actions">
                        <button
                          type="button"
                          className="admin-coaches__approve"
                          disabled={busy}
                          onClick={() =>
                            void performAction(
                              coach.userId,
                              "approve"
                            )
                          }
                        >
                          {isApproving
                            ? copy.approving
                            : `✓ ${copy.approve}`}
                        </button>

                        <button
                          type="button"
                          className="admin-coaches__reject"
                          disabled={busy}
                          onClick={() =>
                            void performAction(
                              coach.userId,
                              "reject"
                            )
                          }
                        >
                          {isRejecting
                            ? copy.rejecting
                            : `× ${copy.reject}`}
                        </button>
                      </div>
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
