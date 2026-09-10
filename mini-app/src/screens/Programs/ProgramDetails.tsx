import {
  useEffect,
  useState,
} from "react";

import {
  Capacitor,
} from "@capacitor/core";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import {
  useLanguage,
  type AppLanguage,
} from "../../context/LanguageContext";

import {
  IronAgeStoreKit,
} from "../../native/ironAgeStoreKit";

import "./ProgramDetails.css";

type ProgramData = {
  id: number;
  coachId: number;

  name: string;
  description: string | null;

  durationWeeks:
    number | null;

  priceCents:
    number | null;

  currency:
    string;

  appleProductId:
    string | null;

  coach: {
    id: number;
    firstName: string;
    lastName: string | null;

    coachProfile: {
      displayName: string;
      specialization: string | null;
      photoUrl: string | null;
      isVerified: boolean;
    } | null;
  };


  _count: {
    workouts:
      number;

    assignments:
      number;
  };
};

type Response = {
  success: boolean;
  program: ProgramData;
  hasAccess: boolean;
};

type ClaimResponse = {
  success: boolean;
  hasAccess: boolean;
  assignmentId: number;
  entitlement: {
    id: number;
    source: "FREE_CLAIM";
  };
};

type PurchaseResponse = {
  success: boolean;
  hasAccess: boolean;
  assignmentId: number;

  purchase: {
    id: number;
    provider: "APPLE";
    productId: string;
    transactionId: string;
  };

  entitlement: {
    id: number;
    source: "PURCHASE";
  };
};

type Props = {
  programId: number;
  onBack: () => void;

  onOpenCoach: (
    coachId: number
  ) => void;

  onOpenMyProgram: (
    programId: number
  ) => void;
};

type ProgramDetailsUiCopy = {
  priceTba: string;
  free: string;
  loading: string;
  unavailable: string;
  retry: string;
  program: string;
  verified: string;
  defaultDescription: string;
  coach: string;
  defaultCoach: string;
  weeks: string;
  workouts: string;
  athletes: string;
  content: string;
  protectedTitle: string;
  protectedDescription: string;
  access: string;
  ready: string;
  accessGranted: string;
  accessFree: string;
  accessUnavailable: string;
  accessNotConfigured: string;
  accessPurchase: string;
  accessIos: string;
  getting: string;
  processing: string;
  openProgram: string;
  getProgram: string;
  comingSoon: string;
  purchaseSoon: string;
  purchase: string;
  availableIos: string;
  restoring: string;
  restore: string;
};

