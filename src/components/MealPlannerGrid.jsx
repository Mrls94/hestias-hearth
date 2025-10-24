import React from "react";
import DayCard from "./DayCard";

export default function MealPlannerGrid({ planner, onAssign, recipes }) {
  const days = [
    "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {days.map((day) => (
        <DayCard
          key={day}
          day={day}
          meals={planner[day]}
          onAssign={onAssign}
          recipes={recipes}
        />
      ))}
    </div>
  );
}