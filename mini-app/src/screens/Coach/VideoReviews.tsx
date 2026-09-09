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

import "./VideoReviews.css";

type Props = {
  onBack: () => void;
};

type ReviewStatus =
  | "PENDING"
  | "REVIEWED"
  | "REJECTED";

type VideoReview = {
  id: number;
  clientId: number;
  workoutSessionId: number | null;
  exerciseName: string;
  videoUrl: string;
  athleteNote: string | null;
  coachFeedback: string | null;
  status: ReviewStatus;
  submittedAt: string;
  reviewedAt: string | null;

  client: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
  };
};

type ReviewsResponse = {
  success: boolean;
  reviews: VideoReview[];
};

type ReviewResponse = {
  success: boolean;
  review: VideoReview;
};

type ViewUrlResponse = {
  success: boolean;
  viewUrl: string;
};

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  loading: string;
  failed: string;
  retry: string;
  total: string;
  pending: string;
  reviewed: string;
  rejected: string;
  noReviews: string;
  noReviewsSubtitle: string;
  athlete: string;
  exercise: string;
  submitted: string;
  athleteNote: string;
  noNote: string;
  coachFeedback: string;
  feedbackPlaceholder: string;
  openVideo: string;
  markReviewed: string;
  reject: string;
  saving: string;
  feedbackRequired: string;
  saveFailed: string;
  pendingStatus: string;
  reviewedStatus: string;
  rejectedStatus: string;
};

