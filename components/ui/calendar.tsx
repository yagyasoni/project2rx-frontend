import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  fixedWeeks = true,
  startMonth = new Date(1990, 0),
  endMonth = new Date(2070, 11),
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      fixedWeeks={fixedWeeks}
      startMonth={startMonth}
      endMonth={endMonth}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center h-9",
        caption_label: "sr-only",

        // Month + Year dropdowns
        dropdowns: "flex items-center gap-1.5",
        dropdown_root: "relative inline-flex items-center",
        dropdown: cn(
          "bg-transparent text-sm font-medium px-2 py-1 rounded-md border border-border",
          "cursor-pointer hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600",
          "appearance-auto"
        ),

        nav: "flex items-center justify-between absolute inset-x-1 top-1 z-10",
        button_previous: cn(
          "h-7 w-7 inline-flex items-center justify-center rounded-md border border-border bg-transparent p-0",
          "opacity-60 hover:opacity-100 hover:bg-slate-100 cursor-pointer",
          "disabled:opacity-30 disabled:cursor-not-allowed"
        ),
        button_next: cn(
          "h-7 w-7 inline-flex items-center justify-center rounded-md border border-border bg-transparent p-0",
          "opacity-60 hover:opacity-100 hover:bg-slate-100 cursor-pointer",
          "disabled:opacity-30 disabled:cursor-not-allowed"
        ),

        month_grid: "w-full border-collapse mt-2",
        weekdays: "grid grid-cols-7 mb-1",
        weekday: "text-muted-foreground font-normal text-[0.8rem] text-center py-2",
        week: "grid grid-cols-7 mt-1",

        day: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day_button: cn(
          "h-10 w-10 p-0 font-normal rounded-md transition-colors cursor-pointer",
          "hover:bg-blue-50 hover:text-blue-600",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
          "disabled:opacity-50 disabled:pointer-events-none"
        ),

        selected:
          "[&_button]:bg-blue-600 [&_button]:text-white [&_button]:hover:bg-blue-700 [&_button]:hover:text-white [&_button]:font-medium",
        today:
          "[&_button]:bg-slate-100 [&_button]:text-blue-600 [&_button]:font-bold",
        outside: "[&_button]:text-slate-400 [&_button]:opacity-50",
        disabled: "[&_button]:text-slate-300 [&_button]:opacity-40",
        hidden: "invisible",

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };