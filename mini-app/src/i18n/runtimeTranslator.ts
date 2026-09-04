export type RuntimeLanguage =
  | "en"
  | "es"
  | "uk"
  | "ru"
  | "fr"
  | "de"
  | "pt"
  | "bg";

type Entry = Record<RuntimeLanguage, string>;

export const RUNTIME_LANGUAGES: RuntimeLanguage[] = [
  "en",
  "es",
  "uk",
  "ru",
  "fr",
  "de",
  "pt",
  "bg",
];

const RAW_TRANSLATIONS: Record<string, Entry> = {
  "Back": {
    "en": "Back",
    "es": "Atrás",
    "uk": "Назад",
    "ru": "Назад",
    "fr": "Retour",
    "de": "Zurück",
    "pt": "Voltar",
    "bg": "Назад"
  },
  "← BACK TO IRONAGE": {
    "en": "← BACK TO IRONAGE",
    "es": "← VOLVER A IRONAGE",
    "uk": "← НАЗАД ДО IRONAGE",
    "ru": "← НАЗАД В IRONAGE",
    "fr": "← RETOUR À IRONAGE",
    "de": "← ZURÜCK ZU IRONAGE",
    "pt": "← VOLTAR AO IRONAGE",
    "bg": "← НАЗАД КЪМ IRONAGE"
  },
  "PERSONAL DATA": {
    "en": "PERSONAL DATA",
    "es": "DATOS PERSONALES",
    "uk": "ОСОБИСТІ ДАНІ",
    "ru": "ЛИЧНЫЕ ДАННЫЕ",
    "fr": "DONNÉES PERSONNELLES",
    "de": "PERSÖNLICHE DATEN",
    "pt": "DADOS PESSOAIS",
    "bg": "ЛИЧНИ ДАННИ"
  },
  "IRONAGE PROFILE": {
    "en": "IRONAGE PROFILE",
    "es": "PERFIL IRONAGE",
    "uk": "ПРОФІЛЬ IRONAGE",
    "ru": "ПРОФИЛЬ IRONAGE",
    "fr": "PROFIL IRONAGE",
    "de": "IRONAGE PROFIL",
    "pt": "PERFIL IRONAGE",
    "bg": "ПРОФИЛ IRONAGE"
  },
  "NAME": {
    "en": "NAME",
    "es": "NOMBRE",
    "uk": "ІМ'Я",
    "ru": "ИМЯ",
    "fr": "NOM",
    "de": "NAME",
    "pt": "NOME",
    "bg": "ИМЕ"
  },
  "AGE": {
    "en": "AGE",
    "es": "EDAD",
    "uk": "ВІК",
    "ru": "ВОЗРАСТ",
    "fr": "ÂGE",
    "de": "ALTER",
    "pt": "IDADE",
    "bg": "ВЪЗРАСТ"
  },
  "YEARS": {
    "en": "YEARS",
    "es": "AÑOS",
    "uk": "РОКІВ",
    "ru": "ЛЕТ",
    "fr": "ANS",
    "de": "JAHRE",
    "pt": "ANOS",
    "bg": "ГОДИНИ"
  },
  "WEIGHT": {
    "en": "WEIGHT",
    "es": "PESO",
    "uk": "ВАГА",
    "ru": "ВЕС",
    "fr": "POIDS",
    "de": "GEWICHT",
    "pt": "PESO",
    "bg": "ТЕГЛО"
  },
  "HEIGHT": {
    "en": "HEIGHT",
    "es": "ALTURA",
    "uk": "ЗРІСТ",
    "ru": "РОСТ",
    "fr": "TAILLE",
    "de": "GRÖSSE",
    "pt": "ALTURA",
    "bg": "РЪСТ"
  },
  "ATHLETE HEIGHT": {
    "en": "ATHLETE HEIGHT",
    "es": "ALTURA DEL ATLETA",
    "uk": "ЗРІСТ АТЛЕТА",
    "ru": "РОСТ АТЛЕТА",
    "fr": "TAILLE DE L’ATHLÈTE",
    "de": "GRÖSSE DES ATHLETEN",
    "pt": "ALTURA DO ATLETA",
    "bg": "РЪСТ НА АТЛЕТА"
  },
  "CURRENT BODY WEIGHT": {
    "en": "CURRENT BODY WEIGHT",
    "es": "PESO CORPORAL ACTUAL",
    "uk": "ПОТОЧНА ВАГА ТІЛА",
    "ru": "ТЕКУЩИЙ ВЕС ТЕЛА",
    "fr": "POIDS ACTUEL",
    "de": "AKTUELLES KÖRPERGEWICHT",
    "pt": "PESO CORPORAL ATUAL",
    "bg": "ТЕКУЩО ТЕЛЕСНО ТЕГЛО"
  },
  "PERSONAL INFORMATION": {
    "en": "PERSONAL INFORMATION",
    "es": "INFORMACIÓN PERSONAL",
    "uk": "ОСОБИСТА ІНФОРМАЦІЯ",
    "ru": "ЛИЧНАЯ ИНФОРМАЦИЯ",
    "fr": "INFORMATIONS PERSONNELLES",
    "de": "PERSÖNLICHE INFORMATIONEN",
    "pt": "INFORMAÇÕES PESSOAIS",
    "bg": "ЛИЧНА ИНФОРМАЦИЯ"
  },
  "PHYSICAL INFORMATION": {
    "en": "PHYSICAL INFORMATION",
    "es": "INFORMACIÓN FÍSICA",
    "uk": "ФІЗИЧНІ ДАНІ",
    "ru": "ФИЗИЧЕСКИЕ ДАННЫЕ",
    "fr": "INFORMATIONS PHYSIQUES",
    "de": "KÖRPERDATEN",
    "pt": "INFORMAÇÕES FÍSICAS",
    "bg": "ФИЗИЧЕСКИ ДАННИ"
  },
  "YOUR DATA.": {
    "en": "YOUR DATA.",
    "es": "TUS DATOS.",
    "uk": "ТВОЇ ДАНІ.",
    "ru": "ТВОИ ДАННЫЕ.",
    "fr": "TES DONNÉES.",
    "de": "DEINE DATEN.",
    "pt": "SEUS DADOS.",
    "bg": "ТВОИТЕ ДАННИ."
  },
  "BUILD YOUR ATHLETE PROFILE": {
    "en": "BUILD YOUR ATHLETE PROFILE",
    "es": "CREA TU PERFIL DE ATLETA",
    "uk": "СТВОРИ СВІЙ ПРОФІЛЬ АТЛЕТА",
    "ru": "СОЗДАЙ СВОЙ ПРОФИЛЬ АТЛЕТА",
    "fr": "CRÉE TON PROFIL D’ATHLÈTE",
    "de": "ERSTELLE DEIN ATHLETENPROFIL",
    "pt": "CRIE SEU PERFIL DE ATLETA",
    "bg": "СЪЗДАЙ СВОЯ ПРОФИЛ НА АТЛЕТ"
  },
  "Accurate data helps IRONAGE personalize your training and track your transformation.": {
    "en": "Accurate data helps IRONAGE personalize your training and track your transformation.",
    "es": "Los datos precisos ayudan a IRONAGE a personalizar tu entrenamiento y seguir tu transformación.",
    "uk": "Точні дані допомагають IRONAGE персоналізувати тренування та відстежувати твою трансформацію.",
    "ru": "Точные данные помогают IRONAGE персонализировать тренировки и отслеживать твою трансформацию.",
    "fr": "Des données précises aident IRONAGE à personnaliser ton entraînement et à suivre ta transformation.",
    "de": "Genaue Daten helfen IRONAGE, dein Training zu personalisieren und deine Transformation zu verfolgen.",
    "pt": "Dados precisos ajudam o IRONAGE a personalizar seu treino e acompanhar sua transformação.",
    "bg": "Точните данни помагат на IRONAGE да персонализира тренировките ти и да следи трансформацията ти."
  },
  "SAVE PERSONAL DATA": {
    "en": "SAVE PERSONAL DATA",
    "es": "GUARDAR DATOS PERSONALES",
    "uk": "ЗБЕРЕГТИ ОСОБИСТІ ДАНІ",
    "ru": "СОХРАНИТЬ ЛИЧНЫЕ ДАННЫЕ",
    "fr": "ENREGISTRER LES DONNÉES",
    "de": "PERSÖNLICHE DATEN SPEICHERN",
    "pt": "SALVAR DADOS PESSOAIS",
    "bg": "ЗАПАЗИ ЛИЧНИТЕ ДАННИ"
  },
  "TRAINING GOALS": {
    "en": "TRAINING GOALS",
    "es": "OBJETIVOS DE ENTRENAMIENTO",
    "uk": "ЦІЛІ ТРЕНУВАНЬ",
    "ru": "ЦЕЛИ ТРЕНИРОВОК",
    "fr": "OBJECTIFS D’ENTRAÎNEMENT",
    "de": "TRAININGSZIELE",
    "pt": "OBJETIVOS DE TREINO",
    "bg": "ТРЕНИРОВЪЧНИ ЦЕЛИ"
  },
  "TRAINING GOAL": {
    "en": "TRAINING GOAL",
    "es": "OBJETIVO DE ENTRENAMIENTO",
    "uk": "ЦІЛЬ ТРЕНУВАННЯ",
    "ru": "ЦЕЛЬ ТРЕНИРОВКИ",
    "fr": "OBJECTIF D’ENTRAÎNEMENT",
    "de": "TRAININGSZIEL",
    "pt": "OBJETIVO DE TREINO",
    "bg": "ТРЕНИРОВЪЧНА ЦЕЛ"
  },
  "YOUR MISSION": {
    "en": "YOUR MISSION",
    "es": "TU MISIÓN",
    "uk": "ТВОЯ МІСІЯ",
    "ru": "ТВОЯ МИССИЯ",
    "fr": "TA MISSION",
    "de": "DEINE MISSION",
    "pt": "SUA MISSÃO",
    "bg": "ТВОЯТА МИСИЯ"
  },
  "PRIMARY GOAL": {
    "en": "PRIMARY GOAL",
    "es": "OBJETIVO PRINCIPAL",
    "uk": "ГОЛОВНА ЦІЛЬ",
    "ru": "ОСНОВНАЯ ЦЕЛЬ",
    "fr": "OBJECTIF PRINCIPAL",
    "de": "HAUPTZIEL",
    "pt": "OBJETIVO PRINCIPAL",
    "bg": "ОСНОВНА ЦЕЛ"
  },
  "FOCUS YOUR TRAINING.": {
    "en": "FOCUS YOUR TRAINING.",
    "es": "ENFOCA TU ENTRENAMIENTO.",
    "uk": "СФОКУСУЙ ТРЕНУВАННЯ.",
    "ru": "СФОКУСИРУЙ ТРЕНИРОВКИ.",
    "fr": "CIBLE TON ENTRAÎNEMENT.",
    "de": "FOKUSSIERE DEIN TRAINING.",
    "pt": "FOQUE SEU TREINO.",
    "bg": "ФОКУСИРАЙ ТРЕНИРОВКИТЕ СИ."
  },
  "WHAT'S YOUR MAIN FOCUS?": {
    "en": "WHAT'S YOUR MAIN FOCUS?",
    "es": "¿CUÁL ES TU OBJETIVO PRINCIPAL?",
    "uk": "ЯКИЙ ТВІЙ ГОЛОВНИЙ ФОКУС?",
    "ru": "КАКОЙ ТВОЙ ГЛАВНЫЙ ФОКУС?",
    "fr": "QUEL EST TON OBJECTIF PRINCIPAL ?",
    "de": "WAS IST DEIN HAUPTFOKUS?",
    "pt": "QUAL É O SEU FOCO PRINCIPAL?",
    "bg": "КАКЪВ Е ОСНОВНИЯТ ТИ ФОКУС?"
  },
  "Choose your primary goal. IRONAGE will use it to personalize your training.": {
    "en": "Choose your primary goal. IRONAGE will use it to personalize your training.",
    "es": "Elige tu objetivo principal. IRONAGE lo usará para personalizar tu entrenamiento.",
    "uk": "Обери головну ціль. IRONAGE використає її для персоналізації тренувань.",
    "ru": "Выбери главную цель. IRONAGE использует её для персонализации тренировок.",
    "fr": "Choisis ton objectif principal. IRONAGE l’utilisera pour personnaliser ton entraînement.",
    "de": "Wähle dein Hauptziel. IRONAGE nutzt es, um dein Training zu personalisieren.",
    "pt": "Escolha seu objetivo principal. O IRONAGE o usará para personalizar seu treino.",
    "bg": "Избери основната си цел. IRONAGE ще я използва, за да персонализира тренировките ти."
  },
  "You can update your training goal anytime from your IRONAGE profile.": {
    "en": "You can update your training goal anytime from your IRONAGE profile.",
    "es": "Puedes cambiar tu objetivo de entrenamiento en cualquier momento desde tu perfil IRONAGE.",
    "uk": "Ти можеш змінити ціль тренувань будь-коли у профілі IRONAGE.",
    "ru": "Ты можешь изменить цель тренировок в любое время в профиле IRONAGE.",
    "fr": "Tu peux modifier ton objectif d’entraînement à tout moment depuis ton profil IRONAGE.",
    "de": "Du kannst dein Trainingsziel jederzeit in deinem IRONAGE-Profil ändern.",
    "pt": "Você pode alterar seu objetivo de treino a qualquer momento no perfil IRONAGE.",
    "bg": "Можеш да променяш тренировъчната си цел по всяко време от профила IRONAGE."
  },
  "SAVE TRAINING GOAL": {
    "en": "SAVE TRAINING GOAL",
    "es": "GUARDAR OBJETIVO",
    "uk": "ЗБЕРЕГТИ ЦІЛЬ",
    "ru": "СОХРАНИТЬ ЦЕЛЬ",
    "fr": "ENREGISTRER L’OBJECTIF",
    "de": "TRAININGSZIEL SPEICHERN",
    "pt": "SALVAR OBJETIVO",
    "bg": "ЗАПАЗИ ЦЕЛТА"
  },
  "BUILD MUSCLE": {
    "en": "BUILD MUSCLE",
    "es": "GANAR MÚSCULO",
    "uk": "НАБРАТИ М'ЯЗИ",
    "ru": "НАБРАТЬ МЫШЦЫ",
    "fr": "PRENDRE DU MUSCLE",
    "de": "MUSKELN AUFBAUEN",
    "pt": "GANHAR MÚSCULO",
    "bg": "ИЗГРАДИ МУСКУЛИ"
  },
  "Increase muscle mass and strength": {
    "en": "Increase muscle mass and strength",
    "es": "Aumenta masa muscular y fuerza",
    "uk": "Збільшуй м'язову масу та силу",
    "ru": "Увеличивай мышечную массу и силу",
    "fr": "Augmente la masse musculaire et la force",
    "de": "Muskelmasse und Kraft steigern",
    "pt": "Aumente massa muscular e força",
    "bg": "Увеличи мускулната маса и силата"
  },
  "LOSE WEIGHT": {
    "en": "LOSE WEIGHT",
    "es": "PERDER PESO",
    "uk": "СХУДНУТИ",
    "ru": "СБРОСИТЬ ВЕС",
    "fr": "PERDRE DU POIDS",
    "de": "GEWICHT VERLIEREN",
    "pt": "PERDER PESO",
    "bg": "ОТСЛАБВАНЕ"
  },
  "Burn fat and build a leaner physique": {
    "en": "Burn fat and build a leaner physique",
    "es": "Quema grasa y consigue un físico más definido",
    "uk": "Спалюй жир і формуй більш підтягнуте тіло",
    "ru": "Сжигай жир и формируй более рельефное тело",
    "fr": "Brûle les graisses et affine ton physique",
    "de": "Fett verbrennen und einen schlankeren Körper aufbauen",
    "pt": "Queime gordura e construa um físico mais definido",
    "bg": "Изгаряй мазнини и изгради по-стегната физика"
  },
  "STRENGTH": {
    "en": "STRENGTH",
    "es": "FUERZA",
    "uk": "СИЛА",
    "ru": "СИЛА",
    "fr": "FORCE",
    "de": "KRAFT",
    "pt": "FORÇA",
    "bg": "СИЛА"
  },
  "Become stronger and more powerful": {
    "en": "Become stronger and more powerful",
    "es": "Hazte más fuerte y potente",
    "uk": "Ставай сильнішим і потужнішим",
    "ru": "Становись сильнее и мощнее",
    "fr": "Deviens plus fort et plus puissant",
    "de": "Werde stärker und kraftvoller",
    "pt": "Fique mais forte e poderoso",
    "bg": "Стани по-силен и мощен"
  },
  "ENDURANCE": {
    "en": "ENDURANCE",
    "es": "RESISTENCIA",
    "uk": "ВИТРИВАЛІСТЬ",
    "ru": "ВЫНОСЛИВОСТЬ",
    "fr": "ENDURANCE",
    "de": "AUSDAUER",
    "pt": "RESISTÊNCIA",
    "bg": "ИЗДРЪЖЛИВОСТ"
  },
  "Improve stamina and performance": {
    "en": "Improve stamina and performance",
    "es": "Mejora la resistencia y el rendimiento",
    "uk": "Покращуй витривалість і результативність",
    "ru": "Улучшай выносливость и результативность",
    "fr": "Améliore l’endurance et les performances",
    "de": "Ausdauer und Leistung verbessern",
    "pt": "Melhore a resistência e o desempenho",
    "bg": "Подобри издръжливостта и представянето"
  },
  "GENERAL FITNESS": {
    "en": "GENERAL FITNESS",
    "es": "FORMA GENERAL",
    "uk": "ЗАГАЛЬНА ФОРМА",
    "ru": "ОБЩАЯ ФОРМА",
    "fr": "FORME GÉNÉRALE",
    "de": "ALLGEMEINE FITNESS",
    "pt": "CONDICIONAMENTO GERAL",
    "bg": "ОБЩА ФОРМА"
  },
  "Build your complete athletic base": {
    "en": "Build your complete athletic base",
    "es": "Construye una base atlética completa",
    "uk": "Побудуй повну атлетичну базу",
    "ru": "Построй полную атлетическую базу",
    "fr": "Construis une base athlétique complète",
    "de": "Baue deine komplette athletische Basis auf",
    "pt": "Construa uma base atlética completa",
    "bg": "Изгради цялостна атлетична основа"
  },
  "MAINTAIN": {
    "en": "MAINTAIN",
    "es": "MANTENER",
    "uk": "ПІДТРИМУВАТИ",
    "ru": "ПОДДЕРЖИВАТЬ",
    "fr": "MAINTENIR",
    "de": "HALTEN",
    "pt": "MANTER",
    "bg": "ПОДДЪРЖАЙ"
  },
  "Stay consistent and maintain progress": {
    "en": "Stay consistent and maintain progress",
    "es": "Mantén la constancia y conserva el progreso",
    "uk": "Зберігай стабільність і підтримуй прогрес",
    "ru": "Сохраняй стабильность и поддерживай прогресс",
    "fr": "Reste régulier et maintiens tes progrès",
    "de": "Bleib konsequent und halte deinen Fortschritt",
    "pt": "Mantenha a consistência e o progresso",
    "bg": "Бъди постоянен и запази прогреса"
  },
  "NOTIFICATIONS": {
    "en": "NOTIFICATIONS",
    "es": "NOTIFICACIONES",
    "uk": "СПОВІЩЕННЯ",
    "ru": "УВЕДОМЛЕНИЯ",
    "fr": "NOTIFICATIONS",
    "de": "BENACHRICHTIGUNGEN",
    "pt": "NOTIFICAÇÕES",
    "bg": "ИЗВЕСТИЯ"
  },
  "REMINDERS · UPDATES · CONTROL": {
    "en": "REMINDERS · UPDATES · CONTROL",
    "es": "RECORDATORIOS · ACTUALIZACIONES · CONTROL",
    "uk": "НАГАДУВАННЯ · ОНОВЛЕННЯ · КЕРУВАННЯ",
    "ru": "НАПОМИНАНИЯ · ОБНОВЛЕНИЯ · УПРАВЛЕНИЕ",
    "fr": "RAPPELS · MISES À JOUR · CONTRÔLE",
    "de": "ERINNERUNGEN · UPDATES · STEUERUNG",
    "pt": "LEMBRETES · ATUALIZAÇÕES · CONTROLE",
    "bg": "НАПОМНЯНИЯ · АКТУАЛИЗАЦИИ · КОНТРОЛ"
  },
  "NOTIFICATION CENTER": {
    "en": "NOTIFICATION CENTER",
    "es": "CENTRO DE NOTIFICACIONES",
    "uk": "ЦЕНТР СПОВІЩЕНЬ",
    "ru": "ЦЕНТР УВЕДОМЛЕНИЙ",
    "fr": "CENTRE DE NOTIFICATIONS",
    "de": "BENACHRICHTIGUNGSZENTRALE",
    "pt": "CENTRAL DE NOTIFICAÇÕES",
    "bg": "ЦЕНТЪР ЗА ИЗВЕСТИЯ"
  },
  "STAY CONSISTENT.": {
    "en": "STAY CONSISTENT.",
    "es": "MANTÉN LA CONSTANCIA.",
    "uk": "БУДЬ СТАБІЛЬНИМ.",
    "ru": "БУДЬ СТАБИЛЬНЫМ.",
    "fr": "RESTE RÉGULIER.",
    "de": "BLEIB KONSEQUENT.",
    "pt": "MANTENHA A CONSISTÊNCIA.",
    "bg": "БЪДИ ПОСТОЯНЕН."
  },
  "Control the reminders and updates you want from IRONAGE.": {
    "en": "Control the reminders and updates you want from IRONAGE.",
    "es": "Controla los recordatorios y actualizaciones que quieres recibir de IRONAGE.",
    "uk": "Керуй нагадуваннями та оновленнями, які хочеш отримувати від IRONAGE.",
    "ru": "Управляй напоминаниями и обновлениями, которые хочешь получать от IRONAGE.",
    "fr": "Contrôle les rappels et mises à jour que tu veux recevoir d’IRONAGE.",
    "de": "Steuere die Erinnerungen und Updates, die du von IRONAGE erhalten möchtest.",
    "pt": "Controle os lembretes e atualizações que deseja receber do IRONAGE.",
    "bg": "Управлявай напомнянията и актуализациите, които искаш да получаваш от IRONAGE."
  },
  "TEST NOTIFICATION": {
    "en": "TEST NOTIFICATION",
    "es": "NOTIFICACIÓN DE PRUEBA",
    "uk": "ТЕСТОВЕ СПОВІЩЕННЯ",
    "ru": "ТЕСТОВОЕ УВЕДОМЛЕНИЕ",
    "fr": "NOTIFICATION TEST",
    "de": "TESTBENACHRICHTIGUNG",
    "pt": "NOTIFICAÇÃO DE TESTE",
    "bg": "ТЕСТОВО ИЗВЕСТИЕ"
  },
  "NOTIFICATION STATUS": {
    "en": "NOTIFICATION STATUS",
    "es": "ESTADO DE NOTIFICACIONES",
    "uk": "СТАТУС СПОВІЩЕНЬ",
    "ru": "СТАТУС УВЕДОМЛЕНИЙ",
    "fr": "STATUT DES NOTIFICATIONS",
    "de": "BENACHRICHTIGUNGSSTATUS",
    "pt": "STATUS DAS NOTIFICAÇÕES",
    "bg": "СТАТУС НА ИЗВЕСТИЯТА"
  },
  "WORKOUT REMINDERS": {
    "en": "WORKOUT REMINDERS",
    "es": "RECORDATORIOS DE ENTRENAMIENTO",
    "uk": "НАГАДУВАННЯ ПРО ТРЕНУВАННЯ",
    "ru": "НАПОМИНАНИЯ О ТРЕНИРОВКАХ",
    "fr": "RAPPELS D’ENTRAÎNEMENT",
    "de": "TRAININGSERINNERUNGEN",
    "pt": "LEMBRETES DE TREINO",
    "bg": "НАПОМНЯНИЯ ЗА ТРЕНИРОВКА"
  },
  "Remind me when it is time to train": {
    "en": "Remind me when it is time to train",
    "es": "Recuérdame cuándo es hora de entrenar",
    "uk": "Нагадувати, коли час тренуватися",
    "ru": "Напоминать, когда пора тренироваться",
    "fr": "Me rappeler quand il est temps de m’entraîner",
    "de": "Erinnere mich, wenn es Zeit zum Trainieren ist",
    "pt": "Lembre-me quando for hora de treinar",
    "bg": "Напомняй ми, когато е време за тренировка"
  },
  "WORKOUT TIME": {
    "en": "WORKOUT TIME",
    "es": "HORA DE ENTRENAMIENTO",
    "uk": "ЧАС ТРЕНУВАННЯ",
    "ru": "ВРЕМЯ ТРЕНИРОВКИ",
    "fr": "HEURE D’ENTRAÎNEMENT",
    "de": "TRAININGSZEIT",
    "pt": "HORA DO TREINO",
    "bg": "ЧАС ЗА ТРЕНИРОВКА"
  },
  "PROGRESS UPDATES": {
    "en": "PROGRESS UPDATES",
    "es": "ACTUALIZACIONES DE PROGRESO",
    "uk": "ОНОВЛЕННЯ ПРОГРЕСУ",
    "ru": "ОБНОВЛЕНИЯ ПРОГРЕССА",
    "fr": "MISES À JOUR DES PROGRÈS",
    "de": "FORTSCHRITTS-UPDATES",
    "pt": "ATUALIZAÇÕES DE PROGRESSO",
    "bg": "АКТУАЛИЗАЦИИ ЗА ПРОГРЕСА"
  },
  "Level, XP and weekly progress updates": {
    "en": "Level, XP and weekly progress updates",
    "es": "Actualizaciones de nivel, XP y progreso semanal",
    "uk": "Оновлення рівня, XP та тижневого прогресу",
    "ru": "Обновления уровня, XP и недельного прогресса",
    "fr": "Mises à jour du niveau, XP et progrès hebdomadaires",
    "de": "Updates zu Level, XP und Wochenfortschritt",
    "pt": "Atualizações de nível, XP e progresso semanal",
    "bg": "Актуализации за ниво, XP и седмичен прогрес"
  },
  "NUTRITION REMINDERS": {
    "en": "NUTRITION REMINDERS",
    "es": "RECORDATORIOS DE NUTRICIÓN",
    "uk": "НАГАДУВАННЯ ПРО ХАРЧУВАННЯ",
    "ru": "НАПОМИНАНИЯ О ПИТАНИИ",
    "fr": "RAPPELS NUTRITION",
    "de": "ERNÄHRUNGSERINNERUNGEN",
    "pt": "LEMBRETES DE NUTRIÇÃO",
    "bg": "НАПОМНЯНИЯ ЗА ХРАНЕНЕ"
  },
  "Water and nutrition reminders": {
    "en": "Water and nutrition reminders",
    "es": "Recordatorios de agua y nutrición",
    "uk": "Нагадування про воду та харчування",
    "ru": "Напоминания о воде и питании",
    "fr": "Rappels d’eau et de nutrition",
    "de": "Wasser- und Ernährungserinnerungen",
    "pt": "Lembretes de água e nutrição",
    "bg": "Напомняния за вода и хранене"
  },
  "MORNING": {
    "en": "MORNING",
    "es": "MAÑANA",
    "uk": "РАНОК",
    "ru": "УТРО",
    "fr": "MATIN",
    "de": "MORGEN",
    "pt": "MANHÃ",
    "bg": "СУТРИН"
  },
  "AFTERNOON": {
    "en": "AFTERNOON",
    "es": "TARDE",
    "uk": "ДЕНЬ",
    "ru": "ДЕНЬ",
    "fr": "APRÈS-MIDI",
    "de": "NACHMITTAG",
    "pt": "TARDE",
    "bg": "СЛЕДОБЕД"
  },
  "EVENING": {
    "en": "EVENING",
    "es": "NOCHE",
    "uk": "ВЕЧІР",
    "ru": "ВЕЧЕР",
    "fr": "SOIR",
    "de": "ABEND",
    "pt": "NOITE",
    "bg": "ВЕЧЕР"
  },
  "MOTIVATIONAL MESSAGES": {
    "en": "MOTIVATIONAL MESSAGES",
    "es": "MENSAJES MOTIVACIONALES",
    "uk": "МОТИВАЦІЙНІ ПОВІДОМЛЕННЯ",
    "ru": "МОТИВАЦИОННЫЕ СООБЩЕНИЯ",
    "fr": "MESSAGES MOTIVANTS",
    "de": "MOTIVATIONSNACHRICHTEN",
    "pt": "MENSAGENS MOTIVACIONAIS",
    "bg": "МОТИВАЦИОННИ СЪОБЩЕНИЯ"
  },
  "Daily IRONAGE motivation": {
    "en": "Daily IRONAGE motivation",
    "es": "Motivación diaria de IRONAGE",
    "uk": "Щоденна мотивація IRONAGE",
    "ru": "Ежедневная мотивация IRONAGE",
    "fr": "Motivation IRONAGE quotidienne",
    "de": "Tägliche IRONAGE-Motivation",
    "pt": "Motivação diária IRONAGE",
    "bg": "Ежедневна мотивация от IRONAGE"
  },
  "MOTIVATION TIME": {
    "en": "MOTIVATION TIME",
    "es": "HORA DE MOTIVACIÓN",
    "uk": "ЧАС МОТИВАЦІЇ",
    "ru": "ВРЕМЯ МОТИВАЦИИ",
    "fr": "HEURE DE MOTIVATION",
    "de": "MOTIVATIONSZEIT",
    "pt": "HORA DA MOTIVAÇÃO",
    "bg": "ЧАС ЗА МОТИВАЦИЯ"
  },
  "SETTINGS": {
    "en": "SETTINGS",
    "es": "AJUSTES",
    "uk": "НАЛАШТУВАННЯ",
    "ru": "НАСТРОЙКИ",
    "fr": "RÉGLAGES",
    "de": "EINSTELLUNGEN",
    "pt": "CONFIGURAÇÕES",
    "bg": "НАСТРОЙКИ"
  },
  "WORKOUTS": {
    "en": "WORKOUTS",
    "es": "ENTRENAMIENTOS",
    "uk": "ТРЕНУВАННЯ",
    "ru": "ТРЕНИРОВКИ",
    "fr": "ENTRAÎNEMENTS",
    "de": "TRAININGS",
    "pt": "TREINOS",
    "bg": "ТРЕНИРОВКИ"
  },
  "STREAK": {
    "en": "STREAK",
    "es": "RACHA",
    "uk": "СЕРІЯ",
    "ru": "СЕРИЯ",
    "fr": "SÉRIE",
    "de": "SERIE",
    "pt": "SEQUÊNCIA",
    "bg": "СЕРИЯ"
  },
  "ATHLETE PROFILE": {
    "en": "ATHLETE PROFILE",
    "es": "PERFIL DEL ATLETA",
    "uk": "ПРОФІЛЬ АТЛЕТА",
    "ru": "ПРОФИЛЬ АТЛЕТА",
    "fr": "PROFIL ATHLÈTE",
    "de": "ATHLETENPROFIL",
    "pt": "PERFIL DO ATLETA",
    "bg": "ПРОФИЛ НА АТЛЕТ"
  },
  "LOG OUT": {
    "en": "LOG OUT",
    "es": "CERRAR SESIÓN",
    "uk": "ВИЙТИ",
    "ru": "ВЫЙТИ",
    "fr": "SE DÉCONNECTER",
    "de": "ABMELDEN",
    "pt": "SAIR",
    "bg": "ИЗХОД"
  },
  "END CURRENT SESSION": {
    "en": "END CURRENT SESSION",
    "es": "FINALIZAR SESIÓN ACTUAL",
    "uk": "ЗАВЕРШИТИ ПОТОЧНУ СЕСІЮ",
    "ru": "ЗАВЕРШИТЬ ТЕКУЩУЮ СЕССИЮ",
    "fr": "TERMINER LA SESSION ACTUELLE",
    "de": "AKTUELLE SITZUNG BEENDEN",
    "pt": "ENCERRAR SESSÃO ATUAL",
    "bg": "ПРЕКРАТИ ТЕКУЩАТА СЕСИЯ"
  },
  "MY PROGRAM": {
    "en": "MY PROGRAM",
    "es": "MI PROGRAMA",
    "uk": "МОЯ ПРОГРАМА",
    "ru": "МОЯ ПРОГРАММА",
    "fr": "MON PROGRAMME",
    "de": "MEIN PROGRAMM",
    "pt": "MEU PROGRAMA",
    "bg": "МОЯТА ПРОГРАМА"
  },
  "COACH SYSTEM": {
    "en": "COACH SYSTEM",
    "es": "SISTEMA DE ENTRENADOR",
    "uk": "СИСТЕМА ТРЕНЕРА",
    "ru": "СИСТЕМА ТРЕНЕРА",
    "fr": "SYSTÈME COACH",
    "de": "COACH-SYSTEM",
    "pt": "SISTEMA DO TREINADOR",
    "bg": "ТРЕНЬОРСКА СИСТЕМА"
  },
  "IRONAGE SESSION": {
    "en": "IRONAGE SESSION",
    "es": "SESIÓN IRONAGE",
    "uk": "СЕСІЯ IRONAGE",
    "ru": "СЕССИЯ IRONAGE",
    "fr": "SESSION IRONAGE",
    "de": "IRONAGE SESSION",
    "pt": "SESSÃO IRONAGE",
    "bg": "СЕСИЯ IRONAGE"
  },
  "CURRENT EXERCISE": {
    "en": "CURRENT EXERCISE",
    "es": "EJERCICIO ACTUAL",
    "uk": "ПОТОЧНА ВПРАВА",
    "ru": "ТЕКУЩЕЕ УПРАЖНЕНИЕ",
    "fr": "EXERCICE ACTUEL",
    "de": "AKTUELLE ÜBUNG",
    "pt": "EXERCÍCIO ATUAL",
    "bg": "ТЕКУЩО УПРАЖНЕНИЕ"
  },
  "SET": {
    "en": "SET",
    "es": "SERIE",
    "uk": "ПІДХІД",
    "ru": "ПОДХОД",
    "fr": "SÉRIE",
    "de": "SATZ",
    "pt": "SÉRIE",
    "bg": "СЕРИЯ"
  },
  "REPS": {
    "en": "REPS",
    "es": "REPS",
    "uk": "ПОВТОРИ",
    "ru": "ПОВТОРЫ",
    "fr": "RÉP.",
    "de": "WDH.",
    "pt": "REPS",
    "bg": "ПОВТОРЕНИЯ"
  },
  "TOTAL": {
    "en": "TOTAL",
    "es": "TOTAL",
    "uk": "ВСЬОГО",
    "ru": "ВСЕГО",
    "fr": "TOTAL",
    "de": "GESAMT",
    "pt": "TOTAL",
    "bg": "ОБЩО"
  },
  "COMPLETE SET": {
    "en": "COMPLETE SET",
    "es": "COMPLETAR SERIE",
    "uk": "ЗАВЕРШИТИ ПІДХІД",
    "ru": "ЗАВЕРШИТЬ ПОДХОД",
    "fr": "TERMINER LA SÉRIE",
    "de": "SATZ ABSCHLIESSEN",
    "pt": "CONCLUIR SÉRIE",
    "bg": "ЗАВЪРШИ СЕРИЯТА"
  },
  "NEXT EXERCISE": {
    "en": "NEXT EXERCISE",
    "es": "SIGUIENTE EJERCICIO",
    "uk": "НАСТУПНА ВПРАВА",
    "ru": "СЛЕДУЮЩЕЕ УПРАЖНЕНИЕ",
    "fr": "EXERCICE SUIVANT",
    "de": "NÄCHSTE ÜBUNG",
    "pt": "PRÓXIMO EXERCÍCIO",
    "bg": "СЛЕДВАЩО УПРАЖНЕНИЕ"
  },
  "FINISH WORKOUT": {
    "en": "FINISH WORKOUT",
    "es": "FINALIZAR ENTRENAMIENTO",
    "uk": "ЗАВЕРШИТИ ТРЕНУВАННЯ",
    "ru": "ЗАВЕРШИТЬ ТРЕНИРОВКУ",
    "fr": "TERMINER L’ENTRAÎNEMENT",
    "de": "TRAINING BEENDEN",
    "pt": "FINALIZAR TREINO",
    "bg": "ЗАВЪРШИ ТРЕНИРОВКАТА"
  },
  "EXIT WORKOUT": {
    "en": "EXIT WORKOUT",
    "es": "SALIR DEL ENTRENAMIENTO",
    "uk": "ВИЙТИ З ТРЕНУВАННЯ",
    "ru": "ВЫЙТИ ИЗ ТРЕНИРОВКИ",
    "fr": "QUITTER L’ENTRAÎNEMENT",
    "de": "TRAINING VERLASSEN",
    "pt": "SAIR DO TREINO",
    "bg": "ИЗЛЕЗ ОТ ТРЕНИРОВКАТА"
  },
  "EXIT WORKOUT?": {
    "en": "EXIT WORKOUT?",
    "es": "¿SALIR DEL ENTRENAMIENTO?",
    "uk": "ВИЙТИ З ТРЕНУВАННЯ?",
    "ru": "ВЫЙТИ ИЗ ТРЕНИРОВКИ?",
    "fr": "QUITTER L’ENTRAÎNEMENT ?",
    "de": "TRAINING VERLASSEN?",
    "pt": "SAIR DO TREINO?",
    "bg": "ИЗЛИЗАНЕ ОТ ТРЕНИРОВКАТА?"
  },
  "Your current workout progress will be lost.": {
    "en": "Your current workout progress will be lost.",
    "es": "Se perderá el progreso de tu entrenamiento actual.",
    "uk": "Поточний прогрес тренування буде втрачено.",
    "ru": "Текущий прогресс тренировки будет потерян.",
    "fr": "Ta progression actuelle sera perdue.",
    "de": "Dein aktueller Trainingsfortschritt geht verloren.",
    "pt": "Seu progresso atual no treino será perdido.",
    "bg": "Текущият ти прогрес в тренировката ще бъде загубен."
  },
  "CONTINUE TRAINING": {
    "en": "CONTINUE TRAINING",
    "es": "CONTINUAR ENTRENAMIENTO",
    "uk": "ПРОДОВЖИТИ ТРЕНУВАННЯ",
    "ru": "ПРОДОЛЖИТЬ ТРЕНИРОВКУ",
    "fr": "CONTINUER L’ENTRAÎNEMENT",
    "de": "TRAINING FORTSETZEN",
    "pt": "CONTINUAR TREINO",
    "bg": "ПРОДЪЛЖИ ТРЕНИРОВКАТА"
  },
  "One more set.": {
    "en": "One more set.",
    "es": "Una serie más.",
    "uk": "Ще один підхід.",
    "ru": "Ещё один подход.",
    "fr": "Encore une série.",
    "de": "Noch ein Satz.",
    "pt": "Mais uma série.",
    "bg": "Още една серия."
  },
  "One stronger version of you.": {
    "en": "One stronger version of you.",
    "es": "Una versión más fuerte de ti.",
    "uk": "Ще одна сильніша версія тебе.",
    "ru": "Ещё одна более сильная версия тебя.",
    "fr": "Une version plus forte de toi.",
    "de": "Eine stärkere Version von dir.",
    "pt": "Uma versão mais forte de você.",
    "bg": "Още една по-силна версия на теб."
  },
  "IRONAGE MINDSET": {
    "en": "IRONAGE MINDSET",
    "es": "MENTALIDAD IRONAGE",
    "uk": "МИСЛЕННЯ IRONAGE",
    "ru": "МЫШЛЕНИЕ IRONAGE",
    "fr": "MENTALITÉ IRONAGE",
    "de": "IRONAGE MINDSET",
    "pt": "MENTALIDADE IRONAGE",
    "bg": "НАГЛАСА IRONAGE"
  },
  "SESSION COMPLETE": {
    "en": "SESSION COMPLETE",
    "es": "SESIÓN COMPLETADA",
    "uk": "СЕСІЮ ЗАВЕРШЕНО",
    "ru": "СЕССИЯ ЗАВЕРШЕНА",
    "fr": "SESSION TERMINÉE",
    "de": "SESSION ABGESCHLOSSEN",
    "pt": "SESSÃO CONCLUÍDA",
    "bg": "СЕСИЯТА Е ЗАВЪРШЕНА"
  },
  "WORKOUT FINISHED": {
    "en": "WORKOUT FINISHED",
    "es": "ENTRENAMIENTO FINALIZADO",
    "uk": "ТРЕНУВАННЯ ЗАВЕРШЕНО",
    "ru": "ТРЕНИРОВКА ЗАВЕРШЕНА",
    "fr": "ENTRAÎNEMENT TERMINÉ",
    "de": "TRAINING BEENDET",
    "pt": "TREINO FINALIZADO",
    "bg": "ТРЕНИРОВКАТА Е ЗАВЪРШЕНА"
  },
  "Workout completed": {
    "en": "Workout completed",
    "es": "Entrenamiento completado",
    "uk": "Тренування завершено",
    "ru": "Тренировка завершена",
    "fr": "Entraînement terminé",
    "de": "Training abgeschlossen",
    "pt": "Treino concluído",
    "bg": "Тренировката е завършена"
  },
  "YOU": {
    "en": "YOU",
    "es": "TÚ",
    "uk": "ТИ",
    "ru": "ТЫ",
    "fr": "TU",
    "de": "DU",
    "pt": "VOCÊ",
    "bg": "ТИ"
  },
  "DID IT.": {
    "en": "DID IT.",
    "es": "LO LOGRASTE.",
    "uk": "ЦЕ ЗРОБИВ.",
    "ru": "ЭТО СДЕЛАЛ.",
    "fr": "L’AS FAIT.",
    "de": "HAST ES GESCHAFFT.",
    "pt": "CONSEGUIU.",
    "bg": "УСПЯ."
  },
  "Another step forward.": {
    "en": "Another step forward.",
    "es": "Otro paso adelante.",
    "uk": "Ще один крок уперед.",
    "ru": "Ещё один шаг вперёд.",
    "fr": "Un pas de plus en avant.",
    "de": "Ein weiterer Schritt nach vorn.",
    "pt": "Mais um passo à frente.",
    "bg": "Още една крачка напред."
  },
  "TIME": {
    "en": "TIME",
    "es": "TIEMPO",
    "uk": "ЧАС",
    "ru": "ВРЕМЯ",
    "fr": "TEMPS",
    "de": "ZEIT",
    "pt": "TEMPO",
    "bg": "ВРЕМЕ"
  },
  "EXERCISES": {
    "en": "EXERCISES",
    "es": "EJERCICIOS",
    "uk": "ВПРАВИ",
    "ru": "УПРАЖНЕНИЯ",
    "fr": "EXERCICES",
    "de": "ÜBUNGEN",
    "pt": "EXERCÍCIOS",
    "bg": "УПРАЖНЕНИЯ"
  },
  "CURRENT LEVEL": {
    "en": "CURRENT LEVEL",
    "es": "NIVEL ACTUAL",
    "uk": "ПОТОЧНИЙ РІВЕНЬ",
    "ru": "ТЕКУЩИЙ УРОВЕНЬ",
    "fr": "NIVEAU ACTUEL",
    "de": "AKTUELLES LEVEL",
    "pt": "NÍVEL ATUAL",
    "bg": "ТЕКУЩО НИВО"
  },
  "CURRENT STREAK": {
    "en": "CURRENT STREAK",
    "es": "RACHA ACTUAL",
    "uk": "ПОТОЧНА СЕРІЯ",
    "ru": "ТЕКУЩАЯ СЕРИЯ",
    "fr": "SÉRIE ACTUELLE",
    "de": "AKTUELLE SERIE",
    "pt": "SEQUÊNCIA ATUAL",
    "bg": "ТЕКУЩА СЕРИЯ"
  },
  "TOTAL XP": {
    "en": "TOTAL XP",
    "es": "XP TOTAL",
    "uk": "ВСЬОГО XP",
    "ru": "ВСЕГО XP",
    "fr": "XP TOTAL",
    "de": "GESAMT-XP",
    "pt": "XP TOTAL",
    "bg": "ОБЩО XP"
  },
  "LEVEL UP AHEAD": {
    "en": "LEVEL UP AHEAD",
    "es": "PRÓXIMO NIVEL CERCA",
    "uk": "ПОПЕРЕДУ НОВИЙ РІВЕНЬ",
    "ru": "ВПЕРЕДИ НОВЫЙ УРОВЕНЬ",
    "fr": "PROCHAIN NIVEAU EN VUE",
    "de": "NÄCHSTES LEVEL VORAUS",
    "pt": "PRÓXIMO NÍVEL À FRENTE",
    "bg": "СЛЕДВАЩО НИВО НАПРЕД"
  },
  "VIEW PROGRESS": {
    "en": "VIEW PROGRESS",
    "es": "VER PROGRESO",
    "uk": "ПЕРЕГЛЯНУТИ ПРОГРЕС",
    "ru": "ПОСМОТРЕТЬ ПРОГРЕСС",
    "fr": "VOIR LES PROGRÈS",
    "de": "FORTSCHRITT ANZEIGEN",
    "pt": "VER PROGRESSO",
    "bg": "ВИЖ ПРОГРЕСА"
  },
  "BACK TO DASHBOARD": {
    "en": "BACK TO DASHBOARD",
    "es": "VOLVER AL INICIO",
    "uk": "НАЗАД НА ГОЛОВНУ",
    "ru": "НАЗАД НА ГЛАВНУЮ",
    "fr": "RETOUR À L’ACCUEIL",
    "de": "ZURÜCK ZUM DASHBOARD",
    "pt": "VOLTAR AO PAINEL",
    "bg": "НАЗАД КЪМ НАЧАЛОТО"
  },
  "DISCIPLINE": {
    "en": "DISCIPLINE",
    "es": "DISCIPLINA",
    "uk": "ДИСЦИПЛІНА",
    "ru": "ДИСЦИПЛИНА",
    "fr": "DISCIPLINE",
    "de": "DISZIPLIN",
    "pt": "DISCIPLINA",
    "bg": "ДИСЦИПЛИНА"
  },
  "BUILDS": {
    "en": "BUILDS",
    "es": "CONSTRUYE",
    "uk": "БУДУЄ",
    "ru": "СТРОИТ",
    "fr": "CONSTRUIT",
    "de": "BAUT",
    "pt": "CONSTRÓI",
    "bg": "ИЗГРАЖДА"
  },
  "RESULTS.": {
    "en": "RESULTS.",
    "es": "RESULTADOS.",
    "uk": "РЕЗУЛЬТАТИ.",
    "ru": "РЕЗУЛЬТАТЫ.",
    "fr": "RÉSULTATS.",
    "de": "ERGEBNISSE.",
    "pt": "RESULTADOS.",
    "bg": "РЕЗУЛТАТИ."
  },
  "IRONAGE COACHING": {
    "en": "IRONAGE COACHING",
    "es": "COACHING IRONAGE",
    "uk": "ТРЕНЕРСТВО IRONAGE",
    "ru": "ТРЕНЕРСТВО IRONAGE",
    "fr": "COACHING IRONAGE",
    "de": "IRONAGE COACHING",
    "pt": "COACHING IRONAGE",
    "bg": "IRONAGE КОУЧИНГ"
  },
  "YOUR COACH. YOUR PLAN. YOUR WORK.": {
    "en": "YOUR COACH. YOUR PLAN. YOUR WORK.",
    "es": "TU ENTRENADOR. TU PLAN. TU TRABAJO.",
    "uk": "ТВІЙ ТРЕНЕР. ТВІЙ ПЛАН. ТВОЯ РОБОТА.",
    "ru": "ТВОЙ ТРЕНЕР. ТВОЙ ПЛАН. ТВОЯ РАБОТА.",
    "fr": "TON COACH. TON PLAN. TON TRAVAIL.",
    "de": "DEIN COACH. DEIN PLAN. DEINE ARBEIT.",
    "pt": "SEU TREINADOR. SEU PLANO. SEU TRABALHO.",
    "bg": "ТВОЯТ ТРЕНЬОР. ТВОЯТ ПЛАН. ТВОЯТА РАБОТА."
  },
  "LOADING PROGRAM...": {
    "en": "LOADING PROGRAM...",
    "es": "CARGANDO PROGRAMA...",
    "uk": "ЗАВАНТАЖЕННЯ ПРОГРАМИ...",
    "ru": "ЗАГРУЗКА ПРОГРАММЫ...",
    "fr": "CHARGEMENT DU PROGRAMME...",
    "de": "PROGRAMM WIRD GELADEN...",
    "pt": "CARREGANDO PROGRAMA...",
    "bg": "ЗАРЕЖДАНЕ НА ПРОГРАМАТА..."
  },
  "PROGRAM LOAD ERROR": {
    "en": "PROGRAM LOAD ERROR",
    "es": "ERROR AL CARGAR EL PROGRAMA",
    "uk": "ПОМИЛКА ЗАВАНТАЖЕННЯ ПРОГРАМИ",
    "ru": "ОШИБКА ЗАГРУЗКИ ПРОГРАММЫ",
    "fr": "ERREUR DE CHARGEMENT",
    "de": "FEHLER BEIM LADEN DES PROGRAMMS",
    "pt": "ERRO AO CARREGAR PROGRAMA",
    "bg": "ГРЕШКА ПРИ ЗАРЕЖДАНЕ НА ПРОГРАМАТА"
  },
  "NO ACTIVE PROGRAM": {
    "en": "NO ACTIVE PROGRAM",
    "es": "SIN PROGRAMA ACTIVO",
    "uk": "НЕМАЄ АКТИВНОЇ ПРОГРАМИ",
    "ru": "НЕТ АКТИВНОЙ ПРОГРАММЫ",
    "fr": "AUCUN PROGRAMME ACTIF",
    "de": "KEIN AKTIVES PROGRAMM",
    "pt": "SEM PROGRAMA ATIVO",
    "bg": "НЯМА АКТИВНА ПРОГРАМА"
  },
  "YOUR COACH HAS NOT ASSIGNED A PROGRAM YET.": {
    "en": "YOUR COACH HAS NOT ASSIGNED A PROGRAM YET.",
    "es": "TU ENTRENADOR AÚN NO TE HA ASIGNADO UN PROGRAMA.",
    "uk": "ТВІЙ ТРЕНЕР ЩЕ НЕ ПРИЗНАЧИВ ПРОГРАМУ.",
    "ru": "ТВОЙ ТРЕНЕР ЕЩЁ НЕ НАЗНАЧИЛ ПРОГРАММУ.",
    "fr": "TON COACH NE T’A PAS ENCORE ATTRIBUÉ DE PROGRAMME.",
    "de": "DEIN COACH HAT NOCH KEIN PROGRAMM ZUGEWIESEN.",
    "pt": "SEU TREINADOR AINDA NÃO ATRIBUIU UM PROGRAMA.",
    "bg": "ТВОЯТ ТРЕНЬОР ОЩЕ НЕ Е НАЗНАЧИЛ ПРОГРАМА."
  },
  "Once a coach assigns your training plan, it will appear here.": {
    "en": "Once a coach assigns your training plan, it will appear here.",
    "es": "Cuando tu entrenador asigne un plan, aparecerá aquí.",
    "uk": "Коли тренер призначить план тренувань, він з’явиться тут.",
    "ru": "Когда тренер назначит план тренировок, он появится здесь.",
    "fr": "Une fois qu’un coach t’aura attribué un plan, il apparaîtra ici.",
    "de": "Sobald dein Coach einen Trainingsplan zuweist, erscheint er hier.",
    "pt": "Quando seu treinador atribuir um plano, ele aparecerá aqui.",
    "bg": "Когато треньорът ти назначи план, той ще се появи тук."
  },
  "YOUR COACH": {
    "en": "YOUR COACH",
    "es": "TU ENTRENADOR",
    "uk": "ТВІЙ ТРЕНЕР",
    "ru": "ТВОЙ ТРЕНЕР",
    "fr": "TON COACH",
    "de": "DEIN COACH",
    "pt": "SEU TREINADOR",
    "bg": "ТВОЯТ ТРЕНЬОР"
  },
  "ACTIVE PROGRAM": {
    "en": "ACTIVE PROGRAM",
    "es": "PROGRAMA ACTIVO",
    "uk": "АКТИВНА ПРОГРАМА",
    "ru": "АКТИВНАЯ ПРОГРАММА",
    "fr": "PROGRAMME ACTIF",
    "de": "AKTIVES PROGRAMM",
    "pt": "PROGRAMA ATIVO",
    "bg": "АКТИВНА ПРОГРАМА"
  },
  "WEEKS": {
    "en": "WEEKS",
    "es": "SEMANAS",
    "uk": "ТИЖНІ",
    "ru": "НЕДЕЛИ",
    "fr": "SEMAINES",
    "de": "WOCHEN",
    "pt": "SEMANAS",
    "bg": "СЕДМИЦИ"
  },
  "TRAINING SCHEDULE": {
    "en": "TRAINING SCHEDULE",
    "es": "HORARIO DE ENTRENAMIENTO",
    "uk": "РОЗКЛАД ТРЕНУВАНЬ",
    "ru": "РАСПИСАНИЕ ТРЕНИРОВОК",
    "fr": "PROGRAMME D’ENTRAÎNEMENT",
    "de": "TRAININGSPLAN",
    "pt": "CRONOGRAMA DE TREINO",
    "bg": "ГРАФИК ЗА ТРЕНИРОВКИ"
  },
  "START WORKOUT →": {
    "en": "START WORKOUT →",
    "es": "INICIAR ENTRENAMIENTO →",
    "uk": "ПОЧАТИ ТРЕНУВАННЯ →",
    "ru": "НАЧАТЬ ТРЕНИРОВКУ →",
    "fr": "COMMENCER L’ENTRAÎNEMENT →",
    "de": "TRAINING STARTEN →",
    "pt": "INICIAR TREINO →",
    "bg": "ЗАПОЧНИ ТРЕНИРОВКА →"
  },
  "AS PRESCRIBED": {
    "en": "AS PRESCRIBED",
    "es": "SEGÚN INDICACIÓN",
    "uk": "ЗА ПРИЗНАЧЕННЯМ",
    "ru": "ПО НАЗНАЧЕНИЮ",
    "fr": "SELON PRESCRIPTION",
    "de": "WIE VORGEGEBEN",
    "pt": "CONFORME PRESCRITO",
    "bg": "СПОРЕД УКАЗАНИЕ"
  },
  "IRONAGE COACH": {
    "en": "IRONAGE COACH",
    "es": "ENTRENADOR IRONAGE",
    "uk": "ТРЕНЕР IRONAGE",
    "ru": "ТРЕНЕР IRONAGE",
    "fr": "COACH IRONAGE",
    "de": "IRONAGE COACH",
    "pt": "TREINADOR IRONAGE",
    "bg": "ТРЕНЬОР IRONAGE"
  },
  "IRONAGE PROFESSIONAL": {
    "en": "IRONAGE PROFESSIONAL",
    "es": "PROFESIONAL IRONAGE",
    "uk": "ПРОФЕСІОНАЛ IRONAGE",
    "ru": "ПРОФЕССИОНАЛ IRONAGE",
    "fr": "PROFESSIONNEL IRONAGE",
    "de": "IRONAGE PROFI",
    "pt": "PROFISSIONAL IRONAGE",
    "bg": "IRONAGE ПРОФЕСИОНАЛИСТ"
  },
  "COACH CONTROL CENTER": {
    "en": "COACH CONTROL CENTER",
    "es": "CENTRO DE CONTROL DEL ENTRENADOR",
    "uk": "ЦЕНТР КЕРУВАННЯ ТРЕНЕРА",
    "ru": "ЦЕНТР УПРАВЛЕНИЯ ТРЕНЕРА",
    "fr": "CENTRE DE CONTRÔLE COACH",
    "de": "COACH-KONTROLLZENTRUM",
    "pt": "CENTRAL DE CONTROLE DO TREINADOR",
    "bg": "ЦЕНТЪР ЗА УПРАВЛЕНИЕ НА ТРЕНЬОРА"
  },
  "BUILD ATHLETES. TRACK RESULTS.": {
    "en": "BUILD ATHLETES. TRACK RESULTS.",
    "es": "DESARROLLA ATLETAS. SIGUE RESULTADOS.",
    "uk": "БУДУЙ АТЛЕТІВ. ВІДСТЕЖУЙ РЕЗУЛЬТАТИ.",
    "ru": "РАЗВИВАЙ АТЛЕТОВ. ОТСЛЕЖИВАЙ РЕЗУЛЬТАТЫ.",
    "fr": "FORME DES ATHLÈTES. SUIS LES RÉSULTATS.",
    "de": "BAUE ATHLETEN AUF. VERFOLGE ERGEBNISSE.",
    "pt": "DESENVOLVA ATLETAS. ACOMPANHE RESULTADOS.",
    "bg": "ИЗГРАЖДАЙ АТЛЕТИ. СЛЕДИ РЕЗУЛТАТИТЕ."
  },
  "Manage your athletes, create workouts and build complete training programs.": {
    "en": "Manage your athletes, create workouts and build complete training programs.",
    "es": "Gestiona tus atletas, crea entrenamientos y construye programas completos.",
    "uk": "Керуй атлетами, створюй тренування та повні програми.",
    "ru": "Управляй атлетами, создавай тренировки и полные программы.",
    "fr": "Gère tes athlètes, crée des entraînements et des programmes complets.",
    "de": "Verwalte deine Athleten, erstelle Trainings und komplette Programme.",
    "pt": "Gerencie seus atletas, crie treinos e programas completos.",
    "bg": "Управлявай атлетите си, създавай тренировки и пълни програми."
  },
  "COACH STATUS": {
    "en": "COACH STATUS",
    "es": "ESTADO DEL ENTRENADOR",
    "uk": "СТАТУС ТРЕНЕРА",
    "ru": "СТАТУС ТРЕНЕРА",
    "fr": "STATUT DU COACH",
    "de": "COACH-STATUS",
    "pt": "STATUS DO TREINADOR",
    "bg": "СТАТУС НА ТРЕНЬОРА"
  },
  "ACTIVE": {
    "en": "ACTIVE",
    "es": "ACTIVO",
    "uk": "АКТИВНИЙ",
    "ru": "АКТИВЕН",
    "fr": "ACTIF",
    "de": "AKTIV",
    "pt": "ATIVO",
    "bg": "АКТИВЕН"
  },
  "COACH TOOLS": {
    "en": "COACH TOOLS",
    "es": "HERRAMIENTAS DEL ENTRENADOR",
    "uk": "ІНСТРУМЕНТИ ТРЕНЕРА",
    "ru": "ИНСТРУМЕНТЫ ТРЕНЕРА",
    "fr": "OUTILS DU COACH",
    "de": "COACH-TOOLS",
    "pt": "FERRAMENTAS DO TREINADOR",
    "bg": "ИНСТРУМЕНТИ НА ТРЕНЬОРА"
  },
  "MY CLIENTS": {
    "en": "MY CLIENTS",
    "es": "MIS CLIENTES",
    "uk": "МОЇ КЛІЄНТИ",
    "ru": "МОИ КЛИЕНТЫ",
    "fr": "MES CLIENTS",
    "de": "MEINE KUNDEN",
    "pt": "MEUS CLIENTES",
    "bg": "МОИТЕ КЛИЕНТИ"
  },
  "MY WORKOUTS": {
    "en": "MY WORKOUTS",
    "es": "MIS ENTRENAMIENTOS",
    "uk": "МОЇ ТРЕНУВАННЯ",
    "ru": "МОИ ТРЕНИРОВКИ",
    "fr": "MES ENTRAÎNEMENTS",
    "de": "MEINE TRAININGS",
    "pt": "MEUS TREINOS",
    "bg": "МОИТЕ ТРЕНИРОВКИ"
  },
  "MY PROGRAMS": {
    "en": "MY PROGRAMS",
    "es": "MIS PROGRAMAS",
    "uk": "МОЇ ПРОГРАМИ",
    "ru": "МОИ ПРОГРАММЫ",
    "fr": "MES PROGRAMMES",
    "de": "MEINE PROGRAMME",
    "pt": "MEUS PROGRAMAS",
    "bg": "МОИТЕ ПРОГРАМИ"
  },
  "ACTIVE ATHLETES": {
    "en": "ACTIVE ATHLETES",
    "es": "ATLETAS ACTIVOS",
    "uk": "АКТИВНІ АТЛЕТИ",
    "ru": "АКТИВНЫЕ АТЛЕТЫ",
    "fr": "ATHLÈTES ACTIFS",
    "de": "AKTIVE ATHLETEN",
    "pt": "ATLETAS ATIVOS",
    "bg": "АКТИВНИ АТЛЕТИ"
  },
  "ACTIVE WORKOUTS": {
    "en": "ACTIVE WORKOUTS",
    "es": "ENTRENAMIENTOS ACTIVOS",
    "uk": "АКТИВНІ ТРЕНУВАННЯ",
    "ru": "АКТИВНЫЕ ТРЕНИРОВКИ",
    "fr": "ENTRAÎNEMENTS ACTIFS",
    "de": "AKTIVE TRAININGS",
    "pt": "TREINOS ATIVOS",
    "bg": "АКТИВНИ ТРЕНИРОВКИ"
  },
  "ACTIVE PROGRAMS": {
    "en": "ACTIVE PROGRAMS",
    "es": "PROGRAMAS ACTIVOS",
    "uk": "АКТИВНІ ПРОГРАМИ",
    "ru": "АКТИВНЫЕ ПРОГРАММЫ",
    "fr": "PROGRAMMES ACTIFS",
    "de": "AKTIVE PROGRAMME",
    "pt": "PROGRAMAS ATIVOS",
    "bg": "АКТИВНИ ПРОГРАМИ"
  },
  "ATHLETE ROSTER": {
    "en": "ATHLETE ROSTER",
    "es": "LISTA DE ATLETAS",
    "uk": "СПИСОК АТЛЕТІВ",
    "ru": "СПИСОК АТЛЕТОВ",
    "fr": "LISTE DES ATHLÈTES",
    "de": "ATHLETENLISTE",
    "pt": "LISTA DE ATLETAS",
    "bg": "СПИСЪК С АТЛЕТИ"
  },
  "ATHLETES UNDER YOUR COACHING": {
    "en": "ATHLETES UNDER YOUR COACHING",
    "es": "ATLETAS BAJO TU ENTRENAMIENTO",
    "uk": "АТЛЕТИ ПІД ТВОЇМ КЕРІВНИЦТВОМ",
    "ru": "АТЛЕТЫ ПОД ТВОИМ РУКОВОДСТВОМ",
    "fr": "ATHLÈTES SOUS TON COACHING",
    "de": "ATHLETEN UNTER DEINEM COACHING",
    "pt": "ATLETAS SOB SUA ORIENTAÇÃO",
    "bg": "АТЛЕТИ ПОД ТВОЕ РЪКОВОДСТВО"
  },
  "LOADING ATHLETES...": {
    "en": "LOADING ATHLETES...",
    "es": "CARGANDO ATLETAS...",
    "uk": "ЗАВАНТАЖЕННЯ АТЛЕТІВ...",
    "ru": "ЗАГРУЗКА АТЛЕТОВ...",
    "fr": "CHARGEMENT DES ATHLÈTES...",
    "de": "ATHLETEN WERDEN GELADEN...",
    "pt": "CARREGANDO ATLETAS...",
    "bg": "ЗАРЕЖДАНЕ НА АТЛЕТИ..."
  },
  "LOADING CLIENTS...": {
    "en": "LOADING CLIENTS...",
    "es": "CARGANDO CLIENTES...",
    "uk": "ЗАВАНТАЖЕННЯ КЛІЄНТІВ...",
    "ru": "ЗАГРУЗКА КЛИЕНТОВ...",
    "fr": "CHARGEMENT DES CLIENTS...",
    "de": "KUNDEN WERDEN GELADEN...",
    "pt": "CARREGANDO CLIENTES...",
    "bg": "ЗАРЕЖДАНЕ НА КЛИЕНТИ..."
  },
  "LOADING WORKOUTS...": {
    "en": "LOADING WORKOUTS...",
    "es": "CARGANDO ENTRENAMIENTOS...",
    "uk": "ЗАВАНТАЖЕННЯ ТРЕНУВАНЬ...",
    "ru": "ЗАГРУЗКА ТРЕНИРОВОК...",
    "fr": "CHARGEMENT DES ENTRAÎNEMENTS...",
    "de": "TRAININGS WERDEN GELADEN...",
    "pt": "CARREGANDO TREINOS...",
    "bg": "ЗАРЕЖДАНЕ НА ТРЕНИРОВКИ..."
  },
  "LOADING PROGRAMS...": {
    "en": "LOADING PROGRAMS...",
    "es": "CARGANDO PROGRAMAS...",
    "uk": "ЗАВАНТАЖЕННЯ ПРОГРАМ...",
    "ru": "ЗАГРУЗКА ПРОГРАММ...",
    "fr": "CHARGEMENT DES PROGRAMMES...",
    "de": "PROGRAMME WERDEN GELADEN...",
    "pt": "CARREGANDO PROGRAMAS...",
    "bg": "ЗАРЕЖДАНЕ НА ПРОГРАМИ..."
  },
  "LOADING RESULTS...": {
    "en": "LOADING RESULTS...",
    "es": "CARGANDO RESULTADOS...",
    "uk": "ЗАВАНТАЖЕННЯ РЕЗУЛЬТАТІВ...",
    "ru": "ЗАГРУЗКА РЕЗУЛЬТАТОВ...",
    "fr": "CHARGEMENT DES RÉSULTATS...",
    "de": "ERGEBNISSE WERDEN GELADEN...",
    "pt": "CARREGANDO RESULTADOS...",
    "bg": "ЗАРЕЖДАНЕ НА РЕЗУЛТАТИ..."
  },
  "NO CLIENTS YET": {
    "en": "NO CLIENTS YET",
    "es": "AÚN NO HAY CLIENTES",
    "uk": "КЛІЄНТІВ ЩЕ НЕМАЄ",
    "ru": "КЛИЕНТОВ ЕЩЁ НЕТ",
    "fr": "AUCUN CLIENT",
    "de": "NOCH KEINE KUNDEN",
    "pt": "AINDA NÃO HÁ CLIENTES",
    "bg": "ВСЕ ОЩЕ НЯМА КЛИЕНТИ"
  },
  "NO WORKOUTS YET": {
    "en": "NO WORKOUTS YET",
    "es": "AÚN NO HAY ENTRENAMIENTOS",
    "uk": "ТРЕНУВАНЬ ЩЕ НЕМАЄ",
    "ru": "ТРЕНИРОВОК ЕЩЁ НЕТ",
    "fr": "AUCUN ENTRAÎNEMENT",
    "de": "NOCH KEINE TRAININGS",
    "pt": "AINDA NÃO HÁ TREINOS",
    "bg": "ВСЕ ОЩЕ НЯМА ТРЕНИРОВКИ"
  },
  "NO PROGRAMS YET": {
    "en": "NO PROGRAMS YET",
    "es": "AÚN NO HAY PROGRAMAS",
    "uk": "ПРОГРАМ ЩЕ НЕМАЄ",
    "ru": "ПРОГРАММ ЕЩЁ НЕТ",
    "fr": "AUCUN PROGRAMME",
    "de": "NOCH KEINE PROGRAMME",
    "pt": "AINDA NÃO HÁ PROGRAMAS",
    "bg": "ВСЕ ОЩЕ НЯМА ПРОГРАМИ"
  },
  "NO RESULTS YET": {
    "en": "NO RESULTS YET",
    "es": "AÚN NO HAY RESULTADOS",
    "uk": "РЕЗУЛЬТАТІВ ЩЕ НЕМАЄ",
    "ru": "РЕЗУЛЬТАТОВ ЕЩЁ НЕТ",
    "fr": "AUCUN RÉSULTAT",
    "de": "NOCH KEINE ERGEBNISSE",
    "pt": "AINDA NÃO HÁ RESULTADOS",
    "bg": "ВСЕ ОЩЕ НЯМА РЕЗУЛТАТИ"
  },
  "Assigned athletes will appear here.": {
    "en": "Assigned athletes will appear here.",
    "es": "Los atletas asignados aparecerán aquí.",
    "uk": "Призначені атлети з’являться тут.",
    "ru": "Назначенные атлеты появятся здесь.",
    "fr": "Les athlètes attribués apparaîtront ici.",
    "de": "Zugewiesene Athleten erscheinen hier.",
    "pt": "Atletas atribuídos aparecerão aqui.",
    "bg": "Назначените атлети ще се появят тук."
  },
  "Your coach workouts will appear here.": {
    "en": "Your coach workouts will appear here.",
    "es": "Tus entrenamientos de entrenador aparecerán aquí.",
    "uk": "Твої тренерські тренування з’являться тут.",
    "ru": "Твои тренерские тренировки появятся здесь.",
    "fr": "Tes entraînements coach apparaîtront ici.",
    "de": "Deine Coach-Trainings erscheinen hier.",
    "pt": "Seus treinos de treinador aparecerão aqui.",
    "bg": "Твоите треньорски тренировки ще се появят тук."
  },
  "Your training programs will appear here.": {
    "en": "Your training programs will appear here.",
    "es": "Tus programas de entrenamiento aparecerán aquí.",
    "uk": "Твої програми тренувань з’являться тут.",
    "ru": "Твои программы тренировок появятся здесь.",
    "fr": "Tes programmes d’entraînement apparaîtront ici.",
    "de": "Deine Trainingsprogramme erscheinen hier.",
    "pt": "Seus programas de treino aparecerão aqui.",
    "bg": "Твоите тренировъчни програми ще се появят тук."
  },
  "Completed client workouts will appear here.": {
    "en": "Completed client workouts will appear here.",
    "es": "Los entrenamientos completados de clientes aparecerán aquí.",
    "uk": "Завершені тренування клієнтів з’являться тут.",
    "ru": "Завершённые тренировки клиентов появятся здесь.",
    "fr": "Les entraînements terminés des clients apparaîtront ici.",
    "de": "Abgeschlossene Kundentrainings erscheinen hier.",
    "pt": "Treinos concluídos de clientes aparecerão aqui.",
    "bg": "Завършените тренировки на клиентите ще се появят тук."
  },
  "CONNECTION ERROR": {
    "en": "CONNECTION ERROR",
    "es": "ERROR DE CONEXIÓN",
    "uk": "ПОМИЛКА З’ЄДНАННЯ",
    "ru": "ОШИБКА СОЕДИНЕНИЯ",
    "fr": "ERREUR DE CONNEXION",
    "de": "VERBINDUNGSFEHLER",
    "pt": "ERRO DE CONEXÃO",
    "bg": "ГРЕШКА ПРИ ВРЪЗКАТА"
  },
  "RESULTS ERROR": {
    "en": "RESULTS ERROR",
    "es": "ERROR DE RESULTADOS",
    "uk": "ПОМИЛКА РЕЗУЛЬТАТІВ",
    "ru": "ОШИБКА РЕЗУЛЬТАТОВ",
    "fr": "ERREUR DE RÉSULTATS",
    "de": "ERGEBNISFEHLER",
    "pt": "ERRO DE RESULTADOS",
    "bg": "ГРЕШКА ПРИ РЕЗУЛТАТИТЕ"
  },
  "RETRY": {
    "en": "RETRY",
    "es": "REINTENTAR",
    "uk": "СПРОБУВАТИ ЗНОВУ",
    "ru": "ПОВТОРИТЬ",
    "fr": "RÉESSAYER",
    "de": "ERNEUT VERSUCHEN",
    "pt": "TENTAR NOVAMENTE",
    "bg": "ОПИТАЙ ОТНОВО"
  },
  "VIEW RESULTS": {
    "en": "VIEW RESULTS",
    "es": "VER RESULTADOS",
    "uk": "ПЕРЕГЛЯНУТИ РЕЗУЛЬТАТИ",
    "ru": "ПОСМОТРЕТЬ РЕЗУЛЬТАТЫ",
    "fr": "VOIR LES RÉSULTATS",
    "de": "ERGEBNISSE ANZEIGEN",
    "pt": "VER RESULTADOS",
    "bg": "ВИЖ РЕЗУЛТАТИТЕ"
  },
  "ATHLETE PERFORMANCE": {
    "en": "ATHLETE PERFORMANCE",
    "es": "RENDIMIENTO DEL ATLETA",
    "uk": "РЕЗУЛЬТАТИ АТЛЕТА",
    "ru": "РЕЗУЛЬТАТЫ АТЛЕТА",
    "fr": "PERFORMANCE DE L’ATHLÈTE",
    "de": "ATHLETENLEISTUNG",
    "pt": "DESEMPENHO DO ATLETA",
    "bg": "ПРЕДСТАВЯНЕ НА АТЛЕТА"
  },
  "CURRENT PROGRESS": {
    "en": "CURRENT PROGRESS",
    "es": "PROGRESO ACTUAL",
    "uk": "ПОТОЧНИЙ ПРОГРЕС",
    "ru": "ТЕКУЩИЙ ПРОГРЕСС",
    "fr": "PROGRÈS ACTUEL",
    "de": "AKTUELLER FORTSCHRITT",
    "pt": "PROGRESSO ATUAL",
    "bg": "ТЕКУЩ ПРОГРЕС"
  },
  "WORKOUT HISTORY": {
    "en": "WORKOUT HISTORY",
    "es": "HISTORIAL DE ENTRENAMIENTO",
    "uk": "ІСТОРІЯ ТРЕНУВАНЬ",
    "ru": "ИСТОРИЯ ТРЕНИРОВОК",
    "fr": "HISTORIQUE D’ENTRAÎNEMENT",
    "de": "TRAININGSVERLAUF",
    "pt": "HISTÓRICO DE TREINOS",
    "bg": "ИСТОРИЯ НА ТРЕНИРОВКИТЕ"
  },
  "CLIENT RESULTS": {
    "en": "CLIENT RESULTS",
    "es": "RESULTADOS DEL CLIENTE",
    "uk": "РЕЗУЛЬТАТИ КЛІЄНТА",
    "ru": "РЕЗУЛЬТАТЫ КЛИЕНТА",
    "fr": "RÉSULTATS DU CLIENT",
    "de": "KUNDENERGEBNISSE",
    "pt": "RESULTADOS DO CLIENTE",
    "bg": "РЕЗУЛТАТИ НА КЛИЕНТА"
  },
  "PROGRAM ADHERENCE": {
    "en": "PROGRAM ADHERENCE",
    "es": "ADHERENCIA AL PROGRAMA",
    "uk": "ДОТРИМАННЯ ПРОГРАМИ",
    "ru": "СОБЛЮДЕНИЕ ПРОГРАММЫ",
    "fr": "ADHÉRENCE AU PROGRAMME",
    "de": "PROGRAMMTREUE",
    "pt": "ADESÃO AO PROGRAMA",
    "bg": "СПАЗВАНЕ НА ПРОГРАМАТА"
  },
  "WORKOUTS COMPLETED": {
    "en": "WORKOUTS COMPLETED",
    "es": "ENTRENAMIENTOS COMPLETADOS",
    "uk": "ЗАВЕРШЕНІ ТРЕНУВАННЯ",
    "ru": "ЗАВЕРШЁННЫЕ ТРЕНИРОВКИ",
    "fr": "ENTRAÎNEMENTS TERMINÉS",
    "de": "ABGESCHLOSSENE TRAININGS",
    "pt": "TREINOS CONCLUÍDOS",
    "bg": "ЗАВЪРШЕНИ ТРЕНИРОВКИ"
  },
  "TOTAL WORKOUTS": {
    "en": "TOTAL WORKOUTS",
    "es": "ENTRENAMIENTOS TOTALES",
    "uk": "ВСЬОГО ТРЕНУВАНЬ",
    "ru": "ВСЕГО ТРЕНИРОВОК",
    "fr": "TOTAL ENTRAÎNEMENTS",
    "de": "TRAININGS GESAMT",
    "pt": "TOTAL DE TREINOS",
    "bg": "ОБЩО ТРЕНИРОВКИ"
  },
  "LAST COMPLETED": {
    "en": "LAST COMPLETED",
    "es": "ÚLTIMO COMPLETADO",
    "uk": "ОСТАННЄ ЗАВЕРШЕНЕ",
    "ru": "ПОСЛЕДНЕЕ ЗАВЕРШЁННОЕ",
    "fr": "DERNIER TERMINÉ",
    "de": "ZULETZT ABGESCHLOSSEN",
    "pt": "ÚLTIMO CONCLUÍDO",
    "bg": "ПОСЛЕДНО ЗАВЪРШЕНО"
  },
  "PROGRAM LIBRARY": {
    "en": "PROGRAM LIBRARY",
    "es": "BIBLIOTECA DE PROGRAMAS",
    "uk": "БІБЛІОТЕКА ПРОГРАМ",
    "ru": "БИБЛИОТЕКА ПРОГРАММ",
    "fr": "BIBLIOTHÈQUE DE PROGRAMMES",
    "de": "PROGRAMMBIBLIOTHEK",
    "pt": "BIBLIOTECA DE PROGRAMAS",
    "bg": "БИБЛИОТЕКА С ПРОГРАМИ"
  },
  "TRAINING LIBRARY": {
    "en": "TRAINING LIBRARY",
    "es": "BIBLIOTECA DE ENTRENAMIENTO",
    "uk": "БІБЛІОТЕКА ТРЕНУВАНЬ",
    "ru": "БИБЛИОТЕКА ТРЕНИРОВОК",
    "fr": "BIBLIOTHÈQUE D’ENTRAÎNEMENT",
    "de": "TRAININGSBIBLIOTHEK",
    "pt": "BIBLIOTECA DE TREINOS",
    "bg": "БИБЛИОТЕКА С ТРЕНИРОВКИ"
  },
  "TRAINING SYSTEMS": {
    "en": "TRAINING SYSTEMS",
    "es": "SISTEMAS DE ENTRENAMIENTO",
    "uk": "СИСТЕМИ ТРЕНУВАНЬ",
    "ru": "СИСТЕМЫ ТРЕНИРОВОК",
    "fr": "SYSTÈMES D’ENTRAÎNEMENT",
    "de": "TRAININGSSYSTEME",
    "pt": "SISTEMAS DE TREINO",
    "bg": "ТРЕНИРОВЪЧНИ СИСТЕМИ"
  },
  "PROGRAMMING": {
    "en": "PROGRAMMING",
    "es": "PROGRAMACIÓN",
    "uk": "ПРОГРАМУВАННЯ",
    "ru": "ПРОГРАММИРОВАНИЕ",
    "fr": "PROGRAMMATION",
    "de": "PROGRAMMIERUNG",
    "pt": "PROGRAMAÇÃO",
    "bg": "ПРОГРАМИРАНЕ"
  },
  "PROGRAM.": {
    "en": "PROGRAM.",
    "es": "PROGRAMA.",
    "uk": "ПРОГРАМА.",
    "ru": "ПРОГРАММА.",
    "fr": "PROGRAMME.",
    "de": "PROGRAMM.",
    "pt": "PROGRAMA.",
    "bg": "ПРОГРАМА."
  },
  "LEAD.": {
    "en": "LEAD.",
    "es": "LIDERA.",
    "uk": "ВЕДИ.",
    "ru": "ВЕДИ.",
    "fr": "DIRIGE.",
    "de": "FÜHRE.",
    "pt": "LIDERE.",
    "bg": "ВОДИ."
  },
  "TRANSFORM.": {
    "en": "TRANSFORM.",
    "es": "TRANSFORMA.",
    "uk": "ТРАНСФОРМУЙ.",
    "ru": "ТРАНСФОРМИРУЙ.",
    "fr": "TRANSFORME.",
    "de": "VERÄNDERE.",
    "pt": "TRANSFORME.",
    "bg": "ТРАНСФОРМИРАЙ."
  },
  "TRAINING": {
    "en": "TRAINING",
    "es": "ENTRENAMIENTO",
    "uk": "ТРЕНУВАННЯ",
    "ru": "ТРЕНИРОВКА",
    "fr": "ENTRAÎNEMENT",
    "de": "TRAINING",
    "pt": "TREINO",
    "bg": "ТРЕНИРОВКА"
  },
  "EXERCISES USED": {
    "en": "EXERCISES USED",
    "es": "EJERCICIOS USADOS",
    "uk": "ВИКОРИСТАНІ ВПРАВИ",
    "ru": "ИСПОЛЬЗОВАННЫЕ УПРАЖНЕНИЯ",
    "fr": "EXERCICES UTILISÉS",
    "de": "VERWENDETE ÜBUNGEN",
    "pt": "EXERCÍCIOS USADOS",
    "bg": "ИЗПОЛЗВАНИ УПРАЖНЕНИЯ"
  },
  "WORKOUTS USED": {
    "en": "WORKOUTS USED",
    "es": "ENTRENAMIENTOS USADOS",
    "uk": "ВИКОРИСТАНІ ТРЕНУВАННЯ",
    "ru": "ИСПОЛЬЗОВАННЫЕ ТРЕНИРОВКИ",
    "fr": "ENTRAÎNEMENTS UTILISÉS",
    "de": "VERWENDETE TRAININGS",
    "pt": "TREINOS USADOS",
    "bg": "ИЗПОЛЗВАНИ ТРЕНИРОВКИ"
  },
  "PROGRAM ASSIGNMENT": {
    "en": "PROGRAM ASSIGNMENT",
    "es": "ASIGNACIÓN DE PROGRAMA",
    "uk": "ПРИЗНАЧЕННЯ ПРОГРАМИ",
    "ru": "НАЗНАЧЕНИЕ ПРОГРАММЫ",
    "fr": "ATTRIBUTION DU PROGRAMME",
    "de": "PROGRAMMZUWEISUNG",
    "pt": "ATRIBUIÇÃO DE PROGRAMA",
    "bg": "НАЗНАЧАВАНЕ НА ПРОГРАМА"
  },
  "SELECTED PROGRAM": {
    "en": "SELECTED PROGRAM",
    "es": "PROGRAMA SELECCIONADO",
    "uk": "ОБРАНА ПРОГРАМА",
    "ru": "ВЫБРАННАЯ ПРОГРАММА",
    "fr": "PROGRAMME SÉLECTIONNÉ",
    "de": "AUSGEWÄHLTES PROGRAMM",
    "pt": "PROGRAMA SELECIONADO",
    "bg": "ИЗБРАНА ПРОГРАМА"
  },
  "SELECT ATHLETE": {
    "en": "SELECT ATHLETE",
    "es": "SELECCIONAR ATLETA",
    "uk": "ОБРАТИ АТЛЕТА",
    "ru": "ВЫБРАТЬ АТЛЕТА",
    "fr": "SÉLECTIONNER UN ATHLÈTE",
    "de": "ATHLET AUSWÄHLEN",
    "pt": "SELECIONAR ATLETA",
    "bg": "ИЗБЕРИ АТЛЕТ"
  },
  "ASSIGN PROGRAM": {
    "en": "ASSIGN PROGRAM",
    "es": "ASIGNAR PROGRAMA",
    "uk": "ПРИЗНАЧИТИ ПРОГРАМУ",
    "ru": "НАЗНАЧИТЬ ПРОГРАММУ",
    "fr": "ATTRIBUER LE PROGRAMME",
    "de": "PROGRAMM ZUWEISEN",
    "pt": "ATRIBUIR PROGRAMA",
    "bg": "НАЗНАЧИ ПРОГРАМА"
  },
  "PROGRAM ASSIGNED": {
    "en": "PROGRAM ASSIGNED",
    "es": "PROGRAMA ASIGNADO",
    "uk": "ПРОГРАМУ ПРИЗНАЧЕНО",
    "ru": "ПРОГРАММА НАЗНАЧЕНА",
    "fr": "PROGRAMME ATTRIBUÉ",
    "de": "PROGRAMM ZUGEWIESEN",
    "pt": "PROGRAMA ATRIBUÍDO",
    "bg": "ПРОГРАМАТА Е НАЗНАЧЕНА"
  },
  "Invite a client before assigning a program.": {
    "en": "Invite a client before assigning a program.",
    "es": "Invita a un cliente antes de asignar un programa.",
    "uk": "Запроси клієнта перед призначенням програми.",
    "ru": "Пригласи клиента перед назначением программы.",
    "fr": "Invite un client avant d’attribuer un programme.",
    "de": "Lade einen Kunden ein, bevor du ein Programm zuweist.",
    "pt": "Convide um cliente antes de atribuir um programa.",
    "bg": "Покани клиент, преди да назначиш програма."
  },
  "Build workouts from the IRONAGE exercise library.": {
    "en": "Build workouts from the IRONAGE exercise library.",
    "es": "Crea entrenamientos desde la biblioteca de ejercicios IRONAGE.",
    "uk": "Створюй тренування з бібліотеки вправ IRONAGE.",
    "ru": "Создавай тренировки из библиотеки упражнений IRONAGE.",
    "fr": "Crée des entraînements depuis la bibliothèque IRONAGE.",
    "de": "Erstelle Trainings aus der IRONAGE-Übungsbibliothek.",
    "pt": "Crie treinos a partir da biblioteca de exercícios IRONAGE.",
    "bg": "Създавай тренировки от библиотеката с упражнения на IRONAGE."
  },
  "Create programs and assign them to your clients.": {
    "en": "Create programs and assign them to your clients.",
    "es": "Crea programas y asígnalos a tus clientes.",
    "uk": "Створюй програми та призначай їх клієнтам.",
    "ru": "Создавай программы и назначай их клиентам.",
    "fr": "Crée des programmes et attribue-les à tes clients.",
    "de": "Erstelle Programme und weise sie deinen Kunden zu.",
    "pt": "Crie programas e atribua-os aos seus clientes.",
    "bg": "Създавай програми и ги назначавай на клиентите си."
  },
  "+ CREATE WORKOUT": {
    "en": "+ CREATE WORKOUT",
    "es": "+ CREAR ENTRENAMIENTO",
    "uk": "+ СТВОРИТИ ТРЕНУВАННЯ",
    "ru": "+ СОЗДАТЬ ТРЕНИРОВКУ",
    "fr": "+ CRÉER UN ENTRAÎNEMENT",
    "de": "+ TRAINING ERSTELLEN",
    "pt": "+ CRIAR TREINO",
    "bg": "+ СЪЗДАЙ ТРЕНИРОВКА"
  },
  "+ CREATE PROGRAM": {
    "en": "+ CREATE PROGRAM",
    "es": "+ CREAR PROGRAMA",
    "uk": "+ СТВОРИТИ ПРОГРАМУ",
    "ru": "+ СОЗДАТЬ ПРОГРАММУ",
    "fr": "+ CRÉER UN PROGRAMME",
    "de": "+ PROGRAMM ERSTELLEN",
    "pt": "+ CRIAR PROGRAMA",
    "bg": "+ СЪЗДАЙ ПРОГРАМА"
  },
  "BACK TO PROGRAMS": {
    "en": "BACK TO PROGRAMS",
    "es": "VOLVER A PROGRAMAS",
    "uk": "НАЗАД ДО ПРОГРАМ",
    "ru": "НАЗАД К ПРОГРАММАМ",
    "fr": "RETOUR AUX PROGRAMMES",
    "de": "ZURÜCK ZU PROGRAMMEN",
    "pt": "VOLTAR AOS PROGRAMAS",
    "bg": "НАЗАД КЪМ ПРОГРАМИТЕ"
  },
  "CUSTOM DURATION": {
    "en": "CUSTOM DURATION",
    "es": "DURACIÓN PERSONALIZADA",
    "uk": "ВЛАСНА ТРИВАЛІСТЬ",
    "ru": "СВОЯ ДЛИТЕЛЬНОСТЬ",
    "fr": "DURÉE PERSONNALISÉE",
    "de": "BENUTZERDEFINIERTE DAUER",
    "pt": "DURAÇÃO PERSONALIZADA",
    "bg": "ПЕРСОНАЛИЗИРАНА ПРОДЪЛЖИТЕЛНОСТ"
  },
  "STANDARD": {
    "en": "STANDARD",
    "es": "ESTÁNDAR",
    "uk": "СТАНДАРТ",
    "ru": "СТАНДАРТ",
    "fr": "STANDARD",
    "de": "STANDARD",
    "pt": "PADRÃO",
    "bg": "СТАНДАРТ"
  },
  "NO GOAL": {
    "en": "NO GOAL",
    "es": "SIN OBJETIVO",
    "uk": "БЕЗ ЦІЛІ",
    "ru": "БЕЗ ЦЕЛИ",
    "fr": "AUCUN OBJECTIF",
    "de": "KEIN ZIEL",
    "pt": "SEM OBJETIVO",
    "bg": "БЕЗ ЦЕЛ"
  },
  "CREATE PROGRAM": {
    "en": "CREATE PROGRAM",
    "es": "CREAR PROGRAMA",
    "uk": "СТВОРИТИ ПРОГРАМУ",
    "ru": "СОЗДАТЬ ПРОГРАММУ",
    "fr": "CRÉER UN PROGRAMME",
    "de": "PROGRAMM ERSTELLEN",
    "pt": "CRIAR PROGRAMA",
    "bg": "СЪЗДАЙ ПРОГРАМА"
  },
  "BUILD THE SYSTEM": {
    "en": "BUILD THE SYSTEM",
    "es": "CONSTRUYE EL SISTEMA",
    "uk": "БУДУЙ СИСТЕМУ",
    "ru": "СТРОЙ СИСТЕМУ",
    "fr": "CONSTRUIS LE SYSTÈME",
    "de": "BAUE DAS SYSTEM",
    "pt": "CONSTRUA O SISTEMA",
    "bg": "ИЗГРАДИ СИСТЕМАТА"
  },
  "DEFINE THE GOAL": {
    "en": "DEFINE THE GOAL",
    "es": "DEFINE EL OBJETIVO",
    "uk": "ВИЗНАЧ ЦІЛЬ",
    "ru": "ОПРЕДЕЛИ ЦЕЛЬ",
    "fr": "DÉFINIS L’OBJECTIF",
    "de": "DEFINIERE DAS ZIEL",
    "pt": "DEFINA O OBJETIVO",
    "bg": "ОПРЕДЕЛИ ЦЕЛТА"
  },
  "PROGRAM DETAILS": {
    "en": "PROGRAM DETAILS",
    "es": "DETALLES DEL PROGRAMA",
    "uk": "ДЕТАЛІ ПРОГРАМИ",
    "ru": "ДЕТАЛИ ПРОГРАММЫ",
    "fr": "DÉTAILS DU PROGRAMME",
    "de": "PROGRAMMDETAILS",
    "pt": "DETALHES DO PROGRAMA",
    "bg": "ДЕТАЙЛИ НА ПРОГРАМАТА"
  },
  "PROGRAM NAME": {
    "en": "PROGRAM NAME",
    "es": "NOMBRE DEL PROGRAMA",
    "uk": "НАЗВА ПРОГРАМИ",
    "ru": "НАЗВАНИЕ ПРОГРАММЫ",
    "fr": "NOM DU PROGRAMME",
    "de": "PROGRAMMNAME",
    "pt": "NOME DO PROGRAMA",
    "bg": "ИМЕ НА ПРОГРАМАТА"
  },
  "DESCRIPTION": {
    "en": "DESCRIPTION",
    "es": "DESCRIPCIÓN",
    "uk": "ОПИС",
    "ru": "ОПИСАНИЕ",
    "fr": "DESCRIPTION",
    "de": "BESCHREIBUNG",
    "pt": "DESCRIÇÃO",
    "bg": "ОПИСАНИЕ"
  },
  "DURATION": {
    "en": "DURATION",
    "es": "DURACIÓN",
    "uk": "ТРИВАЛІСТЬ",
    "ru": "ДЛИТЕЛЬНОСТЬ",
    "fr": "DURÉE",
    "de": "DAUER",
    "pt": "DURAÇÃO",
    "bg": "ПРОДЪЛЖИТЕЛНОСТ"
  },
  "4 WEEKS": {
    "en": "4 WEEKS",
    "es": "4 SEMANAS",
    "uk": "4 ТИЖНІ",
    "ru": "4 НЕДЕЛИ",
    "fr": "4 SEMAINES",
    "de": "4 WOCHEN",
    "pt": "4 SEMANAS",
    "bg": "4 СЕДМИЦИ"
  },
  "8 WEEKS": {
    "en": "8 WEEKS",
    "es": "8 SEMANAS",
    "uk": "8 ТИЖНІВ",
    "ru": "8 НЕДЕЛЬ",
    "fr": "8 SEMAINES",
    "de": "8 WOCHEN",
    "pt": "8 SEMANAS",
    "bg": "8 СЕДМИЦИ"
  },
  "12 WEEKS": {
    "en": "12 WEEKS",
    "es": "12 SEMANAS",
    "uk": "12 ТИЖНІВ",
    "ru": "12 НЕДЕЛЬ",
    "fr": "12 SEMAINES",
    "de": "12 WOCHEN",
    "pt": "12 SEMANAS",
    "bg": "12 СЕДМИЦИ"
  },
  "ADD TRAINING SESSIONS": {
    "en": "ADD TRAINING SESSIONS",
    "es": "AÑADE SESIONES DE ENTRENAMIENTO",
    "uk": "ДОДАЙ ТРЕНУВАЛЬНІ СЕСІЇ",
    "ru": "ДОБАВЬ ТРЕНИРОВОЧНЫЕ СЕССИИ",
    "fr": "AJOUTE DES SÉANCES",
    "de": "TRAININGSEINHEITEN HINZUFÜGEN",
    "pt": "ADICIONE SESSÕES DE TREINO",
    "bg": "ДОБАВИ ТРЕНИРОВЪЧНИ СЕСИИ"
  },
  "NO WORKOUTS AVAILABLE": {
    "en": "NO WORKOUTS AVAILABLE",
    "es": "NO HAY ENTRENAMIENTOS DISPONIBLES",
    "uk": "НЕМАЄ ДОСТУПНИХ ТРЕНУВАНЬ",
    "ru": "НЕТ ДОСТУПНЫХ ТРЕНИРОВОК",
    "fr": "AUCUN ENTRAÎNEMENT DISPONIBLE",
    "de": "KEINE TRAININGS VERFÜGBAR",
    "pt": "NENHUM TREINO DISPONÍVEL",
    "bg": "НЯМА НАЛИЧНИ ТРЕНИРОВКИ"
  },
  "PROGRAM SCHEDULE": {
    "en": "PROGRAM SCHEDULE",
    "es": "HORARIO DEL PROGRAMA",
    "uk": "РОЗКЛАД ПРОГРАМИ",
    "ru": "РАСПИСАНИЕ ПРОГРАММЫ",
    "fr": "PLANNING DU PROGRAMME",
    "de": "PROGRAMMPLAN",
    "pt": "CRONOGRAMA DO PROGRAMA",
    "bg": "ГРАФИК НА ПРОГРАМАТА"
  },
  "SET WEEK AND DAY": {
    "en": "SET WEEK AND DAY",
    "es": "DEFINE SEMANA Y DÍA",
    "uk": "ВСТАНОВИ ТИЖДЕНЬ І ДЕНЬ",
    "ru": "УКАЖИ НЕДЕЛЮ И ДЕНЬ",
    "fr": "DÉFINIS SEMAINE ET JOUR",
    "de": "WOCHE UND TAG FESTLEGEN",
    "pt": "DEFINA SEMANA E DIA",
    "bg": "ЗАДАЙ СЕДМИЦА И ДЕН"
  },
  "WEEK": {
    "en": "WEEK",
    "es": "SEMANA",
    "uk": "ТИЖДЕНЬ",
    "ru": "НЕДЕЛЯ",
    "fr": "SEMAINE",
    "de": "WOCHE",
    "pt": "SEMANA",
    "bg": "СЕДМИЦА"
  },
  "DAY": {
    "en": "DAY",
    "es": "DÍA",
    "uk": "ДЕНЬ",
    "ru": "ДЕНЬ",
    "fr": "JOUR",
    "de": "TAG",
    "pt": "DIA",
    "bg": "ДЕН"
  },
  "IRONAGE STRENGTH": {
    "en": "IRONAGE STRENGTH",
    "es": "FUERZA IRONAGE",
    "uk": "СИЛА IRONAGE",
    "ru": "СИЛА IRONAGE",
    "fr": "FORCE IRONAGE",
    "de": "IRONAGE KRAFT",
    "pt": "FORÇA IRONAGE",
    "bg": "СИЛА IRONAGE"
  },
  "Strength and muscle development...": {
    "en": "Strength and muscle development...",
    "es": "Desarrollo de fuerza y músculo...",
    "uk": "Розвиток сили та м’язів...",
    "ru": "Развитие силы и мышц...",
    "fr": "Développement de la force et des muscles...",
    "de": "Kraft- und Muskelaufbau...",
    "pt": "Desenvolvimento de força e músculos...",
    "bg": "Развитие на сила и мускули..."
  },
  "Program name is required.": {
    "en": "Program name is required.",
    "es": "El nombre del programa es obligatorio.",
    "uk": "Назва програми обов’язкова.",
    "ru": "Название программы обязательно.",
    "fr": "Le nom du programme est requis.",
    "de": "Programmname ist erforderlich.",
    "pt": "O nome do programa é obrigatório.",
    "bg": "Името на програмата е задължително."
  },
  "Add at least one workout.": {
    "en": "Add at least one workout.",
    "es": "Añade al menos un entrenamiento.",
    "uk": "Додай хоча б одне тренування.",
    "ru": "Добавь хотя бы одну тренировку.",
    "fr": "Ajoute au moins un entraînement.",
    "de": "Füge mindestens ein Training hinzu.",
    "pt": "Adicione pelo menos um treino.",
    "bg": "Добави поне една тренировка."
  },
  "Program duration must be at least 1 week.": {
    "en": "Program duration must be at least 1 week.",
    "es": "La duración debe ser de al menos 1 semana.",
    "uk": "Тривалість програми має бути щонайменше 1 тиждень.",
    "ru": "Длительность программы должна быть не менее 1 недели.",
    "fr": "La durée doit être d’au moins 1 semaine.",
    "de": "Die Programmdauer muss mindestens 1 Woche betragen.",
    "pt": "A duração deve ser de pelo menos 1 semana.",
    "bg": "Продължителността трябва да е поне 1 седмица."
  },
  "SAVE PROGRAM": {
    "en": "SAVE PROGRAM",
    "es": "GUARDAR PROGRAMA",
    "uk": "ЗБЕРЕГТИ ПРОГРАМУ",
    "ru": "СОХРАНИТЬ ПРОГРАММУ",
    "fr": "ENREGISTRER LE PROGRAMME",
    "de": "PROGRAMM SPEICHERN",
    "pt": "SALVAR PROGRAMA",
    "bg": "ЗАПАЗИ ПРОГРАМАТА"
  },
  "CREATE WORKOUT": {
    "en": "CREATE WORKOUT",
    "es": "CREAR ENTRENAMIENTO",
    "uk": "СТВОРИТИ ТРЕНУВАННЯ",
    "ru": "СОЗДАТЬ ТРЕНИРОВКУ",
    "fr": "CRÉER UN ENTRAÎNEMENT",
    "de": "TRAINING ERSTELLEN",
    "pt": "CRIAR TREINO",
    "bg": "СЪЗДАЙ ТРЕНИРОВКА"
  },
  "BUILD THE SESSION": {
    "en": "BUILD THE SESSION",
    "es": "CONSTRUYE LA SESIÓN",
    "uk": "ПОБУДУЙ СЕСІЮ",
    "ru": "ПОСТРОЙ СЕССИЮ",
    "fr": "CONSTRUIS LA SÉANCE",
    "de": "BAUE DIE EINHEIT",
    "pt": "CONSTRUA A SESSÃO",
    "bg": "ИЗГРАДИ СЕСИЯТА"
  },
  "DEFINE THE SESSION": {
    "en": "DEFINE THE SESSION",
    "es": "DEFINE LA SESIÓN",
    "uk": "ВИЗНАЧ СЕСІЮ",
    "ru": "ОПРЕДЕЛИ СЕССИЮ",
    "fr": "DÉFINIS LA SÉANCE",
    "de": "DEFINIERE DIE EINHEIT",
    "pt": "DEFINA A SESSÃO",
    "bg": "ОПРЕДЕЛИ СЕСИЯТА"
  },
  "WORKOUT DETAILS": {
    "en": "WORKOUT DETAILS",
    "es": "DETALLES DEL ENTRENAMIENTO",
    "uk": "ДЕТАЛІ ТРЕНУВАННЯ",
    "ru": "ДЕТАЛИ ТРЕНИРОВКИ",
    "fr": "DÉTAILS DE L’ENTRAÎNEMENT",
    "de": "TRAININGSDETAILS",
    "pt": "DETALHES DO TREINO",
    "bg": "ДЕТАЙЛИ НА ТРЕНИРОВКАТА"
  },
  "WORKOUT NAME": {
    "en": "WORKOUT NAME",
    "es": "NOMBRE DEL ENTRENAMIENTO",
    "uk": "НАЗВА ТРЕНУВАННЯ",
    "ru": "НАЗВАНИЕ ТРЕНИРОВКИ",
    "fr": "NOM DE L’ENTRAÎNEMENT",
    "de": "TRAININGSNAME",
    "pt": "NOME DO TREINO",
    "bg": "ИМЕ НА ТРЕНИРОВКАТА"
  },
  "DURATION / MIN": {
    "en": "DURATION / MIN",
    "es": "DURACIÓN / MIN",
    "uk": "ТРИВАЛІСТЬ / ХВ",
    "ru": "ДЛИТЕЛЬНОСТЬ / МИН",
    "fr": "DURÉE / MIN",
    "de": "DAUER / MIN",
    "pt": "DURAÇÃO / MIN",
    "bg": "ПРОДЪЛЖИТЕЛНОСТ / МИН"
  },
  "DIFFICULTY": {
    "en": "DIFFICULTY",
    "es": "DIFICULTAD",
    "uk": "СКЛАДНІСТЬ",
    "ru": "СЛОЖНОСТЬ",
    "fr": "DIFFICULTÉ",
    "de": "SCHWIERIGKEIT",
    "pt": "DIFICULDADE",
    "bg": "ТРУДНОСТ"
  },
  "BEGINNER": {
    "en": "BEGINNER",
    "es": "PRINCIPIANTE",
    "uk": "ПОЧАТКІВЕЦЬ",
    "ru": "НОВИЧОК",
    "fr": "DÉBUTANT",
    "de": "ANFÄNGER",
    "pt": "INICIANTE",
    "bg": "НАЧИНАЕЩ"
  },
  "INTERMEDIATE": {
    "en": "INTERMEDIATE",
    "es": "INTERMEDIO",
    "uk": "СЕРЕДНІЙ",
    "ru": "СРЕДНИЙ",
    "fr": "INTERMÉDIAIRE",
    "de": "MITTEL",
    "pt": "INTERMEDIÁRIO",
    "bg": "СРЕДНО НИВО"
  },
  "ADVANCED": {
    "en": "ADVANCED",
    "es": "AVANZADO",
    "uk": "ПРОСУНУТИЙ",
    "ru": "ПРОДВИНУТЫЙ",
    "fr": "AVANCÉ",
    "de": "FORTGESCHRITTEN",
    "pt": "AVANÇADO",
    "bg": "НАПРЕДНАЛ"
  },
  "EXERCISE LIBRARY": {
    "en": "EXERCISE LIBRARY",
    "es": "BIBLIOTECA DE EJERCICIOS",
    "uk": "БІБЛІОТЕКА ВПРАВ",
    "ru": "БИБЛИОТЕКА УПРАЖНЕНИЙ",
    "fr": "BIBLIOTHÈQUE D’EXERCICES",
    "de": "ÜBUNGSBIBLIOTHEK",
    "pt": "BIBLIOTECA DE EXERCÍCIOS",
    "bg": "БИБЛИОТЕКА С УПРАЖНЕНИЯ"
  },
  "SELECT MOVEMENTS": {
    "en": "SELECT MOVEMENTS",
    "es": "SELECCIONA MOVIMIENTOS",
    "uk": "ОБЕРИ ВПРАВИ",
    "ru": "ВЫБЕРИ УПРАЖНЕНИЯ",
    "fr": "SÉLECTIONNE LES MOUVEMENTS",
    "de": "ÜBUNGEN AUSWÄHLEN",
    "pt": "SELECIONE MOVIMENTOS",
    "bg": "ИЗБЕРИ ДВИЖЕНИЯ"
  },
  "LOADING EXERCISES...": {
    "en": "LOADING EXERCISES...",
    "es": "CARGANDO EJERCICIOS...",
    "uk": "ЗАВАНТАЖЕННЯ ВПРАВ...",
    "ru": "ЗАГРУЗКА УПРАЖНЕНИЙ...",
    "fr": "CHARGEMENT DES EXERCICES...",
    "de": "ÜBUNGEN WERDEN GELADEN...",
    "pt": "CARREGANDO EXERCÍCIOS...",
    "bg": "ЗАРЕЖДАНЕ НА УПРАЖНЕНИЯ..."
  },
  "SET TRAINING TARGETS": {
    "en": "SET TRAINING TARGETS",
    "es": "DEFINE OBJETIVOS DE ENTRENAMIENTO",
    "uk": "ВСТАНОВИ ЦІЛІ ТРЕНУВАННЯ",
    "ru": "УСТАНОВИ ЦЕЛИ ТРЕНИРОВКИ",
    "fr": "DÉFINIS LES OBJECTIFS",
    "de": "TRAININGSZIELE FESTLEGEN",
    "pt": "DEFINA METAS DE TREINO",
    "bg": "ЗАДАЙ ТРЕНИРОВЪЧНИ ЦЕЛИ"
  },
  "SETS": {
    "en": "SETS",
    "es": "SERIES",
    "uk": "ПІДХОДИ",
    "ru": "ПОДХОДЫ",
    "fr": "SÉRIES",
    "de": "SÄTZE",
    "pt": "SÉRIES",
    "bg": "СЕРИИ"
  },
  "REST / SEC": {
    "en": "REST / SEC",
    "es": "DESCANSO / SEG",
    "uk": "ВІДПОЧИНОК / СЕК",
    "ru": "ОТДЫХ / СЕК",
    "fr": "REPOS / SEC",
    "de": "PAUSE / SEK",
    "pt": "DESCANSO / SEG",
    "bg": "ПОЧИВКА / СЕК"
  },
  "TARGET WEIGHT / KG": {
    "en": "TARGET WEIGHT / KG",
    "es": "PESO OBJETIVO / KG",
    "uk": "ЦІЛЬОВА ВАГА / КГ",
    "ru": "ЦЕЛЕВОЙ ВЕС / КГ",
    "fr": "POIDS CIBLE / KG",
    "de": "ZIELGEWICHT / KG",
    "pt": "PESO-ALVO / KG",
    "bg": "ЦЕЛЕВО ТЕГЛО / КГ"
  },
  "COACH NOTES": {
    "en": "COACH NOTES",
    "es": "NOTAS DEL ENTRENADOR",
    "uk": "НОТАТКИ ТРЕНЕРА",
    "ru": "ЗАМЕТКИ ТРЕНЕРА",
    "fr": "NOTES DU COACH",
    "de": "COACH-NOTIZEN",
    "pt": "NOTAS DO TREINADOR",
    "bg": "БЕЛЕЖКИ НА ТРЕНЬОРА"
  },
  "OPTIONAL": {
    "en": "OPTIONAL",
    "es": "OPCIONAL",
    "uk": "НЕОБОВ'ЯЗКОВО",
    "ru": "НЕОБЯЗАТЕЛЬНО",
    "fr": "OPTIONNEL",
    "de": "OPTIONAL",
    "pt": "OPCIONAL",
    "bg": "ПО ЖЕЛАНИЕ"
  },
  "NO EQUIPMENT": {
    "en": "NO EQUIPMENT",
    "es": "SIN EQUIPO",
    "uk": "БЕЗ ОБЛАДНАННЯ",
    "ru": "БЕЗ ОБОРУДОВАНИЯ",
    "fr": "SANS ÉQUIPEMENT",
    "de": "OHNE GERÄT",
    "pt": "SEM EQUIPAMENTO",
    "bg": "БЕЗ ОБОРУДВАНЕ"
  },
  "WORKOUT PLAN": {
    "en": "WORKOUT PLAN",
    "es": "PLAN DE ENTRENAMIENTO",
    "uk": "ПЛАН ТРЕНУВАННЯ",
    "ru": "ПЛАН ТРЕНИРОВКИ",
    "fr": "PLAN D’ENTRAÎNEMENT",
    "de": "TRAININGSPLAN",
    "pt": "PLANO DE TREINO",
    "bg": "ПЛАН ЗА ТРЕНИРОВКА"
  },
  "PUSH DAY": {
    "en": "PUSH DAY",
    "es": "DÍA DE EMPUJE",
    "uk": "ДЕНЬ ЖИМІВ",
    "ru": "ДЕНЬ ЖИМОВ",
    "fr": "JOUR POUSSÉE",
    "de": "PUSH-TAG",
    "pt": "DIA DE EMPURRAR",
    "bg": "ДЕН ЗА ИЗБУТВАНЕ"
  },
  "Chest, shoulders and triceps...": {
    "en": "Chest, shoulders and triceps...",
    "es": "Pecho, hombros y tríceps...",
    "uk": "Груди, плечі та трицепс...",
    "ru": "Грудь, плечи и трицепс...",
    "fr": "Pectoraux, épaules et triceps...",
    "de": "Brust, Schultern und Trizeps...",
    "pt": "Peito, ombros e tríceps...",
    "bg": "Гърди, рамене и трицепс..."
  },
  "Technique, tempo, intensity...": {
    "en": "Technique, tempo, intensity...",
    "es": "Técnica, tempo, intensidad...",
    "uk": "Техніка, темп, інтенсивність...",
    "ru": "Техника, темп, интенсивность...",
    "fr": "Technique, tempo, intensité...",
    "de": "Technik, Tempo, Intensität...",
    "pt": "Técnica, ritmo, intensidade...",
    "bg": "Техника, темпо, интензивност..."
  },
  "Workout name is required.": {
    "en": "Workout name is required.",
    "es": "El nombre del entrenamiento es obligatorio.",
    "uk": "Назва тренування обов’язкова.",
    "ru": "Название тренировки обязательно.",
    "fr": "Le nom de l’entraînement est requis.",
    "de": "Trainingsname ist erforderlich.",
    "pt": "O nome do treino é obrigatório.",
    "bg": "Името на тренировката е задължително."
  },
  "Add at least one exercise.": {
    "en": "Add at least one exercise.",
    "es": "Añade al menos un ejercicio.",
    "uk": "Додай хоча б одну вправу.",
    "ru": "Добавь хотя бы одно упражнение.",
    "fr": "Ajoute au moins un exercice.",
    "de": "Füge mindestens eine Übung hinzu.",
    "pt": "Adicione pelo menos um exercício.",
    "bg": "Добави поне едно упражнение."
  },
  "SAVE WORKOUT": {
    "en": "SAVE WORKOUT",
    "es": "GUARDAR ENTRENAMIENTO",
    "uk": "ЗБЕРЕГТИ ТРЕНУВАННЯ",
    "ru": "СОХРАНИТЬ ТРЕНИРОВКУ",
    "fr": "ENREGISTRER L’ENTRAÎNEMENT",
    "de": "TRAINING SPEICHERN",
    "pt": "SALVAR TREINO",
    "bg": "ЗАПАЗИ ТРЕНИРОВКАТА"
  },
  "Last updated:": {
    "en": "Last updated:",
    "es": "Última actualización:",
    "uk": "Останнє оновлення:",
    "ru": "Последнее обновление:",
    "fr": "Dernière mise à jour :",
    "de": "Zuletzt aktualisiert:",
    "pt": "Última atualização:",
    "bg": "Последна актуализация:"
  },
  "Terms of Service": {
    "en": "Terms of Service",
    "es": "Términos de Servicio",
    "uk": "Умови користування",
    "ru": "Условия использования",
    "fr": "Conditions d’utilisation",
    "de": "Nutzungsbedingungen",
    "pt": "Termos de Serviço",
    "bg": "Условия за ползване"
  },
  "Privacy Policy": {
    "en": "Privacy Policy",
    "es": "Política de Privacidad",
    "uk": "Політика конфіденційності",
    "ru": "Политика конфиденциальности",
    "fr": "Politique de confidentialité",
    "de": "Datenschutzerklärung",
    "pt": "Política de Privacidade",
    "bg": "Политика за поверителност"
  },
  "1. Acceptance of Terms": {
    "en": "1. Acceptance of Terms",
    "es": "1. Aceptación de los Términos",
    "uk": "1. Прийняття умов",
    "ru": "1. Принятие условий",
    "fr": "1. Acceptation des conditions",
    "de": "1. Annahme der Bedingungen",
    "pt": "1. Aceitação dos Termos",
    "bg": "1. Приемане на условията"
  },
  "2. IRONAGE Services": {
    "en": "2. IRONAGE Services",
    "es": "2. Servicios de IRONAGE",
    "uk": "2. Сервіси IRONAGE",
    "ru": "2. Сервисы IRONAGE",
    "fr": "2. Services IRONAGE",
    "de": "2. IRONAGE-Dienste",
    "pt": "2. Serviços IRONAGE",
    "bg": "2. Услуги на IRONAGE"
  },
  "3. Fitness and Health Disclaimer": {
    "en": "3. Fitness and Health Disclaimer",
    "es": "3. Descargo de responsabilidad sobre fitness y salud",
    "uk": "3. Застереження щодо фітнесу та здоров’я",
    "ru": "3. Отказ от ответственности по фитнесу и здоровью",
    "fr": "3. Avertissement fitness et santé",
    "de": "3. Fitness- und Gesundheitshinweis",
    "pt": "3. Aviso sobre fitness e saúde",
    "bg": "3. Отказ от отговорност за фитнес и здраве"
  },
  "4. Accounts": {
    "en": "4. Accounts",
    "es": "4. Cuentas",
    "uk": "4. Акаунти",
    "ru": "4. Аккаунты",
    "fr": "4. Comptes",
    "de": "4. Konten",
    "pt": "4. Contas",
    "bg": "4. Акаунти"
  },
  "5. Coaches and Training Programs": {
    "en": "5. Coaches and Training Programs",
    "es": "5. Entrenadores y programas de entrenamiento",
    "uk": "5. Тренери та програми тренувань",
    "ru": "5. Тренеры и программы тренировок",
    "fr": "5. Coachs et programmes d’entraînement",
    "de": "5. Coaches und Trainingsprogramme",
    "pt": "5. Treinadores e programas de treino",
    "bg": "5. Треньори и тренировъчни програми"
  },
  "6. Premium Services": {
    "en": "6. Premium Services",
    "es": "6. Servicios Premium",
    "uk": "6. Premium-сервіси",
    "ru": "6. Premium-сервисы",
    "fr": "6. Services Premium",
    "de": "6. Premium-Dienste",
    "pt": "6. Serviços Premium",
    "bg": "6. Premium услуги"
  },
  "7. Acceptable Use": {
    "en": "7. Acceptable Use",
    "es": "7. Uso aceptable",
    "uk": "7. Допустиме використання",
    "ru": "7. Допустимое использование",
    "fr": "7. Utilisation acceptable",
    "de": "7. Zulässige Nutzung",
    "pt": "7. Uso aceitável",
    "bg": "7. Допустима употреба"
  },
  "8. Intellectual Property": {
    "en": "8. Intellectual Property",
    "es": "8. Propiedad intelectual",
    "uk": "8. Інтелектуальна власність",
    "ru": "8. Интеллектуальная собственность",
    "fr": "8. Propriété intellectuelle",
    "de": "8. Geistiges Eigentum",
    "pt": "8. Propriedade intelectual",
    "bg": "8. Интелектуална собственост"
  },
  "9. Availability": {
    "en": "9. Availability",
    "es": "9. Disponibilidad",
    "uk": "9. Доступність",
    "ru": "9. Доступность",
    "fr": "9. Disponibilité",
    "de": "9. Verfügbarkeit",
    "pt": "9. Disponibilidade",
    "bg": "9. Наличност"
  },
  "10. Limitation of Liability": {
    "en": "10. Limitation of Liability",
    "es": "10. Limitación de responsabilidad",
    "uk": "10. Обмеження відповідальності",
    "ru": "10. Ограничение ответственности",
    "fr": "10. Limitation de responsabilité",
    "de": "10. Haftungsbeschränkung",
    "pt": "10. Limitação de responsabilidade",
    "bg": "10. Ограничаване на отговорността"
  },
  "11. Changes to These Terms": {
    "en": "11. Changes to These Terms",
    "es": "11. Cambios en estos Términos",
    "uk": "11. Зміни до цих умов",
    "ru": "11. Изменения этих условий",
    "fr": "11. Modifications de ces conditions",
    "de": "11. Änderungen dieser Bedingungen",
    "pt": "11. Alterações destes Termos",
    "bg": "11. Промени в тези условия"
  },
  "12. Contact": {
    "en": "12. Contact",
    "es": "12. Contacto",
    "uk": "12. Контакти",
    "ru": "12. Контакты",
    "fr": "12. Contact",
    "de": "12. Kontakt",
    "pt": "12. Contato",
    "bg": "12. Контакт"
  },
  "By creating an account, accessing, or using IRONAGE, you agree to these Terms of Service and our Privacy Policy.": {
    "en": "By creating an account, accessing, or using IRONAGE, you agree to these Terms of Service and our Privacy Policy.",
    "es": "Al crear una cuenta, acceder o usar IRONAGE, aceptas estos Términos de Servicio y nuestra Política de Privacidad.",
    "uk": "Створюючи акаунт, отримуючи доступ або використовуючи IRONAGE, ти погоджуєшся з цими Умовами користування та Політикою конфіденційності.",
    "ru": "Создавая аккаунт, получая доступ или используя IRONAGE, ты соглашаешься с настоящими Условиями использования и Политикой конфиденциальности.",
    "fr": "En créant un compte, en accédant à IRONAGE ou en l’utilisant, tu acceptes ces Conditions d’utilisation et notre Politique de confidentialité.",
    "de": "Durch das Erstellen eines Kontos, den Zugriff auf oder die Nutzung von IRONAGE stimmst du diesen Nutzungsbedingungen und unserer Datenschutzerklärung zu.",
    "pt": "Ao criar uma conta, acessar ou usar o IRONAGE, você concorda com estes Termos de Serviço e nossa Política de Privacidade.",
    "bg": "Със създаването на акаунт, достъпа или използването на IRONAGE се съгласяваш с тези Условия за ползване и Политиката за поверителност."
  },
  "IRONAGE provides fitness, workout, nutrition, progress tracking, coaching, and related digital features.": {
    "en": "IRONAGE provides fitness, workout, nutrition, progress tracking, coaching, and related digital features.",
    "es": "IRONAGE ofrece funciones digitales de fitness, entrenamiento, nutrición, seguimiento del progreso, coaching y servicios relacionados.",
    "uk": "IRONAGE надає цифрові функції для фітнесу, тренувань, харчування, відстеження прогресу, тренерства та пов’язаних сервісів.",
    "ru": "IRONAGE предоставляет цифровые функции для фитнеса, тренировок, питания, отслеживания прогресса, тренерства и связанных сервисов.",
    "fr": "IRONAGE propose des fonctions numériques de fitness, d’entraînement, de nutrition, de suivi des progrès, de coaching et services associés.",
    "de": "IRONAGE bietet digitale Funktionen für Fitness, Training, Ernährung, Fortschrittsverfolgung, Coaching und verwandte Dienste.",
    "pt": "O IRONAGE oferece recursos digitais de fitness, treino, nutrição, acompanhamento de progresso, coaching e serviços relacionados.",
    "bg": "IRONAGE предоставя дигитални функции за фитнес, тренировки, хранене, проследяване на прогреса, коучинг и свързани услуги."
  },
  "IRONAGE provides general fitness and informational content and is not a substitute for professional medical advice, diagnosis, or treatment.": {
    "en": "IRONAGE provides general fitness and informational content and is not a substitute for professional medical advice, diagnosis, or treatment.",
    "es": "IRONAGE ofrece contenido general de fitness e información y no sustituye el consejo, diagnóstico o tratamiento médico profesional.",
    "uk": "IRONAGE надає загальний фітнес- та інформаційний контент і не замінює професійну медичну консультацію, діагностику чи лікування.",
    "ru": "IRONAGE предоставляет общий фитнес- и информационный контент и не заменяет профессиональную медицинскую консультацию, диагностику или лечение.",
    "fr": "IRONAGE fournit du contenu général sur le fitness et l’information et ne remplace pas un avis, diagnostic ou traitement médical professionnel.",
    "de": "IRONAGE bietet allgemeine Fitness- und Informationsinhalte und ersetzt keine professionelle medizinische Beratung, Diagnose oder Behandlung.",
    "pt": "O IRONAGE fornece conteúdo geral de fitness e informação e não substitui aconselhamento, diagnóstico ou tratamento médico profissional.",
    "bg": "IRONAGE предоставя общо фитнес и информационно съдържание и не замества професионален медицински съвет, диагноза или лечение."
  },
  "Consult an appropriate healthcare professional before beginning a new exercise or nutrition program when necessary for your circumstances.": {
    "en": "Consult an appropriate healthcare professional before beginning a new exercise or nutrition program when necessary for your circumstances.",
    "es": "Consulta a un profesional sanitario adecuado antes de iniciar un nuevo programa de ejercicio o nutrición cuando sea necesario según tus circunstancias.",
    "uk": "За потреби проконсультуйся з відповідним медичним фахівцем перед початком нової програми тренувань або харчування.",
    "ru": "При необходимости проконсультируйся с подходящим медицинским специалистом перед началом новой программы тренировок или питания.",
    "fr": "Consulte un professionnel de santé approprié avant de commencer un nouveau programme d’exercice ou de nutrition si ta situation l’exige.",
    "de": "Konsultiere bei Bedarf einen geeigneten medizinischen Fachmann, bevor du ein neues Trainings- oder Ernährungsprogramm beginnst.",
    "pt": "Consulte um profissional de saúde adequado antes de iniciar um novo programa de exercício ou nutrição quando necessário.",
    "bg": "При необходимост се консултирай с подходящ медицински специалист, преди да започнеш нова тренировъчна или хранителна програма."
  },
  "You are responsible for maintaining the security of your account and for providing accurate account information. You must not use another person's account without authorization.": {
    "en": "You are responsible for maintaining the security of your account and for providing accurate account information. You must not use another person's account without authorization.",
    "es": "Eres responsable de mantener la seguridad de tu cuenta y de proporcionar información precisa. No debes usar la cuenta de otra persona sin autorización.",
    "uk": "Ти відповідаєш за безпеку свого акаунта та точність наданої інформації. Не можна використовувати чужий акаунт без дозволу.",
    "ru": "Ты отвечаешь за безопасность своего аккаунта и точность предоставленной информации. Нельзя использовать чужой аккаунт без разрешения.",
    "fr": "Tu es responsable de la sécurité de ton compte et de l’exactitude des informations fournies. Tu ne dois pas utiliser le compte d’une autre personne sans autorisation.",
    "de": "Du bist für die Sicherheit deines Kontos und korrekte Kontoinformationen verantwortlich. Du darfst kein fremdes Konto ohne Erlaubnis nutzen.",
    "pt": "Você é responsável pela segurança da sua conta e por fornecer informações corretas. Não use a conta de outra pessoa sem autorização.",
    "bg": "Носиш отговорност за сигурността на акаунта си и за точната информация. Не използвай чужд акаунт без разрешение."
  },
  "Coaches using IRONAGE are responsible for the programs, instructions, and services they provide to their clients. IRONAGE does not guarantee specific fitness or coaching results.": {
    "en": "Coaches using IRONAGE are responsible for the programs, instructions, and services they provide to their clients. IRONAGE does not guarantee specific fitness or coaching results.",
    "es": "Los entrenadores que usan IRONAGE son responsables de los programas, instrucciones y servicios que ofrecen a sus clientes. IRONAGE no garantiza resultados específicos.",
    "uk": "Тренери, які використовують IRONAGE, відповідають за програми, інструкції та послуги для своїх клієнтів. IRONAGE не гарантує конкретних результатів.",
    "ru": "Тренеры, использующие IRONAGE, отвечают за программы, инструкции и услуги для своих клиентов. IRONAGE не гарантирует конкретных результатов.",
    "fr": "Les coachs utilisant IRONAGE sont responsables des programmes, instructions et services fournis à leurs clients. IRONAGE ne garantit aucun résultat spécifique.",
    "de": "Coaches, die IRONAGE nutzen, sind für ihre Programme, Anweisungen und Leistungen verantwortlich. IRONAGE garantiert keine bestimmten Ergebnisse.",
    "pt": "Treinadores que usam o IRONAGE são responsáveis pelos programas, instruções e serviços fornecidos aos clientes. O IRONAGE não garante resultados específicos.",
    "bg": "Треньорите, които използват IRONAGE, носят отговорност за програмите, инструкциите и услугите към клиентите си. IRONAGE не гарантира конкретни резултати."
  },
  "Certain features may require a paid subscription. Pricing, billing periods, renewal terms, and cancellation options will be presented before purchase.": {
    "en": "Certain features may require a paid subscription. Pricing, billing periods, renewal terms, and cancellation options will be presented before purchase.",
    "es": "Algunas funciones pueden requerir una suscripción de pago. El precio, los periodos de facturación, las renovaciones y la cancelación se mostrarán antes de la compra.",
    "uk": "Деякі функції можуть вимагати платної підписки. Ціна, періоди оплати, умови поновлення та скасування будуть показані до покупки.",
    "ru": "Некоторые функции могут требовать платной подписки. Цена, периоды оплаты, условия продления и отмены будут показаны до покупки.",
    "fr": "Certaines fonctions peuvent nécessiter un abonnement payant. Les prix, périodes de facturation, renouvellements et options d’annulation seront présentés avant l’achat.",
    "de": "Bestimmte Funktionen können ein kostenpflichtiges Abonnement erfordern. Preise, Abrechnungszeiträume, Verlängerungsbedingungen und Kündigungsoptionen werden vor dem Kauf angezeigt.",
    "pt": "Alguns recursos podem exigir assinatura paga. Preços, períodos de cobrança, renovação e opções de cancelamento serão apresentados antes da compra.",
    "bg": "Някои функции може да изискват платен абонамент. Цените, периодите на таксуване, подновяването и опциите за отказ ще бъдат показани преди покупката."
  },
  "You may not misuse IRONAGE, interfere with its operation, attempt unauthorized access, abuse other users, or use the service for unlawful activities.": {
    "en": "You may not misuse IRONAGE, interfere with its operation, attempt unauthorized access, abuse other users, or use the service for unlawful activities.",
    "es": "No puedes usar indebidamente IRONAGE, interferir con su funcionamiento, intentar accesos no autorizados, abusar de otros usuarios ni usar el servicio para actividades ilegales.",
    "uk": "Не можна зловживати IRONAGE, втручатися в його роботу, намагатися отримати несанкціонований доступ, переслідувати інших користувачів або використовувати сервіс незаконно.",
    "ru": "Нельзя злоупотреблять IRONAGE, вмешиваться в его работу, пытаться получить несанкционированный доступ, злоупотреблять другими пользователями или использовать сервис незаконно.",
    "fr": "Tu ne peux pas détourner IRONAGE, perturber son fonctionnement, tenter un accès non autorisé, abuser d’autres utilisateurs ou utiliser le service à des fins illégales.",
    "de": "Du darfst IRONAGE nicht missbrauchen, den Betrieb stören, unbefugten Zugriff versuchen, andere Nutzer missbrauchen oder den Dienst für rechtswidrige Aktivitäten verwenden.",
    "pt": "Você não pode usar o IRONAGE indevidamente, interferir em seu funcionamento, tentar acesso não autorizado, abusar de outros usuários ou usar o serviço para atividades ilegais.",
    "bg": "Не трябва да злоупотребяваш с IRONAGE, да пречиш на работата му, да правиш опити за неоторизиран достъп, да злоупотребяваш с други потребители или да използваш услугата незаконно."
  },
  "The IRONAGE name, software, design, branding, and original platform content are protected by applicable intellectual property laws.": {
    "en": "The IRONAGE name, software, design, branding, and original platform content are protected by applicable intellectual property laws.",
    "es": "El nombre IRONAGE, el software, el diseño, la marca y el contenido original están protegidos por las leyes de propiedad intelectual aplicables.",
    "uk": "Назва IRONAGE, програмне забезпечення, дизайн, бренд та оригінальний контент платформи захищені законодавством про інтелектуальну власність.",
    "ru": "Название IRONAGE, программное обеспечение, дизайн, бренд и оригинальный контент платформы защищены законодательством об интеллектуальной собственности.",
    "fr": "Le nom IRONAGE, le logiciel, le design, la marque et le contenu original de la plateforme sont protégés par les lois applicables sur la propriété intellectuelle.",
    "de": "Der Name IRONAGE, Software, Design, Marke und originale Plattforminhalte sind durch geltende Gesetze zum geistigen Eigentum geschützt.",
    "pt": "O nome IRONAGE, software, design, marca e conteúdo original da plataforma são protegidos pelas leis aplicáveis de propriedade intelectual.",
    "bg": "Името IRONAGE, софтуерът, дизайнът, брандът и оригиналното съдържание на платформата са защитени от приложимите закони за интелектуална собственост."
  },
  "We may modify, update, suspend, or discontinue parts of IRONAGE as the service evolves. We do not guarantee uninterrupted availability.": {
    "en": "We may modify, update, suspend, or discontinue parts of IRONAGE as the service evolves. We do not guarantee uninterrupted availability.",
    "es": "Podemos modificar, actualizar, suspender o discontinuar partes de IRONAGE a medida que evoluciona el servicio. No garantizamos disponibilidad ininterrumpida.",
    "uk": "Ми можемо змінювати, оновлювати, призупиняти або припиняти частини IRONAGE у міру розвитку сервісу. Безперервна доступність не гарантується.",
    "ru": "Мы можем изменять, обновлять, приостанавливать или прекращать части IRONAGE по мере развития сервиса. Непрерывная доступность не гарантируется.",
    "fr": "Nous pouvons modifier, mettre à jour, suspendre ou interrompre certaines parties d’IRONAGE à mesure que le service évolue. Nous ne garantissons pas une disponibilité ininterrompue.",
    "de": "Wir können Teile von IRONAGE ändern, aktualisieren, aussetzen oder einstellen. Eine ununterbrochene Verfügbarkeit wird nicht garantiert.",
    "pt": "Podemos modificar, atualizar, suspender ou descontinuar partes do IRONAGE conforme o serviço evolui. Não garantimos disponibilidade ininterrupta.",
    "bg": "Можем да променяме, актуализираме, спираме или прекратяваме части от IRONAGE с развитието на услугата. Не гарантираме непрекъсната наличност."
  },
  "To the extent permitted by applicable law, IRONAGE is not responsible for indirect, incidental, or consequential losses arising from use of the service.": {
    "en": "To the extent permitted by applicable law, IRONAGE is not responsible for indirect, incidental, or consequential losses arising from use of the service.",
    "es": "En la medida permitida por la ley, IRONAGE no es responsable de pérdidas indirectas, incidentales o consecuentes derivadas del uso del servicio.",
    "uk": "У межах, дозволених законом, IRONAGE не несе відповідальності за непрямі, випадкові або наслідкові збитки, що виникають через використання сервісу.",
    "ru": "В пределах, разрешённых законом, IRONAGE не несёт ответственности за косвенные, случайные или последующие убытки, возникшие при использовании сервиса.",
    "fr": "Dans la mesure permise par la loi, IRONAGE n’est pas responsable des pertes indirectes, accessoires ou consécutives résultant de l’utilisation du service.",
    "de": "Soweit gesetzlich zulässig, haftet IRONAGE nicht für indirekte, zufällige oder Folgeschäden aus der Nutzung des Dienstes.",
    "pt": "Na medida permitida por lei, o IRONAGE não é responsável por perdas indiretas, incidentais ou consequenciais decorrentes do uso do serviço.",
    "bg": "Доколкото е разрешено от закона, IRONAGE не носи отговорност за косвени, случайни или последващи загуби от използването на услугата."
  },
  "These Terms may be updated as IRONAGE evolves. The current version and its effective date will be available on this page.": {
    "en": "These Terms may be updated as IRONAGE evolves. The current version and its effective date will be available on this page.",
    "es": "Estos Términos pueden actualizarse a medida que IRONAGE evoluciona. La versión actual y su fecha de vigencia estarán disponibles en esta página.",
    "uk": "Ці Умови можуть оновлюватися в міру розвитку IRONAGE. Актуальна версія та дата набрання чинності будуть доступні на цій сторінці.",
    "ru": "Эти Условия могут обновляться по мере развития IRONAGE. Актуальная версия и дата вступления в силу будут доступны на этой странице.",
    "fr": "Ces Conditions peuvent être mises à jour à mesure qu’IRONAGE évolue. La version actuelle et sa date d’effet seront disponibles sur cette page.",
    "de": "Diese Bedingungen können mit der Weiterentwicklung von IRONAGE aktualisiert werden. Die aktuelle Version und das Datum des Inkrafttretens sind auf dieser Seite verfügbar.",
    "pt": "Estes Termos podem ser atualizados conforme o IRONAGE evolui. A versão atual e sua data de vigência estarão disponíveis nesta página.",
    "bg": "Тези Условия могат да се актуализират с развитието на IRONAGE. Текущата версия и датата на влизане в сила ще бъдат налични на тази страница."
  },
  "Questions regarding these Terms can be submitted through the official IRONAGE support channels.": {
    "en": "Questions regarding these Terms can be submitted through the official IRONAGE support channels.",
    "es": "Las preguntas sobre estos Términos pueden enviarse a través de los canales oficiales de soporte de IRONAGE.",
    "uk": "Питання щодо цих Умов можна надсилати через офіційні канали підтримки IRONAGE.",
    "ru": "Вопросы по этим Условиям можно направлять через официальные каналы поддержки IRONAGE.",
    "fr": "Les questions concernant ces Conditions peuvent être envoyées via les canaux officiels d’assistance IRONAGE.",
    "de": "Fragen zu diesen Bedingungen können über die offiziellen IRONAGE-Supportkanäle eingereicht werden.",
    "pt": "Perguntas sobre estes Termos podem ser enviadas pelos canais oficiais de suporte do IRONAGE.",
    "bg": "Въпроси относно тези Условия могат да се изпращат чрез официалните канали за поддръжка на IRONAGE."
  },
  "1. Information We Collect": {
    "en": "1. Information We Collect",
    "es": "1. Información que recopilamos",
    "uk": "1. Інформація, яку ми збираємо",
    "ru": "1. Информация, которую мы собираем",
    "fr": "1. Informations collectées",
    "de": "1. Informationen, die wir erfassen",
    "pt": "1. Informações que coletamos",
    "bg": "1. Информация, която събираме"
  },
  "2. Authentication": {
    "en": "2. Authentication",
    "es": "2. Autenticación",
    "uk": "2. Автентифікація",
    "ru": "2. Аутентификация",
    "fr": "2. Authentification",
    "de": "2. Authentifizierung",
    "pt": "2. Autenticação",
    "bg": "2. Удостоверяване"
  },
  "3. How We Use Information": {
    "en": "3. How We Use Information",
    "es": "3. Cómo usamos la información",
    "uk": "3. Як ми використовуємо інформацію",
    "ru": "3. Как мы используем информацию",
    "fr": "3. Utilisation des informations",
    "de": "3. Verwendung von Informationen",
    "pt": "3. Como usamos as informações",
    "bg": "3. Как използваме информацията"
  },
  "4. Coach and Client Data": {
    "en": "4. Coach and Client Data",
    "es": "4. Datos de entrenador y cliente",
    "uk": "4. Дані тренера та клієнта",
    "ru": "4. Данные тренера и клиента",
    "fr": "4. Données coach et client",
    "de": "4. Coach- und Kundendaten",
    "pt": "4. Dados de treinador e cliente",
    "bg": "4. Данни на треньор и клиент"
  },
  "5. Service Providers": {
    "en": "5. Service Providers",
    "es": "5. Proveedores de servicios",
    "uk": "5. Постачальники послуг",
    "ru": "5. Поставщики услуг",
    "fr": "5. Prestataires de services",
    "de": "5. Dienstleister",
    "pt": "5. Prestadores de serviços",
    "bg": "5. Доставчици на услуги"
  },
  "6. Data Security": {
    "en": "6. Data Security",
    "es": "6. Seguridad de los datos",
    "uk": "6. Безпека даних",
    "ru": "6. Безопасность данных",
    "fr": "6. Sécurité des données",
    "de": "6. Datensicherheit",
    "pt": "6. Segurança de dados",
    "bg": "6. Сигурност на данните"
  },
  "7. Data Retention": {
    "en": "7. Data Retention",
    "es": "7. Conservación de datos",
    "uk": "7. Зберігання даних",
    "ru": "7. Хранение данных",
    "fr": "7. Conservation des données",
    "de": "7. Datenspeicherung",
    "pt": "7. Retenção de dados",
    "bg": "7. Съхранение на данни"
  },
  "8. Your Choices and Rights": {
    "en": "8. Your Choices and Rights",
    "es": "8. Tus opciones y derechos",
    "uk": "8. Твій вибір і права",
    "ru": "8. Твой выбор и права",
    "fr": "8. Tes choix et droits",
    "de": "8. Deine Wahlmöglichkeiten und Rechte",
    "pt": "8. Suas escolhas e direitos",
    "bg": "8. Твоите избори и права"
  },
  "9. Children": {
    "en": "9. Children",
    "es": "9. Menores",
    "uk": "9. Діти",
    "ru": "9. Дети",
    "fr": "9. Enfants",
    "de": "9. Kinder",
    "pt": "9. Crianças",
    "bg": "9. Деца"
  },
  "10. Changes to This Policy": {
    "en": "10. Changes to This Policy",
    "es": "10. Cambios en esta Política",
    "uk": "10. Зміни до цієї Політики",
    "ru": "10. Изменения этой Политики",
    "fr": "10. Modifications de cette politique",
    "de": "10. Änderungen dieser Richtlinie",
    "pt": "10. Alterações nesta Política",
    "bg": "10. Промени в тази Политика"
  },
  "11. Contact": {
    "en": "11. Contact",
    "es": "11. Contacto",
    "uk": "11. Контакти",
    "ru": "11. Контакты",
    "fr": "11. Contact",
    "de": "11. Kontakt",
    "pt": "11. Contato",
    "bg": "11. Контакт"
  },
  "Depending on how you use IRONAGE, we may process account information such as your name, email address, authentication information, profile details, workout activity, progress, nutrition information, and coaching-related data.": {
    "en": "Depending on how you use IRONAGE, we may process account information such as your name, email address, authentication information, profile details, workout activity, progress, nutrition information, and coaching-related data.",
    "es": "Según cómo uses IRONAGE, podemos procesar información de la cuenta como tu nombre, correo electrónico, autenticación, perfil, actividad de entrenamiento, progreso, nutrición y datos relacionados con coaching.",
    "uk": "Залежно від використання IRONAGE ми можемо обробляти дані акаунта: ім’я, email, інформацію автентифікації, профіль, активність тренувань, прогрес, харчування та дані, пов’язані з тренерством.",
    "ru": "В зависимости от использования IRONAGE мы можем обрабатывать данные аккаунта: имя, email, данные аутентификации, профиль, тренировочную активность, прогресс, питание и данные, связанные с тренерством.",
    "fr": "Selon ton utilisation d’IRONAGE, nous pouvons traiter des informations de compte telles que ton nom, email, authentification, profil, activité d’entraînement, progrès, nutrition et données de coaching.",
    "de": "Je nach Nutzung von IRONAGE können wir Kontoinformationen wie Name, E-Mail, Authentifizierungsdaten, Profildetails, Trainingsaktivität, Fortschritt, Ernährung und Coaching-Daten verarbeiten.",
    "pt": "Dependendo de como você usa o IRONAGE, podemos processar dados da conta como nome, email, autenticação, perfil, atividade de treino, progresso, nutrição e dados de coaching.",
    "bg": "В зависимост от начина, по който използваш IRONAGE, може да обработваме данни за акаунта като име, email, удостоверяване, профил, тренировъчна активност, прогрес, хранене и коучинг данни."
  },
  "IRONAGE may support multiple authentication methods, including email and supported third-party authentication providers.": {
    "en": "IRONAGE may support multiple authentication methods, including email and supported third-party authentication providers.",
    "es": "IRONAGE puede admitir varios métodos de autenticación, incluido el correo electrónico y proveedores externos compatibles.",
    "uk": "IRONAGE може підтримувати кілька способів автентифікації, включно з email та підтримуваними сторонніми провайдерами.",
    "ru": "IRONAGE может поддерживать несколько способов аутентификации, включая email и поддерживаемых сторонних провайдеров.",
    "fr": "IRONAGE peut prendre en charge plusieurs méthodes d’authentification, notamment l’email et des fournisseurs tiers compatibles.",
    "de": "IRONAGE kann mehrere Authentifizierungsmethoden unterstützen, einschließlich E-Mail und unterstützter Drittanbieter.",
    "pt": "O IRONAGE pode oferecer vários métodos de autenticação, incluindo email e provedores de terceiros compatíveis.",
    "bg": "IRONAGE може да поддържа няколко метода за удостоверяване, включително email и поддържани външни доставчици."
  },
  "Passwords are not stored in plain text. Authentication credentials and sessions are protected using security controls appropriate to the authentication method.": {
    "en": "Passwords are not stored in plain text. Authentication credentials and sessions are protected using security controls appropriate to the authentication method.",
    "es": "Las contraseñas no se almacenan en texto plano. Las credenciales y sesiones se protegen con controles de seguridad adecuados.",
    "uk": "Паролі не зберігаються у відкритому вигляді. Дані автентифікації та сесії захищені відповідними засобами безпеки.",
    "ru": "Пароли не хранятся в открытом виде. Данные аутентификации и сессии защищены соответствующими средствами безопасности.",
    "fr": "Les mots de passe ne sont pas stockés en clair. Les identifiants et sessions sont protégés par des contrôles de sécurité adaptés.",
    "de": "Passwörter werden nicht im Klartext gespeichert. Authentifizierungsdaten und Sitzungen werden mit geeigneten Sicherheitsmaßnahmen geschützt.",
    "pt": "As senhas não são armazenadas em texto simples. Credenciais e sessões são protegidas com controles de segurança adequados.",
    "bg": "Паролите не се съхраняват като обикновен текст. Данните за удостоверяване и сесиите са защитени с подходящи мерки за сигурност."
  },
  "Information may be used to operate IRONAGE, authenticate users, provide workouts and coaching features, maintain progress history, personalize the experience, protect the service, and improve the platform.": {
    "en": "Information may be used to operate IRONAGE, authenticate users, provide workouts and coaching features, maintain progress history, personalize the experience, protect the service, and improve the platform.",
    "es": "La información puede usarse para operar IRONAGE, autenticar usuarios, ofrecer entrenamientos y coaching, mantener el historial de progreso, personalizar la experiencia, proteger el servicio y mejorar la plataforma.",
    "uk": "Інформація може використовуватися для роботи IRONAGE, автентифікації, тренувань і тренерських функцій, збереження історії прогресу, персоналізації, захисту сервісу та покращення платформи.",
    "ru": "Информация может использоваться для работы IRONAGE, аутентификации, тренировок и тренерских функций, хранения истории прогресса, персонализации, защиты сервиса и улучшения платформы.",
    "fr": "Les informations peuvent être utilisées pour exploiter IRONAGE, authentifier les utilisateurs, fournir entraînements et coaching, conserver l’historique, personnaliser l’expérience, protéger et améliorer la plateforme.",
    "de": "Informationen können verwendet werden, um IRONAGE zu betreiben, Nutzer zu authentifizieren, Trainings und Coaching bereitzustellen, Fortschritte zu speichern, das Erlebnis zu personalisieren, den Dienst zu schützen und die Plattform zu verbessern.",
    "pt": "As informações podem ser usadas para operar o IRONAGE, autenticar usuários, fornecer treinos e coaching, manter o histórico de progresso, personalizar a experiência, proteger o serviço e melhorar a plataforma.",
    "bg": "Информацията може да се използва за работа на IRONAGE, удостоверяване на потребители, тренировки и коучинг, съхраняване на прогреса, персонализиране, защита на услугата и подобряване на платформата."
  },
  "When a user chooses to connect with a coach, information necessary for coaching features may be shared between the connected client and coach according to the features and permissions provided by IRONAGE.": {
    "en": "When a user chooses to connect with a coach, information necessary for coaching features may be shared between the connected client and coach according to the features and permissions provided by IRONAGE.",
    "es": "Cuando un usuario se conecta con un entrenador, la información necesaria para las funciones de coaching puede compartirse entre el cliente y el entrenador según las funciones y permisos de IRONAGE.",
    "uk": "Коли користувач підключається до тренера, необхідні для тренерських функцій дані можуть передаватися між клієнтом і тренером відповідно до функцій та дозволів IRONAGE.",
    "ru": "Когда пользователь подключается к тренеру, необходимые для тренерских функций данные могут передаваться между клиентом и тренером в соответствии с функциями и разрешениями IRONAGE.",
    "fr": "Lorsqu’un utilisateur se connecte à un coach, les informations nécessaires au coaching peuvent être partagées entre client et coach selon les fonctions et autorisations d’IRONAGE.",
    "de": "Wenn sich ein Nutzer mit einem Coach verbindet, können für Coaching-Funktionen erforderliche Informationen gemäß den IRONAGE-Funktionen und Berechtigungen zwischen Kunde und Coach geteilt werden.",
    "pt": "Quando um usuário se conecta a um treinador, as informações necessárias ao coaching podem ser compartilhadas entre cliente e treinador conforme os recursos e permissões do IRONAGE.",
    "bg": "Когато потребител се свърже с треньор, необходимата за коучинг информация може да се споделя между клиента и треньора според функциите и разрешенията на IRONAGE."
  },
  "IRONAGE may use trusted infrastructure and service providers to operate features such as hosting, databases, authentication, email delivery, payments, analytics, and security.": {
    "en": "IRONAGE may use trusted infrastructure and service providers to operate features such as hosting, databases, authentication, email delivery, payments, analytics, and security.",
    "es": "IRONAGE puede usar proveedores de infraestructura y servicios de confianza para hosting, bases de datos, autenticación, correo, pagos, analítica y seguridad.",
    "uk": "IRONAGE може використовувати надійних постачальників інфраструктури та послуг для хостингу, баз даних, автентифікації, email, платежів, аналітики та безпеки.",
    "ru": "IRONAGE может использовать надёжных поставщиков инфраструктуры и услуг для хостинга, баз данных, аутентификации, email, платежей, аналитики и безопасности.",
    "fr": "IRONAGE peut utiliser des prestataires d’infrastructure et de services de confiance pour l’hébergement, les bases de données, l’authentification, l’email, les paiements, l’analyse et la sécurité.",
    "de": "IRONAGE kann vertrauenswürdige Infrastruktur- und Dienstanbieter für Hosting, Datenbanken, Authentifizierung, E-Mail, Zahlungen, Analyse und Sicherheit nutzen.",
    "pt": "O IRONAGE pode usar provedores confiáveis de infraestrutura e serviços para hospedagem, bancos de dados, autenticação, email, pagamentos, análise e segurança.",
    "bg": "IRONAGE може да използва надеждни доставчици на инфраструктура и услуги за хостинг, бази данни, удостоверяване, email, плащания, анализи и сигурност."
  },
  "We use technical and organizational safeguards designed to protect user information. No internet service can guarantee absolute security.": {
    "en": "We use technical and organizational safeguards designed to protect user information. No internet service can guarantee absolute security.",
    "es": "Usamos medidas técnicas y organizativas para proteger la información del usuario. Ningún servicio de Internet puede garantizar seguridad absoluta.",
    "uk": "Ми використовуємо технічні та організаційні заходи для захисту інформації користувачів. Жоден інтернет-сервіс не може гарантувати абсолютну безпеку.",
    "ru": "Мы используем технические и организационные меры для защиты информации пользователей. Ни один интернет-сервис не может гарантировать абсолютную безопасность.",
    "fr": "Nous utilisons des mesures techniques et organisationnelles pour protéger les informations des utilisateurs. Aucun service Internet ne peut garantir une sécurité absolue.",
    "de": "Wir setzen technische und organisatorische Schutzmaßnahmen ein. Kein Internetdienst kann absolute Sicherheit garantieren.",
    "pt": "Usamos medidas técnicas e organizacionais para proteger as informações dos usuários. Nenhum serviço de Internet pode garantir segurança absoluta.",
    "bg": "Използваме технически и организационни мерки за защита на потребителската информация. Никоя интернет услуга не може да гарантира абсолютна сигурност."
  },
  "Information is retained for as long as reasonably necessary to provide the service, comply with legal obligations, resolve disputes, and protect the platform.": {
    "en": "Information is retained for as long as reasonably necessary to provide the service, comply with legal obligations, resolve disputes, and protect the platform.",
    "es": "La información se conserva durante el tiempo razonablemente necesario para prestar el servicio, cumplir obligaciones legales, resolver disputas y proteger la plataforma.",
    "uk": "Інформація зберігається стільки, скільки обґрунтовано потрібно для надання сервісу, виконання юридичних зобов’язань, вирішення спорів і захисту платформи.",
    "ru": "Информация хранится столько, сколько разумно необходимо для предоставления сервиса, выполнения юридических обязательств, разрешения споров и защиты платформы.",
    "fr": "Les informations sont conservées aussi longtemps que raisonnablement nécessaire pour fournir le service, respecter les obligations légales, résoudre les litiges et protéger la plateforme.",
    "de": "Informationen werden so lange gespeichert, wie dies für die Bereitstellung des Dienstes, rechtliche Verpflichtungen, Streitbeilegung und den Schutz der Plattform erforderlich ist.",
    "pt": "As informações são mantidas pelo tempo razoavelmente necessário para prestar o serviço, cumprir obrigações legais, resolver disputas e proteger a plataforma.",
    "bg": "Информацията се съхранява толкова дълго, колкото е разумно необходимо за услугата, законовите задължения, разрешаването на спорове и защитата на платформата."
  },
  "Depending on applicable law, you may have rights regarding access, correction, deletion, restriction, portability, or objection to certain uses of your personal information.": {
    "en": "Depending on applicable law, you may have rights regarding access, correction, deletion, restriction, portability, or objection to certain uses of your personal information.",
    "es": "Según la ley aplicable, puedes tener derechos de acceso, corrección, eliminación, restricción, portabilidad u oposición a ciertos usos de tus datos personales.",
    "uk": "Залежно від законодавства ти можеш мати права на доступ, виправлення, видалення, обмеження, перенесення або заперечення щодо певного використання персональних даних.",
    "ru": "В зависимости от законодательства у тебя могут быть права на доступ, исправление, удаление, ограничение, переносимость или возражение против определённого использования персональных данных.",
    "fr": "Selon la loi applicable, tu peux disposer de droits d’accès, rectification, suppression, restriction, portabilité ou opposition à certains usages de tes données personnelles.",
    "de": "Je nach geltendem Recht kannst du Rechte auf Zugriff, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit oder Widerspruch gegen bestimmte Nutzungen deiner personenbezogenen Daten haben.",
    "pt": "Dependendo da lei aplicável, você pode ter direitos de acesso, correção, exclusão, restrição, portabilidade ou oposição a certos usos dos seus dados pessoais.",
    "bg": "В зависимост от приложимото право може да имаш права за достъп, корекция, изтриване, ограничаване, преносимост или възражение срещу определени употреби на личните ти данни."
  },
  "IRONAGE is not intended to knowingly collect personal information from children where parental consent or another legal basis is required by applicable law.": {
    "en": "IRONAGE is not intended to knowingly collect personal information from children where parental consent or another legal basis is required by applicable law.",
    "es": "IRONAGE no pretende recopilar conscientemente información personal de menores cuando la ley exige consentimiento parental u otra base legal.",
    "uk": "IRONAGE не призначений для свідомого збору персональних даних дітей у випадках, коли закон вимагає згоди батьків або іншої правової підстави.",
    "ru": "IRONAGE не предназначен для сознательного сбора персональных данных детей в случаях, когда закон требует согласия родителей или иного правового основания.",
    "fr": "IRONAGE n’est pas destiné à collecter sciemment des informations personnelles d’enfants lorsque le consentement parental ou une autre base légale est requis.",
    "de": "IRONAGE ist nicht dazu bestimmt, wissentlich personenbezogene Daten von Kindern zu erfassen, wenn elterliche Zustimmung oder eine andere Rechtsgrundlage erforderlich ist.",
    "pt": "O IRONAGE não se destina a coletar conscientemente informações pessoais de crianças quando a lei exige consentimento dos pais ou outra base legal.",
    "bg": "IRONAGE не е предназначен съзнателно да събира лични данни от деца, когато законът изисква родителско съгласие или друго правно основание."
  },
  "We may update this Privacy Policy as IRONAGE evolves. The latest version and update date will be available on this page.": {
    "en": "We may update this Privacy Policy as IRONAGE evolves. The latest version and update date will be available on this page.",
    "es": "Podemos actualizar esta Política de Privacidad a medida que IRONAGE evoluciona. La versión más reciente y la fecha de actualización estarán disponibles en esta página.",
    "uk": "Ми можемо оновлювати цю Політику конфіденційності в міру розвитку IRONAGE. Остання версія та дата оновлення будуть доступні на цій сторінці.",
    "ru": "Мы можем обновлять эту Политику конфиденциальности по мере развития IRONAGE. Последняя версия и дата обновления будут доступны на этой странице.",
    "fr": "Nous pouvons mettre à jour cette Politique de confidentialité à mesure qu’IRONAGE évolue. La dernière version et sa date de mise à jour seront disponibles sur cette page.",
    "de": "Wir können diese Datenschutzerklärung mit der Weiterentwicklung von IRONAGE aktualisieren. Die aktuelle Version und das Aktualisierungsdatum sind auf dieser Seite verfügbar.",
    "pt": "Podemos atualizar esta Política de Privacidade conforme o IRONAGE evolui. A versão mais recente e a data de atualização estarão disponíveis nesta página.",
    "bg": "Можем да актуализираме тази Политика за поверителност с развитието на IRONAGE. Последната версия и датата на актуализация ще бъдат налични на тази страница."
  },
  "Privacy questions and requests can be submitted through the official IRONAGE support channels.": {
    "en": "Privacy questions and requests can be submitted through the official IRONAGE support channels.",
    "es": "Las preguntas y solicitudes de privacidad pueden enviarse a través de los canales oficiales de soporte de IRONAGE.",
    "uk": "Питання та запити щодо конфіденційності можна надсилати через офіційні канали підтримки IRONAGE.",
    "ru": "Вопросы и запросы по конфиденциальности можно направлять через официальные каналы поддержки IRONAGE.",
    "fr": "Les questions et demandes relatives à la confidentialité peuvent être envoyées via les canaux officiels d’assistance IRONAGE.",
    "de": "Fragen und Anfragen zum Datenschutz können über die offiziellen IRONAGE-Supportkanäle eingereicht werden.",
    "pt": "Perguntas e solicitações de privacidade podem ser enviadas pelos canais oficiais de suporte do IRONAGE.",
    "bg": "Въпроси и заявки относно поверителността могат да се изпращат чрез официалните канали за поддръжка на IRONAGE."
  },
  "Reminder time updated.": {
    "en": "Reminder time updated.",
    "es": "Hora del recordatorio actualizada.",
    "uk": "Час нагадування оновлено.",
    "ru": "Время напоминания обновлено.",
    "fr": "Heure du rappel mise à jour.",
    "de": "Erinnerungszeit aktualisiert.",
    "pt": "Horário do lembrete atualizado.",
    "bg": "Часът на напомнянето е актуализиран."
  },
  "Could not update reminder time.": {
    "en": "Could not update reminder time.",
    "es": "No se pudo actualizar la hora del recordatorio.",
    "uk": "Не вдалося оновити час нагадування.",
    "ru": "Не удалось обновить время напоминания.",
    "fr": "Impossible de mettre à jour l’heure du rappel.",
    "de": "Erinnerungszeit konnte nicht aktualisiert werden.",
    "pt": "Não foi possível atualizar o horário do lembrete.",
    "bg": "Часът на напомнянето не можа да бъде актуализиран."
  },
  "Notification permission is required.": {
    "en": "Notification permission is required.",
    "es": "Se requiere permiso para notificaciones.",
    "uk": "Потрібен дозвіл на сповіщення.",
    "ru": "Требуется разрешение на уведомления.",
    "fr": "L’autorisation des notifications est requise.",
    "de": "Benachrichtigungsberechtigung ist erforderlich.",
    "pt": "É necessária permissão para notificações.",
    "bg": "Необходимо е разрешение за известия."
  },
  "Reminder activated.": {
    "en": "Reminder activated.",
    "es": "Recordatorio activado.",
    "uk": "Нагадування активовано.",
    "ru": "Напоминание активировано.",
    "fr": "Rappel activé.",
    "de": "Erinnerung aktiviert.",
    "pt": "Lembrete ativado.",
    "bg": "Напомнянето е активирано."
  },
  "Reminder disabled.": {
    "en": "Reminder disabled.",
    "es": "Recordatorio desactivado.",
    "uk": "Нагадування вимкнено.",
    "ru": "Напоминание отключено.",
    "fr": "Rappel désactivé.",
    "de": "Erinnerung deaktiviert.",
    "pt": "Lembrete desativado.",
    "bg": "Напомнянето е изключено."
  },
  "Could not update notification reminder.": {
    "en": "Could not update notification reminder.",
    "es": "No se pudo actualizar el recordatorio.",
    "uk": "Не вдалося оновити нагадування.",
    "ru": "Не удалось обновить напоминание.",
    "fr": "Impossible de mettre à jour le rappel.",
    "de": "Benachrichtigung konnte nicht aktualisiert werden.",
    "pt": "Não foi possível atualizar o lembrete.",
    "bg": "Напомнянето не можа да бъде актуализирано."
  },
  "Requesting notification permission...": {
    "en": "Requesting notification permission...",
    "es": "Solicitando permiso de notificaciones...",
    "uk": "Запит дозволу на сповіщення...",
    "ru": "Запрос разрешения на уведомления...",
    "fr": "Demande d’autorisation des notifications...",
    "de": "Benachrichtigungsberechtigung wird angefordert...",
    "pt": "Solicitando permissão de notificações...",
    "bg": "Искаме разрешение за известия..."
  },
  "Notifications are not allowed on this device.": {
    "en": "Notifications are not allowed on this device.",
    "es": "Las notificaciones no están permitidas en este dispositivo.",
    "uk": "Сповіщення не дозволені на цьому пристрої.",
    "ru": "Уведомления не разрешены на этом устройстве.",
    "fr": "Les notifications ne sont pas autorisées sur cet appareil.",
    "de": "Benachrichtigungen sind auf diesem Gerät nicht erlaubt.",
    "pt": "As notificações não são permitidas neste dispositivo.",
    "bg": "Известията не са разрешени на това устройство."
  },
  "Test notification scheduled. Wait 5 seconds.": {
    "en": "Test notification scheduled. Wait 5 seconds.",
    "es": "Notificación de prueba programada. Espera 5 segundos.",
    "uk": "Тестове сповіщення заплановано. Зачекай 5 секунд.",
    "ru": "Тестовое уведомление запланировано. Подожди 5 секунд.",
    "fr": "Notification test programmée. Attends 5 secondes.",
    "de": "Testbenachrichtigung geplant. Warte 5 Sekunden.",
    "pt": "Notificação de teste agendada. Aguarde 5 segundos.",
    "bg": "Тестовото известие е насрочено. Изчакай 5 секунди."
  },
  "Could not schedule notification.": {
    "en": "Could not schedule notification.",
    "es": "No se pudo programar la notificación.",
    "uk": "Не вдалося запланувати сповіщення.",
    "ru": "Не удалось запланировать уведомление.",
    "fr": "Impossible de programmer la notification.",
    "de": "Benachrichtigung konnte nicht geplant werden.",
    "pt": "Não foi possível agendar a notificação.",
    "bg": "Известието не можа да бъде насрочено."
  },
  "Workout reminder time": {
    "en": "Workout reminder time",
    "es": "Hora del recordatorio de entrenamiento",
    "uk": "Час нагадування про тренування",
    "ru": "Время напоминания о тренировке",
    "fr": "Heure du rappel d’entraînement",
    "de": "Zeit der Trainingserinnerung",
    "pt": "Horário do lembrete de treino",
    "bg": "Час за напомняне за тренировка"
  },
  "Motivation reminder time": {
    "en": "Motivation reminder time",
    "es": "Hora del recordatorio de motivación",
    "uk": "Час мотиваційного нагадування",
    "ru": "Время мотивационного напоминания",
    "fr": "Heure du rappel de motivation",
    "de": "Zeit der Motivationserinnerung",
    "pt": "Horário do lembrete de motivação",
    "bg": "Час за мотивационно напомняне"
  },
  "Your name": {
    "en": "Your name",
    "es": "Tu nombre",
    "uk": "Твоє ім'я",
    "ru": "Твоё имя",
    "fr": "Ton nom",
    "de": "Dein Name",
    "pt": "Seu nome",
    "bg": "Твоето име"
  },
  "WORKOUT SAVE ERROR": {
    "en": "WORKOUT SAVE ERROR",
    "es": "ERROR AL GUARDAR ENTRENAMIENTO",
    "uk": "ПОМИЛКА ЗБЕРЕЖЕННЯ ТРЕНУВАННЯ",
    "ru": "ОШИБКА СОХРАНЕНИЯ ТРЕНИРОВКИ",
    "fr": "ERREUR D’ENREGISTREMENT",
    "de": "FEHLER BEIM SPEICHERN DES TRAININGS",
    "pt": "ERRO AO SALVAR TREINO",
    "bg": "ГРЕШКА ПРИ ЗАПАЗВАНЕ НА ТРЕНИРОВКАТА"
  },
  "SAVING WORKOUT...": {
    "en": "SAVING WORKOUT...",
    "es": "GUARDANDO ENTRENAMIENTO...",
    "uk": "ЗБЕРЕЖЕННЯ ТРЕНУВАННЯ...",
    "ru": "СОХРАНЕНИЕ ТРЕНИРОВКИ...",
    "fr": "ENREGISTREMENT DE L’ENTRAÎNEMENT...",
    "de": "TRAINING WIRD GESPEICHERT...",
    "pt": "SALVANDO TREINO...",
    "bg": "ЗАПАЗВАНЕ НА ТРЕНИРОВКАТА..."
  },
  "WORKOUT RESULT": {
    "en": "WORKOUT RESULT",
    "es": "RESULTADO DEL ENTRENAMIENTO",
    "uk": "РЕЗУЛЬТАТ ТРЕНУВАННЯ",
    "ru": "РЕЗУЛЬТАТ ТРЕНИРОВКИ",
    "fr": "RÉSULTAT DE L’ENTRAÎNEMENT",
    "de": "TRAININGSERGEBNIS",
    "pt": "RESULTADO DO TREINO",
    "bg": "РЕЗУЛТАТ ОТ ТРЕНИРОВКАТА"
  },
  "NOT FOUND": {
    "en": "NOT FOUND",
    "es": "NO ENCONTRADO",
    "uk": "НЕ ЗНАЙДЕНО",
    "ru": "НЕ НАЙДЕНО",
    "fr": "INTROUVABLE",
    "de": "NICHT GEFUNDEN",
    "pt": "NÃO ENCONTRADO",
    "bg": "НЕ Е НАМЕРЕНО"
  },
  "BACK TO HOME": {
    "en": "BACK TO HOME",
    "es": "VOLVER AL INICIO",
    "uk": "НАЗАД НА ГОЛОВНУ",
    "ru": "НАЗАД НА ГЛАВНУЮ",
    "fr": "RETOUR À L’ACCUEIL",
    "de": "ZURÜCK ZUR STARTSEITE",
    "pt": "VOLTAR AO INÍCIO",
    "bg": "НАЗАД КЪМ НАЧАЛОТО"
  },
  "Не вдалося зберегти тренування": {
    "en": "Не вдалося зберегти тренування",
    "es": "No se pudo guardar el entrenamiento",
    "uk": "Не вдалося зберегти тренування",
    "ru": "Не удалось сохранить тренировку",
    "fr": "Impossible d’enregistrer l’entraînement",
    "de": "Training konnte nicht gespeichert werden",
    "pt": "Não foi possível salvar o treino",
    "bg": "Тренировката не можа да бъде запазена"
  },
  "Last updated: September 2, 2026": {
    "en": "Last updated: September 2, 2026",
    "es": "Última actualización: 2 de septiembre de 2026",
    "uk": "Останнє оновлення: 2 вересня 2026",
    "ru": "Последнее обновление: 2 сентября 2026",
    "fr": "Dernière mise à jour : 2 septembre 2026",
    "de": "Zuletzt aktualisiert: 2. September 2026",
    "pt": "Última atualização: 2 de setembro de 2026",
    "bg": "Последна актуализация: 2 септември 2026"
  },
  "ATHLETES": {
    "en": "ATHLETES",
    "es": "ATLETAS",
    "uk": "АТЛЕТИ",
    "ru": "АТЛЕТЫ",
    "fr": "ATHLÈTES",
    "de": "ATHLETEN",
    "pt": "ATLETAS",
    "bg": "АТЛЕТИ"
  },
  "CLIENT ROSTER": {
    "en": "CLIENT ROSTER",
    "es": "LISTA DE CLIENTES",
    "uk": "СПИСОК КЛІЄНТІВ",
    "ru": "СПИСОК КЛИЕНТОВ",
    "fr": "LISTE DES CLIENTS",
    "de": "KUNDENLISTE",
    "pt": "LISTA DE CLIENTES",
    "bg": "СПИСЪК С КЛИЕНТИ"
  },
  "Manage assigned athletes and monitor progress.": {
    "en": "Manage assigned athletes and monitor progress.",
    "es": "Gestiona los atletas asignados y supervisa el progreso.",
    "uk": "Керуй призначеними атлетами та відстежуй прогрес.",
    "ru": "Управляй назначенными атлетами и отслеживай прогресс.",
    "fr": "Gère les athlètes attribués et suis leurs progrès.",
    "de": "Verwalte zugewiesene Athleten und überwache den Fortschritt.",
    "pt": "Gerencie atletas atribuídos e acompanhe o progresso.",
    "bg": "Управлявай назначените атлети и следи прогреса."
  },
  "Back to clients": {
    "en": "Back to clients",
    "es": "Volver a clientes",
    "uk": "Назад до клієнтів",
    "ru": "Назад к клиентам",
    "fr": "Retour aux clients",
    "de": "Zurück zu Kunden",
    "pt": "Voltar aos clientes",
    "bg": "Назад към клиентите"
  },
  "Back to coach dashboard": {
    "en": "Back to coach dashboard",
    "es": "Volver al panel del entrenador",
    "uk": "Назад до панелі тренера",
    "ru": "Назад к панели тренера",
    "fr": "Retour au tableau de bord coach",
    "de": "Zurück zum Coach-Dashboard",
    "pt": "Voltar ao painel do treinador",
    "bg": "Назад към таблото на треньора"
  },
  "Back to profile": {
    "en": "Back to profile",
    "es": "Volver al perfil",
    "uk": "Назад до профілю",
    "ru": "Назад к профилю",
    "fr": "Retour au profil",
    "de": "Zurück zum Profil",
    "pt": "Voltar ao perfil",
    "bg": "Назад към профила"
  },
  "Back to programs": {
    "en": "Back to programs",
    "es": "Volver a programas",
    "uk": "Назад до програм",
    "ru": "Назад к программам",
    "fr": "Retour aux programmes",
    "de": "Zurück zu Programmen",
    "pt": "Voltar aos programas",
    "bg": "Назад към програмите"
  },
  "Back to workouts": {
    "en": "Back to workouts",
    "es": "Volver a entrenamientos",
    "uk": "Назад до тренувань",
    "ru": "Назад к тренировкам",
    "fr": "Retour aux entraînements",
    "de": "Zurück zu Trainings",
    "pt": "Voltar aos treinos",
    "bg": "Назад към тренировките"
  },
  "% · BODY FAT": {
    "en": "% · BODY FAT",
    "es": "% · GRASA CORPORAL",
    "uk": "% · ЖИР ТІЛА",
    "ru": "% · ЖИР ТЕЛА",
    "fr": "% · MASSE GRASSE",
    "de": "% · KÖRPERFETT",
    "pt": "% · GORDURA CORPORAL",
    "bg": "% · ТЕЛЕСНИ МАЗНИНИ"
  },
  "KG · WEIGHT": {
    "en": "KG · WEIGHT",
    "es": "KG · PESO",
    "uk": "КГ · ВАГА",
    "ru": "КГ · ВЕС",
    "fr": "KG · POIDS",
    "de": "KG · GEWICHT",
    "pt": "KG · PESO",
    "bg": "КГ · ТЕГЛО"
  },
  "KG · MUSCLE MASS": {
    "en": "KG · MUSCLE MASS",
    "es": "KG · MASA MUSCULAR",
    "uk": "КГ · М'ЯЗОВА МАСА",
    "ru": "КГ · МЫШЕЧНАЯ МАССА",
    "fr": "KG · MASSE MUSCULAIRE",
    "de": "KG · MUSKELMASSE",
    "pt": "KG · MASSA MUSCULAR",
    "bg": "КГ · МУСКУЛНА МАСА"
  },
  "Notifications are active. Time to keep moving.": {
    "en": "Notifications are active. Time to keep moving.",
    "es": "Las notificaciones están activas. Es hora de seguir avanzando.",
    "uk": "Сповіщення активні. Час рухатися далі.",
    "ru": "Уведомления активны. Время двигаться дальше.",
    "fr": "Les notifications sont actives. Continue d’avancer.",
    "de": "Benachrichtigungen sind aktiv. Zeit weiterzumachen.",
    "pt": "As notificações estão ativas. Hora de continuar.",
    "bg": "Известията са активни. Време е да продължиш."
  },
  "IRONAGE · WORKOUT": {
    "en": "IRONAGE · WORKOUT",
    "es": "IRONAGE · ENTRENAMIENTO",
    "uk": "IRONAGE · ТРЕНУВАННЯ",
    "ru": "IRONAGE · ТРЕНИРОВКА",
    "fr": "IRONAGE · ENTRAÎNEMENT",
    "de": "IRONAGE · TRAINING",
    "pt": "IRONAGE · TREINO",
    "bg": "IRONAGE · ТРЕНИРОВКА"
  },
  "Your workout is waiting. Show up and earn it.": {
    "en": "Your workout is waiting. Show up and earn it.",
    "es": "Tu entrenamiento te espera. Preséntate y gánatelo.",
    "uk": "Твоє тренування чекає. Прийди й заслужи результат.",
    "ru": "Твоя тренировка ждёт. Приходи и заслужи результат.",
    "fr": "Ton entraînement t’attend. Présente-toi et mérite-le.",
    "de": "Dein Training wartet. Erscheine und verdiene es dir.",
    "pt": "Seu treino está esperando. Apareça e conquiste.",
    "bg": "Тренировката те чака. Появи се и го заслужи."
  },
  "IRONAGE · NUTRITION": {
    "en": "IRONAGE · NUTRITION",
    "es": "IRONAGE · NUTRICIÓN",
    "uk": "IRONAGE · ХАРЧУВАННЯ",
    "ru": "IRONAGE · ПИТАНИЕ",
    "fr": "IRONAGE · NUTRITION",
    "de": "IRONAGE · ERNÄHRUNG",
    "pt": "IRONAGE · NUTRIÇÃO",
    "bg": "IRONAGE · ХРАНЕНЕ"
  },
  "Start strong. Fuel your body and drink water.": {
    "en": "Start strong. Fuel your body and drink water.",
    "es": "Empieza fuerte. Alimenta tu cuerpo y bebe agua.",
    "uk": "Почни сильно. Дай тілу енергію та пий воду.",
    "ru": "Начни сильно. Дай телу энергию и пей воду.",
    "fr": "Commence fort. Nourris ton corps et bois de l’eau.",
    "de": "Starte stark. Versorge deinen Körper und trink Wasser.",
    "pt": "Comece forte. Alimente seu corpo e beba água.",
    "bg": "Започни силно. Зареди тялото си и пий вода."
  },
  "Stay on plan. Check your food and hydration.": {
    "en": "Stay on plan. Check your food and hydration.",
    "es": "Sigue el plan. Revisa tu comida e hidratación.",
    "uk": "Тримайся плану. Перевір харчування та воду.",
    "ru": "Держись плана. Проверь питание и воду.",
    "fr": "Reste sur le plan. Vérifie ton alimentation et ton hydratation.",
    "de": "Bleib im Plan. Prüfe Ernährung und Flüssigkeit.",
    "pt": "Siga o plano. Confira sua alimentação e hidratação.",
    "bg": "Следвай плана. Провери храненето и хидратацията си."
  },
  "Finish the day disciplined. Hit your nutrition target.": {
    "en": "Finish the day disciplined. Hit your nutrition target.",
    "es": "Termina el día con disciplina. Cumple tu objetivo nutricional.",
    "uk": "Заверши день дисципліновано. Виконай ціль харчування.",
    "ru": "Заверши день дисциплинированно. Выполни цель по питанию.",
    "fr": "Termine la journée avec discipline. Atteins ton objectif nutritionnel.",
    "de": "Beende den Tag diszipliniert. Erreiche dein Ernährungsziel.",
    "pt": "Termine o dia com disciplina. Atinja sua meta nutricional.",
    "bg": "Завърши деня дисциплинирано. Постигни хранителната си цел."
  },
  "No excuses. Build the version of you that you came for.": {
    "en": "No excuses. Build the version of you that you came for.",
    "es": "Sin excusas. Construye la versión de ti que viniste a crear.",
    "uk": "Без виправдань. Будуй ту версію себе, заради якої ти прийшов.",
    "ru": "Без оправданий. Строй ту версию себя, ради которой ты пришёл.",
    "fr": "Pas d’excuses. Construis la version de toi que tu es venu chercher.",
    "de": "Keine Ausreden. Baue die Version von dir, für die du gekommen bist.",
    "pt": "Sem desculpas. Construa a versão de você que veio buscar.",
    "bg": "Без оправдания. Изгради версията на себе си, за която си дошъл."
  },
  "IRONAGE · WORKOUT COMPLETE": {
    "en": "IRONAGE · WORKOUT COMPLETE",
    "es": "IRONAGE · ENTRENAMIENTO COMPLETADO",
    "uk": "IRONAGE · ТРЕНУВАННЯ ЗАВЕРШЕНО",
    "ru": "IRONAGE · ТРЕНИРОВКА ЗАВЕРШЕНА",
    "fr": "IRONAGE · ENTRAÎNEMENT TERMINÉ",
    "de": "IRONAGE · TRAINING ABGESCHLOSSEN",
    "pt": "IRONAGE · TREINO CONCLUÍDO",
    "bg": "IRONAGE · ТРЕНИРОВКАТА Е ЗАВЪРШЕНА"
  },
  "IRONAGE · LEVEL UP": {
    "en": "IRONAGE · LEVEL UP",
    "es": "IRONAGE · SUBIDA DE NIVEL",
    "uk": "IRONAGE · НОВИЙ РІВЕНЬ",
    "ru": "IRONAGE · НОВЫЙ УРОВЕНЬ",
    "fr": "IRONAGE · NIVEAU SUPÉRIEUR",
    "de": "IRONAGE · LEVEL UP",
    "pt": "IRONAGE · NOVO NÍVEL",
    "bg": "IRONAGE · НОВО НИВО"
  },
  "IRONAGE · STREAK": {
    "en": "IRONAGE · STREAK",
    "es": "IRONAGE · RACHA",
    "uk": "IRONAGE · СЕРІЯ",
    "ru": "IRONAGE · СЕРИЯ",
    "fr": "IRONAGE · SÉRIE",
    "de": "IRONAGE · SERIE",
    "pt": "IRONAGE · SEQUÊNCIA",
    "bg": "IRONAGE · СЕРИЯ"
  },
  "Failed to load program": {
    "en": "Failed to load program",
    "es": "No se pudo cargar el programa",
    "uk": "Не вдалося завантажити програму",
    "ru": "Не удалось загрузить программу",
    "fr": "Impossible de charger le programme",
    "de": "Programm konnte nicht geladen werden",
    "pt": "Não foi possível carregar o programa",
    "bg": "Програмата не можа да бъде заредена"
  },
  "Failed to load clients": {
    "en": "Failed to load clients",
    "es": "No se pudieron cargar los clientes",
    "uk": "Не вдалося завантажити клієнтів",
    "ru": "Не удалось загрузить клиентов",
    "fr": "Impossible de charger les clients",
    "de": "Kunden konnten nicht geladen werden",
    "pt": "Não foi possível carregar clientes",
    "bg": "Клиентите не можаха да бъдат заредени"
  },
  "Failed to load client results": {
    "en": "Failed to load client results",
    "es": "No se pudieron cargar los resultados del cliente",
    "uk": "Не вдалося завантажити результати клієнта",
    "ru": "Не удалось загрузить результаты клиента",
    "fr": "Impossible de charger les résultats du client",
    "de": "Kundenergebnisse konnten nicht geladen werden",
    "pt": "Não foi possível carregar resultados do cliente",
    "bg": "Резултатите на клиента не можаха да бъдат заредени"
  },
  "Failed to load workouts": {
    "en": "Failed to load workouts",
    "es": "No se pudieron cargar los entrenamientos",
    "uk": "Не вдалося завантажити тренування",
    "ru": "Не удалось загрузить тренировки",
    "fr": "Impossible de charger les entraînements",
    "de": "Trainings konnten nicht geladen werden",
    "pt": "Não foi possível carregar treinos",
    "bg": "Тренировките не можаха да бъдат заредени"
  },
  "Failed to load programs": {
    "en": "Failed to load programs",
    "es": "No se pudieron cargar los programas",
    "uk": "Не вдалося завантажити програми",
    "ru": "Не удалось загрузить программы",
    "fr": "Impossible de charger les programmes",
    "de": "Programme konnten nicht geladen werden",
    "pt": "Não foi possível carregar programas",
    "bg": "Програмите не можаха да бъдат заредени"
  },
  "Program assignment failed": {
    "en": "Program assignment failed",
    "es": "Error al asignar el programa",
    "uk": "Не вдалося призначити програму",
    "ru": "Не удалось назначить программу",
    "fr": "Échec de l’attribution du programme",
    "de": "Programmzuweisung fehlgeschlagen",
    "pt": "Falha ao atribuir programa",
    "bg": "Назначаването на програмата е неуспешно"
  },
  "Failed to assign program": {
    "en": "Failed to assign program",
    "es": "No se pudo asignar el programa",
    "uk": "Не вдалося призначити програму",
    "ru": "Не удалось назначить программу",
    "fr": "Impossible d’attribuer le programme",
    "de": "Programm konnte nicht zugewiesen werden",
    "pt": "Não foi possível atribuir o programa",
    "bg": "Програмата не можа да бъде назначена"
  },
  "Failed to load exercises": {
    "en": "Failed to load exercises",
    "es": "No se pudieron cargar los ejercicios",
    "uk": "Не вдалося завантажити вправи",
    "ru": "Не удалось загрузить упражнения",
    "fr": "Impossible de charger les exercices",
    "de": "Übungen konnten nicht geladen werden",
    "pt": "Não foi possível carregar exercícios",
    "bg": "Упражненията не можаха да бъдат заредени"
  },
  "Failed to create workout": {
    "en": "Failed to create workout",
    "es": "No se pudo crear el entrenamiento",
    "uk": "Не вдалося створити тренування",
    "ru": "Не удалось создать тренировку",
    "fr": "Impossible de créer l’entraînement",
    "de": "Training konnte nicht erstellt werden",
    "pt": "Não foi possível criar o treino",
    "bg": "Тренировката не можа да бъде създадена"
  },
  "Workout was not created": {
    "en": "Workout was not created",
    "es": "El entrenamiento no fue creado",
    "uk": "Тренування не створено",
    "ru": "Тренировка не создана",
    "fr": "L’entraînement n’a pas été créé",
    "de": "Training wurde nicht erstellt",
    "pt": "O treino não foi criado",
    "bg": "Тренировката не беше създадена"
  },
  "Failed to create program": {
    "en": "Failed to create program",
    "es": "No se pudo crear el programa",
    "uk": "Не вдалося створити програму",
    "ru": "Не удалось создать программу",
    "fr": "Impossible de créer le programme",
    "de": "Programm konnte nicht erstellt werden",
    "pt": "Não foi possível criar o programa",
    "bg": "Програмата не можа да бъде създадена"
  },
  "Program was not created": {
    "en": "Program was not created",
    "es": "El programa no fue creado",
    "uk": "Програму не створено",
    "ru": "Программа не создана",
    "fr": "Le programme n’a pas été créé",
    "de": "Programm wurde nicht erstellt",
    "pt": "O programa não foi criado",
    "bg": "Програмата не беше създадена"
  }
};