const COPY: Record<AppLanguage, Copy> = {
  en: {
    eyebrow: "COACH TOOLS",
    title: "VIDEO REVIEWS",
    subtitle:
      "Review athlete exercise technique and provide professional feedback.",
    loading: "Loading video reviews...",
    failed: "Failed to load video reviews.",
    retry: "RETRY",
    total: "TOTAL",
    pending: "PENDING",
    reviewed: "REVIEWED",
    rejected: "REJECTED",
    noReviews: "NO VIDEO REVIEWS",
    noReviewsSubtitle:
      "Athlete video submissions will appear here.",
    athlete: "ATHLETE",
    exercise: "EXERCISE",
    submitted: "SUBMITTED",
    athleteNote: "ATHLETE NOTE",
    noNote: "No note provided.",
    coachFeedback: "COACH FEEDBACK",
    feedbackPlaceholder:
      "Technique, tempo, range of motion, corrections...",
    openVideo: "OPEN VIDEO",
    markReviewed: "MARK REVIEWED",
    reject: "REJECT",
    saving: "SAVING...",
    feedbackRequired:
      "Write feedback before completing the review.",
    saveFailed: "Failed to save review.",
    pendingStatus: "PENDING",
    reviewedStatus: "REVIEWED",
    rejectedStatus: "REJECTED",
  },

  uk: {
    eyebrow: "ІНСТРУМЕНТИ ТРЕНЕРА",
    title: "ВІДЕОРОЗБОРИ",
    subtitle:
      "Перевіряй техніку вправ спортсменів і залишай професійний відгук.",
    loading: "Завантаження відеорозборів...",
    failed: "Не вдалося завантажити відеорозбори.",
    retry: "ПОВТОРИТИ",
    total: "УСЬОГО",
    pending: "ОЧІКУЮТЬ",
    reviewed: "ПЕРЕВІРЕНО",
    rejected: "ВІДХИЛЕНО",
    noReviews: "НЕМАЄ ВІДЕОРОЗБОРІВ",
    noReviewsSubtitle:
      "Відео, надіслані спортсменами, з’являться тут.",
    athlete: "СПОРТСМЕН",
    exercise: "ВПРАВА",
    submitted: "НАДІСЛАНО",
    athleteNote: "НОТАТКА СПОРТСМЕНА",
    noNote: "Нотатку не додано.",
    coachFeedback: "ВІДГУК ТРЕНЕРА",
    feedbackPlaceholder:
      "Техніка, темп, амплітуда, що потрібно виправити...",
    openVideo: "ВІДКРИТИ ВІДЕО",
    markReviewed: "ПОЗНАЧИТИ ПЕРЕВІРЕНИМ",
    reject: "ВІДХИЛИТИ",
    saving: "ЗБЕРЕЖЕННЯ...",
    feedbackRequired:
      "Напиши відгук перед завершенням перевірки.",
    saveFailed: "Не вдалося зберегти розбір.",
    pendingStatus: "ОЧІКУЄ",
    reviewedStatus: "ПЕРЕВІРЕНО",
    rejectedStatus: "ВІДХИЛЕНО",
  },

  ru: {
    eyebrow: "ИНСТРУМЕНТЫ ТРЕНЕРА",
    title: "ВИДЕОРАЗБОРЫ",
    subtitle:
      "Проверяй технику упражнений спортсменов и оставляй профессиональный отзыв.",
    loading: "Загрузка видеоразборов...",
    failed: "Не удалось загрузить видеоразборы.",
    retry: "ПОВТОРИТЬ",
    total: "ВСЕГО",
    pending: "ОЖИДАЮТ",
    reviewed: "ПРОВЕРЕНО",
    rejected: "ОТКЛОНЕНО",
    noReviews: "НЕТ ВИДЕОРАЗБОРОВ",
    noReviewsSubtitle:
      "Видео от спортсменов появятся здесь.",
    athlete: "СПОРТСМЕН",
    exercise: "УПРАЖНЕНИЕ",
    submitted: "ОТПРАВЛЕНО",
    athleteNote: "ЗАМЕТКА СПОРТСМЕНА",
    noNote: "Заметка не добавлена.",
    coachFeedback: "ОТЗЫВ ТРЕНЕРА",
    feedbackPlaceholder:
      "Техника, темп, амплитуда, что нужно исправить...",
    openVideo: "ОТКРЫТЬ ВИДЕО",
    markReviewed: "ОТМЕТИТЬ ПРОВЕРЕННЫМ",
    reject: "ОТКЛОНИТЬ",
    saving: "СОХРАНЕНИЕ...",
    feedbackRequired:
      "Напиши отзыв перед завершением проверки.",
    saveFailed: "Не удалось сохранить разбор.",
    pendingStatus: "ОЖИДАЕТ",
    reviewedStatus: "ПРОВЕРЕНО",
    rejectedStatus: "ОТКЛОНЕНО",
  },

  bg: {
    eyebrow: "ИНСТРУМЕНТИ ЗА ТРЕНЬОРА",
    title: "ВИДЕО ПРЕГЛЕДИ",
    subtitle:
      "Преглеждай техниката на спортистите и давай професионална обратна връзка.",
    loading: "Зареждане на видео прегледи...",
    failed: "Видео прегледите не можаха да се заредят.",
    retry: "ОПИТАЙ ОТНОВО",
    total: "ОБЩО",
    pending: "ЧАКАЩИ",
    reviewed: "ПРЕГЛЕДАНИ",
    rejected: "ОТХВЪРЛЕНИ",
    noReviews: "НЯМА ВИДЕО ПРЕГЛЕДИ",
    noReviewsSubtitle:
      "Изпратените видеа от спортисти ще се появят тук.",
    athlete: "СПОРТИСТ",
    exercise: "УПРАЖНЕНИЕ",
    submitted: "ИЗПРАТЕНО",
    athleteNote: "БЕЛЕЖКА ОТ СПОРТИСТА",
    noNote: "Няма добавена бележка.",
    coachFeedback: "ОБРАТНА ВРЪЗКА ОТ ТРЕНЬОРА",
    feedbackPlaceholder:
      "Техника, темпо, амплитуда, корекции...",
    openVideo: "ОТВОРИ ВИДЕОТО",
    markReviewed: "МАРКИРАЙ КАТО ПРЕГЛЕДАНО",
    reject: "ОТХВЪРЛИ",
    saving: "ЗАПАЗВАНЕ...",
    feedbackRequired:
      "Напиши обратна връзка преди завършване.",
    saveFailed: "Прегледът не можа да бъде запазен.",
    pendingStatus: "ЧАКА",
    reviewedStatus: "ПРЕГЛЕДАНО",
    rejectedStatus: "ОТХВЪРЛЕНО",
  },

  es: {
    eyebrow: "HERRAMIENTAS DEL ENTRENADOR",
    title: "REVISIONES DE VÍDEO",
    subtitle:
      "Revisa la técnica de los atletas y proporciona comentarios profesionales.",
    loading: "Cargando revisiones de vídeo...",
    failed: "No se pudieron cargar las revisiones.",
    retry: "REINTENTAR",
    total: "TOTAL",
    pending: "PENDIENTES",
    reviewed: "REVISADOS",
    rejected: "RECHAZADOS",
    noReviews: "SIN REVISIONES DE VÍDEO",
    noReviewsSubtitle:
      "Los vídeos enviados por los atletas aparecerán aquí.",
    athlete: "ATLETA",
    exercise: "EJERCICIO",
    submitted: "ENVIADO",
    athleteNote: "NOTA DEL ATLETA",
    noNote: "No se añadió ninguna nota.",
    coachFeedback: "COMENTARIOS DEL ENTRENADOR",
    feedbackPlaceholder:
      "Técnica, tempo, rango de movimiento, correcciones...",
    openVideo: "ABRIR VÍDEO",
    markReviewed: "MARCAR COMO REVISADO",
    reject: "RECHAZAR",
    saving: "GUARDANDO...",
    feedbackRequired:
      "Escribe comentarios antes de completar la revisión.",
    saveFailed: "No se pudo guardar la revisión.",
    pendingStatus: "PENDIENTE",
    reviewedStatus: "REVISADO",
    rejectedStatus: "RECHAZADO",
  },

  fr: {
    eyebrow: "OUTILS DU COACH",
    title: "ANALYSES VIDÉO",
    subtitle:
      "Analyse la technique des athlètes et donne un retour professionnel.",
    loading: "Chargement des analyses vidéo...",
    failed: "Impossible de charger les analyses vidéo.",
    retry: "RÉESSAYER",
    total: "TOTAL",
    pending: "EN ATTENTE",
    reviewed: "ANALYSÉES",
    rejected: "REJETÉES",
    noReviews: "AUCUNE ANALYSE VIDÉO",
    noReviewsSubtitle:
      "Les vidéos envoyées par les athlètes apparaîtront ici.",
    athlete: "ATHLÈTE",
    exercise: "EXERCICE",
    submitted: "ENVOYÉ",
    athleteNote: "NOTE DE L’ATHLÈTE",
    noNote: "Aucune note ajoutée.",
    coachFeedback: "RETOUR DU COACH",
    feedbackPlaceholder:
      "Technique, tempo, amplitude, corrections...",
    openVideo: "OUVRIR LA VIDÉO",
    markReviewed: "MARQUER COMME ANALYSÉE",
    reject: "REJETER",
    saving: "ENREGISTREMENT...",
    feedbackRequired:
      "Écris un retour avant de terminer l’analyse.",
    saveFailed: "Impossible d’enregistrer l’analyse.",
    pendingStatus: "EN ATTENTE",
    reviewedStatus: "ANALYSÉE",
    rejectedStatus: "REJETÉE",
  },

  de: {
    eyebrow: "COACH-WERKZEUGE",
    title: "VIDEO-REVIEWS",
    subtitle:
      "Prüfe die Übungstechnik deiner Athleten und gib professionelles Feedback.",
    loading: "Video-Reviews werden geladen...",
    failed: "Video-Reviews konnten nicht geladen werden.",
    retry: "ERNEUT VERSUCHEN",
    total: "GESAMT",
    pending: "OFFEN",
    reviewed: "GEPRÜFT",
    rejected: "ABGELEHNT",
    noReviews: "KEINE VIDEO-REVIEWS",
    noReviewsSubtitle:
      "Von Athleten gesendete Videos erscheinen hier.",
    athlete: "ATHLET",
    exercise: "ÜBUNG",
    submitted: "GESENDET",
    athleteNote: "NOTIZ DES ATHLETEN",
    noNote: "Keine Notiz hinzugefügt.",
    coachFeedback: "COACH-FEEDBACK",
    feedbackPlaceholder:
      "Technik, Tempo, Bewegungsumfang, Korrekturen...",
    openVideo: "VIDEO ÖFFNEN",
    markReviewed: "ALS GEPRÜFT MARKIEREN",
    reject: "ABLEHNEN",
    saving: "SPEICHERN...",
    feedbackRequired:
      "Schreibe Feedback, bevor du die Prüfung abschließt.",
    saveFailed: "Review konnte nicht gespeichert werden.",
    pendingStatus: "OFFEN",
    reviewedStatus: "GEPRÜFT",
    rejectedStatus: "ABGELEHNT",
  },

  pt: {
    eyebrow: "FERRAMENTAS DO TREINADOR",
    title: "ANÁLISES DE VÍDEO",
    subtitle:
      "Analisa a técnica dos atletas e fornece feedback profissional.",
    loading: "A carregar análises de vídeo...",
    failed: "Não foi possível carregar as análises.",
    retry: "TENTAR NOVAMENTE",
    total: "TOTAL",
    pending: "PENDENTES",
    reviewed: "ANALISADAS",
    rejected: "REJEITADAS",
    noReviews: "SEM ANÁLISES DE VÍDEO",
    noReviewsSubtitle:
      "Os vídeos enviados pelos atletas aparecerão aqui.",
    athlete: "ATLETA",
    exercise: "EXERCÍCIO",
    submitted: "ENVIADO",
    athleteNote: "NOTA DO ATLETA",
    noNote: "Nenhuma nota adicionada.",
    coachFeedback: "FEEDBACK DO TREINADOR",
    feedbackPlaceholder:
      "Técnica, ritmo, amplitude, correções...",
    openVideo: "ABRIR VÍDEO",
    markReviewed: "MARCAR COMO ANALISADO",
    reject: "REJEITAR",
    saving: "A GUARDAR...",
    feedbackRequired:
      "Escreve feedback antes de concluir a análise.",
    saveFailed: "Não foi possível guardar a análise.",
    pendingStatus: "PENDENTE",
    reviewedStatus: "ANALISADO",
    rejectedStatus: "REJEITADO",
  },
};

