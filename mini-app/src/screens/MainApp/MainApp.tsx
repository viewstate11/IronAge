
import { useState } from "react";

import "./MainApp.css";

import Dashboard from "./Dashboard";
import Workout from "./Workout";
import Nutrition from "./Nutrition";
import Progress from "./Progress";
import Profile from "./Profile";
import AITrainer from "./AITrainer";
import TabBar from "./TabBar";
import TelegramBackButton from "../../components/TelegramBackButton";

import WorkoutSession from "../WorkoutSession/WorkoutSession";
import WorkoutComplete from "../WorkoutComplete/WorkoutComplete";

type Tab =
  | "home"
  | "workout"
  | "nutrition"
  | "progress"
  | "profile"
  | "ai"
  | "session"
  | "complete";

export default function MainApp() {
  const [tab, setTab] = useState<Tab>("home");

  const [activeWorkoutId, setActiveWorkoutId] =
    useState<string>("upper");

  const changeTab = (nextTab: string) => {
    setTab(nextTab as Tab);
  };

  const startWorkout = (workoutId: string) => {
    setActiveWorkoutId(workoutId);
    setTab("session");
  };

  return (
    <div className="main-app">
      <main className="page">

{tab !== "home" &&
  tab !== "session" &&
  tab !== "complete" && (
    <TelegramBackButton
      onBack={() => changeTab("home")}
    />
  )}
        {/* HOME */}

        {tab === "home" && (
          <Dashboard
            changeTab={changeTab}
            startWorkout={startWorkout}
          />
        )}

        {/* WORKOUT */}

        {tab === "workout" && (
          <Workout
            changeTab={changeTab}
            startWorkout={startWorkout}
          />
        )}

        {/* NUTRITION */}

        {tab === "nutrition" && (
  <Nutrition
    changeTab={changeTab}
  />
)}

        {/* PROGRESS */}

        {tab === "progress" && (
          <Progress />
        )}

        {/* PROFILE */}
{tab === "profile" && (
  <Profile />
)}

        {/* AI TRAINER */}

        {tab === "ai" && (
          <AITrainer
            changeTab={changeTab}
          />
        )}

        {/* WORKOUT SESSION */}

        {tab === "session" && (
          <WorkoutSession
            changeTab={changeTab}
            workoutId={activeWorkoutId}
          />
        )}

        {/* WORKOUT COMPLETE */}

        {tab === "complete" && (
          <WorkoutComplete
            changeTab={changeTab}
            workoutId={activeWorkoutId}
          />
        )}

      </main>

      {/* BOTTOM NAVIGATION */}

      {tab !== "session" &&
        tab !== "complete" && (
          <TabBar
            active={tab}
            change={changeTab}
          />
        )}
    </div>
  );
}
