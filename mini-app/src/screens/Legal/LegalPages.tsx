import type {
  ReactNode,
} from "react";

import {
  useLanguage,
  type AppLanguage,
} from "../../context/LanguageContext";

import {
  translateRaw,
  type RuntimeLanguage,
} from "../../i18n/runtimeTranslator";

type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalPageProps = {
  title: string;
  updated: Date;
  sections: LegalSection[];
  onBack?: () => void;
};

const LOCALES:
  Record<
    AppLanguage,
    string
  > = {
    en: "en-US",
    es: "es-ES",
    uk: "uk-UA",
    ru: "ru-RU",
    fr: "fr-FR",
    de: "de-DE",
    pt: "pt-PT",
    bg: "bg-BG",
  };

const TERMS_UPDATED =
  new Date(
    "2026-09-02T00:00:00"
  );

const PRIVACY_UPDATED =
  new Date(
    "2026-09-02T00:00:00"
  );

const TERMS_SECTIONS:
  LegalSection[] = [
    {
      title:
        "1. Acceptance of Terms",
      paragraphs: [
        "By creating an account, accessing, or using IRONAGE, you agree to these Terms of Service and our Privacy Policy.",
      ],
    },

    {
      title:
        "2. IRONAGE Services",
      paragraphs: [
        "IRONAGE provides fitness, workout, nutrition, progress tracking, coaching, and related digital features.",
      ],
    },

    {
      title:
        "3. Fitness and Health Disclaimer",
      paragraphs: [
        "IRONAGE provides general fitness and informational content and is not a substitute for professional medical advice, diagnosis, or treatment.",

        "Consult an appropriate healthcare professional before beginning a new exercise or nutrition program when necessary for your circumstances.",
      ],
    },

    {
      title:
        "4. Accounts",
      paragraphs: [
        "You are responsible for maintaining the security of your account and for providing accurate account information. You must not use another person's account without authorization.",
      ],
    },

    {
      title:
        "5. Coaches and Training Programs",
      paragraphs: [
        "Coaches using IRONAGE are responsible for the programs, instructions, and services they provide to their clients. IRONAGE does not guarantee specific fitness or coaching results.",
      ],
    },

    {
      title:
        "6. Premium Services",
      paragraphs: [
        "Certain features may require a paid subscription. Pricing, billing periods, renewal terms, and cancellation options will be presented before purchase.",
      ],
    },

    {
      title:
        "7. Acceptable Use",
      paragraphs: [
        "You may not misuse IRONAGE, interfere with its operation, attempt unauthorized access, abuse other users, or use the service for unlawful activities.",
      ],
    },

    {
      title:
        "8. Intellectual Property",
      paragraphs: [
        "The IRONAGE name, software, design, branding, and original platform content are protected by applicable intellectual property laws.",
      ],
    },

    {
      title:
        "9. Availability",
      paragraphs: [
        "We may modify, update, suspend, or discontinue parts of IRONAGE as the service evolves. We do not guarantee uninterrupted availability.",
      ],
    },

    {
      title:
        "10. Limitation of Liability",
      paragraphs: [
        "To the extent permitted by applicable law, IRONAGE is not responsible for indirect, incidental, or consequential losses arising from use of the service.",
      ],
    },

    {
      title:
        "11. Changes to These Terms",
      paragraphs: [
        "These Terms may be updated as IRONAGE evolves. The current version and its effective date will be available on this page.",
      ],
    },

    {
      title:
        "12. Contact",
      paragraphs: [
        "Questions regarding these Terms can be submitted through the official IRONAGE support channels.",
      ],
    },
  ];