const PROGRAM_DETAILS_UI:
Record<AppLanguage, ProgramDetailsUiCopy> = {
  en: {
    priceTba: "PRICE TBA",
    free: "FREE",
    loading: "LOADING PROGRAM...",
    unavailable: "PROGRAM NOT AVAILABLE",
    retry: "RETRY",
    program: "IRONAGE PROGRAM",
    verified: "VERIFIED PROGRAM",
    defaultDescription: "Professional IRONAGE training program.",
    coach: "COACH",
    defaultCoach: "IRONAGE COACH",
    weeks: "WEEKS",
    workouts: "WORKOUTS",
    athletes: "ATHLETES",
    content: "PROGRAM CONTENT",
    protectedTitle: "FULL TRAINING PLAN PROTECTED",
    protectedDescription: "Exercises, sets, repetitions and coach instructions become available only after program access is granted.",
    access: "PROGRAM ACCESS",
    ready: "READY TO TRAIN?",
    accessGranted: "This program is available in your IRONAGE account.",
    accessFree: "Get this program free and start training.",
    accessUnavailable: "Program access is not available yet.",
    accessNotConfigured: "App Store purchase is not configured for this program yet.",
    accessPurchase: "Purchase securely through the App Store and unlock this program.",
    accessIos: "Purchase this program in the IRONAGE iOS app.",
    getting: "GETTING PROGRAM...",
    processing: "PROCESSING PURCHASE...",
    openProgram: "OPEN MY PROGRAM",
    getProgram: "GET PROGRAM",
    comingSoon: "COMING SOON",
    purchaseSoon: "PURCHASE COMING SOON",
    purchase: "PURCHASE",
    availableIos: "AVAILABLE IN IOS APP",
    restoring: "RESTORING...",
    restore: "RESTORE PURCHASES",
  },

  es: {
    priceTba: "PRECIO POR DEFINIR",
    free: "GRATIS",
    loading: "CARGANDO PROGRAMA...",
    unavailable: "PROGRAMA NO DISPONIBLE",
    retry: "REINTENTAR",
    program: "PROGRAMA IRONAGE",
    verified: "PROGRAMA VERIFICADO",
    defaultDescription: "Programa de entrenamiento profesional IRONAGE.",
    coach: "ENTRENADOR",
    defaultCoach: "ENTRENADOR IRONAGE",
    weeks: "SEMANAS",
    workouts: "ENTRENAMIENTOS",
    athletes: "ATLETAS",
    content: "CONTENIDO DEL PROGRAMA",
    protectedTitle: "PLAN DE ENTRENAMIENTO PROTEGIDO",
    protectedDescription: "Los ejercicios, series, repeticiones e instrucciones estarán disponibles después de obtener acceso al programa.",
    access: "ACCESO AL PROGRAMA",
    ready: "¿LISTO PARA ENTRENAR?",
    accessGranted: "Este programa está disponible en tu cuenta IRONAGE.",
    accessFree: "Obtén este programa gratis y empieza a entrenar.",
    accessUnavailable: "El acceso al programa aún no está disponible.",
    accessNotConfigured: "La compra en App Store aún no está configurada para este programa.",
    accessPurchase: "Compra mediante App Store y desbloquea este programa.",
    accessIos: "Compra este programa en la app IRONAGE para iOS.",
    getting: "OBTENIENDO PROGRAMA...",
    processing: "PROCESANDO COMPRA...",
    openProgram: "ABRIR MI PROGRAMA",
    getProgram: "OBTENER PROGRAMA",
    comingSoon: "PRÓXIMAMENTE",
    purchaseSoon: "COMPRA PRÓXIMAMENTE",
    purchase: "COMPRAR",
    availableIos: "DISPONIBLE EN IOS",
    restoring: "RESTAURANDO...",
    restore: "RESTAURAR COMPRAS",
  },

  uk: {
    priceTba: "ЦІНА УТОЧНЮЄТЬСЯ",
    free: "БЕЗКОШТОВНО",
    loading: "ЗАВАНТАЖЕННЯ ПРОГРАМИ...",
    unavailable: "ПРОГРАМА НЕДОСТУПНА",
    retry: "ПОВТОРИТИ",
    program: "ПРОГРАМА IRONAGE",
    verified: "ПЕРЕВІРЕНА ПРОГРАМА",
    defaultDescription: "Професійна тренувальна програма IRONAGE.",
    coach: "ТРЕНЕР",
    defaultCoach: "ТРЕНЕР IRONAGE",
    weeks: "ТИЖНІ",
    workouts: "ТРЕНУВАННЯ",
    athletes: "АТЛЕТИ",
    content: "ВМІСТ ПРОГРАМИ",
    protectedTitle: "ПОВНИЙ ПЛАН ТРЕНУВАНЬ ЗАХИЩЕНО",
    protectedDescription: "Вправи, підходи, повторення та інструкції тренера стануть доступними після отримання доступу до програми.",
    access: "ДОСТУП ДО ПРОГРАМИ",
    ready: "ГОТОВИЙ ТРЕНУВАТИСЯ?",
    accessGranted: "Ця програма доступна у твоєму акаунті IRONAGE.",
    accessFree: "Отримай програму безкоштовно та починай тренування.",
    accessUnavailable: "Доступ до програми поки недоступний.",
    accessNotConfigured: "Покупку через App Store для цієї програми ще не налаштовано.",
    accessPurchase: "Придбай програму через App Store та відкрий доступ.",
    accessIos: "Придбай цю програму в iOS-додатку IRONAGE.",
    getting: "ОТРИМАННЯ ПРОГРАМИ...",
    processing: "ОБРОБКА ПОКУПКИ...",
    openProgram: "ВІДКРИТИ МОЮ ПРОГРАМУ",
    getProgram: "ОТРИМАТИ ПРОГРАМУ",
    comingSoon: "НЕЗАБАРОМ",
    purchaseSoon: "ПОКУПКА НЕЗАБАРОМ",
    purchase: "ПРИДБАТИ",
    availableIos: "ДОСТУПНО В IOS-ДОДАТКУ",
    restoring: "ВІДНОВЛЕННЯ...",
    restore: "ВІДНОВИТИ ПОКУПКИ",
  },

  ru: {
    priceTba: "ЦЕНА УТОЧНЯЕТСЯ",
    free: "БЕСПЛАТНО",
    loading: "ЗАГРУЗКА ПРОГРАММЫ...",
    unavailable: "ПРОГРАММА НЕДОСТУПНА",
    retry: "ПОВТОРИТЬ",
    program: "ПРОГРАММА IRONAGE",
    verified: "ПРОВЕРЕННАЯ ПРОГРАММА",
    defaultDescription: "Профессиональная тренировочная программа IRONAGE.",
    coach: "ТРЕНЕР",
    defaultCoach: "ТРЕНЕР IRONAGE",
    weeks: "НЕДЕЛИ",
    workouts: "ТРЕНИРОВКИ",
    athletes: "АТЛЕТЫ",
    content: "СОДЕРЖАНИЕ ПРОГРАММЫ",
    protectedTitle: "ПОЛНЫЙ ПЛАН ТРЕНИРОВОК ЗАЩИЩЁН",
    protectedDescription: "Упражнения, подходы, повторения и инструкции тренера станут доступны после получения доступа к программе.",
    access: "ДОСТУП К ПРОГРАММЕ",
    ready: "ГОТОВ К ТРЕНИРОВКЕ?",
    accessGranted: "Эта программа доступна в вашем аккаунте IRONAGE.",
    accessFree: "Получите программу бесплатно и начинайте тренироваться.",
    accessUnavailable: "Доступ к программе пока недоступен.",
    accessNotConfigured: "Покупка через App Store для этой программы ещё не настроена.",
    accessPurchase: "Приобретите программу через App Store и откройте доступ.",
    accessIos: "Приобретите эту программу в iOS-приложении IRONAGE.",
    getting: "ПОЛУЧЕНИЕ ПРОГРАММЫ...",
    processing: "ОБРАБОТКА ПОКУПКИ...",
    openProgram: "ОТКРЫТЬ МОЮ ПРОГРАММУ",
    getProgram: "ПОЛУЧИТЬ ПРОГРАММУ",
    comingSoon: "СКОРО",
    purchaseSoon: "ПОКУПКА СКОРО",
    purchase: "КУПИТЬ",
    availableIos: "ДОСТУПНО В IOS-ПРИЛОЖЕНИИ",
    restoring: "ВОССТАНОВЛЕНИЕ...",
    restore: "ВОССТАНОВИТЬ ПОКУПКИ",
  },

  fr: {
    priceTba: "PRIX À VENIR",
    free: "GRATUIT",
    loading: "CHARGEMENT DU PROGRAMME...",
    unavailable: "PROGRAMME INDISPONIBLE",
    retry: "RÉESSAYER",
    program: "PROGRAMME IRONAGE",
    verified: "PROGRAMME VÉRIFIÉ",
    defaultDescription: "Programme d’entraînement professionnel IRONAGE.",
    coach: "COACH",
    defaultCoach: "COACH IRONAGE",
    weeks: "SEMAINES",
    workouts: "ENTRAÎNEMENTS",
    athletes: "ATHLÈTES",
    content: "CONTENU DU PROGRAMME",
    protectedTitle: "PLAN D’ENTRAÎNEMENT COMPLET PROTÉGÉ",
    protectedDescription: "Les exercices, séries, répétitions et instructions du coach deviennent disponibles après l’accès au programme.",
    access: "ACCÈS AU PROGRAMME",
    ready: "PRÊT À T’ENTRAÎNER ?",
    accessGranted: "Ce programme est disponible dans ton compte IRONAGE.",
    accessFree: "Obtiens ce programme gratuitement et commence à t’entraîner.",
    accessUnavailable: "L’accès au programme n’est pas encore disponible.",
    accessNotConfigured: "L’achat App Store n’est pas encore configuré pour ce programme.",
    accessPurchase: "Achète ce programme via l’App Store pour le débloquer.",
    accessIos: "Achète ce programme dans l’application iOS IRONAGE.",
    getting: "OBTENTION DU PROGRAMME...",
    processing: "TRAITEMENT DE L’ACHAT...",
    openProgram: "OUVRIR MON PROGRAMME",
    getProgram: "OBTENIR LE PROGRAMME",
    comingSoon: "BIENTÔT",
    purchaseSoon: "ACHAT BIENTÔT",
    purchase: "ACHETER",
    availableIos: "DISPONIBLE DANS L’APP IOS",
    restoring: "RESTAURATION...",
    restore: "RESTAURER LES ACHATS",
  },

  de: {
    priceTba: "PREIS FOLGT",
    free: "KOSTENLOS",
    loading: "PROGRAMM WIRD GELADEN...",
    unavailable: "PROGRAMM NICHT VERFÜGBAR",
    retry: "ERNEUT VERSUCHEN",
    program: "IRONAGE PROGRAMM",
    verified: "VERIFIZIERTES PROGRAMM",
    defaultDescription: "Professionelles IRONAGE-Trainingsprogramm.",
    coach: "COACH",
    defaultCoach: "IRONAGE COACH",
    weeks: "WOCHEN",
    workouts: "TRAININGS",
    athletes: "ATHLETEN",
    content: "PROGRAMMINHALT",
    protectedTitle: "VOLLSTÄNDIGER TRAININGSPLAN GESCHÜTZT",
    protectedDescription: "Übungen, Sätze, Wiederholungen und Coach-Anweisungen werden nach Freischaltung des Programms verfügbar.",
    access: "PROGRAMMZUGANG",
    ready: "BEREIT ZU TRAINIEREN?",
    accessGranted: "Dieses Programm ist in deinem IRONAGE-Konto verfügbar.",
    accessFree: "Hol dir dieses Programm kostenlos und starte dein Training.",
    accessUnavailable: "Der Programmzugang ist noch nicht verfügbar.",
    accessNotConfigured: "Der App-Store-Kauf ist für dieses Programm noch nicht eingerichtet.",
    accessPurchase: "Kaufe über den App Store und schalte dieses Programm frei.",
    accessIos: "Kaufe dieses Programm in der IRONAGE iOS-App.",
    getting: "PROGRAMM WIRD FREIGESCHALTET...",
    processing: "KAUF WIRD VERARBEITET...",
    openProgram: "MEIN PROGRAMM ÖFFNEN",
    getProgram: "PROGRAMM HOLEN",
    comingSoon: "BALD VERFÜGBAR",
    purchaseSoon: "KAUF BALD VERFÜGBAR",
    purchase: "KAUFEN",
    availableIos: "IN DER IOS-APP VERFÜGBAR",
    restoring: "WIEDERHERSTELLUNG...",
    restore: "KÄUFE WIEDERHERSTELLEN",
  },

  pt: {
    priceTba: "PREÇO A DEFINIR",
    free: "GRÁTIS",
    loading: "CARREGANDO PROGRAMA...",
    unavailable: "PROGRAMA INDISPONÍVEL",
    retry: "TENTAR NOVAMENTE",
    program: "PROGRAMA IRONAGE",
    verified: "PROGRAMA VERIFICADO",
    defaultDescription: "Programa de treino profissional IRONAGE.",
    coach: "TREINADOR",
    defaultCoach: "TREINADOR IRONAGE",
    weeks: "SEMANAS",
    workouts: "TREINOS",
    athletes: "ATLETAS",
    content: "CONTEÚDO DO PROGRAMA",
    protectedTitle: "PLANO COMPLETO DE TREINO PROTEGIDO",
    protectedDescription: "Exercícios, séries, repetições e instruções do treinador ficam disponíveis após o acesso ao programa.",
    access: "ACESSO AO PROGRAMA",
    ready: "PRONTO PARA TREINAR?",
    accessGranted: "Este programa está disponível na sua conta IRONAGE.",
    accessFree: "Obtenha este programa gratuitamente e comece a treinar.",
    accessUnavailable: "O acesso ao programa ainda não está disponível.",
    accessNotConfigured: "A compra pela App Store ainda não está configurada para este programa.",
    accessPurchase: "Compre pela App Store e desbloqueie este programa.",
    accessIos: "Compre este programa no aplicativo IRONAGE para iOS.",
    getting: "OBTENDO PROGRAMA...",
    processing: "PROCESSANDO COMPRA...",
    openProgram: "ABRIR MEU PROGRAMA",
    getProgram: "OBTER PROGRAMA",
    comingSoon: "EM BREVE",
    purchaseSoon: "COMPRA EM BREVE",
    purchase: "COMPRAR",
    availableIos: "DISPONÍVEL NO APP IOS",
    restoring: "RESTAURANDO...",
    restore: "RESTAURAR COMPRAS",
  },

  bg: {
    priceTba: "ЦЕНАТА ПРЕДСТОИ",
    free: "БЕЗПЛАТНО",
    loading: "ЗАРЕЖДАНЕ НА ПРОГРАМАТА...",
    unavailable: "ПРОГРАМАТА НЕ Е ДОСТЪПНА",
    retry: "ОПИТАЙ ОТНОВО",
    program: "ПРОГРАМА IRONAGE",
    verified: "ПОТВЪРДЕНА ПРОГРАМА",
    defaultDescription: "Професионална тренировъчна програма IRONAGE.",
    coach: "ТРЕНЬОР",
    defaultCoach: "ТРЕНЬОР IRONAGE",
    weeks: "СЕДМИЦИ",
    workouts: "ТРЕНИРОВКИ",
    athletes: "АТЛЕТИ",
    content: "СЪДЪРЖАНИЕ НА ПРОГРАМАТА",
    protectedTitle: "ПЪЛНИЯТ ТРЕНИРОВЪЧЕН ПЛАН Е ЗАЩИТЕН",
    protectedDescription: "Упражненията, сериите, повторенията и инструкциите стават достъпни след получаване на достъп до програмата.",
    access: "ДОСТЪП ДО ПРОГРАМАТА",
    ready: "ГОТОВ ЛИ СИ ЗА ТРЕНИРОВКА?",
    accessGranted: "Тази програма е достъпна в твоя IRONAGE профил.",
    accessFree: "Вземи програмата безплатно и започни да тренираш.",
    accessUnavailable: "Достъпът до програмата все още не е наличен.",
    accessNotConfigured: "Покупката през App Store още не е настроена за тази програма.",
    accessPurchase: "Купи чрез App Store и отключи програмата.",
    accessIos: "Купи тази програма в iOS приложението IRONAGE.",
    getting: "ПОЛУЧАВАНЕ НА ПРОГРАМАТА...",
    processing: "ОБРАБОТКА НА ПОКУПКАТА...",
    openProgram: "ОТВОРИ МОЯТА ПРОГРАМА",
    getProgram: "ВЗЕМИ ПРОГРАМАТА",
    comingSoon: "ОЧАКВАЙТЕ СКОРО",
    purchaseSoon: "ПОКУПКА СКОРО",
    purchase: "КУПИ",
    availableIos: "ДОСТЪПНО В IOS ПРИЛОЖЕНИЕТО",
    restoring: "ВЪЗСТАНОВЯВАНЕ...",
    restore: "ВЪЗСТАНОВИ ПОКУПКИТЕ",
  },
};

