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

import CoachDashboard from "./CoachDashboard";

import "./CoachEntry.css";

type Props = {
  onBack: () => void;
};

type CoachProfile = {
  id: number;
  userId: number;
  displayName: string;
  bio: string | null;
  specialization: string | null;
  photoUrl: string | null;
  isVerified: boolean;
  isActive: boolean;
};

type CoachMeResponse = {
  success: boolean;
  coach: CoachProfile | null;
};

type CoachSaveResponse = {
  success: boolean;
  coach: CoachProfile;
};

type Copy = {
  loading: string;
  loadError: string;
  retry: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  displayName: string;
  displayNamePlaceholder: string;
  specialization: string;
  specializationPlaceholder: string;
  bio: string;
  bioPlaceholder: string;
  photo: string;
  photoPlaceholder: string;
  optional: string;
  publish: string;
  publishing: string;
  required: string;
  saveError: string;
  marketplace: string;
  dashboard: string;
  pendingTitle: string;
  pendingText: string;
  pendingStatus: string;
  editProfile: string;
};

const COPY: Record<AppLanguage, Copy> = {
  en: {
    loading: "LOADING COACH PROFILE...",
    loadError: "COACH PROFILE LOAD ERROR",
    retry: "RETRY",
    eyebrow: "IRONAGE COACHING",
    title: "BECOME A COACH",
    subtitle:
      "CREATE YOUR PROFESSIONAL COACH PROFILE",
    displayName: "COACH NAME",
    displayNamePlaceholder:
      "How athletes will see your name",
    specialization: "SPECIALIZATION",
    specializationPlaceholder:
      "Strength · Weight loss · Fitness",
    bio: "ABOUT YOU",
    bioPlaceholder:
      "Tell athletes about your experience and coaching style",
    photo: "PROFILE PHOTO URL",
    photoPlaceholder:
      "https://...",
    optional: "OPTIONAL",
    publish: "CREATE COACH PROFILE",
    publishing: "CREATING PROFILE...",
    required:
      "Coach name is required",
    saveError:
      "Failed to create coach profile",
    marketplace:
      "Your profile can appear in the IRONAGE coach marketplace.",
    dashboard:
      "After creation you will enter your Coach Dashboard.",
    pendingTitle: 'PROFILE UNDER REVIEW',
    pendingText: 'Your coach profile has been created. It must be approved before athletes can find you in the IRONAGE marketplace.',
    pendingStatus: 'PENDING REVIEW',
    editProfile: 'EDIT PROFILE',
  },

  es: {
    loading: "CARGANDO PERFIL DE ENTRENADOR...",
    loadError:
      "ERROR AL CARGAR EL PERFIL",
    retry: "REINTENTAR",
    eyebrow: "COACHING IRONAGE",
    title: "CONVIÉRTETE EN ENTRENADOR",
    subtitle:
      "CREA TU PERFIL PROFESIONAL",
    displayName:
      "NOMBRE DEL ENTRENADOR",
    displayNamePlaceholder:
      "Cómo verán tu nombre los atletas",
    specialization: "ESPECIALIZACIÓN",
    specializationPlaceholder:
      "Fuerza · Pérdida de peso · Fitness",
    bio: "SOBRE TI",
    bioPlaceholder:
      "Cuenta tu experiencia y estilo de entrenamiento",
    photo: "URL DE FOTO DE PERFIL",
    photoPlaceholder:
      "https://...",
    optional: "OPCIONAL",
    publish:
      "CREAR PERFIL DE ENTRENADOR",
    publishing:
      "CREANDO PERFIL...",
    required:
      "El nombre del entrenador es obligatorio",
    saveError:
      "No se pudo crear el perfil",
    marketplace:
      "Tu perfil podrá aparecer en el marketplace de entrenadores IRONAGE.",
    dashboard:
      "Después entrarás directamente a tu panel de entrenador.",
    pendingTitle: 'PERFIL EN REVISIÓN',
    pendingText: 'Tu perfil de entrenador ha sido creado. Debe ser aprobado antes de que los atletas puedan encontrarte en IRONAGE.',
    pendingStatus: 'PENDIENTE DE REVISIÓN',
    editProfile: 'EDITAR PERFIL',
  },

  uk: {
    loading:
      "ЗАВАНТАЖЕННЯ ПРОФІЛЮ ТРЕНЕРА...",
    loadError:
      "ПОМИЛКА ЗАВАНТАЖЕННЯ ПРОФІЛЮ",
    retry: "СПРОБУВАТИ ЗНОВУ",
    eyebrow: "IRONAGE COACHING",
    title: "СТАТИ ТРЕНЕРОМ",
    subtitle:
      "СТВОРИ СВІЙ ПРОФЕСІЙНИЙ ПРОФІЛЬ",
    displayName: "ІМ'Я ТРЕНЕРА",
    displayNamePlaceholder:
      "Як спортсмени бачитимуть твоє ім'я",
    specialization: "СПЕЦІАЛІЗАЦІЯ",
    specializationPlaceholder:
      "Сила · Схуднення · Фітнес",
    bio: "ПРО ТЕБЕ",
    bioPlaceholder:
      "Розкажи про свій досвід і стиль роботи",
    photo:
      "ПОСИЛАННЯ НА ФОТО ПРОФІЛЮ",
    photoPlaceholder:
      "https://...",
    optional: "НЕОБОВ'ЯЗКОВО",
    publish:
      "СТВОРИТИ ПРОФІЛЬ ТРЕНЕРА",
    publishing:
      "СТВОРЕННЯ ПРОФІЛЮ...",
    required:
      "Вкажи ім'я тренера",
    saveError:
      "Не вдалося створити профіль тренера",
    marketplace:
      "Твій профіль зможе з'явитися в каталозі тренерів IRONAGE.",
    dashboard:
      "Після створення ти одразу перейдеш у Coach Dashboard.",
    pendingTitle: 'ПРОФІЛЬ НА ПЕРЕВІРЦІ',
    pendingText: 'Твій профіль тренера створено. Перед появою в каталозі IRONAGE він має пройти перевірку.',
    pendingStatus: 'ОЧІКУЄ ПЕРЕВІРКИ',
    editProfile: 'РЕДАГУВАТИ ПРОФІЛЬ',
  },

  ru: {
    loading:
      "ЗАГРУЗКА ПРОФИЛЯ ТРЕНЕРА...",
    loadError:
      "ОШИБКА ЗАГРУЗКИ ПРОФИЛЯ",
    retry: "ПОВТОРИТЬ",
    eyebrow: "IRONAGE COACHING",
    title: "СТАТЬ ТРЕНЕРОМ",
    subtitle:
      "СОЗДАЙ СВОЙ ПРОФЕССИОНАЛЬНЫЙ ПРОФИЛЬ",
    displayName: "ИМЯ ТРЕНЕРА",
    displayNamePlaceholder:
      "Как спортсмены будут видеть твоё имя",
    specialization: "СПЕЦИАЛИЗАЦИЯ",
    specializationPlaceholder:
      "Сила · Похудение · Фитнес",
    bio: "О ТЕБЕ",
    bioPlaceholder:
      "Расскажи о своём опыте и стиле работы",
    photo:
      "ССЫЛКА НА ФОТО ПРОФИЛЯ",
    photoPlaceholder:
      "https://...",
    optional: "НЕОБЯЗАТЕЛЬНО",
    publish:
      "СОЗДАТЬ ПРОФИЛЬ ТРЕНЕРА",
    publishing:
      "СОЗДАНИЕ ПРОФИЛЯ...",
    required:
      "Укажи имя тренера",
    saveError:
      "Не удалось создать профиль тренера",
    marketplace:
      "Твой профиль сможет появиться в каталоге тренеров IRONAGE.",
    dashboard:
      "После создания ты сразу попадёшь в Coach Dashboard.",
    pendingTitle: 'ПРОФИЛЬ НА ПРОВЕРКЕ',
    pendingText: 'Твой профиль тренера создан. Перед появлением в каталоге IRONAGE он должен пройти проверку.',
    pendingStatus: 'ОЖИДАЕТ ПРОВЕРКИ',
    editProfile: 'РЕДАКТИРОВАТЬ ПРОФИЛЬ',
  },

  fr: {
    loading:
      "CHARGEMENT DU PROFIL COACH...",
    loadError:
      "ERREUR DE CHARGEMENT DU PROFIL",
    retry: "RÉESSAYER",
    eyebrow: "COACHING IRONAGE",
    title: "DEVENIR COACH",
    subtitle:
      "CRÉE TON PROFIL PROFESSIONNEL",
    displayName: "NOM DU COACH",
    displayNamePlaceholder:
      "Le nom que verront les athlètes",
    specialization: "SPÉCIALISATION",
    specializationPlaceholder:
      "Force · Perte de poids · Fitness",
    bio: "À PROPOS DE TOI",
    bioPlaceholder:
      "Présente ton expérience et ton style de coaching",
    photo:
      "URL DE LA PHOTO DE PROFIL",
    photoPlaceholder:
      "https://...",
    optional: "OPTIONNEL",
    publish:
      "CRÉER LE PROFIL COACH",
    publishing:
      "CRÉATION DU PROFIL...",
    required:
      "Le nom du coach est obligatoire",
    saveError:
      "Impossible de créer le profil coach",
    marketplace:
      "Ton profil pourra apparaître dans le marketplace des coachs IRONAGE.",
    dashboard:
      "Après la création, tu accéderas directement au Coach Dashboard.",
    pendingTitle: 'PROFIL EN COURS DE VÉRIFICATION',
    pendingText: "Ton profil coach a été créé. Il doit être approuvé avant d'apparaître dans le marketplace IRONAGE.",
    pendingStatus: 'EN ATTENTE DE VÉRIFICATION',
    editProfile: 'MODIFIER LE PROFIL',
  },

  de: {
    loading:
      "COACH-PROFIL WIRD GELADEN...",
    loadError:
      "FEHLER BEIM LADEN DES PROFILS",
    retry: "ERNEUT VERSUCHEN",
    eyebrow: "IRONAGE COACHING",
    title: "COACH WERDEN",
    subtitle:
      "ERSTELLE DEIN PROFESSIONELLES COACH-PROFIL",
    displayName: "COACH-NAME",
    displayNamePlaceholder:
      "So sehen Athleten deinen Namen",
    specialization:
      "SPEZIALISIERUNG",
    specializationPlaceholder:
      "Kraft · Gewichtsverlust · Fitness",
    bio: "ÜBER DICH",
    bioPlaceholder:
      "Beschreibe deine Erfahrung und deinen Coaching-Stil",
    photo:
      "PROFILFOTO-URL",
    photoPlaceholder:
      "https://...",
    optional: "OPTIONAL",
    publish:
      "COACH-PROFIL ERSTELLEN",
    publishing:
      "PROFIL WIRD ERSTELLT...",
    required:
      "Coach-Name ist erforderlich",
    saveError:
      "Coach-Profil konnte nicht erstellt werden",
    marketplace:
      "Dein Profil kann im IRONAGE Coach-Marktplatz erscheinen.",
    dashboard:
      "Nach der Erstellung gelangst du direkt zum Coach Dashboard.",
    pendingTitle: 'PROFIL WIRD GEPRÜFT',
    pendingText: 'Dein Coach-Profil wurde erstellt. Es muss genehmigt werden, bevor Athleten dich im IRONAGE Marktplatz finden können.',
    pendingStatus: 'PRÜFUNG AUSSTEHEND',
    editProfile: 'PROFIL BEARBEITEN',
  },

  pt: {
    loading:
      "CARREGANDO PERFIL DO TREINADOR...",
    loadError:
      "ERRO AO CARREGAR PERFIL",
    retry: "TENTAR NOVAMENTE",
    eyebrow: "COACHING IRONAGE",
    title: "TORNE-SE TREINADOR",
    subtitle:
      "CRIE SEU PERFIL PROFISSIONAL",
    displayName:
      "NOME DO TREINADOR",
    displayNamePlaceholder:
      "Como os atletas verão seu nome",
    specialization: "ESPECIALIZAÇÃO",
    specializationPlaceholder:
      "Força · Perda de peso · Fitness",
    bio: "SOBRE VOCÊ",
    bioPlaceholder:
      "Conte sobre sua experiência e estilo de treino",
    photo:
      "URL DA FOTO DE PERFIL",
    photoPlaceholder:
      "https://...",
    optional: "OPCIONAL",
    publish:
      "CRIAR PERFIL DE TREINADOR",
    publishing:
      "CRIANDO PERFIL...",
    required:
      "O nome do treinador é obrigatório",
    saveError:
      "Não foi possível criar o perfil",
    marketplace:
      "Seu perfil poderá aparecer no marketplace de treinadores IRONAGE.",
    dashboard:
      "Após criar, você entrará diretamente no Coach Dashboard.",
    pendingTitle: 'PERFIL EM ANÁLISE',
    pendingText: 'Seu perfil de treinador foi criado. Ele precisa ser aprovado antes de aparecer no marketplace IRONAGE.',
    pendingStatus: 'AGUARDANDO ANÁLISE',
    editProfile: 'EDITAR PERFIL',
  },

  bg: {
    loading:
      "ЗАРЕЖДАНЕ НА ПРОФИЛА НА ТРЕНЬОРА...",
    loadError:
      "ГРЕШКА ПРИ ЗАРЕЖДАНЕ НА ПРОФИЛА",
    retry: "ОПИТАЙ ОТНОВО",
    eyebrow: "IRONAGE COACHING",
    title: "СТАНИ ТРЕНЬОР",
    subtitle:
      "СЪЗДАЙ СВОЯ ПРОФЕСИОНАЛЕН ПРОФИЛ",
    displayName: "ИМЕ НА ТРЕНЬОРА",
    displayNamePlaceholder:
      "Как спортистите ще виждат името ти",
    specialization:
      "СПЕЦИАЛИЗАЦИЯ",
    specializationPlaceholder:
      "Сила · Отслабване · Фитнес",
    bio: "ЗА ТЕБ",
    bioPlaceholder:
      "Разкажи за опита и стила си на работа",
    photo:
      "URL НА ПРОФИЛНАТА СНИМКА",
    photoPlaceholder:
      "https://...",
    optional: "НЕЗАДЪЛЖИТЕЛНО",
    publish:
      "СЪЗДАЙ ПРОФИЛ НА ТРЕНЬОР",
    publishing:
      "СЪЗДАВАНЕ НА ПРОФИЛ...",
    required:
      "Името на треньора е задължително",
    saveError:
      "Профилът на треньора не можа да бъде създаден",
    marketplace:
      "Профилът ти може да се появи в каталога с треньори на IRONAGE.",
    dashboard:
      "След създаването ще влезеш директно в Coach Dashboard.",
    pendingTitle: 'ПРОФИЛЪТ СЕ ПРЕГЛЕЖДА',
    pendingText: 'Профилът ти на треньор е създаден. Той трябва да бъде одобрен, преди спортистите да могат да те намерят в IRONAGE.',
    pendingStatus: 'ОЧАКВА ПРЕГЛЕД',
    editProfile: 'РЕДАКТИРАЙ ПРОФИЛА',
  },
};

