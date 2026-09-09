import {
  useEffect,
  useState,
} from "react";

import {
  api,
  telegramAuthOptions,
} from "../../api/client";

import {
  useLanguage,
  type AppLanguage,
} from "../../context/LanguageContext";

import "./SubmitVideoReview.css";

type Props = {
  onBack: () => void;
};

type ReviewStatus =
  | "PENDING"
  | "REVIEWED"
  | "REJECTED";

type MyVideoReview = {
  id: number;
  workoutSessionId: number | null;
  exerciseName: string;
  videoUrl: string;
  athleteNote: string | null;
  coachFeedback: string | null;
  status: ReviewStatus;
  submittedAt: string;
  reviewedAt: string | null;

  coach: {
    id: number;
    firstName: string | null;
    lastName: string | null;

    coachProfile: {
      displayName: string;
      photoUrl: string | null;
    } | null;
  };
};

type MyReviewsResponse = {
  success: boolean;
  reviews: MyVideoReview[];
};

type CreateReviewResponse = {
  success: boolean;
  review: {
    id: number;
  };
};

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  exercise: string;
  exercisePlaceholder: string;
  videoUrl: string;
  videoUrlPlaceholder: string;
  note: string;
  notePlaceholder: string;
  submit: string;
  submitting: string;
  success: string;
  submitFailed: string;
  required: string;
  myReviews: string;
  loading: string;
  loadFailed: string;
  noReviews: string;
  pending: string;
  reviewed: string;
  rejected: string;
  coachFeedback: string;
  noFeedback: string;
  openVideo: string;
};

