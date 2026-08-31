import { useCallback, useState } from "react";

import "./MainApp.css";

import Dashboard from "./Dashboard";
import Workout from "./Workout";
import Nutrition from "./Nutrition";
import Progress from "./Progress";
import Profile from "./Profile";
import Premium from "./Premium";
import AITrainer from "./AITrainer";
import TabBar from "./TabBar";

import TelegramBackButton from "../../components/TelegramBackButton";

import WorkoutSession from "../WorkoutSession/WorkoutSession";
import WorkoutComplete from "../WorkoutComplete/WorkoutComplete";
import CoachDashboard from "../Coach/CoachDashboard";
import MyProgram from "../Client/MyProgram";

import type { Tab } from "../../navigation/tabs";

import type {
  WorkoutProgram,
  WorkoutSessionResult,
} from "../../types/workout";

import { useUser } from "../../context/UserContext";

/* =========================================================
   TYPES
========================================================= */

type AppScreen =
  | Tab
  | "premium"
  | "coach"
  | "my-program"
  | "session"
  | "complete";


/* =========================================================
   COMPONENT
========================================================= */

export default function MainApp() {

  const {
    completeWorkout,
  } = useUser();


  /* =========================================================
     CURRENT SCREEN
  ========================================================= */

  const [
    screen,
    setScreen,
  ] = useState<AppScreen>("home");


  /* =========================================================
     ACTIVE WORKOUT
  ========================================================= */

  const [
    activeWorkoutId,
    setActiveWorkoutId,
  ] = useState<string>("upper");

  const [
    activeWorkoutProgram,
    setActiveWorkoutProgram,
  ] = useState<WorkoutProgram | undefined>(
    undefined
  );


  /* =========================================================
     WORKOUT RESULT
  ========================================================= */

  const [
    workoutResult,
    setWorkoutResult,
  ] =
    useState<WorkoutSessionResult | null>(
      null
    );


  /* =========================================================
     SAVE ERROR
  ========================================================= */

  const [
    saveError,
    setSaveError,
  ] = useState<string | null>(
    null
  );


  /* =========================================================
     SAVING STATE
  ========================================================= */

  const [
    isSavingWorkout,
    setIsSavingWorkout,
  ] = useState(false);


  /* =========================================================
     NAVIGATION
  ========================================================= */

  const changeTab = useCallback(
    (nextScreen: string) => {

      /*
       * Never allow external navigation
       * to manually open completion screen.
       *
       * Completion is opened only after
       * workout has been successfully saved.
       */

      if (
        nextScreen === "complete"
      ) {
        console.warn(
          "IRONAGE: 'complete' can only be opened after workout save."
        );

        return;
      }


      /*
       * Clear old workout result when
       * navigating to a normal application tab.
       */

      if (
        nextScreen !== "session"
      ) {
        setSaveError(null);
      }


      /*
       * MAIN NAVIGATION
       */

      setScreen(
        nextScreen as AppScreen
      );
    },
    []
  );


  /* =========================================================
     START WORKOUT
  ========================================================= */

  const startWorkout = useCallback(
    (
      workoutId: string,
      workoutProgram?: WorkoutProgram
    ) => {

      setSaveError(null);

      setWorkoutResult(null);

      setActiveWorkoutId(
        workoutId
      );

      setActiveWorkoutProgram(
        workoutProgram
      );

      setScreen("session");
    },
    []
  );


  /* =========================================================
     FINISH WORKOUT
  ========================================================= */

  const finishWorkout = useCallback(
    async (
      result: WorkoutSessionResult
    ) => {

      /*
       * Prevent duplicate save requests.
       */

      if (isSavingWorkout) {

        console.warn(
          "IRONAGE: Workout save already in progress"
        );

        return;
      }



      setIsSavingWorkout(true);

      setSaveError(null);


      try {

        /* =================================================
           SAVE WORKOUT
        ================================================= */

        await completeWorkout({

          workoutId:
            result.workoutId,

          name:
            result.workoutTitle,

          assignmentId:
            result.assignmentId,

          programWorkoutId:
            result.programWorkoutId,

          duration:
            result.durationSeconds,

          xp:
            result.xp,

          startedAt:
            result.startedAt,

          completedAt:
            result.completedAt,

          /*
           * REAL COMPLETED SETS
           */

          sets:
            result.sets.map(
              (set) => ({

                exerciseId:
                  set.exerciseId,

                exerciseName:
                  set.exerciseName,

                setNumber:
                  set.setNumber,

                repetitions:
                  set.repetitions,

                weight:
                  set.weight,

                duration:
                  set.duration,

                completed:
                  set.completed,
              })
            ),
        });


        /* =================================================
           SAVE SUCCESS
        ================================================= */


        /*
         * Store completed workout.
         */

        setWorkoutResult(
          result
        );


        /*
         * Open completion screen.
         */

        setScreen(
          "complete"
        );

      } catch (error) {

        /* =================================================
           SAVE ERROR
        ================================================= */

        console.error(
          "IRONAGE: Failed to save workout:",
          error
        );


        const message =
          error instanceof Error
            ? error.message
            : "Не вдалося зберегти тренування";


        setSaveError(
          message
        );


        /*
         * Stay inside workout session.
         */

        setScreen(
          "session"
        );

        throw error;

      } finally {

        setIsSavingWorkout(
          false
        );
      }

    },
    [
      completeWorkout,
      isSavingWorkout,
    ]
  );


  /* =========================================================
     TELEGRAM BACK BUTTON
  ========================================================= */

  const showBackButton =
    screen !== "home" &&
    screen !== "session" &&
    screen !== "complete";


  /* =========================================================
     BOTTOM TAB BAR
  ========================================================= */

  const showTabBar =
    screen !== "session" &&
    screen !== "complete" &&
    screen !== "coach" &&
    screen !== "my-program";


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="main-app">

      <main className="page">


        {/* =================================================
            TELEGRAM BACK BUTTON
        ================================================= */}

        {showBackButton && (
          <TelegramBackButton
            onBack={() => {
              setScreen("home");
            }}
          />
        )}


        {/* =================================================
            SAVE ERROR
        ================================================= */}

        {saveError &&
          screen === "session" && (

            <div
              role="alert"
              style={{
                position:
                  "fixed",

                top:
                  "16px",

                left:
                  "16px",

                right:
                  "16px",

                zIndex:
                  9999,

                padding:
                  "14px 16px",

                background:
                  "#120909",

                border:
                  "1px solid #8B0000",

                color:
                  "#ffffff",

                borderRadius:
                  "10px",

                fontFamily:
                  "Inter, sans-serif",

                fontSize:
                  "13px",

                lineHeight:
                  1.4,
              }}
            >

              <strong
                style={{
                  display:
                    "block",

                  marginBottom:
                    "4px",
                }}
              >
                WORKOUT SAVE ERROR
              </strong>

              {saveError}

            </div>
          )}


        {/* =================================================
            HOME
        ================================================= */}

        {screen === "home" && (

          <Dashboard
            changeTab={
              changeTab
            }

            startWorkout={
              startWorkout
            }
          />

        )}


        {/* =================================================
            WORKOUT
        ================================================= */}

        {screen === "workout" && (

          <Workout
            changeTab={
              changeTab
            }

            startWorkout={
              startWorkout
            }
          />

        )}


        {/* =================================================
            NUTRITION
        ================================================= */}

        {screen === "nutrition" && (

          <Nutrition />

        )}


        {/* =================================================
            PROGRESS
        ================================================= */}

        {screen === "progress" && (

          <Progress />

        )}


        {/* =================================================
            PROFILE
        ================================================= */}

        {screen === "profile" && (

          <Profile
            onOpenPremium={() => {
              setScreen("premium");
            }}
            onOpenCoach={() => {
              setScreen("coach");
            }}
            onOpenMyProgram={() => {
              setScreen("my-program");
            }}
          />

        )}

        {screen === "premium" && (

          <Premium
            onBack={() => {
              setScreen("profile");
            }}
          />

        )}


        {screen === "coach" && (

          <CoachDashboard
            onBack={() => {
              setScreen("profile");
            }}
          />

        )}

        {screen === "my-program" && (

          <MyProgram
            onBack={() => {
              setScreen("profile");
            }}
            onStartWorkout={(
              workoutId,
              workoutProgram
            ) => {
              startWorkout(
                workoutId,
                workoutProgram
              );
            }}
          />

        )}


        {/* =================================================
            AI TRAINER
        ================================================= */}

        {screen === "ai" && (

          <AITrainer
            changeTab={
              changeTab
            }
          />

        )}


        {/* =================================================
            WORKOUT SESSION
        ================================================= */}

        {screen === "session" && (

          <WorkoutSession

            changeTab={
              changeTab
            }

            workoutId={
              activeWorkoutId
            }

            workoutProgram={
              activeWorkoutProgram
            }

            onComplete={
              finishWorkout
            }

          />

        )}


        {/* =================================================
            WORKOUT COMPLETE
        ================================================= */}

        {screen === "complete" &&
          workoutResult !== null && (

            <WorkoutComplete

              changeTab={
                changeTab
              }

              workoutId={
                activeWorkoutId
              }

              result={
                workoutResult
              }

            />

        )}


        {/* =================================================
            COMPLETE FALLBACK
        ================================================= */}

        {screen === "complete" &&
          workoutResult === null && (

            <section
              style={{
                minHeight:
                  "100dvh",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                flexDirection:
                  "column",

                gap:
                  "20px",

                background:
                  "#050505",

                color:
                  "#D4AF37",

                fontFamily:
                  "Montserrat, sans-serif",

                padding:
                  "24px",

                textAlign:
                  "center",
              }}
            >

              <strong
                style={{
                  fontSize:
                    "20px",

                  letterSpacing:
                    "0.08em",
                }}
              >
                WORKOUT RESULT
                <br />
                NOT FOUND
              </strong>


              <button
                type="button"
                onClick={() => {

                  setWorkoutResult(
                    null
                  );

                  setScreen(
                    "home"
                  );

                }}
                style={{
                  border:
                    "1px solid #D4AF37",

                  background:
                    "#D4AF37",

                  color:
                    "#050505",

                  padding:
                    "16px 24px",

                  fontWeight:
                    800,

                  cursor:
                    "pointer",

                  borderRadius:
                    "10px",

                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                BACK TO HOME
              </button>

            </section>

        )}

      </main>


      {/* =====================================================
          BOTTOM TAB BAR
      ===================================================== */}

      {showTabBar && (

        <TabBar

          active={
            screen as Tab
          }

          onChange={(
            nextTab
          ) => {

            /*
             * IMPORTANT:
             *
             * TabBar navigation now uses
             * the exact same screen state.
             */

            setScreen(
              nextTab
            );

          }}

        />

      )}


      {/* =====================================================
          SAVING OVERLAY
      ===================================================== */}

      {isSavingWorkout && (

        <div
          role="status"
          aria-live="polite"
          style={{

            position:
              "fixed",

            inset:
              0,

            zIndex:
              10000,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            background:
              "rgba(0, 0, 0, 0.82)",

            backdropFilter:
              "blur(8px)",

            color:
              "#D4AF37",

            fontFamily:
              "Montserrat, sans-serif",

          }}
        >

          <div
            style={{
              textAlign:
                "center",

              padding:
                "24px",
            }}
          >

            <div
              style={{
                fontSize:
                  "28px",

                fontWeight:
                  800,

                marginBottom:
                  "12px",
              }}
            >
              IRONAGE
            </div>


            <div
              style={{
                fontSize:
                  "12px",

                letterSpacing:
                  "0.16em",

                color:
                  "#ffffff",
              }}
            >
              SAVING WORKOUT...
            </div>

          </div>

        </div>

      )}

    </div>
  );
}