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

import "./AdminPrograms.css";

type ProgramStatus =
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "ARCHIVED";

type AdminProgram = {
  id: number;
  coachId: number;

  name: string;
  description: string | null;
  durationWeeks: number | null;

  status: ProgramStatus;
  isPublished: boolean;
  isActive: boolean;

  priceCents: number | null;
  currency: string;

  appleProductId:
    string | null;

  approvedAt: string | null;
  publishedAt: string | null;
  createdAt: string;

  coach: {
    id: number;
    firstName: string;
    lastName: string | null;
    username: string | null;

    coachProfile: {
      displayName: string;
      specialization: string | null;
      photoUrl: string | null;
      isVerified: boolean;
      isActive: boolean;
    } | null;
  };

  approvedByUser: {
    id: number;
    firstName: string;
    lastName: string | null;
    username: string | null;
  } | null;

  _count: {
    workouts: number;
    assignments: number;
  };
};

type ProgramsResponse = {
  success: boolean;
  programs: AdminProgram[];
};

type ProgramActionResponse = {
  success: boolean;
  program: AdminProgram;
};

type Props = {
  onBack: () => void;
};

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;

  loading: string;
  error: string;
  retry: string;

  all: string;
  draft: string;
  review: string;
  approved: string;
  published: string;
  archived: string;

  programs: string;
  noPrograms: string;
  noProgramsText: string;

  coach: string;
  weeks: string;
  workouts: string;
  athletes: string;
  price: string;

  priceInput: string;
  currencyInput: string;
  savePrice: string;
  savingPrice: string;

  appleProductId: string;
  appleProductPlaceholder: string;
  saveProduct: string;
  savingProduct: string;

  approve: string;
  approving: string;

  reject: string;
  rejecting: string;

  publish: string;
  publishing: string;

  unpublish: string;
  unpublishing: string;

  archive: string;
  archiving: string;

  status: string;
};