const COPY: Record<AppLanguage, Copy> = {
  en: {
    eyebrow: "COACHING",
    title: "SEND VIDEO FOR REVIEW",
    subtitle:
      "Send your exercise video to your coach and receive technique feedback.",
    exercise: "EXERCISE",
    exercisePlaceholder: "e.g. Squat",
    videoUrl: "VIDEO LINK",
    videoUrlPlaceholder: "https://...",
    note: "NOTE FOR COACH",
    notePlaceholder:
      "What should your coach check?",
    submit: "SEND FOR REVIEW",
    submitting: "SENDING...",
    success:
      "Video sent to your coach.",
    submitFailed:
      "Failed to send video review.",
    required:
      "Exercise and video link are required.",
    myReviews: "MY VIDEO REVIEWS",
    loading: "Loading reviews...",
    loadFailed:
      "Failed to load reviews.",
    noReviews:
      "You have not sent any videos yet.",
    pending: "PENDING",
    reviewed: "REVIEWED",
    rejected: "REJECTED",
    coachFeedback: "COACH FEEDBACK",
    noFeedback:
      "Your coach has not replied yet.",
    openVideo: "OPEN VIDEO",
  },

  uk: {
    eyebrow: "ТРЕНЕР",
    title: "НАДІСЛАТИ ВІДЕО НА РОЗБІР",
    subtitle:
      "Надішли відео вправи своєму тренеру та отримай розбір техніки.",
    exercise: "ВПРАВА",
    exercisePlaceholder: "Наприклад: Присідання",
    videoUrl: "ПОСИЛАННЯ НА ВІДЕО",
    videoUrlPlaceholder: "https://...",
    note: "НОТАТКА ДЛЯ ТРЕНЕРА",
    notePlaceholder:
      "Що саме тренеру перевірити?",
    submit: "НАДІСЛАТИ НА РОЗБІР",
    submitting: "НАДСИЛАННЯ...",
    success:
      "Відео надіслано тренеру.",
    submitFailed:
      "Не вдалося надіслати відео.",
    required:
      "Вкажи вправу та посилання на відео.",
    myReviews: "МОЇ ВІДЕОРОЗБОРИ",
    loading: "Завантаження...",
    loadFailed:
      "Не вдалося завантажити розбори.",
    noReviews:
      "Ти ще не надсилав відео.",
    pending: "ОЧІКУЄ",
    reviewed: "ПЕРЕВІРЕНО",
    rejected: "ВІДХИЛЕНО",
    coachFeedback: "ВІДГУК ТРЕНЕРА",
    noFeedback:
      "Тренер ще не залишив відгук.",
    openVideo: "ВІДКРИТИ ВІДЕО",
  },

  ru: {
    eyebrow: "ТРЕНЕР",
    title: "ОТПРАВИТЬ ВИДЕО НА РАЗБОР",
    subtitle:
      "Отправь видео упражнения тренеру и получи разбор техники.",
    exercise: "УПРАЖНЕНИЕ",
    exercisePlaceholder: "Например: Приседания",
    videoUrl: "ССЫЛКА НА ВИДЕО",
    videoUrlPlaceholder: "https://...",
    note: "ЗАМЕТКА ДЛЯ ТРЕНЕРА",
    notePlaceholder:
      "Что именно проверить?",
    submit: "ОТПРАВИТЬ НА РАЗБОР",
    submitting: "ОТПРАВКА...",
    success:
      "Видео отправлено тренеру.",
    submitFailed:
      "Не удалось отправить видео.",
    required:
      "Укажи упражнение и ссылку на видео.",
    myReviews: "МОИ ВИДЕОРАЗБОРЫ",
    loading: "Загрузка...",
    loadFailed:
      "Не удалось загрузить разборы.",
    noReviews:
      "Ты ещё не отправлял видео.",
    pending: "ОЖИДАЕТ",
    reviewed: "ПРОВЕРЕНО",
    rejected: "ОТКЛОНЕНО",
    coachFeedback: "ОТЗЫВ ТРЕНЕРА",
    noFeedback:
      "Тренер ещё не оставил отзыв.",
    openVideo: "ОТКРЫТЬ ВИДЕО",
  },

  bg: {
    eyebrow: "ТРЕНЬОР",
    title: "ИЗПРАТИ ВИДЕО ЗА ПРЕГЛЕД",
    subtitle:
      "Изпрати видео на упражнение и получи обратна връзка за техниката.",
    exercise: "УПРАЖНЕНИЕ",
    exercisePlaceholder: "Например: Клек",
    videoUrl: "ЛИНК КЪМ ВИДЕО",
    videoUrlPlaceholder: "https://...",
    note: "БЕЛЕЖКА ЗА ТРЕНЬОРА",
    notePlaceholder:
      "Какво да провери треньорът?",
    submit: "ИЗПРАТИ ЗА ПРЕГЛЕД",
    submitting: "ИЗПРАЩАНЕ...",
    success:
      "Видеото е изпратено.",
    submitFailed:
      "Видеото не можа да бъде изпратено.",
    required:
      "Въведи упражнение и видео линк.",
    myReviews: "МОИТЕ ВИДЕО ПРЕГЛЕДИ",
    loading: "Зареждане...",
    loadFailed:
      "Прегледите не можаха да се заредят.",
    noReviews:
      "Все още няма изпратени видеа.",
    pending: "ЧАКА",
    reviewed: "ПРЕГЛЕДАНО",
    rejected: "ОТХВЪРЛЕНО",
    coachFeedback: "ОБРАТНА ВРЪЗКА",
    noFeedback:
      "Треньорът още не е отговорил.",
    openVideo: "ОТВОРИ ВИДЕОТО",
  },

  es: {
    eyebrow: "ENTRENADOR",
    title: "ENVIAR VÍDEO PARA REVISIÓN",
    subtitle:
      "Envía tu ejercicio al entrenador y recibe comentarios sobre tu técnica.",
    exercise: "EJERCICIO",
    exercisePlaceholder: "Ej.: Sentadilla",
    videoUrl: "ENLACE DEL VÍDEO",
    videoUrlPlaceholder: "https://...",
    note: "NOTA PARA EL ENTRENADOR",
    notePlaceholder:
      "¿Qué quieres que revise?",
    submit: "ENVIAR PARA REVISIÓN",
    submitting: "ENVIANDO...",
    success:
      "Vídeo enviado al entrenador.",
    submitFailed:
      "No se pudo enviar el vídeo.",
    required:
      "El ejercicio y el enlace son obligatorios.",
    myReviews: "MIS REVISIONES",
    loading: "Cargando...",
    loadFailed:
      "No se pudieron cargar las revisiones.",
    noReviews:
      "Todavía no has enviado vídeos.",
    pending: "PENDIENTE",
    reviewed: "REVISADO",
    rejected: "RECHAZADO",
    coachFeedback: "COMENTARIOS DEL ENTRENADOR",
    noFeedback:
      "Tu entrenador todavía no ha respondido.",
    openVideo: "ABRIR VÍDEO",
  },

  fr: {
    eyebrow: "COACH",
    title: "ENVOYER UNE VIDÉO À ANALYSER",
    subtitle:
      "Envoie ton exercice au coach et reçois un retour sur ta technique.",
    exercise: "EXERCICE",
    exercisePlaceholder: "Ex. : Squat",
    videoUrl: "LIEN VIDÉO",
    videoUrlPlaceholder: "https://...",
    note: "NOTE POUR LE COACH",
    notePlaceholder:
      "Que doit vérifier ton coach ?",
    submit: "ENVOYER POUR ANALYSE",
    submitting: "ENVOI...",
    success:
      "Vidéo envoyée au coach.",
    submitFailed:
      "Impossible d’envoyer la vidéo.",
    required:
      "L’exercice et le lien vidéo sont obligatoires.",
    myReviews: "MES ANALYSES VIDÉO",
    loading: "Chargement...",
    loadFailed:
      "Impossible de charger les analyses.",
    noReviews:
      "Tu n’as encore envoyé aucune vidéo.",
    pending: "EN ATTENTE",
    reviewed: "ANALYSÉE",
    rejected: "REJETÉE",
    coachFeedback: "RETOUR DU COACH",
    noFeedback:
      "Ton coach n’a pas encore répondu.",
    openVideo: "OUVRIR LA VIDÉO",
  },

  de: {
    eyebrow: "COACH",
    title: "VIDEO ZUR PRÜFUNG SENDEN",
    subtitle:
      "Sende deine Übung an deinen Coach und erhalte Technik-Feedback.",
    exercise: "ÜBUNG",
    exercisePlaceholder: "z. B. Kniebeuge",
    videoUrl: "VIDEO-LINK",
    videoUrlPlaceholder: "https://...",
    note: "NOTIZ FÜR DEN COACH",
    notePlaceholder:
      "Was soll dein Coach prüfen?",
    submit: "ZUR PRÜFUNG SENDEN",
    submitting: "WIRD GESENDET...",
    success:
      "Video wurde gesendet.",
    submitFailed:
      "Video konnte nicht gesendet werden.",
    required:
      "Übung und Video-Link sind erforderlich.",
    myReviews: "MEINE VIDEO-REVIEWS",
    loading: "Wird geladen...",
    loadFailed:
      "Reviews konnten nicht geladen werden.",
    noReviews:
      "Du hast noch keine Videos gesendet.",
    pending: "OFFEN",
    reviewed: "GEPRÜFT",
    rejected: "ABGELEHNT",
    coachFeedback: "COACH-FEEDBACK",
    noFeedback:
      "Dein Coach hat noch nicht geantwortet.",
    openVideo: "VIDEO ÖFFNEN",
  },

  pt: {
    eyebrow: "TREINADOR",
    title: "ENVIAR VÍDEO PARA ANÁLISE",
    subtitle:
      "Envia o exercício ao treinador e recebe feedback sobre a técnica.",
    exercise: "EXERCÍCIO",
    exercisePlaceholder: "Ex.: Agachamento",
    videoUrl: "LINK DO VÍDEO",
    videoUrlPlaceholder: "https://...",
    note: "NOTA PARA O TREINADOR",
    notePlaceholder:
      "O que deve o treinador verificar?",
    submit: "ENVIAR PARA ANÁLISE",
    submitting: "A ENVIAR...",
    success:
      "Vídeo enviado ao treinador.",
    submitFailed:
      "Não foi possível enviar o vídeo.",
    required:
      "Exercício e link do vídeo são obrigatórios.",
    myReviews: "MINHAS ANÁLISES",
    loading: "A carregar...",
    loadFailed:
      "Não foi possível carregar as análises.",
    noReviews:
      "Ainda não enviaste vídeos.",
    pending: "PENDENTE",
    reviewed: "ANALISADO",
    rejected: "REJEITADO",
    coachFeedback: "FEEDBACK DO TREINADOR",
    noFeedback:
      "O treinador ainda não respondeu.",
    openVideo: "ABRIR VÍDEO",
  },
};