type EditCopy = {
  editTitle: string;
  editSubtitle: string;
  saveChanges: string;
  savingChanges: string;
};


type RejectedCopy = {
  title: string;
  status: string;
  text: string;
  edit: string;
  resubmit: string;
  resubmitting: string;
};

const REJECTED_COPY: Record<
  AppLanguage,
  RejectedCopy
> = {
  en: {
    title: "APPLICATION NOT APPROVED",
    status: "PROFILE REJECTED",
    text:
      "Your coach profile was not approved. Update your information and submit it again for review.",
    edit: "EDIT & RESUBMIT",
    resubmit: "RESUBMIT FOR REVIEW",
    resubmitting: "RESUBMITTING...",
  },

  es: {
    title: "SOLICITUD NO APROBADA",
    status: "PERFIL RECHAZADO",
    text:
      "Tu perfil de entrenador no fue aprobado. Actualiza la información y envíalo nuevamente para revisión.",
    edit: "EDITAR Y REENVIAR",
    resubmit: "REENVIAR PARA REVISIÓN",
    resubmitting: "REENVIANDO...",
  },

  uk: {
    title: "ЗАЯВКУ НЕ СХВАЛЕНО",
    status: "ПРОФІЛЬ ВІДХИЛЕНО",
    text:
      "Твій профіль тренера не схвалено. Відредагуй інформацію та надішли заявку на повторну перевірку.",
    edit: "РЕДАГУВАТИ ТА ПОДАТИ ЗНОВУ",
    resubmit: "ПОДАТИ НА ПОВТОРНУ ПЕРЕВІРКУ",
    resubmitting: "ПОВТОРНЕ ПОДАННЯ...",
  },

  ru: {
    title: "ЗАЯВКА НЕ ОДОБРЕНА",
    status: "ПРОФИЛЬ ОТКЛОНЁН",
    text:
      "Твой профиль тренера не одобрен. Отредактируй информацию и отправь заявку на повторную проверку.",
    edit: "ИЗМЕНИТЬ И ОТПРАВИТЬ СНОВА",
    resubmit: "ОТПРАВИТЬ НА ПОВТОРНУЮ ПРОВЕРКУ",
    resubmitting: "ПОВТОРНАЯ ОТПРАВКА...",
  },

  fr: {
    title: "CANDIDATURE NON APPROUVÉE",
    status: "PROFIL REFUSÉ",
    text:
      "Votre profil coach n'a pas été approuvé. Modifiez vos informations et soumettez-le de nouveau.",
    edit: "MODIFIER ET RESOUMETTRE",
    resubmit: "RESOUMETTRE POUR VALIDATION",
    resubmitting: "RENVOI...",
  },

  de: {
    title: "ANTRAG NICHT FREIGEGEBEN",
    status: "PROFIL ABGELEHNT",
    text:
      "Dein Coach-Profil wurde nicht freigegeben. Aktualisiere deine Angaben und reiche es erneut ein.",
    edit: "BEARBEITEN & ERNEUT EINREICHEN",
    resubmit: "ERNEUT ZUR PRÜFUNG EINREICHEN",
    resubmitting: "WIRD ERNEUT EINGEREICHT...",
  },

  pt: {
    title: "SOLICITAÇÃO NÃO APROVADA",
    status: "PERFIL REJEITADO",
    text:
      "Seu perfil de treinador não foi aprovado. Atualize as informações e envie novamente para análise.",
    edit: "EDITAR E REENVIAR",
    resubmit: "REENVIAR PARA ANÁLISE",
    resubmitting: "REENVIANDO...",
  },

  bg: {
    title: "ЗАЯВКАТА НЕ Е ОДОБРЕНА",
    status: "ПРОФИЛЪТ Е ОТХВЪРЛЕН",
    text:
      "Профилът ти на треньор не е одобрен. Редактирай информацията и го изпрати отново за преглед.",
    edit: "РЕДАКТИРАЙ И ИЗПРАТИ ОТНОВО",
    resubmit: "ИЗПРАТИ ОТНОВО ЗА ПРЕГЛЕД",
    resubmitting: "ПОВТОРНО ИЗПРАЩАНЕ...",
  },
};

