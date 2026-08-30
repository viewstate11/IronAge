import type {
  FoodEntry,
  MealType,
  NutritionDay,
} from "../types/nutrition";

const NUTRITION_KEY =
  "ironage_nutrition";

/* =========================================================
   VALID MEAL TYPES
========================================================= */

const validMealTypes: MealType[] = [
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "SNACK",
];

/* =========================================================
   DATE HELPERS
========================================================= */

export function getDateKey(
  date = new Date()
): string {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function addDays(
  date: Date,
  amount: number
): Date {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() +
      amount
  );

  return result;
}

/* =========================================================
   DEFAULT DAY
========================================================= */

function getDefaultDay(
  date = new Date()
): NutritionDay {
  return {
    date:
      getDateKey(date),

    water: 0,

    meals: [],
  };
}

/* =========================================================
   NORMALIZE MEAL
========================================================= */

function normalizeMeal(
  value: unknown
): MealType {
  if (
    typeof value === "string"
  ) {
    const normalized =
      value.toUpperCase();

    if (
      validMealTypes.includes(
        normalized as MealType
      )
    ) {
      return normalized as MealType;
    }
  }

  return "SNACK";
}

/* =========================================================
   NORMALIZE FOOD ENTRY
========================================================= */

function normalizeFoodEntry(
  raw: unknown
): FoodEntry | null {
  if (
    !raw ||
    typeof raw !== "object"
  ) {
    return null;
  }

  const item =
    raw as Partial<FoodEntry> & {
      meal?: unknown;
      id?: unknown;
      date?: unknown;
    };

  if (
    typeof item.name !==
    "string"
  ) {
    return null;
  }

  /*
   * FoodEntry.id is NUMBER.
   *
   * Older localStorage data may contain
   * string IDs, so convert them safely.
   */
  let id: number;

  if (
    typeof item.id ===
    "number" &&
    Number.isFinite(item.id)
  ) {
    id = item.id;
  } else if (
    typeof item.id ===
    "string"
  ) {
    const parsedId =
      Number(item.id);

    id =
      Number.isFinite(
        parsedId
      )
        ? parsedId
        : Date.now();
  } else {
    id =
      Date.now();
  }

  return {
    id,

    name:
      item.name.trim(),

    meal:
      normalizeMeal(
        item.meal
      ),

    calories:
      Math.max(
        0,
        Number(
          item.calories
        ) || 0
      ),

    protein:
      Math.max(
        0,
        Number(
          item.protein
        ) || 0
      ),

    fat:
      Math.max(
        0,
        Number(
          item.fat
        ) || 0
      ),

    carbs:
      Math.max(
        0,
        Number(
          item.carbs
        ) || 0
      ),

    amount:
      typeof item.amount ===
        "number" &&
      Number.isFinite(
        item.amount
      )
        ? item.amount
        : undefined,

    unit:
      typeof item.unit ===
      "string"
        ? item.unit
        : undefined,

    date:
      typeof item.date ===
      "string"
        ? item.date
        : new Date().toISOString(),
  };
}

/* =========================================================
   LOAD DAY
========================================================= */

export function loadNutritionDay(
  date = new Date()
): NutritionDay {
  const dateKey =
    getDateKey(date);

  const saved =
    localStorage.getItem(
      `${NUTRITION_KEY}_${dateKey}`
    );

  if (!saved) {
    return getDefaultDay(
      date
    );
  }

  try {
    const parsed =
      JSON.parse(
        saved
      ) as Partial<NutritionDay>;

    const meals =
      Array.isArray(
        parsed.meals
      )
        ? parsed.meals
            .map(
              normalizeFoodEntry
            )
            .filter(
              (
                item
              ): item is FoodEntry =>
                item !== null
            )
        : [];

    return {
      date:
        dateKey,

      water:
        Math.max(
          0,
          Number(
            parsed.water
          ) || 0
        ),

      meals,
    };
  } catch {
    return getDefaultDay(
      date
    );
  }
}

/* =========================================================
   SAVE DAY
========================================================= */

export function saveNutritionDay(
  day: NutritionDay
): void {
  localStorage.setItem(
    `${NUTRITION_KEY}_${day.date}`,
    JSON.stringify(day)
  );
}

/* =========================================================
   ADD FOOD
========================================================= */

export function addFoodEntry(
  entry: FoodEntry,
  date = new Date()
): NutritionDay {
  const day =
    loadNutritionDay(
      date
    );

  const normalizedEntry: FoodEntry =
    {
      ...entry,

      id:
        Number.isFinite(
          entry.id
        )
          ? entry.id
          : Date.now(),

      date:
        entry.date ||
        new Date().toISOString(),
    };

  const updated: NutritionDay =
    {
      ...day,

      meals: [
        ...day.meals,
        normalizedEntry,
      ],
    };

  saveNutritionDay(
    updated
  );

  return updated;
}

/* =========================================================
   REMOVE FOOD
========================================================= */

export function removeFoodEntry(
  id: number,
  date = new Date()
): NutritionDay {
  const day =
    loadNutritionDay(
      date
    );

  const updated: NutritionDay =
    {
      ...day,

      meals:
        day.meals.filter(
          (
            meal
          ) =>
            meal.id !== id
        ),
    };

  saveNutritionDay(
    updated
  );

  return updated;
}

/* =========================================================
   UPDATE WATER
========================================================= */

export function updateWater(
  amount: number,
  date = new Date()
): NutritionDay {
  const day =
    loadNutritionDay(
      date
    );

  const updated: NutritionDay =
    {
      ...day,

      water:
        Math.max(
          0,
          Number(amount) || 0
        ),
    };

  saveNutritionDay(
    updated
  );

  return updated;
}

/* =========================================================
   ADD WATER
========================================================= */

export function addWater(
  amount: number,
  date = new Date()
): NutritionDay {
  const day =
    loadNutritionDay(
      date
    );

  const updated: NutritionDay =
    {
      ...day,

      water:
        Math.max(
          0,
          day.water +
            (Number(amount) || 0)
        ),
    };

  saveNutritionDay(
    updated
  );

  return updated;
}

/* =========================================================
   HISTORY
========================================================= */

export function getNutritionHistory(
  days = 7,
  endDate = new Date()
): NutritionDay[] {
  const safeDays =
    Math.max(
      1,
      Math.floor(days)
    );

  const result: NutritionDay[] =
    [];

  for (
    let index = 0;
    index < safeDays;
    index++
  ) {
    const date =
      addDays(
        endDate,
        -index
      );

    result.push(
      loadNutritionDay(
        date
      )
    );
  }

  return result;
}

/* =========================================================
   CLEAR DAY
========================================================= */

export function clearNutritionDay(
  date = new Date()
): NutritionDay {
  const empty =
    getDefaultDay(
      date
    );

  saveNutritionDay(
    empty
  );

  return empty;
}