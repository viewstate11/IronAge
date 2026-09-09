import {
  useEffect,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import { useLanguage } from "../../context/LanguageContext";
import { useFeatureAccess } from "../../context/FeatureAccessContext";

import "./Profile.css";

type ProfileProps = {
  user?: any;

  onBack?: () => void;

  onOpenProgram?: () => void;
  onOpenMyProgram?: () => void;

  onOpenProgress?: () => void;
  onOpenHistory?: () => void;
  onOpenWorkoutHistory?: () => void;

  onOpenMyCoach?: () => void;
  onOpenFindCoach?: () => void;
  onOpenPrograms?: () => void;

  onOpenCoach?: () => void;
  onOpenCoachPrograms?: () => void;
  onOpenVideoReviews?: () => void;
  onOpenEarnings?: () => void;

  onOpenAdmin?: () => void;
  onOpenCoachManagement?: () => void;
  onOpenProgramManagement?: () => void;
  onOpenUsers?: () => void;
  onOpenPayments?: () => void;
  onOpenAnalytics?: () => void;

  onOpenSubscription?: () => void;
  onOpenNotifications?: () => void;
  onOpenSettings?: () => void;
  onOpenEditProfile?: () => void;

  onOpenHelpSupport?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTermsConditions?: () => void;
  onDeleteAccount?: () => void;

  onLogout?: () => void;

  [key: string]: any;
};

type AdminStatusResponse = {
  success?: boolean;
  isAdmin?: boolean;
};

type MenuItemProps = {
  number: string;
  title: string;
  subtitle: string;

  onClick?: () => void;

  danger?: boolean;
};

function MenuItem({
  number,
  title,
  subtitle,
  onClick,
  danger = false,
}: MenuItemProps) {
  return (
    <button
      type="button"
      className={[
        "profile-menu-item",
        danger
          ? "profile-menu-item--danger"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
    >
      <span className="profile-menu-item__number">
        {number}
      </span>

      <span className="profile-menu-item__content">
        <strong>
          {title}
        </strong>

        <small>
          {subtitle}
        </small>
      </span>

      <span className="profile-menu-item__arrow">
        →
      </span>
    </button>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="profile-section-title">
      {children}
    </div>
  );
}

export default function Profile(
  props: ProfileProps
) {
  const { t } = useLanguage();

  const {
    user,

    onBack,

    onOpenProgram,
    onOpenMyProgram,

    onOpenProgress,
    onOpenHistory,
    onOpenWorkoutHistory,

    onOpenMyCoach,
    onOpenFindCoach,
    onOpenPrograms,

    onOpenCoach,
    onOpenCoachPrograms,
    onOpenVideoReviews,
    onOpenEarnings,

    onOpenAdmin,
    onOpenCoachManagement,
    onOpenProgramManagement,
    onOpenUsers,
    onOpenPayments,
    onOpenAnalytics,

    onOpenSubscription,
    onOpenNotifications,
    onOpenSettings,
    onOpenEditProfile,

    onOpenHelpSupport,
    onOpenPrivacyPolicy,
    onOpenTermsConditions,
    onDeleteAccount,

    onLogout,
  } = props;

  const [
    isAdmin,
    setIsAdmin,
  ] = useState(false);

  const {
    isCoach,
  } = useFeatureAccess();

  useEffect(() => {
    let mounted = true;

    async function loadAccess() {
      try {
        const adminResult =
          await api.get<AdminStatusResponse>(
            "/admin/coaches/status",
            telegramAuthOptions()
          );

        if (!mounted) {
          return;
        }

        setIsAdmin(
          adminResult?.isAdmin === true
        );
      } catch {
        if (mounted) {
          setIsAdmin(false);
        }
      }
    }

    void loadAccess();

    return () => {
      mounted = false;
    };
  }, []);

  const firstName =
    user?.firstName ||
    user?.name ||
    "IRONAGE";

  const lastName =
    user?.lastName || "";

  const fullName =
    `${firstName} ${lastName}`
      .trim()
      .toUpperCase();

  const username =
    user?.username
      ? `@${user.username}`
      : user?.email ||
        "IRONAGE ATHLETE";

  const level =
    Number(
      user?.level ?? 1
    );

  const xp =
    Number(
      user?.xp ?? 0
    );

  const streak =
    Number(
      user?.streak ?? 0
    );

  const goal =
    String(
      user?.goal ||
      "BUILD YOUR BEST FORM"
    )
      .replace(/_/g, " ")
      .toUpperCase();

  const avatar =
    user?.photoUrl ||
    user?.photo ||
    user?.picture ||
    "";

  const openMyProgram =
    onOpenMyProgram ||
    onOpenProgram;

  const openHistory =
    onOpenWorkoutHistory ||
    onOpenHistory;

  return (
    <main className="iron-profile">
      <div className="iron-profile__shell">

        <header className="iron-profile__topbar">
          {onBack && (
            <button
              type="button"
              className="iron-profile__back"
              onClick={onBack}
              aria-label="Back"
            >
              ←
            </button>
          )}

          <div>
            <span>
              IRONAGE
            </span>

            <h1>
              PROFILE
            </h1>
          </div>
        </header>


        <section className="iron-profile__hero">

          <div className="iron-profile__avatar">
            {avatar ? (
              <img
                src={avatar}
                alt={fullName}
              />
            ) : (
              <span>
                {firstName
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div className="iron-profile__identity">
            <span>
              ATHLETE PROFILE
            </span>

            <h2>
              {fullName}
            </h2>

            <p>
              {username}
            </p>
          </div>

          <div className="iron-profile__stats">
            <div>
              <strong>
                {level}
              </strong>

              <span>
                LEVEL
              </span>
            </div>

            <div>
              <strong>
                {xp.toLocaleString()}
              </strong>

              <span>
                XP
              </span>
            </div>

            <div>
              <strong>
                {streak}
              </strong>

              <span>
                DAY STREAK
              </span>
            </div>
          </div>

          <div className="iron-profile__goal">
            <span>
              CURRENT GOAL
            </span>

            <strong>
              {goal}
            </strong>
          </div>

          {onOpenEditProfile && (
            <button
              type="button"
              className="iron-profile__edit"
              onClick={
                onOpenEditProfile
              }
            >
              {t("profile.editProfile")}
            </button>
          )}

        </section>


        <section className="iron-profile__section">
          <SectionTitle>
            {t("profile.myTraining")}
          </SectionTitle>

          <MenuItem
            number="01"
            title={t("profile.myProgram")}
            subtitle={t("profile.myProgramSubtitle")}
            onClick={
              openMyProgram
            }
          />

          <MenuItem
            number="02"
            title={t("profile.progress")}
            subtitle={t("profile.progressSubtitle")}
            onClick={
              onOpenProgress
            }
          />

          <MenuItem
            number="03"
            title={t("profile.workoutHistory")}
            subtitle={t("profile.workoutHistorySubtitle")}
            onClick={
              openHistory
            }
          />
        </section>


        <section className="iron-profile__section">
          <SectionTitle>
            {t("profile.coaching")}
          </SectionTitle>

          <MenuItem
            number="04"
            title={t("profile.myCoach")}
            subtitle={t("profile.myCoachSubtitle")}
            onClick={
              onOpenMyCoach
            }
          />

          <MenuItem
            number="05"
            title={t("profile.findCoach")}
            subtitle={t("profile.findCoachSubtitle")}
            onClick={
              onOpenFindCoach
            }
          />

          <MenuItem
            number="06"
            title={t("profile.programs")}
            subtitle={t("profile.programsSubtitle")}
            onClick={
              onOpenPrograms
            }
          />
        </section>


        <section className="iron-profile__section">
          <SectionTitle>
            {t("profile.account")}
          </SectionTitle>

          <MenuItem
            number="07"
            title={t("profile.subscription")}
            subtitle={t("profile.subscriptionSubtitle")}
            onClick={
              onOpenSubscription
            }
          />

          <MenuItem
            number="08"
            title={t("profile.payments")}
            subtitle={t("profile.paymentsSubtitle")}
            onClick={
              onOpenPayments
            }
          />

          <MenuItem
            number="09"
            title={t("profile.notifications")}
            subtitle={t("profile.notificationsSubtitle")}
            onClick={
              onOpenNotifications
            }
          />

          <MenuItem
            number="10"
            title={t("profile.settings")}
            subtitle={t("profile.settingsSubtitle")}
            onClick={
              onOpenSettings
            }
          />
        </section>


        {isCoach && (
          <section className="iron-profile__section">
            <SectionTitle>
              {t("profile.coachTools")}
            </SectionTitle>

            <MenuItem
              number="11"
              title={t("profile.coachSystem")}
              subtitle={t("profile.coachSystemSubtitle")}
              onClick={
                onOpenCoach
              }
            />

            <MenuItem
              number="12"
              title={t("profile.myCoachPrograms")}
              subtitle={t("profile.myCoachProgramsSubtitle")}
              onClick={
                onOpenCoachPrograms
              }
            />

            <MenuItem
              number="13"
              title={t("profile.videoReviews")}
              subtitle={t("profile.videoReviewsSubtitle")}
              onClick={
                onOpenVideoReviews
              }
            />

            <MenuItem
              number="14"
              title={t("profile.earnings")}
              subtitle={t("profile.earningsSubtitle")}
              onClick={
                onOpenEarnings
              }
            />
          </section>
        )}


        {isAdmin && (
          <section className="iron-profile__section iron-profile__section--admin">
            <SectionTitle>
              {t("profile.ironageAdmin")}
            </SectionTitle>

            <MenuItem
              number="15"
              title={t("profile.adminPanel")}
              subtitle={t("profile.adminPanelSubtitle")}
              onClick={
                onOpenAdmin
              }
            />

            <MenuItem
              number="16"
              title={t("profile.coachManagement")}
              subtitle={t("profile.coachManagementSubtitle")}
              onClick={
                onOpenCoachManagement ||
                onOpenAdmin
              }
            />

            <MenuItem
              number="17"
              title={t("profile.programManagement")}
              subtitle={t("profile.programManagementSubtitle")}
              onClick={
                onOpenProgramManagement ||
                onOpenAdmin
              }
            />

            <MenuItem
              number="18"
              title={t("profile.users")}
              subtitle={t("profile.usersSubtitle")}
              onClick={
                onOpenUsers ||
                onOpenAdmin
              }
            />

            <MenuItem
              number="19"
              title={t("profile.paymentsSubscriptions")}
              subtitle={t("profile.paymentsSubscriptionsSubtitle")}
              onClick={
                onOpenPayments ||
                onOpenAdmin
              }
            />

            <MenuItem
              number="20"
              title={t("profile.analytics")}
              subtitle={t("profile.analyticsSubtitle")}
              onClick={
                onOpenAnalytics ||
                onOpenAdmin
              }
            />
          </section>
        )}


        <section className="iron-profile__section">
          <SectionTitle>
            {t("profile.support")}
          </SectionTitle>

          <MenuItem
            number="21"
            title={t("profile.helpSupport")}
            subtitle={t("profile.helpSupportSubtitle")}
            onClick={
              onOpenHelpSupport
            }
          />

          <MenuItem
            number="22"
            title={t("profile.privacyPolicy")}
            subtitle={t("profile.privacyPolicySubtitle")}
            onClick={
              onOpenPrivacyPolicy
            }
          />

          <MenuItem
            number="23"
            title={t("profile.termsConditions")}
            subtitle={t("profile.termsConditionsSubtitle")}
            onClick={
              onOpenTermsConditions
            }
          />

          <MenuItem
            number="24"
            title={t("profile.deleteAccount")}
            subtitle={t("profile.deleteAccountSubtitle")}
            onClick={
              onDeleteAccount
            }
            danger
          />
        </section>


        <button
          type="button"
          className="iron-profile__logout"
          onClick={onLogout}
        >
          {t("profile.logout")}
          <span>
            →
          </span>
        </button>

      </div>
    </main>
  );
}