const COPY: Record<AppLanguage, Copy> = {
  en: {
    eyebrow: "IRONAGE ADMIN",
    title: "PROGRAM MANAGEMENT",
    subtitle: "REVIEW · APPROVE · PUBLISH · CONTROL",

    loading: "LOADING PROGRAMS...",
    error: "PROGRAM MANAGEMENT ERROR",
    retry: "RETRY",

    all: "ALL",
    draft: "DRAFT",
    review: "REVIEW",
    approved: "APPROVED",
    published: "PUBLISHED",
    archived: "ARCHIVED",

    programs: "PROGRAMS",
    noPrograms: "NO PROGRAMS",
    noProgramsText: "There are no programs in this category.",

    coach: "COACH",
    weeks: "WEEKS",
    workouts: "WORKOUTS",
    athletes: "ATHLETES",
    price: "PRICE",

    priceInput: "PROGRAM PRICE",
    currencyInput: "CURRENCY",
    savePrice: "SAVE PRICE",
    savingPrice: "SAVING...",

    appleProductId: "APPLE PRODUCT ID",
    appleProductPlaceholder: "com.ironage.app.program...",
    saveProduct: "SAVE",
    savingProduct: "SAVING...",

    approve: "APPROVE",
    approving: "APPROVING...",

    reject: "RETURN TO DRAFT",
    rejecting: "RETURNING...",

    publish: "PUBLISH",
    publishing: "PUBLISHING...",

    unpublish: "UNPUBLISH",
    unpublishing: "UNPUBLISHING...",

    archive: "ARCHIVE",
    archiving: "ARCHIVING...",

    status: "STATUS",
  },

  uk: {
    eyebrow: "IRONAGE ADMIN",
    title: "КЕРУВАННЯ ПРОГРАМАМИ",
    subtitle: "ПЕРЕВІРКА · СХВАЛЕННЯ · ПУБЛІКАЦІЯ · КОНТРОЛЬ",

    loading: "ЗАВАНТАЖЕННЯ ПРОГРАМ...",
    error: "ПОМИЛКА КЕРУВАННЯ ПРОГРАМАМИ",
    retry: "СПРОБУВАТИ ЗНОВУ",

    all: "УСІ",
    draft: "ЧЕРНЕТКИ",
    review: "ПЕРЕВІРКА",
    approved: "СХВАЛЕНІ",
    published: "ОПУБЛІКОВАНІ",
    archived: "АРХІВ",

    programs: "ПРОГРАМИ",
    noPrograms: "НЕМАЄ ПРОГРАМ",
    noProgramsText: "У цій категорії поки немає програм.",

    coach: "ТРЕНЕР",
    weeks: "ТИЖНІ",
    workouts: "ТРЕНУВАННЯ",
    athletes: "АТЛЕТИ",
    price: "ЦІНА",

    priceInput: "ЦІНА ПРОГРАМИ",
    currencyInput: "ВАЛЮТА",
    savePrice: "ЗБЕРЕГТИ ЦІНУ",
    savingPrice: "ЗБЕРЕЖЕННЯ...",

    appleProductId: "APPLE PRODUCT ID",
    appleProductPlaceholder: "com.ironage.app.program...",
    saveProduct: "ЗБЕРЕГТИ",
    savingProduct: "ЗБЕРЕЖЕННЯ...",

    approve: "СХВАЛИТИ",
    approving: "СХВАЛЕННЯ...",

    reject: "ПОВЕРНУТИ В ЧЕРНЕТКУ",
    rejecting: "ПОВЕРНЕННЯ...",

    publish: "ОПУБЛІКУВАТИ",
    publishing: "ПУБЛІКАЦІЯ...",

    unpublish: "ЗНЯТИ З ПУБЛІКАЦІЇ",
    unpublishing: "ЗНЯТТЯ...",

    archive: "В АРХІВ",
    archiving: "АРХІВАЦІЯ...",

    status: "СТАТУС",
  },

  ru: {
    eyebrow: "IRONAGE ADMIN",
    title: "УПРАВЛЕНИЕ ПРОГРАММАМИ",
    subtitle: "ПРОВЕРКА · ОДОБРЕНИЕ · ПУБЛИКАЦИЯ · КОНТРОЛЬ",

    loading: "ЗАГРУЗКА ПРОГРАММ...",
    error: "ОШИБКА УПРАВЛЕНИЯ ПРОГРАММАМИ",
    retry: "ПОВТОРИТЬ",

    all: "ВСЕ",
    draft: "ЧЕРНОВИКИ",
    review: "ПРОВЕРКА",
    approved: "ОДОБРЕННЫЕ",
    published: "ОПУБЛИКОВАННЫЕ",
    archived: "АРХИВ",

    programs: "ПРОГРАММЫ",
    noPrograms: "НЕТ ПРОГРАММ",
    noProgramsText: "В этой категории пока нет программ.",

    coach: "ТРЕНЕР",
    weeks: "НЕДЕЛИ",
    workouts: "ТРЕНИРОВКИ",
    athletes: "АТЛЕТЫ",
    price: "ЦЕНА",

    priceInput: "ЦЕНА ПРОГРАММЫ",
    currencyInput: "ВАЛЮТА",
    savePrice: "СОХРАНИТЬ ЦЕНУ",
    savingPrice: "СОХРАНЕНИЕ...",

    appleProductId: "APPLE PRODUCT ID",
    appleProductPlaceholder: "com.ironage.app.program...",
    saveProduct: "СОХРАНИТЬ",
    savingProduct: "СОХРАНЕНИЕ...",

    approve: "ОДОБРИТЬ",
    approving: "ОДОБРЕНИЕ...",

    reject: "ВЕРНУТЬ В ЧЕРНОВИК",
    rejecting: "ВОЗВРАТ...",

    publish: "ОПУБЛИКОВАТЬ",
    publishing: "ПУБЛИКАЦИЯ...",

    unpublish: "СНЯТЬ С ПУБЛИКАЦИИ",
    unpublishing: "СНЯТИЕ...",

    archive: "В АРХИВ",
    archiving: "АРХИВАЦИЯ...",

    status: "СТАТУС",
  },

  es: {
    eyebrow: "ADMIN IRONAGE",
    title: "GESTIÓN DE PROGRAMAS",
    subtitle: "REVISAR · APROBAR · PUBLICAR · CONTROLAR",

    loading: "CARGANDO PROGRAMAS...",
    error: "ERROR DE GESTIÓN DE PROGRAMAS",
    retry: "REINTENTAR",

    all: "TODOS",
    draft: "BORRADOR",
    review: "REVISIÓN",
    approved: "APROBADOS",
    published: "PUBLICADOS",
    archived: "ARCHIVADOS",

    programs: "PROGRAMAS",
    noPrograms: "SIN PROGRAMAS",
    noProgramsText: "No hay programas en esta categoría.",

    coach: "ENTRENADOR",
    weeks: "SEMANAS",
    workouts: "ENTRENAMIENTOS",
    athletes: "ATLETAS",
    price: "PRECIO",

    priceInput: "PRECIO DEL PROGRAMA",
    currencyInput: "MONEDA",
    savePrice: "GUARDAR PRECIO",
    savingPrice: "GUARDANDO...",

    appleProductId: "APPLE PRODUCT ID",
    appleProductPlaceholder: "com.ironage.app.program...",
    saveProduct: "GUARDAR",
    savingProduct: "GUARDANDO...",

    approve: "APROBAR",
    approving: "APROBANDO...",

    reject: "VOLVER A BORRADOR",
    rejecting: "DEVOLVIENDO...",

    publish: "PUBLICAR",
    publishing: "PUBLICANDO...",

    unpublish: "DESPUBLICAR",
    unpublishing: "DESPUBLICANDO...",

    archive: "ARCHIVAR",
    archiving: "ARCHIVANDO...",

    status: "ESTADO",
  },

  fr: {
    eyebrow: "ADMIN IRONAGE",
    title: "GESTION DES PROGRAMMES",
    subtitle: "VÉRIFIER · APPROUVER · PUBLIER · CONTRÔLER",

    loading: "CHARGEMENT DES PROGRAMMES...",
    error: "ERREUR DE GESTION DES PROGRAMMES",
    retry: "RÉESSAYER",

    all: "TOUS",
    draft: "BROUILLON",
    review: "RÉVISION",
    approved: "APPROUVÉS",
    published: "PUBLIÉS",
    archived: "ARCHIVÉS",

    programs: "PROGRAMMES",
    noPrograms: "AUCUN PROGRAMME",
    noProgramsText: "Aucun programme dans cette catégorie.",

    coach: "COACH",
    weeks: "SEMAINES",
    workouts: "ENTRAÎNEMENTS",
    athletes: "ATHLÈTES",
    price: "PRIX",

    priceInput: "PRIX DU PROGRAMME",
    currencyInput: "DEVISE",
    savePrice: "ENREGISTRER LE PRIX",
    savingPrice: "ENREGISTREMENT...",

    appleProductId: "APPLE PRODUCT ID",
    appleProductPlaceholder: "com.ironage.app.program...",
    saveProduct: "ENREGISTRER",
    savingProduct: "ENREGISTREMENT...",

    approve: "APPROUVER",
    approving: "APPROBATION...",

    reject: "RETOUR BROUILLON",
    rejecting: "RETOUR...",

    publish: "PUBLIER",
    publishing: "PUBLICATION...",

    unpublish: "DÉPUBLIER",
    unpublishing: "DÉPUBLICATION...",

    archive: "ARCHIVER",
    archiving: "ARCHIVAGE...",

    status: "STATUT",
  },

  de: {
    eyebrow: "IRONAGE ADMIN",
    title: "PROGRAMMVERWALTUNG",
    subtitle: "PRÜFEN · FREIGEBEN · VERÖFFENTLICHEN · KONTROLLIEREN",

    loading: "PROGRAMME WERDEN GELADEN...",
    error: "FEHLER BEI DER PROGRAMMVERWALTUNG",
    retry: "ERNEUT VERSUCHEN",

    all: "ALLE",
    draft: "ENTWURF",
    review: "PRÜFUNG",
    approved: "FREIGEGEBEN",
    published: "VERÖFFENTLICHT",
    archived: "ARCHIVIERT",

    programs: "PROGRAMME",
    noPrograms: "KEINE PROGRAMME",
    noProgramsText: "In dieser Kategorie gibt es keine Programme.",

    coach: "COACH",
    weeks: "WOCHEN",
    workouts: "WORKOUTS",
    athletes: "ATHLETEN",
    price: "PREIS",

    priceInput: "PROGRAMMPREIS",
    currencyInput: "WÄHRUNG",
    savePrice: "PREIS SPEICHERN",
    savingPrice: "SPEICHERN...",

    appleProductId: "APPLE PRODUCT ID",
    appleProductPlaceholder: "com.ironage.app.program...",
    saveProduct: "SPEICHERN",
    savingProduct: "SPEICHERN...",

    approve: "FREIGEBEN",
    approving: "FREIGABE...",

    reject: "ZUM ENTWURF",
    rejecting: "ZURÜCKSETZEN...",

    publish: "VERÖFFENTLICHEN",
    publishing: "VERÖFFENTLICHUNG...",

    unpublish: "ZURÜCKZIEHEN",
    unpublishing: "ZURÜCKZIEHEN...",

    archive: "ARCHIVIEREN",
    archiving: "ARCHIVIERUNG...",

    status: "STATUS",
  },

  pt: {
    eyebrow: "ADMIN IRONAGE",
    title: "GESTÃO DE PROGRAMAS",
    subtitle: "REVISAR · APROVAR · PUBLICAR · CONTROLAR",

    loading: "CARREGANDO PROGRAMAS...",
    error: "ERRO NA GESTÃO DE PROGRAMAS",
    retry: "TENTAR NOVAMENTE",

    all: "TODOS",
    draft: "RASCUNHO",
    review: "REVISÃO",
    approved: "APROVADOS",
    published: "PUBLICADOS",
    archived: "ARQUIVADOS",

    programs: "PROGRAMAS",
    noPrograms: "SEM PROGRAMAS",
    noProgramsText: "Não há programas nesta categoria.",

    coach: "TREINADOR",
    weeks: "SEMANAS",
    workouts: "TREINOS",
    athletes: "ATLETAS",
    price: "PREÇO",

    priceInput: "PREÇO DO PROGRAMA",
    currencyInput: "MOEDA",
    savePrice: "SALVAR PREÇO",
    savingPrice: "SALVANDO...",

    appleProductId: "APPLE PRODUCT ID",
    appleProductPlaceholder: "com.ironage.app.program...",
    saveProduct: "SALVAR",
    savingProduct: "SALVANDO...",

    approve: "APROVAR",
    approving: "APROVANDO...",

    reject: "VOLTAR AO RASCUNHO",
    rejecting: "RETORNANDO...",

    publish: "PUBLICAR",
    publishing: "PUBLICANDO...",

    unpublish: "DESPUBLICAR",
    unpublishing: "DESPUBLICANDO...",

    archive: "ARQUIVAR",
    archiving: "ARQUIVANDO...",

    status: "STATUS",
  },

  bg: {
    eyebrow: "IRONAGE ADMIN",
    title: "УПРАВЛЕНИЕ НА ПРОГРАМИ",
    subtitle: "ПРЕГЛЕД · ОДОБРЕНИЕ · ПУБЛИКУВАНЕ · КОНТРОЛ",

    loading: "ЗАРЕЖДАНЕ НА ПРОГРАМИ...",
    error: "ГРЕШКА ПРИ УПРАВЛЕНИЕ НА ПРОГРАМИ",
    retry: "ОПИТАЙ ОТНОВО",

    all: "ВСИЧКИ",
    draft: "ЧЕРНОВИ",
    review: "ПРЕГЛЕД",
    approved: "ОДОБРЕНИ",
    published: "ПУБЛИКУВАНИ",
    archived: "АРХИВИРАНИ",

    programs: "ПРОГРАМИ",
    noPrograms: "НЯМА ПРОГРАМИ",
    noProgramsText: "Няма програми в тази категория.",

    coach: "ТРЕНЬОР",
    weeks: "СЕДМИЦИ",
    workouts: "ТРЕНИРОВКИ",
    athletes: "АТЛЕТИ",
    price: "ЦЕНА",

    priceInput: "ЦЕНА НА ПРОГРАМАТА",
    currencyInput: "ВАЛУТА",
    savePrice: "ЗАПАЗИ ЦЕНАТА",
    savingPrice: "ЗАПАЗВАНЕ...",

    appleProductId: "APPLE PRODUCT ID",
    appleProductPlaceholder: "com.ironage.app.program...",
    saveProduct: "ЗАПАЗИ",
    savingProduct: "ЗАПАЗВАНЕ...",

    approve: "ОДОБРИ",
    approving: "ОДОБРЯВАНЕ...",

    reject: "ВЪРНИ В ЧЕРНОВА",
    rejecting: "ВРЪЩАНЕ...",

    publish: "ПУБЛИКУВАЙ",
    publishing: "ПУБЛИКУВАНЕ...",

    unpublish: "СПРИ ПУБЛИКАЦИЯТА",
    unpublishing: "СПИРАНЕ...",

    archive: "АРХИВИРАЙ",
    archiving: "АРХИВИРАНЕ...",

    status: "СТАТУС",
  },
};