const TEXT_ORIGINAL = new WeakMap<Text, string>();
const TEXT_LAST = new WeakMap<Text, string>();
const ATTR_ORIGINAL = new WeakMap<Element, Map<string, string>>();
const ATTR_LAST = new WeakMap<Element, Map<string, string>>();

export function getStoredLanguage(): RuntimeLanguage {
  if (typeof window === "undefined") {
    return "en";
  }

  try {
    const raw = localStorage.getItem("ironage_language");
    return RUNTIME_LANGUAGES.includes(raw as RuntimeLanguage)
      ? (raw as RuntimeLanguage)
      : "uk";
  } catch {
    return "uk";
  }
}

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function translateDynamic(
  source: string,
  language: RuntimeLanguage
): string | null {
  let match: RegExpMatchArray | null;

  match = source.match(/^(\d+)\s+EXERCISES$/i);
  if (match) {
    const word = RAW_TRANSLATIONS["EXERCISES"]?.[language] ?? "EXERCISES";
    return `${match[1]} ${word}`;
  }

  match = source.match(/^(\d+)\s+WORKOUTS$/i);
  if (match) {
    const word = RAW_TRANSLATIONS["WORKOUTS"]?.[language] ?? "WORKOUTS";
    return `${match[1]} ${word}`;
  }

  match = source.match(/^(\d+)\s+SETS$/i);
  if (match) {
    const word = RAW_TRANSLATIONS["SETS"]?.[language] ?? "SETS";
    return `${match[1]} ${word}`;
  }

  match = source.match(/^WEEK\s+(.+?)\s+·\s+DAY\s+(.+)$/i);
  if (match) {
    const week = RAW_TRANSLATIONS["WEEK"]?.[language] ?? "WEEK";
    const day = RAW_TRANSLATIONS["DAY"]?.[language] ?? "DAY";
    return `${week} ${match[1]} · ${day} ${match[2]}`;
  }

  match = source.match(/^WEEK\s+(.+)$/i);
  if (match) {
    const week = RAW_TRANSLATIONS["WEEK"]?.[language] ?? "WEEK";
    return `${week} ${match[1]}`;
  }

  match = source.match(/^DAY\s+(.+)$/i);
  if (match) {
    const day = RAW_TRANSLATIONS["DAY"]?.[language] ?? "DAY";
    return `${day} ${match[1]}`;
  }

  match = source.match(/^SETS\s+(.+)$/i);
  if (match) {
    const word = RAW_TRANSLATIONS["SETS"]?.[language] ?? "SETS";
    return `${word} ${match[1]}`;
  }

  match = source.match(/^REPS\s+(.+)$/i);
  if (match) {
    const word = RAW_TRANSLATIONS["REPS"]?.[language] ?? "REPS";
    return `${word} ${match[1]}`;
  }

  match = source.match(/^PROGRAM ASSIGNED TO\s+(.+)$/i);
  if (match) {
    const prefix: Entry = {
      en: "PROGRAM ASSIGNED TO",
      es: "PROGRAMA ASIGNADO A",
      uk: "ПРОГРАМУ ПРИЗНАЧЕНО",
      ru: "ПРОГРАММА НАЗНАЧЕНА",
      fr: "PROGRAMME ATTRIBUÉ À",
      de: "PROGRAMM ZUGEWIESEN AN",
      pt: "PROGRAMA ATRIBUÍDO A",
      bg: "ПРОГРАМАТА Е НАЗНАЧЕНА НА",
    };
    return `${prefix[language]} ${match[1]}`;
  }

  match = source.match(/^Delete\s+(.+)$/i);
  if (match) {
    const prefix: Entry = {
      en: "Delete",
      es: "Eliminar",
      uk: "Видалити",
      ru: "Удалить",
      fr: "Supprimer",
      de: "Löschen",
      pt: "Excluir",
      bg: "Изтрий",
    };
    return `${prefix[language]} ${match[1]}`;
  }

  return null;
}

