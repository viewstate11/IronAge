import {
  useEffect,
  useRef,
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

type UploadUrlResponse = {
  success: boolean;

  upload: {
    presignedUrl: string;
    pathname: string;
    contentType: string;
    fileSize: number;
    maximumSizeInBytes: number;
    validUntil: number;
  };
};

type BlobPutResult = {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType: string;
  contentDisposition: string;
  etag: string;
};

type ViewUrlResponse = {
  success: boolean;
  viewUrl: string;
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
    videoUrl: "VIDEO",
    videoUrlPlaceholder: "CHOOSE A VIDEO",
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
      "Exercise and video are required.",
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
    videoUrl: "ВІДЕО",
    videoUrlPlaceholder: "CHOOSE A VIDEO",
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
      "Вкажи вправу та обери відео.",
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
    videoUrl: "ВИДЕО",
    videoUrlPlaceholder: "CHOOSE A VIDEO",
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
      "Укажи упражнение и выбери видео.",
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
    videoUrl: "ВИДЕО",
    videoUrlPlaceholder: "CHOOSE A VIDEO",
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
      "Въведи упражнение и избери видео.",
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
    videoUrl: "VÍDEO",
    videoUrlPlaceholder: "CHOOSE A VIDEO",
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
      "El ejercicio y el vídeo son obligatorios.",
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
    videoUrl: "VIDÉO",
    videoUrlPlaceholder: "CHOOSE A VIDEO",
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
      "L’exercice et la vidéo sont obligatoires.",
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
    videoUrl: "VIDEO",
    videoUrlPlaceholder: "CHOOSE A VIDEO",
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
      "Übung und Video sind erforderlich.",
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
    videoUrl: "VÍDEO",
    videoUrlPlaceholder: "CHOOSE A VIDEO",
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
      "Exercício e vídeo são obrigatórios.",
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
    selectedVideo,
    setSelectedVideo,
  ] = useState<File | null>(null);

  const [
    uploadProgress,
    setUploadProgress,
  ] = useState(0);

  const videoInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

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

  function uploadVideo(
    file: File,
    presignedUrl: string
  ): Promise<BlobPutResult> {
    return new Promise(
      (resolve, reject) => {
        const request =
          new XMLHttpRequest();

        request.open(
          "PUT",
          presignedUrl
        );

        request.setRequestHeader(
          "Content-Type",
          file.type
        );

        request.upload.onprogress =
          event => {
            if (!event.lengthComputable) {
              return;
            }

            const percentage =
              Math.round(
                (
                  event.loaded /
                  event.total
                ) * 100
              );

            setUploadProgress(
              percentage
            );
          };

        request.onerror = () => {
          reject(
            new Error(
              "Video upload failed"
            )
          );
        };

        request.onload = () => {
          if (
            request.status < 200 ||
            request.status >= 300
          ) {
            reject(
              new Error(
                `Video upload failed (${request.status})`
              )
            );

            return;
          }

          try {
            const result =
              JSON.parse(
                request.responseText
              ) as BlobPutResult;

            if (
              !result ||
              typeof result.url !==
                "string" ||
              !result.url
            ) {
              throw new Error(
                "Invalid video upload response"
              );
            }

            setUploadProgress(100);
            resolve(result);
          } catch (parseError) {
            reject(parseError);
          }
        };

        request.send(file);
      }
    );
  }

  async function openReviewVideo(
    reviewId: number
  ) {
    try {
      setError(null);

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
        "IRONAGE CLIENT VIDEO OPEN ERROR:",
        openError
      );

      setError(copy.loadFailed);
    }
  }

  async function submit() {
    const exercise =
      exerciseName.trim();

    const file =
      selectedVideo;

    if (!exercise || !file) {
      setError(copy.required);
      return;
    }

    if (
      !file.type ||
      !file.type.startsWith(
        "video/"
      )
    ) {
      setError(copy.submitFailed);
      return;
    }

    if (
      file.size >
      250 * 1024 * 1024
    ) {
      setError(copy.submitFailed);
      return;
    }

    try {
      setSubmitting(true);
      setUploadProgress(0);
      setError(null);
      setMessage(null);

      const uploadResponse =
        await api.post<UploadUrlResponse>(
          "/video-reviews/upload-url",
          {
            fileName:
              file.name,
            contentType:
              file.type,
            fileSize:
              file.size,
          },
          telegramAuthOptions()
        );

      if (
        !uploadResponse ||
        uploadResponse.success !== true ||
        !uploadResponse.upload ||
        typeof uploadResponse.upload
          .presignedUrl !== "string"
      ) {
        throw new Error(
          "Invalid video upload URL response"
        );
      }

      const uploaded =
        await uploadVideo(
          file,
          uploadResponse.upload
            .presignedUrl
        );

      const response =
        await api.post<CreateReviewResponse>(
          "/video-reviews",
          {
            exerciseName:
              exercise,

            videoUrl:
              `ironage-blob:${uploaded.pathname}`,

            athleteNote:
              athleteNote.trim() ||
              null,
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
      setSelectedVideo(null);
      setAthleteNote("");
      setUploadProgress(0);

      if (videoInputRef.current) {
        videoInputRef.current.value =
          "";
      }

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
              ref={videoInputRef}
              type="file"
              accept="video/*"
              disabled={submitting}
              onChange={event => {
                const file =
                  event.target.files?.[0] ??
                  null;

                setSelectedVideo(file);
                setUploadProgress(0);
                setError(null);
                setMessage(null);
              }}
            />

            {selectedVideo && (
              <small className="submit-video-review__file-name">
                {selectedVideo.name}
              </small>
            )}
          </label>

          {submitting &&
            uploadProgress > 0 && (
              <div className="submit-video-review__progress">
                <div
                  className="submit-video-review__progress-bar"
                  style={{
                    width:
                      `${uploadProgress}%`,
                  }}
                />

                <span>
                  {uploadProgress}%
                </span>
              </div>
            )}

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

                <button
                  type="button"
                  className="submit-video-review__open-video"
                  onClick={() => {
                    void openReviewVideo(
                      review.id
                    );
                  }}
                >
                  ▶ {copy.openVideo}
                </button>

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