function formatPrice(
  priceCents: number | null,
  currency: string
): string {
  if (priceCents === null) {
    return "PRICE TBA";
  }

  if (priceCents === 0) {
    return "FREE";
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

export default function AdminPrograms({
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
    programs,
    setPrograms,
  ] = useState<AdminProgram[]>([]);

  const [
    filter,
    setFilter,
  ] = useState<
    "ALL" | ProgramStatus
  >("ALL");

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
    priceDrafts,
    setPriceDrafts,
  ] = useState<
    Record<number, string>
  >({});

  const [
    currencyDrafts,
    setCurrencyDrafts,
  ] = useState<
    Record<number, string>
  >({});

  const [
    savingPriceId,
    setSavingPriceId,
  ] = useState<number | null>(
    null
  );

  const [
    productDrafts,
    setProductDrafts,
  ] = useState<
    Record<number, string>
  >({});

  const [
    savingProductId,
    setSavingProductId,
  ] = useState<number | null>(
    null
  );

  const [
    action,
    setAction,
  ] = useState<{
    id: number;
    type:
      | "approve"
      | "reject"
      | "publish"
      | "unpublish"
      | "archive";
  } | null>(null);

  async function loadPrograms() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.get<ProgramsResponse>(
          "/admin/programs",
          telegramAuthOptions()
        );

      const loadedPrograms =
        Array.isArray(
          response.programs
        )
          ? response.programs
          : [];

      setPrograms(
        loadedPrograms
      );

      setPriceDrafts(
        Object.fromEntries(
          loadedPrograms.map(
            program => [
              program.id,
              program.priceCents ===
              null
                ? ""
                : (
                    program.priceCents /
                    100
                  ).toFixed(2),
            ]
          )
        )
      );

      setCurrencyDrafts(
        Object.fromEntries(
          loadedPrograms.map(
            program => [
              program.id,
              program.currency,
            ]
          )
        )
      );

      setProductDrafts(
        Object.fromEntries(
          loadedPrograms.map(
            program => [
              program.id,
              program.appleProductId ??
                "",
            ]
          )
        )
      );
    } catch (loadError) {
      console.error(
        "IRONAGE ADMIN PROGRAMS LOAD ERROR:",
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
    void loadPrograms();
  }, []);

  const visiblePrograms =
    useMemo(
      () =>
        filter === "ALL"
          ? programs
          : programs.filter(
              program =>
                program.status ===
                filter
            ),
      [
        programs,
        filter,
      ]
    );

  async function performAction(
    programId: number,
    type:
      | "approve"
      | "reject"
      | "publish"
      | "unpublish"
      | "archive"
  ) {
    try {
      setAction({
        id: programId,
        type,
      });

      setError(null);

      const response =
        await api.post<ProgramActionResponse>(
          `/admin/programs/${programId}/${type}`,
          {},
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        !response.program
      ) {
        throw new Error(
          "Program action failed"
        );
      }

      setPrograms(current =>
        current.map(program =>
          program.id === programId
            ? response.program
            : program
        )
      );
    } catch (actionError) {
      console.error(
        "IRONAGE ADMIN PROGRAM ACTION ERROR:",
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

  async function saveProgramPrice(
    programId: number
  ) {
    try {
      setSavingPriceId(
        programId
      );

      setError(null);

      const rawPrice =
        (
          priceDrafts[
            programId
          ] ?? ""
        ).trim();

      const currency =
        (
          currencyDrafts[
            programId
          ] ?? "EUR"
        )
          .trim()
          .toUpperCase();

      let priceCents:
        number | null =
          null;

      if (rawPrice.length > 0) {
        if (
          !/^\d+(?:[.,]\d{1,2})?$/.test(
            rawPrice
          )
        ) {
          throw new Error(
            "Price must use a valid amount, for example 9.99"
          );
        }

        const normalized =
          rawPrice.replace(
            ",",
            "."
          );

        const [
          whole,
          fraction = "",
        ] = normalized.split(
          "."
        );

        const cents =
          Number(whole) * 100 +
          Number(
            fraction.padEnd(
              2,
              "0"
            )
          );

        if (
          !Number.isSafeInteger(
            cents
          ) ||
          cents < 0
        ) {
          throw new Error(
            "Invalid program price"
          );
        }

        priceCents =
          cents;
      }

      if (
        !/^[A-Z]{3}$/.test(
          currency
        )
      ) {
        throw new Error(
          "Currency must be a 3-letter code, for example EUR"
        );
      }

      const response =
        await api.post<ProgramActionResponse>(
          `/admin/programs/${programId}/price`,
          {
            priceCents,
            currency,
          },
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        !response.program
      ) {
        throw new Error(
          "Failed to save program price"
        );
      }

      setPrograms(current =>
        current.map(program =>
          program.id === programId
            ? response.program
            : program
        )
      );

      setPriceDrafts(
        current => ({
          ...current,

          [programId]:
            response.program
              .priceCents ===
            null
              ? ""
              : (
                  response.program
                    .priceCents /
                  100
                ).toFixed(2),
        })
      );

      setCurrencyDrafts(
        current => ({
          ...current,

          [programId]:
            response.program
              .currency,
        })
      );
    } catch (saveError) {
      console.error(
        "IRONAGE ADMIN PROGRAM PRICE SAVE ERROR:",
        saveError
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : copy.error
      );
    } finally {
      setSavingPriceId(
        null
      );
    }
  }

  async function saveAppleProductId(
    programId: number
  ) {
    try {
      setSavingProductId(
        programId
      );

      setError(null);

      const value =
        (
          productDrafts[
            programId
          ] ?? ""
        ).trim();

      const response =
        await api.post<ProgramActionResponse>(
          `/admin/programs/${programId}/store-product`,
          {
            appleProductId:
              value.length > 0
                ? value
                : null,
          },
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        !response.program
      ) {
        throw new Error(
          "Failed to save Apple Product ID"
        );
      }

      setPrograms(current =>
        current.map(program =>
          program.id === programId
            ? response.program
            : program
        )
      );

      setProductDrafts(
        current => ({
          ...current,

          [programId]:
            response.program
              .appleProductId ??
            "",
        })
      );
    } catch (saveError) {
      console.error(
        "IRONAGE ADMIN APPLE PRODUCT SAVE ERROR:",
        saveError
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : copy.error
      );
    } finally {
      setSavingProductId(
        null
      );
    }
  }

  const filters: Array<{
    value:
      | "ALL"
      | ProgramStatus;
    label: string;
  }> = [
    {
      value: "ALL",
      label: copy.all,
    },
    {
      value: "DRAFT",
      label: copy.draft,
    },
    {
      value: "REVIEW",
      label: copy.review,
    },
    {
      value: "APPROVED",
      label: copy.approved,
    },
    {
      value: "PUBLISHED",
      label: copy.published,
    },
    {
      value: "ARCHIVED",
      label: copy.archived,
    },
  ];

  return (
    <main className="admin-programs">
      <div className="admin-programs__shell">

        <header className="admin-programs__header">
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


        <section className="admin-programs__summary">
          <span>
            {copy.programs}
          </span>

          <strong>
            {programs.length}
          </strong>
        </section>


        <section className="admin-programs__filters">
          {filters.map(
            item => (
              <button
                key={item.value}
                type="button"
                className={
                  filter ===
                  item.value
                    ? "is-active"
                    : ""
                }
                onClick={() =>
                  setFilter(
                    item.value
                  )
                }
              >
                {item.label}

                <span>
                  {
                    item.value ===
                    "ALL"
                      ? programs.length
                      : programs.filter(
                          program =>
                            program.status ===
                            item.value
                        ).length
                  }
                </span>
              </button>
            )
          )}
        </section>


        {loading && (
          <section className="admin-programs__state">
            <strong>
              {copy.loading}
            </strong>
          </section>
        )}


        {!loading &&
          error && (
            <section className="admin-programs__state admin-programs__state--error">
              <strong>
                {copy.error}
              </strong>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadPrograms()
                }
              >
                {copy.retry}
              </button>
            </section>
          )}


        {!loading &&
          !error &&
          visiblePrograms.length ===
            0 && (
            <section className="admin-programs__empty">
              <div>
                ✓
              </div>

              <strong>
                {copy.noPrograms}
              </strong>

              <p>
                {copy.noProgramsText}
              </p>
            </section>
          )}


        {!loading &&
          visiblePrograms.length >
            0 && (
            <section className="admin-programs__list">
              {visiblePrograms.map(
                program => {
                  const coach =
                    program.coach
                      .coachProfile;

                  const busy =
                    action?.id ===
                    program.id;

                  const currentAction =
                    busy
                      ? action?.type
                      : null;

                  return (
                    <article
                      key={
                        program.id
                      }
                      className="admin-programs__card"
                    >
                      <div className="admin-programs__card-top">
                        <span>
                          #{program.id}
                        </span>

                        <strong
                          className={`admin-programs__status admin-programs__status--${program.status.toLowerCase()}`}
                        >
                          {
                            program.status
                          }
                        </strong>
                      </div>

                      <h2>
                        {program.name}
                      </h2>

                      <p className="admin-programs__description">
                        {program.description ||
                          "IRONAGE TRAINING PROGRAM"}
                      </p>

                      <section className="admin-programs__coach">
                        <div className="admin-programs__photo">
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
                                  .firstName ||
                                "I")
                                .slice(
                                  0,
                                  1
                                )
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
                              `${program.coach.firstName} ${program.coach.lastName || ""}`.trim()}
                          </strong>

                          <p>
                            {coach?.specialization ||
                              "IRONAGE COACH"}
                          </p>
                        </div>

                        {coach?.isVerified && (
                          <b>
                            ✓
                          </b>
                        )}
                      </section>


                      <section className="admin-programs__stats">
                        <div>
                          <span>
                            {copy.weeks}
                          </span>

                          <strong>
                            {program.durationWeeks ??
                              "—"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            {copy.workouts}
                          </span>

                          <strong>
                            {
                              program
                                ._count
                                .workouts
                            }
                          </strong>
                        </div>

                        <div>
                          <span>
                            {copy.athletes}
                          </span>

                          <strong>
                            {
                              program
                                ._count
                                .assignments
                            }
                          </strong>
                        </div>

                        <div>
                          <span>
                            {copy.price}
                          </span>

                          <strong>
                            {formatPrice(
                              program.priceCents,
                              program.currency
                            )}
                          </strong>
                        </div>
                      </section>


                      <section className="admin-programs__price-config">
                        <label>
                          {copy.priceInput}
                        </label>

                        <div className="admin-programs__price-config-row">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={
                              priceDrafts[
                                program.id
                              ] ?? ""
                            }
                            placeholder="9.99"
                            disabled={
                              savingPriceId ===
                              program.id
                            }
                            onChange={event =>
                              setPriceDrafts(
                                current => ({
                                  ...current,

                                  [program.id]:
                                    event.target.value,
                                })
                              )
                            }
                          />

                          <input
                            type="text"
                            value={
                              currencyDrafts[
                                program.id
                              ] ??
                              program.currency
                            }
                            maxLength={3}
                            placeholder="EUR"
                            aria-label={
                              copy.currencyInput
                            }
                            disabled={
                              savingPriceId ===
                              program.id
                            }
                            onChange={event =>
                              setCurrencyDrafts(
                                current => ({
                                  ...current,

                                  [program.id]:
                                    event.target.value
                                      .toUpperCase(),
                                })
                              )
                            }
                          />

                          <button
                            type="button"
                            disabled={
                              savingPriceId ===
                              program.id
                            }
                            onClick={() =>
                              void saveProgramPrice(
                                program.id
                              )
                            }
                          >
                            {savingPriceId ===
                            program.id
                              ? copy.savingPrice
                              : copy.savePrice}
                          </button>
                        </div>

                        <small>
                          {copy.currencyInput}: {
                            currencyDrafts[
                              program.id
                            ] ??
                            program.currency
                          }
                        </small>
                      </section>


                      <section className="admin-programs__store-product">
                        <label
                          htmlFor={`apple-product-${program.id}`}
                        >
                          {copy.appleProductId}
                        </label>

                        <div className="admin-programs__store-product-row">
                          <input
                            id={`apple-product-${program.id}`}
                            type="text"
                            value={
                              productDrafts[
                                program.id
                              ] ?? ""
                            }
                            placeholder={
                              copy.appleProductPlaceholder
                            }
                            autoComplete="off"
                            spellCheck={false}
                            disabled={
                              savingProductId ===
                              program.id
                            }
                            onChange={event =>
                              setProductDrafts(
                                current => ({
                                  ...current,

                                  [program.id]:
                                    event.target.value,
                                })
                              )
                            }
                          />

                          <button
                            type="button"
                            disabled={
                              savingProductId ===
                              program.id
                            }
                            onClick={() =>
                              void saveAppleProductId(
                                program.id
                              )
                            }
                          >
                            {savingProductId ===
                            program.id
                              ? copy.savingProduct
                              : copy.saveProduct}
                          </button>
                        </div>
                      </section>


                      <section className="admin-programs__actions">

                        {program.status ===
                          "REVIEW" && (
                            <button
                              type="button"
                              className="admin-programs__approve"
                              disabled={
                                busy
                              }
                              onClick={() =>
                                void performAction(
                                  program.id,
                                  "approve"
                                )
                              }
                            >
                              {currentAction ===
                              "approve"
                                ? copy.approving
                                : copy.approve}
                            </button>
                          )}


                        {(program.status ===
                          "REVIEW" ||
                          program.status ===
                            "APPROVED") && (
                          <button
                            type="button"
                            className="admin-programs__secondary"
                            disabled={
                              busy
                            }
                            onClick={() =>
                              void performAction(
                                program.id,
                                "reject"
                              )
                            }
                          >
                            {currentAction ===
                            "reject"
                              ? copy.rejecting
                              : copy.reject}
                          </button>
                        )}


                        {program.status ===
                          "APPROVED" && (
                          <button
                            type="button"
                            className="admin-programs__publish"
                            disabled={
                              busy
                            }
                            onClick={() =>
                              void performAction(
                                program.id,
                                "publish"
                              )
                            }
                          >
                            {currentAction ===
                            "publish"
                              ? copy.publishing
                              : copy.publish}
                          </button>
                        )}


                        {program.status ===
                          "PUBLISHED" && (
                          <button
                            type="button"
                            className="admin-programs__secondary"
                            disabled={
                              busy
                            }
                            onClick={() =>
                              void performAction(
                                program.id,
                                "unpublish"
                              )
                            }
                          >
                            {currentAction ===
                            "unpublish"
                              ? copy.unpublishing
                              : copy.unpublish}
                          </button>
                        )}


                        {program.status !==
                          "ARCHIVED" && (
                          <button
                            type="button"
                            className="admin-programs__archive"
                            disabled={
                              busy
                            }
                            onClick={() =>
                              void performAction(
                                program.id,
                                "archive"
                              )
                            }
                          >
                            {currentAction ===
                            "archive"
                              ? copy.archiving
                              : copy.archive}
                          </button>
                        )}

                      </section>
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
