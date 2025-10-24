import React from "react";
import MealSlot from "./MealSlot";

export default function MealPlannerGrid({ planner, onAssign, recipes }) {
  const days = [
    "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {days.map((day) => (
        <MealSlot
          key={day}
          day={day}
          recipe={planner[day]}
          onAssign={onAssign}
          recipes={recipes}
        />
      ))}
    </div>
  );
}