"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { es } from "date-fns/locale";

interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  label?: string;
  placeholder?: string;
}

export function DatePicker({ value, onChange, label, placeholder = "Seleccionar fecha" }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</span>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white cursor-pointer",
              !value && "text-slate-500 dark:text-zinc-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "dd/MM/yyyy") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800" align="start">
          <Calendar
            mode="single"
            locale={es}
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            initialFocus
            className="p-3"
            classNames={{
                day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white",
                day_today: "bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white",
                day: "text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer",
                head_cell: "text-slate-500 dark:text-zinc-400 font-normal text-[0.8rem]",
                button: "hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-900 dark:text-white rounded-md cursor-pointer"
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
