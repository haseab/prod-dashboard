"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cx } from "class-variance-authority";

export function DatePickerWithRange({
  className,
  initialFromDate, // prop for the initial start date
  initialToDate, // prop for the initial end date
}: React.HTMLAttributes<HTMLDivElement> & {
  initialFromDate?: string;
  initialToDate?: string;
}) {
  const initialFromDatetime = new Date(initialFromDate || "");
  const initialToDatetime = new Date(initialToDate || "");
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: initialFromDatetime,
    to: initialToDatetime,
  });

  return (
    <div className={cx("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cx(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
