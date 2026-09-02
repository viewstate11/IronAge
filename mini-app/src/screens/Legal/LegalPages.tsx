import type {
  ReactNode,
} from "react";

type LegalPageProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

function LegalPage({
  title,
  updated,
  children,
}: LegalPageProps) {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#050505",
        color: "#ffffff",
        padding: "32px 20px 64px",
        boxSizing: "border-box",
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
            window.location.href = "/";
          }}
          style={{
            border: 0,
            background: "transparent",
            color: "#d4af37",
            padding: "0 0 28px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          ← BACK TO IRONAGE
        </button>

        <div
          style={{
            color: "#d4af37",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.18em",
            marginBottom: "10px",
          }}
        >
          IRONAGE
        </div>

        <h1
          style={{
            margin: "0 0 10px",
            fontSize: "clamp(34px, 8vw, 58px)",
            lineHeight: 1,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: "0 0 40px",
            color: "#8f8f8f",
            fontSize: "13px",
          }}
        >
          Last updated: {updated}
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
          {children}
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
          margin: "0 0 10px",
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

export function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="September 2, 2026"
    >
      <Section title="1. Acceptance of Terms">
        <p>
          By creating an account,
          accessing, or using IRONAGE,
          you agree to these Terms of
          Service and our Privacy Policy.
        </p>
      </Section>

      <Section title="2. IRONAGE Services">
        <p>
          IRONAGE provides fitness,
          workout, nutrition, progress
          tracking, coaching, and related
          digital features.
        </p>
      </Section>

      <Section title="3. Fitness and Health Disclaimer">
        <p>
          IRONAGE provides general
          fitness and informational
          content and is not a substitute
          for professional medical
          advice, diagnosis, or
          treatment.
        </p>

        <p>
          Consult an appropriate
          healthcare professional before
          beginning a new exercise or
          nutrition program when
          necessary for your
          circumstances.
        </p>
      </Section>

      <Section title="4. Accounts">
        <p>
          You are responsible for
          maintaining the security of
          your account and for providing
          accurate account information.
          You must not use another
          person's account without
          authorization.
        </p>
      </Section>

      <Section title="5. Coaches and Training Programs">
        <p>
          Coaches using IRONAGE are
          responsible for the programs,
          instructions, and services
          they provide to their clients.
          IRONAGE does not guarantee
          specific fitness or coaching
          results.
        </p>
      </Section>

      <Section title="6. Premium Services">
        <p>
          Certain features may require
          a paid subscription. Pricing,
          billing periods, renewal
          terms, and cancellation
          options will be presented
          before purchase.
        </p>
      </Section>

      <Section title="7. Acceptable Use">
        <p>
          You may not misuse IRONAGE,
          interfere with its operation,
          attempt unauthorized access,
          abuse other users, or use the
          service for unlawful
          activities.
        </p>
      </Section>

      <Section title="8. Intellectual Property">
        <p>
          The IRONAGE name, software,
          design, branding, and original
          platform content are protected
          by applicable intellectual
          property laws.
        </p>
      </Section>

      <Section title="9. Availability">
        <p>
          We may modify, update,
          suspend, or discontinue parts
          of IRONAGE as the service
          evolves. We do not guarantee
          uninterrupted availability.
        </p>
      </Section>

      <Section title="10. Limitation of Liability">
        <p>
          To the extent permitted by
          applicable law, IRONAGE is not
          responsible for indirect,
          incidental, or consequential
          losses arising from use of the
          service.
        </p>
      </Section>

      <Section title="11. Changes to These Terms">
        <p>
          These Terms may be updated as
          IRONAGE evolves. The current
          version and its effective date
          will be available on this
          page.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          Questions regarding these
          Terms can be submitted through
          the official IRONAGE support
          channels.
        </p>
      </Section>
    </LegalPage>
  );
}

export function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="September 2, 2026"
    >
      <Section title="1. Information We Collect">
        <p>
          Depending on how you use
          IRONAGE, we may process account
          information such as your name,
          email address, authentication
          information, profile details,
          workout activity, progress,
          nutrition information, and
          coaching-related data.
        </p>
      </Section>

      <Section title="2. Authentication">
        <p>
          IRONAGE may support multiple
          authentication methods,
          including email and supported
          third-party authentication
          providers.
        </p>

        <p>
          Passwords are not stored in
          plain text. Authentication
          credentials and sessions are
          protected using security
          controls appropriate to the
          authentication method.
        </p>
      </Section>

      <Section title="3. How We Use Information">
        <p>
          Information may be used to
          operate IRONAGE, authenticate
          users, provide workouts and
          coaching features, maintain
          progress history, personalize
          the experience, protect the
          service, and improve the
          platform.
        </p>
      </Section>

      <Section title="4. Coach and Client Data">
        <p>
          When a user chooses to connect
          with a coach, information
          necessary for coaching
          features may be shared between
          the connected client and coach
          according to the features and
          permissions provided by
          IRONAGE.
        </p>
      </Section>

      <Section title="5. Service Providers">
        <p>
          IRONAGE may use trusted
          infrastructure and service
          providers to operate features
          such as hosting, databases,
          authentication, email
          delivery, payments, analytics,
          and security.
        </p>
      </Section>

      <Section title="6. Data Security">
        <p>
          We use technical and
          organizational safeguards
          designed to protect user
          information. No internet
          service can guarantee absolute
          security.
        </p>
      </Section>

      <Section title="7. Data Retention">
        <p>
          Information is retained for as
          long as reasonably necessary
          to provide the service, comply
          with legal obligations,
          resolve disputes, and protect
          the platform.
        </p>
      </Section>

      <Section title="8. Your Choices and Rights">
        <p>
          Depending on applicable law,
          you may have rights regarding
          access, correction, deletion,
          restriction, portability, or
          objection to certain uses of
          your personal information.
        </p>
      </Section>

      <Section title="9. Children">
        <p>
          IRONAGE is not intended to
          knowingly collect personal
          information from children
          where parental consent or
          another legal basis is
          required by applicable law.
        </p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>
          We may update this Privacy
          Policy as IRONAGE evolves.
          The latest version and update
          date will be available on this
          page.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          Privacy questions and requests
          can be submitted through the
          official IRONAGE support
          channels.
        </p>
      </Section>
    </LegalPage>
  );
}