function athleteName(
  review: VideoReview
): string {
  const fullName = [
    review.client.firstName,
    review.client.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) {
    return fullName;
  }

  if (review.client.username) {
    return `@${review.client.username}`;
  }

  return `#${review.client.id}`;
}

function formatDate(
  value: string,
  locale: string
): string {
  const date = new Date(value);

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
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

export default function VideoReviews({
  onBack,
}: Props) {
  const { language } = useLanguage();

  const copy = COPY[language];

  const locale = {
    en: "en-GB",
    es: "es-ES",
    uk: "uk-UA",
    ru: "ru-RU",
    fr: "fr-FR",
    de: "de-DE",
    pt: "pt-PT",
    bg: "bg-BG",
  }[language];

  const [
    reviews,
    setReviews,
  ] = useState<VideoReview[]>([]);

  const [
    feedback,
    setFeedback,
  ] = useState<
    Record<number, string>
  >({});

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
    savingId,
    setSavingId,
  ] = useState<number | null>(
    null
  );

  const [
    actionError,
    setActionError,
  ] = useState<
    Record<number, string>
  >({});

  async function loadReviews() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.get<ReviewsResponse>(
          "/video-reviews/coach",
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        !Array.isArray(
          response.reviews
        )
      ) {
        throw new Error(
          "Invalid video review response"
        );
      }

      setReviews(
        response.reviews
      );

      setFeedback(
        Object.fromEntries(
          response.reviews.map(
            review => [
              review.id,
              review.coachFeedback ?? "",
            ]
          )
        )
      );
    } catch (loadError) {
      console.error(
        "IRONAGE VIDEO REVIEWS UI ERROR:",
        loadError
      );

      setError(copy.failed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReviews();
  }, [language]);

  const stats = useMemo(() => {
    return {
      total: reviews.length,

      pending: reviews.filter(
        review =>
          review.status === "PENDING"
      ).length,

      reviewed: reviews.filter(
        review =>
          review.status === "REVIEWED"
      ).length,

      rejected: reviews.filter(
        review =>
          review.status === "REJECTED"
      ).length,
    };
  }, [reviews]);

  async function openVideo(
    reviewId: number
  ) {
    try {
      setActionError(current => ({
        ...current,
        [reviewId]: "",
      }));

      const response =
        await api.get<ViewUrlResponse>(
          `/video-reviews/${reviewId}/view-url`,
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        typeof response.viewUrl !==
          "string" ||
        !response.viewUrl
      ) {
        throw new Error(
          "Invalid video view response"
        );
      }

      window.open(
        response.viewUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (openError) {
      console.error(
        "IRONAGE COACH VIDEO OPEN ERROR:",
        openError
      );

      setActionError(current => ({
        ...current,
        [reviewId]:
          copy.failed,
      }));
    }
  }

  async function submitReview(
    reviewId: number,
    status:
      | "REVIEWED"
      | "REJECTED"
  ) {
    const coachFeedback =
      String(
        feedback[reviewId] ?? ""
      ).trim();

    if (!coachFeedback) {
      setActionError(current => ({
        ...current,
        [reviewId]:
          copy.feedbackRequired,
      }));

      return;
    }

    try {
      setSavingId(reviewId);

      setActionError(current => ({
        ...current,
        [reviewId]: "",
      }));

      const response =
        await api.patch<ReviewResponse>(
          `/video-reviews/${reviewId}/review`,
          {
            status,
            coachFeedback,
          },
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        !response.review
      ) {
        throw new Error(
          "Invalid review update response"
        );
      }

      setReviews(current =>
        current.map(review =>
          review.id === reviewId
            ? {
                ...review,
                ...response.review,
                client:
                  review.client,
              }
            : review
        )
      );
    } catch (saveError) {
      console.error(
        "IRONAGE VIDEO REVIEW SAVE ERROR:",
        saveError
      );

      setActionError(current => ({
        ...current,
        [reviewId]:
          copy.saveFailed,
      }));
    } finally {
      setSavingId(null);
    }
  }

  function statusLabel(
    status: ReviewStatus
  ) {
    if (status === "REVIEWED") {
      return copy.reviewedStatus;
    }

    if (status === "REJECTED") {
      return copy.rejectedStatus;
    }

    return copy.pendingStatus;
  }

  return (
    <main className="video-reviews">
      <div className="video-reviews__shell">
        <header className="video-reviews__header">
          <button
            type="button"
            className="video-reviews__back"
            onClick={onBack}
            aria-label="Back"
          >
            ←
          </button>

          <div>
            <span className="video-reviews__eyebrow">
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

        <section className="video-reviews__stats">
          <article>
            <span>{copy.total}</span>
            <strong>
              {stats.total}
            </strong>
          </article>

          <article>
            <span>{copy.pending}</span>
            <strong>
              {stats.pending}
            </strong>
          </article>

          <article>
            <span>{copy.reviewed}</span>
            <strong>
              {stats.reviewed}
            </strong>
          </article>

          <article>
            <span>{copy.rejected}</span>
            <strong>
              {stats.rejected}
            </strong>
          </article>
        </section>

        {loading && (
          <section className="video-reviews__state">
            {copy.loading}
          </section>
        )}

        {!loading && error && (
          <section className="video-reviews__state">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => {
                void loadReviews();
              }}
            >
              {copy.retry}
            </button>
          </section>
        )}

        {!loading &&
          !error &&
          reviews.length === 0 && (
            <section className="video-reviews__empty">
              <div>▶</div>

              <h2>
                {copy.noReviews}
              </h2>

              <p>
                {copy.noReviewsSubtitle}
              </p>
            </section>
          )}

        {!loading &&
          !error &&
          reviews.length > 0 && (
            <section className="video-reviews__list">
              {reviews.map(review => (
                <article
                  key={review.id}
                  className="video-review-card"
                >
                  <div className="video-review-card__top">
                    <div>
                      <span>
                        {copy.athlete}
                      </span>

                      <strong>
                        {athleteName(
                          review
                        )}
                      </strong>
                    </div>

                    <span
                      className={
                        `video-review-status video-review-status--${review.status.toLowerCase()}`
                      }
                    >
                      {statusLabel(
                        review.status
                      )}
                    </span>
                  </div>

                  <div className="video-review-card__meta">
                    <div>
                      <span>
                        {copy.exercise}
                      </span>

                      <strong>
                        {review.exerciseName}
                      </strong>
                    </div>

                    <div>
                      <span>
                        {copy.submitted}
                      </span>

                      <strong>
                        {formatDate(
                          review.submittedAt,
                          locale
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="video-review-card__note">
                    <span>
                      {copy.athleteNote}
                    </span>

                    <p>
                      {review.athleteNote ??
                        copy.noNote}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="video-review-card__video"
                    onClick={() => {
                      void openVideo(
                        review.id
                      );
                    }}
                  >
                    ▶ {copy.openVideo}
                  </button>

                  <label className="video-review-card__feedback">
                    <span>
                      {copy.coachFeedback}
                    </span>

                    <textarea
                      value={
                        feedback[review.id] ??
                        ""
                      }
                      placeholder={
                        copy.feedbackPlaceholder
                      }
                      onChange={event => {
                        const value =
                          event.target.value;

                        setFeedback(
                          current => ({
                            ...current,
                            [review.id]:
                              value,
                          })
                        );
                      }}
                    />
                  </label>

                  {actionError[
                    review.id
                  ] && (
                    <p className="video-review-card__error">
                      {
                        actionError[
                          review.id
                        ]
                      }
                    </p>
                  )}

                  <div className="video-review-card__actions">
                    <button
                      type="button"
                      className="video-review-card__primary"
                      disabled={
                        savingId ===
                        review.id
                      }
                      onClick={() => {
                        void submitReview(
                          review.id,
                          "REVIEWED"
                        );
                      }}
                    >
                      {savingId ===
                      review.id
                        ? copy.saving
                        : copy.markReviewed}
                    </button>

                    <button
                      type="button"
                      className="video-review-card__danger"
                      disabled={
                        savingId ===
                        review.id
                      }
                      onClick={() => {
                        void submitReview(
                          review.id,
                          "REJECTED"
                        );
                      }}
                    >
                      {copy.reject}
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
      </div>
    </main>
  );
}