export function canTranslateRaw(value: string): boolean {
  const source = normalize(value);
  if (!source) return false;
  return Boolean(
    RAW_TRANSLATIONS[source] ||
    translateDynamic(source, "en")
  );
}

export function translateRaw(
  value: string,
  language: RuntimeLanguage = getStoredLanguage()
): string {
  const source = normalize(value);
  if (!source) return value;

  const exact = RAW_TRANSLATIONS[source];
  if (exact) {
    return exact[language] ?? exact.en ?? source;
  }

  return translateDynamic(source, language) ?? source;
}

function preserveWhitespace(
  raw: string,
  translated: string
): string {
  const leading = raw.match(/^\s*/)?.[0] ?? "";
  const trailing = raw.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function translateTextNode(
  node: Text,
  language: RuntimeLanguage
): void {
  const current = node.nodeValue ?? "";
  const currentNormalized = normalize(current);
  if (!currentNormalized) return;

  let source = TEXT_ORIGINAL.get(node);
  const last = TEXT_LAST.get(node);

  if (!source) {
    if (!canTranslateRaw(current)) return;
    source = current;
    TEXT_ORIGINAL.set(node, source);
  } else if (
    last !== undefined &&
    current !== last &&
    canTranslateRaw(current)
  ) {
    source = current;
    TEXT_ORIGINAL.set(node, source);
  }

  const translated = preserveWhitespace(
    source,
    translateRaw(source, language)
  );

  if (current !== translated) {
    node.nodeValue = translated;
  }

  TEXT_LAST.set(node, translated);
}

const TRANSLATABLE_ATTRS = [
  "placeholder",
  "aria-label",
  "title",
] as const;

function translateElementAttributes(
  element: Element,
  language: RuntimeLanguage
): void {
  let originals = ATTR_ORIGINAL.get(element);
  let last = ATTR_LAST.get(element);

  if (!originals) {
    originals = new Map();
    ATTR_ORIGINAL.set(element, originals);
  }

  if (!last) {
    last = new Map();
    ATTR_LAST.set(element, last);
  }

  for (const attr of TRANSLATABLE_ATTRS) {
    const current = element.getAttribute(attr);
    if (!current) continue;

    let source = originals.get(attr);
    const previous = last.get(attr);

    if (!source) {
      if (!canTranslateRaw(current)) continue;
      source = current;
      originals.set(attr, source);
    } else if (
      previous !== undefined &&
      current !== previous &&
      canTranslateRaw(current)
    ) {
      source = current;
      originals.set(attr, source);
    }

    const translated = translateRaw(source, language);

    if (current !== translated) {
      element.setAttribute(attr, translated);
    }

    last.set(attr, translated);
  }
}

function localizeSubtree(
  root: Node,
  language: RuntimeLanguage
): void {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, language);
    return;
  }

  if (root.nodeType === Node.ELEMENT_NODE) {
    translateElementAttributes(root as Element, language);
  }

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
  );

  let current: Node | null = walker.currentNode;

  while (current) {
    if (current.nodeType === Node.TEXT_NODE) {
      translateTextNode(current as Text, language);
    } else if (current.nodeType === Node.ELEMENT_NODE) {
      translateElementAttributes(current as Element, language);
    }

    current = walker.nextNode();
  }
}

export function localizeDocument(
  language: RuntimeLanguage
): () => void {
  if (typeof document === "undefined") {
    return () => undefined;
  }

  const apply = () => {
    if (document.body) {
      localizeSubtree(document.body, language);
    }
  };

  apply();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        translateTextNode(
          mutation.target as Text,
          language
        );
      }

      if (mutation.type === "attributes") {
        const target = mutation.target;
        if (target instanceof Element) {
          translateElementAttributes(target, language);
        }
      }

      for (const node of Array.from(mutation.addedNodes)) {
        localizeSubtree(node, language);
      }
    }
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRS],
    });
  }

  return () => observer.disconnect();
}
