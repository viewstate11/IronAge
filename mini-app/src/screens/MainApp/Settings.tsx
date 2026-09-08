import {
  useEffect,
  useState,
} from "react";

import {
  LANGUAGE_OPTIONS,
  useLanguage,
  type AppLanguage,
} from "../../context/LanguageContext";

import "./Settings.css";

type Props = {
  onBack: () => void;
  onOpenEditProfile: () => void;
  onOpenNotifications: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
};

type SettingsState = {
  haptics: boolean;
  sounds: boolean;
  autoStart: boolean;
};

const SETTINGS_KEY =
  "ironage_app_settings";

const defaultSettings: SettingsState = {
  haptics: true,
  sounds: true,
  autoStart: false,
};

function loadSettings(): SettingsState {
  try {
    const raw =
      localStorage.getItem(
        SETTINGS_KEY
      );

    if (!raw) {
      return defaultSettings;
    }

    const parsed =
      JSON.parse(raw) as
        Partial<SettingsState>;

    return {
      haptics:
        typeof parsed.haptics ===
        "boolean"
          ? parsed.haptics
          : defaultSettings.haptics,

      sounds:
        typeof parsed.sounds ===
        "boolean"
          ? parsed.sounds
          : defaultSettings.sounds,

      autoStart:
        typeof parsed.autoStart ===
        "boolean"
          ? parsed.autoStart
          : defaultSettings.autoStart,
    };
  } catch {
    return defaultSettings;
  }
}

function saveSettings(
  settings: SettingsState
) {
  try {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );
  } catch {
    // Storage may be unavailable.
  }
}

export default function Settings({
  onBack,
  onOpenEditProfile,
  onOpenNotifications,
  onOpenPrivacy,
  onOpenTerms,
}: Props) {
  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  const [
    settings,
    setSettings,
  ] = useState<SettingsState>(
    loadSettings
  );

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  function toggle(
    key: keyof SettingsState
  ) {
    setSettings(
      current => ({
        ...current,
        [key]:
          !current[key],
      })
    );
  }

  return (
    <main className="settings-screen">
      <div className="settings-screen__shell">

        <header className="settings-screen__header">
          <button
            type="button"
            className="settings-screen__back"
            onClick={onBack}
            aria-label={t("common.back")}
          >
            ←
          </button>

          <div>
            <span>
              IRONAGE
            </span>

            <h1>
              {t("settings.title")}
            </h1>

            <p>
              {t("settings.subtitle")}
            </p>
          </div>
        </header>

        <section className="settings-screen__hero">
          <span>
            {t("settings.appControl")}
          </span>

          <h2>
            {t("settings.yourApp")}
            {" "}
            <strong>
              {t("settings.yourRules")}
            </strong>
          </h2>

          <p>
            {t("settings.description")}
          </p>
        </section>

        <section className="settings-screen__section">
          <div className="settings-screen__section-title">
            01 · {t("settings.language")}
          </div>

          <div className="settings-screen__languages">
            {LANGUAGE_OPTIONS.map(
              option => {
                const active =
                  language === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={
                      active
                        ? "settings-screen__language settings-screen__language--active"
                        : "settings-screen__language"
                    }
                    onClick={() => {
                      setLanguage(
                        option.id as AppLanguage
                      );
                    }}
                  >
                    <span>
                      {option.flag}
                    </span>

                    <strong>
                      {option.label}
                    </strong>

                    <b>
                      {active
                        ? "✓"
                        : "→"}
                    </b>
                  </button>
                );
              }
            )}
          </div>
        </section>

        <section className="settings-screen__section">
          <div className="settings-screen__section-title">
            02 · {t("settings.appControl")}
          </div>

          <button
            type="button"
            className="settings-screen__toggle"
            onClick={() => {
              toggle("haptics");
            }}
          >
            <div>
              <strong>
                {t("settings.haptics")}
              </strong>

              <span>
                {t(
                  "settings.hapticsDescription"
                )}
              </span>
            </div>

            <span
              className={
                settings.haptics
                  ? "settings-screen__switch settings-screen__switch--on"
                  : "settings-screen__switch"
              }
              aria-hidden="true"
            >
              <i />
            </span>
          </button>

          <button
            type="button"
            className="settings-screen__toggle"
            onClick={() => {
              toggle("sounds");
            }}
          >
            <div>
              <strong>
                {t("settings.sounds")}
              </strong>

              <span>
                {t(
                  "settings.soundsDescription"
                )}
              </span>
            </div>

            <span
              className={
                settings.sounds
                  ? "settings-screen__switch settings-screen__switch--on"
                  : "settings-screen__switch"
              }
              aria-hidden="true"
            >
              <i />
            </span>
          </button>

          <button
            type="button"
            className="settings-screen__toggle"
            onClick={() => {
              toggle("autoStart");
            }}
          >
            <div>
              <strong>
                {t("settings.autoStart")}
              </strong>

              <span>
                {t(
                  "settings.autoStartDescription"
                )}
              </span>
            </div>

            <span
              className={
                settings.autoStart
                  ? "settings-screen__switch settings-screen__switch--on"
                  : "settings-screen__switch"
              }
              aria-hidden="true"
            >
              <i />
            </span>
          </button>
        </section>

        <section className="settings-screen__section">
          <div className="settings-screen__section-title">
            03 · {t("profile.account")}
          </div>

          <button
            type="button"
            className="settings-screen__link"
            onClick={onOpenEditProfile}
          >
            <div>
              <strong>
                {t(
                  "profile.editProfile"
                )}
              </strong>

              <span>
                {t(
                  "profile.settingsSubtitle"
                )}
              </span>
            </div>

            <b>→</b>
          </button>

          <button
            type="button"
            className="settings-screen__link"
            onClick={
              onOpenNotifications
            }
          >
            <div>
              <strong>
                {t(
                  "profile.notifications"
                )}
              </strong>

              <span>
                {t(
                  "profile.notificationsSubtitle"
                )}
              </span>
            </div>

            <b>→</b>
          </button>

          <button
            type="button"
            className="settings-screen__link"
            onClick={onOpenPrivacy}
          >
            <div>
              <strong>
                {t(
                  "profile.privacyPolicy"
                )}
              </strong>

              <span>
                {t(
                  "profile.privacyPolicySubtitle"
                )}
              </span>
            </div>

            <b>→</b>
          </button>

          <button
            type="button"
            className="settings-screen__link"
            onClick={onOpenTerms}
          >
            <div>
              <strong>
                {t(
                  "profile.termsConditions"
                )}
              </strong>

              <span>
                {t(
                  "profile.termsConditionsSubtitle"
                )}
              </span>
            </div>

            <b>→</b>
          </button>
        </section>

      </div>
    </main>
  );
}
