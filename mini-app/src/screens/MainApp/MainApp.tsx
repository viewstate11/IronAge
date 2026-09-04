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
import { useFeatureAccess } from "../../context/FeatureAccessContext";
import type { FeatureKey } from "../../config/featureAccess";

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

  const {
    canAccess,
    loading: accessLoading,
  } = useFeatureAccess();


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
       * Resolve application screen
       * to its centralized access rule.
       */

      const featureByScreen:
        Partial<Record<AppScreen, FeatureKey>> = {
          home: "dashboard",
          workout: "workout",
          nutrition: "nutrition",
          progress: "progress",
          profile: "profile",
          ai: "aiTrainer",
          coach: "coachSystem",
          "my-program": "myProgram",
          session: "workoutSession",
        };

      const targetScreen =
        nextScreen as AppScreen;

      const feature =
        featureByScreen[targetScreen];


      /*
       * While access state is loading,
       * protected screens stay closed.
       *
       * Free workout execution is never
       * interrupted by this guard.
       */

      if (
        accessLoading &&
        (
          targetScreen === "ai" ||
          targetScreen === "coach" ||
          targetScreen === "my-program"
        )
      ) {
        console.warn(
          "IRONAGE: Access state is still loading."
        );

        return;
      }


      /*
       * PREMIUM
       *
       * Premium features redirect to the
       * Premium screen when entitlement
       * is missing.
       */

      if (
        feature &&
        !canAccess(feature)
      ) {
        if (
          targetScreen === "ai"
        ) {
          setSaveError(null);
          setScreen("premium");
          return;
        }

        /*
         * Coach and Client screens are
         * role-based, not Premium-based.
         *
         * Never sell Premium as a way
         * around a missing Coach/Client role.
         */

        if (
          targetScreen === "coach" ||
          targetScreen === "my-program"
        ) {
          console.warn(
            `IRONAGE: Access denied for ${targetScreen}.`
          );

          return;
        }

        console.warn(
          `IRONAGE: Access denied for ${targetScreen}.`
        );

        return;
      }


      /*
       * Clear old workout result when
       * navigating to a normal application tab.
       */

      if (
        targetScreen !== "session"
      ) {
        setSaveError(null);
      }


      /*
       * MAIN NAVIGATION
       */

      setScreen(targetScreen);
    },
    [
      accessLoading,
      canAccess,
    ]
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
                className="mainapp-save-error"
            >

              <strong
                  className="mainapp-save-error__title"
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
              changeTab("coach");
            }}
            onOpenMyProgram={() => {
              changeTab("my-program");
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
                className="mainapp-complete-fallback"
            >

              <strong
                className="mainapp-complete-fallback__title"
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
                  className="mainapp-complete-fallback__button"
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
             * All TabBar navigation must
             * pass through centralized
             * feature access control.
             */

            changeTab(
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
            className="mainapp-saving-overlay"
        >

          <div
            className="mainapp-saving-overlay__content"
          >

            <div
              className="mainapp-saving-overlay__brand"
            >
              IRONAGE
            </div>


            <div
              className="mainapp-saving-overlay__text"
            >
              SAVING WORKOUT...
            </div>

          </div>

        </div>

      )}

    </div>
  );
}
