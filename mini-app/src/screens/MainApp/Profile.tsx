import {
  useEffect,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

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

  onLogout?: () => void;

  [key: string]: any;
};

type CoachStatusResponse = {
  success?: boolean;

  coach?: {
    id: number;
    userId: number;

    displayName: string;

    isVerified: boolean;
    isActive: boolean;
  } | null;
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

    onLogout,
  } = props;

  const [
    isAdmin,
    setIsAdmin,
  ] = useState(false);

  const [
    isApprovedCoach,
    setIsApprovedCoach,
  ] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAccess() {
      try {
        const [
          adminResult,
          coachResult,
        ] =
          await Promise.allSettled([
            api.get<AdminStatusResponse>(
              "/admin/coaches/status",
              telegramAuthOptions()
            ),

            api.get<CoachStatusResponse>(
              "/coaches/me",
              telegramAuthOptions()
            ),
          ]);

        if (!mounted) {
          return;
        }

        if (
          adminResult.status ===
          "fulfilled"
        ) {
          setIsAdmin(
            adminResult.value
              ?.isAdmin === true
          );
        }

        if (
          coachResult.status ===
          "fulfilled"
        ) {
          const coach =
            coachResult.value
              ?.coach;

          setIsApprovedCoach(
            Boolean(
              coach &&
              coach.isVerified ===
                true &&
              coach.isActive ===
                true
            )
          );
        }
      } catch {
        //
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
              EDIT PROFILE
            </button>
          )}

        </section>


        <section className="iron-profile__section">
          <SectionTitle>
            MY TRAINING
          </SectionTitle>

          <MenuItem
            number="01"
            title="MY PROGRAM"
            subtitle="Current program, week and progress"
            onClick={
              openMyProgram
            }
          />

          <MenuItem
            number="02"
            title="PROGRESS"
            subtitle="Weight, measurements, photos and strength"
            onClick={
              onOpenProgress
            }
          />

          <MenuItem
            number="03"
            title="WORKOUT HISTORY"
            subtitle="Completed workouts and performance"
            onClick={
              openHistory
            }
          />
        </section>


        <section className="iron-profile__section">
          <SectionTitle>
            COACHING
          </SectionTitle>

          <MenuItem
            number="04"
            title="MY COACH"
            subtitle="Your active coach and coaching status"
            onClick={
              onOpenMyCoach
            }
          />

          <MenuItem
            number="05"
            title="FIND A COACH"
            subtitle="Browse verified IRONAGE coaches"
            onClick={
              onOpenFindCoach
            }
          />

          <MenuItem
            number="06"
            title="PROGRAMS"
            subtitle="Explore professional training programs"
            onClick={
              onOpenPrograms
            }
          />
        </section>


        <section className="iron-profile__section">
          <SectionTitle>
            ACCOUNT
          </SectionTitle>

          <MenuItem
            number="07"
            title="SUBSCRIPTION"
            subtitle="Plan, access and renewal"
            onClick={
              onOpenSubscription
            }
          />

          <MenuItem
            number="08"
            title="PAYMENTS"
            subtitle="Purchases, payments and receipts"
            onClick={
              onOpenPayments
            }
          />

          <MenuItem
            number="09"
            title="NOTIFICATIONS"
            subtitle="Workout, coach and account alerts"
            onClick={
              onOpenNotifications
            }
          />

          <MenuItem
            number="10"
            title="SETTINGS"
            subtitle="Language, privacy and account"
            onClick={
              onOpenSettings
            }
          />
        </section>


        {isApprovedCoach && (
          <section className="iron-profile__section">
            <SectionTitle>
              COACH TOOLS
            </SectionTitle>

            <MenuItem
              number="11"
              title="COACH SYSTEM"
              subtitle="Clients, check-ins and feedback"
              onClick={
                onOpenCoach
              }
            />

            <MenuItem
              number="12"
              title="MY COACH PROGRAMS"
              subtitle="Programs connected to your profile"
              onClick={
                onOpenCoachPrograms
              }
            />

            <MenuItem
              number="13"
              title="VIDEO REVIEWS"
              subtitle="Review client exercise technique"
              onClick={
                onOpenVideoReviews
              }
            />

            <MenuItem
              number="14"
              title="EARNINGS"
              subtitle="Revenue, commission and payouts"
              onClick={
                onOpenEarnings
              }
            />
          </section>
        )}


        {isAdmin && (
          <section className="iron-profile__section iron-profile__section--admin">
            <SectionTitle>
              IRONAGE ADMIN
            </SectionTitle>

            <MenuItem
              number="15"
              title="ADMIN PANEL"
              subtitle="IRONAGE Control Center"
              onClick={
                onOpenAdmin
              }
            />

            <MenuItem
              number="16"
              title="COACH MANAGEMENT"
              subtitle="Applications, approval and coach status"
              onClick={
                onOpenCoachManagement ||
                onOpenAdmin
              }
            />

            <MenuItem
              number="17"
              title="PROGRAM MANAGEMENT"
              subtitle="Review, approve and publish programs"
              onClick={
                onOpenProgramManagement ||
                onOpenAdmin
              }
            />

            <MenuItem
              number="18"
              title="USERS"
              subtitle="Manage IRONAGE users"
              onClick={
                onOpenUsers ||
                onOpenAdmin
              }
            />

            <MenuItem
              number="19"
              title="PAYMENTS & SUBSCRIPTIONS"
              subtitle="Revenue, subscriptions and transactions"
              onClick={
                onOpenPayments ||
                onOpenAdmin
              }
            />

            <MenuItem
              number="20"
              title="ANALYTICS"
              subtitle="Users, coaches, growth and revenue"
              onClick={
                onOpenAnalytics ||
                onOpenAdmin
              }
            />
          </section>
        )}


        <section className="iron-profile__section">
          <SectionTitle>
            SUPPORT
          </SectionTitle>

          <MenuItem
            number="21"
            title="HELP & SUPPORT"
            subtitle="IRONAGE assistance"
          />

          <MenuItem
            number="22"
            title="PRIVACY POLICY"
            subtitle="Your privacy and data"
          />

          <MenuItem
            number="23"
            title="TERMS & CONDITIONS"
            subtitle="IRONAGE terms of use"
          />

          <MenuItem
            number="24"
            title="DELETE ACCOUNT"
            subtitle="Permanently delete your account"
            danger
          />
        </section>


        <button
          type="button"
          className="iron-profile__logout"
          onClick={onLogout}
        >
          LOG OUT
          <span>
            →
          </span>
        </button>

      </div>
    </main>
  );
}