const PRIVACY_SECTIONS:
  LegalSection[] = [
    {
      title:
        "1. Information We Collect",

      /*
       * This source intentionally matches
       * the existing runtime dictionary key.
       */
      paragraphs: [
        "Depending on how you use IRONAGE, we may process account information such as your name, email address,authentication information, profile details, workout activity, progress, nutrition information, and coaching-related data.",
      ],
    },

    {
      title:
        "2. Authentication",
      paragraphs: [
        "IRONAGE may support multiple authentication methods, including email and supported third-party authentication providers.",

        "Passwords are not stored in plain text. Authentication credentials and sessions are protected using security controls appropriate to the authentication method.",
      ],
    },

    {
      title:
        "3. How We Use Information",
      paragraphs: [
        "Information may be used to operate IRONAGE, authenticate users, provide workouts and coaching features, maintain progress history, personalize the experience, protect the service, and improve the platform.",
      ],
    },

    {
      title:
        "4. Coach and Client Data",

      /*
       * Matches existing runtime key.
       */
      paragraphs: [
        "When a user chooses to connect with a coach, information necessary for coaching features may be sharedbetween the connected client and coach according to the features and permissions provided by IRONAGE.",
      ],
    },

    {
      title:
        "5. Service Providers",
      paragraphs: [
        "IRONAGE may use trusted infrastructure and service providers to operate features such as hosting, databases, authentication, email delivery, payments, analytics, and security.",
      ],
    },

    {
      title:
        "6. Data Security",
      paragraphs: [
        "We use technical and organizational safeguards designed to protect user information. No internet service can guarantee absolute security.",
      ],
    },

    {
      title:
        "7. Data Retention",
      paragraphs: [
        "Information is retained for as long as reasonably necessary to provide the service, comply with legal obligations, resolve disputes, and protect the platform.",
      ],
    },

    {
      title:
        "8. Your Choices and Rights",
      paragraphs: [
        "Depending on applicable law, you may have rights regarding access, correction, deletion, restriction, portability, or objection to certain uses of your personal information.",
      ],
    },

    {
      title:
        "9. Children",

      /*
       * Matches existing runtime key.
       */
      paragraphs: [
        "IRONAGE is not intended to knowingly collect personal information from children where parental consentor another legal basis is required by applicable law.",
      ],
    },

    {
      title:
        "10. Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy as IRONAGE evolves. The latest version and update date will be available on this page.",
      ],
    },

    {
      title:
        "11. Contact",
      paragraphs: [
        "Privacy questions and requests can be submitted through the official IRONAGE support channels.",
      ],
    },
  ];

function LegalPage({
  title,
  updated,
  sections,
  onBack,
}: LegalPageProps) {
  const {
    language,
    t,
  } = useLanguage();

  const runtimeLanguage =
    language as RuntimeLanguage;

  const tr = (
    value: string
  ) =>
    translateRaw(
      value,
      runtimeLanguage
    );

  const formattedDate =
    new Intl.DateTimeFormat(
      LOCALES[language],
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    ).format(updated);

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#050505",
        color: "#ffffff",
        padding:
          "32px 20px 64px",
        boxSizing:
          "border-box",
      }}
    >
      <article
        style={{
          width: "100%",
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (onBack) {
              onBack();
              return;
            }

            window.location.href =
              "/";
          }}
          aria-label={
            t("common.back")
          }
          style={{
            border: 0,
            background:
              "transparent",
            color: "#d4af37",
            padding:
              "0 0 28px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          ← {t("common.back")}
        </button>

        <div
          style={{
            color: "#d4af37",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing:
              "0.18em",
            marginBottom:
              "10px",
          }}
        >
          IRONAGE
        </div>

        <h1
          style={{
            margin:
              "0 0 10px",
            fontSize:
              "clamp(34px, 8vw, 58px)",
            lineHeight: 1,
          }}
        >
          {tr(title)}
        </h1>

        <p
          style={{
            margin:
              "0 0 40px",
            color: "#8f8f8f",
            fontSize: "13px",
          }}
        >
          {tr(
            "Last updated:"
          )}{" "}
          {formattedDate}
        </p>

        <div
          style={{
            display: "grid",
            gap: "30px",
            color: "#d6d6d6",
            fontSize: "15px",
            lineHeight: 1.7,
          }}
        >
          {sections.map(
            section => (
              <Section
                key={
                  section.title
                }
                title={tr(
                  section.title
                )}
              >
                {section.paragraphs.map(
                  paragraph => (
                    <p
                      key={
                        paragraph
                      }
                    >
                      {tr(
                        paragraph
                      )}
                    </p>
                  )
                )}
              </Section>
            )
          )}
        </div>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2
        style={{
          margin:
            "0 0 10px",
          color: "#ffffff",
          fontSize: "20px",
        }}
      >
        {title}
      </h2>

      <div>
        {children}
      </div>
    </section>
  );
}

export function TermsPage({
  onBack,
}: {
  onBack?: () => void;
} = {}) {
  return (
    <LegalPage
      title="Terms of Service"
      updated={TERMS_UPDATED}
      sections={
        TERMS_SECTIONS
      }
      onBack={onBack}
    />
  );
}

export function PrivacyPage({
  onBack,
}: {
  onBack?: () => void;
} = {}) {
  return (
    <LegalPage
      title="Privacy Policy"
      updated={
        PRIVACY_UPDATED
      }
      sections={
        PRIVACY_SECTIONS
      }
      onBack={onBack}
    />
  );
}
