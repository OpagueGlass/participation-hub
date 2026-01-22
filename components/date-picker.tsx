"use client";

import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Matcher } from "react-day-picker";
import { ControllerFieldState } from "react-hook-form";
import zod from "zod";

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
  value,
  setValue
}: {
  title: string;
  field: { value: Date | undefined; onChange: (date: Date | undefined) => void };
  fieldState: ControllerFieldState;
  disabled: Matcher | Matcher[] | undefined;
  value: string;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(field.value);


  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="date-required">{title}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-required"
          value={value}
          placeholder="dd/mm/yyyy"
          onChange={(e) => {
            setValue(e.target.value);
            const result = zod.iso.date().safeParse(
              e.target.value
                .split("/")
                .reverse()
                .map((n) => n.padStart(2, "0"))
                .join("-"),
            );

            if (!result.success) {
              field.onChange(undefined);
            } else {
              const date = new Date(result.data);
              field.onChange(date);
              setMonth(date);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
              <InputGroupButton id="date-picker" variant="ghost" size="icon-xs" aria-label="Select date">
                <CalendarIcon />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
              <Calendar
                {...field}
                mode="single"
                selected={field.value}
                month={month}
                captionLayout="dropdown"
                onMonthChange={setMonth}
                disabled={disabled}
                onSelect={(date) => {
                  field.onChange(date);
                  setValue(formatDate(date));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
