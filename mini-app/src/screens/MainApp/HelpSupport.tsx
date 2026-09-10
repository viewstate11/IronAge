import {
  useMemo,
  useState,
} from "react";

import {
  useLanguage,
  type AppLanguage,
} from "../../context/LanguageContext";

import "./HelpSupport.css";

type Props = {
  onBack: () => void;
};

type FaqItem = {
  question: string;
  answer: string;
};

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;

  account: string;
  training: string;
  coach: string;
  payments: string;

  reportTitle: string;
  reportText: string;
  copyInfo: string;
  copied: string;

  contactTitle: string;
  contactText: string;

  faq: Record<
    "account" |
    "training" |
    "coach" |
    "payments",
    FaqItem[]
  >;
};

const COPY: Record<
  AppLanguage,
  Copy
> = {
  en: {
    eyebrow: "IRONAGE SUPPORT",
    title: "HELP & SUPPORT",
    subtitle:
      "ACCOUNT · TRAINING · COACHING · PAYMENTS",

    account: "ACCOUNT",
    training: "TRAINING",
    coach: "COACH",
    payments: "PAYMENTS",

    reportTitle:
      "REPORT A PROBLEM",
    reportText:
      "If something is not working, copy the technical information below and include it when contacting IRONAGE support.",
    copyInfo:
      "COPY TECHNICAL INFO",
    copied:
      "COPIED",

    contactTitle:
      "CONTACT SUPPORT",
    contactText:
      "The official IRONAGE support contact channel will appear here once it is configured.",

    faq: {
      account: [
        {
          question:
            "How do I edit my profile?",
          answer:
            "Open Profile and choose Edit Profile. You can update the supported account and fitness information there.",
        },
        {
          question:
            "How do I delete my account?",
          answer:
            "Open Profile and choose Delete Account. The app asks for confirmation before permanent deletion.",
        },
      ],

      training: [
        {
          question:
            "Where is my workout history?",
          answer:
            "Open Profile and choose Workout History to view completed workout sessions.",
        },
        {
          question:
            "Why is my progress not updating?",
          answer:
            "Complete the workout session fully and make sure the app has an internet connection before leaving the session.",
        },
      ],

      coach: [
        {
          question:
            "How do I find a coach?",
          answer:
            "Open Profile and choose Find Coach. Only active and verified coaches are shown.",
        },
        {
          question:
            "Where do video reviews go?",
          answer:
            "A submitted video review is sent to your currently assigned active and verified coach.",
        },
      ],

      payments: [
        {
          question:
            "Where can I see my payments?",
          answer:
            "Open Profile and choose Payments to view trusted Premium subscription and program purchase records.",
        },
        {
          question:
            "Why is a purchase missing?",
          answer:
            "Only purchases successfully verified by the payment provider are stored as trusted payment records.",
        },
      ],
    },
  },

  uk: {
    eyebrow: "IRONAGE SUPPORT",
    title: "ДОПОМОГА ТА ПІДТРИМКА",
    subtitle:
      "АКАУНТ · ТРЕНУВАННЯ · ТРЕНЕР · ПЛАТЕЖІ",

    account: "АКАУНТ",
    training: "ТРЕНУВАННЯ",
    coach: "ТРЕНЕР",
    payments: "ПЛАТЕЖІ",

    reportTitle:
      "ПОВІДОМИТИ ПРО ПРОБЛЕМУ",
    reportText:
      "Якщо щось не працює, скопіюй технічну інформацію нижче та додай її під час звернення до підтримки IRONAGE.",
    copyInfo:
      "СКОПІЮВАТИ ТЕХНІЧНІ ДАНІ",
    copied:
      "СКОПІЙОВАНО",

    contactTitle:
      "ЗВ’ЯЗОК З ПІДТРИМКОЮ",
    contactText:
      "Офіційний канал підтримки IRONAGE з’явиться тут після його налаштування.",

    faq: {
      account: [
        {
          question:
            "Як змінити дані профілю?",
          answer:
            "Відкрий Профіль → Редагувати профіль. Там можна змінити доступні дані акаунта та фітнес-профілю.",
        },
        {
          question:
            "Як видалити акаунт?",
          answer:
            "Відкрий Профіль → Видалити акаунт. Перед остаточним видаленням застосунок попросить підтвердження.",
        },
      ],

      training: [
        {
          question:
            "Де знаходиться історія тренувань?",
          answer:
            "Відкрий Профіль → Історія тренувань, щоб переглянути завершені тренування.",
        },
        {
          question:
            "Чому не оновився прогрес?",
          answer:
            "Повністю заверши тренування та переконайся, що є інтернет-з’єднання перед виходом із сесії.",
        },
      ],

      coach: [
        {
          question:
            "Як знайти тренера?",
          answer:
            "Відкрий Профіль → Знайти тренера. У списку показуються тільки активні та підтверджені тренери.",
        },
        {
          question:
            "Куди потрапляє відео на перевірку?",
          answer:
            "Відео надсилається твоєму поточному призначеному активному та підтвердженому тренеру.",
        },
      ],

      payments: [
        {
          question:
            "Де переглянути платежі?",
          answer:
            "Відкрий Профіль → Платежі. Там показуються перевірені Premium-підписки та покупки програм.",
        },
        {
          question:
            "Чому покупка не відображається?",
          answer:
            "У платіжній історії зберігаються лише покупки, які успішно підтверджені платіжним провайдером.",
        },
      ],
    },
  },

  ru: {
    eyebrow: "IRONAGE SUPPORT",
    title: "ПОМОЩЬ И ПОДДЕРЖКА",
    subtitle:
      "АККАУНТ · ТРЕНИРОВКИ · ТРЕНЕР · ПЛАТЕЖИ",

    account: "АККАУНТ",
    training: "ТРЕНИРОВКИ",
    coach: "ТРЕНЕР",
    payments: "ПЛАТЕЖИ",

    reportTitle:
      "СООБЩИТЬ О ПРОБЛЕМЕ",
    reportText:
      "Если что-то не работает, скопируйте техническую информацию ниже и добавьте её при обращении в поддержку IRONAGE.",
    copyInfo:
      "СКОПИРОВАТЬ ДАННЫЕ",
    copied:
      "СКОПИРОВАНО",

    contactTitle:
      "СВЯЗЬ С ПОДДЕРЖКОЙ",
    contactText:
      "Официальный канал поддержки IRONAGE появится здесь после настройки.",

    faq: {
      account: [
        {
          question:
            "Как изменить профиль?",
          answer:
            "Откройте Профиль → Редактировать профиль. Там можно изменить доступные данные аккаунта и фитнес-профиля.",
        },
        {
          question:
            "Как удалить аккаунт?",
          answer:
            "Откройте Профиль → Удалить аккаунт. Перед окончательным удалением приложение запросит подтверждение.",
        },
      ],

      training: [
        {
          question:
            "Где история тренировок?",
          answer:
            "Откройте Профиль → История тренировок для просмотра завершённых тренировок.",
        },
        {
          question:
            "Почему прогресс не обновился?",
          answer:
            "Полностью завершите тренировку и убедитесь в наличии интернет-соединения.",
        },
      ],

      coach: [
        {
          question:
            "Как найти тренера?",
          answer:
            "Откройте Профиль → Найти тренера. Показываются только активные и подтверждённые тренеры.",
        },
        {
          question:
            "Куда отправляется видео?",
          answer:
            "Видео отправляется вашему текущему активному и подтверждённому назначенному тренеру.",
        },
      ],

      payments: [
        {
          question:
            "Где мои платежи?",
          answer:
            "Откройте Профиль → Платежи для просмотра подтверждённых подписок Premium и покупок программ.",
        },
        {
          question:
            "Почему покупки нет?",
          answer:
            "Сохраняются только покупки, успешно подтверждённые платёжным провайдером.",
        },
      ],
    },
  },

  bg: {
    eyebrow: "IRONAGE SUPPORT",
    title: "ПОМОЩ И ПОДДРЪЖКА",
    subtitle:
      "АКАУНТ · ТРЕНИРОВКИ · ТРЕНЬОР · ПЛАЩАНИЯ",

    account: "АКАУНТ",
    training: "ТРЕНИРОВКИ",
    coach: "ТРЕНЬОР",
    payments: "ПЛАЩАНИЯ",

    reportTitle:
      "СЪОБЩИ ЗА ПРОБЛЕМ",
    reportText:
      "Ако нещо не работи, копирай техническата информация и я добави при контакт с поддръжката на IRONAGE.",
    copyInfo:
      "КОПИРАЙ ТЕХНИЧЕСКИТЕ ДАННИ",
    copied:
      "КОПИРАНО",

    contactTitle:
      "ВРЪЗКА С ПОДДРЪЖКАТА",
    contactText:
      "Официалният канал за поддръжка на IRONAGE ще се появи тук след настройване.",

    faq: {
      account: [
        {
          question:
            "Как да редактирам профила си?",
          answer:
            "Отвори Профил → Редактиране на профила и промени наличните данни.",
        },
        {
          question:
            "Как да изтрия акаунта си?",
          answer:
            "Отвори Профил → Изтриване на акаунта. Приложението ще поиска потвърждение.",
        },
      ],

      training: [
        {
          question:
            "Къде е историята на тренировките?",
          answer:
            "Отвори Профил → История на тренировките.",
        },
        {
          question:
            "Защо прогресът не се обнови?",
          answer:
            "Завърши тренировката напълно и провери интернет връзката.",
        },
      ],

      coach: [
        {
          question:
            "Как да намеря треньор?",
          answer:
            "Отвори Профил → Намери треньор. Показват се активни и потвърдени треньори.",
        },
        {
          question:
            "Къде се изпраща видеото?",
          answer:
            "Видеото се изпраща на текущия ти активен и потвърден треньор.",
        },
      ],

      payments: [
        {
          question:
            "Къде са плащанията ми?",
          answer:
            "Отвори Профил → Плащания за проверените Premium абонаменти и покупки.",
        },
        {
          question:
            "Защо липсва покупка?",
          answer:
            "Записват се само покупки, потвърдени успешно от платежния доставчик.",
        },
      ],
    },
  },

  es: {
    eyebrow: "IRONAGE SUPPORT",
    title: "AYUDA Y SOPORTE",
    subtitle:
      "CUENTA · ENTRENAMIENTO · COACH · PAGOS",
    account: "CUENTA",
    training: "ENTRENAMIENTO",
    coach: "COACH",
    payments: "PAGOS",
    reportTitle:
      "REPORTAR UN PROBLEMA",
    reportText:
      "Si algo no funciona, copia la información técnica y adjúntala al contactar con IRONAGE.",
    copyInfo:
      "COPIAR INFORMACIÓN",
    copied: "COPIADO",
    contactTitle:
      "CONTACTAR SOPORTE",
    contactText:
      "El canal oficial de soporte de IRONAGE aparecerá aquí cuando esté configurado.",
    faq: {
      account: [
        {
          question: "¿Cómo edito mi perfil?",
          answer:
            "Abre Perfil → Editar perfil para actualizar tus datos.",
        },
        {
          question: "¿Cómo elimino mi cuenta?",
          answer:
            "Abre Perfil → Eliminar cuenta y confirma la eliminación.",
        },
      ],
      training: [
        {
          question: "¿Dónde está mi historial?",
          answer:
            "Abre Perfil → Histórico de treinos.",
        },
        {
          question: "¿Por qué no se actualizó mi progreso?",
          answer:
            "Completa totalmente la sesión y comprueba tu conexión.",
        },
      ],
      coach: [
        {
          question: "¿Cómo encuentro un coach?",
          answer:
            "Abre Perfil → Buscar entrenador. Solo aparecen entrenadores activos y verificados.",
        },
        {
          question: "¿A dónde va mi vídeo?",
          answer:
            "Se envía a tu coach activo y verificado asignado actualmente.",
        },
      ],
      payments: [
        {
          question: "¿Dónde veo mis pagos?",
          answer:
            "Abre Perfil → Pagamentos.",
        },
        {
          question: "¿Por qué falta una compra?",
          answer:
            "Solo se guardan compras verificadas por el proveedor de pago.",
        },
      ],
    },
  },

  fr: {
    eyebrow: "IRONAGE SUPPORT",
    title: "AIDE & SUPPORT",
    subtitle:
      "COMPTE · ENTRAÎNEMENT · COACH · PAIEMENTS",
    account: "COMPTE",
    training: "ENTRAÎNEMENT",
    coach: "COACH",
    payments: "PAIEMENTS",
    reportTitle:
      "SIGNALER UN PROBLÈME",
    reportText:
      "Si quelque chose ne fonctionne pas, copiez les informations techniques et joignez-les à votre demande.",
    copyInfo:
      "COPIER LES INFORMATIONS",
    copied: "COPIÉ",
    contactTitle:
      "CONTACTER LE SUPPORT",
    contactText:
      "Le canal officiel du support IRONAGE apparaîtra ici une fois configuré.",
    faq: {
      account: [
        {
          question: "Comment modifier mon profil ?",
          answer:
            "Ouvrez Profil → Modifier le profil.",
        },
        {
          question: "Comment supprimer mon compte ?",
          answer:
            "Ouvrez Profil → Supprimer le compte et confirmez.",
        },
      ],
      training: [
        {
          question: "Où est mon historique ?",
          answer:
            "Ouvrez Profil → Historique des entraînements.",
        },
        {
          question: "Pourquoi ma progression ne change pas ?",
          answer:
            "Terminez complètement la séance et vérifiez votre connexion.",
        },
      ],
      coach: [
        {
          question: "Comment trouver un coach ?",
          answer:
            "Ouvrez Profil → Trouver un coach. Seuls les coachs actifs et vérifiés apparaissent.",
        },
        {
          question: "Où va ma vidéo ?",
          answer:
            "Elle est envoyée à votre coach actif et vérifié actuellement assigné.",
        },
      ],
      payments: [
        {
          question: "Où voir mes paiements ?",
          answer:
            "Ouvrez Profil → Paiements.",
        },
        {
          question: "Pourquoi un achat manque ?",
          answer:
            "Seuls les achats vérifiés par le fournisseur sont enregistrés.",
        },
      ],
    },
  },

  de: {
    eyebrow: "IRONAGE SUPPORT",
    title: "HILFE & SUPPORT",
    subtitle:
      "KONTO · TRAINING · COACH · ZAHLUNGEN",
    account: "KONTO",
    training: "TRAINING",
    coach: "COACH",
    payments: "ZAHLUNGEN",
    reportTitle:
      "PROBLEM MELDEN",
    reportText:
      "Wenn etwas nicht funktioniert, kopiere die technischen Informationen und füge sie deiner Support-Anfrage hinzu.",
    copyInfo:
      "TECHNISCHE INFOS KOPIEREN",
    copied: "KOPIERT",
    contactTitle:
      "SUPPORT KONTAKTIEREN",
    contactText:
      "Der offizielle IRONAGE-Supportkanal erscheint hier, sobald er eingerichtet ist.",
    faq: {
      account: [
        {
          question: "Wie bearbeite ich mein Profil?",
          answer:
            "Öffne Profil → Profil bearbeiten.",
        },
        {
          question: "Wie lösche ich mein Konto?",
          answer:
            "Öffne Profil → Konto löschen und bestätige.",
        },
      ],
      training: [
        {
          question: "Wo ist mein Trainingsverlauf?",
          answer:
            "Öffne Profil → Trainingsverlauf.",
        },
        {
          question: "Warum wurde mein Fortschritt nicht aktualisiert?",
          answer:
            "Beende die Trainingseinheit vollständig und prüfe die Internetverbindung.",
        },
      ],
      coach: [
        {
          question: "Wie finde ich einen Coach?",
          answer:
            "Öffne Profil → Coach finden. Nur aktive und verifizierte Coaches werden angezeigt.",
        },
        {
          question: "Wohin wird mein Video gesendet?",
          answer:
            "An deinen aktuell zugewiesenen aktiven und verifizierten Coach.",
        },
      ],
      payments: [
        {
          question: "Wo sehe ich meine Zahlungen?",
          answer:
            "Öffne Profil → Zahlungen.",
        },
        {
          question: "Warum fehlt ein Kauf?",
          answer:
            "Nur erfolgreich verifizierte Käufe werden gespeichert.",
        },
      ],
    },
  },

  pt: {
    eyebrow: "IRONAGE SUPPORT",
    title: "AJUDA E SUPORTE",
    subtitle:
      "CONTA · TREINO · TREINADOR · PAGAMENTOS",
    account: "CONTA",
    training: "TREINO",
    coach: "TREINADOR",
    payments: "PAGAMENTOS",
    reportTitle:
      "REPORTAR UM PROBLEMA",
    reportText:
      "Se algo não funcionar, copia as informações técnicas e inclui-as no contacto com o suporte.",
    copyInfo:
      "COPIAR INFORMAÇÕES",
    copied: "COPIADO",
    contactTitle:
      "CONTACTAR SUPORTE",
    contactText:
      "O canal oficial de suporte IRONAGE aparecerá aqui quando estiver configurado.",
    faq: {
      account: [
        {
          question: "Como edito o meu perfil?",
          answer:
            "Abre Perfil → Editar perfil.",
        },
        {
          question: "Como elimino a minha conta?",
          answer:
            "Abre Perfil → Eliminar conta e confirma.",
        },
      ],
      training: [
        {
          question: "Onde está o histórico?",
          answer:
            "Abre Perfil → Histórico de treinos.",
        },
        {
          question: "Porque não atualizou o progresso?",
          answer:
            "Conclui totalmente o treino e verifica a ligação à internet.",
        },
      ],
      coach: [
        {
          question: "Como encontro um treinador?",
          answer:
            "Abre Perfil → Encontrar treinador. Só aparecem treinadores ativos e verificados.",
        },
        {
          question: "Para onde vai o vídeo?",
          answer:
            "É enviado para o treinador ativo e verificado atualmente atribuído.",
        },
      ],
      payments: [
        {
          question: "Onde vejo os pagamentos?",
          answer:
            "Abre Perfil → Pagamentos.",
        },
        {
          question: "Porque falta uma compra?",
          answer:
            "Só são guardadas compras verificadas pelo fornecedor de pagamento.",
        },
      ],
    },
  },
};

