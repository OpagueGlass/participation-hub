"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Matcher } from "react-day-picker";
import { ControllerFieldState } from "react-hook-form";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function DatePickerInput({
  title,
  field,
  fieldState,
  disabled,
}: {
  title: string;
  field: { value: Date | undefined; onChange: (date: Date | undefined) => void };
  fieldState: ControllerFieldState;
  disabled: Matcher | Matcher[] | undefined;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="date">{title}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild autoFocus={open} >
          <Button variant="outline" id="date" className="font-normal justify-between">
            {field.value ? field.value.toLocaleDateString("en-GB") : "Select date"}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0 pointer-events-auto" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            defaultMonth={field.value}
            captionLayout="dropdown"
            disabled={disabled}
            onSelect={(date) => {
              field.onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