function formatPrice(
  priceCents: number | null,
  currency: string,
  copy: ProgramDetailsUiCopy
): string {
  if (priceCents === null) {
    return copy.priceTba;
  }

  if (priceCents === 0) {
    return copy.free;
  }

  try {
    return new Intl.NumberFormat(
      undefined,
      {
        style: "currency",
        currency,
      }
    ).format(
      priceCents / 100
    );
  } catch {
    return `${(
      priceCents / 100
    ).toFixed(2)} ${currency}`;
  }
}

export default function ProgramDetails({
  programId,
  onBack,
  onOpenCoach,
  onOpenMyProgram,
}: Props) {
  const { language } = useLanguage();
  const copy = PROGRAM_DETAILS_UI[language];

  const [
    program,
    setProgram,
  ] = useState<ProgramData | null>(
    null
  );

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
    hasAccess,
    setHasAccess,
  ] = useState(false);

  const [
    claiming,
    setClaiming,
  ] = useState(false);

  const [
    claimError,
    setClaimError,
  ] = useState<string | null>(
    null
  );

  const [
    purchasing,
    setPurchasing,
  ] = useState(false);

  const [
    purchaseError,
    setPurchaseError,
  ] = useState<string | null>(
    null
  );

  const [
    restoring,
    setRestoring,
  ] = useState(false);

  const [
    restoreError,
    setRestoreError,
  ] = useState<string | null>(
    null
  );

  const isNativeIOS =
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === "ios";

  async function loadProgram() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.get<Response>(
          `/programs/${programId}`,
          telegramAuthOptions()
        );

      if (!response.program) {
        throw new Error(
          "Program not found"
        );
      }

      setProgram(
        response.program
      );

      setHasAccess(
        Boolean(
          response.hasAccess
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load program"
      );
    } finally {
      setLoading(false);
    }
  }

  async function claimFreeProgram() {
    if (
      claiming ||
      hasAccess ||
      !program ||
      program.priceCents !== 0
    ) {
      return;
    }

    try {
      setClaiming(true);
      setClaimError(null);

      const response =
        await api.post<ClaimResponse>(
          `/programs/${program.id}/claim`,
          {},
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        response.hasAccess !== true
      ) {
        throw new Error(
          "Program claim failed"
        );
      }

      setHasAccess(true);
    } catch (err) {
      console.error(
        "IRONAGE FREE PROGRAM CLAIM UI ERROR:",
        err
      );

      setClaimError(
        err instanceof Error
          ? err.message
          : "Failed to get program"
      );
    } finally {
      setClaiming(false);
    }
  }

  async function restoreAppleProgram() {
    if (
      restoring ||
      hasAccess ||
      !program ||
      program.priceCents === null ||
      program.priceCents <= 0
    ) {
      return;
    }

    if (!isNativeIOS) {
      setRestoreError(
        "Restore purchases is available in the IRONAGE iOS app."
      );
      return;
    }

    if (!program.appleProductId) {
      setRestoreError(
        "This program is not configured for App Store purchase yet."
      );
      return;
    }

    try {
      setRestoring(true);
      setRestoreError(null);

      const restored =
        await IronAgeStoreKit.restorePurchases();

      const matchingTransaction =
        restored.transactions.find(
          transaction =>
            transaction.productId ===
            program.appleProductId
        );

      if (!matchingTransaction) {
        throw new Error(
          "No previous App Store purchase was found for this program"
        );
      }

      const response =
        await api.post<PurchaseResponse>(
          `/programs/${program.id}/purchase/apple`,
          {
            signedTransaction:
              matchingTransaction.signedTransaction,
          },
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        response.hasAccess !== true
      ) {
        throw new Error(
          "Program restore verification failed"
        );
      }

      const finish =
        await IronAgeStoreKit.finishTransaction({
          transactionId:
            matchingTransaction.transactionId,
        });

      if (
        !finish ||
        finish.success !== true
      ) {
        throw new Error(
          "StoreKit restored transaction finish failed"
        );
      }

      setHasAccess(true);
    } catch (err) {
      console.error(
        "IRONAGE APPLE PROGRAM RESTORE UI ERROR:",
        err
      );

      setRestoreError(
        err instanceof Error
          ? err.message
          : "Program restore failed"
      );
    } finally {
      setRestoring(false);
    }
  }

  async function purchaseAppleProgram() {
    if (
      purchasing ||
      hasAccess ||
      !program ||
      program.priceCents === null ||
      program.priceCents <= 0
    ) {
      return;
    }

    if (!isNativeIOS) {
      setPurchaseError(
        "Program purchase is available in the IRONAGE iOS app."
      );
      return;
    }

    if (!program.appleProductId) {
      setPurchaseError(
        "This program is not configured for App Store purchase yet."
      );
      return;
    }

    try {
      setPurchasing(true);
      setPurchaseError(null);

      const purchase =
        await IronAgeStoreKit.purchase({
          productId:
            program.appleProductId,
        });

      if (
        purchase.status ===
        "CANCELLED"
      ) {
        setPurchaseError(
          "Purchase cancelled."
        );
        return;
      }

      if (
        purchase.status ===
        "PENDING"
      ) {
        setPurchaseError(
          "Purchase is pending Apple approval."
        );
        return;
      }

      if (
        !purchase.signedTransaction
      ) {
        throw new Error(
          "Apple signed transaction is missing"
        );
      }

      const response =
        await api.post<PurchaseResponse>(
          `/programs/${program.id}/purchase/apple`,
          {
            signedTransaction:
              purchase.signedTransaction,
          },
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        response.hasAccess !== true
      ) {
        throw new Error(
          "Program purchase verification failed"
        );
      }

      const finish =
        await IronAgeStoreKit.finishTransaction({
          transactionId:
            purchase.transactionId,
        });

      if (
        !finish ||
        finish.success !== true
      ) {
        throw new Error(
          "StoreKit transaction finish failed"
        );
      }

      setHasAccess(true);
    } catch (err) {
      console.error(
        "IRONAGE APPLE PROGRAM PURCHASE UI ERROR:",
        err
      );

      setPurchaseError(
        err instanceof Error
          ? err.message
          : "Program purchase failed"
      );
    } finally {
      setPurchasing(false);
    }
  }

  useEffect(() => {
    void loadProgram();
  }, [programId]);

  if (loading) {
    return (
      <main className="program-detail">
        <div className="program-detail__state">
          {copy.loading}
        </div>
      </main>
    );
  }

  if (
    error ||
    !program
  ) {
    return (
      <main className="program-detail">
        <div className="program-detail__shell">
          <button
            type="button"
            className="program-detail__back"
            onClick={onBack}
          >
            ←
          </button>

          <div className="program-detail__state">
            <strong>
              {copy.unavailable}
            </strong>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadProgram()
              }
            >
              {copy.retry}
            </button>
          </div>
        </div>
      </main>
    );
  }

  const coach =
    program.coach
      .coachProfile;

  return (
    <main className="program-detail">
      <div className="program-detail__shell">

        <header className="program-detail__header">
          <button
            type="button"
            className="program-detail__back"
            onClick={onBack}
          >
            ←
          </button>

          <span>
            {copy.program}
          </span>
        </header>


        <section className="program-detail__hero">
          <span>
            {copy.verified}
          </span>

          <h1>
            {program.name}
          </h1>

          <p>
            {program.description ||
              copy.defaultDescription}
          </p>

          <div className="program-detail__price">
            {formatPrice(
              program.priceCents,
              program.currency,
              copy
            )}
          </div>
        </section>


        <section
          className="program-detail__coach"
          onClick={() =>
            onOpenCoach(
              program.coachId
            )
          }
        >
          <div className="program-detail__coach-photo">
            {coach?.photoUrl ? (
              <img
                src={
                  coach.photoUrl
                }
                alt={
                  coach.displayName
                }
              />
            ) : (
              <span>
                {(coach?.displayName ||
                  program.coach
                    .firstName)
                  .slice(0,1)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <span>
              {copy.coach}
            </span>

            <strong>
              {coach?.displayName ||
                program.coach
                  .firstName}
              {coach?.isVerified
                ? " ✓"
                : ""}
            </strong>

            <p>
              {coach?.specialization ||
                copy.defaultCoach}
            </p>
          </div>

          <b>
            →
          </b>
        </section>


        <section className="program-detail__stats">
          <div>
            <strong>
              {program.durationWeeks ??
                "—"}
            </strong>

            <span>
              {copy.weeks}
            </span>
          </div>

          <div>
            <strong>
              {
                program
                  ._count
                  .workouts
              }
            </strong>

            <span>
              {copy.workouts}
            </span>
          </div>

          <div>
            <strong>
              {
                program
                  ._count
                  .assignments
              }
            </strong>

            <span>
              {copy.athletes}
            </span>
          </div>
        </section>


        <section className="program-detail__access">
          <span>
            {copy.content}
          </span>

          <h2>
            {copy.protectedTitle}
          </h2>

          <p>
            {copy.protectedDescription}
          </p>
        </section>


        <section className="program-detail__access">
          <span>
            {copy.access}
          </span>

          <h2>
            {copy.ready}
          </h2>

          <p>
            {hasAccess
              ? copy.accessGranted
              : program.priceCents === 0
                ? copy.accessFree
                : program.priceCents === null
                  ? copy.accessUnavailable
                  : !program.appleProductId
                    ? copy.accessNotConfigured
                    : isNativeIOS
                      ? copy.accessPurchase
                      : copy.accessIos}
          </p>

          {claimError && (
            <p
              role="alert"
              className="program-detail__access-error"
            >
              {claimError}
            </p>
          )}

          {purchaseError && (
            <p
              role="alert"
              className="program-detail__access-error"
            >
              {purchaseError}
            </p>
          )}

          {restoreError && (
            <p
              role="alert"
              className="program-detail__access-error"
            >
              {restoreError}
            </p>
          )}

          <button
            type="button"
            disabled={
              claiming ||
              purchasing ||
              restoring ||
              (
                !hasAccess &&
                program.priceCents === null
              ) ||
              (
                !hasAccess &&
                program.priceCents !== null &&
                program.priceCents > 0 &&
                (
                  !isNativeIOS ||
                  !program.appleProductId
                )
              )
            }
            onClick={() => {
              if (hasAccess) {
                onOpenMyProgram(
                  program.id
                );

                return;
              }

              if (
                program.priceCents === 0
              ) {
                void claimFreeProgram();
                return;
              }

              if (
                program.priceCents !== null &&
                program.priceCents > 0
              ) {
                void purchaseAppleProgram();
              }
            }}
          >
            {claiming
              ? copy.getting
              : purchasing
                ? copy.processing
                : hasAccess
                  ? copy.openProgram
                  : program.priceCents === 0
                    ? copy.getProgram
                    : program.priceCents === null
                      ? copy.comingSoon
                      : !program.appleProductId
                        ? copy.purchaseSoon
                        : isNativeIOS
                          ? copy.purchase
                          : copy.availableIos}
          </button>

          {!hasAccess &&
            isNativeIOS &&
            program.priceCents !== null &&
            program.priceCents > 0 &&
            program.appleProductId && (
              <button
                type="button"
                className="program-detail__restore"
                disabled={
                  restoring ||
                  purchasing
                }
                onClick={() =>
                  void restoreAppleProgram()
                }
              >
                {restoring
                  ? copy.restoring
                  : copy.restore}
              </button>
            )}
        </section>

      </div>
    </main>
  );
}
