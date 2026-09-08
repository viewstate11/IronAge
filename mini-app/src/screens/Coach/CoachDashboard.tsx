import {
  useEffect,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import CreateWorkout from "./CreateWorkout";
import CreateProgram from "./CreateProgram";

import { useLanguage } from "../../context/LanguageContext";

import "./CoachDashboard.css";

type Props = {
  onBack: () => void;
  onEditProfile?: () => void;
};

type CoachView =
  | "dashboard"
  | "clients"
  | "workouts"
  | "create-workout"
  | "programs"
  | "create-program"
  | "assign-program"
  | "client-results";

type CoachClient = {
  relationshipId: number;
  assignedAt: string;

  client: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    age: number | null;
    gender: string | null;
    weight: number | null;
    height: number | null;
    goal: string | null;
    level: number;
    xp: number;
    workouts: number;
    streak: number;
  };
};

type CoachClientsResponse = {
  success: boolean;
  clients: CoachClient[];
};

type CoachClientWorkoutSet = {
  id: number;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  repetitions: number | null;
  weight: number | null;
  duration: number | null;
  completed: boolean;
};

type CoachClientWorkout = {
  id: number;
  workoutId: string;
  workoutName: string;
  duration: number;
  xp: number;
  status: string;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  sets: CoachClientWorkoutSet[];
};

type CoachClientProgress = {
  id: number;
  userId: number;
  weight: number | null;
  bodyFat: number | null;
  muscleMass: number | null;
  note: string | null;
  createdAt: string;
};

type CoachProgramAdherenceWorkout = {
  programWorkoutId: number;
  workoutId: number;
  workoutName: string;
  week: number | null;
  day: number | null;
  position: number;
  status: "COMPLETED" | "PENDING";
  completedAt: string | null;
  workoutSessionId: number | null;
};

type CoachProgramAdherence = {
  assignmentId: number;
  programId: number;
  programName: string;
  startDate: string | null;
  endDate: string | null;
  totalWorkouts: number;
  completedWorkouts: number;
  percentage: number;
  lastCompletedAt: string | null;
  workouts: CoachProgramAdherenceWorkout[];
};

type CoachClientResultsResponse = {
  success: boolean;
  client: CoachClient["client"];
  workouts: CoachClientWorkout[];
  progress: CoachClientProgress[];
  adherence: CoachProgramAdherence | null;
};

type CoachWorkoutExercise = {
  id: number;
  exerciseId: number;
  position: number;
  sets: number | null;
  repetitions: number | null;
  minRepetitions: number | null;
  maxRepetitions: number | null;
  duration: number | null;
  restSeconds: number | null;
  targetWeight: number | null;
  tempo: string | null;
  coachNotes: string | null;
  coachVideoUrl: string | null;

  exercise: {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    instructions: string | null;
    muscleGroup: string | null;
    equipment: string | null;
    demoVideoUrl: string | null;
    thumbnailUrl: string | null;
  };
};

type CoachWorkout = {
  id: number;
  coachId: number;
  name: string;
  description: string | null;
  duration: number | null;
  difficulty: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  exercises: CoachWorkoutExercise[];
};

type CoachWorkoutsResponse = {
  success: boolean;
  workouts: CoachWorkout[];
};

type CoachProgramWorkout = {
  id: number;
  programId: number;
  workoutId: number;
  week: number | null;
  day: number | null;
  position: number;
  workout: CoachWorkout;
};

type CoachProgramStatus =
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "ARCHIVED";

type CoachProgram = {
  id: number;
  coachId: number;
  name: string;
  description: string | null;
  durationWeeks: number | null;

  status: CoachProgramStatus;
  isPublished: boolean;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  workouts: CoachProgramWorkout[];
};

type CoachProgramsResponse = {
  success: boolean;
  programs: CoachProgram[];
};

function formatGoal(
  goal: string | null,
  noGoalLabel: string
): string {
  if (!goal) {
    return noGoalLabel;
  }

  return goal
    .replace(/_/g, " ");
}

