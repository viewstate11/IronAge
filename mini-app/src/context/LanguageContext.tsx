import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  localizeDocument,
  type RuntimeLanguage,
} from "../i18n/runtimeTranslator";

export const LANGUAGE_OPTIONS = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "es", label: "Español", flag: "🇪🇸" },
  { id: "uk", label: "Українська", flag: "🇺🇦" },
  { id: "ru", label: "Русский", flag: "🇷🇺" },
  { id: "fr", label: "Français", flag: "🇫🇷" },
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
  { id: "pt", label: "Português", flag: "🇵🇹" },
  { id: "bg", label: "Български", flag: "🇧🇬" },
] as const;

export type AppLanguage =
  (typeof LANGUAGE_OPTIONS)[number]["id"];

type TranslationSet =
  Record<AppLanguage, string>;

const translations:
  Record<string, TranslationSet> = {

  /* =====================================================
     COMMON
  ===================================================== */

  "common.back": {
    en: "Back",
    es: "Atrás",
    uk: "Назад",
    ru: "Назад",
    fr: "Retour",
    de: "Zurück",
    pt: "Voltar",
    bg: "Назад",
  },

  "common.loading": {
    en: "Loading...",
    es: "Cargando...",
    uk: "Завантаження...",
    ru: "Загрузка...",
    fr: "Chargement...",
    de: "Laden...",
    pt: "Carregando...",
    bg: "Зареждане...",
  },

  "common.retry": {
    en: "RETRY",
    es: "REINTENTAR",
    uk: "СПРОБУВАТИ ЗНОВУ",
    ru: "ПОВТОРИТЬ",
    fr: "RÉESSAYER",
    de: "ERNEUT VERSUCHEN",
    pt: "TENTAR NOVAMENTE",
    bg: "ОПИТАЙ ОТНОВО",
  },

  /* =====================================================
     PROFILE
  ===================================================== */

  "profile.editProfile": {
    en: "EDIT PROFILE",
    es: "EDITAR PERFIL",
    uk: "РЕДАГУВАТИ ПРОФІЛЬ",
    ru: "РЕДАКТИРОВАТЬ ПРОФИЛЬ",
    fr: "MODIFIER LE PROFIL",
    de: "PROFIL BEARBEITEN",
    pt: "EDITAR PERFIL",
    bg: "РЕДАКТИРАНЕ НА ПРОФИЛА",
  },

  "profile.myTraining": {
    en: "MY TRAINING",
    es: "MI ENTRENAMIENTO",
    uk: "МОЇ ТРЕНУВАННЯ",
    ru: "МОИ ТРЕНИРОВКИ",
    fr: "MON ENTRAÎNEMENT",
    de: "MEIN TRAINING",
    pt: "MEU TREINO",
    bg: "МОЯТА ТРЕНИРОВКА",
  },

  "profile.myProgram": {
    en: "MY PROGRAM",
    es: "MI PROGRAMA",
    uk: "МОЯ ПРОГРАМА",
    ru: "МОЯ ПРОГРАММА",
    fr: "MON PROGRAMME",
    de: "MEIN PROGRAMM",
    pt: "MEU PROGRAMA",
    bg: "МОЯТА ПРОГРАМА",
  },

  "profile.myProgramSubtitle": {
    en: "Current program, week and progress",
    es: "Programa actual, semana y progreso",
    uk: "Поточна програма, тиждень і прогрес",
    ru: "Текущая программа, неделя и прогресс",
    fr: "Programme actuel, semaine et progression",
    de: "Aktuelles Programm, Woche und Fortschritt",
    pt: "Programa atual, semana e progresso",
    bg: "Текуща програма, седмица и напредък",
  },

  "profile.progress": {
    en: "PROGRESS",
    es: "PROGRESO",
    uk: "ПРОГРЕС",
    ru: "ПРОГРЕСС",
    fr: "PROGRÈS",
    de: "FORTSCHRITT",
    pt: "PROGRESSO",
    bg: "НАПРЕДЪК",
  },

  "profile.progressSubtitle": {
    en: "Weight, measurements, photos and strength",
    es: "Peso, medidas, fotos y fuerza",
    uk: "Вага, заміри, фото та сила",
    ru: "Вес, замеры, фото и сила",
    fr: "Poids, mensurations, photos et force",
    de: "Gewicht, Maße, Fotos und Kraft",
    pt: "Peso, medidas, fotos e força",
    bg: "Тегло, мерки, снимки и сила",
  },

  "profile.workoutHistory": {
    en: "WORKOUT HISTORY",
    es: "HISTORIAL DE ENTRENAMIENTOS",
    uk: "ІСТОРІЯ ТРЕНУВАНЬ",
    ru: "ИСТОРИЯ ТРЕНИРОВОК",
    fr: "HISTORIQUE DES ENTRAÎNEMENTS",
    de: "TRAININGSVERLAUF",
    pt: "HISTÓRICO DE TREINOS",
    bg: "ИСТОРИЯ НА ТРЕНИРОВКИТЕ",
  },

  "profile.workoutHistorySubtitle": {
    en: "Completed workouts and performance",
    es: "Entrenamientos completados y rendimiento",
    uk: "Завершені тренування та результати",
    ru: "Завершённые тренировки и результаты",
    fr: "Entraînements terminés et performances",
    de: "Abgeschlossene Trainings und Leistung",
    pt: "Treinos concluídos e desempenho",
    bg: "Завършени тренировки и резултати",
  },

  "profile.coaching": {
    en: "COACHING",
    es: "COACHING",
    uk: "ТРЕНЕР",
    ru: "ТРЕНЕР",
    fr: "COACHING",
    de: "COACHING",
    pt: "COACHING",
    bg: "ТРЕНЬОР",
  },

  "profile.myCoach": {
    en: "MY COACH",
    es: "MI ENTRENADOR",
    uk: "МІЙ ТРЕНЕР",
    ru: "МОЙ ТРЕНЕР",
    fr: "MON COACH",
    de: "MEIN COACH",
    pt: "MEU TREINADOR",
    bg: "МОЯТ ТРЕНЬОР",
  },

  "profile.myCoachSubtitle": {
    en: "Your active coach and coaching status",
    es: "Tu entrenador activo y estado de coaching",
    uk: "Ваш активний тренер і статус супроводу",
    ru: "Ваш активный тренер и статус сопровождения",
    fr: "Votre coach actif et le statut du coaching",
    de: "Dein aktiver Coach und Coaching-Status",
    pt: "Seu treinador ativo e status do coaching",
    bg: "Вашият активен треньор и статус на коучинга",
  },

  "profile.findCoach": {
    en: "FIND A COACH",
    es: "BUSCAR ENTRENADOR",
    uk: "ЗНАЙТИ ТРЕНЕРА",
    ru: "НАЙТИ ТРЕНЕРА",
    fr: "TROUVER UN COACH",
    de: "COACH FINDEN",
    pt: "ENCONTRAR TREINADOR",
    bg: "НАМЕРИ ТРЕНЬОР",
  },

  "profile.findCoachSubtitle": {
    en: "Browse verified IRONAGE coaches",
    es: "Explora entrenadores verificados de IRONAGE",
    uk: "Переглянути перевірених тренерів IRONAGE",
    ru: "Просмотреть проверенных тренеров IRONAGE",
    fr: "Découvrir les coachs IRONAGE vérifiés",
    de: "Verifizierte IRONAGE-Coaches ansehen",
    pt: "Explorar treinadores verificados da IRONAGE",
    bg: "Разгледайте проверени треньори на IRONAGE",
  },

  "profile.programs": {
    en: "PROGRAMS",
    es: "PROGRAMAS",
    uk: "ПРОГРАМИ",
    ru: "ПРОГРАММЫ",
    fr: "PROGRAMMES",
    de: "PROGRAMME",
    pt: "PROGRAMAS",
    bg: "ПРОГРАМИ",
  },

  "profile.programsSubtitle": {
    en: "Explore professional training programs",
    es: "Explora programas de entrenamiento profesionales",
    uk: "Переглянути професійні тренувальні програми",
    ru: "Просмотреть профессиональные тренировочные программы",
    fr: "Découvrir des programmes d’entraînement professionnels",
    de: "Professionelle Trainingsprogramme entdecken",
    pt: "Explorar programas profissionais de treino",
    bg: "Разгледайте професионални тренировъчни програми",
  },

  "profile.account": {
    en: "ACCOUNT",
    es: "CUENTA",
    uk: "АКАУНТ",
    ru: "АККАУНТ",
    fr: "COMPTE",
    de: "KONTO",
    pt: "CONTA",
    bg: "ПРОФИЛ",
  },

  "profile.subscription": {
    en: "SUBSCRIPTION",
    es: "SUSCRIPCIÓN",
    uk: "ПІДПИСКА",
    ru: "ПОДПИСКА",
    fr: "ABONNEMENT",
    de: "ABONNEMENT",
    pt: "ASSINATURA",
    bg: "АБОНАМЕНТ",
  },

  "profile.subscriptionSubtitle": {
    en: "Plan, access and renewal",
    es: "Plan, acceso y renovación",
    uk: "План, доступ і продовження",
    ru: "План, доступ и продление",
    fr: "Plan, accès et renouvellement",
    de: "Plan, Zugriff und Verlängerung",
    pt: "Plano, acesso e renovação",
    bg: "План, достъп и подновяване",
  },

  "profile.payments": {
    en: "PAYMENTS",
    es: "PAGOS",
    uk: "ПЛАТЕЖІ",
    ru: "ПЛАТЕЖИ",
    fr: "PAIEMENTS",
    de: "ZAHLUNGEN",
    pt: "PAGAMENTOS",
    bg: "ПЛАЩАНИЯ",
  },

  "profile.paymentsSubtitle": {
    en: "Purchases, payments and receipts",
    es: "Compras, pagos y recibos",
    uk: "Покупки, платежі та квитанції",
    ru: "Покупки, платежи и квитанции",
    fr: "Achats, paiements et reçus",
    de: "Käufe, Zahlungen und Belege",
    pt: "Compras, pagamentos e recibos",
    bg: "Покупки, плащания и разписки",
  },

  "profile.notifications": {
    en: "NOTIFICATIONS",
    es: "NOTIFICACIONES",
    uk: "СПОВІЩЕННЯ",
    ru: "УВЕДОМЛЕНИЯ",
    fr: "NOTIFICATIONS",
    de: "BENACHRICHTIGUNGEN",
    pt: "NOTIFICAÇÕES",
    bg: "ИЗВЕСТИЯ",
  },

  "profile.notificationsSubtitle": {
    en: "Workout, coach and account alerts",
    es: "Alertas de entrenamiento, entrenador y cuenta",
    uk: "Сповіщення про тренування, тренера та акаунт",
    ru: "Уведомления о тренировках, тренере и аккаунте",
    fr: "Alertes d’entraînement, de coach et de compte",
    de: "Hinweise zu Training, Coach und Konto",
    pt: "Alertas de treino, treinador e conta",
    bg: "Известия за тренировки, треньор и профил",
  },

  "profile.settings": {
    en: "SETTINGS",
    es: "AJUSTES",
    uk: "НАЛАШТУВАННЯ",
    ru: "НАСТРОЙКИ",
    fr: "RÉGLAGES",
    de: "EINSTELLUNGEN",
    pt: "CONFIGURAÇÕES",
    bg: "НАСТРОЙКИ",
  },

  "profile.settingsSubtitle": {
    en: "Language, privacy and account",
    es: "Idioma, privacidad y cuenta",
    uk: "Мова, приватність і акаунт",
    ru: "Язык, конфиденциальность и аккаунт",
    fr: "Langue, confidentialité et compte",
    de: "Sprache, Datenschutz und Konto",
    pt: "Idioma, privacidade e conta",
    bg: "Език, поверителност и профил",
  },

  "profile.coachTools": {
    en: "COACH TOOLS",
    es: "HERRAMIENTAS DEL ENTRENADOR",
    uk: "ІНСТРУМЕНТИ ТРЕНЕРА",
    ru: "ИНСТРУМЕНТЫ ТРЕНЕРА",
    fr: "OUTILS DU COACH",
    de: "COACH-TOOLS",
    pt: "FERRAMENTAS DO TREINADOR",
    bg: "ИНСТРУМЕНТИ ЗА ТРЕНЬОР",
  },

  "profile.coachSystem": {
    en: "COACH SYSTEM",
    es: "SISTEMA DE COACH",
    uk: "СИСТЕМА ТРЕНЕРА",
    ru: "СИСТЕМА ТРЕНЕРА",
    fr: "SYSTÈME COACH",
    de: "COACH-SYSTEM",
    pt: "SISTEMA DO TREINADOR",
    bg: "СИСТЕМА ЗА ТРЕНЬОР",
  },

  "profile.coachSystemSubtitle": {
    en: "Clients, check-ins and feedback",
    es: "Clientes, revisiones y comentarios",
    uk: "Клієнти, перевірки та зворотний зв’язок",
    ru: "Клиенты, проверки и обратная связь",
    fr: "Clients, suivis et retours",
    de: "Kunden, Check-ins und Feedback",
    pt: "Clientes, check-ins e feedback",
    bg: "Клиенти, проверки и обратна връзка",
  },

  "profile.myCoachPrograms": {
    en: "MY COACH PROGRAMS",
    es: "MIS PROGRAMAS DE COACH",
    uk: "МОЇ ТРЕНЕРСЬКІ ПРОГРАМИ",
    ru: "МОИ ТРЕНЕРСКИЕ ПРОГРАММЫ",
    fr: "MES PROGRAMMES COACH",
    de: "MEINE COACH-PROGRAMME",
    pt: "MEUS PROGRAMAS DE TREINADOR",
    bg: "МОИТЕ ТРЕНЬОРСКИ ПРОГРАМИ",
  },

  "profile.myCoachProgramsSubtitle": {
    en: "Programs connected to your profile",
    es: "Programas conectados a tu perfil",
    uk: "Програми, пов’язані з вашим профілем",
    ru: "Программы, связанные с вашим профилем",
    fr: "Programmes liés à votre profil",
    de: "Mit deinem Profil verbundene Programme",
    pt: "Programas ligados ao seu perfil",
    bg: "Програми, свързани с вашия профил",
  },

  "profile.videoReviews": {
    en: "VIDEO REVIEWS",
    es: "REVISIONES DE VIDEO",
    uk: "ВІДЕОПЕРЕВІРКИ",
    ru: "ВИДЕОПРОВЕРКИ",
    fr: "REVUES VIDÉO",
    de: "VIDEO-REVIEWS",
    pt: "REVISÕES DE VÍDEO",
    bg: "ВИДЕО ПРЕГЛЕДИ",
  },

  "profile.videoReviewsSubtitle": {
    en: "Review client exercise technique",
    es: "Revisar la técnica de ejercicio del cliente",
    uk: "Перевірка техніки вправ клієнта",
    ru: "Проверка техники упражнений клиента",
    fr: "Évaluer la technique d’exercice du client",
    de: "Übungstechnik der Kunden prüfen",
    pt: "Revisar a técnica de exercício do cliente",
    bg: "Преглед на техниката на упражненията на клиента",
  },

  "profile.earnings": {
    en: "EARNINGS",
    es: "INGRESOS",
    uk: "ДОХІД",
    ru: "ДОХОД",
    fr: "REVENUS",
    de: "EINNAHMEN",
    pt: "GANHOS",
    bg: "ПРИХОДИ",
  },

  "profile.earningsSubtitle": {
    en: "Revenue, commission and payouts",
    es: "Ingresos, comisión y pagos",
    uk: "Дохід, комісія та виплати",
    ru: "Доход, комиссия и выплаты",
    fr: "Revenus, commission et paiements",
    de: "Umsatz, Provision und Auszahlungen",
    pt: "Receita, comissão e pagamentos",
    bg: "Приходи, комисиони и изплащания",
  },

  "profile.ironageAdmin": {
    en: "IRONAGE ADMIN",
    es: "ADMIN IRONAGE",
    uk: "АДМІН IRONAGE",
    ru: "АДМИН IRONAGE",
    fr: "ADMIN IRONAGE",
    de: "IRONAGE ADMIN",
    pt: "ADMIN IRONAGE",
    bg: "IRONAGE АДМИН",
  },

  "profile.adminPanel": {
    en: "ADMIN PANEL",
    es: "PANEL DE ADMIN",
    uk: "АДМІН-ПАНЕЛЬ",
    ru: "АДМИН-ПАНЕЛЬ",
    fr: "PANNEAU ADMIN",
    de: "ADMIN-PANEL",
    pt: "PAINEL ADMIN",
    bg: "АДМИН ПАНЕЛ",
  },

  "profile.adminPanelSubtitle": {
    en: "IRONAGE Control Center",
    es: "Centro de control IRONAGE",
    uk: "Центр керування IRONAGE",
    ru: "Центр управления IRONAGE",
    fr: "Centre de contrôle IRONAGE",
    de: "IRONAGE Kontrollzentrum",
    pt: "Centro de controle IRONAGE",
    bg: "Контролен център IRONAGE",
  },

  "profile.coachManagement": {
    en: "COACH MANAGEMENT",
    es: "GESTIÓN DE ENTRENADORES",
    uk: "КЕРУВАННЯ ТРЕНЕРАМИ",
    ru: "УПРАВЛЕНИЕ ТРЕНЕРАМИ",
    fr: "GESTION DES COACHS",
    de: "COACH-VERWALTUNG",
    pt: "GESTÃO DE TREINADORES",
    bg: "УПРАВЛЕНИЕ НА ТРЕНЬОРИ",
  },

  "profile.coachManagementSubtitle": {
    en: "Applications, approval and coach status",
    es: "Solicitudes, aprobación y estado del entrenador",
    uk: "Заявки, схвалення та статус тренера",
    ru: "Заявки, одобрение и статус тренера",
    fr: "Candidatures, approbation et statut du coach",
    de: "Bewerbungen, Freigabe und Coach-Status",
    pt: "Candidaturas, aprovação e status do treinador",
    bg: "Кандидатури, одобрение и статус на треньора",
  },

  "profile.programManagement": {
    en: "PROGRAM MANAGEMENT",
    es: "GESTIÓN DE PROGRAMAS",
    uk: "КЕРУВАННЯ ПРОГРАМАМИ",
    ru: "УПРАВЛЕНИЕ ПРОГРАММАМИ",
    fr: "GESTION DES PROGRAMMES",
    de: "PROGRAMMVERWALTUNG",
    pt: "GESTÃO DE PROGRAMAS",
    bg: "УПРАВЛЕНИЕ НА ПРОГРАМИ",
  },

  "profile.programManagementSubtitle": {
    en: "Review, approve and publish programs",
    es: "Revisar, aprobar y publicar programas",
    uk: "Перевірка, схвалення та публікація програм",
    ru: "Проверка, одобрение и публикация программ",
    fr: "Examiner, approuver et publier les programmes",
    de: "Programme prüfen, freigeben und veröffentlichen",
    pt: "Revisar, aprovar e publicar programas",
    bg: "Преглед, одобрение и публикуване на програми",
  },

  "profile.users": {
    en: "USERS",
    es: "USUARIOS",
    uk: "КОРИСТУВАЧІ",
    ru: "ПОЛЬЗОВАТЕЛИ",
    fr: "UTILISATEURS",
    de: "BENUTZER",
    pt: "USUÁRIOS",
    bg: "ПОТРЕБИТЕЛИ",
  },

  "profile.usersSubtitle": {
    en: "Manage IRONAGE users",
    es: "Gestionar usuarios de IRONAGE",
    uk: "Керування користувачами IRONAGE",
    ru: "Управление пользователями IRONAGE",
    fr: "Gérer les utilisateurs IRONAGE",
    de: "IRONAGE-Benutzer verwalten",
    pt: "Gerenciar usuários da IRONAGE",
    bg: "Управление на потребителите на IRONAGE",
  },

  "profile.paymentsSubscriptions": {
    en: "PAYMENTS & SUBSCRIPTIONS",
    es: "PAGOS Y SUSCRIPCIONES",
    uk: "ПЛАТЕЖІ ТА ПІДПИСКИ",
    ru: "ПЛАТЕЖИ И ПОДПИСКИ",
    fr: "PAIEMENTS ET ABONNEMENTS",
    de: "ZAHLUNGEN & ABOS",
    pt: "PAGAMENTOS E ASSINATURAS",
    bg: "ПЛАЩАНИЯ И АБОНАМЕНТИ",
  },

  "profile.paymentsSubscriptionsSubtitle": {
    en: "Revenue, subscriptions and transactions",
    es: "Ingresos, suscripciones y transacciones",
    uk: "Дохід, підписки та транзакції",
    ru: "Доход, подписки и транзакции",
    fr: "Revenus, abonnements et transactions",
    de: "Umsatz, Abonnements und Transaktionen",
    pt: "Receita, assinaturas e transações",
    bg: "Приходи, абонаменти и транзакции",
  },

  "profile.analytics": {
    en: "ANALYTICS",
    es: "ANALÍTICA",
    uk: "АНАЛІТИКА",
    ru: "АНАЛИТИКА",
    fr: "ANALYTIQUE",
    de: "ANALYTIK",
    pt: "ANÁLISES",
    bg: "АНАЛИТИКА",
  },

  "profile.analyticsSubtitle": {
    en: "Users, coaches, growth and revenue",
    es: "Usuarios, entrenadores, crecimiento e ingresos",
    uk: "Користувачі, тренери, зростання та дохід",
    ru: "Пользователи, тренеры, рост и доход",
    fr: "Utilisateurs, coachs, croissance et revenus",
    de: "Benutzer, Coaches, Wachstum und Umsatz",
    pt: "Usuários, treinadores, crescimento e receita",
    bg: "Потребители, треньори, растеж и приходи",
  },

  "profile.support": {
    en: "SUPPORT",
    es: "SOPORTE",
    uk: "ПІДТРИМКА",
    ru: "ПОДДЕРЖКА",
    fr: "ASSISTANCE",
    de: "SUPPORT",
    pt: "SUPORTE",
    bg: "ПОДДРЪЖКА",
  },

  "profile.helpSupport": {
    en: "HELP & SUPPORT",
    es: "AYUDA Y SOPORTE",
    uk: "ДОПОМОГА ТА ПІДТРИМКА",
    ru: "ПОМОЩЬ И ПОДДЕРЖКА",
    fr: "AIDE ET ASSISTANCE",
    de: "HILFE & SUPPORT",
    pt: "AJUDA E SUPORTE",
    bg: "ПОМОЩ И ПОДДРЪЖКА",
  },

  "profile.helpSupportSubtitle": {
    en: "IRONAGE assistance",
    es: "Asistencia de IRONAGE",
    uk: "Допомога IRONAGE",
    ru: "Помощь IRONAGE",
    fr: "Assistance IRONAGE",
    de: "IRONAGE Unterstützung",
    pt: "Assistência IRONAGE",
    bg: "Помощ от IRONAGE",
  },

  "profile.privacyPolicy": {
    en: "PRIVACY POLICY",
    es: "POLÍTICA DE PRIVACIDAD",
    uk: "ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ",
    ru: "ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ",
    fr: "POLITIQUE DE CONFIDENTIALITÉ",
    de: "DATENSCHUTZERKLÄRUNG",
    pt: "POLÍTICA DE PRIVACIDADE",
    bg: "ПОЛИТИКА ЗА ПОВЕРИТЕЛНОСТ",
  },

  "profile.privacyPolicySubtitle": {
    en: "Your privacy and data",
    es: "Tu privacidad y datos",
    uk: "Ваша приватність і дані",
    ru: "Ваша конфиденциальность и данные",
    fr: "Votre confidentialité et vos données",
    de: "Deine Privatsphäre und Daten",
    pt: "Sua privacidade e dados",
    bg: "Вашата поверителност и данни",
  },

  "profile.termsConditions": {
    en: "TERMS & CONDITIONS",
    es: "TÉRMINOS Y CONDICIONES",
    uk: "УМОВИ ВИКОРИСТАННЯ",
    ru: "УСЛОВИЯ ИСПОЛЬЗОВАНИЯ",
    fr: "CONDITIONS GÉNÉRALES",
    de: "NUTZUNGSBEDINGUNGEN",
    pt: "TERMOS E CONDIÇÕES",
    bg: "ОБЩИ УСЛОВИЯ",
  },

  "profile.termsConditionsSubtitle": {
    en: "IRONAGE terms of use",
    es: "Términos de uso de IRONAGE",
    uk: "Умови використання IRONAGE",
    ru: "Условия использования IRONAGE",
    fr: "Conditions d’utilisation d’IRONAGE",
    de: "IRONAGE-Nutzungsbedingungen",
    pt: "Termos de uso da IRONAGE",
    bg: "Условия за ползване на IRONAGE",
  },

  "profile.deleteAccount": {
    en: "DELETE ACCOUNT",
    es: "ELIMINAR CUENTA",
    uk: "ВИДАЛИТИ АКАУНТ",
    ru: "УДАЛИТЬ АККАУНТ",
    fr: "SUPPRIMER LE COMPTE",
    de: "KONTO LÖSCHEN",
    pt: "EXCLUIR CONTA",
    bg: "ИЗТРИЙ ПРОФИЛА",
  },

  "profile.deleteAccountSubtitle": {
    en: "Permanently delete your account",
    es: "Eliminar permanentemente tu cuenta",
    uk: "Назавжди видалити ваш акаунт",
    ru: "Навсегда удалить ваш аккаунт",
    fr: "Supprimer définitivement votre compte",
    de: "Dein Konto dauerhaft löschen",
    pt: "Excluir permanentemente sua conta",
    bg: "Изтрийте профила си завинаги",
  },


  "profile.deleteAccountConfirm": {
    en: "Delete your IRONAGE account permanently? This action cannot be undone.",
    es: "¿Eliminar permanentemente tu cuenta de IRONAGE? Esta acción no se puede deshacer.",
    uk: "Назавжди видалити ваш акаунт IRONAGE? Цю дію неможливо скасувати.",
    ru: "Навсегда удалить ваш аккаунт IRONAGE? Это действие нельзя отменить.",
    fr: "Supprimer définitivement votre compte IRONAGE ? Cette action est irréversible.",
    de: "Dein IRONAGE-Konto dauerhaft löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
    pt: "Excluir permanentemente a sua conta IRONAGE? Esta ação não pode ser desfeita.",
    bg: "Да изтриете ли завинаги своя IRONAGE профил? Това действие не може да бъде отменено.",
  },

  "profile.deleteAccountConfirmAgain": {
    en: "Are you absolutely sure? Your IRONAGE account and associated data will be deleted.",
    es: "¿Estás completamente seguro? Tu cuenta de IRONAGE y los datos asociados serán eliminados.",
    uk: "Ви точно впевнені? Ваш акаунт IRONAGE і пов’язані з ним дані буде видалено.",
    ru: "Вы точно уверены? Ваш аккаунт IRONAGE и связанные с ним данные будут удалены.",
    fr: "Êtes-vous absolument sûr ? Votre compte IRONAGE et les données associées seront supprimés.",
    de: "Bist du dir wirklich sicher? Dein IRONAGE-Konto und die zugehörigen Daten werden gelöscht.",
    pt: "Tem a certeza? A sua conta IRONAGE e os dados associados serão eliminados.",
    bg: "Напълно сигурни ли сте? Вашият IRONAGE профил и свързаните данни ще бъдат изтрити.",
  },

  "profile.deleteAccountFailed": {
    en: "Failed to delete account. Please try again.",
    es: "No se pudo eliminar la cuenta. Inténtalo de nuevo.",
    uk: "Не вдалося видалити акаунт. Спробуйте ще раз.",
    ru: "Не удалось удалить аккаунт. Попробуйте ещё раз.",
    fr: "Impossible de supprimer le compte. Veuillez réessayer.",
    de: "Das Konto konnte nicht gelöscht werden. Bitte versuche es erneut.",
    pt: "Não foi possível excluir a conta. Tente novamente.",
    bg: "Профилът не можа да бъде изтрит. Опитайте отново.",
  },

  "profile.logout": {
    en: "LOG OUT",
    es: "CERRAR SESIÓN",
    uk: "ВИЙТИ",
    ru: "ВЫЙТИ",
    fr: "SE DÉCONNECTER",
    de: "ABMELDEN",
    pt: "SAIR",
    bg: "ИЗХОД",
  },

  "profileFeature.system": {
    en: "IRONAGE SYSTEM",
    es: "SISTEMA IRONAGE",
    uk: "СИСТЕМА IRONAGE",
    ru: "СИСТЕМА IRONAGE",
    fr: "SYSTÈME IRONAGE",
    de: "IRONAGE SYSTEM",
    pt: "SISTEMA IRONAGE",
    bg: "СИСТЕМА IRONAGE",
  },

  "profileFeature.moduleConnecting": {
    en: "This IRONAGE module is being connected to the platform.",
    es: "Este módulo de IRONAGE se está conectando a la plataforma.",
    uk: "Цей модуль IRONAGE зараз підключається до платформи.",
    ru: "Этот модуль IRONAGE сейчас подключается к платформе.",
    fr: "Ce module IRONAGE est en cours de connexion à la plateforme.",
    de: "Dieses IRONAGE-Modul wird gerade mit der Plattform verbunden.",
    pt: "Este módulo IRONAGE está sendo conectado à plataforma.",
    bg: "Този модул на IRONAGE в момента се свързва с платформата.",
  },

  "profileFeature.status": {
    en: "STATUS",
    es: "ESTADO",
    uk: "СТАТУС",
    ru: "СТАТУС",
    fr: "STATUT",
    de: "STATUS",
    pt: "STATUS",
    bg: "СТАТУС",
  },

  "profileFeature.inDevelopment": {
    en: "IN DEVELOPMENT",
    es: "EN DESARROLLO",
    uk: "У РОЗРОБЦІ",
    ru: "В РАЗРАБОТКЕ",
    fr: "EN DÉVELOPPEMENT",
    de: "IN ENTWICKLUNG",
    pt: "EM DESENVOLVIMENTO",
    bg: "В РАЗРАБОТКА",
  },

  "profileFeature.backToProfile": {
    en: "BACK TO PROFILE",
    es: "VOLVER AL PERFIL",
    uk: "НАЗАД ДО ПРОФІЛЮ",
    ru: "НАЗАД В ПРОФИЛЬ",
    fr: "RETOUR AU PROFIL",
    de: "ZURÜCK ZUM PROFIL",
    pt: "VOLTAR AO PERFIL",
    bg: "НАЗАД КЪМ ПРОФИЛА",
  },

  /* =====================================================
     MY PROGRAM
  ===================================================== */

  "myProgram.training": {
    en: "IRONAGE TRAINING",
    es: "ENTRENAMIENTO IRONAGE",
    uk: "ТРЕНУВАННЯ IRONAGE",
    ru: "ТРЕНИРОВКА IRONAGE",
    fr: "ENTRAÎNEMENT IRONAGE",
    de: "IRONAGE TRAINING",
    pt: "TREINO IRONAGE",
    bg: "ТРЕНИРОВКА IRONAGE",
  },

  "myProgram.myPrograms": {
    en: "MY PROGRAMS",
    es: "MIS PROGRAMAS",
    uk: "МОЇ ПРОГРАМИ",
    ru: "МОИ ПРОГРАММЫ",
    fr: "MES PROGRAMMES",
    de: "MEINE PROGRAMME",
    pt: "MEUS PROGRAMAS",
    bg: "МОИТЕ ПРОГРАМИ",
  },

  "myProgram.myProgram": {
    en: "MY PROGRAM",
    es: "MI PROGRAMA",
    uk: "МОЯ ПРОГРАМА",
    ru: "МОЯ ПРОГРАММА",
    fr: "MON PROGRAMME",
    de: "MEIN PROGRAMM",
    pt: "MEU PROGRAMA",
    bg: "МОЯТА ПРОГРАМА",
  },

  "myProgram.librarySubtitle": {
    en: "YOUR PROGRAMS. YOUR TRAINING.",
    es: "TUS PROGRAMAS. TU ENTRENAMIENTO.",
    uk: "ТВОЇ ПРОГРАМИ. ТВОЇ ТРЕНУВАННЯ.",
    ru: "ТВОИ ПРОГРАММЫ. ТВОИ ТРЕНИРОВКИ.",
    fr: "TES PROGRAMMES. TON ENTRAÎNEMENT.",
    de: "DEINE PROGRAMME. DEIN TRAINING.",
    pt: "SEUS PROGRAMAS. SEU TREINO.",
    bg: "ТВОИТЕ ПРОГРАМИ. ТВОИТЕ ТРЕНИРОВКИ.",
  },

  "myProgram.programSubtitle": {
    en: "YOUR PLAN. YOUR WORK.",
    es: "TU PLAN. TU TRABAJO.",
    uk: "ТВІЙ ПЛАН. ТВОЯ РОБОТА.",
    ru: "ТВОЙ ПЛАН. ТВОЯ РАБОТА.",
    fr: "TON PLAN. TON TRAVAIL.",
    de: "DEIN PLAN. DEINE ARBEIT.",
    pt: "SEU PLANO. SEU TRABALHO.",
    bg: "ТВОЯТ ПЛАН. ТВОЯТА РАБОТА.",
  },

  "myProgram.loading": {
    en: "LOADING PROGRAM...",
    es: "CARGANDO PROGRAMA...",
    uk: "ЗАВАНТАЖЕННЯ ПРОГРАМИ...",
    ru: "ЗАГРУЗКА ПРОГРАММЫ...",
    fr: "CHARGEMENT DU PROGRAMME...",
    de: "PROGRAMM WIRD GELADEN...",
    pt: "CARREGANDO PROGRAMA...",
    bg: "ЗАРЕЖДАНЕ НА ПРОГРАМАТА...",
  },

  "myProgram.loadError": {
    en: "PROGRAM LOAD ERROR",
    es: "ERROR AL CARGAR EL PROGRAMA",
    uk: "ПОМИЛКА ЗАВАНТАЖЕННЯ ПРОГРАМИ",
    ru: "ОШИБКА ЗАГРУЗКИ ПРОГРАММЫ",
    fr: "ERREUR DE CHARGEMENT DU PROGRAMME",
    de: "FEHLER BEIM LADEN DES PROGRAMMS",
    pt: "ERRO AO CARREGAR O PROGRAMA",
    bg: "ГРЕШКА ПРИ ЗАРЕЖДАНЕ НА ПРОГРАМАТА",
  },

  "myProgram.failedToLoad": {
    en: "Failed to load program",
    es: "No se pudo cargar el programa",
    uk: "Не вдалося завантажити програму",
    ru: "Не удалось загрузить программу",
    fr: "Impossible de charger le programme",
    de: "Programm konnte nicht geladen werden",
    pt: "Não foi possível carregar o programa",
    bg: "Програмата не можа да бъде заредена",
  },

  "myProgram.noProgramsYet": {
    en: "NO PROGRAMS YET",
    es: "AÚN NO HAY PROGRAMAS",
    uk: "ПРОГРАМ ЩЕ НЕМАЄ",
    ru: "ПРОГРАММ ПОКА НЕТ",
    fr: "AUCUN PROGRAMME POUR LE MOMENT",
    de: "NOCH KEINE PROGRAMME",
    pt: "AINDA NÃO HÁ PROGRAMAS",
    bg: "ВСЕ ОЩЕ НЯМА ПРОГРАМИ",
  },

  "myProgram.libraryEmpty": {
    en: "YOUR TRAINING LIBRARY IS EMPTY.",
    es: "TU BIBLIOTECA DE ENTRENAMIENTO ESTÁ VACÍA.",
    uk: "ТВОЯ БІБЛІОТЕКА ТРЕНУВАНЬ ПОРОЖНЯ.",
    ru: "ТВОЯ БИБЛИОТЕКА ТРЕНИРОВОК ПУСТА.",
    fr: "TA BIBLIOTHÈQUE D’ENTRAÎNEMENT EST VIDE.",
    de: "DEINE TRAININGSBIBLIOTHEK IST LEER.",
    pt: "SUA BIBLIOTECA DE TREINOS ESTÁ VAZIA.",
    bg: "ТВОЯТА БИБЛИОТЕКА С ТРЕНИРОВКИ Е ПРАЗНА.",
  },

  "myProgram.libraryHint": {
    en: "Programs you receive from a coach, claim for free or purchase will appear here.",
    es: "Los programas que recibas de un entrenador, obtengas gratis o compres aparecerán aquí.",
    uk: "Програми від тренера, безкоштовно отримані або придбані програми з’являться тут.",
    ru: "Программы от тренера, полученные бесплатно или купленные, появятся здесь.",
    fr: "Les programmes reçus d’un coach, obtenus gratuitement ou achetés apparaîtront ici.",
    de: "Programme vom Coach, kostenlos beanspruchte oder gekaufte Programme erscheinen hier.",
    pt: "Programas recebidos de um treinador, obtidos gratuitamente ou comprados aparecerão aqui.",
    bg: "Програмите от треньор, получени безплатно или закупени, ще се появят тук.",
  },

  "myProgram.sourceCoach": {
    en: "COACH",
    es: "ENTRENADOR",
    uk: "ТРЕНЕР",
    ru: "ТРЕНЕР",
    fr: "COACH",
    de: "COACH",
    pt: "TREINADOR",
    bg: "ТРЕНЬОР",
  },

  "myProgram.sourceFree": {
    en: "FREE",
    es: "GRATIS",
    uk: "БЕЗКОШТОВНО",
    ru: "БЕСПЛАТНО",
    fr: "GRATUIT",
    de: "KOSTENLOS",
    pt: "GRÁTIS",
    bg: "БЕЗПЛАТНО",
  },

  "myProgram.sourcePurchase": {
    en: "PURCHASE",
    es: "COMPRA",
    uk: "ПОКУПКА",
    ru: "ПОКУПКА",
    fr: "ACHAT",
    de: "KAUF",
    pt: "COMPRA",
    bg: "ПОКУПКА",
  },

  "myProgram.sourceSubscription": {
    en: "SUBSCRIPTION",
    es: "SUSCRIPCIÓN",
    uk: "ПІДПИСКА",
    ru: "ПОДПИСКА",
    fr: "ABONNEMENT",
    de: "ABONNEMENT",
    pt: "ASSINATURA",
    bg: "АБОНАМЕНТ",
  },

  "myProgram.sourceAdmin": {
    en: "ADMIN",
    es: "ADMIN",
    uk: "АДМІН",
    ru: "АДМИН",
    fr: "ADMIN",
    de: "ADMIN",
    pt: "ADMIN",
    bg: "АДМИН",
  },

  "myProgram.open": {
    en: "OPEN",
    es: "ABRIR",
    uk: "ВІДКРИТИ",
    ru: "ОТКРЫТЬ",
    fr: "OUVRIR",
    de: "ÖFFNEN",
    pt: "ABRIR",
    bg: "ОТВОРИ",
  },

  "myProgram.weeks": {
    en: "WEEKS",
    es: "SEMANAS",
    uk: "ТИЖНІ",
    ru: "НЕДЕЛИ",
    fr: "SEMAINES",
    de: "WOCHEN",
    pt: "SEMANAS",
    bg: "СЕДМИЦИ",
  },

  "myProgram.workouts": {
    en: "WORKOUTS",
    es: "ENTRENAMIENTOS",
    uk: "ТРЕНУВАННЯ",
    ru: "ТРЕНИРОВКИ",
    fr: "ENTRAÎNEMENTS",
    de: "TRAININGS",
    pt: "TREINOS",
    bg: "ТРЕНИРОВКИ",
  },

  "myProgram.selfService": {
    en: "SELF-SERVICE",
    es: "AUTOSERVICIO",
    uk: "САМОСТІЙНО",
    ru: "САМОСТОЯТЕЛЬНО",
    fr: "EN AUTONOMIE",
    de: "SELBSTSTÄNDIG",
    pt: "AUTOSSERVIÇO",
    bg: "САМОСТОЯТЕЛНО",
  },

  "myProgram.notAvailable": {
    en: "PROGRAM NOT AVAILABLE",
    es: "PROGRAMA NO DISPONIBLE",
    uk: "ПРОГРАМА НЕДОСТУПНА",
    ru: "ПРОГРАММА НЕДОСТУПНА",
    fr: "PROGRAMME INDISPONIBLE",
    de: "PROGRAMM NICHT VERFÜGBAR",
    pt: "PROGRAMA INDISPONÍVEL",
    bg: "ПРОГРАМАТА НЕ Е ДОСТЪПНА",
  },

  "myProgram.notActive": {
    en: "THIS PROGRAM IS NOT ACTIVE IN YOUR ACCOUNT.",
    es: "ESTE PROGRAMA NO ESTÁ ACTIVO EN TU CUENTA.",
    uk: "ЦЯ ПРОГРАМА НЕ АКТИВНА У ТВОЄМУ АКАУНТІ.",
    ru: "ЭТА ПРОГРАММА НЕ АКТИВНА В ТВОЁМ АККАУНТЕ.",
    fr: "CE PROGRAMME N’EST PAS ACTIF SUR TON COMPTE.",
    de: "DIESES PROGRAMM IST IN DEINEM KONTO NICHT AKTIV.",
    pt: "ESTE PROGRAMA NÃO ESTÁ ATIVO NA SUA CONTA.",
    bg: "ТАЗИ ПРОГРАМА НЕ Е АКТИВНА В ПРОФИЛА ТИ.",
  },

  "myProgram.yourCoach": {
    en: "YOUR COACH",
    es: "TU ENTRENADOR",
    uk: "ТВІЙ ТРЕНЕР",
    ru: "ТВОЙ ТРЕНЕР",
    fr: "TON COACH",
    de: "DEIN COACH",
    pt: "SEU TREINADOR",
    bg: "ТВОЯТ ТРЕНЬОР",
  },

  "myProgram.programAccess": {
    en: "PROGRAM ACCESS",
    es: "ACCESO AL PROGRAMA",
    uk: "ДОСТУП ДО ПРОГРАМИ",
    ru: "ДОСТУП К ПРОГРАММЕ",
    fr: "ACCÈS AU PROGRAMME",
    de: "PROGRAMMZUGRIFF",
    pt: "ACESSO AO PROGRAMA",
    bg: "ДОСТЪП ДО ПРОГРАМАТА",
  },

  "myProgram.ironageCoach": {
    en: "IRONAGE COACH",
    es: "ENTRENADOR IRONAGE",
    uk: "ТРЕНЕР IRONAGE",
    ru: "ТРЕНЕР IRONAGE",
    fr: "COACH IRONAGE",
    de: "IRONAGE COACH",
    pt: "TREINADOR IRONAGE",
    bg: "ТРЕНЬОР IRONAGE",
  },

  "myProgram.ironageProgram": {
    en: "IRONAGE PROGRAM",
    es: "PROGRAMA IRONAGE",
    uk: "ПРОГРАМА IRONAGE",
    ru: "ПРОГРАММА IRONAGE",
    fr: "PROGRAMME IRONAGE",
    de: "IRONAGE PROGRAMM",
    pt: "PROGRAMA IRONAGE",
    bg: "ПРОГРАМА IRONAGE",
  },

  "myProgram.personalCoaching": {
    en: "PERSONAL COACHING",
    es: "COACHING PERSONAL",
    uk: "ПЕРСОНАЛЬНИЙ СУПРОВІД",
    ru: "ПЕРСОНАЛЬНОЕ СОПРОВОЖДЕНИЕ",
    fr: "COACHING PERSONNEL",
    de: "PERSÖNLICHES COACHING",
    pt: "COACHING PESSOAL",
    bg: "ПЕРСОНАЛЕН КОУЧИНГ",
  },

  "myProgram.selfServiceProgram": {
    en: "SELF-SERVICE TRAINING PROGRAM",
    es: "PROGRAMA DE ENTRENAMIENTO AUTÓNOMO",
    uk: "ПРОГРАМА ДЛЯ САМОСТІЙНИХ ТРЕНУВАНЬ",
    ru: "ПРОГРАММА ДЛЯ САМОСТОЯТЕЛЬНЫХ ТРЕНИРОВОК",
    fr: "PROGRAMME D’ENTRAÎNEMENT AUTONOME",
    de: "SELBSTSTÄNDIGES TRAININGSPROGRAMM",
    pt: "PROGRAMA DE TREINO AUTÔNOMO",
    bg: "ПРОГРАМА ЗА САМОСТОЯТЕЛНИ ТРЕНИРОВКИ",
  },

  "myProgram.activeProgram": {
    en: "ACTIVE PROGRAM",
    es: "PROGRAMA ACTIVO",
    uk: "АКТИВНА ПРОГРАМА",
    ru: "АКТИВНАЯ ПРОГРАММА",
    fr: "PROGRAMME ACTIF",
    de: "AKTIVES PROGRAMM",
    pt: "PROGRAMA ATIVO",
    bg: "АКТИВНА ПРОГРАМА",
  },

  "myProgram.trainingSchedule": {
    en: "TRAINING SCHEDULE",
    es: "PLAN DE ENTRENAMIENTO",
    uk: "РОЗКЛАД ТРЕНУВАНЬ",
    ru: "РАСПИСАНИЕ ТРЕНИРОВОК",
    fr: "PLANNING D’ENTRAÎNEMENT",
    de: "TRAININGSPLAN",
    pt: "CRONOGRAMA DE TREINO",
    bg: "ТРЕНИРОВЪЧЕН ГРАФИК",
  },

  "myProgram.week": {
    en: "WEEK",
    es: "SEMANA",
    uk: "ТИЖДЕНЬ",
    ru: "НЕДЕЛЯ",
    fr: "SEMAINE",
    de: "WOCHE",
    pt: "SEMANA",
    bg: "СЕДМИЦА",
  },

  "myProgram.day": {
    en: "DAY",
    es: "DÍA",
    uk: "ДЕНЬ",
    ru: "ДЕНЬ",
    fr: "JOUR",
    de: "TAG",
    pt: "DIA",
    bg: "ДЕН",
  },

  "myProgram.exercises": {
    en: "EXERCISES",
    es: "EJERCICIOS",
    uk: "ВПРАВИ",
    ru: "УПРАЖНЕНИЯ",
    fr: "EXERCICES",
    de: "ÜBUNGEN",
    pt: "EXERCÍCIOS",
    bg: "УПРАЖНЕНИЯ",
  },

  "myProgram.sets": {
    en: "SETS",
    es: "SERIES",
    uk: "ПІДХОДИ",
    ru: "ПОДХОДЫ",
    fr: "SÉRIES",
    de: "SÄTZE",
    pt: "SÉRIES",
    bg: "СЕРИИ",
  },

  "myProgram.reps": {
    en: "REPS",
    es: "REPETICIONES",
    uk: "ПОВТОРИ",
    ru: "ПОВТОРЫ",
    fr: "RÉPÉTITIONS",
    de: "WIEDERHOLUNGEN",
    pt: "REPETIÇÕES",
    bg: "ПОВТОРЕНИЯ",
  },

  "myProgram.min": {
    en: "MIN",
    es: "MIN",
    uk: "ХВ",
    ru: "МИН",
    fr: "MIN",
    de: "MIN",
    pt: "MIN",
    bg: "МИН",
  },

  "myProgram.sec": {
    en: "SEC",
    es: "SEG",
    uk: "СЕК",
    ru: "СЕК",
    fr: "SEC",
    de: "SEK",
    pt: "SEG",
    bg: "СЕК",
  },

  "myProgram.asPrescribed": {
    en: "AS PRESCRIBED",
    es: "SEGÚN INDICACIÓN",
    uk: "ЗА ПРИЗНАЧЕННЯМ",
    ru: "ПО НАЗНАЧЕНИЮ",
    fr: "SELON PRESCRIPTION",
    de: "WIE VORGEGEBEN",
    pt: "CONFORME PRESCRITO",
    bg: "СПОРЕД УКАЗАНИЯТА",
  },

  "myProgram.startWorkout": {
    en: "START WORKOUT",
    es: "INICIAR ENTRENAMIENTO",
    uk: "ПОЧАТИ ТРЕНУВАННЯ",
    ru: "НАЧАТЬ ТРЕНИРОВКУ",
    fr: "COMMENCER L’ENTRAÎNEMENT",
    de: "TRAINING STARTEN",
    pt: "INICIAR TREINO",
    bg: "ЗАПОЧНИ ТРЕНИРОВКА",
  },

  /* =====================================================
     FIND COACH
  ===================================================== */

  "findCoach.ironageCoaches": {
    en: "IRONAGE COACHES",
    es: "ENTRENADORES IRONAGE",
    uk: "ТРЕНЕРИ IRONAGE",
    ru: "ТРЕНЕРЫ IRONAGE",
    fr: "COACHS IRONAGE",
    de: "IRONAGE COACHES",
    pt: "TREINADORES IRONAGE",
    bg: "ТРЕНЬОРИ IRONAGE",
  },

  "findCoach.title": {
    en: "FIND A COACH",
    es: "BUSCAR ENTRENADOR",
    uk: "ЗНАЙТИ ТРЕНЕРА",
    ru: "НАЙТИ ТРЕНЕРА",
    fr: "TROUVER UN COACH",
    de: "COACH FINDEN",
    pt: "ENCONTRAR TREINADOR",
    bg: "НАМЕРИ ТРЕНЬОР",
  },

  "findCoach.coaches": {
    en: "COACHES",
    es: "ENTRENADORES",
    uk: "ТРЕНЕРІВ",
    ru: "ТРЕНЕРОВ",
    fr: "COACHS",
    de: "COACHES",
    pt: "TREINADORES",
    bg: "ТРЕНЬОРИ",
  },

  "findCoach.searchPlaceholder": {
    en: "Search coach or specialization",
    es: "Buscar entrenador o especialización",
    uk: "Пошук тренера або спеціалізації",
    ru: "Поиск тренера или специализации",
    fr: "Rechercher un coach ou une spécialisation",
    de: "Coach oder Spezialisierung suchen",
    pt: "Buscar treinador ou especialização",
    bg: "Търси треньор или специализация",
  },

  "findCoach.loading": {
    en: "LOADING COACHES...",
    es: "CARGANDO ENTRENADORES...",
    uk: "ЗАВАНТАЖЕННЯ ТРЕНЕРІВ...",
    ru: "ЗАГРУЗКА ТРЕНЕРОВ...",
    fr: "CHARGEMENT DES COACHS...",
    de: "COACHES WERDEN GELADEN...",
    pt: "CARREGANDO TREINADORES...",
    bg: "ЗАРЕЖДАНЕ НА ТРЕНЬОРИ...",
  },

  "findCoach.connectionError": {
    en: "CONNECTION ERROR",
    es: "ERROR DE CONEXIÓN",
    uk: "ПОМИЛКА З’ЄДНАННЯ",
    ru: "ОШИБКА СОЕДИНЕНИЯ",
    fr: "ERREUR DE CONNEXION",
    de: "VERBINDUNGSFEHLER",
    pt: "ERRO DE CONEXÃO",
    bg: "ГРЕШКА ПРИ СВЪРЗВАНЕ",
  },

  "findCoach.noCoaches": {
    en: "NO COACHES FOUND",
    es: "NO SE ENCONTRARON ENTRENADORES",
    uk: "ТРЕНЕРІВ НЕ ЗНАЙДЕНО",
    ru: "ТРЕНЕРЫ НЕ НАЙДЕНЫ",
    fr: "AUCUN COACH TROUVÉ",
    de: "KEINE COACHES GEFUNDEN",
    pt: "NENHUM TREINADOR ENCONTRADO",
    bg: "НЕ СА НАМЕРЕНИ ТРЕНЬОРИ",
  },

  "findCoach.tryAnother": {
    en: "Try another search.",
    es: "Prueba otra búsqueda.",
    uk: "Спробуйте інший пошук.",
    ru: "Попробуйте другой поиск.",
    fr: "Essayez une autre recherche.",
    de: "Versuche eine andere Suche.",
    pt: "Tente outra busca.",
    bg: "Опитайте друго търсене.",
  },

  "findCoach.defaultCoach": {
    en: "IRONAGE COACH",
    es: "ENTRENADOR IRONAGE",
    uk: "ТРЕНЕР IRONAGE",
    ru: "ТРЕНЕР IRONAGE",
    fr: "COACH IRONAGE",
    de: "IRONAGE COACH",
    pt: "TREINADOR IRONAGE",
    bg: "ТРЕНЬОР IRONAGE",
  },

  "findCoach.clients": {
    en: "CLIENTS",
    es: "CLIENTES",
    uk: "КЛІЄНТИ",
    ru: "КЛИЕНТЫ",
    fr: "CLIENTS",
    de: "KUNDEN",
    pt: "CLIENTES",
    bg: "КЛИЕНТИ",
  },

  "findCoach.programs": {
    en: "PROGRAMS",
    es: "PROGRAMAS",
    uk: "ПРОГРАМИ",
    ru: "ПРОГРАММЫ",
    fr: "PROGRAMMES",
    de: "PROGRAMME",
    pt: "PROGRAMAS",
    bg: "ПРОГРАМИ",
  },

  "findCoach.workouts": {
    en: "WORKOUTS",
    es: "ENTRENAMIENTOS",
    uk: "ТРЕНУВАННЯ",
    ru: "ТРЕНИРОВКИ",
    fr: "ENTRAÎNEMENTS",
    de: "TRAININGS",
    pt: "TREINOS",
    bg: "ТРЕНИРОВКИ",
  },

  "findCoach.invalidResponse": {
    en: "Invalid marketplace response",
    es: "Respuesta del marketplace no válida",
    uk: "Некоректна відповідь маркетплейсу",
    ru: "Некорректный ответ маркетплейса",
    fr: "Réponse marketplace invalide",
    de: "Ungültige Marketplace-Antwort",
    pt: "Resposta inválida do marketplace",
    bg: "Невалиден отговор от маркетплейса",
  },

  "findCoach.failedToLoad": {
    en: "Failed to load coaches",
    es: "No se pudieron cargar los entrenadores",
    uk: "Не вдалося завантажити тренерів",
    ru: "Не удалось загрузить тренеров",
    fr: "Impossible de charger les coachs",
    de: "Coaches konnten nicht geladen werden",
    pt: "Não foi possível carregar os treinadores",
    bg: "Треньорите не можаха да бъдат заредени",
  },

  /* =====================================================
     COACH PROFILE
  ===================================================== */

  "coachProfile.loading": {
    en: "LOADING COACH...",
    es: "CARGANDO ENTRENADOR...",
    uk: "ЗАВАНТАЖЕННЯ ТРЕНЕРА...",
    ru: "ЗАГРУЗКА ТРЕНЕРА...",
    fr: "CHARGEMENT DU COACH...",
    de: "COACH WIRD GELADEN...",
    pt: "CARREGANDO TREINADOR...",
    bg: "ЗАРЕЖДАНЕ НА ТРЕНЬОРА...",
  },

  "coachProfile.notAvailable": {
    en: "COACH NOT AVAILABLE",
    es: "ENTRENADOR NO DISPONIBLE",
    uk: "ТРЕНЕР НЕДОСТУПНИЙ",
    ru: "ТРЕНЕР НЕДОСТУПЕН",
    fr: "COACH INDISPONIBLE",
    de: "COACH NICHT VERFÜGBAR",
    pt: "TREINADOR INDISPONÍVEL",
    bg: "ТРЕНЬОРЪТ НЕ Е ДОСТЪПЕН",
  },

  "coachProfile.notFound": {
    en: "Coach not found",
    es: "Entrenador no encontrado",
    uk: "Тренера не знайдено",
    ru: "Тренер не найден",
    fr: "Coach introuvable",
    de: "Coach nicht gefunden",
    pt: "Treinador não encontrado",
    bg: "Треньорът не е намерен",
  },

  "coachProfile.ironageCoach": {
    en: "IRONAGE COACH",
    es: "ENTRENADOR IRONAGE",
    uk: "ТРЕНЕР IRONAGE",
    ru: "ТРЕНЕР IRONAGE",
    fr: "COACH IRONAGE",
    de: "IRONAGE COACH",
    pt: "TREINADOR IRONAGE",
    bg: "ТРЕНЬОР IRONAGE",
  },

  "coachProfile.clients": {
    en: "CLIENTS",
    es: "CLIENTES",
    uk: "КЛІЄНТИ",
    ru: "КЛИЕНТЫ",
    fr: "CLIENTS",
    de: "KUNDEN",
    pt: "CLIENTES",
    bg: "КЛИЕНТИ",
  },

  "coachProfile.programs": {
    en: "PROGRAMS",
    es: "PROGRAMAS",
    uk: "ПРОГРАМИ",
    ru: "ПРОГРАММЫ",
    fr: "PROGRAMMES",
    de: "PROGRAMME",
    pt: "PROGRAMAS",
    bg: "ПРОГРАМИ",
  },

  "coachProfile.workouts": {
    en: "WORKOUTS",
    es: "ENTRENAMIENTOS",
    uk: "ТРЕНУВАННЯ",
    ru: "ТРЕНИРОВКИ",
    fr: "ENTRAÎNEMENTS",
    de: "TRAININGS",
    pt: "TREINOS",
    bg: "ТРЕНИРОВКИ",
  },

  "coachProfile.about": {
    en: "ABOUT COACH",
    es: "SOBRE EL ENTRENADOR",
    uk: "ПРО ТРЕНЕРА",
    ru: "О ТРЕНЕРЕ",
    fr: "À PROPOS DU COACH",
    de: "ÜBER DEN COACH",
    pt: "SOBRE O TREINADOR",
    bg: "ЗА ТРЕНЬОРА",
  },

  "coachProfile.defaultBio": {
    en: "Professional IRONAGE coach ready to build your training plan.",
    es: "Entrenador profesional de IRONAGE listo para crear tu plan de entrenamiento.",
    uk: "Професійний тренер IRONAGE, готовий створити твій тренувальний план.",
    ru: "Профессиональный тренер IRONAGE, готовый создать твой тренировочный план.",
    fr: "Coach professionnel IRONAGE prêt à créer ton plan d’entraînement.",
    de: "Professioneller IRONAGE-Coach, bereit deinen Trainingsplan zu erstellen.",
    pt: "Treinador profissional IRONAGE pronto para criar seu plano de treino.",
    bg: "Професионален треньор на IRONAGE, готов да създаде тренировъчния ти план.",
  },

  "coachProfile.username": {
    en: "USERNAME",
    es: "USUARIO",
    uk: "ІМ’Я КОРИСТУВАЧА",
    ru: "ИМЯ ПОЛЬЗОВАТЕЛЯ",
    fr: "NOM D’UTILISATEUR",
    de: "BENUTZERNAME",
    pt: "NOME DE USUÁRIO",
    bg: "ПОТРЕБИТЕЛСКО ИМЕ",
  },

  "coachProfile.connecting": {
    en: "CONNECTING...",
    es: "CONECTANDO...",
    uk: "ПІДКЛЮЧЕННЯ...",
    ru: "ПОДКЛЮЧЕНИЕ...",
    fr: "CONNEXION...",
    de: "VERBINDUNG...",
    pt: "CONECTANDO...",
    bg: "СВЪРЗВАНЕ...",
  },

  "coachProfile.choose": {
    en: "CHOOSE THIS COACH",
    es: "ELEGIR ESTE ENTRENADOR",
    uk: "ОБРАТИ ЦЬОГО ТРЕНЕРА",
    ru: "ВЫБРАТЬ ЭТОГО ТРЕНЕРА",
    fr: "CHOISIR CE COACH",
    de: "DIESEN COACH WÄHLEN",
    pt: "ESCOLHER ESTE TREINADOR",
    bg: "ИЗБЕРИ ТОЗИ ТРЕНЬОР",
  },

  "coachProfile.selected": {
    en: "COACH SELECTED",
    es: "ENTRENADOR SELECCIONADO",
    uk: "ТРЕНЕРА ОБРАНО",
    ru: "ТРЕНЕР ВЫБРАН",
    fr: "COACH SÉLECTIONNÉ",
    de: "COACH AUSGEWÄHLT",
    pt: "TREINADOR SELECIONADO",
    bg: "ТРЕНЬОРЪТ Е ИЗБРАН",
  },

  "coachProfile.nowYourCoach": {
    en: "is now your coach.",
    es: "ahora es tu entrenador.",
    uk: "тепер твій тренер.",
    ru: "теперь твой тренер.",
    fr: "est maintenant ton coach.",
    de: "ist jetzt dein Coach.",
    pt: "agora é seu treinador.",
    bg: "вече е твоят треньор.",
  },

  "coachProfile.continue": {
    en: "CONTINUE",
    es: "CONTINUAR",
    uk: "ПРОДОВЖИТИ",
    ru: "ПРОДОЛЖИТЬ",
    fr: "CONTINUER",
    de: "WEITER",
    pt: "CONTINUAR",
    bg: "ПРОДЪЛЖИ",
  },

  "coachProfile.invalidResponse": {
    en: "Invalid coach profile response",
    es: "Respuesta de perfil de entrenador no válida",
    uk: "Некоректна відповідь профілю тренера",
    ru: "Некорректный ответ профиля тренера",
    fr: "Réponse de profil coach invalide",
    de: "Ungültige Coach-Profil-Antwort",
    pt: "Resposta inválida do perfil do treinador",
    bg: "Невалиден отговор за профила на треньора",
  },

  "coachProfile.failedToLoad": {
    en: "Failed to load coach",
    es: "No se pudo cargar el entrenador",
    uk: "Не вдалося завантажити тренера",
    ru: "Не удалось загрузить тренера",
    fr: "Impossible de charger le coach",
    de: "Coach konnte nicht geladen werden",
    pt: "Não foi possível carregar o treinador",
    bg: "Треньорът не можа да бъде зареден",
  },

  "coachProfile.connectionFailed": {
    en: "Coach connection failed",
    es: "No se pudo conectar con el entrenador",
    uk: "Не вдалося підключити тренера",
    ru: "Не удалось подключить тренера",
    fr: "Échec de la connexion avec le coach",
    de: "Coach-Verbindung fehlgeschlagen",
    pt: "Falha ao conectar treinador",
    bg: "Свързването с треньора беше неуспешно",
  },

  "coachProfile.failedToChoose": {
    en: "Failed to choose coach",
    es: "No se pudo elegir al entrenador",
    uk: "Не вдалося обрати тренера",
    ru: "Не удалось выбрать тренера",
    fr: "Impossible de choisir le coach",
    de: "Coach konnte nicht ausgewählt werden",
    pt: "Não foi possível escolher o treinador",
    bg: "Треньорът не можа да бъде избран",
  },

  /* =====================================================
     MY COACH
  ===================================================== */

  "myCoach.coaching": {
    en: "IRONAGE COACHING",
    es: "COACHING IRONAGE",
    uk: "ТРЕНЕРСЬКИЙ СУПРОВІД IRONAGE",
    ru: "ТРЕНЕРСКОЕ СОПРОВОЖДЕНИЕ IRONAGE",
    fr: "COACHING IRONAGE",
    de: "IRONAGE COACHING",
    pt: "COACHING IRONAGE",
    bg: "ТРЕНЬОРСКО СЪПРОВОЖДАНЕ IRONAGE",
  },

  "myCoach.title": {
    en: "MY COACH",
    es: "MI ENTRENADOR",
    uk: "МІЙ ТРЕНЕР",
    ru: "МОЙ ТРЕНЕР",
    fr: "MON COACH",
    de: "MEIN COACH",
    pt: "MEU TREINADOR",
    bg: "МОЯТ ТРЕНЬОР",
  },

  "myCoach.subtitle": {
    en: "YOUR COACH · YOUR PLAN · YOUR RESULTS",
    es: "TU ENTRENADOR · TU PLAN · TUS RESULTADOS",
    uk: "ТВІЙ ТРЕНЕР · ТВІЙ ПЛАН · ТВОЇ РЕЗУЛЬТАТИ",
    ru: "ТВОЙ ТРЕНЕР · ТВОЙ ПЛАН · ТВОИ РЕЗУЛЬТАТЫ",
    fr: "TON COACH · TON PLAN · TES RÉSULTATS",
    de: "DEIN COACH · DEIN PLAN · DEINE ERGEBNISSE",
    pt: "SEU TREINADOR · SEU PLANO · SEUS RESULTADOS",
    bg: "ТВОЯТ ТРЕНЬОР · ТВОЯТ ПЛАН · ТВОИТЕ РЕЗУЛТАТИ",
  },

  "myCoach.loading": {
    en: "LOADING COACH...",
    es: "CARGANDO ENTRENADOR...",
    uk: "ЗАВАНТАЖЕННЯ ТРЕНЕРА...",
    ru: "ЗАГРУЗКА ТРЕНЕРА...",
    fr: "CHARGEMENT DU COACH...",
    de: "COACH WIRD GELADEN...",
    pt: "CARREGANDO TREINADOR...",
    bg: "ЗАРЕЖДАНЕ НА ТРЕНЬОРА...",
  },

  "myCoach.loadError": {
    en: "COACH LOAD ERROR",
    es: "ERROR AL CARGAR EL ENTRENADOR",
    uk: "ПОМИЛКА ЗАВАНТАЖЕННЯ ТРЕНЕРА",
    ru: "ОШИБКА ЗАГРУЗКИ ТРЕНЕРА",
    fr: "ERREUR DE CHARGEMENT DU COACH",
    de: "FEHLER BEIM LADEN DES COACHS",
    pt: "ERRO AO CARREGAR O TREINADOR",
    bg: "ГРЕШКА ПРИ ЗАРЕЖДАНЕ НА ТРЕНЬОРА",
  },

  "myCoach.failedToLoad": {
    en: "Failed to load coach",
    es: "No se pudo cargar el entrenador",
    uk: "Не вдалося завантажити тренера",
    ru: "Не удалось загрузить тренера",
    fr: "Impossible de charger le coach",
    de: "Coach konnte nicht geladen werden",
    pt: "Não foi possível carregar o treinador",
    bg: "Треньорът не можа да бъде зареден",
  },

  "myCoach.noCoach": {
    en: "NO COACH YET",
    es: "AÚN NO TIENES ENTRENADOR",
    uk: "ТРЕНЕРА ЩЕ НЕМАЄ",
    ru: "ТРЕНЕРА ПОКА НЕТ",
    fr: "PAS ENCORE DE COACH",
    de: "NOCH KEIN COACH",
    pt: "AINDA SEM TREINADOR",
    bg: "ВСЕ ОЩЕ НЯМАШ ТРЕНЬОР",
  },

  "myCoach.findYourCoach": {
    en: "FIND YOUR COACH",
    es: "ENCUENTRA TU ENTRENADOR",
    uk: "ЗНАЙДИ СВОГО ТРЕНЕРА",
    ru: "НАЙДИ СВОЕГО ТРЕНЕРА",
    fr: "TROUVE TON COACH",
    de: "FINDE DEINEN COACH",
    pt: "ENCONTRE SEU TREINADOR",
    bg: "НАМЕРИ СВОЯ ТРЕНЬОР",
  },

  "myCoach.emptyDescription": {
    en: "Choose an IRONAGE coach who can create your training plan and monitor your progress.",
    es: "Elige un entrenador IRONAGE que pueda crear tu plan de entrenamiento y seguir tu progreso.",
    uk: "Обери тренера IRONAGE, який створить твій тренувальний план і контролюватиме прогрес.",
    ru: "Выбери тренера IRONAGE, который создаст твой тренировочный план и будет следить за прогрессом.",
    fr: "Choisis un coach IRONAGE qui créera ton plan d’entraînement et suivra ta progression.",
    de: "Wähle einen IRONAGE-Coach, der deinen Trainingsplan erstellt und deinen Fortschritt überwacht.",
    pt: "Escolha um treinador IRONAGE que crie seu plano de treino e acompanhe seu progresso.",
    bg: "Избери треньор на IRONAGE, който да създаде тренировъчния ти план и да следи напредъка ти.",
  },

  "myCoach.findCoach": {
    en: "FIND A COACH",
    es: "BUSCAR ENTRENADOR",
    uk: "ЗНАЙТИ ТРЕНЕРА",
    ru: "НАЙТИ ТРЕНЕРА",
    fr: "TROUVER UN COACH",
    de: "COACH FINDEN",
    pt: "ENCONTRAR TREINADOR",
    bg: "НАМЕРИ ТРЕНЬОР",
  },

  "myCoach.yourCoach": {
    en: "YOUR COACH",
    es: "TU ENTRENADOR",
    uk: "ТВІЙ ТРЕНЕР",
    ru: "ТВОЙ ТРЕНЕР",
    fr: "TON COACH",
    de: "DEIN COACH",
    pt: "SEU TREINADOR",
    bg: "ТВОЯТ ТРЕНЬОР",
  },

  "myCoach.defaultCoach": {
    en: "IRONAGE COACH",
    es: "ENTRENADOR IRONAGE",
    uk: "ТРЕНЕР IRONAGE",
    ru: "ТРЕНЕР IRONAGE",
    fr: "COACH IRONAGE",
    de: "IRONAGE COACH",
    pt: "TREINADOR IRONAGE",
    bg: "ТРЕНЬОР IRONAGE",
  },

  "myCoach.about": {
    en: "ABOUT",
    es: "SOBRE",
    uk: "ПРО ТРЕНЕРА",
    ru: "О ТРЕНЕРЕ",
    fr: "À PROPOS",
    de: "ÜBER",
    pt: "SOBRE",
    bg: "ЗА ТРЕНЬОРА",
  },

  "myCoach.coachStatus": {
    en: "COACH STATUS",
    es: "ESTADO DEL ENTRENADOR",
    uk: "СТАТУС ТРЕНЕРА",
    ru: "СТАТУС ТРЕНЕРА",
    fr: "STATUT DU COACH",
    de: "COACH-STATUS",
    pt: "STATUS DO TREINADOR",
    bg: "СТАТУС НА ТРЕНЬОРА",
  },

  "myCoach.active": {
    en: "ACTIVE",
    es: "ACTIVO",
    uk: "АКТИВНИЙ",
    ru: "АКТИВЕН",
    fr: "ACTIF",
    de: "AKTIV",
    pt: "ATIVO",
    bg: "АКТИВЕН",
  },

  "myCoach.inactive": {
    en: "INACTIVE",
    es: "INACTIVO",
    uk: "НЕАКТИВНИЙ",
    ru: "НЕАКТИВЕН",
    fr: "INACTIF",
    de: "INAKTIV",
    pt: "INATIVO",
    bg: "НЕАКТИВЕН",
  },

  "myCoach.started": {
    en: "COACHING STARTED",
    es: "COACHING INICIADO",
    uk: "ПОЧАТОК СУПРОВОДУ",
    ru: "НАЧАЛО СОПРОВОЖДЕНИЯ",
    fr: "DÉBUT DU COACHING",
    de: "COACHING GESTARTET",
    pt: "COACHING INICIADO",
    bg: "НАЧАЛО НА КОУЧИНГА",
  },

  "myCoach.username": {
    en: "USERNAME",
    es: "USUARIO",
    uk: "ІМ’Я КОРИСТУВАЧА",
    ru: "ИМЯ ПОЛЬЗОВАТЕЛЯ",
    fr: "NOM D’UTILISATEUR",
    de: "BENUTZERNAME",
    pt: "NOME DE USUÁRIO",
    bg: "ПОТРЕБИТЕЛСКО ИМЕ",
  },

  "myCoach.openProgram": {
    en: "OPEN MY PROGRAM",
    es: "ABRIR MI PROGRAMA",
    uk: "ВІДКРИТИ МОЮ ПРОГРАМУ",
    ru: "ОТКРЫТЬ МОЮ ПРОГРАММУ",
    fr: "OUVRIR MON PROGRAMME",
    de: "MEIN PROGRAMM ÖFFNEN",
    pt: "ABRIR MEU PROGRAMA",
    bg: "ОТВОРИ МОЯТА ПРОГРАМА",
  },

  "myCoach.videoReview": {
    en: "SEND VIDEO FOR REVIEW",
    es: "ENVIAR VÍDEO PARA REVISIÓN",
    uk: "НАДІСЛАТИ ВІДЕО НА РОЗБІР",
    ru: "ОТПРАВИТЬ ВИДЕО НА РАЗБОР",
    fr: "ENVOYER UNE VIDÉO À ANALYSER",
    de: "VIDEO ZUR PRÜFUNG SENDEN",
    pt: "ENVIAR VÍDEO PARA ANÁLISE",
    bg: "ИЗПРАТИ ВИДЕО ЗА ПРЕГЛЕД",
  },

  /* =====================================================
     COACH DASHBOARD
  ===================================================== */

  "coachDashboard.noGoal": {
    en: "NO GOAL",
    es: "SIN OBJETIVO",
    uk: "БЕЗ ЦІЛІ",
    ru: "БЕЗ ЦЕЛИ",
    fr: "AUCUN OBJECTIF",
    de: "KEIN ZIEL",
    pt: "SEM OBJETIVO",
    bg: "БЕЗ ЦЕЛ",
  },

  "coachDashboard.athlete": {
    en: "ATHLETE",
    es: "ATLETA",
    uk: "АТЛЕТ",
    ru: "АТЛЕТ",
    fr: "ATHLÈTE",
    de: "ATHLET",
    pt: "ATLETA",
    bg: "АТЛЕТ",
  },

  "coachDashboard.level": {
    en: "LEVEL",
    es: "NIVEL",
    uk: "РІВЕНЬ",
    ru: "УРОВЕНЬ",
    fr: "NIVEAU",
    de: "LEVEL",
    pt: "NÍVEL",
    bg: "НИВО",
  },

  "coachDashboard.workouts": {
    en: "WORKOUTS",
    es: "ENTRENAMIENTOS",
    uk: "ТРЕНУВАННЯ",
    ru: "ТРЕНИРОВКИ",
    fr: "ENTRAÎNEMENTS",
    de: "TRAININGS",
    pt: "TREINOS",
    bg: "ТРЕНИРОВКИ",
  },

  "coachDashboard.streak": {
    en: "STREAK",
    es: "RACHA",
    uk: "СЕРІЯ",
    ru: "СЕРИЯ",
    fr: "SÉRIE",
    de: "SERIE",
    pt: "SEQUÊNCIA",
    bg: "СЕРИЯ",
  },

  "coachDashboard.currentProgress": {
    en: "CURRENT PROGRESS",
    es: "PROGRESO ACTUAL",
    uk: "ПОТОЧНИЙ ПРОГРЕС",
    ru: "ТЕКУЩИЙ ПРОГРЕСС",
    fr: "PROGRÈS ACTUEL",
    de: "AKTUELLER FORTSCHRITT",
    pt: "PROGRESSO ATUAL",
    bg: "ТЕКУЩ ПРОГРЕС",
  },

  "coachDashboard.weight": {
    en: "KG · WEIGHT",
    es: "KG · PESO",
    uk: "КГ · ВАГА",
    ru: "КГ · ВЕС",
    fr: "KG · POIDS",
    de: "KG · GEWICHT",
    pt: "KG · PESO",
    bg: "КГ · ТЕГЛО",
  },

  "coachDashboard.bodyFat": {
    en: "% · BODY FAT",
    es: "% · GRASA CORPORAL",
    uk: "% · ЖИР",
    ru: "% · ЖИР",
    fr: "% · MASSE GRASSE",
    de: "% · KÖRPERFETT",
    pt: "% · GORDURA CORPORAL",
    bg: "% · ТЕЛЕСНИ МАЗНИНИ",
  },

  "coachDashboard.muscleMass": {
    en: "KG · MUSCLE MASS",
    es: "KG · MASA MUSCULAR",
    uk: "КГ · М’ЯЗОВА МАСА",
    ru: "КГ · МЫШЕЧНАЯ МАССА",
    fr: "KG · MASSE MUSCULAIRE",
    de: "KG · MUSKELMASSE",
    pt: "KG · MASSA MUSCULAR",
    bg: "КГ · МУСКУЛНА МАСА",
  },

  "coachDashboard.programAdherence": {
    en: "PROGRAM ADHERENCE",
    es: "CUMPLIMIENTO DEL PROGRAMA",
    uk: "ВИКОНАННЯ ПРОГРАМИ",
    ru: "ВЫПОЛНЕНИЕ ПРОГРАММЫ",
    fr: "SUIVI DU PROGRAMME",
    de: "PROGRAMMTREUE",
    pt: "ADESÃO AO PROGRAMA",
    bg: "ИЗПЪЛНЕНИЕ НА ПРОГРАМАТА",
  },

  "coachDashboard.workoutsCompleted": {
    en: "WORKOUTS COMPLETED",
    es: "ENTRENAMIENTOS COMPLETADOS",
    uk: "ТРЕНУВАНЬ ВИКОНАНО",
    ru: "ТРЕНИРОВОК ВЫПОЛНЕНО",
    fr: "ENTRAÎNEMENTS TERMINÉS",
    de: "TRAININGS ABGESCHLOSSEN",
    pt: "TREINOS CONCLUÍDOS",
    bg: "ЗАВЪРШЕНИ ТРЕНИРОВКИ",
  },

  "coachDashboard.week": {
    en: "WEEK",
    es: "SEMANA",
    uk: "ТИЖДЕНЬ",
    ru: "НЕДЕЛЯ",
    fr: "SEMAINE",
    de: "WOCHE",
    pt: "SEMANA",
    bg: "СЕДМИЦА",
  },

  "coachDashboard.day": {
    en: "DAY",
    es: "DÍA",
    uk: "ДЕНЬ",
    ru: "ДЕНЬ",
    fr: "JOUR",
    de: "TAG",
    pt: "DIA",
    bg: "ДЕН",
  },

  "coachDashboard.program": {
    en: "PROGRAM",
    es: "PROGRAMA",
    uk: "ПРОГРАМА",
    ru: "ПРОГРАММА",
    fr: "PROGRAMME",
    de: "PROGRAMM",
    pt: "PROGRAMA",
    bg: "ПРОГРАМА",
  },

  "coachDashboard.completed": {
    en: "COMPLETED",
    es: "COMPLETADO",
    uk: "ВИКОНАНО",
    ru: "ВЫПОЛНЕНО",
    fr: "TERMINÉ",
    de: "ABGESCHLOSSEN",
    pt: "CONCLUÍDO",
    bg: "ЗАВЪРШЕНО",
  },

  "coachDashboard.pending": {
    en: "PENDING",
    es: "PENDIENTE",
    uk: "ОЧІКУЄ",
    ru: "ОЖИДАЕТ",
    fr: "EN ATTENTE",
    de: "AUSSTEHEND",
    pt: "PENDENTE",
    bg: "ПРЕДСТОИ",
  },

  "coachDashboard.lastCompleted": {
    en: "LAST COMPLETED",
    es: "ÚLTIMO COMPLETADO",
    uk: "ОСТАННЄ ВИКОНАННЯ",
    ru: "ПОСЛЕДНЕЕ ВЫПОЛНЕНИЕ",
    fr: "DERNIER TERMINÉ",
    de: "ZULETZT ABGESCHLOSSEN",
    pt: "ÚLTIMO CONCLUÍDO",
    bg: "ПОСЛЕДНО ЗАВЪРШЕНО",
  },

  "coachDashboard.workoutHistory": {
    en: "WORKOUT HISTORY",
    es: "HISTORIAL DE ENTRENAMIENTOS",
    uk: "ІСТОРІЯ ТРЕНУВАНЬ",
    ru: "ИСТОРИЯ ТРЕНИРОВОК",
    fr: "HISTORIQUE DES ENTRAÎNEMENTS",
    de: "TRAININGSVERLAUF",
    pt: "HISTÓRICO DE TREINOS",
    bg: "ИСТОРИЯ НА ТРЕНИРОВКИТЕ",
  },

  "coachDashboard.noResults": {
    en: "NO RESULTS YET",
    es: "AÚN NO HAY RESULTADOS",
    uk: "РЕЗУЛЬТАТІВ ЩЕ НЕМАЄ",
    ru: "РЕЗУЛЬТАТОВ ПОКА НЕТ",
    fr: "PAS ENCORE DE RÉSULTATS",
    de: "NOCH KEINE ERGEBNISSE",
    pt: "AINDA SEM RESULTADOS",
    bg: "ВСЕ ОЩЕ НЯМА РЕЗУЛТАТИ",
  },

  "coachDashboard.resultsEmpty": {
    en: "Completed client workouts will appear here.",
    es: "Los entrenamientos completados del cliente aparecerán aquí.",
    uk: "Завершені тренування клієнта з’являться тут.",
    ru: "Завершенные тренировки клиента появятся здесь.",
    fr: "Les entraînements terminés du client apparaîtront ici.",
    de: "Abgeschlossene Trainings des Kunden erscheinen hier.",
    pt: "Os treinos concluídos do cliente aparecerão aqui.",
    bg: "Завършените тренировки на клиента ще се показват тук.",
  },

  "coachDashboard.sec": {
    en: "SEC",
    es: "SEG",
    uk: "СЕК",
    ru: "СЕК",
    fr: "SEC",
    de: "SEK",
    pt: "SEG",
    bg: "СЕК",
  },

  "coachDashboard.sets": {
    en: "SETS",
    es: "SERIES",
    uk: "ПІДХОДИ",
    ru: "ПОДХОДЫ",
    fr: "SÉRIES",
    de: "SÄTZE",
    pt: "SÉRIES",
    bg: "СЕРИИ",
  },

  "coachDashboard.set": {
    en: "SET",
    es: "SERIE",
    uk: "ПІДХІД",
    ru: "ПОДХОД",
    fr: "SÉRIE",
    de: "SATZ",
    pt: "SÉRIE",
    bg: "СЕРИЯ",
  },

  "coachDashboard.reps": {
    en: "REPS",
    es: "REPS",
    uk: "ПОВТОРИ",
    ru: "ПОВТОРЫ",
    fr: "RÉP.",
    de: "WDH.",
    pt: "REPS",
    bg: "ПОВТ.",
  },

  "coachDashboard.backClients": {
    en: "Back to clients",
    es: "Volver a clientes",
    uk: "Назад до клієнтів",
    ru: "Назад к клиентам",
    fr: "Retour aux clients",
    de: "Zurück zu Kunden",
    pt: "Voltar aos clientes",
    bg: "Назад към клиентите",
  },

  "coachDashboard.athletePerformance": {
    en: "ATHLETE PERFORMANCE",
    es: "RENDIMIENTO DEL ATLETA",
    uk: "РЕЗУЛЬТАТИ АТЛЕТА",
    ru: "РЕЗУЛЬТАТЫ АТЛЕТА",
    fr: "PERFORMANCE DE L’ATHLÈTE",
    de: "ATHLETENLEISTUNG",
    pt: "DESEMPENHO DO ATLETA",
    bg: "ПРЕДСТАВЯНЕ НА АТЛЕТА",
  },

  "coachDashboard.clientResults": {
    en: "CLIENT RESULTS",
    es: "RESULTADOS DEL CLIENTE",
    uk: "РЕЗУЛЬТАТИ КЛІЄНТА",
    ru: "РЕЗУЛЬТАТЫ КЛИЕНТА",
    fr: "RÉSULTATS DU CLIENT",
    de: "KUNDENERGEBNISSE",
    pt: "RESULTADOS DO CLIENTE",
    bg: "РЕЗУЛТАТИ НА КЛИЕНТА",
  },

  "coachDashboard.loadingResults": {
    en: "LOADING RESULTS...",
    es: "CARGANDO RESULTADOS...",
    uk: "ЗАВАНТАЖЕННЯ РЕЗУЛЬТАТІВ...",
    ru: "ЗАГРУЗКА РЕЗУЛЬТАТОВ...",
    fr: "CHARGEMENT DES RÉSULTATS...",
    de: "ERGEBNISSE WERDEN GELADEN...",
    pt: "CARREGANDO RESULTADOS...",
    bg: "ЗАРЕЖДАНЕ НА РЕЗУЛТАТИТЕ...",
  },

  "coachDashboard.resultsError": {
    en: "RESULTS ERROR",
    es: "ERROR DE RESULTADOS",
    uk: "ПОМИЛКА РЕЗУЛЬТАТІВ",
    ru: "ОШИБКА РЕЗУЛЬТАТОВ",
    fr: "ERREUR DE RÉSULTATS",
    de: "ERGEBNISFEHLER",
    pt: "ERRO DE RESULTADOS",
    bg: "ГРЕШКА В РЕЗУЛТАТИТЕ",
  },

  "coachDashboard.assignment": {
    en: "PROGRAM ASSIGNMENT",
    es: "ASIGNACIÓN DE PROGRAMA",
    uk: "ПРИЗНАЧЕННЯ ПРОГРАМИ",
    ru: "НАЗНАЧЕНИЕ ПРОГРАММЫ",
    fr: "ATTRIBUTION DU PROGRAMME",
    de: "PROGRAMMZUWEISUNG",
    pt: "ATRIBUIÇÃO DE PROGRAMA",
    bg: "ЗАДАВАНЕ НА ПРОГРАМА",
  },

  "coachDashboard.assignProgram": {
    en: "ASSIGN PROGRAM",
    es: "ASIGNAR PROGRAMA",
    uk: "ПРИЗНАЧИТИ ПРОГРАМУ",
    ru: "НАЗНАЧИТЬ ПРОГРАММУ",
    fr: "ATTRIBUER LE PROGRAMME",
    de: "PROGRAMM ZUWEISEN",
    pt: "ATRIBUIR PROGRAMA",
    bg: "ЗАДАЙ ПРОГРАМА",
  },

  "coachDashboard.selectAthlete": {
    en: "SELECT ATHLETE",
    es: "SELECCIONAR ATLETA",
    uk: "ОБРАТИ АТЛЕТА",
    ru: "ВЫБРАТЬ АТЛЕТА",
    fr: "SÉLECTIONNER L’ATHLÈTE",
    de: "ATHLET AUSWÄHLEN",
    pt: "SELECIONAR ATLETA",
    bg: "ИЗБЕРИ АТЛЕТ",
  },

  "coachDashboard.selectedProgram": {
    en: "SELECTED PROGRAM",
    es: "PROGRAMA SELECCIONADO",
    uk: "ОБРАНА ПРОГРАМА",
    ru: "ВЫБРАННАЯ ПРОГРАММА",
    fr: "PROGRAMME SÉLECTIONNÉ",
    de: "AUSGEWÄHLTES PROGRAMM",
    pt: "PROGRAMA SELECIONADO",
    bg: "ИЗБРАНА ПРОГРАМА",
  },

  "coachDashboard.weeks": {
    en: "WEEKS",
    es: "SEMANAS",
    uk: "ТИЖНІ",
    ru: "НЕДЕЛИ",
    fr: "SEMAINES",
    de: "WOCHEN",
    pt: "SEMANAS",
    bg: "СЕДМИЦИ",
  },

  "coachDashboard.customDuration": {
    en: "CUSTOM DURATION",
    es: "DURACIÓN PERSONALIZADA",
    uk: "ІНДИВІДУАЛЬНА ТРИВАЛІСТЬ",
    ru: "ИНДИВИДУАЛЬНАЯ ДЛИТЕЛЬНОСТЬ",
    fr: "DURÉE PERSONNALISÉE",
    de: "INDIVIDUELLE DAUER",
    pt: "DURAÇÃO PERSONALIZADA",
    bg: "ИНДИВИДУАЛНА ПРОДЪЛЖИТЕЛНОСТ",
  },

  "coachDashboard.loadingClients": {
    en: "LOADING CLIENTS...",
    es: "CARGANDO CLIENTES...",
    uk: "ЗАВАНТАЖЕННЯ КЛІЄНТІВ...",
    ru: "ЗАГРУЗКА КЛИЕНТОВ...",
    fr: "CHARGEMENT DES CLIENTS...",
    de: "KUNDEN WERDEN GELADEN...",
    pt: "CARREGANDO CLIENTES...",
    bg: "ЗАРЕЖДАНЕ НА КЛИЕНТИ...",
  },

  "coachDashboard.connectionError": {
    en: "CONNECTION ERROR",
    es: "ERROR DE CONEXIÓN",
    uk: "ПОМИЛКА З’ЄДНАННЯ",
    ru: "ОШИБКА СОЕДИНЕНИЯ",
    fr: "ERREUR DE CONNEXION",
    de: "VERBINDUNGSFEHLER",
    pt: "ERRO DE CONEXÃO",
    bg: "ГРЕШКА ПРИ СВЪРЗВАНЕ",
  },

  "coachDashboard.clientRoster": {
    en: "CLIENT ROSTER",
    es: "LISTA DE CLIENTES",
    uk: "СПИСОК КЛІЄНТІВ",
    ru: "СПИСОК КЛИЕНТОВ",
    fr: "LISTE DES CLIENTS",
    de: "KUNDENLISTE",
    pt: "LISTA DE CLIENTES",
    bg: "СПИСЪК С КЛИЕНТИ",
  },

  "coachDashboard.noClients": {
    en: "NO CLIENTS YET",
    es: "AÚN NO HAY CLIENTES",
    uk: "КЛІЄНТІВ ЩЕ НЕМАЄ",
    ru: "КЛИЕНТОВ ПОКА НЕТ",
    fr: "PAS ENCORE DE CLIENTS",
    de: "NOCH KEINE KUNDEN",
    pt: "AINDA SEM CLIENTES",
    bg: "ВСЕ ОЩЕ НЯМА КЛИЕНТИ",
  },

  "coachDashboard.inviteBeforeAssign": {
    en: "Invite a client before assigning a program.",
    es: "Invita a un cliente antes de asignar un programa.",
    uk: "Запроси клієнта перед призначенням програми.",
    ru: "Пригласи клиента перед назначением программы.",
    fr: "Invite un client avant d’attribuer un programme.",
    de: "Lade einen Kunden ein, bevor du ein Programm zuweist.",
    pt: "Convide um cliente antes de atribuir um programa.",
    bg: "Покани клиент, преди да зададеш програма.",
  },

  "coachDashboard.programAssigned": {
    en: "PROGRAM ASSIGNED",
    es: "PROGRAMA ASIGNADO",
    uk: "ПРОГРАМУ ПРИЗНАЧЕНО",
    ru: "ПРОГРАММА НАЗНАЧЕНА",
    fr: "PROGRAMME ATTRIBUÉ",
    de: "PROGRAMM ZUGEWIESEN",
    pt: "PROGRAMA ATRIBUÍDO",
    bg: "ПРОГРАМАТА Е ЗАДАДЕНА",
  },

  "coachDashboard.backPrograms": {
    en: "BACK TO PROGRAMS",
    es: "VOLVER A PROGRAMAS",
    uk: "НАЗАД ДО ПРОГРАМ",
    ru: "НАЗАД К ПРОГРАММАМ",
    fr: "RETOUR AUX PROGRAMMES",
    de: "ZURÜCK ZU PROGRAMMEN",
    pt: "VOLTAR AOS PROGRAMAS",
    bg: "НАЗАД КЪМ ПРОГРАМИТЕ",
  },

  "coachDashboard.assign": {
    en: "ASSIGN",
    es: "ASIGNAR",
    uk: "ПРИЗНАЧИТИ",
    ru: "НАЗНАЧИТЬ",
    fr: "ATTRIBUER",
    de: "ZUWEISEN",
    pt: "ATRIBUIR",
    bg: "ЗАДАЙ",
  },

  "coachDashboard.controlCenter": {
    en: "COACH CONTROL CENTER",
    es: "CENTRO DE CONTROL DEL ENTRENADOR",
    uk: "ЦЕНТР КЕРУВАННЯ ТРЕНЕРА",
    ru: "ЦЕНТР УПРАВЛЕНИЯ ТРЕНЕРА",
    fr: "CENTRE DE CONTRÔLE DU COACH",
    de: "COACH-KONTROLLZENTRUM",
    pt: "CENTRO DE CONTROLE DO TREINADOR",
    bg: "ЦЕНТЪР ЗА УПРАВЛЕНИЕ НА ТРЕНЬОРА",
  },

  "coachDashboard.myPrograms": {
    en: "MY PROGRAMS",
    es: "MIS PROGRAMAS",
    uk: "МОЇ ПРОГРАМИ",
    ru: "МОИ ПРОГРАММЫ",
    fr: "MES PROGRAMMES",
    de: "MEINE PROGRAMME",
    pt: "MEUS PROGRAMAS",
    bg: "МОИТЕ ПРОГРАМИ",
  },

  "coachDashboard.trainingSystems": {
    en: "TRAINING SYSTEMS",
    es: "SISTEMAS DE ENTRENAMIENTO",
    uk: "ТРЕНУВАЛЬНІ СИСТЕМИ",
    ru: "ТРЕНИРОВОЧНЫЕ СИСТЕМЫ",
    fr: "SYSTÈMES D’ENTRAÎNEMENT",
    de: "TRAININGSSYSTEME",
    pt: "SISTEMAS DE TREINO",
    bg: "ТРЕНИРОВЪЧНИ СИСТЕМИ",
  },

  "coachDashboard.createProgram": {
    en: "+ CREATE PROGRAM",
    es: "+ CREAR PROGRAMA",
    uk: "+ СТВОРИТИ ПРОГРАМУ",
    ru: "+ СОЗДАТЬ ПРОГРАММУ",
    fr: "+ CRÉER UN PROGRAMME",
    de: "+ PROGRAMM ERSTELLEN",
    pt: "+ CRIAR PROGRAMA",
    bg: "+ СЪЗДАЙ ПРОГРАМА",
  },

  "coachDashboard.activePrograms": {
    en: "ACTIVE PROGRAMS",
    es: "PROGRAMAS ACTIVOS",
    uk: "АКТИВНІ ПРОГРАМИ",
    ru: "АКТИВНЫЕ ПРОГРАММЫ",
    fr: "PROGRAMMES ACTIFS",
    de: "AKTIVE PROGRAMME",
    pt: "PROGRAMAS ATIVOS",
    bg: "АКТИВНИ ПРОГРАМИ",
  },

  "coachDashboard.workoutsUsed": {
    en: "WORKOUTS USED",
    es: "ENTRENAMIENTOS USADOS",
    uk: "ВИКОРИСТАНО ТРЕНУВАНЬ",
    ru: "ИСПОЛЬЗОВАНО ТРЕНИРОВОК",
    fr: "ENTRAÎNEMENTS UTILISÉS",
    de: "VERWENDETE TRAININGS",
    pt: "TREINOS UTILIZADOS",
    bg: "ИЗПОЛЗВАНИ ТРЕНИРОВКИ",
  },

  "coachDashboard.loadingPrograms": {
    en: "LOADING PROGRAMS...",
    es: "CARGANDO PROGRAMAS...",
    uk: "ЗАВАНТАЖЕННЯ ПРОГРАМ...",
    ru: "ЗАГРУЗКА ПРОГРАММ...",
    fr: "CHARGEMENT DES PROGRAMMES...",
    de: "PROGRAMME WERDEN GELADEN...",
    pt: "CARREGANDO PROGRAMAS...",
    bg: "ЗАРЕЖДАНЕ НА ПРОГРАМИ...",
  },

  "coachDashboard.programLibrary": {
    en: "PROGRAM LIBRARY",
    es: "BIBLIOTECA DE PROGRAMAS",
    uk: "БІБЛІОТЕКА ПРОГРАМ",
    ru: "БИБЛИОТЕКА ПРОГРАММ",
    fr: "BIBLIOTHÈQUE DE PROGRAMMES",
    de: "PROGRAMMBIBLIOTHEK",
    pt: "BIBLIOTECA DE PROGRAMAS",
    bg: "БИБЛИОТЕКА С ПРОГРАМИ",
  },

  "coachDashboard.noPrograms": {
    en: "NO PROGRAMS YET",
    es: "AÚN NO HAY PROGRAMAS",
    uk: "ПРОГРАМ ЩЕ НЕМАЄ",
    ru: "ПРОГРАММ ПОКА НЕТ",
    fr: "PAS ENCORE DE PROGRAMMES",
    de: "NOCH KEINE PROGRAMME",
    pt: "AINDA SEM PROGRAMAS",
    bg: "ВСЕ ОЩЕ НЯМА ПРОГРАМИ",
  },

  "coachDashboard.programsEmpty": {
    en: "Your training programs will appear here.",
    es: "Tus programas de entrenamiento aparecerán aquí.",
    uk: "Твої тренувальні програми з’являться тут.",
    ru: "Твои тренировочные программы появятся здесь.",
    fr: "Tes programmes d’entraînement apparaîtront ici.",
    de: "Deine Trainingsprogramme erscheinen hier.",
    pt: "Seus programas de treino aparecerão aqui.",
    bg: "Твоите тренировъчни програми ще се показват тук.",
  },

  "coachDashboard.programNumber": {
    en: "PROGRAM",
    es: "PROGRAMA",
    uk: "ПРОГРАМА",
    ru: "ПРОГРАММА",
    fr: "PROGRAMME",
    de: "PROGRAMM",
    pt: "PROGRAMA",
    bg: "ПРОГРАМА",
  },

  "coachDashboard.ironageStatus": {
    en: "IRONAGE STATUS",
    es: "ESTADO IRONAGE",
    uk: "СТАТУС IRONAGE",
    ru: "СТАТУС IRONAGE",
    fr: "STATUT IRONAGE",
    de: "IRONAGE STATUS",
    pt: "STATUS IRONAGE",
    bg: "СТАТУС IRONAGE",
  },

  "coachDashboard.draft": {
    en: "DRAFT",
    es: "BORRADOR",
    uk: "ЧЕРНЕТКА",
    ru: "ЧЕРНОВИК",
    fr: "BROUILLON",
    de: "ENTWURF",
    pt: "RASCUNHO",
    bg: "ЧЕРНОВА",
  },

  "coachDashboard.review": {
    en: "REVIEW",
    es: "REVISIÓN",
    uk: "НА ПЕРЕВІРЦІ",
    ru: "НА ПРОВЕРКЕ",
    fr: "EN RÉVISION",
    de: "PRÜFUNG",
    pt: "EM REVISÃO",
    bg: "ЗА ПРЕГЛЕД",
  },

  "coachDashboard.approved": {
    en: "APPROVED",
    es: "APROBADO",
    uk: "СХВАЛЕНО",
    ru: "ОДОБРЕНО",
    fr: "APPROUVÉ",
    de: "GENEHMIGT",
    pt: "APROVADO",
    bg: "ОДОБРЕНО",
  },

  "coachDashboard.published": {
    en: "PUBLISHED",
    es: "PUBLICADO",
    uk: "ОПУБЛІКОВАНО",
    ru: "ОПУБЛИКОВАНО",
    fr: "PUBLIÉ",
    de: "VERÖFFENTLICHT",
    pt: "PUBLICADO",
    bg: "ПУБЛИКУВАНО",
  },

  "coachDashboard.archived": {
    en: "ARCHIVED",
    es: "ARCHIVADO",
    uk: "АРХІВ",
    ru: "АРХИВ",
    fr: "ARCHIVÉ",
    de: "ARCHIVIERT",
    pt: "ARQUIVADO",
    bg: "АРХИВИРАНО",
  },

  "coachDashboard.submitting": {
    en: "SUBMITTING...",
    es: "ENVIANDO...",
    uk: "НАДСИЛАННЯ...",
    ru: "ОТПРАВКА...",
    fr: "ENVOI...",
    de: "WIRD GESENDET...",
    pt: "ENVIANDO...",
    bg: "ИЗПРАЩАНЕ...",
  },

  "coachDashboard.submitReview": {
    en: "SUBMIT FOR REVIEW",
    es: "ENVIAR A REVISIÓN",
    uk: "НАДІСЛАТИ НА ПЕРЕВІРКУ",
    ru: "ОТПРАВИТЬ НА ПРОВЕРКУ",
    fr: "ENVOYER POUR RÉVISION",
    de: "ZUR PRÜFUNG SENDEN",
    pt: "ENVIAR PARA REVISÃO",
    bg: "ИЗПРАТИ ЗА ПРЕГЛЕД",
  },

  "coachDashboard.waitApproval": {
    en: "WAITING FOR IRONAGE APPROVAL",
    es: "ESPERANDO APROBACIÓN DE IRONAGE",
    uk: "ОЧІКУЄ СХВАЛЕННЯ IRONAGE",
    ru: "ОЖИДАЕТ ОДОБРЕНИЯ IRONAGE",
    fr: "EN ATTENTE DE L’APPROBATION IRONAGE",
    de: "WARTET AUF IRONAGE-FREIGABE",
    pt: "AGUARDANDO APROVAÇÃO DA IRONAGE",
    bg: "ОЧАКВА ОДОБРЕНИЕ ОТ IRONAGE",
  },

  "coachDashboard.waitPublication": {
    en: "APPROVED BY IRONAGE · WAITING FOR PUBLICATION",
    es: "APROBADO POR IRONAGE · ESPERANDO PUBLICACIÓN",
    uk: "СХВАЛЕНО IRONAGE · ОЧІКУЄ ПУБЛІКАЦІЇ",
    ru: "ОДОБРЕНО IRONAGE · ОЖИДАЕТ ПУБЛИКАЦИИ",
    fr: "APPROUVÉ PAR IRONAGE · EN ATTENTE DE PUBLICATION",
    de: "VON IRONAGE GENEHMIGT · WARTET AUF VERÖFFENTLICHUNG",
    pt: "APROVADO PELA IRONAGE · AGUARDANDO PUBLICAÇÃO",
    bg: "ОДОБРЕНО ОТ IRONAGE · ОЧАКВА ПУБЛИКУВАНЕ",
  },

  "coachDashboard.liveMarketplace": {
    en: "LIVE IN IRONAGE MARKETPLACE",
    es: "ACTIVO EN EL MARKETPLACE DE IRONAGE",
    uk: "ОПУБЛІКОВАНО В IRONAGE MARKETPLACE",
    ru: "ОПУБЛИКОВАНО В IRONAGE MARKETPLACE",
    fr: "EN LIGNE SUR IRONAGE MARKETPLACE",
    de: "LIVE IM IRONAGE MARKETPLACE",
    pt: "ATIVO NO MARKETPLACE IRONAGE",
    bg: "АКТИВНО В IRONAGE MARKETPLACE",
  },

  "coachDashboard.programArchived": {
    en: "PROGRAM ARCHIVED",
    es: "PROGRAMA ARCHIVADO",
    uk: "ПРОГРАМУ АРХІВОВАНО",
    ru: "ПРОГРАММА АРХИВИРОВАНА",
    fr: "PROGRAMME ARCHIVÉ",
    de: "PROGRAMM ARCHIVIERT",
    pt: "PROGRAMA ARQUIVADO",
    bg: "ПРОГРАМАТА Е АРХИВИРАНА",
  },

  "coachDashboard.myWorkouts": {
    en: "MY WORKOUTS",
    es: "MIS ENTRENAMIENTOS",
    uk: "МОЇ ТРЕНУВАННЯ",
    ru: "МОИ ТРЕНИРОВКИ",
    fr: "MES ENTRAÎNEMENTS",
    de: "MEINE TRAININGS",
    pt: "MEUS TREINOS",
    bg: "МОИТЕ ТРЕНИРОВКИ",
  },

  "coachDashboard.trainingLibrary": {
    en: "TRAINING LIBRARY",
    es: "BIBLIOTECA DE ENTRENAMIENTO",
    uk: "БІБЛІОТЕКА ТРЕНУВАНЬ",
    ru: "БИБЛИОТЕКА ТРЕНИРОВОК",
    fr: "BIBLIOTHÈQUE D’ENTRAÎNEMENT",
    de: "TRAININGSBIBLIOTHEK",
    pt: "BIBLIOTECA DE TREINOS",
    bg: "БИБЛИОТЕКА С ТРЕНИРОВКИ",
  },

  "coachDashboard.createWorkout": {
    en: "+ CREATE WORKOUT",
    es: "+ CREAR ENTRENAMIENTO",
    uk: "+ СТВОРИТИ ТРЕНУВАННЯ",
    ru: "+ СОЗДАТЬ ТРЕНИРОВКУ",
    fr: "+ CRÉER UN ENTRAÎNEMENT",
    de: "+ TRAINING ERSTELLEN",
    pt: "+ CRIAR TREINO",
    bg: "+ СЪЗДАЙ ТРЕНИРОВКА",
  },

  "coachDashboard.activeWorkouts": {
    en: "ACTIVE WORKOUTS",
    es: "ENTRENAMIENTOS ACTIVOS",
    uk: "АКТИВНІ ТРЕНУВАННЯ",
    ru: "АКТИВНЫЕ ТРЕНИРОВКИ",
    fr: "ENTRAÎNEMENTS ACTIFS",
    de: "AKTIVE TRAININGS",
    pt: "TREINOS ATIVOS",
    bg: "АКТИВНИ ТРЕНИРОВКИ",
  },

  "coachDashboard.exercisesUsed": {
    en: "EXERCISES USED",
    es: "EJERCICIOS USADOS",
    uk: "ВИКОРИСТАНО ВПРАВ",
    ru: "ИСПОЛЬЗОВАНО УПРАЖНЕНИЙ",
    fr: "EXERCICES UTILISÉS",
    de: "VERWENDETE ÜBUNGEN",
    pt: "EXERCÍCIOS UTILIZADOS",
    bg: "ИЗПОЛЗВАНИ УПРАЖНЕНИЯ",
  },

  "coachDashboard.loadingWorkouts": {
    en: "LOADING WORKOUTS...",
    es: "CARGANDO ENTRENAMIENTOS...",
    uk: "ЗАВАНТАЖЕННЯ ТРЕНУВАНЬ...",
    ru: "ЗАГРУЗКА ТРЕНИРОВОК...",
    fr: "CHARGEMENT DES ENTRAÎNEMENTS...",
    de: "TRAININGS WERDEN GELADEN...",
    pt: "CARREGANDO TREINOS...",
    bg: "ЗАРЕЖДАНЕ НА ТРЕНИРОВКИ...",
  },

  "coachDashboard.noWorkouts": {
    en: "NO WORKOUTS YET",
    es: "AÚN NO HAY ENTRENAMIENTOS",
    uk: "ТРЕНУВАНЬ ЩЕ НЕМАЄ",
    ru: "ТРЕНИРОВОК ПОКА НЕТ",
    fr: "PAS ENCORE D’ENTRAÎNEMENTS",
    de: "NOCH KEINE TRAININGS",
    pt: "AINDA SEM TREINOS",
    bg: "ВСЕ ОЩЕ НЯМА ТРЕНИРОВКИ",
  },

  "coachDashboard.workoutsEmpty": {
    en: "Your coach workouts will appear here.",
    es: "Tus entrenamientos aparecerán aquí.",
    uk: "Твої тренування з’являться тут.",
    ru: "Твои тренировки появятся здесь.",
    fr: "Tes entraînements apparaîtront ici.",
    de: "Deine Trainings erscheinen hier.",
    pt: "Seus treinos aparecerão aqui.",
    bg: "Твоите тренировки ще се показват тук.",
  },

  "coachDashboard.workoutNumber": {
    en: "WORKOUT",
    es: "ENTRENAMIENTO",
    uk: "ТРЕНУВАННЯ",
    ru: "ТРЕНИРОВКА",
    fr: "ENTRAÎNEMENT",
    de: "TRAINING",
    pt: "TREINO",
    bg: "ТРЕНИРОВКА",
  },

  "coachDashboard.standard": {
    en: "STANDARD",
    es: "ESTÁNDAR",
    uk: "СТАНДАРТ",
    ru: "СТАНДАРТ",
    fr: "STANDARD",
    de: "STANDARD",
    pt: "PADRÃO",
    bg: "СТАНДАРТ",
  },

  "coachDashboard.min": {
    en: "MIN",
    es: "MIN",
    uk: "ХВ",
    ru: "МИН",
    fr: "MIN",
    de: "MIN",
    pt: "MIN",
    bg: "МИН",
  },

  "coachDashboard.rest": {
    en: "REST",
    es: "DESCANSO",
    uk: "ВІДПОЧИНОК",
    ru: "ОТДЫХ",
    fr: "REPOS",
    de: "PAUSE",
    pt: "DESCANSO",
    bg: "ПОЧИВКА",
  },

  "coachDashboard.myClients": {
    en: "MY CLIENTS",
    es: "MIS CLIENTES",
    uk: "МОЇ КЛІЄНТИ",
    ru: "МОИ КЛИЕНТЫ",
    fr: "MES CLIENTS",
    de: "MEINE KUNDEN",
    pt: "MEUS CLIENTES",
    bg: "МОИТЕ КЛИЕНТИ",
  },

  "coachDashboard.athletesUnder": {
    en: "ATHLETES UNDER YOUR COACHING",
    es: "ATLETAS BAJO TU ENTRENAMIENTO",
    uk: "АТЛЕТИ ПІД ТВОЇМ СУПРОВОДОМ",
    ru: "АТЛЕТЫ ПОД ТВОИМ СОПРОВОЖДЕНИЕМ",
    fr: "ATHLÈTES SOUS TON COACHING",
    de: "ATHLETEN UNTER DEINEM COACHING",
    pt: "ATLETAS SOB SEU ACOMPANHAMENTO",
    bg: "АТЛЕТИ ПОД ТВОЕ РЪКОВОДСТВО",
  },

  "coachDashboard.activeAthletes": {
    en: "ACTIVE ATHLETES",
    es: "ATLETAS ACTIVOS",
    uk: "АКТИВНІ АТЛЕТИ",
    ru: "АКТИВНЫЕ АТЛЕТЫ",
    fr: "ATHLÈTES ACTIFS",
    de: "AKTIVE ATHLETEN",
    pt: "ATLETAS ATIVOS",
    bg: "АКТИВНИ АТЛЕТИ",
  },

  "coachDashboard.totalWorkouts": {
    en: "TOTAL WORKOUTS",
    es: "ENTRENAMIENTOS TOTALES",
    uk: "ВСЬОГО ТРЕНУВАНЬ",
    ru: "ВСЕГО ТРЕНИРОВОК",
    fr: "TOTAL DES ENTRAÎNEMENTS",
    de: "TRAININGS GESAMT",
    pt: "TOTAL DE TREINOS",
    bg: "ОБЩО ТРЕНИРОВКИ",
  },

  "coachDashboard.loadingAthletes": {
    en: "LOADING ATHLETES...",
    es: "CARGANDO ATLETAS...",
    uk: "ЗАВАНТАЖЕННЯ АТЛЕТІВ...",
    ru: "ЗАГРУЗКА АТЛЕТОВ...",
    fr: "CHARGEMENT DES ATHLÈTES...",
    de: "ATHLETEN WERDEN GELADEN...",
    pt: "CARREGANDO ATLETAS...",
    bg: "ЗАРЕЖДАНЕ НА АТЛЕТИ...",
  },

  "coachDashboard.athleteRoster": {
    en: "ATHLETE ROSTER",
    es: "LISTA DE ATLETAS",
    uk: "СПИСОК АТЛЕТІВ",
    ru: "СПИСОК АТЛЕТОВ",
    fr: "LISTE DES ATHLÈTES",
    de: "ATHLETENLISTE",
    pt: "LISTA DE ATLETAS",
    bg: "СПИСЪК С АТЛЕТИ",
  },

  "coachDashboard.athletesEmpty": {
    en: "Assigned athletes will appear here.",
    es: "Los atletas asignados aparecerán aquí.",
    uk: "Призначені атлети з’являться тут.",
    ru: "Назначенные атлеты появятся здесь.",
    fr: "Les athlètes assignés apparaîtront ici.",
    de: "Zugewiesene Athleten erscheinen hier.",
    pt: "Os atletas atribuídos aparecerão aqui.",
    bg: "Назначените атлети ще се показват тук.",
  },

  "coachDashboard.age": {
    en: "AGE",
    es: "EDAD",
    uk: "ВІК",
    ru: "ВОЗРАСТ",
    fr: "ÂGE",
    de: "ALTER",
    pt: "IDADE",
    bg: "ВЪЗРАСТ",
  },

  "coachDashboard.height": {
    en: "HEIGHT",
    es: "ALTURA",
    uk: "ЗРІСТ",
    ru: "РОСТ",
    fr: "TAILLE",
    de: "GRÖSSE",
    pt: "ALTURA",
    bg: "РЪСТ",
  },

  "coachDashboard.viewResults": {
    en: "VIEW RESULTS",
    es: "VER RESULTADOS",
    uk: "ПЕРЕГЛЯНУТИ РЕЗУЛЬТАТИ",
    ru: "ПОСМОТРЕТЬ РЕЗУЛЬТАТЫ",
    fr: "VOIR LES RÉSULTATS",
    de: "ERGEBNISSE ANZEIGEN",
    pt: "VER RESULTADOS",
    bg: "ВИЖ РЕЗУЛТАТИТЕ",
  },

  "coachDashboard.professional": {
    en: "IRONAGE PROFESSIONAL",
    es: "PROFESIONAL IRONAGE",
    uk: "ПРОФЕСІЙНИЙ IRONAGE",
    ru: "ПРОФЕССИОНАЛ IRONAGE",
    fr: "PROFESSIONNEL IRONAGE",
    de: "IRONAGE PROFESSIONAL",
    pt: "PROFISSIONAL IRONAGE",
    bg: "IRONAGE ПРОФЕСИОНАЛИСТ",
  },

  "coachDashboard.system": {
    en: "COACH SYSTEM",
    es: "SISTEMA DE ENTRENADOR",
    uk: "СИСТЕМА ТРЕНЕРА",
    ru: "СИСТЕМА ТРЕНЕРА",
    fr: "SYSTÈME COACH",
    de: "COACH-SYSTEM",
    pt: "SISTEMA DO TREINADOR",
    bg: "СИСТЕМА ЗА ТРЕНЬОРИ",
  },

  "coachDashboard.buildAthletes": {
    en: "BUILD ATHLETES. TRACK RESULTS.",
    es: "FORMA ATLETAS. SIGUE RESULTADOS.",
    uk: "РОЗВИВАЙ АТЛЕТІВ. ВІДСТЕЖУЙ РЕЗУЛЬТАТИ.",
    ru: "РАЗВИВАЙ АТЛЕТОВ. ОТСЛЕЖИВАЙ РЕЗУЛЬТАТЫ.",
    fr: "FORME DES ATHLÈTES. SUIS LES RÉSULTATS.",
    de: "ENTWICKLE ATHLETEN. VERFOLGE ERGEBNISSE.",
    pt: "DESENVOLVA ATLETAS. ACOMPANHE RESULTADOS.",
    bg: "РАЗВИВАЙ АТЛЕТИ. СЛЕДИ РЕЗУЛТАТИТЕ.",
  },

  "coachDashboard.lead": {
    en: "LEAD.",
    es: "LIDERA.",
    uk: "ВЕДИ.",
    ru: "ВЕДИ.",
    fr: "DIRIGE.",
    de: "FÜHRE.",
    pt: "LIDERE.",
    bg: "ВОДИ.",
  },

  "coachDashboard.programVerb": {
    en: "PROGRAM.",
    es: "PROGRAMA.",
    uk: "ПЛАНУЙ.",
    ru: "ПЛАНИРУЙ.",
    fr: "PROGRAMME.",
    de: "PLANE.",
    pt: "PROGRAME.",
    bg: "ПЛАНИРАЙ.",
  },

  "coachDashboard.transform": {
    en: "TRANSFORM.",
    es: "TRANSFORMA.",
    uk: "ТРАНСФОРМУЙ.",
    ru: "ТРАНСФОРМИРУЙ.",
    fr: "TRANSFORME.",
    de: "VERÄNDERE.",
    pt: "TRANSFORME.",
    bg: "ТРАНСФОРМИРАЙ.",
  },

  "coachDashboard.heroDescription": {
    en: "Manage your athletes, create workouts and build complete training programs.",
    es: "Gestiona tus atletas, crea entrenamientos y desarrolla programas completos.",
    uk: "Керуй атлетами, створюй тренування та повні тренувальні програми.",
    ru: "Управляй атлетами, создавай тренировки и полноценные программы.",
    fr: "Gère tes athlètes, crée des entraînements et construis des programmes complets.",
    de: "Verwalte deine Athleten, erstelle Trainings und vollständige Programme.",
    pt: "Gerencie seus atletas, crie treinos e programas completos.",
    bg: "Управлявай атлетите, създавай тренировки и пълни програми.",
  },

  "coachDashboard.tools": {
    en: "COACH TOOLS",
    es: "HERRAMIENTAS DEL ENTRENADOR",
    uk: "ІНСТРУМЕНТИ ТРЕНЕРА",
    ru: "ИНСТРУМЕНТЫ ТРЕНЕРА",
    fr: "OUTILS DU COACH",
    de: "COACH-WERKZEUGE",
    pt: "FERRAMENTAS DO TREINADOR",
    bg: "ИНСТРУМЕНТИ ЗА ТРЕНЬОРА",
  },

  "coachDashboard.athletes": {
    en: "ATHLETES",
    es: "ATLETAS",
    uk: "АТЛЕТИ",
    ru: "АТЛЕТЫ",
    fr: "ATHLÈTES",
    de: "ATHLETEN",
    pt: "ATLETAS",
    bg: "АТЛЕТИ",
  },

  "coachDashboard.clientsDescription": {
    en: "Manage assigned athletes and monitor progress.",
    es: "Gestiona atletas asignados y controla su progreso.",
    uk: "Керуй призначеними атлетами та відстежуй їхній прогрес.",
    ru: "Управляй назначенными атлетами и отслеживай их прогресс.",
    fr: "Gère les athlètes assignés et suis leur progression.",
    de: "Verwalte zugewiesene Athleten und überwache ihren Fortschritt.",
    pt: "Gerencie atletas atribuídos e acompanhe o progresso.",
    bg: "Управлявай назначените атлети и следи прогреса им.",
  },

  "coachDashboard.training": {
    en: "TRAINING",
    es: "ENTRENAMIENTO",
    uk: "ТРЕНУВАННЯ",
    ru: "ТРЕНИРОВКИ",
    fr: "ENTRAÎNEMENT",
    de: "TRAINING",
    pt: "TREINO",
    bg: "ТРЕНИРОВКИ",
  },

  "coachDashboard.workoutsDescription": {
    en: "Build workouts from the IRONAGE exercise library.",
    es: "Crea entrenamientos con la biblioteca de ejercicios IRONAGE.",
    uk: "Створюй тренування з бібліотеки вправ IRONAGE.",
    ru: "Создавай тренировки из библиотеки упражнений IRONAGE.",
    fr: "Crée des entraînements depuis la bibliothèque IRONAGE.",
    de: "Erstelle Trainings aus der IRONAGE-Übungsbibliothek.",
    pt: "Crie treinos usando a biblioteca de exercícios IRONAGE.",
    bg: "Създавай тренировки от библиотеката с упражнения IRONAGE.",
  },

  "coachDashboard.programming": {
    en: "PROGRAMMING",
    es: "PROGRAMACIÓN",
    uk: "ПРОГРАМУВАННЯ",
    ru: "ПРОГРАММИРОВАНИЕ",
    fr: "PROGRAMMATION",
    de: "PROGRAMMPLANUNG",
    pt: "PROGRAMAÇÃO",
    bg: "ПРОГРАМИРАНЕ",
  },

  "coachDashboard.programsDescription": {
    en: "Create programs and assign them to your clients.",
    es: "Crea programas y asígnalos a tus clientes.",
    uk: "Створюй програми та призначай їх своїм клієнтам.",
    ru: "Создавай программы и назначай их своим клиентам.",
    fr: "Crée des programmes et attribue-les à tes clients.",
    de: "Erstelle Programme und weise sie deinen Kunden zu.",
    pt: "Crie programas e atribua-os aos seus clientes.",
    bg: "Създавай програми и ги задавай на клиентите си.",
  },

  "coachDashboard.profile": {
    en: "PROFILE",
    es: "PERFIL",
    uk: "ПРОФІЛЬ",
    ru: "ПРОФИЛЬ",
    fr: "PROFIL",
    de: "PROFIL",
    pt: "PERFIL",
    bg: "ПРОФИЛ",
  },

  "coachDashboard.editProfile": {
    en: "EDIT PROFILE",
    es: "EDITAR PERFIL",
    uk: "РЕДАГУВАТИ ПРОФІЛЬ",
    ru: "РЕДАКТИРОВАТЬ ПРОФИЛЬ",
    fr: "MODIFIER LE PROFIL",
    de: "PROFIL BEARBEITEN",
    pt: "EDITAR PERFIL",
    bg: "РЕДАКТИРАЙ ПРОФИЛА",
  },

  "coachDashboard.profileDescription": {
    en: "Update your coach name, specialization, bio and photo.",
    es: "Actualiza tu nombre, especialización, biografía y foto.",
    uk: "Онови ім’я тренера, спеціалізацію, опис і фото.",
    ru: "Обнови имя тренера, специализацию, описание и фото.",
    fr: "Mets à jour ton nom, ta spécialisation, ta bio et ta photo.",
    de: "Aktualisiere Coach-Name, Spezialisierung, Bio und Foto.",
    pt: "Atualize seu nome, especialização, bio e foto.",
    bg: "Обнови името, специализацията, описанието и снимката си.",
  },

  "coachDashboard.coachStatus": {
    en: "COACH STATUS",
    es: "ESTADO DEL ENTRENADOR",
    uk: "СТАТУС ТРЕНЕРА",
    ru: "СТАТУС ТРЕНЕРА",
    fr: "STATUT DU COACH",
    de: "COACH-STATUS",
    pt: "STATUS DO TREINADOR",
    bg: "СТАТУС НА ТРЕНЬОРА",
  },

  "coachDashboard.active": {
    en: "ACTIVE",
    es: "ACTIVO",
    uk: "АКТИВНИЙ",
    ru: "АКТИВЕН",
    fr: "ACTIF",
    de: "AKTIV",
    pt: "ATIVO",
    bg: "АКТИВЕН",
  },

  "coachDashboard.failedSubmit": {
    en: "Failed to submit program",
    es: "No se pudo enviar el programa",
    uk: "Не вдалося надіслати програму",
    ru: "Не удалось отправить программу",
    fr: "Impossible d’envoyer le programme",
    de: "Programm konnte nicht gesendet werden",
    pt: "Não foi possível enviar o programa",
    bg: "Програмата не можа да бъде изпратена",
  },

  "coachDashboard.failedAssign": {
    en: "Failed to assign program",
    es: "No se pudo asignar el programa",
    uk: "Не вдалося призначити програму",
    ru: "Не удалось назначить программу",
    fr: "Impossible d’attribuer le programme",
    de: "Programm konnte nicht zugewiesen werden",
    pt: "Não foi possível atribuir o programa",
    bg: "Програмата не можа да бъде зададена",
  },

  "coachDashboard.failedClients": {
    en: "Failed to load clients",
    es: "No se pudieron cargar los clientes",
    uk: "Не вдалося завантажити клієнтів",
    ru: "Не удалось загрузить клиентов",
    fr: "Impossible de charger les clients",
    de: "Kunden konnten nicht geladen werden",
    pt: "Não foi possível carregar os clientes",
    bg: "Клиентите не можаха да бъдат заредени",
  },

  "coachDashboard.failedResults": {
    en: "Failed to load client results",
    es: "No se pudieron cargar los resultados",
    uk: "Не вдалося завантажити результати клієнта",
    ru: "Не удалось загрузить результаты клиента",
    fr: "Impossible de charger les résultats du client",
    de: "Kundenergebnisse konnten nicht geladen werden",
    pt: "Não foi possível carregar os resultados do cliente",
    bg: "Резултатите на клиента не можаха да бъдат заредени",
  },

  "coachDashboard.failedWorkouts": {
    en: "Failed to load workouts",
    es: "No se pudieron cargar los entrenamientos",
    uk: "Не вдалося завантажити тренування",
    ru: "Не удалось загрузить тренировки",
    fr: "Impossible de charger les entraînements",
    de: "Trainings konnten nicht geladen werden",
    pt: "Não foi possível carregar os treinos",
    bg: "Тренировките не можаха да бъдат заредени",
  },

  "coachDashboard.failedPrograms": {
    en: "Failed to load programs",
    es: "No se pudieron cargar los programas",
    uk: "Не вдалося завантажити програми",
    ru: "Не удалось загрузить программы",
    fr: "Impossible de charger les programmes",
    de: "Programme konnten nicht geladen werden",
    pt: "Não foi possível carregar os programas",
    bg: "Програмите не можаха да бъдат заредени",
  },

  /* =====================================================
     CREATE WORKOUT
  ===================================================== */

  "createWorkout.back": {
    en: "Back to workouts",
    es: "Volver a entrenamientos",
    uk: "Назад до тренувань",
    ru: "Назад к тренировкам",
    fr: "Retour aux entraînements",
    de: "Zurück zu Trainings",
    pt: "Voltar aos treinos",
    bg: "Назад към тренировките",
  },

  "createWorkout.coach": {
    en: "IRONAGE COACH",
    es: "ENTRENADOR IRONAGE",
    uk: "ТРЕНЕР IRONAGE",
    ru: "ТРЕНЕР IRONAGE",
    fr: "COACH IRONAGE",
    de: "IRONAGE COACH",
    pt: "TREINADOR IRONAGE",
    bg: "ТРЕНЬОР IRONAGE",
  },

  "createWorkout.title": {
    en: "CREATE WORKOUT",
    es: "CREAR ENTRENAMIENTO",
    uk: "СТВОРИТИ ТРЕНУВАННЯ",
    ru: "СОЗДАТЬ ТРЕНИРОВКУ",
    fr: "CRÉER UN ENTRAÎNEMENT",
    de: "TRAINING ERSTELLEN",
    pt: "CRIAR TREINO",
    bg: "СЪЗДАЙ ТРЕНИРОВКА",
  },

  "createWorkout.subtitle": {
    en: "BUILD THE SESSION",
    es: "CREA LA SESIÓN",
    uk: "ПОБУДУЙ ТРЕНУВАННЯ",
    ru: "СОЗДАЙ ТРЕНИРОВКУ",
    fr: "CRÉE LA SÉANCE",
    de: "TRAINING AUFBAUEN",
    pt: "MONTE A SESSÃO",
    bg: "ИЗГРАДИ ТРЕНИРОВКАТА",
  },

  "createWorkout.details": {
    en: "WORKOUT DETAILS",
    es: "DETALLES DEL ENTRENAMIENTO",
    uk: "ДЕТАЛІ ТРЕНУВАННЯ",
    ru: "ДЕТАЛИ ТРЕНИРОВКИ",
    fr: "DÉTAILS DE L’ENTRAÎNEMENT",
    de: "TRAININGSDETAILS",
    pt: "DETALHES DO TREINO",
    bg: "ДЕТАЙЛИ ЗА ТРЕНИРОВКАТА",
  },

  "createWorkout.defineSession": {
    en: "DEFINE THE SESSION",
    es: "DEFINE LA SESIÓN",
    uk: "НАЛАШТУЙ СЕСІЮ",
    ru: "НАСТРОЙ СЕССИЮ",
    fr: "DÉFINIS LA SÉANCE",
    de: "SESSION DEFINIEREN",
    pt: "DEFINA A SESSÃO",
    bg: "ОПРЕДЕЛИ СЕСИЯТА",
  },

  "createWorkout.name": {
    en: "WORKOUT NAME",
    es: "NOMBRE DEL ENTRENAMIENTO",
    uk: "НАЗВА ТРЕНУВАННЯ",
    ru: "НАЗВАНИЕ ТРЕНИРОВКИ",
    fr: "NOM DE L’ENTRAÎNEMENT",
    de: "TRAININGSNAME",
    pt: "NOME DO TREINO",
    bg: "ИМЕ НА ТРЕНИРОВКАТА",
  },

  "createWorkout.namePlaceholder": {
    en: "PUSH DAY",
    es: "DÍA DE EMPUJE",
    uk: "ДЕНЬ ЖИМІВ",
    ru: "ДЕНЬ ЖИМОВ",
    fr: "JOUR PUSH",
    de: "PUSH-TAG",
    pt: "DIA DE PUSH",
    bg: "ДЕН ЗА ИЗБУТВАНЕ",
  },

  "createWorkout.description": {
    en: "DESCRIPTION",
    es: "DESCRIPCIÓN",
    uk: "ОПИС",
    ru: "ОПИСАНИЕ",
    fr: "DESCRIPTION",
    de: "BESCHREIBUNG",
    pt: "DESCRIÇÃO",
    bg: "ОПИСАНИЕ",
  },

  "createWorkout.descriptionPlaceholder": {
    en: "Chest, shoulders and triceps...",
    es: "Pecho, hombros y tríceps...",
    uk: "Груди, плечі та трицепс...",
    ru: "Грудь, плечи и трицепс...",
    fr: "Pectoraux, épaules et triceps...",
    de: "Brust, Schultern und Trizeps...",
    pt: "Peito, ombros e tríceps...",
    bg: "Гърди, рамене и трицепс...",
  },

  "createWorkout.duration": {
    en: "DURATION / MIN",
    es: "DURACIÓN / MIN",
    uk: "ТРИВАЛІСТЬ / ХВ",
    ru: "ДЛИТЕЛЬНОСТЬ / МИН",
    fr: "DURÉE / MIN",
    de: "DAUER / MIN",
    pt: "DURAÇÃO / MIN",
    bg: "ПРОДЪЛЖИТЕЛНОСТ / МИН",
  },

  "createWorkout.difficulty": {
    en: "DIFFICULTY",
    es: "DIFICULTAD",
    uk: "СКЛАДНІСТЬ",
    ru: "СЛОЖНОСТЬ",
    fr: "DIFFICULTÉ",
    de: "SCHWIERIGKEIT",
    pt: "DIFICULDADE",
    bg: "ТРУДНОСТ",
  },

  "createWorkout.beginner": {
    en: "BEGINNER",
    es: "PRINCIPIANTE",
    uk: "ПОЧАТКОВИЙ",
    ru: "НАЧАЛЬНЫЙ",
    fr: "DÉBUTANT",
    de: "ANFÄNGER",
    pt: "INICIANTE",
    bg: "НАЧИНАЕЩ",
  },

  "createWorkout.intermediate": {
    en: "INTERMEDIATE",
    es: "INTERMEDIO",
    uk: "СЕРЕДНІЙ",
    ru: "СРЕДНИЙ",
    fr: "INTERMÉDIAIRE",
    de: "MITTEL",
    pt: "INTERMEDIÁRIO",
    bg: "СРЕДНО НИВО",
  },

  "createWorkout.advanced": {
    en: "ADVANCED",
    es: "AVANZADO",
    uk: "ПРОСУНУТИЙ",
    ru: "ПРОДВИНУТЫЙ",
    fr: "AVANCÉ",
    de: "FORTGESCHRITTEN",
    pt: "AVANÇADO",
    bg: "НАПРЕДНАЛ",
  },

  "createWorkout.exerciseLibrary": {
    en: "EXERCISE LIBRARY",
    es: "BIBLIOTECA DE EJERCICIOS",
    uk: "БІБЛІОТЕКА ВПРАВ",
    ru: "БИБЛИОТЕКА УПРАЖНЕНИЙ",
    fr: "BIBLIOTHÈQUE D’EXERCICES",
    de: "ÜBUNGSBIBLIOTHEK",
    pt: "BIBLIOTECA DE EXERCÍCIOS",
    bg: "БИБЛИОТЕКА С УПРАЖНЕНИЯ",
  },

  "createWorkout.selectMovements": {
    en: "SELECT MOVEMENTS",
    es: "SELECCIONA MOVIMIENTOS",
    uk: "ОБЕРИ ВПРАВИ",
    ru: "ВЫБЕРИ УПРАЖНЕНИЯ",
    fr: "SÉLECTIONNE LES MOUVEMENTS",
    de: "ÜBUNGEN AUSWÄHLEN",
    pt: "SELECIONE OS MOVIMENTOS",
    bg: "ИЗБЕРИ УПРАЖНЕНИЯ",
  },

  "createWorkout.loadingExercises": {
    en: "LOADING EXERCISES...",
    es: "CARGANDO EJERCICIOS...",
    uk: "ЗАВАНТАЖЕННЯ ВПРАВ...",
    ru: "ЗАГРУЗКА УПРАЖНЕНИЙ...",
    fr: "CHARGEMENT DES EXERCICES...",
    de: "ÜBUNGEN WERDEN GELADEN...",
    pt: "CARREGANDO EXERCÍCIOS...",
    bg: "ЗАРЕЖДАНЕ НА УПРАЖНЕНИЯ...",
  },

  "createWorkout.failedLoad": {
    en: "Failed to load exercises",
    es: "No se pudieron cargar los ejercicios",
    uk: "Не вдалося завантажити вправи",
    ru: "Не удалось загрузить упражнения",
    fr: "Impossible de charger les exercices",
    de: "Übungen konnten nicht geladen werden",
    pt: "Não foi possível carregar os exercícios",
    bg: "Упражненията не можаха да бъдат заредени",
  },

  "createWorkout.exercise": {
    en: "EXERCISE",
    es: "EJERCICIO",
    uk: "ВПРАВА",
    ru: "УПРАЖНЕНИЕ",
    fr: "EXERCICE",
    de: "ÜBUNG",
    pt: "EXERCÍCIO",
    bg: "УПРАЖНЕНИЕ",
  },

  "createWorkout.noEquipment": {
    en: "NO EQUIPMENT",
    es: "SIN EQUIPO",
    uk: "БЕЗ ОБЛАДНАННЯ",
    ru: "БЕЗ ОБОРУДОВАНИЯ",
    fr: "SANS ÉQUIPEMENT",
    de: "OHNE AUSRÜSTUNG",
    pt: "SEM EQUIPAMENTO",
    bg: "БЕЗ ОБОРУДВАНЕ",
  },

  "createWorkout.plan": {
    en: "WORKOUT PLAN",
    es: "PLAN DE ENTRENAMIENTO",
    uk: "ПЛАН ТРЕНУВАННЯ",
    ru: "ПЛАН ТРЕНИРОВКИ",
    fr: "PLAN D’ENTRAÎNEMENT",
    de: "TRAININGSPLAN",
    pt: "PLANO DE TREINO",
    bg: "ПЛАН НА ТРЕНИРОВКАТА",
  },

  "createWorkout.targets": {
    en: "SET TRAINING TARGETS",
    es: "DEFINE LOS OBJETIVOS",
    uk: "ВСТАНОВИ ПАРАМЕТРИ",
    ru: "ЗАДАЙ ПАРАМЕТРЫ",
    fr: "DÉFINIS LES OBJECTIFS",
    de: "TRAININGSZIELE FESTLEGEN",
    pt: "DEFINA OS OBJETIVOS",
    bg: "ЗАДАЙ ТРЕНИРОВЪЧНИ ЦЕЛИ",
  },

  "createWorkout.sets": {
    en: "SETS",
    es: "SERIES",
    uk: "ПІДХОДИ",
    ru: "ПОДХОДЫ",
    fr: "SÉRIES",
    de: "SÄTZE",
    pt: "SÉRIES",
    bg: "СЕРИИ",
  },

  "createWorkout.reps": {
    en: "REPS",
    es: "REPS",
    uk: "ПОВТОРИ",
    ru: "ПОВТОРЫ",
    fr: "RÉP.",
    de: "WDH.",
    pt: "REPS",
    bg: "ПОВТ.",
  },

  "createWorkout.rest": {
    en: "REST / SEC",
    es: "DESCANSO / SEG",
    uk: "ВІДПОЧИНОК / СЕК",
    ru: "ОТДЫХ / СЕК",
    fr: "REPOS / SEC",
    de: "PAUSE / SEK",
    pt: "DESCANSO / SEG",
    bg: "ПОЧИВКА / СЕК",
  },

  "createWorkout.targetWeight": {
    en: "TARGET WEIGHT / KG",
    es: "PESO OBJETIVO / KG",
    uk: "ЦІЛЬОВА ВАГА / КГ",
    ru: "ЦЕЛЕВОЙ ВЕС / КГ",
    fr: "POIDS CIBLE / KG",
    de: "ZIELGEWICHT / KG",
    pt: "PESO ALVO / KG",
    bg: "ЦЕЛЕВО ТЕГЛО / КГ",
  },

  "createWorkout.optional": {
    en: "OPTIONAL",
    es: "OPCIONAL",
    uk: "НЕОБОВ’ЯЗКОВО",
    ru: "НЕОБЯЗАТЕЛЬНО",
    fr: "FACULTATIF",
    de: "OPTIONAL",
    pt: "OPCIONAL",
    bg: "ПО ЖЕЛАНИЕ",
  },

  "createWorkout.coachNotes": {
    en: "COACH NOTES",
    es: "NOTAS DEL ENTRENADOR",
    uk: "НОТАТКИ ТРЕНЕРА",
    ru: "ЗАМЕТКИ ТРЕНЕРА",
    fr: "NOTES DU COACH",
    de: "COACH-NOTIZEN",
    pt: "NOTAS DO TREINADOR",
    bg: "БЕЛЕЖКИ НА ТРЕНЬОРА",
  },

  "createWorkout.notesPlaceholder": {
    en: "Technique, tempo, intensity...",
    es: "Técnica, tempo, intensidad...",
    uk: "Техніка, темп, інтенсивність...",
    ru: "Техника, темп, интенсивность...",
    fr: "Technique, tempo, intensité...",
    de: "Technik, Tempo, Intensität...",
    pt: "Técnica, ritmo, intensidade...",
    bg: "Техника, темпо, интензивност...",
  },

  "createWorkout.remove": {
    en: "Remove",
    es: "Eliminar",
    uk: "Видалити",
    ru: "Удалить",
    fr: "Supprimer",
    de: "Entfernen",
    pt: "Remover",
    bg: "Премахни",
  },

  "createWorkout.nameRequired": {
    en: "Workout name is required.",
    es: "El nombre del entrenamiento es obligatorio.",
    uk: "Назва тренування обов’язкова.",
    ru: "Название тренировки обязательно.",
    fr: "Le nom de l’entraînement est obligatoire.",
    de: "Der Trainingsname ist erforderlich.",
    pt: "O nome do treino é obrigatório.",
    bg: "Името на тренировката е задължително.",
  },

  "createWorkout.addExercise": {
    en: "Add at least one exercise.",
    es: "Añade al menos un ejercicio.",
    uk: "Додай хоча б одну вправу.",
    ru: "Добавь хотя бы одно упражнение.",
    fr: "Ajoute au moins un exercice.",
    de: "Füge mindestens eine Übung hinzu.",
    pt: "Adicione pelo menos um exercício.",
    bg: "Добави поне едно упражнение.",
  },

  "createWorkout.notCreated": {
    en: "Workout was not created",
    es: "El entrenamiento no fue creado",
    uk: "Тренування не було створено",
    ru: "Тренировка не была создана",
    fr: "L’entraînement n’a pas été créé",
    de: "Training wurde nicht erstellt",
    pt: "O treino não foi criado",
    bg: "Тренировката не беше създадена",
  },

  "createWorkout.failedCreate": {
    en: "Failed to create workout",
    es: "No se pudo crear el entrenamiento",
    uk: "Не вдалося створити тренування",
    ru: "Не удалось создать тренировку",
    fr: "Impossible de créer l’entraînement",
    de: "Training konnte nicht erstellt werden",
    pt: "Não foi possível criar o treino",
    bg: "Тренировката не можа да бъде създадена",
  },

  "createWorkout.saving": {
    en: "SAVING...",
    es: "GUARDANDO...",
    uk: "ЗБЕРЕЖЕННЯ...",
    ru: "СОХРАНЕНИЕ...",
    fr: "ENREGISTREMENT...",
    de: "WIRD GESPEICHERT...",
    pt: "SALVANDO...",
    bg: "ЗАПАЗВАНЕ...",
  },

  "createWorkout.save": {
    en: "SAVE WORKOUT",
    es: "GUARDAR ENTRENAMIENTO",
    uk: "ЗБЕРЕГТИ ТРЕНУВАННЯ",
    ru: "СОХРАНИТЬ ТРЕНИРОВКУ",
    fr: "ENREGISTRER L’ENTRAÎNEMENT",
    de: "TRAINING SPEICHERN",
    pt: "SALVAR TREINO",
    bg: "ЗАПАЗИ ТРЕНИРОВКАТА",
  },

  /* =====================================================
     CREATE PROGRAM
  ===================================================== */

  "createProgram.back": {
    en: "Back to programs",
    es: "Volver a programas",
    uk: "Назад до програм",
    ru: "Назад к программам",
    fr: "Retour aux programmes",
    de: "Zurück zu Programmen",
    pt: "Voltar aos programas",
    bg: "Назад към програмите",
  },

  "createProgram.coach": {
    en: "IRONAGE COACH",
    es: "ENTRENADOR IRONAGE",
    uk: "ТРЕНЕР IRONAGE",
    ru: "ТРЕНЕР IRONAGE",
    fr: "COACH IRONAGE",
    de: "IRONAGE COACH",
    pt: "TREINADOR IRONAGE",
    bg: "ТРЕНЬОР IRONAGE",
  },

  "createProgram.title": {
    en: "CREATE PROGRAM",
    es: "CREAR PROGRAMA",
    uk: "СТВОРИТИ ПРОГРАМУ",
    ru: "СОЗДАТЬ ПРОГРАММУ",
    fr: "CRÉER UN PROGRAMME",
    de: "PROGRAMM ERSTELLEN",
    pt: "CRIAR PROGRAMA",
    bg: "СЪЗДАЙ ПРОГРАМА",
  },

  "createProgram.subtitle": {
    en: "BUILD THE SYSTEM",
    es: "CONSTRUYE EL SISTEMA",
    uk: "ПОБУДУЙ СИСТЕМУ",
    ru: "ПОСТРОЙ СИСТЕМУ",
    fr: "CONSTRUIS LE SYSTÈME",
    de: "SYSTEM AUFBAUEN",
    pt: "CONSTRUA O SISTEMA",
    bg: "ИЗГРАДИ СИСТЕМАТА",
  },

  "createProgram.details": {
    en: "PROGRAM DETAILS",
    es: "DETALLES DEL PROGRAMA",
    uk: "ДЕТАЛІ ПРОГРАМИ",
    ru: "ДЕТАЛИ ПРОГРАММЫ",
    fr: "DÉTAILS DU PROGRAMME",
    de: "PROGRAMMDETAILS",
    pt: "DETALHES DO PROGRAMA",
    bg: "ДЕТАЙЛИ ЗА ПРОГРАМАТА",
  },

  "createProgram.defineGoal": {
    en: "DEFINE THE GOAL",
    es: "DEFINE EL OBJETIVO",
    uk: "ВИЗНАЧ ЦІЛЬ",
    ru: "ОПРЕДЕЛИ ЦЕЛЬ",
    fr: "DÉFINIS L’OBJECTIF",
    de: "ZIEL DEFINIEREN",
    pt: "DEFINA O OBJETIVO",
    bg: "ОПРЕДЕЛИ ЦЕЛТА",
  },

  "createProgram.name": {
    en: "PROGRAM NAME",
    es: "NOMBRE DEL PROGRAMA",
    uk: "НАЗВА ПРОГРАМИ",
    ru: "НАЗВАНИЕ ПРОГРАММЫ",
    fr: "NOM DU PROGRAMME",
    de: "PROGRAMMNAME",
    pt: "NOME DO PROGRAMA",
    bg: "ИМЕ НА ПРОГРАМАТА",
  },

  "createProgram.namePlaceholder": {
    en: "IRONAGE STRENGTH",
    es: "FUERZA IRONAGE",
    uk: "СИЛА IRONAGE",
    ru: "СИЛА IRONAGE",
    fr: "FORCE IRONAGE",
    de: "IRONAGE STRENGTH",
    pt: "FORÇA IRONAGE",
    bg: "IRONAGE СИЛА",
  },

  "createProgram.description": {
    en: "DESCRIPTION",
    es: "DESCRIPCIÓN",
    uk: "ОПИС",
    ru: "ОПИСАНИЕ",
    fr: "DESCRIPTION",
    de: "BESCHREIBUNG",
    pt: "DESCRIÇÃO",
    bg: "ОПИСАНИЕ",
  },

  "createProgram.descriptionPlaceholder": {
    en: "Strength and muscle development...",
    es: "Desarrollo de fuerza y masa muscular...",
    uk: "Розвиток сили та м’язової маси...",
    ru: "Развитие силы и мышечной массы...",
    fr: "Développement de la force et de la masse musculaire...",
    de: "Kraft- und Muskelaufbau...",
    pt: "Desenvolvimento de força e massa muscular...",
    bg: "Развитие на сила и мускулна маса...",
  },

  "createProgram.duration": {
    en: "DURATION",
    es: "DURACIÓN",
    uk: "ТРИВАЛІСТЬ",
    ru: "ДЛИТЕЛЬНОСТЬ",
    fr: "DURÉE",
    de: "DAUER",
    pt: "DURAÇÃO",
    bg: "ПРОДЪЛЖИТЕЛНОСТ",
  },

  "createProgram.weeks": {
    en: "WEEKS",
    es: "SEMANAS",
    uk: "ТИЖНІ",
    ru: "НЕДЕЛИ",
    fr: "SEMAINES",
    de: "WOCHEN",
    pt: "SEMANAS",
    bg: "СЕДМИЦИ",
  },

  "createProgram.myWorkouts": {
    en: "MY WORKOUTS",
    es: "MIS ENTRENAMIENTOS",
    uk: "МОЇ ТРЕНУВАННЯ",
    ru: "МОИ ТРЕНИРОВКИ",
    fr: "MES ENTRAÎNEMENTS",
    de: "MEINE TRAININGS",
    pt: "MEUS TREINOS",
    bg: "МОИТЕ ТРЕНИРОВКИ",
  },

  "createProgram.addSessions": {
    en: "ADD TRAINING SESSIONS",
    es: "AÑADE SESIONES DE ENTRENAMIENTO",
    uk: "ДОДАЙ ТРЕНУВАЛЬНІ СЕСІЇ",
    ru: "ДОБАВЬ ТРЕНИРОВОЧНЫЕ СЕССИИ",
    fr: "AJOUTE DES SÉANCES D’ENTRAÎNEMENT",
    de: "TRAININGSEINHEITEN HINZUFÜGEN",
    pt: "ADICIONE SESSÕES DE TREINO",
    bg: "ДОБАВИ ТРЕНИРОВЪЧНИ СЕСИИ",
  },

  "createProgram.loadingWorkouts": {
    en: "LOADING WORKOUTS...",
    es: "CARGANDO ENTRENAMIENTOS...",
    uk: "ЗАВАНТАЖЕННЯ ТРЕНУВАНЬ...",
    ru: "ЗАГРУЗКА ТРЕНИРОВОК...",
    fr: "CHARGEMENT DES ENTRAÎNEMENTS...",
    de: "TRAININGS WERDEN GELADEN...",
    pt: "CARREGANDO TREINOS...",
    bg: "ЗАРЕЖДАНЕ НА ТРЕНИРОВКИ...",
  },

  "createProgram.noWorkouts": {
    en: "NO WORKOUTS AVAILABLE",
    es: "NO HAY ENTRENAMIENTOS DISPONIBLES",
    uk: "НЕМАЄ ДОСТУПНИХ ТРЕНУВАНЬ",
    ru: "НЕТ ДОСТУПНЫХ ТРЕНИРОВОК",
    fr: "AUCUN ENTRAÎNEMENT DISPONIBLE",
    de: "KEINE TRAININGS VERFÜGBAR",
    pt: "NENHUM TREINO DISPONÍVEL",
    bg: "НЯМА ДОСТЪПНИ ТРЕНИРОВКИ",
  },

  "createProgram.workout": {
    en: "WORKOUT",
    es: "ENTRENAMIENTO",
    uk: "ТРЕНУВАННЯ",
    ru: "ТРЕНИРОВКА",
    fr: "ENTRAÎNEMENT",
    de: "TRAINING",
    pt: "TREINO",
    bg: "ТРЕНИРОВКА",
  },

  "createProgram.min": {
    en: "MIN",
    es: "MIN",
    uk: "ХВ",
    ru: "МИН",
    fr: "MIN",
    de: "MIN",
    pt: "MIN",
    bg: "МИН",
  },

  "createProgram.durationUnavailable": {
    en: "DURATION —",
    es: "DURACIÓN —",
    uk: "ТРИВАЛІСТЬ —",
    ru: "ДЛИТЕЛЬНОСТЬ —",
    fr: "DURÉE —",
    de: "DAUER —",
    pt: "DURAÇÃO —",
    bg: "ПРОДЪЛЖИТЕЛНОСТ —",
  },

  "createProgram.schedule": {
    en: "PROGRAM SCHEDULE",
    es: "HORARIO DEL PROGRAMA",
    uk: "РОЗКЛАД ПРОГРАМИ",
    ru: "РАСПИСАНИЕ ПРОГРАММЫ",
    fr: "PLANNING DU PROGRAMME",
    de: "PROGRAMMPLAN",
    pt: "CRONOGRAMA DO PROGRAMA",
    bg: "ГРАФИК НА ПРОГРАМАТА",
  },

  "createProgram.setWeekDay": {
    en: "SET WEEK AND DAY",
    es: "DEFINE SEMANA Y DÍA",
    uk: "ВСТАНОВИ ТИЖДЕНЬ І ДЕНЬ",
    ru: "ЗАДАЙ НЕДЕЛЮ И ДЕНЬ",
    fr: "DÉFINIS LA SEMAINE ET LE JOUR",
    de: "WOCHE UND TAG FESTLEGEN",
    pt: "DEFINA SEMANA E DIA",
    bg: "ЗАДАЙ СЕДМИЦА И ДЕН",
  },

  "createProgram.position": {
    en: "POSITION",
    es: "POSICIÓN",
    uk: "ПОЗИЦІЯ",
    ru: "ПОЗИЦИЯ",
    fr: "POSITION",
    de: "POSITION",
    pt: "POSIÇÃO",
    bg: "ПОЗИЦИЯ",
  },

  "createProgram.week": {
    en: "WEEK",
    es: "SEMANA",
    uk: "ТИЖДЕНЬ",
    ru: "НЕДЕЛЯ",
    fr: "SEMAINE",
    de: "WOCHE",
    pt: "SEMANA",
    bg: "СЕДМИЦА",
  },

  "createProgram.day": {
    en: "DAY",
    es: "DÍA",
    uk: "ДЕНЬ",
    ru: "ДЕНЬ",
    fr: "JOUR",
    de: "TAG",
    pt: "DIA",
    bg: "ДЕН",
  },

  "createProgram.remove": {
    en: "Remove",
    es: "Eliminar",
    uk: "Видалити",
    ru: "Удалить",
    fr: "Supprimer",
    de: "Entfernen",
    pt: "Remover",
    bg: "Премахни",
  },

  "createProgram.nameRequired": {
    en: "Program name is required.",
    es: "El nombre del programa es obligatorio.",
    uk: "Назва програми обов’язкова.",
    ru: "Название программы обязательно.",
    fr: "Le nom du programme est obligatoire.",
    de: "Der Programmname ist erforderlich.",
    pt: "O nome do programa é obrigatório.",
    bg: "Името на програмата е задължително.",
  },

  "createProgram.addWorkout": {
    en: "Add at least one workout.",
    es: "Añade al menos un entrenamiento.",
    uk: "Додай хоча б одне тренування.",
    ru: "Добавь хотя бы одну тренировку.",
    fr: "Ajoute au moins un entraînement.",
    de: "Füge mindestens ein Training hinzu.",
    pt: "Adicione pelo menos um treino.",
    bg: "Добави поне една тренировка.",
  },

  "createProgram.durationMinimum": {
    en: "Program duration must be at least 1 week.",
    es: "La duración debe ser de al menos 1 semana.",
    uk: "Тривалість програми має бути щонайменше 1 тиждень.",
    ru: "Длительность программы должна быть не менее 1 недели.",
    fr: "La durée du programme doit être d’au moins 1 semaine.",
    de: "Die Programmdauer muss mindestens 1 Woche betragen.",
    pt: "A duração do programa deve ser de pelo menos 1 semana.",
    bg: "Продължителността трябва да е поне 1 седмица.",
  },

  "createProgram.weekBetween": {
    en: "week must be between 1 and",
    es: "la semana debe estar entre 1 y",
    uk: "тиждень має бути від 1 до",
    ru: "неделя должна быть от 1 до",
    fr: "la semaine doit être comprise entre 1 et",
    de: "die Woche muss zwischen 1 und",
    pt: "a semana deve estar entre 1 e",
    bg: "седмицата трябва да е между 1 и",
  },

  "createProgram.dayBetween": {
    en: "day must be between 1 and 7.",
    es: "el día debe estar entre 1 y 7.",
    uk: "день має бути від 1 до 7.",
    ru: "день должен быть от 1 до 7.",
    fr: "le jour doit être compris entre 1 et 7.",
    de: "der Tag muss zwischen 1 und 7 liegen.",
    pt: "o dia deve estar entre 1 e 7.",
    bg: "денят трябва да е между 1 и 7.",
  },

  "createProgram.failedLoad": {
    en: "Failed to load workouts",
    es: "No se pudieron cargar los entrenamientos",
    uk: "Не вдалося завантажити тренування",
    ru: "Не удалось загрузить тренировки",
    fr: "Impossible de charger les entraînements",
    de: "Trainings konnten nicht geladen werden",
    pt: "Não foi possível carregar os treinos",
    bg: "Тренировките не можаха да бъдат заредени",
  },

  "createProgram.notCreated": {
    en: "Program was not created",
    es: "El programa no fue creado",
    uk: "Програму не було створено",
    ru: "Программа не была создана",
    fr: "Le programme n’a pas été créé",
    de: "Programm wurde nicht erstellt",
    pt: "O programa não foi criado",
    bg: "Програмата не беше създадена",
  },

  "createProgram.failedCreate": {
    en: "Failed to create program",
    es: "No se pudo crear el programa",
    uk: "Не вдалося створити програму",
    ru: "Не удалось создать программу",
    fr: "Impossible de créer le programme",
    de: "Programm konnte nicht erstellt werden",
    pt: "Não foi possível criar o programa",
    bg: "Програмата не можа да бъде създадена",
  },

  "createProgram.saving": {
    en: "SAVING...",
    es: "GUARDANDO...",
    uk: "ЗБЕРЕЖЕННЯ...",
    ru: "СОХРАНЕНИЕ...",
    fr: "ENREGISTREMENT...",
    de: "WIRD GESPEICHERT...",
    pt: "SALVANDO...",
    bg: "ЗАПАЗВАНЕ...",
  },

  "createProgram.save": {
    en: "SAVE PROGRAM",
    es: "GUARDAR PROGRAMA",
    uk: "ЗБЕРЕГТИ ПРОГРАМУ",
    ru: "СОХРАНИТЬ ПРОГРАММУ",
    fr: "ENREGISTRER LE PROGRAMME",
    de: "PROGRAMM SPEICHERN",
    pt: "SALVAR PROGRAMA",
    bg: "ЗАПАЗИ ПРОГРАМАТА",
  },

  /* =====================================================
     EDIT PROFILE
  ===================================================== */

  "editProfile.title": {
    en: "EDIT PROFILE",
    es: "EDITAR PERFIL",
    uk: "РЕДАГУВАТИ ПРОФІЛЬ",
    ru: "РЕДАКТИРОВАТЬ ПРОФИЛЬ",
    fr: "MODIFIER LE PROFIL",
    de: "PROFIL BEARBEITEN",
    pt: "EDITAR PERFIL",
    bg: "РЕДАКТИРАНЕ НА ПРОФИЛ",
  },

  "editProfile.subtitle": {
    en: "UPDATE YOUR BODY, GOAL AND PERSONAL DATA",
    es: "ACTUALIZA TUS DATOS, CUERPO Y OBJETIVO",
    uk: "ОНОВИ СВОЇ ДАНІ, ПАРАМЕТРИ ТА ЦІЛЬ",
    ru: "ОБНОВИ СВОИ ДАННЫЕ, ПАРАМЕТРЫ И ЦЕЛЬ",
    fr: "METTEZ À JOUR VOS DONNÉES ET VOTRE OBJECTIF",
    de: "AKTUALISIERE DEINE DATEN UND DEIN ZIEL",
    pt: "ATUALIZE SEUS DADOS, CORPO E OBJETIVO",
    bg: "АКТУАЛИЗИРАЙ ДАННИТЕ, ТЯЛОТО И ЦЕЛТА СИ",
  },

  "editProfile.name": {
    en: "NAME",
    es: "NOMBRE",
    uk: "ІМ’Я",
    ru: "ИМЯ",
    fr: "NOM",
    de: "NAME",
    pt: "NOME",
    bg: "ИМЕ",
  },

  "editProfile.age": {
    en: "AGE",
    es: "EDAD",
    uk: "ВІК",
    ru: "ВОЗРАСТ",
    fr: "ÂGE",
    de: "ALTER",
    pt: "IDADE",
    bg: "ВЪЗРАСТ",
  },

  "editProfile.gender": {
    en: "GENDER",
    es: "GÉNERO",
    uk: "СТАТЬ",
    ru: "ПОЛ",
    fr: "SEXE",
    de: "GESCHLECHT",
    pt: "GÊNERO",
    bg: "ПОЛ",
  },

  "editProfile.genderMale": {
    en: "MALE",
    es: "HOMBRE",
    uk: "ЧОЛОВІК",
    ru: "МУЖЧИНА",
    fr: "HOMME",
    de: "MÄNNLICH",
    pt: "HOMEM",
    bg: "МЪЖ",
  },

  "editProfile.genderFemale": {
    en: "FEMALE",
    es: "MUJER",
    uk: "ЖІНКА",
    ru: "ЖЕНЩИНА",
    fr: "FEMME",
    de: "WEIBLICH",
    pt: "MULHER",
    bg: "ЖЕНА",
  },

  "editProfile.genderOther": {
    en: "OTHER",
    es: "OTRO",
    uk: "ІНШЕ",
    ru: "ДРУГОЕ",
    fr: "AUTRE",
    de: "ANDERE",
    pt: "OUTRO",
    bg: "ДРУГО",
  },

  "editProfile.height": {
    en: "HEIGHT",
    es: "ALTURA",
    uk: "ЗРІСТ",
    ru: "РОСТ",
    fr: "TAILLE",
    de: "GRÖSSE",
    pt: "ALTURA",
    bg: "РЪСТ",
  },

  "editProfile.weight": {
    en: "WEIGHT",
    es: "PESO",
    uk: "ВАГА",
    ru: "ВЕС",
    fr: "POIDS",
    de: "GEWICHT",
    pt: "PESO",
    bg: "ТЕГЛО",
  },

  "editProfile.goal": {
    en: "CURRENT GOAL",
    es: "OBJETIVO ACTUAL",
    uk: "ПОТОЧНА ЦІЛЬ",
    ru: "ТЕКУЩАЯ ЦЕЛЬ",
    fr: "OBJECTIF ACTUEL",
    de: "AKTUELLES ZIEL",
    pt: "OBJETIVO ATUAL",
    bg: "ТЕКУЩА ЦЕЛ",
  },

  "editProfile.goalMuscle": {
    en: "BUILD MUSCLE",
    es: "GANAR MÚSCULO",
    uk: "НАБРАТИ М’ЯЗИ",
    ru: "НАБРАТЬ МЫШЦЫ",
    fr: "PRENDRE DU MUSCLE",
    de: "MUSKELAUFBAU",
    pt: "GANHAR MÚSCULO",
    bg: "МУСКУЛНА МАСА",
  },

  "editProfile.goalLoseWeight": {
    en: "LOSE WEIGHT",
    es: "PERDER PESO",
    uk: "СХУДНУТИ",
    ru: "ПОХУДЕТЬ",
    fr: "PERDRE DU POIDS",
    de: "ABNEHMEN",
    pt: "PERDER PESO",
    bg: "ОТСЛАБВАНЕ",
  },

  "editProfile.goalMaintain": {
    en: "MAINTAIN",
    es: "MANTENER",
    uk: "ПІДТРИМУВАТИ ФОРМУ",
    ru: "ПОДДЕРЖИВАТЬ ФОРМУ",
    fr: "MAINTENIR",
    de: "HALTEN",
    pt: "MANTER",
    bg: "ПОДДЪРЖАНЕ",
  },

  "editProfile.goalEndurance": {
    en: "ENDURANCE",
    es: "RESISTENCIA",
    uk: "ВИТРИВАЛІСТЬ",
    ru: "ВЫНОСЛИВОСТЬ",
    fr: "ENDURANCE",
    de: "AUSDAUER",
    pt: "RESISTÊNCIA",
    bg: "ИЗДРЪЖЛИВОСТ",
  },

  "editProfile.goalStrength": {
    en: "STRENGTH",
    es: "FUERZA",
    uk: "СИЛА",
    ru: "СИЛА",
    fr: "FORCE",
    de: "KRAFT",
    pt: "FORÇA",
    bg: "СИЛА",
  },

  "editProfile.goalFitness": {
    en: "FITNESS",
    es: "FITNESS",
    uk: "ФІТНЕС",
    ru: "ФИТНЕС",
    fr: "FITNESS",
    de: "FITNESS",
    pt: "FITNESS",
    bg: "ФИТНЕС",
  },

  "editProfile.save": {
    en: "SAVE CHANGES",
    es: "GUARDAR CAMBIOS",
    uk: "ЗБЕРЕГТИ ЗМІНИ",
    ru: "СОХРАНИТЬ ИЗМЕНЕНИЯ",
    fr: "ENREGISTRER",
    de: "ÄNDERUNGEN SPEICHERN",
    pt: "SALVAR ALTERAÇÕES",
    bg: "ЗАПАЗИ ПРОМЕНИТЕ",
  },

  "editProfile.saving": {
    en: "SAVING...",
    es: "GUARDANDO...",
    uk: "ЗБЕРЕЖЕННЯ...",
    ru: "СОХРАНЕНИЕ...",
    fr: "ENREGISTREMENT...",
    de: "WIRD GESPEICHERT...",
    pt: "SALVANDO...",
    bg: "ЗАПАЗВАНЕ...",
  },

  "editProfile.saved": {
    en: "PROFILE UPDATED",
    es: "PERFIL ACTUALIZADO",
    uk: "ПРОФІЛЬ ОНОВЛЕНО",
    ru: "ПРОФИЛЬ ОБНОВЛЁН",
    fr: "PROFIL MIS À JOUR",
    de: "PROFIL AKTUALISIERT",
    pt: "PERFIL ATUALIZADO",
    bg: "ПРОФИЛЪТ Е АКТУАЛИЗИРАН",
  },

  "editProfile.errorName": {
    en: "Enter your name.",
    es: "Introduce tu nombre.",
    uk: "Введи своє ім’я.",
    ru: "Введите имя.",
    fr: "Saisissez votre nom.",
    de: "Gib deinen Namen ein.",
    pt: "Digite seu nome.",
    bg: "Въведи името си.",
  },

  "editProfile.errorAge": {
    en: "Enter a valid age.",
    es: "Introduce una edad válida.",
    uk: "Введи коректний вік.",
    ru: "Введите корректный возраст.",
    fr: "Saisissez un âge valide.",
    de: "Gib ein gültiges Alter ein.",
    pt: "Digite uma idade válida.",
    bg: "Въведи валидна възраст.",
  },

  "editProfile.errorGender": {
    en: "Select your gender.",
    es: "Selecciona tu género.",
    uk: "Обери стать.",
    ru: "Выберите пол.",
    fr: "Sélectionnez votre sexe.",
    de: "Wähle dein Geschlecht.",
    pt: "Selecione seu gênero.",
    bg: "Избери пол.",
  },

  "editProfile.errorHeight": {
    en: "Height must be between 100 and 250 cm.",
    es: "La altura debe estar entre 100 y 250 cm.",
    uk: "Зріст має бути від 100 до 250 см.",
    ru: "Рост должен быть от 100 до 250 см.",
    fr: "La taille doit être comprise entre 100 et 250 cm.",
    de: "Die Größe muss zwischen 100 und 250 cm liegen.",
    pt: "A altura deve estar entre 100 e 250 cm.",
    bg: "Ръстът трябва да е между 100 и 250 см.",
  },

  "editProfile.errorWeight": {
    en: "Weight must be between 30 and 300 kg.",
    es: "El peso debe estar entre 30 y 300 kg.",
    uk: "Вага має бути від 30 до 300 кг.",
    ru: "Вес должен быть от 30 до 300 кг.",
    fr: "Le poids doit être compris entre 30 et 300 kg.",
    de: "Das Gewicht muss zwischen 30 und 300 kg liegen.",
    pt: "O peso deve estar entre 30 e 300 kg.",
    bg: "Теглото трябва да е между 30 и 300 кг.",
  },

  "editProfile.errorGoal": {
    en: "Select your goal.",
    es: "Selecciona tu objetivo.",
    uk: "Обери свою ціль.",
    ru: "Выберите цель.",
    fr: "Sélectionnez votre objectif.",
    de: "Wähle dein Ziel.",
    pt: "Selecione seu objetivo.",
    bg: "Избери своята цел.",
  },

  "editProfile.errorSave": {
    en: "Failed to save profile.",
    es: "No se pudo guardar el perfil.",
    uk: "Не вдалося зберегти профіль.",
    ru: "Не удалось сохранить профиль.",
    fr: "Impossible d’enregistrer le profil.",
    de: "Profil konnte nicht gespeichert werden.",
    pt: "Não foi possível salvar o perfil.",
    bg: "Профилът не можа да бъде запазен.",
  },

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  "notifications.title": {
    en: "NOTIFICATIONS",
    es: "NOTIFICACIONES",
    uk: "СПОВІЩЕННЯ",
    ru: "УВЕДОМЛЕНИЯ",
    fr: "NOTIFICATIONS",
    de: "BENACHRICHTIGUNGEN",
    pt: "NOTIFICAÇÕES",
    bg: "ИЗВЕСТИЯ",
  },

  "notifications.subtitle": {
    en: "REMINDERS · PROGRESS · MOTIVATION",
    es: "RECORDATORIOS · PROGRESO · MOTIVACIÓN",
    uk: "НАГАДУВАННЯ · ПРОГРЕС · МОТИВАЦІЯ",
    ru: "НАПОМИНАНИЯ · ПРОГРЕСС · МОТИВАЦИЯ",
    fr: "RAPPELS · PROGRÈS · MOTIVATION",
    de: "ERINNERUNGEN · FORTSCHRITT · MOTIVATION",
    pt: "LEMBRETES · PROGRESSO · MOTIVAÇÃO",
    bg: "НАПОМНЯНИЯ · ПРОГРЕС · МОТИВАЦИЯ",
  },

  "notifications.permission": {
    en: "NOTIFICATION STATUS",
    es: "ESTADO DE NOTIFICACIONES",
    uk: "СТАТУС СПОВІЩЕНЬ",
    ru: "СТАТУС УВЕДОМЛЕНИЙ",
    fr: "STATUT DES NOTIFICATIONS",
    de: "BENACHRICHTIGUNGSSTATUS",
    pt: "STATUS DAS NOTIFICAÇÕES",
    bg: "СТАТУС НА ИЗВЕСТИЯТА",
  },

  "notifications.permissionGranted": {
    en: "ALLOWED",
    es: "PERMITIDAS",
    uk: "ДОЗВОЛЕНО",
    ru: "РАЗРЕШЕНО",
    fr: "AUTORISÉES",
    de: "ERLAUBT",
    pt: "PERMITIDAS",
    bg: "РАЗРЕШЕНИ",
  },

  "notifications.permissionDenied": {
    en: "BLOCKED",
    es: "BLOQUEADAS",
    uk: "ЗАБЛОКОВАНО",
    ru: "ЗАБЛОКИРОВАНО",
    fr: "BLOQUÉES",
    de: "BLOCKIERT",
    pt: "BLOQUEADAS",
    bg: "БЛОКИРАНИ",
  },

  "notifications.permissionPrompt": {
    en: "PERMISSION REQUIRED",
    es: "SE REQUIERE PERMISO",
    uk: "ПОТРІБЕН ДОЗВІЛ",
    ru: "ТРЕБУЕТСЯ РАЗРЕШЕНИЕ",
    fr: "AUTORISATION REQUISE",
    de: "BERECHTIGUNG ERFORDERLICH",
    pt: "PERMISSÃO NECESSÁRIA",
    bg: "НЕОБХОДИМО Е РАЗРЕШЕНИЕ",
  },

  "notifications.permissionWeb": {
    en: "NATIVE APP REQUIRED",
    es: "SE REQUIERE LA APP NATIVA",
    uk: "ПОТРІБЕН МОБІЛЬНИЙ ДОДАТОК",
    ru: "ТРЕБУЕТСЯ МОБИЛЬНОЕ ПРИЛОЖЕНИЕ",
    fr: "APP NATIVE REQUISE",
    de: "NATIVE APP ERFORDERLICH",
    pt: "APP NATIVO NECESSÁRIO",
    bg: "НЕОБХОДИМО Е МОБИЛНОТО ПРИЛОЖЕНИЕ",
  },

  "notifications.permissionUnknown": {
    en: "UNKNOWN",
    es: "DESCONOCIDO",
    uk: "НЕВІДОМО",
    ru: "НЕИЗВЕСТНО",
    fr: "INCONNU",
    de: "UNBEKANNT",
    pt: "DESCONHECIDO",
    bg: "НЕИЗВЕСТНО",
  },

  "notifications.allow": {
    en: "ALLOW",
    es: "PERMITIR",
    uk: "ДОЗВОЛИТИ",
    ru: "РАЗРЕШИТЬ",
    fr: "AUTORISER",
    de: "ERLAUBEN",
    pt: "PERMITIR",
    bg: "РАЗРЕШИ",
  },

  "notifications.reminders": {
    en: "REMINDERS",
    es: "RECORDATORIOS",
    uk: "НАГАДУВАННЯ",
    ru: "НАПОМИНАНИЯ",
    fr: "RAPPELS",
    de: "ERINNERUNGEN",
    pt: "LEMBRETES",
    bg: "НАПОМНЯНИЯ",
  },

  "notifications.workout": {
    en: "WORKOUT REMINDER",
    es: "RECORDATORIO DE ENTRENAMIENTO",
    uk: "НАГАДУВАННЯ ПРО ТРЕНУВАННЯ",
    ru: "НАПОМИНАНИЕ О ТРЕНИРОВКЕ",
    fr: "RAPPEL D’ENTRAÎNEMENT",
    de: "TRAININGSERINNERUNG",
    pt: "LEMBRETE DE TREINO",
    bg: "НАПОМНЯНЕ ЗА ТРЕНИРОВКА",
  },

  "notifications.workoutDescription": {
    en: "Daily reminder to complete your workout",
    es: "Recordatorio diario para completar tu entrenamiento",
    uk: "Щоденне нагадування виконати тренування",
    ru: "Ежедневное напоминание выполнить тренировку",
    fr: "Rappel quotidien pour effectuer votre entraînement",
    de: "Tägliche Erinnerung für dein Training",
    pt: "Lembrete diário para concluir seu treino",
    bg: "Ежедневно напомняне да направиш тренировката си",
  },

  "notifications.nutrition": {
    en: "NUTRITION REMINDERS",
    es: "RECORDATORIOS DE NUTRICIÓN",
    uk: "НАГАДУВАННЯ ПРО ХАРЧУВАННЯ",
    ru: "НАПОМИНАНИЯ О ПИТАНИИ",
    fr: "RAPPELS NUTRITION",
    de: "ERNÄHRUNGSERINNERUNGEN",
    pt: "LEMBRETES DE NUTRIÇÃO",
    bg: "НАПОМНЯНИЯ ЗА ХРАНЕНЕ",
  },

  "notifications.nutritionDescription": {
    en: "Morning, afternoon and evening nutrition reminders",
    es: "Recordatorios de nutrición por la mañana, tarde y noche",
    uk: "Нагадування про харчування вранці, вдень і ввечері",
    ru: "Напоминания о питании утром, днём и вечером",
    fr: "Rappels nutrition matin, midi et soir",
    de: "Ernährungserinnerungen morgens, mittags und abends",
    pt: "Lembretes de nutrição de manhã, tarde e noite",
    bg: "Напомняния за хранене сутрин, следобед и вечер",
  },

  "notifications.motivation": {
    en: "MOTIVATION",
    es: "MOTIVACIÓN",
    uk: "МОТИВАЦІЯ",
    ru: "МОТИВАЦИЯ",
    fr: "MOTIVATION",
    de: "MOTIVATION",
    pt: "MOTIVAÇÃO",
    bg: "МОТИВАЦИЯ",
  },

  "notifications.motivationDescription": {
    en: "Daily discipline and motivation reminder",
    es: "Recordatorio diario de disciplina y motivación",
    uk: "Щоденне нагадування про дисципліну та мотивацію",
    ru: "Ежедневное напоминание о дисциплине и мотивации",
    fr: "Rappel quotidien de discipline et motivation",
    de: "Tägliche Erinnerung für Disziplin und Motivation",
    pt: "Lembrete diário de disciplina e motivação",
    bg: "Ежедневно напомняне за дисциплина и мотивация",
  },

  "notifications.progress": {
    en: "PROGRESS UPDATES",
    es: "ACTUALIZACIONES DE PROGRESO",
    uk: "ОНОВЛЕННЯ ПРОГРЕСУ",
    ru: "ОБНОВЛЕНИЯ ПРОГРЕССА",
    fr: "MISES À JOUR DE PROGRÈS",
    de: "FORTSCHRITTS-UPDATES",
    pt: "ATUALIZAÇÕES DE PROGRESSO",
    bg: "АКТУАЛИЗАЦИИ ЗА ПРОГРЕСА",
  },

  "notifications.progressDescription": {
    en: "Level, XP and streak notifications after workouts",
    es: "Notificaciones de nivel, XP y racha después de entrenar",
    uk: "Сповіщення про рівень, XP і серію після тренувань",
    ru: "Уведомления об уровне, XP и серии после тренировок",
    fr: "Notifications de niveau, XP et série après l’entraînement",
    de: "Level-, XP- und Streak-Benachrichtigungen nach Trainings",
    pt: "Notificações de nível, XP e sequência após os treinos",
    bg: "Известия за ниво, XP и серия след тренировка",
  },

  "notifications.test": {
    en: "TEST",
    es: "PRUEBA",
    uk: "ТЕСТ",
    ru: "ТЕСТ",
    fr: "TEST",
    de: "TEST",
    pt: "TESTE",
    bg: "ТЕСТ",
  },

  "notifications.testButton": {
    en: "SEND TEST NOTIFICATION",
    es: "ENVIAR NOTIFICACIÓN DE PRUEBA",
    uk: "НАДІСЛАТИ ТЕСТОВЕ СПОВІЩЕННЯ",
    ru: "ОТПРАВИТЬ ТЕСТОВОЕ УВЕДОМЛЕНИЕ",
    fr: "ENVOYER UNE NOTIFICATION TEST",
    de: "TESTBENACHRICHTIGUNG SENDEN",
    pt: "ENVIAR NOTIFICAÇÃO DE TESTE",
    bg: "ИЗПРАТИ ТЕСТОВО ИЗВЕСТИЕ",
  },

  "notifications.testing": {
    en: "SENDING...",
    es: "ENVIANDO...",
    uk: "НАДСИЛАННЯ...",
    ru: "ОТПРАВКА...",
    fr: "ENVOI...",
    de: "WIRD GESENDET...",
    pt: "ENVIANDO...",
    bg: "ИЗПРАЩАНЕ...",
  },

  "notifications.testScheduled": {
    en: "Test notification scheduled. Wait 5 seconds.",
    es: "Notificación de prueba programada. Espera 5 segundos.",
    uk: "Тестове сповіщення заплановано. Зачекай 5 секунд.",
    ru: "Тестовое уведомление запланировано. Подождите 5 секунд.",
    fr: "Notification test programmée. Attendez 5 secondes.",
    de: "Testbenachrichtigung geplant. Warte 5 Sekunden.",
    pt: "Notificação de teste agendada. Aguarde 5 segundos.",
    bg: "Тестовото известие е насрочено. Изчакай 5 секунди.",
  },

  "notifications.testFailed": {
    en: "Could not schedule notification.",
    es: "No se pudo programar la notificación.",
    uk: "Не вдалося запланувати сповіщення.",
    ru: "Не удалось запланировать уведомление.",
    fr: "Impossible de programmer la notification.",
    de: "Benachrichtigung konnte nicht geplant werden.",
    pt: "Não foi possível agendar a notificação.",
    bg: "Известието не можа да бъде насрочено.",
  },

  "notifications.scheduleFailed": {
    en: "Could not update notification reminder.",
    es: "No se pudo actualizar el recordatorio.",
    uk: "Не вдалося оновити нагадування.",
    ru: "Не удалось обновить напоминание.",
    fr: "Impossible de mettre à jour le rappel.",
    de: "Erinnerung konnte nicht aktualisiert werden.",
    pt: "Não foi possível atualizar o lembrete.",
    bg: "Напомнянето не можа да бъде актуализирано.",
  },

  "notifications.permissionRequired": {
    en: "Notification permission is required.",
    es: "Se requiere permiso para las notificaciones.",
    uk: "Потрібен дозвіл на сповіщення.",
    ru: "Требуется разрешение на уведомления.",
    fr: "L’autorisation des notifications est requise.",
    de: "Benachrichtigungsberechtigung ist erforderlich.",
    pt: "É necessária permissão para notificações.",
    bg: "Необходимо е разрешение за известия.",
  },

  "notifications.permissionError": {
    en: "Could not request notification permission.",
    es: "No se pudo solicitar permiso para notificaciones.",
    uk: "Не вдалося запросити дозвіл на сповіщення.",
    ru: "Не удалось запросить разрешение на уведомления.",
    fr: "Impossible de demander l’autorisation des notifications.",
    de: "Benachrichtigungsberechtigung konnte nicht angefordert werden.",
    pt: "Não foi possível solicitar permissão para notificações.",
    bg: "Разрешението за известия не можа да бъде поискано.",
  },

  "notifications.nativeOnly": {
    en: "Notifications are available in the IRONAGE mobile app.",
    es: "Las notificaciones están disponibles en la app móvil IRONAGE.",
    uk: "Сповіщення доступні в мобільному додатку IRONAGE.",
    ru: "Уведомления доступны в мобильном приложении IRONAGE.",
    fr: "Les notifications sont disponibles dans l’application mobile IRONAGE.",
    de: "Benachrichtigungen sind in der mobilen IRONAGE-App verfügbar.",
    pt: "As notificações estão disponíveis no app móvel IRONAGE.",
    bg: "Известията са достъпни в мобилното приложение IRONAGE.",
  },

  /* =====================================================
     PREMIUM EXTRA
  ===================================================== */

  "premium.profile": {
    en: "PROFILE",
    es: "PERFIL",
    uk: "ПРОФІЛЬ",
    ru: "ПРОФИЛЬ",
    fr: "PROFIL",
    de: "PROFIL",
    pt: "PERFIL",
    bg: "ПРОФИЛ",
  },

  "premium.eyebrow": {
    en: "IRONAGE PREMIUM",
    es: "IRONAGE PREMIUM",
    uk: "IRONAGE PREMIUM",
    ru: "IRONAGE PREMIUM",
    fr: "IRONAGE PREMIUM",
    de: "IRONAGE PREMIUM",
    pt: "IRONAGE PREMIUM",
    bg: "IRONAGE PREMIUM",
  },

  "premium.description": {
    en: "Unlock the complete IRONAGE experience.",
    es: "Desbloquea toda la experiencia IRONAGE.",
    uk: "Відкрий повний досвід IRONAGE.",
    ru: "Открой полный функционал IRONAGE.",
    fr: "Débloquez toute l’expérience IRONAGE.",
    de: "Schalte das vollständige IRONAGE-Erlebnis frei.",
    pt: "Desbloqueie toda a experiência IRONAGE.",
    bg: "Отключи пълното изживяване IRONAGE.",
  },

  "premium.included": {
    en: "INCLUDED",
    es: "INCLUIDO",
    uk: "ВКЛЮЧЕНО",
    ru: "ВКЛЮЧЕНО",
    fr: "INCLUS",
    de: "ENTHALTEN",
    pt: "INCLUÍDO",
    bg: "ВКЛЮЧЕНО",
  },

  "premium.transactionMissing": {
    en: "Apple transaction ID is missing",
    es: "Falta el ID de la transacción de Apple",
    uk: "Відсутній ID транзакції Apple",
    ru: "Отсутствует ID транзакции Apple",
    fr: "L’identifiant de transaction Apple est manquant",
    de: "Apple-Transaktions-ID fehlt",
    pt: "O ID da transação Apple está ausente",
    bg: "Липсва ID на Apple транзакцията",
  },

  "premium.finishFailed": {
    en: "Failed to finish Apple transaction",
    es: "No se pudo finalizar la transacción de Apple",
    uk: "Не вдалося завершити транзакцію Apple",
    ru: "Не удалось завершить транзакцию Apple",
    fr: "Impossible de finaliser la transaction Apple",
    de: "Apple-Transaktion konnte nicht abgeschlossen werden",
    pt: "Não foi possível finalizar a transação Apple",
    bg: "Apple транзакцията не можа да бъде завършена",
  },

  /* =====================================================
     PAYMENTS
  ===================================================== */

  "payments.title": {
    en: "PAYMENTS",
    es: "PAGOS",
    uk: "ПЛАТЕЖІ",
    ru: "ПЛАТЕЖИ",
    fr: "PAIEMENTS",
    de: "ZAHLUNGEN",
    pt: "PAGAMENTOS",
    bg: "ПЛАЩАНИЯ",
  },

  "payments.subtitle": {
    en: "PURCHASES · SUBSCRIPTIONS · TRANSACTIONS",
    es: "COMPRAS · SUSCRIPCIONES · TRANSACCIONES",
    uk: "ПОКУПКИ · ПІДПИСКИ · ТРАНЗАКЦІЇ",
    ru: "ПОКУПКИ · ПОДПИСКИ · ТРАНЗАКЦИИ",
    fr: "ACHATS · ABONNEMENTS · TRANSACTIONS",
    de: "KÄUFE · ABOS · TRANSAKTIONEN",
    pt: "COMPRAS · ASSINATURAS · TRANSAÇÕES",
    bg: "ПОКУПКИ · АБОНАМЕНТИ · ТРАНЗАКЦИИ",
  },

  "payments.transactions": {
    en: "TRANSACTIONS",
    es: "TRANSACCIONES",
    uk: "ТРАНЗАКЦІЇ",
    ru: "ТРАНЗАКЦИИ",
    fr: "TRANSACTIONS",
    de: "TRANSAKTIONEN",
    pt: "TRANSAÇÕES",
    bg: "ТРАНЗАКЦИИ",
  },

  "payments.activeSubscriptions": {
    en: "ACTIVE SUBSCRIPTIONS",
    es: "SUSCRIPCIONES ACTIVAS",
    uk: "АКТИВНІ ПІДПИСКИ",
    ru: "АКТИВНЫЕ ПОДПИСКИ",
    fr: "ABONNEMENTS ACTIFS",
    de: "AKTIVE ABOS",
    pt: "ASSINATURAS ATIVAS",
    bg: "АКТИВНИ АБОНАМЕНТИ",
  },

  "payments.programPurchases": {
    en: "PROGRAM PURCHASES",
    es: "COMPRAS DE PROGRAMAS",
    uk: "ПОКУПКИ ПРОГРАМ",
    ru: "ПОКУПКИ ПРОГРАММ",
    fr: "ACHATS DE PROGRAMMES",
    de: "PROGRAMMKÄUFE",
    pt: "COMPRAS DE PROGRAMAS",
    bg: "ПОКУПКИ НА ПРОГРАМИ",
  },

  "payments.history": {
    en: "PAYMENT HISTORY",
    es: "HISTORIAL DE PAGOS",
    uk: "ІСТОРІЯ ПЛАТЕЖІВ",
    ru: "ИСТОРИЯ ПЛАТЕЖЕЙ",
    fr: "HISTORIQUE DES PAIEMENTS",
    de: "ZAHLUNGSVERLAUF",
    pt: "HISTÓRICO DE PAGAMENTOS",
    bg: "ИСТОРИЯ НА ПЛАЩАНИЯТА",
  },

  "payments.subscription": {
    en: "PREMIUM SUBSCRIPTION",
    es: "SUSCRIPCIÓN PREMIUM",
    uk: "PREMIUM ПІДПИСКА",
    ru: "PREMIUM ПОДПИСКА",
    fr: "ABONNEMENT PREMIUM",
    de: "PREMIUM-ABO",
    pt: "ASSINATURA PREMIUM",
    bg: "PREMIUM АБОНАМЕНТ",
  },

  "payments.program": {
    en: "PROGRAM PURCHASE",
    es: "COMPRA DE PROGRAMA",
    uk: "ПОКУПКА ПРОГРАМИ",
    ru: "ПОКУПКА ПРОГРАММЫ",
    fr: "ACHAT DE PROGRAMME",
    de: "PROGRAMMKAUF",
    pt: "COMPRA DE PROGRAMA",
    bg: "ПОКУПКА НА ПРОГРАМА",
  },

  "payments.date": {
    en: "DATE",
    es: "FECHA",
    uk: "ДАТА",
    ru: "ДАТА",
    fr: "DATE",
    de: "DATUM",
    pt: "DATA",
    bg: "ДАТА",
  },

  "payments.expires": {
    en: "EXPIRES",
    es: "VENCE",
    uk: "ДІЄ ДО",
    ru: "ДЕЙСТВУЕТ ДО",
    fr: "EXPIRE",
    de: "LÄUFT AB",
    pt: "EXPIRA",
    bg: "ИЗТИЧА",
  },

  "payments.provider": {
    en: "PROVIDER",
    es: "PROVEEDOR",
    uk: "ПРОВАЙДЕР",
    ru: "ПРОВАЙДЕР",
    fr: "FOURNISSEUR",
    de: "ANBIETER",
    pt: "PROVEDOR",
    bg: "ДОСТАВЧИК",
  },

  "payments.platform": {
    en: "PLATFORM",
    es: "PLATAFORMA",
    uk: "ПЛАТФОРМА",
    ru: "ПЛАТФОРМА",
    fr: "PLATEFORME",
    de: "PLATTFORM",
    pt: "PLATAFORMA",
    bg: "ПЛАТФОРМА",
  },

  "payments.currency": {
    en: "CURRENCY",
    es: "MONEDA",
    uk: "ВАЛЮТА",
    ru: "ВАЛЮТА",
    fr: "DEVISE",
    de: "WÄHRUNG",
    pt: "MOEDA",
    bg: "ВАЛУТА",
  },

  "payments.transaction": {
    en: "TRANSACTION ID",
    es: "ID DE TRANSACCIÓN",
    uk: "ID ТРАНЗАКЦІЇ",
    ru: "ID ТРАНЗАКЦИИ",
    fr: "ID DE TRANSACTION",
    de: "TRANSAKTIONS-ID",
    pt: "ID DA TRANSAÇÃO",
    bg: "ID НА ТРАНЗАКЦИЯТА",
  },

  "payments.emptyTitle": {
    en: "NO PAYMENTS YET",
    es: "AÚN NO HAY PAGOS",
    uk: "ПЛАТЕЖІВ ЩЕ НЕМАЄ",
    ru: "ПЛАТЕЖЕЙ ПОКА НЕТ",
    fr: "AUCUN PAIEMENT",
    de: "NOCH KEINE ZAHLUNGEN",
    pt: "AINDA NÃO HÁ PAGAMENTOS",
    bg: "ВСЕ ОЩЕ НЯМА ПЛАЩАНИЯ",
  },

  "payments.emptyDescription": {
    en: "Your subscriptions and program purchases will appear here.",
    es: "Tus suscripciones y compras de programas aparecerán aquí.",
    uk: "Твої підписки та покупки програм з’являться тут.",
    ru: "Твои подписки и покупки программ появятся здесь.",
    fr: "Vos abonnements et achats de programmes apparaîtront ici.",
    de: "Deine Abos und Programmkäufe erscheinen hier.",
    pt: "Suas assinaturas e compras de programas aparecerão aqui.",
    bg: "Абонаментите и покупките на програми ще се появят тук.",
  },

  "payments.loadFailed": {
    en: "Could not load payment history.",
    es: "No se pudo cargar el historial de pagos.",
    uk: "Не вдалося завантажити історію платежів.",
    ru: "Не удалось загрузить историю платежей.",
    fr: "Impossible de charger l’historique des paiements.",
    de: "Zahlungsverlauf konnte nicht geladen werden.",
    pt: "Não foi possível carregar o histórico de pagamentos.",
    bg: "Историята на плащанията не можа да бъде заредена.",
  },

  /* =====================================================
     WORKOUT HISTORY
  ===================================================== */

  "workoutHistory.title": {
    en: "WORKOUT HISTORY",
    es: "HISTORIAL DE ENTRENAMIENTOS",
    uk: "ІСТОРІЯ ТРЕНУВАНЬ",
    ru: "ИСТОРИЯ ТРЕНИРОВОК",
    fr: "HISTORIQUE DES ENTRAÎNEMENTS",
    de: "TRAININGSVERLAUF",
    pt: "HISTÓRICO DE TREINOS",
    bg: "ИСТОРИЯ НА ТРЕНИРОВКИТЕ",
  },

  "workoutHistory.subtitle": {
    en: "SESSIONS · SETS · PERFORMANCE",
    es: "SESIONES · SERIES · RENDIMIENTO",
    uk: "ТРЕНУВАННЯ · ПІДХОДИ · РЕЗУЛЬТАТ",
    ru: "ТРЕНИРОВКИ · ПОДХОДЫ · РЕЗУЛЬТАТ",
    fr: "SÉANCES · SÉRIES · PERFORMANCE",
    de: "EINHEITEN · SÄTZE · LEISTUNG",
    pt: "SESSÕES · SÉRIES · DESEMPENHO",
    bg: "СЕСИИ · СЕРИИ · РЕЗУЛТАТИ",
  },

  "workoutHistory.workouts": {
    en: "WORKOUTS", es: "ENTRENAMIENTOS", uk: "ТРЕНУВАННЯ", ru: "ТРЕНИРОВКИ",
    fr: "ENTRAÎNEMENTS", de: "TRAININGS", pt: "TREINOS", bg: "ТРЕНИРОВКИ",
  },

  "workoutHistory.totalSets": {
    en: "TOTAL SETS", es: "SERIES TOTALES", uk: "УСЬОГО ПІДХОДІВ", ru: "ВСЕГО ПОДХОДОВ",
    fr: "SÉRIES TOTALES", de: "SÄTZE GESAMT", pt: "TOTAL DE SÉRIES", bg: "ОБЩО СЕРИИ",
  },

  "workoutHistory.totalXp": {
    en: "TOTAL XP", es: "XP TOTAL", uk: "УСЬОГО XP", ru: "ВСЕГО XP",
    fr: "XP TOTAL", de: "XP GESAMT", pt: "XP TOTAL", bg: "ОБЩО XP",
  },

  "workoutHistory.minutes": {
    en: "MINUTES", es: "MINUTOS", uk: "ХВИЛИНИ", ru: "МИНУТЫ",
    fr: "MINUTES", de: "MINUTEN", pt: "MINUTOS", bg: "МИНУТИ",
  },

  "workoutHistory.history": {
    en: "COMPLETED WORKOUTS", es: "ENTRENAMIENTOS COMPLETADOS", uk: "ЗАВЕРШЕНІ ТРЕНУВАННЯ", ru: "ЗАВЕРШЁННЫЕ ТРЕНИРОВКИ",
    fr: "ENTRAÎNEMENTS TERMINÉS", de: "ABGESCHLOSSENE TRAININGS", pt: "TREINOS CONCLUÍDOS", bg: "ЗАВЪРШЕНИ ТРЕНИРОВКИ",
  },

  "workoutHistory.emptyTitle": {
    en: "NO WORKOUTS YET", es: "AÚN NO HAY ENTRENAMIENTOS", uk: "ТРЕНУВАНЬ ЩЕ НЕМАЄ", ru: "ТРЕНИРОВОК ПОКА НЕТ",
    fr: "AUCUN ENTRAÎNEMENT", de: "NOCH KEINE TRAININGS", pt: "AINDA NÃO HÁ TREINOS", bg: "ВСЕ ОЩЕ НЯМА ТРЕНИРОВКИ",
  },

  "workoutHistory.emptyDescription": {
    en: "Complete your first workout and it will appear here.",
    es: "Completa tu primer entrenamiento y aparecerá aquí.",
    uk: "Заверши перше тренування, і воно з’явиться тут.",
    ru: "Заверши первую тренировку, и она появится здесь.",
    fr: "Terminez votre premier entraînement et il apparaîtra ici.",
    de: "Schließe dein erstes Training ab und es erscheint hier.",
    pt: "Conclua seu primeiro treino e ele aparecerá aqui.",
    bg: "Завърши първата си тренировка и тя ще се появи тук.",
  },

  "workoutHistory.min": {
    en: "MIN", es: "MIN", uk: "ХВ", ru: "МИН", fr: "MIN", de: "MIN", pt: "MIN", bg: "МИН",
  },

  "workoutHistory.sets": {
    en: "SETS", es: "SERIES", uk: "ПІДХОДІВ", ru: "ПОДХОДОВ", fr: "SÉRIES", de: "SÄTZE", pt: "SÉRIES", bg: "СЕРИИ",
  },

  "workoutHistory.completed": {
    en: "COMPLETED", es: "COMPLETADO", uk: "ЗАВЕРШЕНО", ru: "ЗАВЕРШЕНО", fr: "TERMINÉ", de: "ABGESCHLOSSEN", pt: "CONCLUÍDO", bg: "ЗАВЪРШЕНО",
  },

  "workoutHistory.incomplete": {
    en: "INCOMPLETE", es: "INCOMPLETO", uk: "НЕ ЗАВЕРШЕНО", ru: "НЕ ЗАВЕРШЕНО", fr: "INCOMPLET", de: "UNVOLLSTÄNDIG", pt: "INCOMPLETO", bg: "НЕЗАВЪРШЕНО",
  },

  "workoutHistory.calories": {
    en: "CALORIES", es: "CALORÍAS", uk: "КАЛОРІЇ", ru: "КАЛОРИИ", fr: "CALORIES", de: "KALORIEN", pt: "CALORIAS", bg: "КАЛОРИИ",
  },

  "workoutHistory.volume": {
    en: "VOLUME", es: "VOLUMEN", uk: "ОБʼЄМ", ru: "ОБЪЁМ", fr: "VOLUME", de: "VOLUMEN", pt: "VOLUME", bg: "ОБЕМ",
  },

  "workoutHistory.noSets": {
    en: "No set details were recorded for this workout.",
    es: "No se registraron detalles de series para este entrenamiento.",
    uk: "Для цього тренування деталі підходів не записані.",
    ru: "Для этой тренировки детали подходов не записаны.",
    fr: "Aucun détail de série n’a été enregistré pour cet entraînement.",
    de: "Für dieses Training wurden keine Satzdetails gespeichert.",
    pt: "Nenhum detalhe de série foi registrado para este treino.",
    bg: "Няма записани подробности за сериите в тази тренировка.",
  },

  "workoutHistory.reps": {
    en: "REPS", es: "REP", uk: "ПОВТ.", ru: "ПОВТ.", fr: "RÉP.", de: "WDH.", pt: "REP.", bg: "ПОВТ.",
  },

  /* =====================================================
     APP
  ===================================================== */

  "app.authenticationError": {
    en: "Authentication Error",
    es: "Error de autenticación",
    uk: "Помилка авторизації",
    ru: "Ошибка авторизации",
    fr: "Erreur d’authentification",
    de: "Authentifizierungsfehler",
    pt: "Erro de autenticação",
    bg: "Грешка при удостоверяване",
  },

  /* =====================================================
     SETTINGS
  ===================================================== */

  "settings.title": {
    en: "SETTINGS",
    es: "AJUSTES",
    uk: "НАЛАШТУВАННЯ",
    ru: "НАСТРОЙКИ",
    fr: "RÉGLAGES",
    de: "EINSTELLUNGEN",
    pt: "CONFIGURAÇÕES",
    bg: "НАСТРОЙКИ",
  },

  "settings.subtitle": {
    en: "APP · EXPERIENCE · SYSTEM",
    es: "APP · EXPERIENCIA · SISTEMA",
    uk: "ДОДАТОК · ДОСВІД · СИСТЕМА",
    ru: "ПРИЛОЖЕНИЕ · ОПЫТ · СИСТЕМА",
    fr: "APP · EXPÉRIENCE · SYSTÈME",
    de: "APP · ERLEBNIS · SYSTEM",
    pt: "APP · EXPERIÊNCIA · SISTEMA",
    bg: "ПРИЛОЖЕНИЕ · ИЗЖИВЯВАНЕ · СИСТЕМА",
  },

  "settings.appControl": {
    en: "APP CONTROL",
    es: "CONTROL DE LA APP",
    uk: "КЕРУВАННЯ ДОДАТКОМ",
    ru: "УПРАВЛЕНИЕ ПРИЛОЖЕНИЕМ",
    fr: "CONTRÔLE DE L’APP",
    de: "APP-STEUERUNG",
    pt: "CONTROLE DO APP",
    bg: "УПРАВЛЕНИЕ НА ПРИЛОЖЕНИЕТО",
  },

  "settings.yourApp": {
    en: "YOUR APP.",
    es: "TU APP.",
    uk: "ТВІЙ ДОДАТОК.",
    ru: "ТВОЁ ПРИЛОЖЕНИЕ.",
    fr: "TON APP.",
    de: "DEINE APP.",
    pt: "SEU APP.",
    bg: "ТВОЕТО ПРИЛОЖЕНИЕ.",
  },

  "settings.yourRules": {
    en: "YOUR RULES.",
    es: "TUS REGLAS.",
    uk: "ТВОЇ ПРАВИЛА.",
    ru: "ТВОИ ПРАВИЛА.",
    fr: "TES RÈGLES.",
    de: "DEINE REGELN.",
    pt: "SUAS REGRAS.",
    bg: "ТВОИТЕ ПРАВИЛА.",
  },

  "settings.description": {
    en: "Configure the IRONAGE experience for the way you train.",
    es: "Configura IRONAGE según tu forma de entrenar.",
    uk: "Налаштуй IRONAGE під свій стиль тренувань.",
    ru: "Настрой IRONAGE под свой стиль тренировок.",
    fr: "Configure IRONAGE selon ta façon de t’entraîner.",
    de: "Passe IRONAGE an deine Trainingsweise an.",
    pt: "Configure o IRONAGE para a sua forma de treinar.",
    bg: "Настрой IRONAGE според начина, по който тренираш.",
  },

  "settings.haptics": {
    en: "HAPTIC FEEDBACK",
    es: "RESPUESTA HÁPTICA",
    uk: "ТАКТИЛЬНИЙ ВІДГУК",
    ru: "ТАКТИЛЬНАЯ ОТДАЧА",
    fr: "RETOUR HAPTIQUE",
    de: "HAPTISCHES FEEDBACK",
    pt: "FEEDBACK HÁPTICO",
    bg: "ТАКТИЛНА ОБРАТНА ВРЪЗКА",
  },

  "settings.hapticsDescription": {
    en: "Vibration feedback for important actions",
    es: "Vibración para acciones importantes",
    uk: "Вібрація для важливих дій",
    ru: "Вибрация для важных действий",
    fr: "Vibration pour les actions importantes",
    de: "Vibration bei wichtigen Aktionen",
    pt: "Vibração para ações importantes",
    bg: "Вибрация при важни действия",
  },

  "settings.sounds": {
    en: "APP SOUNDS",
    es: "SONIDOS DE LA APP",
    uk: "ЗВУКИ ДОДАТКА",
    ru: "ЗВУКИ ПРИЛОЖЕНИЯ",
    fr: "SONS DE L’APP",
    de: "APP-TÖNE",
    pt: "SONS DO APP",
    bg: "ЗВУЦИ В ПРИЛОЖЕНИЕТО",
  },

  "settings.soundsDescription": {
    en: "Enable interface and workout sounds",
    es: "Activa sonidos de interfaz y entrenamiento",
    uk: "Увімкнути звуки інтерфейсу та тренувань",
    ru: "Включить звуки интерфейса и тренировок",
    fr: "Activer les sons de l’interface et des entraînements",
    de: "Interface- und Trainingssounds aktivieren",
    pt: "Ativar sons da interface e dos treinos",
    bg: "Включи звуците на интерфейса и тренировките",
  },

  "settings.autoStart": {
    en: "AUTO START WORKOUT",
    es: "INICIO AUTOMÁTICO",
    uk: "АВТОЗАПУСК ТРЕНУВАННЯ",
    ru: "АВТОЗАПУСК ТРЕНИРОВКИ",
    fr: "DÉMARRAGE AUTOMATIQUE",
    de: "TRAINING AUTOMATISCH STARTEN",
    pt: "INÍCIO AUTOMÁTICO",
    bg: "АВТОМАТИЧЕН СТАРТ",
  },

  "settings.autoStartDescription": {
    en: "Start workout immediately after selection",
    es: "Iniciar el entrenamiento justo después de elegirlo",
    uk: "Починати тренування одразу після вибору",
    ru: "Начинать тренировку сразу после выбора",
    fr: "Démarrer l’entraînement immédiatement après la sélection",
    de: "Training direkt nach der Auswahl starten",
    pt: "Iniciar o treino imediatamente após a seleção",
    bg: "Започни тренировката веднага след избора",
  },

  "settings.language": {
    en: "LANGUAGE",
    es: "IDIOMA",
    uk: "МОВА",
    ru: "ЯЗЫК",
    fr: "LANGUE",
    de: "SPRACHE",
    pt: "IDIOMA",
    bg: "ЕЗИК",
  },

  /* =====================================================
     LANGUAGE
  ===================================================== */

  "language.title": {
    en: "LANGUAGE",
    es: "IDIOMA",
    uk: "МОВА",
    ru: "ЯЗЫК",
    fr: "LANGUE",
    de: "SPRACHE",
    pt: "IDIOMA",
    bg: "ЕЗИК",
  },

  "language.subtitle": {
    en: "CHOOSE YOUR LANGUAGE",
    es: "ELIGE TU IDIOMA",
    uk: "ОБЕРИ СВОЮ МОВУ",
    ru: "ВЫБЕРИ СВОЙ ЯЗЫК",
    fr: "CHOISIS TA LANGUE",
    de: "WÄHLE DEINE SPRACHE",
    pt: "ESCOLHA SEU IDIOMA",
    bg: "ИЗБЕРИ СВОЯ ЕЗИК",
  },

  "language.control": {
    en: "LANGUAGE CONTROL",
    es: "CONTROL DE IDIOMA",
    uk: "НАЛАШТУВАННЯ МОВИ",
    ru: "НАСТРОЙКА ЯЗЫКА",
    fr: "RÉGLAGE DE LA LANGUE",
    de: "SPRACHEINSTELLUNG",
    pt: "CONFIGURAÇÃO DE IDIOMA",
    bg: "НАСТРОЙКА НА ЕЗИКА",
  },

  "language.yourLanguage": {
    en: "YOUR LANGUAGE.",
    es: "TU IDIOMA.",
    uk: "ТВОЯ МОВА.",
    ru: "ТВОЙ ЯЗЫК.",
    fr: "TA LANGUE.",
    de: "DEINE SPRACHE.",
    pt: "SEU IDIOMA.",
    bg: "ТВОЯТ ЕЗИК.",
  },

  "language.yourIronage": {
    en: "YOUR IRONAGE.",
    es: "TU IRONAGE.",
    uk: "ТВІЙ IRONAGE.",
    ru: "ТВОЙ IRONAGE.",
    fr: "TON IRONAGE.",
    de: "DEIN IRONAGE.",
    pt: "SEU IRONAGE.",
    bg: "ТВОЯТ IRONAGE.",
  },

  "language.description": {
    en: "Choose the language you want to use throughout IRONAGE.",
    es: "Elige el idioma que quieres usar en IRONAGE.",
    uk: "Обери мову, якою хочеш користуватися в IRONAGE.",
    ru: "Выбери язык, который хочешь использовать в IRONAGE.",
    fr: "Choisis la langue que tu veux utiliser dans IRONAGE.",
    de: "Wähle die Sprache, die du in IRONAGE verwenden möchtest.",
    pt: "Escolha o idioma que deseja usar no IRONAGE.",
    bg: "Избери езика, който искаш да използваш в IRONAGE.",
  },

  /* =====================================================
     WELCOME
  ===================================================== */

  "welcome.athleteSystem": {
    en: "ATHLETE SYSTEM",
    es: "SISTEMA DEL ATLETA",
    uk: "СИСТЕМА АТЛЕТА",
    ru: "СИСТЕМА АТЛЕТА",
    fr: "SYSTÈME ATHLÈTE",
    de: "ATHLETEN-SYSTEM",
    pt: "SISTEMA DO ATLETA",
    bg: "СИСТЕМА ЗА АТЛЕТИ",
  },

  "welcome.buildYourself": {
    en: "BUILD YOURSELF",
    es: "CONSTRÚYETE",
    uk: "СТВОРИ СЕБЕ",
    ru: "СОЗДАЙ СЕБЯ",
    fr: "CONSTRUIS-TOI",
    de: "FORME DICH",
    pt: "CONSTRUA-SE",
    bg: "ИЗГРАДИ СЕБЕ СИ",
  },

  "welcome.become": {
    en: "BECOME",
    es: "VUÉLVETE",
    uk: "СТАНЬ",
    ru: "СТАНЬ",
    fr: "DEVIENS",
    de: "WERDE",
    pt: "TORNE-SE",
    bg: "СТАНИ",
  },

  "welcome.unstoppable": {
    en: "UNSTOPPABLE.",
    es: "IMPARABLE.",
    uk: "НЕСТРИМНИМ.",
    ru: "НЕОСТАНОВИМЫМ.",
    fr: "INARRÊTABLE.",
    de: "UNAUFHALTSAM.",
    pt: "IMPARÁVEL.",
    bg: "НЕСПИРАЕМ.",
  },

  "welcome.disciplineMoment": {
    en: "Discipline is not a moment.",
    es: "La disciplina no es un momento.",
    uk: "Дисципліна — це не момент.",
    ru: "Дисциплина — это не момент.",
    fr: "La discipline n’est pas un moment.",
    de: "Disziplin ist kein Moment.",
    pt: "Disciplina não é um momento.",
    bg: "Дисциплината не е момент.",
  },

  "welcome.lifestyle": {
    en: "It is a lifestyle.",
    es: "Es un estilo de vida.",
    uk: "Це стиль життя.",
    ru: "Это образ жизни.",
    fr: "C’est un mode de vie.",
    de: "Sie ist ein Lebensstil.",
    pt: "É um estilo de vida.",
    bg: "Тя е начин на живот.",
  },

  "welcome.enter": {
    en: "ENTER IRONAGE",
    es: "ENTRAR EN IRONAGE",
    uk: "УВІЙТИ В IRONAGE",
    ru: "ВОЙТИ В IRONAGE",
    fr: "ENTRER DANS IRONAGE",
    de: "IRONAGE BETRETEN",
    pt: "ENTRAR NO IRONAGE",
    bg: "ВЛЕЗ В IRONAGE",
  },

  "welcome.premiumSystem": {
    en: "PREMIUM FITNESS SYSTEM",
    es: "SISTEMA FITNESS PREMIUM",
    uk: "ПРЕМІАЛЬНА ФІТНЕС-СИСТЕМА",
    ru: "ПРЕМИАЛЬНАЯ ФИТНЕС-СИСТЕМА",
    fr: "SYSTÈME FITNESS PREMIUM",
    de: "PREMIUM-FITNESS-SYSTEM",
    pt: "SISTEMA FITNESS PREMIUM",
    bg: "ПРЕМИУМ ФИТНЕС СИСТЕМА",
  },

  /* =====================================================
     AUTH
  ===================================================== */

  "auth.athleteSystem": {
    en: "ATHLETE SYSTEM",
    es: "SISTEMA DEL ATLETA",
    uk: "СИСТЕМА АТЛЕТА",
    ru: "СИСТЕМА АТЛЕТА",
    fr: "SYSTÈME ATHLÈTE",
    de: "ATHLETEN-SYSTEM",
    pt: "SISTEMA DO ATLETA",
    bg: "СИСТЕМА ЗА АТЛЕТИ",
  },

  "auth.joinSystem": {
    en: "JOIN THE SYSTEM",
    es: "ÚNETE AL SISTEMA",
    uk: "ПРИЄДНУЙСЯ ДО СИСТЕМИ",
    ru: "ПРИСОЕДИНЯЙСЯ К СИСТЕМЕ",
    fr: "REJOINS LE SYSTÈME",
    de: "TRITT DEM SYSTEM BEI",
    pt: "ENTRE NO SISTEMA",
    bg: "ПРИСЪЕДИНИ СЕ КЪМ СИСТЕМАТА",
  },

  "auth.welcomeBack": {
    en: "WELCOME BACK",
    es: "BIENVENIDO DE NUEVO",
    uk: "З ПОВЕРНЕННЯМ",
    ru: "С ВОЗВРАЩЕНИЕМ",
    fr: "BON RETOUR",
    de: "WILLKOMMEN ZURÜCK",
    pt: "BEM-VINDO DE VOLTA",
    bg: "ДОБРЕ ДОШЪЛ ОТНОВО",
  },

  "auth.readyRegister1": {
    en: "ARE YOU READY",
    es: "¿ESTÁS LISTO",
    uk: "ТИ ГОТОВИЙ",
    ru: "ТЫ ГОТОВ",
    fr: "ES-TU PRÊT",
    de: "BIST DU BEREIT",
    pt: "VOCÊ ESTÁ PRONTO",
    bg: "ГОТОВ ЛИ СИ",
  },

  "auth.readyRegister2": {
    en: "TO WORK?",
    es: "PARA TRABAJAR?",
    uk: "ПРАЦЮВАТИ?",
    ru: "РАБОТАТЬ?",
    fr: "À TRAVAILLER ?",
    de: "ZU ARBEITEN?",
    pt: "PARA TRABALHAR?",
    bg: "ДА РАБОТИШ?",
  },

  "auth.readyLogin1": {
    en: "READY TO",
    es: "LISTO PARA",
    uk: "ГОТОВИЙ",
    ru: "ГОТОВ",
    fr: "PRÊT À",
    de: "BEREIT",
    pt: "PRONTO PARA",
    bg: "ГОТОВ ДА",
  },

  "auth.readyLogin2": {
    en: "CONTINUE?",
    es: "CONTINUAR?",
    uk: "ПРОДОВЖИТИ?",
    ru: "ПРОДОЛЖИТЬ?",
    fr: "CONTINUER ?",
    de: "WEITERZUMACHEN?",
    pt: "CONTINUAR?",
    bg: "ПРОДЪЛЖИШ?",
  },

  "auth.registerIntro": {
    en: "Build discipline. Track progress. Become stronger every day.",
    es: "Construye disciplina. Sigue tu progreso. Hazte más fuerte cada día.",
    uk: "Будуй дисципліну. Відстежуй прогрес. Ставай сильнішим щодня.",
    ru: "Строй дисциплину. Следи за прогрессом. Становись сильнее каждый день.",
    fr: "Construis ta discipline. Suis tes progrès. Deviens plus fort chaque jour.",
    de: "Baue Disziplin auf. Verfolge deinen Fortschritt. Werde jeden Tag stärker.",
    pt: "Construa disciplina. Acompanhe o progresso. Fique mais forte a cada dia.",
    bg: "Изгради дисциплина. Следи прогреса. Ставай по-силен всеки ден.",
  },

  "auth.loginIntro": {
    en: "Sign in and continue your IRONAGE journey.",
    es: "Inicia sesión y continúa tu camino en IRONAGE.",
    uk: "Увійди та продовж свій шлях в IRONAGE.",
    ru: "Войди и продолжи свой путь в IRONAGE.",
    fr: "Connecte-toi et continue ton parcours IRONAGE.",
    de: "Melde dich an und setze deine IRONAGE-Reise fort.",
    pt: "Entre e continue sua jornada IRONAGE.",
    bg: "Влез и продължи пътя си в IRONAGE.",
  },

  "auth.continueGoogle": {
    en: "CONTINUE WITH GOOGLE",
    es: "CONTINUAR CON GOOGLE",
    uk: "ПРОДОВЖИТИ З GOOGLE",
    ru: "ПРОДОЛЖИТЬ С GOOGLE",
    fr: "CONTINUER AVEC GOOGLE",
    de: "MIT GOOGLE FORTFAHREN",
    pt: "CONTINUAR COM GOOGLE",
    bg: "ПРОДЪЛЖИ С GOOGLE",
  },

  "auth.continueApple": {
    en: "CONTINUE WITH APPLE",
    es: "CONTINUAR CON APPLE",
    uk: "ПРОДОВЖИТИ З APPLE",
    ru: "ПРОДОЛЖИТЬ С APPLE",
    fr: "CONTINUER AVEC APPLE",
    de: "MIT APPLE FORTFAHREN",
    pt: "CONTINUAR COM APPLE",
    bg: "ПРОДЪЛЖИ С APPLE",
  },

  "auth.appleComingSoon": {
    en: "APPLE AUTH COMING SOON",
    es: "APPLE AUTH PRÓXIMAMENTE",
    uk: "ВХІД ЧЕРЕЗ APPLE СКОРО",
    ru: "ВХОД ЧЕРЕЗ APPLE СКОРО",
    fr: "CONNEXION APPLE BIENTÔT DISPONIBLE",
    de: "APPLE-ANMELDUNG KOMMT BALD",
    pt: "LOGIN COM APPLE EM BREVE",
    bg: "ВХОДЪТ С APPLE ОЧАКВАЙТЕ СКОРО",
  },

  "auth.or": {
    en: "OR",
    es: "O",
    uk: "АБО",
    ru: "ИЛИ",
    fr: "OU",
    de: "ODER",
    pt: "OU",
    bg: "ИЛИ",
  },

  "auth.firstName": {
    en: "FIRST NAME",
    es: "NOMBRE",
    uk: "ІМ'Я",
    ru: "ИМЯ",
    fr: "PRÉNOM",
    de: "VORNAME",
    pt: "NOME",
    bg: "ИМЕ",
  },

  "auth.namePlaceholder": {
    en: "Your name",
    es: "Tu nombre",
    uk: "Твоє ім'я",
    ru: "Твоё имя",
    fr: "Ton prénom",
    de: "Dein Name",
    pt: "Seu nome",
    bg: "Твоето име",
  },

  "auth.email": {
    en: "EMAIL",
    es: "EMAIL",
    uk: "EMAIL",
    ru: "EMAIL",
    fr: "EMAIL",
    de: "E-MAIL",
    pt: "EMAIL",
    bg: "EMAIL",
  },

  "auth.password": {
    en: "PASSWORD",
    es: "CONTRASEÑA",
    uk: "ПАРОЛЬ",
    ru: "ПАРОЛЬ",
    fr: "MOT DE PASSE",
    de: "PASSWORT",
    pt: "SENHA",
    bg: "ПАРОЛА",
  },

  "auth.passwordPlaceholder": {
    en: "Minimum 8 characters",
    es: "Mínimo 8 caracteres",
    uk: "Мінімум 8 символів",
    ru: "Минимум 8 символов",
    fr: "Minimum 8 caractères",
    de: "Mindestens 8 Zeichen",
    pt: "Mínimo de 8 caracteres",
    bg: "Минимум 8 символа",
  },

  "auth.pleaseWait": {
    en: "PLEASE WAIT...",
    es: "ESPERA...",
    uk: "ЗАЧЕКАЙ...",
    ru: "ПОДОЖДИ...",
    fr: "PATIENTE...",
    de: "BITTE WARTEN...",
    pt: "AGUARDE...",
    bg: "МОЛЯ, ИЗЧАКАЙ...",
  },

  "auth.createAccount": {
    en: "CREATE ACCOUNT",
    es: "CREAR CUENTA",
    uk: "СТВОРИТИ АКАУНТ",
    ru: "СОЗДАТЬ АККАУНТ",
    fr: "CRÉER UN COMPTE",
    de: "KONTO ERSTELLEN",
    pt: "CRIAR CONTA",
    bg: "СЪЗДАЙ АКАУНТ",
  },

  "auth.signIn": {
    en: "SIGN IN",
    es: "INICIAR SESIÓN",
    uk: "УВІЙТИ",
    ru: "ВОЙТИ",
    fr: "SE CONNECTER",
    de: "ANMELDEN",
    pt: "ENTRAR",
    bg: "ВХОД",
  },

  "auth.haveAccount": {
    en: "ALREADY HAVE AN ACCOUNT? SIGN IN",
    es: "¿YA TIENES CUENTA? INICIA SESIÓN",
    uk: "ВЖЕ Є АКАУНТ? УВІЙТИ",
    ru: "УЖЕ ЕСТЬ АККАУНТ? ВОЙТИ",
    fr: "DÉJÀ UN COMPTE ? SE CONNECTER",
    de: "SCHON EIN KONTO? ANMELDEN",
    pt: "JÁ TEM CONTA? ENTRAR",
    bg: "ВЕЧЕ ИМАШ АКАУНТ? ВЛЕЗ",
  },

  "auth.noAccount": {
    en: "DON'T HAVE AN ACCOUNT? CREATE ACCOUNT",
    es: "¿NO TIENES CUENTA? CREA UNA",
    uk: "НЕМАЄ АКАУНТА? СТВОРИТИ",
    ru: "НЕТ АККАУНТА? СОЗДАТЬ",
    fr: "PAS DE COMPTE ? CRÉER UN COMPTE",
    de: "NOCH KEIN KONTO? KONTO ERSTELLEN",
    pt: "NÃO TEM CONTA? CRIAR CONTA",
    bg: "НЯМАШ АКАУНТ? СЪЗДАЙ",
  },

  "auth.legalPrefix": {
    en: "By continuing you agree to the",
    es: "Al continuar aceptas los",
    uk: "Продовжуючи, ти погоджуєшся з",
    ru: "Продолжая, ты соглашаешься с",
    fr: "En continuant, tu acceptes les",
    de: "Wenn du fortfährst, stimmst du den",
    pt: "Ao continuar, você concorda com os",
    bg: "Продължавайки, се съгласяваш с",
  },

  "auth.terms": {
    en: "Terms",
    es: "Términos",
    uk: "Умовами",
    ru: "Условиями",
    fr: "Conditions",
    de: "Bedingungen",
    pt: "Termos",
    bg: "Условията",
  },

  "auth.and": {
    en: "and",
    es: "y",
    uk: "та",
    ru: "и",
    fr: "et la",
    de: "und der",
    pt: "e a",
    bg: "и",
  },

  "auth.privacy": {
    en: "Privacy Policy",
    es: "Política de privacidad",
    uk: "Політикою конфіденційності",
    ru: "Политикой конфиденциальности",
    fr: "Politique de confidentialité",
    de: "Datenschutzerklärung",
    pt: "Política de Privacidade",
    bg: "Политиката за поверителност",
  },

  "auth.footer": {
    en: "IRONAGE FITNESS SYSTEM",
    es: "SISTEMA FITNESS IRONAGE",
    uk: "ФІТНЕС-СИСТЕМА IRONAGE",
    ru: "ФИТНЕС-СИСТЕМА IRONAGE",
    fr: "SYSTÈME FITNESS IRONAGE",
    de: "IRONAGE FITNESS-SYSTEM",
    pt: "SISTEMA FITNESS IRONAGE",
    bg: "ФИТНЕС СИСТЕМА IRONAGE",
  },

  "auth.enterName": {
    en: "ENTER YOUR NAME",
    es: "INTRODUCE TU NOMBRE",
    uk: "ВВЕДИ СВОЄ ІМ'Я",
    ru: "ВВЕДИ СВОЁ ИМЯ",
    fr: "ENTRE TON PRÉNOM",
    de: "GIB DEINEN NAMEN EIN",
    pt: "DIGITE SEU NOME",
    bg: "ВЪВЕДИ ИМЕТО СИ",
  },

  "auth.enterEmail": {
    en: "ENTER YOUR EMAIL",
    es: "INTRODUCE TU EMAIL",
    uk: "ВВЕДИ EMAIL",
    ru: "ВВЕДИ EMAIL",
    fr: "ENTRE TON EMAIL",
    de: "GIB DEINE E-MAIL EIN",
    pt: "DIGITE SEU EMAIL",
    bg: "ВЪВЕДИ EMAIL",
  },

  "auth.passwordMin": {
    en: "PASSWORD MUST BE AT LEAST 8 CHARACTERS",
    es: "LA CONTRASEÑA DEBE TENER AL MENOS 8 CARACTERES",
    uk: "ПАРОЛЬ МАЄ МІСТИТИ ЩОНАЙМЕНШЕ 8 СИМВОЛІВ",
    ru: "ПАРОЛЬ ДОЛЖЕН СОДЕРЖАТЬ НЕ МЕНЕЕ 8 СИМВОЛОВ",
    fr: "LE MOT DE PASSE DOIT CONTENIR AU MOINS 8 CARACTÈRES",
    de: "DAS PASSWORT MUSS MINDESTENS 8 ZEICHEN HABEN",
    pt: "A SENHA DEVE TER PELO MENOS 8 CARACTERES",
    bg: "ПАРОЛАТА ТРЯБВА ДА Е ПОНЕ 8 СИМВОЛА",
  },

  "auth.verifyEmail": {
    en: "CHECK YOUR EMAIL TO VERIFY YOUR ACCOUNT",
    es: "REVISA TU EMAIL PARA VERIFICAR TU CUENTA",
    uk: "ПЕРЕВІР EMAIL, ЩОБ ПІДТВЕРДИТИ АКАУНТ",
    ru: "ПРОВЕРЬ EMAIL, ЧТОБЫ ПОДТВЕРДИТЬ АККАУНТ",
    fr: "VÉRIFIE TON EMAIL POUR CONFIRMER TON COMPTE",
    de: "PRÜFE DEINE E-MAIL, UM DEIN KONTO ZU BESTÄTIGEN",
    pt: "VERIFIQUE SEU EMAIL PARA CONFIRMAR SUA CONTA",
    bg: "ПРОВЕРИ EMAIL-А СИ, ЗА ДА ПОТВЪРДИШ АКАУНТА",
  },

  "auth.failed": {
    en: "AUTHENTICATION FAILED",
    es: "ERROR DE AUTENTICACIÓN",
    uk: "ПОМИЛКА АВТОРИЗАЦІЇ",
    ru: "ОШИБКА АВТОРИЗАЦИИ",
    fr: "ÉCHEC DE L’AUTHENTIFICATION",
    de: "AUTHENTIFIZIERUNG FEHLGESCHLAGEN",
    pt: "FALHA NA AUTENTICAÇÃO",
    bg: "НЕУСПЕШНО УДОСТОВЕРЯВАНЕ",
  },

  "auth.googleFailed": {
    en: "GOOGLE AUTHENTICATION FAILED",
    es: "ERROR DE AUTENTICACIÓN DE GOOGLE",
    uk: "ПОМИЛКА ВХОДУ ЧЕРЕЗ GOOGLE",
    ru: "ОШИБКА ВХОДА ЧЕРЕЗ GOOGLE",
    fr: "ÉCHEC DE LA CONNEXION GOOGLE",
    de: "GOOGLE-ANMELDUNG FEHLGESCHLAGEN",
    pt: "FALHA NO LOGIN COM GOOGLE",
    bg: "НЕУСПЕШЕН ВХОД С GOOGLE",
  },

  /* =====================================================
     VERIFY EMAIL
  ===================================================== */

  "verify.verifying": {
    en: "VERIFYING YOUR EMAIL...",
    es: "VERIFICANDO TU EMAIL...",
    uk: "ПІДТВЕРДЖУЄМО EMAIL...",
    ru: "ПОДТВЕРЖДАЕМ EMAIL...",
    fr: "VÉRIFICATION DE TON EMAIL...",
    de: "E-MAIL WIRD BESTÄTIGT...",
    pt: "VERIFICANDO SEU EMAIL...",
    bg: "ПОТВЪРЖДАВАМЕ EMAIL-А...",
  },

  "verify.invalid": {
    en: "VERIFICATION LINK IS INVALID",
    es: "EL ENLACE DE VERIFICACIÓN NO ES VÁLIDO",
    uk: "ПОСИЛАННЯ ДЛЯ ПІДТВЕРДЖЕННЯ НЕДІЙСНЕ",
    ru: "ССЫЛКА ПОДТВЕРЖДЕНИЯ НЕДЕЙСТВИТЕЛЬНА",
    fr: "LE LIEN DE VÉRIFICATION EST INVALIDE",
    de: "DER BESTÄTIGUNGSLINK IST UNGÜLTIG",
    pt: "O LINK DE VERIFICAÇÃO É INVÁLIDO",
    bg: "ЛИНКЪТ ЗА ПОТВЪРЖДЕНИЕ Е НЕВАЛИДЕН",
  },

  "verify.verified": {
    en: "EMAIL VERIFIED",
    es: "EMAIL VERIFICADO",
    uk: "EMAIL ПІДТВЕРДЖЕНО",
    ru: "EMAIL ПОДТВЕРЖДЁН",
    fr: "EMAIL VÉRIFIÉ",
    de: "E-MAIL BESTÄTIGT",
    pt: "EMAIL VERIFICADO",
    bg: "EMAIL-А Е ПОТВЪРДЕН",
  },

  "verify.failed": {
    en: "EMAIL VERIFICATION FAILED",
    es: "ERROR AL VERIFICAR EL EMAIL",
    uk: "НЕ ВДАЛОСЯ ПІДТВЕРДИТИ EMAIL",
    ru: "НЕ УДАЛОСЬ ПОДТВЕРДИТЬ EMAIL",
    fr: "ÉCHEC DE LA VÉRIFICATION DE L’EMAIL",
    de: "E-MAIL-BESTÄTIGUNG FEHLGESCHLAGEN",
    pt: "FALHA NA VERIFICAÇÃO DO EMAIL",
    bg: "ПОТВЪРЖДЕНИЕТО НА EMAIL-А Е НЕУСПЕШНО",
  },

  "verify.wait": {
    en: "Please wait while we activate your IRONAGE account.",
    es: "Espera mientras activamos tu cuenta IRONAGE.",
    uk: "Зачекай, поки ми активуємо твій акаунт IRONAGE.",
    ru: "Подожди, пока мы активируем твой аккаунт IRONAGE.",
    fr: "Patiente pendant l’activation de ton compte IRONAGE.",
    de: "Bitte warte, während wir dein IRONAGE-Konto aktivieren.",
    pt: "Aguarde enquanto ativamos sua conta IRONAGE.",
    bg: "Изчакай, докато активираме твоя IRONAGE акаунт.",
  },

  "verify.active": {
    en: "Your account is active. IRONAGE is loading your profile.",
    es: "Tu cuenta está activa. IRONAGE está cargando tu perfil.",
    uk: "Твій акаунт активний. IRONAGE завантажує профіль.",
    ru: "Твой аккаунт активен. IRONAGE загружает профиль.",
    fr: "Ton compte est actif. IRONAGE charge ton profil.",
    de: "Dein Konto ist aktiv. IRONAGE lädt dein Profil.",
    pt: "Sua conta está ativa. O IRONAGE está carregando seu perfil.",
    bg: "Акаунтът ти е активен. IRONAGE зарежда профила ти.",
  },

  "verify.expired": {
    en: "The link may be invalid or expired. Return to IRONAGE and request a new verification email.",
    es: "El enlace puede ser inválido o haber caducado. Vuelve a IRONAGE y solicita otro email.",
    uk: "Посилання може бути недійсним або простроченим. Повернись в IRONAGE та запроси новий лист.",
    ru: "Ссылка может быть недействительной или просроченной. Вернись в IRONAGE и запроси новое письмо.",
    fr: "Le lien peut être invalide ou expiré. Retourne dans IRONAGE et demande un nouvel email.",
    de: "Der Link ist möglicherweise ungültig oder abgelaufen. Kehre zu IRONAGE zurück und fordere eine neue E-Mail an.",
    pt: "O link pode ser inválido ou ter expirado. Volte ao IRONAGE e solicite um novo email.",
    bg: "Линкът може да е невалиден или изтекъл. Върни се в IRONAGE и поискай нов email.",
  },

  "verify.return": {
    en: "RETURN TO IRONAGE",
    es: "VOLVER A IRONAGE",
    uk: "ПОВЕРНУТИСЯ В IRONAGE",
    ru: "ВЕРНУТЬСЯ В IRONAGE",
    fr: "RETOURNER À IRONAGE",
    de: "ZURÜCK ZU IRONAGE",
    pt: "VOLTAR AO IRONAGE",
    bg: "ВЪРНИ СЕ В IRONAGE",
  },

  /* =====================================================
     ONBOARDING COMMON
  ===================================================== */

  "onboarding.profile": {
    en: "YOUR PROFILE",
    es: "TU PERFIL",
    uk: "ТВІЙ ПРОФІЛЬ",
    ru: "ТВОЙ ПРОФИЛЬ",
    fr: "TON PROFIL",
    de: "DEIN PROFIL",
    pt: "SEU PERFIL",
    bg: "ТВОЯТ ПРОФИЛ",
  },

  "onboarding.bodyMetrics": {
    en: "BODY METRICS",
    es: "DATOS CORPORALES",
    uk: "ПАРАМЕТРИ ТІЛА",
    ru: "ПАРАМЕТРЫ ТЕЛА",
    fr: "MESURES CORPORELLES",
    de: "KÖRPERWERTE",
    pt: "MEDIDAS CORPORAIS",
    bg: "ТЕЛЕСНИ ПОКАЗАТЕЛИ",
  },

  "onboarding.mission": {
    en: "YOUR MISSION",
    es: "TU MISIÓN",
    uk: "ТВОЯ МІСІЯ",
    ru: "ТВОЯ МИССИЯ",
    fr: "TA MISSION",
    de: "DEINE MISSION",
    pt: "SUA MISSÃO",
    bg: "ТВОЯТА МИСИЯ",
  },

  "onboarding.continue": {
    en: "CONTINUE",
    es: "CONTINUAR",
    uk: "ПРОДОВЖИТИ",
    ru: "ПРОДОЛЖИТЬ",
    fr: "CONTINUER",
    de: "WEITER",
    pt: "CONTINUAR",
    bg: "ПРОДЪЛЖИ",
  },

  "onboarding.athleteSystem": {
    en: "IRONAGE ATHLETE SYSTEM",
    es: "SISTEMA DEL ATLETA IRONAGE",
    uk: "СИСТЕМА АТЛЕТА IRONAGE",
    ru: "СИСТЕМА АТЛЕТА IRONAGE",
    fr: "SYSTÈME ATHLÈTE IRONAGE",
    de: "IRONAGE ATHLETEN-SYSTEM",
    pt: "SISTEMA DO ATLETA IRONAGE",
    bg: "СИСТЕМА ЗА АТЛЕТИ IRONAGE",
  },

  "onboarding.saving": {
    en: "SAVING PROFILE...",
    es: "GUARDANDO PERFIL...",
    uk: "ЗБЕРІГАЄМО ПРОФІЛЬ...",
    ru: "СОХРАНЯЕМ ПРОФИЛЬ...",
    fr: "ENREGISTREMENT DU PROFIL...",
    de: "PROFIL WIRD GESPEICHERT...",
    pt: "SALVANDO PERFIL...",
    bg: "ЗАПАЗВАМЕ ПРОФИЛА...",
  },

  /* NAME */

  "onboarding.name.eyebrow": {
    en: "LET'S GET STARTED",
    es: "EMPECEMOS",
    uk: "ПОЧИНАЙМО",
    ru: "НАЧНЁМ",
    fr: "COMMENÇONS",
    de: "LOS GEHT'S",
    pt: "VAMOS COMEÇAR",
    bg: "ДА ЗАПОЧВАМЕ",
  },

  "onboarding.name.title1": {
    en: "WHAT'S",
    es: "¿CUÁL ES",
    uk: "ЯК",
    ru: "КАК",
    fr: "QUEL EST",
    de: "WIE IST",
    pt: "QUAL É",
    bg: "КАК",
  },

  "onboarding.name.title2": {
    en: "YOUR NAME?",
    es: "TU NOMBRE?",
    uk: "ТЕБЕ ЗВАТИ?",
    ru: "ТЕБЯ ЗОВУТ?",
    fr: "TON PRÉNOM ?",
    de: "DEIN NAME?",
    pt: "SEU NOME?",
    bg: "СЕ КАЗВАШ?",
  },

  "onboarding.name.desc1": {
    en: "Your journey starts with one decision.",
    es: "Tu camino comienza con una decisión.",
    uk: "Твій шлях починається з одного рішення.",
    ru: "Твой путь начинается с одного решения.",
    fr: "Ton parcours commence par une décision.",
    de: "Deine Reise beginnt mit einer Entscheidung.",
    pt: "Sua jornada começa com uma decisão.",
    bg: "Твоят път започва с едно решение.",
  },

  "onboarding.name.desc2": {
    en: "Let's make it count.",
    es: "Haz que cuente.",
    uk: "Нехай воно буде важливим.",
    ru: "Пусть оно имеет значение.",
    fr: "Fais en sorte qu’elle compte.",
    de: "Mach sie bedeutend.",
    pt: "Faça valer a pena.",
    bg: "Нека има значение.",
  },

  "onboarding.name.label": {
    en: "YOUR NAME",
    es: "TU NOMBRE",
    uk: "ТВОЄ ІМ'Я",
    ru: "ТВОЁ ИМЯ",
    fr: "TON PRÉNOM",
    de: "DEIN NAME",
    pt: "SEU NOME",
    bg: "ТВОЕТО ИМЕ",
  },

  "onboarding.name.placeholder": {
    en: "Enter your name",
    es: "Escribe tu nombre",
    uk: "Введи своє ім'я",
    ru: "Введи своё имя",
    fr: "Entre ton prénom",
    de: "Gib deinen Namen ein",
    pt: "Digite seu nome",
    bg: "Въведи името си",
  },

  /* AGE */

  "onboarding.age.title1": {
    en: "HOW",
    es: "¿QUÉ",
    uk: "СКІЛЬКИ",
    ru: "СКОЛЬКО",
    fr: "QUEL",
    de: "WIE",
    pt: "QUAL",
    bg: "НА КОЛКО",
  },

  "onboarding.age.title2": {
    en: "OLD ARE YOU?",
    es: "EDAD TIENES?",
    uk: "ТОБІ РОКІВ?",
    ru: "ТЕБЕ ЛЕТ?",
    fr: "ÂGE AS-TU ?",
    de: "ALT BIST DU?",
    pt: "É A SUA IDADE?",
    bg: "ГОДИНИ СИ?",
  },

  "onboarding.age.description": {
    en: "Your age helps IRONAGE build a training system designed specifically for you.",
    es: "Tu edad ayuda a IRONAGE a crear un sistema de entrenamiento específico para ti.",
    uk: "Твій вік допомагає IRONAGE створити систему тренувань саме для тебе.",
    ru: "Твой возраст помогает IRONAGE создать систему тренировок именно для тебя.",
    fr: "Ton âge aide IRONAGE à créer un système d’entraînement adapté à toi.",
    de: "Dein Alter hilft IRONAGE, ein Trainingssystem speziell für dich zu erstellen.",
    pt: "Sua idade ajuda o IRONAGE a criar um sistema de treino específico para você.",
    bg: "Възрастта ти помага на IRONAGE да създаде тренировъчна система специално за теб.",
  },

  "onboarding.age.label": {
    en: "AGE",
    es: "EDAD",
    uk: "ВІК",
    ru: "ВОЗРАСТ",
    fr: "ÂGE",
    de: "ALTER",
    pt: "IDADE",
    bg: "ВЪЗРАСТ",
  },

  /* GENDER */

  "onboarding.gender.title1": {
    en: "CHOOSE",
    es: "ELIGE",
    uk: "ОБЕРИ",
    ru: "ВЫБЕРИ",
    fr: "CHOISIS",
    de: "WÄHLE",
    pt: "ESCOLHA",
    bg: "ИЗБЕРИ",
  },

  "onboarding.gender.title2": {
    en: "YOUR PATH.",
    es: "TU CAMINO.",
    uk: "СВІЙ ШЛЯХ.",
    ru: "СВОЙ ПУТЬ.",
    fr: "TON PARCOURS.",
    de: "DEINEN WEG.",
    pt: "SEU CAMINHO.",
    bg: "СВОЯ ПЪТ.",
  },

  "onboarding.gender.description": {
    en: "Select your profile so IRONAGE can personalize your training experience.",
    es: "Selecciona tu perfil para que IRONAGE personalice tu entrenamiento.",
    uk: "Обери свій профіль, щоб IRONAGE персоналізував тренування.",
    ru: "Выбери профиль, чтобы IRONAGE персонализировал тренировки.",
    fr: "Sélectionne ton profil pour qu’IRONAGE personnalise ton entraînement.",
    de: "Wähle dein Profil, damit IRONAGE dein Training personalisieren kann.",
    pt: "Selecione seu perfil para que o IRONAGE personalize seu treino.",
    bg: "Избери профила си, за да може IRONAGE да персонализира тренировките ти.",
  },

  "onboarding.gender.male": {
    en: "MALE",
    es: "HOMBRE",
    uk: "ЧОЛОВІК",
    ru: "МУЖЧИНА",
    fr: "HOMME",
    de: "MÄNNLICH",
    pt: "HOMEM",
    bg: "МЪЖ",
  },

  "onboarding.gender.female": {
    en: "FEMALE",
    es: "MUJER",
    uk: "ЖІНКА",
    ru: "ЖЕНЩИНА",
    fr: "FEMME",
    de: "WEIBLICH",
    pt: "MULHER",
    bg: "ЖЕНА",
  },

  /* HEIGHT */

  "onboarding.height.title1": {
    en: "HOW",
    es: "¿CUÁN",
    uk: "ЯКИЙ",
    ru: "КАКОЙ",
    fr: "QUELLE",
    de: "WIE",
    pt: "QUAL",
    bg: "КОЛКО",
  },

  "onboarding.height.title2": {
    en: "TALL ARE YOU?",
    es: "ALTO ERES?",
    uk: "У ТЕБЕ ЗРІСТ?",
    ru: "У ТЕБЯ РОСТ?",
    fr: "EST TA TAILLE ?",
    de: "GROSS BIST DU?",
    pt: "É A SUA ALTURA?",
    bg: "СИ ВИСОК?",
  },

  "onboarding.height.description": {
    en: "Your height helps us calculate your ideal training and nutrition targets.",
    es: "Tu altura nos ayuda a calcular tus objetivos ideales de entrenamiento y nutrición.",
    uk: "Твій зріст допомагає розрахувати оптимальні цілі тренувань і харчування.",
    ru: "Твой рост помогает рассчитать оптимальные цели тренировок и питания.",
    fr: "Ta taille nous aide à calculer tes objectifs idéaux d’entraînement et de nutrition.",
    de: "Deine Größe hilft uns, optimale Trainings- und Ernährungsziele zu berechnen.",
    pt: "Sua altura nos ajuda a calcular metas ideais de treino e nutrição.",
    bg: "Ръстът ти ни помага да изчислим оптималните цели за тренировки и хранене.",
  },

  "onboarding.height.decrease": {
    en: "Decrease height",
    es: "Disminuir altura",
    uk: "Зменшити зріст",
    ru: "Уменьшить рост",
    fr: "Diminuer la taille",
    de: "Größe verringern",
    pt: "Diminuir altura",
    bg: "Намали ръста",
  },

  "onboarding.height.increase": {
    en: "Increase height",
    es: "Aumentar altura",
    uk: "Збільшити зріст",
    ru: "Увеличить рост",
    fr: "Augmenter la taille",
    de: "Größe erhöhen",
    pt: "Aumentar altura",
    bg: "Увеличи ръста",
  },

  /* WEIGHT */

  "onboarding.weight.title1": {
    en: "WHAT IS",
    es: "¿CUÁL ES",
    uk: "ЯКА",
    ru: "КАКОЙ",
    fr: "QUEL EST",
    de: "WIE HOCH IST",
    pt: "QUAL É",
    bg: "КАКВО Е",
  },

  "onboarding.weight.title2": {
    en: "YOUR WEIGHT?",
    es: "TU PESO?",
    uk: "ТВОЯ ВАГА?",
    ru: "ТВОЙ ВЕС?",
    fr: "TON POIDS ?",
    de: "DEIN GEWICHT?",
    pt: "SEU PESO?",
    bg: "ТЕГЛОТО ТИ?",
  },

  "onboarding.weight.description": {
    en: "This helps IRONAGE create a more precise training and nutrition system for you.",
    es: "Esto ayuda a IRONAGE a crear un sistema de entrenamiento y nutrición más preciso para ti.",
    uk: "Це допомагає IRONAGE створити точнішу систему тренувань і харчування для тебе.",
    ru: "Это помогает IRONAGE создать более точную систему тренировок и питания для тебя.",
    fr: "Cela aide IRONAGE à créer un système d’entraînement et de nutrition plus précis pour toi.",
    de: "Dies hilft IRONAGE, ein präziseres Trainings- und Ernährungssystem für dich zu erstellen.",
    pt: "Isso ajuda o IRONAGE a criar um sistema de treino e nutrição mais preciso para você.",
    bg: "Това помага на IRONAGE да създаде по-точна система за тренировки и хранене за теб.",
  },

  "onboarding.weight.decrease": {
    en: "Decrease weight",
    es: "Disminuir peso",
    uk: "Зменшити вагу",
    ru: "Уменьшить вес",
    fr: "Diminuer le poids",
    de: "Gewicht verringern",
    pt: "Diminuir peso",
    bg: "Намали теглото",
  },

  "onboarding.weight.increase": {
    en: "Increase weight",
    es: "Aumentar peso",
    uk: "Збільшити вагу",
    ru: "Увеличить вес",
    fr: "Augmenter le poids",
    de: "Gewicht erhöhen",
    pt: "Aumentar peso",
    bg: "Увеличи теглото",
  },

  /* GOAL */

  "onboarding.goal.title1": {
    en: "WHAT DO YOU",
    es: "¿QUÉ QUIERES",
    uk: "ЩО ТИ ХОЧЕШ",
    ru: "ЧТО ТЫ ХОЧЕШЬ",
    fr: "QUE VEUX-TU",
    de: "WAS WILLST DU",
    pt: "O QUE VOCÊ QUER",
    bg: "КАКВО ИСКАШ",
  },

  "onboarding.goal.title2": {
    en: "WANT TO BUILD?",
    es: "CONSTRUIR?",
    uk: "ПОБУДУВАТИ?",
    ru: "ПОСТРОИТЬ?",
    fr: "CONSTRUIRE ?",
    de: "AUFBAUEN?",
    pt: "CONSTRUIR?",
    bg: "ДА ИЗГРАДИШ?",
  },

  "onboarding.goal.description": {
    en: "Choose your primary goal. IRONAGE will adapt your system around it.",
    es: "Elige tu objetivo principal. IRONAGE adaptará tu sistema a él.",
    uk: "Обери головну ціль. IRONAGE адаптує систему під неї.",
    ru: "Выбери главную цель. IRONAGE адаптирует систему под неё.",
    fr: "Choisis ton objectif principal. IRONAGE adaptera ton système autour de celui-ci.",
    de: "Wähle dein Hauptziel. IRONAGE passt dein System daran an.",
    pt: "Escolha seu objetivo principal. O IRONAGE adaptará seu sistema a ele.",
    bg: "Избери основната си цел. IRONAGE ще адаптира системата според нея.",
  },

  "onboarding.goal.muscle": {
    en: "BUILD MUSCLE",
    es: "GANAR MÚSCULO",
    uk: "НАБРАТИ М'ЯЗИ",
    ru: "НАБРАТЬ МЫШЦЫ",
    fr: "PRENDRE DU MUSCLE",
    de: "MUSKELN AUFBAUEN",
    pt: "GANHAR MÚSCULO",
    bg: "ИЗГРАДИ МУСКУЛИ",
  },

  "onboarding.goal.muscleSub": {
    en: "SIZE & PHYSIQUE",
    es: "VOLUMEN Y FÍSICO",
    uk: "ОБ'ЄМ І ФОРМА",
    ru: "ОБЪЁМ И ФОРМА",
    fr: "VOLUME & PHYSIQUE",
    de: "MASSE & KÖRPERBAU",
    pt: "VOLUME & FÍSICO",
    bg: "ОБЕМ И ФИЗИКА",
  },

  "onboarding.goal.fat": {
    en: "LOSE FAT",
    es: "PERDER GRASA",
    uk: "СПАЛИТИ ЖИР",
    ru: "СЖЕЧЬ ЖИР",
    fr: "PERDRE DU GRAS",
    de: "FETT VERLIEREN",
    pt: "PERDER GORDURA",
    bg: "ИЗГОРИ МАЗНИНИ",
  },

  "onboarding.goal.fatSub": {
    en: "LEAN & DEFINED",
    es: "DEFINIDO Y SECO",
    uk: "СУХІСТЬ І РЕЛЬЄФ",
    ru: "СУХОСТЬ И РЕЛЬЕФ",
    fr: "SEC & DÉFINI",
    de: "DEFINIERT & SCHLANK",
    pt: "SECO & DEFINIDO",
    bg: "СТЕГНАТ И РЕЛЕФЕН",
  },

  "onboarding.goal.strength": {
    en: "GET STRONGER",
    es: "SER MÁS FUERTE",
    uk: "СТАТИ СИЛЬНІШИМ",
    ru: "СТАТЬ СИЛЬНЕЕ",
    fr: "DEVENIR PLUS FORT",
    de: "STÄRKER WERDEN",
    pt: "FICAR MAIS FORTE",
    bg: "СТАНИ ПО-СИЛЕН",
  },

  "onboarding.goal.strengthSub": {
    en: "POWER & PERFORMANCE",
    es: "FUERZA Y RENDIMIENTO",
    uk: "СИЛА І РЕЗУЛЬТАТ",
    ru: "СИЛА И РЕЗУЛЬТАТ",
    fr: "PUISSANCE & PERFORMANCE",
    de: "KRAFT & LEISTUNG",
    pt: "FORÇA & DESEMPENHO",
    bg: "СИЛА И ПРЕДСТАВЯНЕ",
  },

  "onboarding.goal.fitness": {
    en: "STAY FIT",
    es: "MANTENERSE EN FORMA",
    uk: "БУТИ У ФОРМІ",
    ru: "БЫТЬ В ФОРМЕ",
    fr: "RESTER EN FORME",
    de: "FIT BLEIBEN",
    pt: "FICAR EM FORMA",
    bg: "БЪДИ ВЪВ ФОРМА",
  },

  "onboarding.goal.fitnessSub": {
    en: "HEALTH & CONDITIONING",
    es: "SALUD Y CONDICIÓN",
    uk: "ЗДОРОВ'Я І ФОРМА",
    ru: "ЗДОРОВЬЕ И ФОРМА",
    fr: "SANTÉ & CONDITION",
    de: "GESUNDHEIT & FITNESS",
    pt: "SAÚDE & CONDICIONAMENTO",
    bg: "ЗДРАВЕ И КОНДИЦИЯ",
  },

  /* FINISH */

  "onboarding.finish.activated": {
    en: "ATHLETE SYSTEM ACTIVATED",
    es: "SISTEMA DEL ATLETA ACTIVADO",
    uk: "СИСТЕМУ АТЛЕТА АКТИВОВАНО",
    ru: "СИСТЕМА АТЛЕТА АКТИВИРОВАНА",
    fr: "SYSTÈME ATHLÈTE ACTIVÉ",
    de: "ATHLETEN-SYSTEM AKTIVIERT",
    pt: "SISTEMA DO ATLETA ATIVADO",
    bg: "СИСТЕМАТА ЗА АТЛЕТИ Е АКТИВИРАНА",
  },

  "onboarding.finish.title1": {
    en: "YOU'RE",
    es: "ESTÁS",
    uk: "ТИ",
    ru: "ТЫ",
    fr: "TU ES",
    de: "DU BIST",
    pt: "VOCÊ ESTÁ",
    bg: "ТИ СИ",
  },

  "onboarding.finish.title2": {
    en: "READY.",
    es: "LISTO.",
    uk: "ГОТОВИЙ.",
    ru: "ГОТОВ.",
    fr: "PRÊT.",
    de: "BEREIT.",
    pt: "PRONTO.",
    bg: "ГОТОВ.",
  },

  "onboarding.finish.journey": {
    en: "Your IRONAGE journey starts now.",
    es: "Tu camino IRONAGE comienza ahora.",
    uk: "Твій шлях IRONAGE починається зараз.",
    ru: "Твой путь IRONAGE начинается сейчас.",
    fr: "Ton parcours IRONAGE commence maintenant.",
    de: "Deine IRONAGE-Reise beginnt jetzt.",
    pt: "Sua jornada IRONAGE começa agora.",
    bg: "Твоят път в IRONAGE започва сега.",
  },

  "onboarding.finish.noExcuses": {
    en: "No excuses. No looking back.",
    es: "Sin excusas. Sin mirar atrás.",
    uk: "Без виправдань. Без погляду назад.",
    ru: "Без оправданий. Без оглядки назад.",
    fr: "Pas d’excuses. Pas de retour en arrière.",
    de: "Keine Ausreden. Kein Zurückblicken.",
    pt: "Sem desculpas. Sem olhar para trás.",
    bg: "Без оправдания. Без поглед назад.",
  },

  "onboarding.finish.discipline": {
    en: "DISCIPLINE",
    es: "DISCIPLINA",
    uk: "ДИСЦИПЛІНА",
    ru: "ДИСЦИПЛИНА",
    fr: "DISCIPLINE",
    de: "DISZIPLIN",
    pt: "DISCIPLINA",
    bg: "ДИСЦИПЛИНА",
  },

  "onboarding.finish.strength": {
    en: "STRENGTH",
    es: "FUERZA",
    uk: "СИЛА",
    ru: "СИЛА",
    fr: "FORCE",
    de: "STÄRKE",
    pt: "FORÇA",
    bg: "СИЛА",
  },

  "onboarding.finish.results": {
    en: "RESULTS",
    es: "RESULTADOS",
    uk: "РЕЗУЛЬТАТИ",
    ru: "РЕЗУЛЬТАТЫ",
    fr: "RÉSULTATS",
    de: "ERGEBNISSE",
    pt: "RESULTADOS",
    bg: "РЕЗУЛТАТИ",
  },

  "onboarding.finish.enter": {
    en: "ENTER IRONAGE",
    es: "ENTRAR EN IRONAGE",
    uk: "УВІЙТИ В IRONAGE",
    ru: "ВОЙТИ В IRONAGE",
    fr: "ENTRER DANS IRONAGE",
    de: "IRONAGE BETRETEN",
    pt: "ENTRAR NO IRONAGE",
    bg: "ВЛЕЗ В IRONAGE",
  },

  "onboarding.finish.welcome": {
    en: "WELCOME TO THE IRONAGE SYSTEM",
    es: "BIENVENIDO AL SISTEMA IRONAGE",
    uk: "ЛАСКАВО ПРОСИМО ДО СИСТЕМИ IRONAGE",
    ru: "ДОБРО ПОЖАЛОВАТЬ В СИСТЕМУ IRONAGE",
    fr: "BIENVENUE DANS LE SYSTÈME IRONAGE",
    de: "WILLKOMMEN IM IRONAGE-SYSTEM",
    pt: "BEM-VINDO AO SISTEMA IRONAGE",
    bg: "ДОБРЕ ДОШЪЛ В СИСТЕМАТА IRONAGE",
  },

  /* VALIDATION */

  "onboarding.error.name": {
    en: "Enter your name",
    es: "Introduce tu nombre",
    uk: "Введи своє ім'я",
    ru: "Введи своё имя",
    fr: "Entre ton prénom",
    de: "Gib deinen Namen ein",
    pt: "Digite seu nome",
    bg: "Въведи името си",
  },

  "onboarding.error.age": {
    en: "Enter a valid age",
    es: "Introduce una edad válida",
    uk: "Вкажи коректний вік",
    ru: "Укажи корректный возраст",
    fr: "Entre un âge valide",
    de: "Gib ein gültiges Alter ein",
    pt: "Informe uma idade válida",
    bg: "Въведи коректна възраст",
  },

  "onboarding.error.gender": {
    en: "Choose your gender",
    es: "Elige tu género",
    uk: "Обери стать",
    ru: "Выбери пол",
    fr: "Choisis ton sexe",
    de: "Wähle dein Geschlecht",
    pt: "Escolha seu gênero",
    bg: "Избери пол",
  },

  "onboarding.error.height": {
    en: "Enter a valid height",
    es: "Introduce una altura válida",
    uk: "Вкажи коректний зріст",
    ru: "Укажи корректный рост",
    fr: "Entre une taille valide",
    de: "Gib eine gültige Größe ein",
    pt: "Informe uma altura válida",
    bg: "Въведи коректен ръст",
  },

  "onboarding.error.weight": {
    en: "Enter a valid weight",
    es: "Introduce un peso válido",
    uk: "Вкажи коректну вагу",
    ru: "Укажи корректный вес",
    fr: "Entre un poids valide",
    de: "Gib ein gültiges Gewicht ein",
    pt: "Informe um peso válido",
    bg: "Въведи коректно тегло",
  },

  "onboarding.error.goal": {
    en: "Choose your goal",
    es: "Elige tu objetivo",
    uk: "Обери свою ціль",
    ru: "Выбери свою цель",
    fr: "Choisis ton objectif",
    de: "Wähle dein Ziel",
    pt: "Escolha seu objetivo",
    bg: "Избери своята цел",
  },

  "onboarding.error.save": {
    en: "Failed to save profile",
    es: "No se pudo guardar el perfil",
    uk: "Не вдалося зберегти профіль",
    ru: "Не удалось сохранить профиль",
    fr: "Impossible d’enregistrer le profil",
    de: "Profil konnte nicht gespeichert werden",
    pt: "Não foi possível salvar o perfil",
    bg: "Профилът не можа да бъде запазен",
  },

  /* =====================================================
     TAB BAR
  ===================================================== */

  "tab.home": {
    en: "Home",
    es: "Inicio",
    uk: "Головна",
    ru: "Главная",
    fr: "Accueil",
    de: "Start",
    pt: "Início",
    bg: "Начало",
  },

  "tab.workout": {
    en: "Workout",
    es: "Entreno",
    uk: "Тренування",
    ru: "Тренировка",
    fr: "Entraînement",
    de: "Training",
    pt: "Treino",
    bg: "Тренировка",
  },

  "tab.nutrition": {
    en: "Nutrition",
    es: "Nutrición",
    uk: "Харчування",
    ru: "Питание",
    fr: "Nutrition",
    de: "Ernährung",
    pt: "Nutrição",
    bg: "Хранене",
  },

  "tab.progress": {
    en: "Progress",
    es: "Progreso",
    uk: "Прогрес",
    ru: "Прогресс",
    fr: "Progrès",
    de: "Fortschritt",
    pt: "Progresso",
    bg: "Прогрес",
  },

  "tab.profile": {
    en: "Profile",
    es: "Perfil",
    uk: "Профіль",
    ru: "Профиль",
    fr: "Profil",
    de: "Profil",
    pt: "Perfil",
    bg: "Профил",
  },

  "tab.ai": {
    en: "AI",
    es: "IA",
    uk: "AI",
    ru: "ИИ",
    fr: "IA",
    de: "KI",
    pt: "IA",
    bg: "AI",
  },

  "tab.navigation": {
    en: "Main navigation",
    es: "Navegación principal",
    uk: "Головна навігація",
    ru: "Главная навигация",
    fr: "Navigation principale",
    de: "Hauptnavigation",
    pt: "Navegação principal",
    bg: "Основна навигация",
  },

  /* =====================================================
     DASHBOARD
  ===================================================== */

  "dashboard.athlete": {
    en: "ATHLETE",
    es: "ATLETA",
    uk: "АТЛЕТ",
    ru: "АТЛЕТ",
    fr: "ATHLÈTE",
    de: "ATHLET",
    pt: "ATLETA",
    bg: "АТЛЕТ",
  },

  "dashboard.athleteSystem": {
    en: "ATHLETE SYSTEM / 01",
    es: "SISTEMA DEL ATLETA / 01",
    uk: "СИСТЕМА АТЛЕТА / 01",
    ru: "СИСТЕМА АТЛЕТА / 01",
    fr: "SYSTÈME ATHLÈTE / 01",
    de: "ATHLETEN-SYSTEM / 01",
    pt: "SISTEMA DO ATLETA / 01",
    bg: "СИСТЕМА ЗА АТЛЕТИ / 01",
  },

  "dashboard.openProfile": {
    en: "Open profile",
    es: "Abrir perfil",
    uk: "Відкрити профіль",
    ru: "Открыть профиль",
    fr: "Ouvrir le profil",
    de: "Profil öffnen",
    pt: "Abrir perfil",
    bg: "Отвори профила",
  },

  "dashboard.missionComplete": {
    en: "MISSION COMPLETE",
    es: "MISIÓN COMPLETADA",
    uk: "МІСІЮ ВИКОНАНО",
    ru: "МИССИЯ ВЫПОЛНЕНА",
    fr: "MISSION ACCOMPLIE",
    de: "MISSION ERFÜLLT",
    pt: "MISSÃO CONCLUÍDA",
    bg: "МИСИЯТА Е ИЗПЪЛНЕНА",
  },

  "dashboard.welcomeBack": {
    en: "WELCOME BACK",
    es: "BIENVENIDO DE NUEVO",
    uk: "З ПОВЕРНЕННЯМ",
    ru: "С ВОЗВРАЩЕНИЕМ",
    fr: "BON RETOUR",
    de: "WILLKOMMEN ZURÜCK",
    pt: "BEM-VINDO DE VOLTA",
    bg: "ДОБРЕ ДОШЪЛ ОТНОВО",
  },

  "dashboard.build": {
    en: "BUILD.",
    es: "CONSTRUYE.",
    uk: "БУДУЙ.",
    ru: "СТРОЙ.",
    fr: "CONSTRUIS.",
    de: "BAUE.",
    pt: "CONSTRUA.",
    bg: "ИЗГРАЖДАЙ.",
  },

  "dashboard.disciplineToday": {
    en: "Discipline today.",
    es: "Disciplina hoy.",
    uk: "Дисципліна сьогодні.",
    ru: "Дисциплина сегодня.",
    fr: "Discipline aujourd’hui.",
    de: "Disziplin heute.",
    pt: "Disciplina hoje.",
    bg: "Дисциплина днес.",
  },

  "dashboard.strengthTomorrow": {
    en: "Strength tomorrow.",
    es: "Fuerza mañana.",
    uk: "Сила завтра.",
    ru: "Сила завтра.",
    fr: "Force demain.",
    de: "Stärke morgen.",
    pt: "Força amanhã.",
    bg: "Сила утре.",
  },

  "dashboard.trainAgain": {
    en: "TRAIN AGAIN",
    es: "ENTRENAR DE NUEVO",
    uk: "ТРЕНУВАТИСЯ ЗНОВУ",
    ru: "ТРЕНИРОВАТЬСЯ СНОВА",
    fr: "S’ENTRAÎNER À NOUVEAU",
    de: "NOCHMAL TRAINIEREN",
    pt: "TREINAR NOVAMENTE",
    bg: "ТРЕНИРАЙ ОТНОВО",
  },

  "dashboard.startToday": {
    en: "START TODAY'S WORKOUT",
    es: "EMPEZAR EL ENTRENAMIENTO DE HOY",
    uk: "ПОЧАТИ СЬОГОДНІШНЄ ТРЕНУВАННЯ",
    ru: "НАЧАТЬ СЕГОДНЯШНЮЮ ТРЕНИРОВКУ",
    fr: "COMMENCER L’ENTRAÎNEMENT DU JOUR",
    de: "HEUTIGES TRAINING STARTEN",
    pt: "INICIAR O TREINO DE HOJE",
    bg: "ЗАПОЧНИ ДНЕШНАТА ТРЕНИРОВКА",
  },

  "dashboard.streak": {
    en: "STREAK",
    es: "RACHA",
    uk: "СЕРІЯ",
    ru: "СЕРИЯ",
    fr: "SÉRIE",
    de: "SERIE",
    pt: "SEQUÊNCIA",
    bg: "СЕРИЯ",
  },

  "dashboard.days": {
    en: "DAYS",
    es: "DÍAS",
    uk: "ДНІВ",
    ru: "ДНЕЙ",
    fr: "JOURS",
    de: "TAGE",
    pt: "DIAS",
    bg: "ДНИ",
  },

  "dashboard.level": {
    en: "LEVEL",
    es: "NIVEL",
    uk: "РІВЕНЬ",
    ru: "УРОВЕНЬ",
    fr: "NIVEAU",
    de: "LEVEL",
    pt: "NÍVEL",
    bg: "НИВО",
  },

  "dashboard.current": {
    en: "CURRENT",
    es: "ACTUAL",
    uk: "ПОТОЧНИЙ",
    ru: "ТЕКУЩИЙ",
    fr: "ACTUEL",
    de: "AKTUELL",
    pt: "ATUAL",
    bg: "ТЕКУЩО",
  },

  "dashboard.points": {
    en: "POINTS",
    es: "PUNTOS",
    uk: "БАЛИ",
    ru: "ОЧКИ",
    fr: "POINTS",
    de: "PUNKTE",
    pt: "PONTOS",
    bg: "ТОЧКИ",
  },

  "dashboard.athleteLevel": {
    en: "ATHLETE LEVEL",
    es: "NIVEL DEL ATLETA",
    uk: "РІВЕНЬ АТЛЕТА",
    ru: "УРОВЕНЬ АТЛЕТА",
    fr: "NIVEAU ATHLÈTE",
    de: "ATHLETEN-LEVEL",
    pt: "NÍVEL DO ATLETA",
    bg: "НИВО НА АТЛЕТА",
  },

  "dashboard.levelPrefix": {
    en: "Level",
    es: "Nivel",
    uk: "Рівень",
    ru: "Уровень",
    fr: "Niveau",
    de: "Level",
    pt: "Nível",
    bg: "Ниво",
  },

  "dashboard.yourProgram": {
    en: "YOUR PROGRAM",
    es: "TU PROGRAMA",
    uk: "ТВОЯ ПРОГРАМА",
    ru: "ТВОЯ ПРОГРАММА",
    fr: "TON PROGRAMME",
    de: "DEIN PROGRAMM",
    pt: "SEU PROGRAMA",
    bg: "ТВОЯТА ПРОГРАМА",
  },

  "dashboard.todayMission": {
    en: "Today's Mission",
    es: "Misión de hoy",
    uk: "Сьогоднішня місія",
    ru: "Сегодняшняя миссия",
    fr: "Mission du jour",
    de: "Heutige Mission",
    pt: "Missão de hoje",
    bg: "Днешната мисия",
  },

  "dashboard.viewAll": {
    en: "VIEW ALL",
    es: "VER TODO",
    uk: "ПЕРЕГЛЯНУТИ ВСЕ",
    ru: "СМОТРЕТЬ ВСЕ",
    fr: "TOUT VOIR",
    de: "ALLE ANZEIGEN",
    pt: "VER TUDO",
    bg: "ВИЖ ВСИЧКИ",
  },

  "dashboard.program": {
    en: "IRONAGE / PROGRAM",
    es: "IRONAGE / PROGRAMA",
    uk: "IRONAGE / ПРОГРАМА",
    ru: "IRONAGE / ПРОГРАММА",
    fr: "IRONAGE / PROGRAMME",
    de: "IRONAGE / PROGRAMM",
    pt: "IRONAGE / PROGRAMA",
    bg: "IRONAGE / ПРОГРАМА",
  },

  "dashboard.upperBody": {
    en: "UPPER BODY",
    es: "TREN SUPERIOR",
    uk: "ВЕРХ ТІЛА",
    ru: "ВЕРХ ТЕЛА",
    fr: "HAUT DU CORPS",
    de: "OBERKÖRPER",
    pt: "PARTE SUPERIOR",
    bg: "ГОРНА ЧАСТ",
  },

  "dashboard.chestShouldersArms": {
    en: "Chest • Shoulders • Arms",
    es: "Pecho • Hombros • Brazos",
    uk: "Груди • Плечі • Руки",
    ru: "Грудь • Плечи • Руки",
    fr: "Pectoraux • Épaules • Bras",
    de: "Brust • Schultern • Arme",
    pt: "Peito • Ombros • Braços",
    bg: "Гърди • Рамене • Ръце",
  },

  "dashboard.trainingHistory": {
    en: "TRAINING HISTORY",
    es: "HISTORIAL DE ENTRENAMIENTO",
    uk: "ІСТОРІЯ ТРЕНУВАНЬ",
    ru: "ИСТОРИЯ ТРЕНИРОВОК",
    fr: "HISTORIQUE D’ENTRAÎNEMENT",
    de: "TRAININGSVERLAUF",
    pt: "HISTÓRICO DE TREINOS",
    bg: "ИСТОРИЯ НА ТРЕНИРОВКИТЕ",
  },

  "dashboard.lastWorkout": {
    en: "Last Workout",
    es: "Último entrenamiento",
    uk: "Останнє тренування",
    ru: "Последняя тренировка",
    fr: "Dernier entraînement",
    de: "Letztes Training",
    pt: "Último treino",
    bg: "Последна тренировка",
  },

  "dashboard.progress": {
    en: "PROGRESS",
    es: "PROGRESO",
    uk: "ПРОГРЕС",
    ru: "ПРОГРЕСС",
    fr: "PROGRÈS",
    de: "FORTSCHRITT",
    pt: "PROGRESSO",
    bg: "ПРОГРЕС",
  },

  "dashboard.completed": {
    en: "COMPLETED",
    es: "COMPLETADO",
    uk: "ЗАВЕРШЕНО",
    ru: "ЗАВЕРШЕНО",
    fr: "TERMINÉ",
    de: "ABGESCHLOSSEN",
    pt: "CONCLUÍDO",
    bg: "ЗАВЪРШЕНО",
  },

  "dashboard.min": {
    en: "min",
    es: "min",
    uk: "хв",
    ru: "мин",
    fr: "min",
    de: "Min",
    pt: "min",
    bg: "мин",
  },

  "dashboard.quote1": {
    en: "THE BODY ACHIEVES",
    es: "EL CUERPO CONSIGUE",
    uk: "ТІЛО ДОСЯГАЄ",
    ru: "ТЕЛО ДОСТИГАЕТ",
    fr: "LE CORPS ACCOMPLIT",
    de: "DER KÖRPER ERREICHT",
    pt: "O CORPO ALCANÇA",
    bg: "ТЯЛОТО ПОСТИГА",
  },

  "dashboard.quote2": {
    en: "WHAT THE MIND",
    es: "LO QUE LA MENTE",
    uk: "ТЕ, ВІД ЧОГО РОЗУМ",
    ru: "ТО, ОТ ЧЕГО РАЗУМ",
    fr: "CE QUE L’ESPRIT",
    de: "WAS DER GEIST",
    pt: "O QUE A MENTE",
    bg: "ТОВА, ОТ КОЕТО УМЪТ",
  },

  "dashboard.quote3": {
    en: "REFUSES TO GIVE UP ON.",
    es: "SE NIEGA A RENDIRSE.",
    uk: "ВІДМОВЛЯЄТЬСЯ ЗДАВАТИСЯ.",
    ru: "ОТКАЗЫВАЕТСЯ СДАВАТЬСЯ.",
    fr: "REFUSE D’ABANDONNER.",
    de: "NICHT AUFGIBT.",
    pt: "SE RECUSA A DESISTIR.",
    bg: "ОТКАЗВА ДА СЕ ПРЕДАДЕ.",
  },

  "dashboard.principle": {
    en: "IRONAGE PRINCIPLE / 001",
    es: "PRINCIPIO IRONAGE / 001",
    uk: "ПРИНЦИП IRONAGE / 001",
    ru: "ПРИНЦИП IRONAGE / 001",
    fr: "PRINCIPE IRONAGE / 001",
    de: "IRONAGE PRINZIP / 001",
    pt: "PRINCÍPIO IRONAGE / 001",
    bg: "ПРИНЦИП IRONAGE / 001",
  },

  "dashboard.nutrition": {
    en: "NUTRITION",
    es: "NUTRICIÓN",
    uk: "ХАРЧУВАННЯ",
    ru: "ПИТАНИЕ",
    fr: "NUTRITION",
    de: "ERNÄHRUNG",
    pt: "NUTRIÇÃO",
    bg: "ХРАНЕНЕ",
  },

  "dashboard.aiTrainer": {
    en: "AI TRAINER",
    es: "ENTRENADOR IA",
    uk: "AI ТРЕНЕР",
    ru: "ИИ ТРЕНЕР",
    fr: "COACH IA",
    de: "KI-TRAINER",
    pt: "TREINADOR IA",
    bg: "AI ТРЕНЬОР",
  },

  /* =====================================================
     WORKOUT
  ===================================================== */

  "workout.program": {
    en: "IRONAGE PROGRAM",
    es: "PROGRAMA IRONAGE",
    uk: "ПРОГРАМА IRONAGE",
    ru: "ПРОГРАММА IRONAGE",
    fr: "PROGRAMME IRONAGE",
    de: "IRONAGE PROGRAMM",
    pt: "PROGRAMA IRONAGE",
    bg: "ПРОГРАМА IRONAGE",
  },

  "workout.your": {
    en: "YOUR",
    es: "TUS",
    uk: "ТВОЇ",
    ru: "ТВОИ",
    fr: "TES",
    de: "DEINE",
    pt: "SEUS",
    bg: "ТВОИТЕ",
  },

  "workout.workouts": {
    en: "WORKOUTS.",
    es: "ENTRENAMIENTOS.",
    uk: "ТРЕНУВАННЯ.",
    ru: "ТРЕНИРОВКИ.",
    fr: "ENTRAÎNEMENTS.",
    de: "TRAININGS.",
    pt: "TREINOS.",
    bg: "ТРЕНИРОВКИ.",
  },

  "workout.systemActive": {
    en: "SYSTEM ACTIVE",
    es: "SISTEMA ACTIVO",
    uk: "СИСТЕМА АКТИВНА",
    ru: "СИСТЕМА АКТИВНА",
    fr: "SYSTÈME ACTIF",
    de: "SYSTEM AKTIV",
    pt: "SISTEMA ATIVO",
    bg: "СИСТЕМАТА Е АКТИВНА",
  },

  "workout.trainPurpose": {
    en: "Train with purpose.",
    es: "Entrena con propósito.",
    uk: "Тренуйся з метою.",
    ru: "Тренируйся с целью.",
    fr: "Entraîne-toi avec un objectif.",
    de: "Trainiere mit einem Ziel.",
    pt: "Treine com propósito.",
    bg: "Тренирай с цел.",
  },

  "workout.buildStronger": {
    en: "Build something stronger.",
    es: "Construye algo más fuerte.",
    uk: "Будуй щось сильніше.",
    ru: "Создавай что-то сильнее.",
    fr: "Construis quelque chose de plus fort.",
    de: "Baue etwas Stärkeres auf.",
    pt: "Construa algo mais forte.",
    bg: "Изгради нещо по-силно.",
  },

  "workout.thisWeek": {
    en: "THIS WEEK",
    es: "ESTA SEMANA",
    uk: "ЦЬОГО ТИЖНЯ",
    ru: "НА ЭТОЙ НЕДЕЛЕ",
    fr: "CETTE SEMAINE",
    de: "DIESE WOCHE",
    pt: "ESTA SEMANA",
    bg: "ТАЗИ СЕДМИЦА",
  },

  "workout.trainingProgram": {
    en: "Training Program",
    es: "Programa de entrenamiento",
    uk: "Програма тренувань",
    ru: "Программа тренировок",
    fr: "Programme d’entraînement",
    de: "Trainingsprogramm",
    pt: "Programa de treino",
    bg: "Тренировъчна програма",
  },

  "workout.week": {
    en: "WEEK 01",
    es: "SEMANA 01",
    uk: "ТИЖДЕНЬ 01",
    ru: "НЕДЕЛЯ 01",
    fr: "SEMAINE 01",
    de: "WOCHE 01",
    pt: "SEMANA 01",
    bg: "СЕДМИЦА 01",
  },

  "workout.today45": {
    en: "TODAY / 45 MIN",
    es: "HOY / 45 MIN",
    uk: "СЬОГОДНІ / 45 ХВ",
    ru: "СЕГОДНЯ / 45 МИН",
    fr: "AUJOURD’HUI / 45 MIN",
    de: "HEUTE / 45 MIN",
    pt: "HOJE / 45 MIN",
    bg: "ДНЕС / 45 МИН",
  },

  "workout.48min": {
    en: "48 MIN",
    es: "48 MIN",
    uk: "48 ХВ",
    ru: "48 МИН",
    fr: "48 MIN",
    de: "48 MIN",
    pt: "48 MIN",
    bg: "48 МИН",
  },

  "workout.52min": {
    en: "52 MIN",
    es: "52 MIN",
    uk: "52 ХВ",
    ru: "52 МИН",
    fr: "52 MIN",
    de: "52 MIN",
    pt: "52 MIN",
    bg: "52 МИН",
  },

  "workout.upperTitle": {
    en: "UPPER BODY",
    es: "TREN SUPERIOR",
    uk: "ВЕРХ ТІЛА",
    ru: "ВЕРХ ТЕЛА",
    fr: "HAUT DU CORPS",
    de: "OBERKÖRPER",
    pt: "PARTE SUPERIOR",
    bg: "ГОРНА ЧАСТ",
  },

  "workout.upperDescription": {
    en: "Chest • Shoulders • Arms",
    es: "Pecho • Hombros • Brazos",
    uk: "Груди • Плечі • Руки",
    ru: "Грудь • Плечи • Руки",
    fr: "Pectoraux • Épaules • Bras",
    de: "Brust • Schultern • Arme",
    pt: "Peito • Ombros • Braços",
    bg: "Гърди • Рамене • Ръце",
  },

  "workout.lowerTitle": {
    en: "LOWER BODY",
    es: "TREN INFERIOR",
    uk: "НИЗ ТІЛА",
    ru: "НИЗ ТЕЛА",
    fr: "BAS DU CORPS",
    de: "UNTERKÖRPER",
    pt: "PARTE INFERIOR",
    bg: "ДОЛНА ЧАСТ",
  },

  "workout.lowerDescription": {
    en: "Legs • Glutes • Core",
    es: "Piernas • Glúteos • Core",
    uk: "Ноги • Сідниці • Кор",
    ru: "Ноги • Ягодицы • Кор",
    fr: "Jambes • Fessiers • Gainage",
    de: "Beine • Gesäß • Core",
    pt: "Pernas • Glúteos • Core",
    bg: "Крака • Седалище • Кор",
  },

  "workout.fullTitle": {
    en: "FULL BODY",
    es: "CUERPO COMPLETO",
    uk: "ВСЕ ТІЛО",
    ru: "ВСЁ ТЕЛО",
    fr: "CORPS ENTIER",
    de: "GANZKÖRPER",
    pt: "CORPO INTEIRO",
    bg: "ЦЯЛО ТЯЛО",
  },

  "workout.fullDescription": {
    en: "Strength • Power • Conditioning",
    es: "Fuerza • Potencia • Condición",
    uk: "Сила • Потужність • Витривалість",
    ru: "Сила • Мощность • Выносливость",
    fr: "Force • Puissance • Condition",
    de: "Kraft • Power • Kondition",
    pt: "Força • Potência • Condicionamento",
    bg: "Сила • Мощ • Кондиция",
  },

  "workout.weeklyProgress": {
    en: "WEEKLY PROGRESS",
    es: "PROGRESO SEMANAL",
    uk: "ПРОГРЕС ЗА ТИЖДЕНЬ",
    ru: "ПРОГРЕСС ЗА НЕДЕЛЮ",
    fr: "PROGRÈS HEBDOMADAIRE",
    de: "WOCHENFORTSCHRITT",
    pt: "PROGRESSO SEMANAL",
    bg: "СЕДМИЧЕН ПРОГРЕС",
  },

  "workout.startJourney": {
    en: "START YOUR JOURNEY",
    es: "EMPIEZA TU CAMINO",
    uk: "ПОЧНИ СВІЙ ШЛЯХ",
    ru: "НАЧНИ СВОЙ ПУТЬ",
    fr: "COMMENCE TON PARCOURS",
    de: "STARTE DEINE REISE",
    pt: "COMECE SUA JORNADA",
    bg: "ЗАПОЧНИ СВОЯ ПЪТ",
  },

  "workout.completed": {
    en: "COMPLETED",
    es: "COMPLETADOS",
    uk: "ЗАВЕРШЕНО",
    ru: "ЗАВЕРШЕНО",
    fr: "TERMINÉS",
    de: "ABGESCHLOSSEN",
    pt: "CONCLUÍDOS",
    bg: "ЗАВЪРШЕНИ",
  },

  "workout.mindset": {
    en: "IRONAGE / MINDSET",
    es: "IRONAGE / MENTALIDAD",
    uk: "IRONAGE / МИСЛЕННЯ",
    ru: "IRONAGE / МЫШЛЕНИЕ",
    fr: "IRONAGE / MENTALITÉ",
    de: "IRONAGE / MINDSET",
    pt: "IRONAGE / MENTALIDADE",
    bg: "IRONAGE / НАГЛАСА",
  },

  "workout.no": {
    en: "NO",
    es: "SIN",
    uk: "БЕЗ",
    ru: "БЕЗ",
    fr: "PAS",
    de: "KEINE",
    pt: "SEM",
    bg: "БЕЗ",
  },

  "workout.excuses": {
    en: "EXCUSES.",
    es: "EXCUSAS.",
    uk: "ВИПРАВДАНЬ.",
    ru: "ОПРАВДАНИЙ.",
    fr: "D’EXCUSES.",
    de: "AUSREDEN.",
    pt: "DESCULPAS.",
    bg: "ОПРАВДАНИЯ.",
  },

  "workout.quote": {
    en: "Discipline creates the version of you that others cannot stop.",
    es: "La disciplina crea una versión de ti que nadie puede detener.",
    uk: "Дисципліна створює версію тебе, яку інші не зможуть зупинити.",
    ru: "Дисциплина создаёт версию тебя, которую другие не смогут остановить.",
    fr: "La discipline crée une version de toi que personne ne peut arrêter.",
    de: "Disziplin erschafft eine Version von dir, die niemand stoppen kann.",
    pt: "A disciplina cria uma versão de você que ninguém consegue parar.",
    bg: "Дисциплината създава версия на теб, която никой не може да спре.",
  },


  /* =====================================================
     NUTRITION
  ===================================================== */

  "nutrition.program": {
    en: "IRONAGE PROGRAM",
    es: "PROGRAMA IRONAGE",
    uk: "ПРОГРАМА IRONAGE",
    ru: "ПРОГРАММА IRONAGE",
    fr: "PROGRAMME IRONAGE",
    de: "IRONAGE PROGRAMM",
    pt: "PROGRAMA IRONAGE",
    bg: "ПРОГРАМА IRONAGE",
  },

  "nutrition.title": {
    en: "NUTRITION",
    es: "NUTRICIÓN",
    uk: "ХАРЧУВАННЯ",
    ru: "ПИТАНИЕ",
    fr: "NUTRITION",
    de: "ERNÄHRUNG",
    pt: "NUTRIÇÃO",
    bg: "ХРАНЕНЕ",
  },

  "nutrition.fuel": {
    en: "Fuel your body.",
    es: "Alimenta tu cuerpo.",
    uk: "Живи своє тіло.",
    ru: "Питай своё тело.",
    fr: "Nourris ton corps.",
    de: "Versorge deinen Körper.",
    pt: "Alimente seu corpo.",
    bg: "Зареди тялото си.",
  },

  "nutrition.buildStrength": {
    en: "Build your strength.",
    es: "Construye tu fuerza.",
    uk: "Будуй свою силу.",
    ru: "Развивай свою силу.",
    fr: "Développe ta force.",
    de: "Baue deine Stärke auf.",
    pt: "Construa sua força.",
    bg: "Изгради силата си.",
  },

  "nutrition.today": {
    en: "TODAY",
    es: "HOY",
    uk: "СЬОГОДНІ",
    ru: "СЕГОДНЯ",
    fr: "AUJOURD’HUI",
    de: "HEUTE",
    pt: "HOJE",
    bg: "ДНЕС",
  },

  "nutrition.yesterday": {
    en: "YESTERDAY",
    es: "AYER",
    uk: "ВЧОРА",
    ru: "ВЧЕРА",
    fr: "HIER",
    de: "GESTERN",
    pt: "ONTEM",
    bg: "ВЧЕРА",
  },

  "nutrition.backToday": {
    en: "BACK TO TODAY",
    es: "VOLVER A HOY",
    uk: "ПОВЕРНУТИСЯ ДО СЬОГОДНІ",
    ru: "ВЕРНУТЬСЯ К СЕГОДНЯ",
    fr: "REVENIR À AUJOURD’HUI",
    de: "ZURÜCK ZU HEUTE",
    pt: "VOLTAR PARA HOJE",
    bg: "ОБРАТНО КЪМ ДНЕС",
  },

  "nutrition.calories": {
    en: "CALORIES",
    es: "CALORÍAS",
    uk: "КАЛОРІЇ",
    ru: "КАЛОРИИ",
    fr: "CALORIES",
    de: "KALORIEN",
    pt: "CALORIAS",
    bg: "КАЛОРИИ",
  },

  "nutrition.remaining": {
    en: "kcal remaining",
    es: "kcal restantes",
    uk: "ккал залишилось",
    ru: "ккал осталось",
    fr: "kcal restantes",
    de: "kcal verbleibend",
    pt: "kcal restantes",
    bg: "ккал остават",
  },

  "nutrition.adherence": {
    en: "ADHERENCE",
    es: "CUMPLIMIENTO",
    uk: "ДОТРИМАННЯ",
    ru: "СОБЛЮДЕНИЕ",
    fr: "ADHÉRENCE",
    de: "EINHALTUNG",
    pt: "ADESÃO",
    bg: "СПАЗВАНЕ",
  },

  "nutrition.macronutrients": {
    en: "MACRONUTRIENTS",
    es: "MACRONUTRIENTES",
    uk: "МАКРОНУТРІЄНТИ",
    ru: "МАКРОНУТРИЕНТЫ",
    fr: "MACRONUTRIMENTS",
    de: "MAKRONÄHRSTOFFE",
    pt: "MACRONUTRIENTES",
    bg: "МАКРОНУТРИЕНТИ",
  },

  "nutrition.daily": {
    en: "DAILY",
    es: "DIARIO",
    uk: "ЩОДНЯ",
    ru: "ЕЖЕДНЕВНО",
    fr: "QUOTIDIEN",
    de: "TÄGLICH",
    pt: "DIÁRIO",
    bg: "ДНЕВНО",
  },

  "nutrition.protein": {
    en: "PROTEIN",
    es: "PROTEÍNA",
    uk: "БІЛОК",
    ru: "БЕЛОК",
    fr: "PROTÉINES",
    de: "PROTEIN",
    pt: "PROTEÍNA",
    bg: "ПРОТЕИН",
  },

  "nutrition.carbs": {
    en: "CARBS",
    es: "CARBOHIDRATOS",
    uk: "ВУГЛЕВОДИ",
    ru: "УГЛЕВОДЫ",
    fr: "GLUCIDES",
    de: "KOHLENHYDRATE",
    pt: "CARBOIDRATOS",
    bg: "ВЪГЛЕХИДРАТИ",
  },

  "nutrition.fat": {
    en: "FAT",
    es: "GRASAS",
    uk: "ЖИРИ",
    ru: "ЖИРЫ",
    fr: "LIPIDES",
    de: "FETT",
    pt: "GORDURAS",
    bg: "МАЗНИНИ",
  },

  "nutrition.dailyTarget": {
    en: "DAILY TARGET",
    es: "OBJETIVO DIARIO",
    uk: "ДЕННА ЦІЛЬ",
    ru: "ДНЕВНАЯ ЦЕЛЬ",
    fr: "OBJECTIF QUOTIDIEN",
    de: "TAGESZIEL",
    pt: "META DIÁRIA",
    bg: "ДНЕВНА ЦЕЛ",
  },

  "nutrition.hydration": {
    en: "HYDRATION",
    es: "HIDRATACIÓN",
    uk: "ГІДРАТАЦІЯ",
    ru: "ГИДРАТАЦИЯ",
    fr: "HYDRATATION",
    de: "HYDRATION",
    pt: "HIDRATAÇÃO",
    bg: "ХИДРАТАЦИЯ",
  },

  "nutrition.addFood": {
    en: "ADD FOOD",
    es: "AÑADIR COMIDA",
    uk: "ДОДАТИ ЇЖУ",
    ru: "ДОБАВИТЬ ЕДУ",
    fr: "AJOUTER UN ALIMENT",
    de: "LEBENSMITTEL HINZUFÜGEN",
    pt: "ADICIONAR ALIMENTO",
    bg: "ДОБАВИ ХРАНА",
  },

  "nutrition.foodName": {
    en: "Food name",
    es: "Nombre del alimento",
    uk: "Назва продукту",
    ru: "Название продукта",
    fr: "Nom de l’aliment",
    de: "Lebensmittelname",
    pt: "Nome do alimento",
    bg: "Име на храната",
  },

  "nutrition.caloriesPlaceholder": {
    en: "Calories",
    es: "Calorías",
    uk: "Калорії",
    ru: "Калории",
    fr: "Calories",
    de: "Kalorien",
    pt: "Calorias",
    bg: "Калории",
  },

  "nutrition.proteinPlaceholder": {
    en: "Protein g",
    es: "Proteína g",
    uk: "Білок г",
    ru: "Белок г",
    fr: "Protéines g",
    de: "Protein g",
    pt: "Proteína g",
    bg: "Протеин г",
  },

  "nutrition.fatPlaceholder": {
    en: "Fat g",
    es: "Grasas g",
    uk: "Жири г",
    ru: "Жиры г",
    fr: "Lipides g",
    de: "Fett g",
    pt: "Gordura g",
    bg: "Мазнини г",
  },

  "nutrition.carbsPlaceholder": {
    en: "Carbs g",
    es: "Carbohidratos g",
    uk: "Вуглеводи г",
    ru: "Углеводы г",
    fr: "Glucides g",
    de: "Kohlenhydrate g",
    pt: "Carboidratos g",
    bg: "Въглехидрати г",
  },

  "nutrition.mealsToday": {
    en: "TODAY'S MEALS",
    es: "COMIDAS DE HOY",
    uk: "СЬОГОДНІШНІ ПРИЙОМИ ЇЖІ",
    ru: "СЕГОДНЯШНИЕ ПРИЁМЫ ПИЩИ",
    fr: "REPAS DU JOUR",
    de: "HEUTIGE MAHLZEITEN",
    pt: "REFEIÇÕES DE HOJE",
    bg: "ДНЕШНИ ХРАНЕНИЯ",
  },

  "nutrition.noMeals": {
    en: "No meals added yet.",
    es: "Aún no hay comidas añadidas.",
    uk: "Ще не додано жодного прийому їжі.",
    ru: "Приёмы пищи ещё не добавлены.",
    fr: "Aucun repas ajouté.",
    de: "Noch keine Mahlzeiten hinzugefügt.",
    pt: "Nenhuma refeição adicionada.",
    bg: "Все още няма добавени хранения.",
  },

  "nutrition.history7": {
    en: "7 DAY HISTORY",
    es: "HISTORIAL DE 7 DÍAS",
    uk: "ІСТОРІЯ ЗА 7 ДНІВ",
    ru: "ИСТОРИЯ ЗА 7 ДНЕЙ",
    fr: "HISTORIQUE SUR 7 JOURS",
    de: "7-TAGE-VERLAUF",
    pt: "HISTÓRICO DE 7 DIAS",
    bg: "ИСТОРИЯ ЗА 7 ДНИ",
  },

  "nutrition.average": {
    en: "AVERAGE",
    es: "PROMEDIO",
    uk: "СЕРЕДНЄ",
    ru: "СРЕДНЕЕ",
    fr: "MOYENNE",
    de: "DURCHSCHNITT",
    pt: "MÉDIA",
    bg: "СРЕДНО",
  },

  "nutrition.avgCalories": {
    en: "AVG CALORIES",
    es: "CALORÍAS PROM.",
    uk: "СЕР. КАЛОРІЇ",
    ru: "СР. КАЛОРИИ",
    fr: "CALORIES MOY.",
    de: "Ø KALORIEN",
    pt: "CALORIAS MÉD.",
    bg: "СР. КАЛОРИИ",
  },

  "nutrition.avgProtein": {
    en: "AVG PROTEIN",
    es: "PROTEÍNA PROM.",
    uk: "СЕР. БІЛОК",
    ru: "СР. БЕЛОК",
    fr: "PROTÉINES MOY.",
    de: "Ø PROTEIN",
    pt: "PROTEÍNA MÉD.",
    bg: "СР. ПРОТЕИН",
  },

  "nutrition.avgWater": {
    en: "AVG WATER",
    es: "AGUA PROM.",
    uk: "СЕР. ВОДА",
    ru: "СР. ВОДА",
    fr: "EAU MOY.",
    de: "Ø WASSER",
    pt: "ÁGUA MÉD.",
    bg: "СР. ВОДА",
  },

  "nutrition.breakfast": {
    en: "Breakfast",
    es: "Desayuno",
    uk: "Сніданок",
    ru: "Завтрак",
    fr: "Petit-déjeuner",
    de: "Frühstück",
    pt: "Café da manhã",
    bg: "Закуска",
  },

  "nutrition.lunch": {
    en: "Lunch",
    es: "Almuerzo",
    uk: "Обід",
    ru: "Обед",
    fr: "Déjeuner",
    de: "Mittagessen",
    pt: "Almoço",
    bg: "Обяд",
  },

  "nutrition.dinner": {
    en: "Dinner",
    es: "Cena",
    uk: "Вечеря",
    ru: "Ужин",
    fr: "Dîner",
    de: "Abendessen",
    pt: "Jantar",
    bg: "Вечеря",
  },

  "nutrition.snack": {
    en: "Snack",
    es: "Merienda",
    uk: "Перекус",
    ru: "Перекус",
    fr: "Collation",
    de: "Snack",
    pt: "Lanche",
    bg: "Междинно хранене",
  },

  "nutrition.delete": {
    en: "Delete",
    es: "Eliminar",
    uk: "Видалити",
    ru: "Удалить",
    fr: "Supprimer",
    de: "Löschen",
    pt: "Excluir",
    bg: "Изтрий",
  },

  "nutrition.target": {
    en: "target",
    es: "objetivo",
    uk: "ціль",
    ru: "цель",
    fr: "objectif",
    de: "Ziel",
    pt: "meta",
    bg: "цел",
  },


  /* =====================================================
     PROGRESS
  ===================================================== */

  "progress.performanceSystem": {
    en: "IRONAGE / PERFORMANCE",
    es: "IRONAGE / RENDIMIENTO",
    uk: "IRONAGE / РЕЗУЛЬТАТИ",
    ru: "IRONAGE / РЕЗУЛЬТАТЫ",
    fr: "IRONAGE / PERFORMANCE",
    de: "IRONAGE / LEISTUNG",
    pt: "IRONAGE / DESEMPENHO",
    bg: "IRONAGE / ПРЕДСТАВЯНЕ",
  },

  "progress.your": {
    en: "YOUR",
    es: "TU",
    uk: "ТВІЙ",
    ru: "ТВОЙ",
    fr: "TON",
    de: "DEIN",
    pt: "SEU",
    bg: "ТВОЯТ",
  },

  "progress.title": {
    en: "PROGRESS.",
    es: "PROGRESO.",
    uk: "ПРОГРЕС.",
    ru: "ПРОГРЕСС.",
    fr: "PROGRÈS.",
    de: "FORTSCHRITT.",
    pt: "PROGRESSO.",
    bg: "ПРОГРЕС.",
  },

  "progress.level": {
    en: "LEVEL",
    es: "NIVEL",
    uk: "РІВЕНЬ",
    ru: "УРОВЕНЬ",
    fr: "NIVEAU",
    de: "LEVEL",
    pt: "NÍVEL",
    bg: "НИВО",
  },

  "progress.currentLevel": {
    en: "CURRENT LEVEL",
    es: "NIVEL ACTUAL",
    uk: "ПОТОЧНИЙ РІВЕНЬ",
    ru: "ТЕКУЩИЙ УРОВЕНЬ",
    fr: "NIVEAU ACTUEL",
    de: "AKTUELLES LEVEL",
    pt: "NÍVEL ATUAL",
    bg: "ТЕКУЩО НИВО",
  },

  "progress.totalXp": {
    en: "TOTAL XP",
    es: "XP TOTAL",
    uk: "ВСЬОГО XP",
    ru: "ВСЕГО XP",
    fr: "XP TOTAL",
    de: "GESAMT-XP",
    pt: "XP TOTAL",
    bg: "ОБЩО XP",
  },

  "progress.levelUpAhead": {
    en: "LEVEL UP AHEAD",
    es: "PRÓXIMO NIVEL CERCA",
    uk: "ПОПЕРЕДУ НОВИЙ РІВЕНЬ",
    ru: "ВПЕРЕДИ НОВЫЙ УРОВЕНЬ",
    fr: "PROCHAIN NIVEAU EN VUE",
    de: "NÄCHSTES LEVEL VORAUS",
    pt: "PRÓXIMO NÍVEL À FRENTE",
    bg: "СЛЕДВАЩО НИВО НАПРЕД",
  },

  "progress.toNextLevel": {
    en: "XP TO NEXT LEVEL",
    es: "XP PARA EL PRÓXIMO NIVEL",
    uk: "XP ДО НАСТУПНОГО РІВНЯ",
    ru: "XP ДО СЛЕДУЮЩЕГО УРОВНЯ",
    fr: "XP JUSQU’AU PROCHAIN NIVEAU",
    de: "XP BIS ZUM NÄCHSTEN LEVEL",
    pt: "XP PARA O PRÓXIMO NÍVEL",
    bg: "XP ДО СЛЕДВАЩО НИВО",
  },

  "progress.workouts": {
    en: "WORKOUTS",
    es: "ENTRENAMIENTOS",
    uk: "ТРЕНУВАННЯ",
    ru: "ТРЕНИРОВКИ",
    fr: "ENTRAÎNEMENTS",
    de: "TRAININGS",
    pt: "TREINOS",
    bg: "ТРЕНИРОВКИ",
  },

  "progress.allTime": {
    en: "ALL TIME",
    es: "TODO EL TIEMPO",
    uk: "ЗА ВЕСЬ ЧАС",
    ru: "ЗА ВСЁ ВРЕМЯ",
    fr: "DEPUIS LE DÉBUT",
    de: "INSGESAMT",
    pt: "TODO O PERÍODO",
    bg: "ЗА ЦЕЛИЯ ПЕРИОД",
  },

  "progress.thisWeek": {
    en: "THIS WEEK",
    es: "ESTA SEMANA",
    uk: "ЦЬОГО ТИЖНЯ",
    ru: "НА ЭТОЙ НЕДЕЛЕ",
    fr: "CETTE SEMAINE",
    de: "DIESE WOCHE",
    pt: "ESTA SEMANA",
    bg: "ТАЗИ СЕДМИЦА",
  },

  "progress.trainingTarget": {
    en: "TRAINING TARGET",
    es: "OBJETIVO DE ENTRENAMIENTO",
    uk: "ЦІЛЬ ТРЕНУВАНЬ",
    ru: "ЦЕЛЬ ТРЕНИРОВОК",
    fr: "OBJECTIF D’ENTRAÎNEMENT",
    de: "TRAININGSZIEL",
    pt: "META DE TREINO",
    bg: "ТРЕНИРОВЪЧНА ЦЕЛ",
  },

  "progress.totalTime": {
    en: "TOTAL TIME",
    es: "TIEMPO TOTAL",
    uk: "ЗАГАЛЬНИЙ ЧАС",
    ru: "ОБЩЕЕ ВРЕМЯ",
    fr: "TEMPS TOTAL",
    de: "GESAMTZEIT",
    pt: "TEMPO TOTAL",
    bg: "ОБЩО ВРЕМЕ",
  },

  "progress.training": {
    en: "TRAINING",
    es: "ENTRENAMIENTO",
    uk: "ТРЕНУВАННЯ",
    ru: "ТРЕНИРОВКИ",
    fr: "ENTRAÎNEMENT",
    de: "TRAINING",
    pt: "TREINO",
    bg: "ТРЕНИРОВКИ",
  },

  "progress.streak": {
    en: "STREAK",
    es: "RACHA",
    uk: "СЕРІЯ",
    ru: "СЕРИЯ",
    fr: "SÉRIE",
    de: "SERIE",
    pt: "SEQUÊNCIA",
    bg: "СЕРИЯ",
  },

  "progress.day": {
    en: "DAY",
    es: "DÍA",
    uk: "ДЕНЬ",
    ru: "ДЕНЬ",
    fr: "JOUR",
    de: "TAG",
    pt: "DIA",
    bg: "ДЕН",
  },

  "progress.days": {
    en: "DAYS",
    es: "DÍAS",
    uk: "ДНІВ",
    ru: "ДНЕЙ",
    fr: "JOURS",
    de: "TAGE",
    pt: "DIAS",
    bg: "ДНИ",
  },

  "progress.trainingActivity": {
    en: "Training Activity",
    es: "Actividad de entrenamiento",
    uk: "Активність тренувань",
    ru: "Тренировочная активность",
    fr: "Activité d’entraînement",
    de: "Trainingsaktivität",
    pt: "Atividade de treino",
    bg: "Тренировъчна активност",
  },

  "progress.completed": {
    en: "COMPLETED",
    es: "COMPLETADOS",
    uk: "ЗАВЕРШЕНО",
    ru: "ЗАВЕРШЕНО",
    fr: "TERMINÉS",
    de: "ABGESCHLOSSEN",
    pt: "CONCLUÍDOS",
    bg: "ЗАВЪРШЕНИ",
  },

  "progress.target": {
    en: "TARGET",
    es: "OBJETIVO",
    uk: "ЦІЛЬ",
    ru: "ЦЕЛЬ",
    fr: "OBJECTIF",
    de: "ZIEL",
    pt: "META",
    bg: "ЦЕЛ",
  },

  "progress.performance": {
    en: "PERFORMANCE",
    es: "RENDIMIENTO",
    uk: "РЕЗУЛЬТАТИ",
    ru: "РЕЗУЛЬТАТЫ",
    fr: "PERFORMANCE",
    de: "LEISTUNG",
    pt: "DESEMPENHO",
    bg: "ПРЕДСТАВЯНЕ",
  },

  "progress.trainingVolume": {
    en: "Training Volume",
    es: "Volumen de entrenamiento",
    uk: "Обсяг тренувань",
    ru: "Объём тренировок",
    fr: "Volume d’entraînement",
    de: "Trainingsvolumen",
    pt: "Volume de treino",
    bg: "Тренировъчен обем",
  },

  "progress.totalSets": {
    en: "TOTAL SETS",
    es: "SERIES TOTALES",
    uk: "ВСЬОГО ПІДХОДІВ",
    ru: "ВСЕГО ПОДХОДОВ",
    fr: "SÉRIES TOTALES",
    de: "SÄTZE GESAMT",
    pt: "SÉRIES TOTAIS",
    bg: "ОБЩО СЕРИИ",
  },

  "progress.currentStreak": {
    en: "CURRENT STREAK",
    es: "RACHA ACTUAL",
    uk: "ПОТОЧНА СЕРІЯ",
    ru: "ТЕКУЩАЯ СЕРИЯ",
    fr: "SÉRIE ACTUELLE",
    de: "AKTUELLE SERIE",
    pt: "SEQUÊNCIA ATUAL",
    bg: "ТЕКУЩА СЕРИЯ",
  },

  "progress.history": {
    en: "HISTORY",
    es: "HISTORIAL",
    uk: "ІСТОРІЯ",
    ru: "ИСТОРИЯ",
    fr: "HISTORIQUE",
    de: "VERLAUF",
    pt: "HISTÓRICO",
    bg: "ИСТОРИЯ",
  },

  "progress.recentWorkouts": {
    en: "Recent Workouts",
    es: "Entrenamientos recientes",
    uk: "Останні тренування",
    ru: "Последние тренировки",
    fr: "Entraînements récents",
    de: "Letzte Trainings",
    pt: "Treinos recentes",
    bg: "Последни тренировки",
  },

  "progress.noWorkouts": {
    en: "NO WORKOUTS YET",
    es: "AÚN NO HAY ENTRENAMIENTOS",
    uk: "ТРЕНУВАНЬ ЩЕ НЕМАЄ",
    ru: "ТРЕНИРОВОК ЕЩЁ НЕТ",
    fr: "AUCUN ENTRAÎNEMENT",
    de: "NOCH KEINE TRAININGS",
    pt: "AINDA NÃO HÁ TREINOS",
    bg: "ВСЕ ОЩЕ НЯМА ТРЕНИРОВКИ",
  },

  "progress.emptyDescription": {
    en: "Complete your first workout to start building your performance history.",
    es: "Completa tu primer entrenamiento para empezar a crear tu historial.",
    uk: "Заверши перше тренування, щоб почати формувати історію своїх результатів.",
    ru: "Заверши первую тренировку, чтобы начать формировать историю результатов.",
    fr: "Termine ton premier entraînement pour commencer ton historique.",
    de: "Schließe dein erstes Training ab, um deinen Verlauf aufzubauen.",
    pt: "Conclua seu primeiro treino para começar seu histórico.",
    bg: "Завърши първата си тренировка, за да започнеш историята на резултатите си.",
  },

  "progress.recent": {
    en: "RECENT",
    es: "RECIENTE",
    uk: "НЕЩОДАВНО",
    ru: "НЕДАВНО",
    fr: "RÉCENT",
    de: "KÜRZLICH",
    pt: "RECENTE",
    bg: "СКОРО",
  },

  "progress.min": {
    en: "MIN",
    es: "MIN",
    uk: "ХВ",
    ru: "МИН",
    fr: "MIN",
    de: "MIN",
    pt: "MIN",
    bg: "МИН",
  },

  "progress.mindset": {
    en: "IRONAGE / MINDSET",
    es: "IRONAGE / MENTALIDAD",
    uk: "IRONAGE / МИСЛЕННЯ",
    ru: "IRONAGE / МЫШЛЕНИЕ",
    fr: "IRONAGE / MENTALITÉ",
    de: "IRONAGE / MINDSET",
    pt: "IRONAGE / MENTALIDADE",
    bg: "IRONAGE / НАГЛАСА",
  },

  "progress.keep": {
    en: "KEEP",
    es: "SIGUE",
    uk: "ПРОДОВЖУЙ",
    ru: "ПРОДОЛЖАЙ",
    fr: "CONTINUE",
    de: "BLEIB",
    pt: "CONTINUE",
    bg: "ПРОДЪЛЖАВАЙ",
  },

  "progress.building": {
    en: "BUILDING.",
    es: "CONSTRUYENDO.",
    uk: "БУДУВАТИ.",
    ru: "СТРОИТЬ.",
    fr: "À CONSTRUIRE.",
    de: "DRAN.",
    pt: "CONSTRUINDO.",
    bg: "ДА ИЗГРАЖДАШ.",
  },

  "progress.quote": {
    en: "Progress is not about perfection. It is about showing up again.",
    es: "El progreso no consiste en la perfección. Consiste en volver a aparecer.",
    uk: "Прогрес — не про ідеальність. Він про те, щоб знову прийти й зробити.",
    ru: "Прогресс — не про идеальность. Он про то, чтобы снова прийти и сделать.",
    fr: "Le progrès ne consiste pas à être parfait. Il consiste à revenir.",
    de: "Fortschritt bedeutet nicht Perfektion. Es bedeutet, wieder aufzutauchen.",
    pt: "Progresso não é perfeição. É aparecer de novo.",
    bg: "Прогресът не е съвършенство. Той е да се появиш отново.",
  },

  "progress.mon": {
    en: "MON", es: "LUN", uk: "ПН", ru: "ПН",
    fr: "LUN", de: "MO", pt: "SEG", bg: "ПН",
  },

  "progress.tue": {
    en: "TUE", es: "MAR", uk: "ВТ", ru: "ВТ",
    fr: "MAR", de: "DI", pt: "TER", bg: "ВТ",
  },

  "progress.wed": {
    en: "WED", es: "MIÉ", uk: "СР", ru: "СР",
    fr: "MER", de: "MI", pt: "QUA", bg: "СР",
  },

  "progress.thu": {
    en: "THU", es: "JUE", uk: "ЧТ", ru: "ЧТ",
    fr: "JEU", de: "DO", pt: "QUI", bg: "ЧТ",
  },

  "progress.fri": {
    en: "FRI", es: "VIE", uk: "ПТ", ru: "ПТ",
    fr: "VEN", de: "FR", pt: "SEX", bg: "ПТ",
  },

  "progress.sat": {
    en: "SAT", es: "SÁB", uk: "СБ", ru: "СБ",
    fr: "SAM", de: "SA", pt: "SÁB", bg: "СБ",
  },

  "progress.sun": {
    en: "SUN", es: "DOM", uk: "НД", ru: "ВС",
    fr: "DIM", de: "SO", pt: "DOM", bg: "НД",
  },


  /* =====================================================
     AI TRAINER
  ===================================================== */

  "ai.intelligence": {
    en: "IRONAGE / INTELLIGENCE",
    es: "IRONAGE / INTELIGENCIA",
    uk: "IRONAGE / ІНТЕЛЕКТ",
    ru: "IRONAGE / ИНТЕЛЛЕКТ",
    fr: "IRONAGE / INTELLIGENCE",
    de: "IRONAGE / INTELLIGENZ",
    pt: "IRONAGE / INTELIGÊNCIA",
    bg: "IRONAGE / ИНТЕЛЕКТ",
  },

  "ai.title": {
    en: "TRAINER.",
    es: "ENTRENADOR.",
    uk: "ТРЕНЕР.",
    ru: "ТРЕНЕР.",
    fr: "COACH.",
    de: "TRAINER.",
    pt: "TREINADOR.",
    bg: "ТРЕНЬОР.",
  },

  "ai.online": {
    en: "ONLINE",
    es: "EN LÍNEA",
    uk: "ОНЛАЙН",
    ru: "ОНЛАЙН",
    fr: "EN LIGNE",
    de: "ONLINE",
    pt: "ONLINE",
    bg: "ОНЛАЙН",
  },

  "ai.personalCoach": {
    en: "YOUR PERSONAL COACH",
    es: "TU ENTRENADOR PERSONAL",
    uk: "ТВІЙ ПЕРСОНАЛЬНИЙ ТРЕНЕР",
    ru: "ТВОЙ ПЕРСОНАЛЬНЫЙ ТРЕНЕР",
    fr: "TON COACH PERSONNEL",
    de: "DEIN PERSÖNLICHER TRAINER",
    pt: "SEU TREINADOR PESSOAL",
    bg: "ТВОЯТ ЛИЧЕН ТРЕНЬОР",
  },

  "ai.coach": {
    en: "COACH",
    es: "ENTRENADOR",
    uk: "ТРЕНЕР",
    ru: "ТРЕНЕР",
    fr: "COACH",
    de: "TRAINER",
    pt: "TREINADOR",
    bg: "ТРЕНЬОР",
  },

  "ai.loadingProfile": {
    en: "Loading your athlete profile...",
    es: "Cargando tu perfil de atleta...",
    uk: "Завантажуємо твій профіль атлета...",
    ru: "Загружаем твой профиль атлета...",
    fr: "Chargement de ton profil d’athlète...",
    de: "Dein Athletenprofil wird geladen...",
    pt: "Carregando seu perfil de atleta...",
    bg: "Зареждаме профила ти на атлет...",
  },

  "ai.startRecommended": {
    en: "START RECOMMENDED WORKOUT",
    es: "INICIAR ENTRENAMIENTO RECOMENDADO",
    uk: "ПОЧАТИ РЕКОМЕНДОВАНЕ ТРЕНУВАННЯ",
    ru: "НАЧАТЬ РЕКОМЕНДОВАННУЮ ТРЕНИРОВКУ",
    fr: "COMMENCER L’ENTRAÎNEMENT RECOMMANDÉ",
    de: "EMPFOHLENES TRAINING STARTEN",
    pt: "INICIAR TREINO RECOMENDADO",
    bg: "ЗАПОЧНИ ПРЕПОРЪЧАНАТА ТРЕНИРОВКА",
  },

  "ai.quickCoach": {
    en: "QUICK COACH",
    es: "COACH RÁPIDO",
    uk: "ШВИДКИЙ ТРЕНЕР",
    ru: "БЫСТРЫЙ ТРЕНЕР",
    fr: "COACH RAPIDE",
    de: "SCHNELLER COACH",
    pt: "COACH RÁPIDO",
    bg: "БЪРЗ ТРЕНЬОР",
  },

  "ai.whatNeed": {
    en: "What do you need?",
    es: "¿Qué necesitas?",
    uk: "Що тобі потрібно?",
    ru: "Что тебе нужно?",
    fr: "De quoi as-tu besoin ?",
    de: "Was brauchst du?",
    pt: "Do que você precisa?",
    bg: "От какво имаш нужда?",
  },

  "ai.createWorkout": {
    en: "CREATE WORKOUT",
    es: "CREAR ENTRENAMIENTO",
    uk: "СТВОРИТИ ТРЕНУВАННЯ",
    ru: "СОЗДАТЬ ТРЕНИРОВКУ",
    fr: "CRÉER UN ENTRAÎNEMENT",
    de: "TRAINING ERSTELLEN",
    pt: "CRIAR TREINO",
    bg: "СЪЗДАЙ ТРЕНИРОВКА",
  },

  "ai.buildSession": {
    en: "Build today's session",
    es: "Crea la sesión de hoy",
    uk: "Створи сьогоднішню сесію",
    ru: "Создай сегодняшнюю сессию",
    fr: "Crée la séance du jour",
    de: "Erstelle die heutige Einheit",
    pt: "Crie a sessão de hoje",
    bg: "Създай днешната сесия",
  },

  "ai.nutritionAdvice": {
    en: "NUTRITION ADVICE",
    es: "CONSEJOS DE NUTRICIÓN",
    uk: "ПОРАДИ З ХАРЧУВАННЯ",
    ru: "СОВЕТЫ ПО ПИТАНИЮ",
    fr: "CONSEILS NUTRITION",
    de: "ERNÄHRUNGSBERATUNG",
    pt: "CONSELHOS DE NUTRIÇÃO",
    bg: "СЪВЕТИ ЗА ХРАНЕНЕ",
  },

  "ai.improveMeals": {
    en: "Improve today's meals",
    es: "Mejora las comidas de hoy",
    uk: "Покращ сьогоднішнє харчування",
    ru: "Улучши сегодняшнее питание",
    fr: "Améliore les repas du jour",
    de: "Verbessere deine heutigen Mahlzeiten",
    pt: "Melhore as refeições de hoje",
    bg: "Подобри днешното хранене",
  },

  "ai.recovery": {
    en: "RECOVERY",
    es: "RECUPERACIÓN",
    uk: "ВІДНОВЛЕННЯ",
    ru: "ВОССТАНОВЛЕНИЕ",
    fr: "RÉCUPÉRATION",
    de: "ERHOLUNG",
    pt: "RECUPERAÇÃO",
    bg: "ВЪЗСТАНОВЯВАНЕ",
  },

  "ai.recoveryTips": {
    en: "Sleep & recovery tips",
    es: "Consejos de sueño y recuperación",
    uk: "Поради щодо сну та відновлення",
    ru: "Советы по сну и восстановлению",
    fr: "Conseils sommeil & récupération",
    de: "Tipps zu Schlaf & Erholung",
    pt: "Dicas de sono e recuperação",
    bg: "Съвети за сън и възстановяване",
  },

  "ai.ask": {
    en: "ASK IRONAGE AI",
    es: "PREGUNTA A IRONAGE AI",
    uk: "ЗАПИТАЙ IRONAGE AI",
    ru: "СПРОСИ IRONAGE AI",
    fr: "DEMANDE À IRONAGE AI",
    de: "FRAGE IRONAGE AI",
    pt: "PERGUNTE AO IRONAGE AI",
    bg: "ПОПИТАЙ IRONAGE AI",
  },

  "ai.nextMove": {
    en: "Your next move.",
    es: "Tu próximo paso.",
    uk: "Твій наступний крок.",
    ru: "Твой следующий шаг.",
    fr: "Ton prochain mouvement.",
    de: "Dein nächster Schritt.",
    pt: "Seu próximo passo.",
    bg: "Твоят следващ ход.",
  },

  "ai.thinking": {
    en: "IRONAGE AI is thinking...",
    es: "IRONAGE AI está pensando...",
    uk: "IRONAGE AI думає...",
    ru: "IRONAGE AI думает...",
    fr: "IRONAGE AI réfléchit...",
    de: "IRONAGE AI denkt nach...",
    pt: "IRONAGE AI está pensando...",
    bg: "IRONAGE AI мисли...",
  },

  "ai.askAnything": {
    en: "Ask your coach anything...",
    es: "Pregunta lo que quieras a tu entrenador...",
    uk: "Запитай свого тренера про будь-що...",
    ru: "Спроси своего тренера о чём угодно...",
    fr: "Demande n’importe quoi à ton coach...",
    de: "Frag deinen Trainer alles...",
    pt: "Pergunte qualquer coisa ao seu treinador...",
    bg: "Попитай треньора си за всичко...",
  },

  "ai.askCoach": {
    en: "Ask coach",
    es: "Preguntar al entrenador",
    uk: "Запитати тренера",
    ru: "Спросить тренера",
    fr: "Demander au coach",
    de: "Trainer fragen",
    pt: "Perguntar ao treinador",
    bg: "Попитай треньора",
  },

  "ai.powered": {
    en: "POWERED BY IRONAGE INTELLIGENCE",
    es: "IMPULSADO POR IRONAGE INTELLIGENCE",
    uk: "ПРАЦЮЄ НА IRONAGE INTELLIGENCE",
    ru: "РАБОТАЕТ НА IRONAGE INTELLIGENCE",
    fr: "PROPULSÉ PAR IRONAGE INTELLIGENCE",
    de: "POWERED BY IRONAGE INTELLIGENCE",
    pt: "DESENVOLVIDO POR IRONAGE INTELLIGENCE",
    bg: "ЗАДВИЖВАНО ОТ IRONAGE INTELLIGENCE",
  },

  "ai.unavailable": {
    en: "IRONAGE AI is temporarily unavailable. Please try again.",
    es: "IRONAGE AI no está disponible temporalmente. Inténtalo de nuevo.",
    uk: "IRONAGE AI тимчасово недоступний. Спробуй ще раз.",
    ru: "IRONAGE AI временно недоступен. Попробуй снова.",
    fr: "IRONAGE AI est temporairement indisponible. Réessaie.",
    de: "IRONAGE AI ist vorübergehend nicht verfügbar. Versuche es erneut.",
    pt: "IRONAGE AI está temporariamente indisponível. Tente novamente.",
    bg: "IRONAGE AI временно не е наличен. Опитай отново.",
  },

  "ai.foundation": {
    en: "You're building your foundation. The goal is simple: train consistently and become stronger every day.",
    es: "Estás construyendo tu base. El objetivo es simple: entrena con constancia y hazte más fuerte cada día.",
    uk: "Ти будуєш свою основу. Ціль проста: тренуйся регулярно і ставай сильнішим щодня.",
    ru: "Ты строишь свою основу. Цель проста: тренируйся регулярно и становись сильнее каждый день.",
    fr: "Tu construis tes bases. L’objectif est simple : entraîne-toi régulièrement et deviens plus fort chaque jour.",
    de: "Du baust dein Fundament. Das Ziel ist einfach: trainiere konsequent und werde jeden Tag stärker.",
    pt: "Você está construindo sua base. O objetivo é simples: treine com consistência e fique mais forte todos os dias.",
    bg: "Изграждаш основата си. Целта е проста: тренирай редовно и ставай по-силен всеки ден.",
  },

  "ai.streakStrong": {
    en: "You're on a {count}-day streak. That's serious discipline. Today we keep the momentum going.",
    es: "Llevas una racha de {count} días. Eso es disciplina seria. Hoy mantenemos el impulso.",
    uk: "У тебе серія {count} днів. Це серйозна дисципліна. Сьогодні зберігаємо темп.",
    ru: "У тебя серия {count} дней. Это серьёзная дисциплина. Сегодня сохраняем темп.",
    fr: "Tu es sur une série de {count} jours. C’est une vraie discipline. Aujourd’hui, on garde l’élan.",
    de: "Du hast eine Serie von {count} Tagen. Das ist echte Disziplin. Heute halten wir den Schwung.",
    pt: "Você está em uma sequência de {count} dias. Isso é disciplina séria. Hoje mantemos o ritmo.",
    bg: "Имаш серия от {count} дни. Това е сериозна дисциплина. Днес запазваме темпото.",
  },

  "ai.streakBuilding": {
    en: "You're building a {count}-day streak. Stay consistent today and keep moving forward.",
    es: "Estás construyendo una racha de {count} días. Mantén la constancia hoy y sigue adelante.",
    uk: "Ти будуєш серію з {count} днів. Сьогодні тримай дисципліну й рухайся далі.",
    ru: "Ты строишь серию из {count} дней. Сегодня держи дисциплину и двигайся дальше.",
    fr: "Tu construis une série de {count} jours. Reste régulier aujourd’hui et continue d’avancer.",
    de: "Du baust eine Serie von {count} Tagen auf. Bleib heute konsequent und mach weiter.",
    pt: "Você está construindo uma sequência de {count} dias. Mantenha a consistência hoje e siga em frente.",
    bg: "Изграждаш серия от {count} дни. Бъди постоянен днес и продължавай напред.",
  },

  "ai.workoutsDone": {
    en: "You've already completed {count} workouts. Keep building your strength and consistency.",
    es: "Ya has completado {count} entrenamientos. Sigue construyendo fuerza y constancia.",
    uk: "Ти вже завершив {count} тренувань. Продовжуй будувати силу та стабільність.",
    ru: "Ты уже завершил {count} тренировок. Продолжай развивать силу и стабильность.",
    fr: "Tu as déjà terminé {count} entraînements. Continue de développer ta force et ta régularité.",
    de: "Du hast bereits {count} Trainings abgeschlossen. Baue weiter Kraft und Beständigkeit auf.",
    pt: "Você já concluiu {count} treinos. Continue construindo força e consistência.",
    bg: "Вече си завършил {count} тренировки. Продължавай да изграждаш сила и постоянство.",
  },

  "ai.workoutResponse": {
    en: "Based on your current level {level} and goal \"{goal}\", complete today's workout with controlled reps, strong technique and consistent intensity.",
    es: "Según tu nivel actual {level} y objetivo \"{goal}\", completa el entrenamiento de hoy con repeticiones controladas, buena técnica e intensidad constante.",
    uk: "З огляду на твій рівень {level} і ціль \"{goal}\", виконай сьогоднішнє тренування з контрольованими повтореннями, правильною технікою та стабільною інтенсивністю.",
    ru: "С учётом твоего уровня {level} и цели \"{goal}\", выполни сегодняшнюю тренировку с контролируемыми повторениями, хорошей техникой и стабильной интенсивностью.",
    fr: "Selon ton niveau actuel {level} et ton objectif \"{goal}\", réalise l’entraînement du jour avec des répétitions contrôlées, une bonne technique et une intensité régulière.",
    de: "Basierend auf deinem aktuellen Level {level} und Ziel \"{goal}\" absolviere das heutige Training mit kontrollierten Wiederholungen, sauberer Technik und gleichmäßiger Intensität.",
    pt: "Com base no seu nível atual {level} e objetivo \"{goal}\", faça o treino de hoje com repetições controladas, boa técnica e intensidade consistente.",
    bg: "Според текущото ти ниво {level} и цел \"{goal}\", изпълни днешната тренировка с контролирани повторения, добра техника и постоянна интензивност.",
  },

  "ai.nutritionResponse": {
    en: "Your nutrition should support your goal \"{goal}\". Prioritize enough protein, quality food, hydration and consistent calorie intake.",
    es: "Tu alimentación debe apoyar tu objetivo \"{goal}\". Prioriza suficiente proteína, alimentos de calidad, hidratación y una ingesta calórica constante.",
    uk: "Харчування має підтримувати твою ціль \"{goal}\". Пріоритет: достатньо білка, якісна їжа, вода та стабільне споживання калорій.",
    ru: "Питание должно поддерживать твою цель \"{goal}\". Приоритет: достаточно белка, качественная еда, вода и стабильное потребление калорий.",
    fr: "Ton alimentation doit soutenir ton objectif \"{goal}\". Priorité aux protéines, à une alimentation de qualité, à l’hydratation et à un apport calorique régulier.",
    de: "Deine Ernährung sollte dein Ziel \"{goal}\" unterstützen. Achte auf genug Protein, hochwertige Lebensmittel, Flüssigkeit und eine konstante Kalorienzufuhr.",
    pt: "Sua alimentação deve apoiar seu objetivo \"{goal}\". Priorize proteína suficiente, alimentos de qualidade, hidratação e ingestão calórica consistente.",
    bg: "Храненето ти трябва да подкрепя целта \"{goal}\". Дай приоритет на достатъчно протеин, качествена храна, хидратация и постоянен калориен прием.",
  },

  "ai.recoveryResponse": {
    en: "Recovery is part of the program. Focus on quality sleep, hydration and enough time for your muscles to recover between hard sessions.",
    es: "La recuperación forma parte del programa. Prioriza un sueño de calidad, hidratación y suficiente tiempo para recuperar los músculos.",
    uk: "Відновлення — частина програми. Зосередься на якісному сні, воді та достатньому часі для відновлення м’язів між важкими тренуваннями.",
    ru: "Восстановление — часть программы. Сосредоточься на качественном сне, воде и достаточном времени для восстановления мышц.",
    fr: "La récupération fait partie du programme. Privilégie un sommeil de qualité, l’hydratation et assez de temps pour récupérer.",
    de: "Erholung ist Teil des Programms. Achte auf guten Schlaf, Flüssigkeit und genügend Erholungszeit zwischen harten Einheiten.",
    pt: "A recuperação faz parte do programa. Foque em sono de qualidade, hidratação e tempo suficiente para os músculos se recuperarem.",
    bg: "Възстановяването е част от програмата. Фокусирай се върху качествен сън, хидратация и достатъчно време за възстановяване.",
  },

  "ai.keepGoing": {
    en: "Stay consistent and keep moving forward.",
    es: "Mantén la constancia y sigue adelante.",
    uk: "Будь стабільним і продовжуй рухатися вперед.",
    ru: "Будь стабильным и продолжай двигаться вперёд.",
    fr: "Reste régulier et continue d’avancer.",
    de: "Bleib konsequent und mach weiter.",
    pt: "Mantenha a consistência e siga em frente.",
    bg: "Бъди постоянен и продължавай напред.",
  },

  /* =====================================================
     PREMIUM
  ===================================================== */

  "premium.backProfile": {
    en: "← PROFILE",
    es: "← PERFIL",
    uk: "← ПРОФІЛЬ",
    ru: "← ПРОФИЛЬ",
    fr: "← PROFIL",
    de: "← PROFIL",
    pt: "← PERFIL",
    bg: "← ПРОФИЛ",
  },


  "premium.break": {
    en: "BREAK",
    es: "ROMPE",
    uk: "ЗЛАМАЙ",
    ru: "СЛОМАЙ",
    fr: "DÉPASSE",
    de: "SPRENG",
    pt: "SUPERE",
    bg: "ПРЕОДОЛЕЙ",
  },

  "premium.limits": {
    en: "YOUR LIMITS.",
    es: "TUS LÍMITES.",
    uk: "СВОЇ МЕЖІ.",
    ru: "СВОИ ПРЕДЕЛЫ.",
    fr: "TES LIMITES.",
    de: "DEINE GRENZEN.",
    pt: "SEUS LIMITES.",
    bg: "СВОИТЕ ГРАНИЦИ.",
  },

  "premium.unlock": {
    en: "Unlock the complete IRONAGE experience.",
    es: "Desbloquea la experiencia completa de IRONAGE.",
    uk: "Відкрий повний досвід IRONAGE.",
    ru: "Открой полный опыт IRONAGE.",
    fr: "Débloque toute l’expérience IRONAGE.",
    de: "Schalte das vollständige IRONAGE-Erlebnis frei.",
    pt: "Desbloqueie a experiência completa do IRONAGE.",
    bg: "Отключи пълното изживяване IRONAGE.",
  },

  "premium.access": {
    en: "PREMIUM ACCESS",
    es: "ACCESO PREMIUM",
    uk: "PREMIUM ДОСТУП",
    ru: "PREMIUM ДОСТУП",
    fr: "ACCÈS PREMIUM",
    de: "PREMIUM-ZUGANG",
    pt: "ACESSO PREMIUM",
    bg: "PREMIUM ДОСТЪП",
  },

  "premium.securePayment": {
    en: "SECURE APP STORE PAYMENT",
    es: "PAGO SEGURO EN APP STORE",
    uk: "БЕЗПЕЧНА ОПЛАТА ЧЕРЕЗ APP STORE",
    ru: "БЕЗОПАСНАЯ ОПЛАТА ЧЕРЕЗ APP STORE",
    fr: "PAIEMENT APP STORE SÉCURISÉ",
    de: "SICHERE APP-STORE-ZAHLUNG",
    pt: "PAGAMENTO SEGURO NA APP STORE",
    bg: "СИГУРНО ПЛАЩАНЕ ПРЕЗ APP STORE",
  },

  "premium.currentPlan": {
    en: "CURRENT PLAN",
    es: "PLAN ACTUAL",
    uk: "ПОТОЧНИЙ ПЛАН",
    ru: "ТЕКУЩИЙ ПЛАН",
    fr: "FORMULE ACTUELLE",
    de: "AKTUELLER PLAN",
    pt: "PLANO ATUAL",
    bg: "ТЕКУЩ ПЛАН",
  },

  "premium.free": {
    en: "FREE", es: "GRATIS", uk: "БЕЗКОШТОВНИЙ", ru: "БЕСПЛАТНЫЙ",
    fr: "GRATUIT", de: "KOSTENLOS", pt: "GRÁTIS", bg: "БЕЗПЛАТЕН",
  },

  "premium.monthly": {
    en: "MONTHLY", es: "MENSUAL", uk: "МІСЯЧНИЙ", ru: "МЕСЯЧНЫЙ",
    fr: "MENSUEL", de: "MONATLICH", pt: "MENSAL", bg: "МЕСЕЧЕН",
  },

  "premium.yearly": {
    en: "YEARLY", es: "ANUAL", uk: "РІЧНИЙ", ru: "ГОДОВОЙ",
    fr: "ANNUEL", de: "JÄHRLICH", pt: "ANUAL", bg: "ГОДИШЕН",
  },

  "premium.flexible": {
    en: "FLEXIBLE", es: "FLEXIBLE", uk: "ГНУЧКИЙ", ru: "ГИБКИЙ",
    fr: "FLEXIBLE", de: "FLEXIBEL", pt: "FLEXÍVEL", bg: "ГЪВКАВ",
  },

  "premium.bestValue": {
    en: "BEST VALUE", es: "MEJOR PRECIO", uk: "НАЙВИГІДНІШЕ", ru: "ЛУЧШАЯ ЦЕНА",
    fr: "MEILLEUR CHOIX", de: "BESTER WERT", pt: "MELHOR VALOR", bg: "НАЙ-ДОБРА СТОЙНОСТ",
  },


  "premium.featureWorkouts": {
    en: "FULL WORKOUT ACCESS", es: "ACCESO COMPLETO A ENTRENAMIENTOS", uk: "ПОВНИЙ ДОСТУП ДО ТРЕНУВАНЬ", ru: "ПОЛНЫЙ ДОСТУП К ТРЕНИРОВКАМ",
    fr: "ACCÈS COMPLET AUX ENTRAÎNEMENTS", de: "VOLLER TRAININGSZUGANG", pt: "ACESSO COMPLETO AOS TREINOS", bg: "ПЪЛЕН ДОСТЪП ДО ТРЕНИРОВКИ",
  },

  "premium.featureProgress": {
    en: "ADVANCED PROGRESS TRACKING", es: "SEGUIMIENTO AVANZADO DEL PROGRESO", uk: "РОЗШИРЕНЕ ВІДСТЕЖЕННЯ ПРОГРЕСУ", ru: "РАСШИРЕННОЕ ОТСЛЕЖИВАНИЕ ПРОГРЕССА",
    fr: "SUIVI AVANCÉ DES PROGRÈS", de: "ERWEITERTE FORTSCHRITTSVERFOLGUNG", pt: "ACOMPANHAMENTO AVANÇADO DO PROGRESSO", bg: "РАЗШИРЕНО ПРОСЛЕДЯВАНЕ НА ПРОГРЕСА",
  },

  "premium.featureNutrition": {
    en: "PREMIUM NUTRITION TOOLS", es: "HERRAMIENTAS PREMIUM DE NUTRICIÓN", uk: "PREMIUM ІНСТРУМЕНТИ ХАРЧУВАННЯ", ru: "PREMIUM ИНСТРУМЕНТЫ ПИТАНИЯ",
    fr: "OUTILS NUTRITION PREMIUM", de: "PREMIUM-ERNÄHRUNGSTOOLS", pt: "FERRAMENTAS PREMIUM DE NUTRIÇÃO", bg: "PREMIUM ИНСТРУМЕНТИ ЗА ХРАНЕНЕ",
  },

  "premium.featureAi": {
    en: "AI TRAINER ACCESS", es: "ACCESO AL ENTRENADOR IA", uk: "ДОСТУП ДО AI ТРЕНЕРА", ru: "ДОСТУП К ИИ ТРЕНЕРУ",
    fr: "ACCÈS AU COACH IA", de: "ZUGANG ZUM KI-TRAINER", pt: "ACESSO AO TREINADOR IA", bg: "ДОСТЪП ДО AI ТРЕНЬОР",
  },

  "premium.featureExperience": {
    en: "IRONAGE PREMIUM EXPERIENCE", es: "EXPERIENCIA IRONAGE PREMIUM", uk: "PREMIUM ДОСВІД IRONAGE", ru: "PREMIUM ОПЫТ IRONAGE",
    fr: "EXPÉRIENCE IRONAGE PREMIUM", de: "IRONAGE PREMIUM-ERLEBNIS", pt: "EXPERIÊNCIA IRONAGE PREMIUM", bg: "PREMIUM ИЗЖИВЯВАНЕ IRONAGE",
  },

  "premium.iosOnly": {
    en: "APP STORE PAYMENT IS AVAILABLE IN THE IRONAGE IOS APP",
    es: "EL PAGO DE APP STORE ESTÁ DISPONIBLE EN LA APP IOS DE IRONAGE",
    uk: "ОПЛАТА ЧЕРЕЗ APP STORE ДОСТУПНА В IOS-ДОДАТКУ IRONAGE",
    ru: "ОПЛАТА ЧЕРЕЗ APP STORE ДОСТУПНА В IOS-ПРИЛОЖЕНИИ IRONAGE",
    fr: "LE PAIEMENT APP STORE EST DISPONIBLE DANS L’APP IOS IRONAGE",
    de: "APP-STORE-ZAHLUNG IST IN DER IRONAGE-IOS-APP VERFÜGBAR",
    pt: "O PAGAMENTO PELA APP STORE ESTÁ DISPONÍVEL NO APP IOS IRONAGE",
    bg: "ПЛАЩАНЕТО ПРЕЗ APP STORE Е ДОСТЪПНО В IOS ПРИЛОЖЕНИЕТО IRONAGE",
  },

  "premium.cancelled": {
    en: "PURCHASE CANCELLED", es: "COMPRA CANCELADA", uk: "ПОКУПКУ СКАСОВАНО", ru: "ПОКУПКА ОТМЕНЕНА",
    fr: "ACHAT ANNULÉ", de: "KAUF ABGEBROCHEN", pt: "COMPRA CANCELADA", bg: "ПОКУПКАТА Е ОТМЕНЕНА",
  },

  "premium.pending": {
    en: "PURCHASE PENDING", es: "COMPRA PENDIENTE", uk: "ПОКУПКА ОЧІКУЄ ПІДТВЕРДЖЕННЯ", ru: "ПОКУПКА ОЖИДАЕТ ПОДТВЕРЖДЕНИЯ",
    fr: "ACHAT EN ATTENTE", de: "KAUF AUSSTEHEND", pt: "COMPRA PENDENTE", bg: "ПОКУПКАТА Е В ИЗЧАКВАНЕ",
  },

  "premium.activated": {
    en: "PREMIUM ACTIVATED", es: "PREMIUM ACTIVADO", uk: "PREMIUM АКТИВОВАНО", ru: "PREMIUM АКТИВИРОВАН",
    fr: "PREMIUM ACTIVÉ", de: "PREMIUM AKTIVIERT", pt: "PREMIUM ATIVADO", bg: "PREMIUM Е АКТИВИРАН",
  },

  "premium.purchaseFailed": {
    en: "Premium purchase failed", es: "La compra Premium ha fallado", uk: "Не вдалося придбати Premium", ru: "Не удалось приобрести Premium",
    fr: "L’achat Premium a échoué", de: "Premium-Kauf fehlgeschlagen", pt: "Falha na compra Premium", bg: "Покупката на Premium е неуспешна",
  },

  "premium.signedMissing": {
    en: "Apple signed transaction missing", es: "Falta la transacción firmada de Apple", uk: "Відсутня підписана транзакція Apple", ru: "Отсутствует подписанная транзакция Apple",
    fr: "Transaction Apple signée manquante", de: "Signierte Apple-Transaktion fehlt", pt: "Transação Apple assinada ausente", bg: "Липсва подписана Apple транзакция",
  },

  "premium.active": {
    en: "ACTIVE", es: "ACTIVO", uk: "АКТИВНИЙ", ru: "АКТИВЕН",
    fr: "ACTIF", de: "AKTIV", pt: "ATIVO", bg: "АКТИВЕН",
  },

  "premium.availableIos": {
    en: "AVAILABLE IN IOS APP", es: "DISPONIBLE EN LA APP IOS", uk: "ДОСТУПНО В IOS-ДОДАТКУ", ru: "ДОСТУПНО В IOS-ПРИЛОЖЕНИИ",
    fr: "DISPONIBLE DANS L’APP IOS", de: "IN DER IOS-APP VERFÜGBAR", pt: "DISPONÍVEL NO APP IOS", bg: "ДОСТЪПНО В IOS ПРИЛОЖЕНИЕТО",
  },

  "premium.processing": {
    en: "PROCESSING...", es: "PROCESANDO...", uk: "ОБРОБКА...", ru: "ОБРАБОТКА...",
    fr: "TRAITEMENT...", de: "VERARBEITUNG...", pt: "PROCESSANDO...", bg: "ОБРАБОТВА СЕ...",
  },

  "premium.continuePayment": {
    en: "CONTINUE TO PAYMENT", es: "CONTINUAR AL PAGO", uk: "ПЕРЕЙТИ ДО ОПЛАТИ", ru: "ПЕРЕЙТИ К ОПЛАТЕ",
    fr: "CONTINUER VERS LE PAIEMENT", de: "WEITER ZUR ZAHLUNG", pt: "CONTINUAR PARA PAGAMENTO", bg: "ПРОДЪЛЖИ КЪМ ПЛАЩАНЕ",
  },

};

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (
    language: AppLanguage
  ) => void;
  t: (
    key: string
  ) => string;
};

const LanguageContext =
  createContext<LanguageContextValue | null>(
    null
  );

function getInitialLanguage(): AppLanguage {
  try {
    const saved =
      localStorage.getItem(
        "ironage_language"
      );

    if (
      LANGUAGE_OPTIONS.some(
        item => item.id === saved
      )
    ) {
      return saved as AppLanguage;
    }
  } catch {
    // Storage may be unavailable.
  }

  return "uk";
}

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    language,
    setLanguageState,
  ] = useState<AppLanguage>(
    getInitialLanguage
  );

  const setLanguage = (
    nextLanguage: AppLanguage
  ) => {
    setLanguageState(nextLanguage);

    try {
      localStorage.setItem(
        "ironage_language",
        nextLanguage
      );
    } catch {
      // Storage may be unavailable.
    }
  };

  useEffect(() => {
    document.documentElement.lang =
      language;

    return localizeDocument(
      language as RuntimeLanguage
    );
  }, [language]);

  const value =
    useMemo<LanguageContextValue>(
      () => ({
        language,
        setLanguage,

        t: (key: string) => {
          const entry =
            translations[key];

          if (!entry) {
            return key;
          }

          return (
            entry[language] ||
            entry.en ||
            key
          );
        },
      }),
      [language]
    );

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage():
  LanguageContextValue {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}