export default function SubmitVideoReview({
  onBack,
}: Props) {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [
    exerciseName,
    setExerciseName,
  ] = useState("");

  const [
    videoUrl,
    setVideoUrl,
  ] = useState("");

  const [
    athleteNote,
    setAthleteNote,
  ] = useState("");

  const [
    reviews,
    setReviews,
  ] = useState<MyVideoReview[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState<string | null>(
    null
  );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  async function loadReviews() {
    try {
      setLoading(true);

      const response =
        await api.get<MyReviewsResponse>(
          "/video-reviews/me",
          telegramAuthOptions()
        );

      if (
        !response ||
        !Array.isArray(response.reviews)
      ) {
        throw new Error(
          "Invalid reviews response"
        );
      }

      setReviews(response.reviews);
    } catch (loadError) {
      console.error(
        "IRONAGE CLIENT VIDEO REVIEWS LOAD ERROR:",
        loadError
      );

      setError(copy.loadFailed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReviews();
  }, []);

  async function submit() {
    const exercise =
      exerciseName.trim();

    const url =
      videoUrl.trim();

    if (!exercise || !url) {
      setError(copy.required);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);

      const response =
        await api.post<CreateReviewResponse>(
          "/video-reviews",
          {
            exerciseName: exercise,
            videoUrl: url,
            athleteNote:
              athleteNote.trim() || null,
          },
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true
      ) {
        throw new Error(
          "Invalid create response"
        );
      }

      setExerciseName("");
      setVideoUrl("");
      setAthleteNote("");
      setMessage(copy.success);

      await loadReviews();
    } catch (submitError) {
      console.error(
        "IRONAGE CLIENT VIDEO REVIEW CREATE ERROR:",
        submitError
      );

      setError(copy.submitFailed);
    } finally {
      setSubmitting(false);
    }
  }

  function statusLabel(
    status: ReviewStatus
  ) {
    if (status === "REVIEWED") {
      return copy.reviewed;
    }

    if (status === "REJECTED") {
      return copy.rejected;
    }

    return copy.pending;
  }

  return (
    <main className="submit-video-review">
      <div className="submit-video-review__shell">
        <header className="submit-video-review__header">
          <button
            type="button"
            className="submit-video-review__back"
            onClick={onBack}
            aria-label="Back"
          >
            ←
          </button>

          <div>
            <span>{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </div>
        </header>

        <section className="submit-video-review__form">
          <label>
            <span>{copy.exercise}</span>

            <input
              value={exerciseName}
              placeholder={
                copy.exercisePlaceholder
              }
              onChange={event =>
                setExerciseName(
                  event.target.value
                )
              }
            />
          </label>

          <label>
            <span>{copy.videoUrl}</span>

            <input
              value={videoUrl}
              inputMode="url"
              placeholder={
                copy.videoUrlPlaceholder
              }
              onChange={event =>
                setVideoUrl(
                  event.target.value
                )
              }
            />
          </label>

          <label>
            <span>{copy.note}</span>

            <textarea
              value={athleteNote}
              placeholder={
                copy.notePlaceholder
              }
              onChange={event =>
                setAthleteNote(
                  event.target.value
                )
              }
            />
          </label>

          {error && (
            <p className="submit-video-review__error">
              {error}
            </p>
          )}

          {message && (
            <p className="submit-video-review__success">
              {message}
            </p>
          )}

          <button
            type="button"
            className="submit-video-review__submit"
            disabled={submitting}
            onClick={() => {
              void submit();
            }}
          >
            {submitting
              ? copy.submitting
              : copy.submit}
          </button>
        </section>

        <section className="submit-video-review__history">
          <h2>
            {copy.myReviews}
          </h2>

          {loading && (
            <p>{copy.loading}</p>
          )}

          {!loading &&
            reviews.length === 0 && (
              <p>
                {copy.noReviews}
              </p>
            )}

          {!loading &&
            reviews.map(review => (
              <article
                key={review.id}
                className="submit-video-review__card"
              >
                <div className="submit-video-review__card-top">
                  <strong>
                    {review.exerciseName}
                  </strong>

                  <span
                    data-status={
                      review.status
                    }
                  >
                    {statusLabel(
                      review.status
                    )}
                  </span>
                </div>

                <a
                  href={review.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {copy.openVideo}
                </a>

                <div className="submit-video-review__feedback">
                  <span>
                    {copy.coachFeedback}
                  </span>

                  <p>
                    {review.coachFeedback ??
                      copy.noFeedback}
                  </p>
                </div>
              </article>
            ))}
        </section>
      </div>
    </main>
  );
}