const EDIT_COPY: Record<AppLanguage, EditCopy> = {
  en: {
    editTitle: "EDIT COACH PROFILE",
    editSubtitle: "UPDATE YOUR PROFESSIONAL PROFILE",
    saveChanges: "SAVE CHANGES",
    savingChanges: "SAVING CHANGES...",
  },

  es: {
    editTitle: "EDITAR PERFIL DE ENTRENADOR",
    editSubtitle: "ACTUALIZA TU PERFIL PROFESIONAL",
    saveChanges: "GUARDAR CAMBIOS",
    savingChanges: "GUARDANDO CAMBIOS...",
  },

  uk: {
    editTitle: "РЕДАГУВАТИ ПРОФІЛЬ ТРЕНЕРА",
    editSubtitle: "ОНОВИ СВІЙ ПРОФЕСІЙНИЙ ПРОФІЛЬ",
    saveChanges: "ЗБЕРЕГТИ ЗМІНИ",
    savingChanges: "ЗБЕРЕЖЕННЯ ЗМІН...",
  },

  ru: {
    editTitle: "РЕДАКТИРОВАТЬ ПРОФИЛЬ ТРЕНЕРА",
    editSubtitle: "ОБНОВИ СВОЙ ПРОФЕССИОНАЛЬНЫЙ ПРОФИЛЬ",
    saveChanges: "СОХРАНИТЬ ИЗМЕНЕНИЯ",
    savingChanges: "СОХРАНЕНИЕ ИЗМЕНЕНИЙ...",
  },

  fr: {
    editTitle: "MODIFIER LE PROFIL COACH",
    editSubtitle: "METS À JOUR TON PROFIL PROFESSIONNEL",
    saveChanges: "ENREGISTRER LES MODIFICATIONS",
    savingChanges: "ENREGISTREMENT...",
  },

  de: {
    editTitle: "COACH-PROFIL BEARBEITEN",
    editSubtitle: "AKTUALISIERE DEIN PROFESSIONELLES PROFIL",
    saveChanges: "ÄNDERUNGEN SPEICHERN",
    savingChanges: "ÄNDERUNGEN WERDEN GESPEICHERT...",
  },

  pt: {
    editTitle: "EDITAR PERFIL DO TREINADOR",
    editSubtitle: "ATUALIZE SEU PERFIL PROFISSIONAL",
    saveChanges: "SALVAR ALTERAÇÕES",
    savingChanges: "SALVANDO ALTERAÇÕES...",
  },

  bg: {
    editTitle: "РЕДАКТИРАЙ ПРОФИЛА НА ТРЕНЬОРА",
    editSubtitle: "ОБНОВИ СВОЯ ПРОФЕСИОНАЛЕН ПРОФИЛ",
    saveChanges: "ЗАПАЗИ ПРОМЕНИТЕ",
    savingChanges: "ЗАПАЗВАНЕ НА ПРОМЕНИТЕ...",
  },
};