function getClientName(
  client: CoachClient["client"],
  athleteLabel: string
): string {
  const name = [
    client.firstName,
    client.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (name) {
    return name;
  }

  if (client.username) {
    return `@${client.username}`;
  }

  return `${athleteLabel} #${client.id}`;
}

export default function CoachDashboard({
  onBack,
  onEditProfile,
 }: Props) {
  const { language, t } = useLanguage();

  const locale = {
    en: "en-GB",
    es: "es-ES",
    uk: "uk-UA",
    ru: "ru-RU",
    fr: "fr-FR",
    de: "de-DE",
    pt: "pt-PT",
    bg: "bg-BG",
  }[language];

  const programStatusLabel = (
    status: CoachProgramStatus
  ) => {
    switch (status) {
      case "DRAFT":
        return t("coachDashboard.draft");
      case "REVIEW":
        return t("coachDashboard.review");
      case "APPROVED":
        return t("coachDashboard.approved");
      case "PUBLISHED":
        return t("coachDashboard.published");
      case "ARCHIVED":
        return t("coachDashboard.archived");
    }
  };

  const adherenceStatusLabel = (
    status: "COMPLETED" | "PENDING"
  ) =>
    status === "COMPLETED"
      ? t("coachDashboard.completed")
      : t("coachDashboard.pending");

  const [view, setView] =
    useState<CoachView>(
      "dashboard"
    );

  const [clients, setClients] =
    useState<CoachClient[]>([]);

  const [loadingClients, setLoadingClients] =
    useState(false);

  const [clientsError, setClientsError] =
    useState<string | null>(
      null
    );

  const [selectedClient, setSelectedClient] =
    useState<CoachClient | null>(null);

  const [clientResults, setClientResults] =
    useState<CoachClientWorkout[]>([]);

  const [clientProgress, setClientProgress] =
    useState<CoachClientProgress[]>([]);

  const [clientAdherence, setClientAdherence] =
    useState<CoachProgramAdherence | null>(
      null
    );

  const [
    loadingClientResults,
    setLoadingClientResults,
  ] = useState(false);

  const [
    clientResultsError,
    setClientResultsError,
  ] = useState<string | null>(null);

  const [workouts, setWorkouts] =
    useState<CoachWorkout[]>([]);

  const [loadingWorkouts, setLoadingWorkouts] =
    useState(false);

  const [workoutsError, setWorkoutsError] =
    useState<string | null>(
      null
    );

  const [programs, setPrograms] =
    useState<CoachProgram[]>([]);

  const [loadingPrograms, setLoadingPrograms] =
    useState(false);

  const [programsError, setProgramsError] =
    useState<string | null>(
      null
    );

  const [selectedProgram, setSelectedProgram] =
    useState<CoachProgram | null>(null);

  const [assigningClientId, setAssigningClientId] =
    useState<number | null>(null);

  const [assignError, setAssignError] =
    useState<string | null>(null);

  const [assignSuccess, setAssignSuccess] =
    useState<string | null>(null);

  const [
    submittingProgramId,
    setSubmittingProgramId,
  ] = useState<number | null>(
    null
  );

  const [
    programReviewError,
    setProgramReviewError,
  ] = useState<{
    programId: number;
    message: string;
  } | null>(
    null
  );

  async function submitProgramForReview(
    programId: number
  ) {
    try {
      setSubmittingProgramId(
        programId
      );

      setProgramReviewError(
        null
      );

      const response =
        await api.post<{
          success: boolean;
          program: CoachProgram;
        }>(
          `/coach-programs/${programId}/submit`,
          {},
          telegramAuthOptions()
        );

      if (
        !response ||
        response.success !== true ||
        !response.program
      ) {
        throw new Error(
          "Program submission failed"
        );
      }

      setPrograms(current =>
        current.map(program =>
          program.id === programId
            ? {
                ...program,
                ...response.program,
              }
            : program
        )
      );
    } catch (error) {
      console.error(
        "IRONAGE PROGRAM REVIEW SUBMIT ERROR:",
        error
      );

      setProgramReviewError({
        programId,
        message:
          error instanceof Error
            ? error.message
            : t("coachDashboard.failedSubmit"),
      });
    } finally {
      setSubmittingProgramId(
        null
      );
    }
  }

  async function assignProgram(
    client: CoachClient
  ) {
    if (!selectedProgram) {
      return;
    }

    try {
      setAssigningClientId(
        client.client.id
      );
      setAssignError(null);
      setAssignSuccess(null);

      const response =
        await api.post<{
          success: boolean;
        }>(
          `/coach-programs/${selectedProgram.id}/assign`,
          {
            clientId:
              client.client.id,
          },
          telegramAuthOptions()
        );

      if (!response?.success) {
        throw new Error(
          "Program assignment failed"
        );
      }

      setAssignSuccess(
        `${selectedProgram.name} assigned to ${getClientName(
          client.client,
          t("coachDashboard.athlete")
        )}`
      );
    } catch (error) {
      console.error(
        "IRONAGE PROGRAM ASSIGN UI ERROR:",
        error
      );

      setAssignError(
        error instanceof Error
          ? error.message
          : t("coachDashboard.failedAssign")
      );
    } finally {
      setAssigningClientId(null);
    }
  }

  async function loadClients() {
    try {
      setLoadingClients(true);
      setClientsError(null);

      const response =
        await api.get<CoachClientsResponse>(
          "/coaches/clients",
          telegramAuthOptions()
        );

      if (
        !response ||
        !Array.isArray(
          response.clients
        )
      ) {
        throw new Error(
          "Invalid coach clients response"
        );
      }

      setClients(
        response.clients
      );
    } catch (error) {
      console.error(
        "IRONAGE COACH CLIENTS UI ERROR:",
        error
      );

      setClientsError(
        error instanceof Error
          ? error.message
          : t("coachDashboard.failedClients")
      );
    } finally {
      setLoadingClients(false);
    }
  }

  async function loadClientResults(
    client: CoachClient
  ) {
    try {
      setSelectedClient(client);
      setLoadingClientResults(true);
      setClientResultsError(null);
      setClientResults([]);
      setClientProgress([]);
      setClientAdherence(null);
      setView("client-results");

      const response =
        await api.get<CoachClientResultsResponse>(
          `/coaches/clients/${client.client.id}/results`,
          telegramAuthOptions()
        );

      if (
        !response ||
        !Array.isArray(response.workouts) ||
        !Array.isArray(response.progress)
      ) {
        throw new Error(
          "Invalid client results response"
        );
      }

      setClientResults(
        response.workouts
      );

      setClientProgress(
        response.progress
      );

      setClientAdherence(
        response.adherence ?? null
      );
    } catch (error) {
      console.error(
        "IRONAGE COACH CLIENT RESULTS UI ERROR:",
        error
      );

      setClientResultsError(
        error instanceof Error
          ? error.message
          : t("coachDashboard.failedResults")
      );
    } finally {
      setLoadingClientResults(false);
    }
  }

  async function loadWorkouts() {
    try {
      setLoadingWorkouts(true);
      setWorkoutsError(null);

      const response =
        await api.get<CoachWorkoutsResponse>(
          "/coach-workouts",
          telegramAuthOptions()
        );

      if (
        !response ||
        !Array.isArray(
          response.workouts
        )
      ) {
        throw new Error(
          "Invalid coach workouts response"
        );
      }

      setWorkouts(
        response.workouts
      );
    } catch (error) {
      console.error(
        "IRONAGE COACH WORKOUTS UI ERROR:",
        error
      );

      setWorkoutsError(
        error instanceof Error
          ? error.message
          : t("coachDashboard.failedWorkouts")
      );
    } finally {
      setLoadingWorkouts(false);
    }
  }

  async function loadPrograms() {
    try {
      setLoadingPrograms(true);
      setProgramsError(null);

      const response =
        await api.get<CoachProgramsResponse>(
          "/coach-programs",
          telegramAuthOptions()
        );

      if (
        !response ||
        !Array.isArray(response.programs)
      ) {
        throw new Error(
          "Invalid coach programs response"
        );
      }

      setPrograms(response.programs);
    } catch (error) {
      console.error(
        "IRONAGE COACH PROGRAMS UI ERROR:",
        error
      );

      setProgramsError(
        error instanceof Error
          ? error.message
          : t("coachDashboard.failedPrograms")
      );
    } finally {
      setLoadingPrograms(false);
    }
  }

  useEffect(() => {
    if (view === "clients") {
      void loadClients();
    }

    if (view === "workouts") {
      void loadWorkouts();
    }

    if (view === "programs") {
      void loadPrograms();
    }

    if (view === "assign-program") {
      void loadClients();
    }
  }, [view]);

  if (
    view === "client-results" &&
    selectedClient
  ) {
    const client =
      selectedClient.client;

    return (
      <main className="coach-dashboard">
        <div className="coach-dashboard__content">
          <header className="coach-dashboard__header">
            <button
              type="button"
              className="coach-dashboard__back"
              onClick={() => {
                setSelectedClient(null);
                setClientResults([]);
                setClientProgress([]);
                setClientAdherence(null);
                setClientResultsError(null);
                setView("clients");
              }}
              aria-label={t("coachDashboard.backClients")}
            >
              ←
            </button>

            <div>
              <span>
                {t("coachDashboard.athletePerformance")}
              </span>

              <h1>
                {t("coachDashboard.clientResults")}
              </h1>

              <p>
                {t("coachDashboard.workoutHistory")}
              </p>
            </div>
          </header>

          <section className="coach-client-results__athlete">
            <span>
              {t("coachDashboard.athlete")} #{client.id}
            </span>

            <h2>
              {getClientName(client, t("coachDashboard.athlete"))}
            </h2>

            <p>
              {formatGoal(client.goal, t("coachDashboard.noGoal"))}
              {" · "}
              {t("coachDashboard.level")} {client.level}
            </p>

            <div>
              <section>
                <strong>
                  {client.workouts}
                </strong>
                <span>
                  {t("coachDashboard.workouts")}
                </span>
              </section>

              <section>
                <strong>
                  {client.xp}
                </strong>
                <span>XP</span>
              </section>

              <section>
                <strong>
                  {client.streak}
                </strong>
                <span>{t("coachDashboard.streak")}</span>
              </section>
            </div>
          </section>

          {loadingClientResults && (
            <section className="coach-clients-state">
              <span>
                IRONAGE COACH
              </span>

              <strong>
                {t("coachDashboard.loadingResults")}
              </strong>
            </section>
          )}

          {!loadingClientResults &&
            clientResultsError && (
              <section className="coach-clients-state coach-clients-state--error">
                <span>
                  {t("coachDashboard.resultsError")}
                </span>

                <strong>
                  {clientResultsError}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    void loadClientResults(
                      selectedClient
                    )
                  }
                >
                  RETRY
                </button>
              </section>
            )}

          {!loadingClientResults &&
            !clientResultsError &&
            clientProgress.length > 0 && (
              <section className="coach-progress-card">
                <div className="coach-progress-card__header">
                  <div>
                    <span>
                      {t("coachDashboard.currentProgress")}
                    </span>

                    <strong>
                      {new Date(
                        clientProgress[0].createdAt
                      ).toLocaleDateString(locale)}
                    </strong>
                  </div>
                </div>

                <div className="coach-progress-grid">
                  <div>
                    <strong>
                      {clientProgress[0].weight ?? "—"}
                    </strong>
                    <span>{t("coachDashboard.weight")}</span>
                  </div>

                  <div>
                    <strong>
                      {clientProgress[0].bodyFat ?? "—"}
                    </strong>
                    <span>{t("coachDashboard.bodyFat")}</span>
                  </div>

                  <div>
                    <strong>
                      {clientProgress[0].muscleMass ?? "—"}
                    </strong>
                    <span>{t("coachDashboard.muscleMass")}</span>
                  </div>
                </div>

                {clientProgress[0].note && (
                  <p className="coach-progress-card__note">
                    {clientProgress[0].note}
                  </p>
                )}
              </section>
            )}

          {!loadingClientResults &&
            !clientResultsError &&
            clientAdherence && (
              <section className="coach-adherence-card">
                <div className="coach-adherence-card__header">
                  <div>
                    <span>
                      {t("coachDashboard.programAdherence")}
                    </span>

                    <strong>
                      {clientAdherence.programName}
                    </strong>
                  </div>

                  <b>
                    {clientAdherence.percentage}%
                  </b>
                </div>

                <div className="coach-adherence-card__summary">
                  <strong>
                    {clientAdherence.completedWorkouts}
                    {" / "}
                    {clientAdherence.totalWorkouts}
                  </strong>

                  <span>
                    {t("coachDashboard.workoutsCompleted")}
                  </span>
                </div>

                <div
                  className="coach-adherence-card__progress"
                  aria-label={`Program adherence ${clientAdherence.percentage}%`}
                >
                  <div
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          clientAdherence.percentage
                        )
                      )}%`,
                    }}
                  />
                </div>

                <div className="coach-adherence-card__workouts">
                  {clientAdherence.workouts.map(
                    (item) => (
                      <article
                        key={item.programWorkoutId}
                        className={`coach-adherence-workout coach-adherence-workout--${item.status.toLowerCase()}`}
                      >
                        <div>
                          <span>
                            {item.week
                              ? `${t("coachDashboard.week")} ${item.week}`
                              : t("coachDashboard.program")}
                            {item.day
                              ? ` · ${t("coachDashboard.day")} ${item.day}`
                              : ""}
                          </span>

                          <strong>
                            {item.workoutName}
                          </strong>
                        </div>

                        <b>
                          {adherenceStatusLabel(item.status)}
                        </b>
                      </article>
                    )
                  )}
                </div>

                <footer className="coach-adherence-card__footer">
                  <span>
                    {t("coachDashboard.lastCompleted")}
                  </span>

                  <strong>
                    {clientAdherence.lastCompletedAt
                      ? new Date(
                          clientAdherence.lastCompletedAt
                        ).toLocaleString()
                      : "—"}
                  </strong>
                </footer>
              </section>
            )}

          {!loadingClientResults &&
            !clientResultsError &&
            clientResults.length === 0 && (
              <section className="coach-clients-state">
                <span>
                  {t("coachDashboard.workoutHistory")}
                </span>

                <strong>
                  {t("coachDashboard.noResults")}
                </strong>

                <p>
                  {t("coachDashboard.resultsEmpty")}
                </p>
              </section>
            )}

          {!loadingClientResults &&
            !clientResultsError &&
            clientResults.length > 0 && (
              <section className="coach-client-results__list">
                {clientResults.map(
                  (workout) => (
                    <article
                      key={workout.id}
                      className="coach-client-result"
                    >
                      <header>
                        <div>
                          <span>
                            {workout.status}
                          </span>

                          <h3>
                            {workout.workoutName}
                          </h3>

                          <small>
                            {new Date(
                              workout.completedAt ||
                                workout.createdAt
                            ).toLocaleString(locale)}
                          </small>
                        </div>

                        <section>
                          <strong>
                            +{workout.xp}
                          </strong>
                          <span>XP</span>
                        </section>
                      </header>

                      <div className="coach-client-result__meta">
                        <span>
                          {workout.duration} {t("coachDashboard.sec")}
                        </span>

                        <span>
                          {workout.sets.length} {t("coachDashboard.sets")}
                        </span>
                      </div>

                      <div className="coach-client-result__sets">
                        {workout.sets.map(
                          (set) => (
                            <div key={set.id}>
                              <section>
                                <strong>
                                  {set.exerciseName}
                                </strong>

                                <small>
                                  {t("coachDashboard.set")} {set.setNumber}
                                </small>
                              </section>

                              <section>
                                <b>
                                  {set.repetitions ??
                                    "—"}
                                </b>
                                <span>
                                  {t("coachDashboard.reps")}
                                </span>
                              </section>

                              <section>
                                <b>
                                  {set.weight ??
                                    "—"}
                                </b>
                                <span>
                                  KG
                                </span>
                              </section>
                            </div>
                          )
                        )}
                      </div>
                    </article>
                  )
                )}
              </section>
            )}
        </div>
      </main>
    );
  }

  if (
    view === "assign-program" &&
    selectedProgram
  ) {
    return (
      <main className="coach-dashboard">
        <div className="coach-dashboard__content">

          <header className="coach-dashboard__header">
            <button
              type="button"
              className="coach-dashboard__back"
              onClick={() => {
                setAssignError(null);
                setAssignSuccess(null);
                setView("programs");
              }}
              aria-label={t("coachDashboard.backPrograms")}
            >
              ←
            </button>

            <div>
              <span>
                {t("coachDashboard.assignment")}
              </span>

              <h1>
                {t("coachDashboard.assignProgram")}
              </h1>

              <p>
                {t("coachDashboard.selectAthlete")}
              </p>
            </div>
          </header>

          <section className="coach-assign-program__program">
            <span>
              {t("coachDashboard.selectedProgram")}
            </span>

            <strong>
              {selectedProgram.name}
            </strong>

            <small>
              {selectedProgram.durationWeeks
                ? `${selectedProgram.durationWeeks} ${t("coachDashboard.weeks")}`
                : t("coachDashboard.customDuration")}
              {" · "}
              {selectedProgram.workouts.length} {t("coachDashboard.workouts")}
            </small>
          </section>

          {loadingClients && (
            <section className="coach-clients-state">
              <span>
                IRONAGE COACH
              </span>

              <strong>
                {t("coachDashboard.loadingClients")}
              </strong>
            </section>
          )}

          {!loadingClients &&
            clientsError && (
              <section className="coach-clients-state coach-clients-state--error">
                <span>
                  {t("coachDashboard.connectionError")}
                </span>

                <strong>
                  {clientsError}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    void loadClients()
                  }
                >
                  RETRY
                </button>
              </section>
            )}

          {!loadingClients &&
            !clientsError &&
            clients.length === 0 && (
              <section className="coach-clients-state">
                <span>
                  {t("coachDashboard.clientRoster")}
                </span>

                <strong>
                  {t("coachDashboard.noClients")}
                </strong>

                <p>
                  {t("coachDashboard.inviteBeforeAssign")}
                </p>
              </section>
            )}

          {assignError && (
            <section className="coach-assign-program__message coach-assign-program__message--error">
              {assignError}
            </section>
          )}

          {assignSuccess && (
            <section className="coach-assign-program__message coach-assign-program__message--success">
              <strong>
                {t("coachDashboard.programAssigned")}
              </strong>

              <span>
                {assignSuccess}
              </span>

              <button
                type="button"
                onClick={() => {
                  setAssignSuccess(null);
                  setView("programs");
                }}
              >
                {t("coachDashboard.backPrograms")}
              </button>
            </section>
          )}

          {!loadingClients &&
            !clientsError &&
            !assignSuccess &&
            clients.length > 0 && (
              <section className="coach-assign-program__clients">
                {clients.map(
                  (client) => (
                    <button
                      key={client.relationshipId}
                      type="button"
                      className="coach-assign-client"
                      disabled={
                        assigningClientId !== null
                      }
                      onClick={() =>
                        void assignProgram(
                          client
                        )
                      }
                    >
                      <div>
                        <span>
                          {t("coachDashboard.athlete")} #{client.client.id}
                        </span>

                        <strong>
                          {getClientName(
                            client.client,
                            t("coachDashboard.athlete")
                          )}
                        </strong>

                        <small>
                          {formatGoal(
                            client.client.goal,
                            t("coachDashboard.noGoal")
                          )}
                          {" · "}
                          {t("coachDashboard.level")} {client.client.level}
                        </small>
                      </div>

                      <b>
                        {assigningClientId ===
                        client.client.id
                          ? "..."
                          : `${t("coachDashboard.assign")} →`}
                      </b>
                    </button>
                  )
                )}
              </section>
            )}

        </div>
      </main>
    );
  }

  if (view === "create-program") {
    return (
      <CreateProgram
        onBack={() =>
          setView("programs")
        }
        onCreated={() =>
          setView("programs")
        }
      />
    );
  }

  if (view === "programs") {
    return (
      <main className="coach-dashboard">
        <div className="coach-dashboard__content">

          <header className="coach-dashboard__header">
            <button
              type="button"
              className="coach-dashboard__back"
              onClick={() =>
                setView("dashboard")
              }
              aria-label={t("common.back")}
            >
              ←
            </button>

            <div>
              <span>
                {t("coachDashboard.controlCenter")}
              </span>

              <h1>
                {t("coachDashboard.myPrograms")}
              </h1>

              <p>
                {t("coachDashboard.trainingSystems")}
              </p>
            </div>
          </header>

          <button
            type="button"
            className="coach-programs-create"
            onClick={() =>
              setView("create-program")
            }
          >
            <span>
              {t("coachDashboard.createProgram")}
            </span>

            <b>→</b>
          </button>

          <section className="coach-clients-summary">
            <div>
              <span>
                {t("coachDashboard.activePrograms")}
              </span>

              <strong>
                {programs.length}
              </strong>
            </div>

            <div>
              <span>
                {t("coachDashboard.workoutsUsed")}
              </span>

              <strong>
                {programs.reduce(
                  (total, program) =>
                    total +
                    program.workouts.length,
                  0
                )}
              </strong>
            </div>
          </section>

          {loadingPrograms && (
            <section className="coach-clients-state">
              <span>
                IRONAGE COACH
              </span>

              <strong>
                {t("coachDashboard.loadingPrograms")}
              </strong>
            </section>
          )}

          {!loadingPrograms &&
            programsError && (
              <section className="coach-clients-state coach-clients-state--error">
                <span>
                  {t("coachDashboard.connectionError")}
                </span>

                <strong>
                  {programsError}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    void loadPrograms()
                  }
                >
                  RETRY
                </button>
              </section>
            )}

          {!loadingPrograms &&
            !programsError &&
            programs.length === 0 && (
              <section className="coach-clients-state">
                <span>
                  {t("coachDashboard.programLibrary")}
                </span>

                <strong>
                  {t("coachDashboard.noPrograms")}
                </strong>

                <p>
                  {t("coachDashboard.programsEmpty")}
                </p>
              </section>
            )}

          {!loadingPrograms &&
            !programsError &&
            programs.length > 0 && (
              <section className="coach-programs-list">
                {programs.map(
                  (program) => (
                    <article
                      key={program.id}
                      className="coach-program-card"
                    >
                      <div className="coach-program-card__header">
                        <div>
                          <span>
                            {t("coachDashboard.programNumber")} #{program.id}
                          </span>

                          <strong>
                            {program.name}
                          </strong>
                        </div>

                        <b>
                          {program.durationWeeks
                            ? `${program.durationWeeks} ${t("coachDashboard.weeks")}`
                            : "—"}
                        </b>
                      </div>

                      {program.description && (
                        <p className="coach-program-card__description">
                          {program.description}
                        </p>
                      )}

                      <div className="coach-program-card__meta">
                        <span>
                          {program.workouts.length} {t("coachDashboard.workouts")}
                        </span>
                      </div>

                      {program.workouts.length > 0 && (
                        <div className="coach-program-card__workouts">
                          {program.workouts.map(
                            (item) => (
                              <div
                                key={item.id}
                                className="coach-program-workout"
                              >
                                <div>
                                  <span>
                                    {item.week
                                      ? `${t("coachDashboard.week")} ${item.week}`
                                      : `${t("coachDashboard.week")} —`}

                                    {" · "}

                                    {item.day
                                      ? `${t("coachDashboard.day")} ${item.day}`
                                      : `${t("coachDashboard.day")} —`}
                                  </span>

                                  <strong>
                                    {item.workout.name}
                                  </strong>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      <div className="coach-program-review">
                        <div className="coach-program-review__status">
                          <span>
                            {t("coachDashboard.ironageStatus")}
                          </span>

                          <strong
                            className={`coach-program-review__badge coach-program-review__badge--${program.status.toLowerCase()}`}
                          >
                            {programStatusLabel(program.status)}
                          </strong>
                        </div>

                        {programReviewError?.programId ===
                          program.id && (
                          <div className="coach-program-review__error">
                            {
                              programReviewError.message
                            }
                          </div>
                        )}

                        {program.status ===
                          "DRAFT" && (
                          <button
                            type="button"
                            className="coach-program-review__submit"
                            disabled={
                              submittingProgramId ===
                              program.id
                            }
                            onClick={() =>
                              void submitProgramForReview(
                                program.id
                              )
                            }
                          >
                            <span>
                              {submittingProgramId ===
                              program.id
                                ? t("coachDashboard.submitting")
                                : t("coachDashboard.submitReview")}
                            </span>

                            <b>→</b>
                          </button>
                        )}

                        {program.status ===
                          "REVIEW" && (
                          <div className="coach-program-review__message">
                            {t("coachDashboard.waitApproval")}
                          </div>
                        )}

                        {program.status ===
                          "APPROVED" && (
                          <div className="coach-program-review__message">
                            {t("coachDashboard.waitPublication")}
                          </div>
                        )}

                        {program.status ===
                          "PUBLISHED" && (
                          <div className="coach-program-review__message coach-program-review__message--live">
                            {t("coachDashboard.liveMarketplace")}
                          </div>
                        )}

                        {program.status ===
                          "ARCHIVED" && (
                          <div className="coach-program-review__message">
                            {t("coachDashboard.programArchived")}
                          </div>
                        )}
                      </div>

                      {program.status ===
                        "PUBLISHED" &&
                        program.isPublished && (
                        <button
                          type="button"
                          className="coach-program-card__assign"
                          onClick={() => {
                            setSelectedProgram(
                              program
                            );
                            setAssignError(
                              null
                            );
                            setAssignSuccess(
                              null
                            );
                            setView(
                              "assign-program"
                            );
                          }}
                        >
                          <span>
                            {t("coachDashboard.assignProgram")}
                          </span>

                          <b>→</b>
                        </button>
                      )}
                    </article>
                  )
                )}
              </section>
            )}

        </div>
      </main>
    );
  }

  if (view === "create-workout") {
    return (
      <CreateWorkout
        onBack={() =>
          setView("workouts")
        }
        onCreated={() =>
          setView("workouts")
        }
      />
    );
  }

  if (view === "workouts") {
    return (
      <main className="coach-dashboard">
        <div className="coach-dashboard__content">

          <header className="coach-dashboard__header">
            <button
              type="button"
              className="coach-dashboard__back"
              onClick={() =>
                setView("dashboard")
              }
              aria-label={t("common.back")}
            >
              ←
            </button>

            <div>
              <span>
                {t("coachDashboard.controlCenter")}
              </span>

              <h1>
                {t("coachDashboard.myWorkouts")}
              </h1>

              <p>
                {t("coachDashboard.trainingLibrary")}
              </p>
            </div>
          </header>

          <button
            type="button"
            className="coach-workouts-create"
            onClick={() =>
              setView("create-workout")
            }
          >
            <span>
              {t("coachDashboard.createWorkout")}
            </span>

            <b>→</b>
          </button>

          <section className="coach-clients-summary">
            <div>
              <span>
                {t("coachDashboard.activeWorkouts")}
              </span>

              <strong>
                {workouts.length}
              </strong>
            </div>

            <div>
              <span>
                {t("coachDashboard.exercisesUsed")}
              </span>

              <strong>
                {workouts.reduce(
                  (total, workout) =>
                    total +
                    workout.exercises.length,
                  0
                )}
              </strong>
            </div>
          </section>

          {loadingWorkouts && (
            <section className="coach-clients-state">
              <span>
                IRONAGE COACH
              </span>

              <strong>
                {t("coachDashboard.loadingWorkouts")}
              </strong>
            </section>
          )}

          {!loadingWorkouts &&
            workoutsError && (
              <section className="coach-clients-state coach-clients-state--error">
                <span>
                  {t("coachDashboard.connectionError")}
                </span>

                <strong>
                  {workoutsError}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    void loadWorkouts()
                  }
                >
                  RETRY
                </button>
              </section>
            )}

          {!loadingWorkouts &&
            !workoutsError &&
            workouts.length === 0 && (
              <section className="coach-clients-state">
                <span>
                  {t("coachDashboard.trainingLibrary")}
                </span>

                <strong>
                  {t("coachDashboard.noWorkouts")}
                </strong>

                <p>
                  {t("coachDashboard.workoutsEmpty")}
                </p>
              </section>
            )}

          {!loadingWorkouts &&
            !workoutsError &&
            workouts.length > 0 && (
              <section className="coach-workouts-list">
                {workouts.map(
                  (workout) => (
                    <article
                      key={workout.id}
                      className="coach-workout-card"
                    >
                      <div className="coach-workout-card__header">
                        <div>
                          <span>
                            {t("coachDashboard.workoutNumber")} #{workout.id}
                          </span>

                          <strong>
                            {workout.name}
                          </strong>

                          <small>
                            {workout.difficulty ||
                              t("coachDashboard.standard")}
                          </small>
                        </div>

                        <b>
                          {workout.duration
                            ? `${workout.duration} ${t("coachDashboard.min")}`
                            : "—"}
                        </b>
                      </div>

                      {workout.description && (
                        <p className="coach-workout-card__description">
                          {workout.description}
                        </p>
                      )}

                      <div className="coach-workout-card__exercises">
                        {workout.exercises.map(
                          (item) => (
                            <div
                              key={item.id}
                              className="coach-workout-exercise"
                            >
                              <span>
                                {String(
                                  item.position
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </span>

                              <div>
                                <strong>
                                  {item.exercise.name}
                                </strong>

                                <small>
                                  {item.sets
                                    ? `${item.sets} ${t("coachDashboard.sets")}`
                                    : `${t("coachDashboard.sets")} —`}

                                  {" · "}

                                  {item.repetitions
                                    ? `${item.repetitions} ${t("coachDashboard.reps")}`
                                    : item.minRepetitions &&
                                        item.maxRepetitions
                                      ? `${item.minRepetitions}-${item.maxRepetitions} ${t("coachDashboard.reps")}`
                                      : `${t("coachDashboard.reps")} —`}

                                  {" · "}

                                  {item.restSeconds
                                    ? `${item.restSeconds}S ${t("coachDashboard.rest")}`
                                    : `${t("coachDashboard.rest")} —`}
                                </small>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </article>
                  )
                )}
              </section>
            )}

        </div>
      </main>
    );
  }

  if (view === "clients") {
    return (
      <main className="coach-dashboard">
        <div className="coach-dashboard__content">

          <header className="coach-dashboard__header">
            <button
              type="button"
              className="coach-dashboard__back"
              onClick={() =>
                setView(
                  "dashboard"
                )
              }
              aria-label={t("common.back")}
            >
              ←
            </button>

            <div>
              <span>
                {t("coachDashboard.controlCenter")}
              </span>

              <h1>
                {t("coachDashboard.myClients")}
              </h1>

              <p>
                {t("coachDashboard.athletesUnder")}
              </p>
            </div>
          </header>

          <section className="coach-clients-summary">
            <div>
              <span>
                {t("coachDashboard.activeAthletes")}
              </span>

              <strong>
                {clients.length}
              </strong>
            </div>

            <div>
              <span>
                {t("coachDashboard.totalWorkouts")}
              </span>

              <strong>
                {clients.reduce(
                  (
                    total,
                    relationship
                  ) =>
                    total +
                    (
                      relationship
                        .client
                        .workouts ||
                      0
                    ),
                  0
                )}
              </strong>
            </div>
          </section>

          {loadingClients && (
            <section className="coach-clients-state">
              <span>
                IRONAGE COACH
              </span>

              <strong>
                {t("coachDashboard.loadingAthletes")}
              </strong>
            </section>
          )}

          {!loadingClients &&
            clientsError && (
              <section className="coach-clients-state coach-clients-state--error">
                <span>
                  {t("coachDashboard.connectionError")}
                </span>

                <strong>
                  {clientsError}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    void loadClients()
                  }
                >
                  RETRY
                </button>
              </section>
            )}

          {!loadingClients &&
            !clientsError &&
            clients.length === 0 && (
              <section className="coach-clients-state">
                <span>
                  {t("coachDashboard.athleteRoster")}
                </span>

                <strong>
                  {t("coachDashboard.noClients")}
                </strong>

                <p>
                  {t("coachDashboard.athletesEmpty")}
                </p>
              </section>
            )}

          {!loadingClients &&
            !clientsError &&
            clients.length > 0 && (
              <section className="coach-clients-list">
                {clients.map(
                  (relationship) => {
                    const {
                      client,
                    } =
                      relationship;

                    return (
                      <article
                        key={
                          relationship.relationshipId
                        }
                        className="coach-client-card"
                      >
                        <div className="coach-client-card__top">
                          <div className="coach-client-card__avatar">
                            {(
                              client.firstName?.[0] ||
                              client.username?.[0] ||
                              "A"
                            ).toUpperCase()}
                          </div>

                          <div className="coach-client-card__identity">
                            <span>
                              {t("coachDashboard.athlete")} #{client.id}
                            </span>

                            <strong>
                              {getClientName(
                                client,
                                t("coachDashboard.athlete")
                              )}
                            </strong>

                            <small>
                              {formatGoal(
                                client.goal,
                                t("coachDashboard.noGoal")
                              )}
                            </small>
                          </div>

                          <div className="coach-client-card__level">
                            <span>
                              LEVEL
                            </span>

                            <strong>
                              {client.level}
                            </strong>
                          </div>
                        </div>

                        <div className="coach-client-card__body">
                          <div>
                            <span>
                              {t("coachDashboard.workouts")}
                            </span>

                            <strong>
                              {client.workouts}
                            </strong>
                          </div>

                          <div>
                            <span>
                              {t("coachDashboard.streak")}
                            </span>

                            <strong>
                              {client.streak}
                            </strong>
                          </div>

                          <div>
                            <span>
                              XP
                            </span>

                            <strong>
                              {client.xp}
                            </strong>
                          </div>
                        </div>

                        <div className="coach-client-card__meta">
                          <span>
                            {client.age
                              ? `${client.age} Y`
                              : `${t("coachDashboard.age")} —`}
                          </span>

                          <span>
                            {client.weight
                              ? `${client.weight} KG`
                              : `${t("coachDashboard.weight").replace("KG · ", "")} —`}
                          </span>

                          <span>
                            {client.height
                              ? `${client.height} CM`
                              : `${t("coachDashboard.height")} —`}
                          </span>
                        </div>
                      <button
                    type="button"
                    className="coach-client-card__results"
                    onClick={() =>
                      void loadClientResults(
                        clients.find(
                          (item) =>
                            item.client.id ===
                            client.id
                        )!
                      )
                    }
                  >
                    <span>
                      {t("coachDashboard.viewResults")}
                    </span>

                    <b>→</b>
                  </button>

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

  return (
    <main className="coach-dashboard">
      <div className="coach-dashboard__content">

        <header className="coach-dashboard__header">
          <button
            type="button"
            className="coach-dashboard__back"
            onClick={onBack}
            aria-label={t("common.back")}
          >
            ←
          </button>

          <div>
            <span>
              {t("coachDashboard.professional")}
            </span>

            <h1>
              {t("coachDashboard.system")}
            </h1>

            <p>
              {t("coachDashboard.buildAthletes")}
            </p>
          </div>
        </header>

        <section className="coach-dashboard__hero">
          <div className="coach-dashboard__mark">
            IA
          </div>

          <div>
            <span>
              {t("coachDashboard.controlCenter")}
            </span>

            <h2>
              {t("coachDashboard.lead")}
              <br />
              {t("coachDashboard.programVerb")}
              <br />
              <strong>
                {t("coachDashboard.transform")}
              </strong>
            </h2>

            <p>
              {t("coachDashboard.heroDescription")}
            </p>
          </div>
        </section>

        <div className="coach-dashboard__section-title">
          <span />
          <strong>
            {t("coachDashboard.tools")}
          </strong>
          <span />
        </div>

        <section className="coach-dashboard__tools">

          <button
            type="button"
            className="coach-dashboard__card"
            onClick={() =>
              setView(
                "clients"
              )
            }
          >
            <div className="coach-dashboard__number">
              01
            </div>

            <div className="coach-dashboard__card-content">
              <span>
                {t("coachDashboard.athletes")}
              </span>

              <strong>
                {t("coachDashboard.myClients")}
              </strong>

              <small>
                {t("coachDashboard.clientsDescription")}
              </small>
            </div>

            <b>→</b>
          </button>

          <button
            type="button"
            className="coach-dashboard__card"
            onClick={() =>
              setView("workouts")
            }
          >
            <div className="coach-dashboard__number">
              02
            </div>

            <div className="coach-dashboard__card-content">
              <span>
                {t("coachDashboard.training")}
              </span>

              <strong>
                {t("coachDashboard.myWorkouts")}
              </strong>

              <small>
                {t("coachDashboard.workoutsDescription")}
              </small>
            </div>

            <b>→</b>
          </button>

          <button
            type="button"
            className="coach-dashboard__card"
            onClick={() =>
              setView("programs")
            }
          >
            <div className="coach-dashboard__number">
              03
            </div>

            <div className="coach-dashboard__card-content">
              <span>
                {t("coachDashboard.programming")}
              </span>

              <strong>
                {t("coachDashboard.myPrograms")}
              </strong>

              <small>
                {t("coachDashboard.programsDescription")}
              </small>
            </div>

            <b>→</b>
          </button>

        </section>

        {onEditProfile && (
          <button
            type="button"
            className="coach-dashboard__card"
            onClick={onEditProfile}
          >
            <div className="coach-dashboard__number">
              04
            </div>

            <div className="coach-dashboard__card-content">
              <span>
                {t("coachDashboard.profile")}
              </span>

              <strong>
                EDIT {t("coachDashboard.profile")}
              </strong>

              <small>
                {t("coachDashboard.profileDescription")}
              </small>
            </div>

            <b>→</b>
          </button>
        )}

        <section className="coach-dashboard__status">
          <div>
            <span>
              {t("coachDashboard.coachStatus")}
            </span>

            <strong>
              {t("coachDashboard.active")}
            </strong>
          </div>

          <div className="coach-dashboard__status-dot" />
        </section>

      </div>
    </main>
  );
}
