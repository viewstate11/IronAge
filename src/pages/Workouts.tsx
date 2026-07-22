export const workouts = Array.from({ length: 90 }, (_, index) => {
  const day = index + 1;

  return {
    day,
    exercises: [
      {
        name: "Віджимання",
        sets: 3,
        reps: 10 + Math.floor(day / 10),
      },
      {
        name: "Підтягування",
        sets: 3,
        reps: 5 + Math.floor(day / 15),
      },
      {
        name: "Бруси",
        sets: 3,
        reps: 8 + Math.floor(day / 12),
      },
      {
        name: "Прес",
        sets: 3,
        reps: 20 + Math.floor(day / 5),
      },
    ],
  };
});