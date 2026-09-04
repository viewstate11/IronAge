import { Capacitor } from "@capacitor/core";
import {
  LocalNotifications,
  type PermissionStatus,
} from "@capacitor/local-notifications";

const WORKOUT_NOTIFICATION_ID = 910001;

const NUTRITION_NOTIFICATION_IDS = [
  920001,
  920002,
  920003,
];

const MOTIVATION_NOTIFICATION_ID = 930001;

export function isNativeNotificationsAvailable(): boolean {
  return Capacitor.isNativePlatform();
}

export async function getNotificationPermission(): Promise<PermissionStatus> {
  return LocalNotifications.checkPermissions();
}

export async function requestNotificationPermission(): Promise<PermissionStatus> {
  return LocalNotifications.requestPermissions();
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (!isNativeNotificationsAvailable()) {
    return false;
  }

  let status =
    await LocalNotifications.checkPermissions();

  if (status.display === "prompt") {
    status =
      await LocalNotifications.requestPermissions();
  }

  return status.display === "granted";
}

export async function sendTestIronageNotification(): Promise<boolean> {
  const granted =
    await ensureNotificationPermission();

  if (!granted) {
    return false;
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id: 900001,
        title: "IRONAGE",
        body: "Notifications are active. Time to keep moving.",
        schedule: {
          at: new Date(Date.now() + 5000),
        },
      },
    ],
  });

  return true;
}

/* =========================================================
   WORKOUT
========================================================= */

export async function scheduleWorkoutReminder(
  hour = 18,
  minute = 0
): Promise<boolean> {
  const granted =
    await ensureNotificationPermission();

  if (!granted) {
    return false;
  }

  await cancelWorkoutReminder();

  await LocalNotifications.schedule({
    notifications: [
      {
        id: WORKOUT_NOTIFICATION_ID,
        title: "IRONAGE · WORKOUT",
        body: "Your workout is waiting. Show up and earn it.",
        schedule: {
          on: {
            hour,
            minute,
          },
        },
      },
    ],
  });

  return true;
}

export async function cancelWorkoutReminder(): Promise<void> {
  await LocalNotifications.cancel({
    notifications: [
      {
        id: WORKOUT_NOTIFICATION_ID,
      },
    ],
  });
}

/* =========================================================
   NUTRITION
========================================================= */

export async function scheduleNutritionReminders(
  morning = { hour: 9, minute: 0 },
  afternoon = { hour: 13, minute: 0 },
  evening = { hour: 19, minute: 0 }
): Promise<boolean> {
  const granted =
    await ensureNotificationPermission();

  if (!granted) {
    return false;
  }

  await cancelNutritionReminders();

  await LocalNotifications.schedule({
    notifications: [
      {
        id: NUTRITION_NOTIFICATION_IDS[0],
        title: "IRONAGE · NUTRITION",
        body: "Start strong. Fuel your body and drink water.",
        schedule: {
          on: {
            hour: morning.hour,
            minute: morning.minute,
          },
        },
      },
      {
        id: NUTRITION_NOTIFICATION_IDS[1],
        title: "IRONAGE · NUTRITION",
        body: "Stay on plan. Check your food and hydration.",
        schedule: {
          on: {
            hour: afternoon.hour,
            minute: afternoon.minute,
          },
        },
      },
      {
        id: NUTRITION_NOTIFICATION_IDS[2],
        title: "IRONAGE · NUTRITION",
        body: "Finish the day disciplined. Hit your nutrition target.",
        schedule: {
          on: {
            hour: evening.hour,
            minute: evening.minute,
          },
        },
      },
    ],
  });

  return true;
}

export async function cancelNutritionReminders(): Promise<void> {
  await LocalNotifications.cancel({
    notifications:
      NUTRITION_NOTIFICATION_IDS.map((id) => ({
        id,
      })),
  });
}

/* =========================================================
   MOTIVATION
========================================================= */

export async function scheduleMotivationReminder(
  hour = 7,
  minute = 30
): Promise<boolean> {
  const granted =
    await ensureNotificationPermission();

  if (!granted) {
    return false;
  }

  await cancelMotivationReminder();

  await LocalNotifications.schedule({
    notifications: [
      {
        id: MOTIVATION_NOTIFICATION_ID,
        title: "IRONAGE",
        body: "No excuses. Build the version of you that you came for.",
        schedule: {
          on: {
            hour,
            minute,
          },
        },
      },
    ],
  });

  return true;
}

export async function cancelMotivationReminder(): Promise<void> {
  await LocalNotifications.cancel({
    notifications: [
      {
        id: MOTIVATION_NOTIFICATION_ID,
      },
    ],
  });
}

/* =========================================================
   PROGRESS EVENT NOTIFICATION
========================================================= */

export type ProgressNotificationData = {
  xp: number;
  level: number;
  streak: number;
  levelUp?: boolean;
  streakIncreased?: boolean;
};

export async function sendProgressUpdateNotification(
  data: ProgressNotificationData
): Promise<boolean> {
  const granted =
    await ensureNotificationPermission();

  if (!granted) {
    return false;
  }

  let title =
    "IRONAGE · WORKOUT COMPLETE";

  let body =
    `Workout completed. +${data.xp} XP earned.`;

  if (data.levelUp) {
    title =
      "IRONAGE · LEVEL UP";

    body =
      `Level ${data.level} reached. +${data.xp} XP. Keep building.`;
  } else if (
    data.streakIncreased &&
    data.streak > 0
  ) {
    title =
      "IRONAGE · STREAK";

    body =
      `${data.streak}-day streak. +${data.xp} XP. Discipline is building.`;
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id: 940001,
        title,
        body,
        schedule: {
          at: new Date(
            Date.now() + 10000
          ),
        },
      },
    ],
  });

  return true;
}