export default function CoachEntry({
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

  const editCopy =
    useMemo(
      () => EDIT_COPY[language],
      [language]
    );

  const rejectedCopy =
    useMemo(
      () => REJECTED_COPY[language],
      [language]
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState<string | null>(
    null
  );

  const [
    coach,
    setCoach,
  ] = useState<CoachProfile | null>(
    null
  );

  const [
    editing,
    setEditing,
  ] = useState(false);

  const [
    displayName,
    setDisplayName,
  ] = useState("");

  const [
    specialization,
    setSpecialization,
  ] = useState("");

  const [
    bio,
    setBio,
  ] = useState("");

  const [
    photoUrl,
    setPhotoUrl,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    saveError,
    setSaveError,
  ] = useState<string | null>(
    null
  );

  async function loadProfile() {
    try {
      setLoading(true);
      setLoadError(null);

      const response =
        await api.get<CoachMeResponse>(
          "/coaches/me",
          telegramAuthOptions()
        );

      setCoach(
        response.coach ?? null
      );
    } catch (error) {
      console.error(
        "IRONAGE COACH ENTRY LOAD ERROR:",
        error
      );

      setLoadError(
        error instanceof Error
          ? error.message
          : copy.loadError
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  async function createCoachProfile() {
    const normalizedName =
      displayName.trim();

    if (!normalizedName) {
      setSaveError(
        copy.required
      );
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);

      const response =
        await api.post<CoachSaveResponse>(
          "/coaches/profile",
          {
            displayName:
              normalizedName,

            specialization:
              specialization.trim() ||
              null,

            bio:
              bio.trim() ||
              null,

            photoUrl:
              photoUrl.trim() ||
              null,

            resubmit:
              Boolean(
                coach &&
                coach.isActive === false
              ),
          },
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        !response.coach
      ) {
        throw new Error(
          copy.saveError
        );
      }

      setCoach(
        response.coach
      );

      setEditing(false);
    } catch (error) {
      console.error(
        "IRONAGE COACH PROFILE CREATE ERROR:",
        error
      );

      setSaveError(
        error instanceof Error
          ? error.message
          : copy.saveError
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="coach-entry">
        <div className="coach-entry__shell">
          <section className="coach-entry__state">
            <strong>
              {copy.loading}
            </strong>
          </section>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="coach-entry">
        <div className="coach-entry__shell">
          <header className="coach-entry__header">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
            >
              ←
            </button>
          </header>

          <section className="coach-entry__state coach-entry__state--error">
            <strong>
              {copy.loadError}
            </strong>

            <p>
              {loadError}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadProfile()
              }
            >
              {copy.retry}
            </button>
          </section>
        </div>
      </main>
    );
  }

  if (
    coach &&
    !coach.isVerified &&
    !coach.isActive &&
    !editing
  ) {
    return (
      <main className="coach-entry">
        <div className="coach-entry__shell">
          <header className="coach-entry__header">
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
                {rejectedCopy.title}
              </h1>

              <p>
                {rejectedCopy.status}
              </p>
            </div>
          </header>

          <section className="coach-entry__intro">
            <div className="coach-entry__badge">
              ×
            </div>

            <div>
              <strong>
                {rejectedCopy.status}
              </strong>

              <p>
                {rejectedCopy.text}
              </p>
            </div>
          </section>

          <section className="coach-entry__form">
            <label>
              <span>
                {copy.displayName}
              </span>

              <strong>
                {coach.displayName}
              </strong>
            </label>

            {coach.specialization && (
              <label>
                <span>
                  {copy.specialization}
                </span>

                <strong>
                  {coach.specialization}
                </strong>
              </label>
            )}
          </section>

          <button
            type="button"
            className="coach-entry__submit"
            onClick={() => {
              setDisplayName(
                coach.displayName ?? ""
              );

              setSpecialization(
                coach.specialization ?? ""
              );

              setBio(
                coach.bio ?? ""
              );

              setPhotoUrl(
                coach.photoUrl ?? ""
              );

              setSaveError(null);
              setEditing(true);
            }}
          >
            <span>
              {rejectedCopy.edit}
            </span>

            <b>
              →
            </b>
          </button>
        </div>
      </main>
    );
  }

  if (
    coach &&
    !coach.isVerified &&
    coach.isActive &&
    !editing
  ) {
    return (
      <main className="coach-entry">
        <div className="coach-entry__shell">
          <header className="coach-entry__header">
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
                {copy.pendingTitle}
              </h1>

              <p>
                {copy.pendingStatus}
              </p>
            </div>
          </header>

          <section className="coach-entry__intro">
            <div className="coach-entry__badge">
              ⏳
            </div>

            <div>
              <strong>
                {copy.pendingStatus}
              </strong>

              <p>
                {copy.pendingText}
              </p>
            </div>
          </section>

          <section className="coach-entry__form">
            <label>
              <span>
                {copy.displayName}
              </span>

              <strong>
                {coach.displayName}
              </strong>
            </label>

            {coach.specialization && (
              <label>
                <span>
                  {copy.specialization}
                </span>

                <strong>
                  {coach.specialization}
                </strong>
              </label>
            )}
          </section>

          <button
            type="button"
            className="coach-entry__submit"
            onClick={() => {
              setDisplayName(
                coach.displayName ?? ""
              );

              setSpecialization(
                coach.specialization ?? ""
              );

              setBio(
                coach.bio ?? ""
              );

              setPhotoUrl(
                coach.photoUrl ?? ""
              );

              setSaveError(null);
              setEditing(true);
            }}
          >
            <span>
              {copy.editProfile}
            </span>

            <b>
              →
            </b>
          </button>
        </div>
      </main>
    );
  }

  if (
    coach &&
    !editing
  ) {
    return (
      <CoachDashboard
        onBack={onBack}
        onEditProfile={() => {
          setDisplayName(
            coach.displayName ?? ""
          );

          setSpecialization(
            coach.specialization ?? ""
          );

          setBio(
            coach.bio ?? ""
          );

          setPhotoUrl(
            coach.photoUrl ?? ""
          );

          setSaveError(null);
          setEditing(true);
        }}
      />
    );
  }

  return (
    <main className="coach-entry">
      <div className="coach-entry__shell">
        <header className="coach-entry__header">
          <button
            type="button"
            onClick={() => {
              if (editing) {
                setEditing(false);
                setSaveError(null);
                return;
              }

              onBack();
            }}
            aria-label="Back"
          >
            ←
          </button>

          <div>
            <span>
              {copy.eyebrow}
            </span>

            <h1>
              {editing
                ? coach?.isActive === false
                  ? rejectedCopy.title
                  : editCopy.editTitle
                : copy.title}
            </h1>

            <p>
              {editing
                ? coach?.isActive === false
                  ? rejectedCopy.text
                  : editCopy.editSubtitle
                : copy.subtitle}
            </p>
          </div>
        </header>

        <section className="coach-entry__intro">
          <div className="coach-entry__badge">
            IA
          </div>

          <div>
            <strong>
              IRONAGE COACH
            </strong>

            <p>
              {copy.marketplace}
            </p>

            <small>
              {copy.dashboard}
            </small>
          </div>
        </section>

        <section className="coach-entry__form">
          <label>
            <span>
              {copy.displayName}
            </span>

            <input
              value={
                displayName
              }
              onChange={(event) =>
                setDisplayName(
                  event.target.value
                )
              }
              placeholder={
                copy.displayNamePlaceholder
              }
              autoComplete="name"
            />
          </label>

          <label>
            <span>
              {copy.specialization}
              <small>
                {copy.optional}
              </small>
            </span>

            <input
              value={
                specialization
              }
              onChange={(event) =>
                setSpecialization(
                  event.target.value
                )
              }
              placeholder={
                copy.specializationPlaceholder
              }
            />
          </label>

          <label>
            <span>
              {copy.bio}
              <small>
                {copy.optional}
              </small>
            </span>

            <textarea
              value={bio}
              onChange={(event) =>
                setBio(
                  event.target.value
                )
              }
              placeholder={
                copy.bioPlaceholder
              }
              rows={5}
            />
          </label>

          <label>
            <span>
              {copy.photo}
              <small>
                {copy.optional}
              </small>
            </span>

            <input
              value={photoUrl}
              onChange={(event) =>
                setPhotoUrl(
                  event.target.value
                )
              }
              placeholder={
                copy.photoPlaceholder
              }
              inputMode="url"
            />
          </label>
        </section>

        {photoUrl.trim() && (
          <section className="coach-entry__preview">
            <img
              src={
                photoUrl.trim()
              }
              alt={
                displayName ||
                "Coach"
              }
            />
          </section>
        )}

        {saveError && (
          <section className="coach-entry__error">
            {saveError}
          </section>
        )}

        <button
          type="button"
          className="coach-entry__submit"
          disabled={saving}
          onClick={() =>
            void createCoachProfile()
          }
        >
          <span>
            {saving
              ? (
                  editing
                    ? editCopy.savingChanges
                    : copy.publishing
                )
              : (
                  editing
                    ? editCopy.saveChanges
                    : copy.publish
                )}
          </span>

          <b>
            →
          </b>
        </button>
      </div>
    </main>
  );
}
