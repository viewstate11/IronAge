import {
  useEffect,
  useState,
} from "react";

import api, {
  telegramAuthOptions,
} from "../../api/client";

import CreateWorkout from "./CreateWorkout";
import CreateProgram from "./CreateProgram";

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

type CoachProgram = {
  id: number;
  coachId: number;
  name: string;
  description: string | null;
  durationWeeks: number | null;
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
  goal: string | null
): string {
  if (!goal) {
    return "NO GOAL";
  }

  return goal
    .replace(/_/g, " ");
}

function getClientName(
  client: CoachClient["client"]
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

  return `ATHLETE #${client.id}`;
}

export default function CoachDashboard({
  onBack,
  onEditProfile,
}: Props) {
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
          client.client
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
          : "Failed to assign program"
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
          : "Failed to load clients"
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
          : "Failed to load client results"
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
          : "Failed to load workouts"
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
          : "Failed to load programs"
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
              aria-label="Back to clients"
            >
              ←
            </button>

            <div>
              <span>
                ATHLETE PERFORMANCE
              </span>

              <h1>
                CLIENT RESULTS
              </h1>

              <p>
                WORKOUT HISTORY
              </p>
            </div>
          </header>

          <section className="coach-client-results__athlete">
            <span>
              ATHLETE #{client.id}
            </span>

            <h2>
              {getClientName(client)}
            </h2>

            <p>
              {formatGoal(client.goal)}
              {" · "}
              LEVEL {client.level}
            </p>

            <div>
              <section>
                <strong>
                  {client.workouts}
                </strong>
                <span>
                  WORKOUTS
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
                <span>STREAK</span>
              </section>
            </div>
          </section>

          {loadingClientResults && (
            <section className="coach-clients-state">
              <span>
                IRONAGE COACH
              </span>

              <strong>
                LOADING RESULTS...
              </strong>
            </section>
          )}

          {!loadingClientResults &&
            clientResultsError && (
              <section className="coach-clients-state coach-clients-state--error">
                <span>
                  RESULTS ERROR
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
                      CURRENT PROGRESS
                    </span>

                    <strong>
                      {new Date(
                        clientProgress[0].createdAt
                      ).toLocaleDateString()}
                    </strong>
                  </div>
                </div>

                <div className="coach-progress-grid">
                  <div>
                    <strong>
                      {clientProgress[0].weight ?? "—"}
                    </strong>
                    <span>KG · WEIGHT</span>
                  </div>

                  <div>
                    <strong>
                      {clientProgress[0].bodyFat ?? "—"}
                    </strong>
                    <span>% · BODY FAT</span>
                  </div>

                  <div>
                    <strong>
                      {clientProgress[0].muscleMass ?? "—"}
                    </strong>
                    <span>KG · MUSCLE MASS</span>
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
                      PROGRAM ADHERENCE
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
                    WORKOUTS COMPLETED
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
                              ? `WEEK ${item.week}`
                              : "PROGRAM"}
                            {item.day
                              ? ` · DAY ${item.day}`
                              : ""}
                          </span>

                          <strong>
                            {item.workoutName}
                          </strong>
                        </div>

                        <b>
                          {item.status}
                        </b>
                      </article>
                    )
                  )}
                </div>

                <footer className="coach-adherence-card__footer">
                  <span>
                    LAST COMPLETED
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
                  WORKOUT HISTORY
                </span>

                <strong>
                  NO RESULTS YET
                </strong>

                <p>
                  Completed client workouts
                  will appear here.
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
                            ).toLocaleString()}
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
                          {workout.duration} SEC
                        </span>

                        <span>
                          {workout.sets.length} SETS
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
                                  SET {set.setNumber}
                                </small>
                              </section>

                              <section>
                                <b>
                                  {set.repetitions ??
                                    "—"}
                                </b>
                                <span>
                                  REPS
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
              aria-label="Back to programs"
            >
              ←
            </button>

            <div>
              <span>
                PROGRAM ASSIGNMENT
              </span>

              <h1>
                ASSIGN PROGRAM
              </h1>

              <p>
                SELECT ATHLETE
              </p>
            </div>
          </header>

          <section className="coach-assign-program__program">
            <span>
              SELECTED PROGRAM
            </span>

            <strong>
              {selectedProgram.name}
            </strong>

            <small>
              {selectedProgram.durationWeeks
                ? `${selectedProgram.durationWeeks} WEEKS`
                : "CUSTOM DURATION"}
              {" · "}
              {selectedProgram.workouts.length} WORKOUTS
            </small>
          </section>

          {loadingClients && (
            <section className="coach-clients-state">
              <span>
                IRONAGE COACH
              </span>

              <strong>
                LOADING CLIENTS...
              </strong>
            </section>
          )}

          {!loadingClients &&
            clientsError && (
              <section className="coach-clients-state coach-clients-state--error">
                <span>
                  CONNECTION ERROR
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
                  CLIENT ROSTER
                </span>

                <strong>
                  NO CLIENTS YET
                </strong>

                <p>
                  Invite a client before assigning a program.
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
                PROGRAM ASSIGNED
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
                BACK TO PROGRAMS
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
                          ATHLETE #{client.client.id}
                        </span>

                        <strong>
                          {getClientName(
                            client.client
                          )}
                        </strong>

                        <small>
                          {formatGoal(
                            client.client.goal
                          )}
                          {" · "}
                          LEVEL {client.client.level}
                        </small>
                      </div>

                      <b>
                        {assigningClientId ===
                        client.client.id
                          ? "..."
                          : "ASSIGN →"}
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
              aria-label="Back to coach dashboard"
            >
              ←
            </button>

            <div>
              <span>
                COACH CONTROL CENTER
              </span>

              <h1>
                MY PROGRAMS
              </h1>

              <p>
                TRAINING SYSTEMS
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
              + CREATE PROGRAM
            </span>

            <b>→</b>
          </button>

          <section className="coach-clients-summary">
            <div>
              <span>
                ACTIVE PROGRAMS
              </span>

              <strong>
                {programs.length}
              </strong>
            </div>

            <div>
              <span>
                WORKOUTS USED
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
                LOADING PROGRAMS...
              </strong>
            </section>
          )}

          {!loadingPrograms &&
            programsError && (
              <section className="coach-clients-state coach-clients-state--error">
                <span>
                  CONNECTION ERROR
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
                  PROGRAM LIBRARY
                </span>

                <strong>
                  NO PROGRAMS YET
                </strong>

                <p>
                  Your training programs will
                  appear here.
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
                            PROGRAM #{program.id}
                          </span>

                          <strong>
                            {program.name}
                          </strong>
                        </div>

                        <b>
                          {program.durationWeeks
                            ? `${program.durationWeeks} WEEKS`
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
                          {program.workouts.length} WORKOUTS
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
                                      ? `WEEK ${item.week}`
                                      : "WEEK —"}

                                    {" · "}

                                    {item.day
                                      ? `DAY ${item.day}`
                                      : "DAY —"}
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

                      <button
                        type="button"
                        className="coach-program-card__assign"
                        onClick={() => {
                          setSelectedProgram(
                            program
                          );
                          setAssignError(null);
                          setAssignSuccess(null);
                          setView(
                            "assign-program"
                          );
                        }}
                      >
                        <span>
                          ASSIGN PROGRAM
                        </span>

                        <b>→</b>
                      </button>
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
              aria-label="Back to coach dashboard"
            >
              ←
            </button>

            <div>
              <span>
                COACH CONTROL CENTER
              </span>

              <h1>
                MY WORKOUTS
              </h1>

              <p>
                TRAINING LIBRARY
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
              + CREATE WORKOUT
            </span>

            <b>→</b>
          </button>

          <section className="coach-clients-summary">
            <div>
              <span>
                ACTIVE WORKOUTS
              </span>

              <strong>
                {workouts.length}
              </strong>
            </div>

            <div>
              <span>
                EXERCISES USED
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
                LOADING WORKOUTS...
              </strong>
            </section>
          )}

          {!loadingWorkouts &&
            workoutsError && (
              <section className="coach-clients-state coach-clients-state--error">
                <span>
                  CONNECTION ERROR
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
                  TRAINING LIBRARY
                </span>

                <strong>
                  NO WORKOUTS YET
                </strong>

                <p>
                  Your coach workouts will
                  appear here.
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
                            WORKOUT #{workout.id}
                          </span>

                          <strong>
                            {workout.name}
                          </strong>

                          <small>
                            {workout.difficulty ||
                              "STANDARD"}
                          </small>
                        </div>

                        <b>
                          {workout.duration
                            ? `${workout.duration} MIN`
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
                                    ? `${item.sets} SETS`
                                    : "SETS —"}

                                  {" · "}

                                  {item.repetitions
                                    ? `${item.repetitions} REPS`
                                    : item.minRepetitions &&
                                        item.maxRepetitions
                                      ? `${item.minRepetitions}-${item.maxRepetitions} REPS`
                                      : "REPS —"}

                                  {" · "}

                                  {item.restSeconds
                                    ? `${item.restSeconds}S REST`
                                    : "REST —"}
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
              aria-label="Back to coach dashboard"
            >
              ←
            </button>

            <div>
              <span>
                COACH CONTROL CENTER
              </span>

              <h1>
                MY CLIENTS
              </h1>

              <p>
                ATHLETES UNDER YOUR COACHING
              </p>
            </div>
          </header>

          <section className="coach-clients-summary">
            <div>
              <span>
                ACTIVE ATHLETES
              </span>

              <strong>
                {clients.length}
              </strong>
            </div>

            <div>
              <span>
                TOTAL WORKOUTS
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
                LOADING ATHLETES...
              </strong>
            </section>
          )}

          {!loadingClients &&
            clientsError && (
              <section className="coach-clients-state coach-clients-state--error">
                <span>
                  CONNECTION ERROR
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
                  ATHLETE ROSTER
                </span>

                <strong>
                  NO CLIENTS YET
                </strong>

                <p>
                  Assigned athletes will
                  appear here.
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
                              ATHLETE #{client.id}
                            </span>

                            <strong>
                              {getClientName(
                                client
                              )}
                            </strong>

                            <small>
                              {formatGoal(
                                client.goal
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
                              WORKOUTS
                            </span>

                            <strong>
                              {client.workouts}
                            </strong>
                          </div>

                          <div>
                            <span>
                              STREAK
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
                              : "AGE —"}
                          </span>

                          <span>
                            {client.weight
                              ? `${client.weight} KG`
                              : "WEIGHT —"}
                          </span>

                          <span>
                            {client.height
                              ? `${client.height} CM`
                              : "HEIGHT —"}
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
                      VIEW RESULTS
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
            aria-label="Back to profile"
          >
            ←
          </button>

          <div>
            <span>
              IRONAGE PROFESSIONAL
            </span>

            <h1>
              COACH SYSTEM
            </h1>

            <p>
              BUILD ATHLETES. TRACK RESULTS.
            </p>
          </div>
        </header>

        <section className="coach-dashboard__hero">
          <div className="coach-dashboard__mark">
            IA
          </div>

          <div>
            <span>
              COACH CONTROL CENTER
            </span>

            <h2>
              LEAD.
              <br />
              PROGRAM.
              <br />
              <strong>
                TRANSFORM.
              </strong>
            </h2>

            <p>
              Manage your athletes, create workouts
              and build complete training programs.
            </p>
          </div>
        </section>

        <div className="coach-dashboard__section-title">
          <span />
          <strong>
            COACH TOOLS
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
                ATHLETES
              </span>

              <strong>
                MY CLIENTS
              </strong>

              <small>
                Manage assigned athletes and monitor progress.
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
                TRAINING
              </span>

              <strong>
                MY WORKOUTS
              </strong>

              <small>
                Build workouts from the IRONAGE exercise library.
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
                PROGRAMMING
              </span>

              <strong>
                MY PROGRAMS
              </strong>

              <small>
                Create programs and assign them to your clients.
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
                PROFILE
              </span>

              <strong>
                EDIT PROFILE
              </strong>

              <small>
                Update your coach name, specialization, bio and photo.
              </small>
            </div>

            <b>→</b>
          </button>
        )}

        <section className="coach-dashboard__status">
          <div>
            <span>
              COACH STATUS
            </span>

            <strong>
              ACTIVE
            </strong>
          </div>

          <div className="coach-dashboard__status-dot" />
        </section>

      </div>
    </main>
  );
}