type SectionKey =
  | "account"
  | "training"
  | "coach"
  | "payments";

export default function HelpSupport({
  onBack,
}: Props) {
  const {
    language,
    t,
  } = useLanguage();

  const copy =
    useMemo(
      () =>
        COPY[language],
      [language]
    );

  const [
    section,
    setSection,
  ] =
    useState<SectionKey>(
      "account"
    );

  const [
    openIndex,
    setOpenIndex,
  ] =
    useState<number | null>(
      null
    );

  const [
    copied,
    setCopied,
  ] =
    useState(false);

  const sections: Array<{
    key: SectionKey;
    label: string;
  }> = [
    {
      key: "account",
      label: copy.account,
    },
    {
      key: "training",
      label: copy.training,
    },
    {
      key: "coach",
      label: copy.coach,
    },
    {
      key: "payments",
      label: copy.payments,
    },
  ];

  async function copyTechnicalInfo() {
    const info = [
      "IRONAGE SUPPORT REPORT",
      `Time: ${new Date().toISOString()}`,
      `Language: ${language}`,
      `URL: ${window.location.href}`,
      `Platform: ${navigator.platform || "unknown"}`,
      `User Agent: ${navigator.userAgent}`,
      `Online: ${navigator.onLine}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(
        info
      );

      setCopied(true);

      window.setTimeout(
        () => {
          setCopied(false);
        },
        1800
      );
    } catch (error) {
      console.error(
        "IRONAGE SUPPORT COPY ERROR:",
        error
      );
    }
  }

  return (
    <main className="help-support">
      <div className="help-support__shell">
        <header className="help-support__header">
          <button
            type="button"
            className="help-support__back"
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

        <nav className="help-support__tabs">
          {sections.map(
            item => (
              <button
                key={item.key}
                type="button"
                className={
                  section ===
                  item.key
                    ? "help-support__tab help-support__tab--active"
                    : "help-support__tab"
                }
                onClick={() => {
                  setSection(
                    item.key
                  );
                  setOpenIndex(
                    null
                  );
                }}
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        <section className="help-support__faq">
          {copy.faq[
            section
          ].map(
            (
              item,
              index
            ) => (
              <article
                key={
                  item.question
                }
                className="help-support__faq-item"
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpenIndex(
                      current =>
                        current ===
                        index
                          ? null
                          : index
                    );
                  }}
                >
                  <span>
                    {
                      item.question
                    }
                  </span>

                  <strong>
                    {openIndex ===
                    index
                      ? "−"
                      : "+"}
                  </strong>
                </button>

                {openIndex ===
                  index && (
                  <p>
                    {
                      item.answer
                    }
                  </p>
                )}
              </article>
            )
          )}
        </section>

        <section className="help-support__report">
          <span>
            IRONAGE
          </span>

          <h2>
            {copy.reportTitle}
          </h2>

          <p>
            {copy.reportText}
          </p>

          <button
            type="button"
            onClick={() => {
              void copyTechnicalInfo();
            }}
          >
            {copied
              ? copy.copied
              : copy.copyInfo}
          </button>
        </section>

        <section className="help-support__contact">
          <span>
            SUPPORT
          </span>

          <h2>
            {copy.contactTitle}
          </h2>

          <p>
            {copy.contactText}
          </p>
        </section>
      </div>
    </main>
  );
}
