"use client";

import {
  CalendarDays,
  Moon,
  Pencil,
  Settings2,
  Sun,
  Table2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_COMMENT,
  EVENING_SLOTS,
  MONTHS,
  MORNING_SLOTS,
  daysInSetupMonth,
  sanitizeInitials,
  yearOptions,
  type LogSetup,
} from "./temperatureLog";

type Props = {
  setup: LogSetup;
  onChange: (next: LogSetup) => void;
  onBuild: () => void;
  hasSheet: boolean;
  expanded: boolean;
  onToggle: (open: boolean) => void;
};

type MirrorPair =
  | { am: "amInitials"; pm: "pmInitials" }
  | { am: "amComment"; pm: "pmComment" };

const labelClass = "text-xs font-semibold text-slate-700";
const chipClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[12.5px] font-medium text-slate-700";

const PERIOD_TONES = {
  am: {
    card: "border-amber-200/70 bg-amber-50/40",
    icon: "bg-amber-100 text-amber-700",
    Icon: Sun,
    title: "Morning",
    range: "00:00 – 11:59",
    slots: MORNING_SLOTS,
  },
  pm: {
    card: "border-indigo-200/70 bg-indigo-50/40",
    icon: "bg-indigo-100 text-indigo-700",
    Icon: Moon,
    title: "Evening",
    range: "12:00 – 23:59",
    slots: EVENING_SLOTS,
  },
} satisfies Record<
  "am" | "pm",
  {
    card: string;
    icon: string;
    Icon: LucideIcon;
    title: string;
    range: string;
    slots: string[];
  }
>;

export default function SetupPanel({
  setup,
  onChange,
  onBuild,
  hasSheet,
  expanded,
  onToggle,
}: Props) {
  const dayCount = daysInSetupMonth(setup);
  const monthLabel = `${MONTHS[setup.month]} ${setup.year}`;
  const years = yearOptions(setup.year);

  const update = <K extends keyof LogSetup>(key: K, value: LogSetup[K]) =>
    onChange({ ...setup, [key]: value });

  // The evening value follows the morning value until the user gives it its own text.
  const updateMirrored = (pair: MirrorPair, value: string) => {
    const next: LogSetup = { ...setup };
    const followsMorning = setup[pair.pm] === setup[pair.am];
    next[pair.am] = value;
    if (followsMorning) next[pair.pm] = value;
    onChange(next);
  };

  const initialsMirrored = setup.pmInitials === setup.amInitials;
  const commentMirrored = setup.pmComment === setup.amComment;

  /* ── Collapsed summary ── */
  if (hasSheet && !expanded) {
    return (
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 mr-auto min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <Settings2 className="h-4 w-4 text-slate-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Setup
            </p>
            <p className="text-sm font-semibold text-slate-900 truncate">
              {setup.location.trim() || "Pharmacy"} · {monthLabel}
            </p>
          </div>
        </div>

        <span className={chipClass}>
          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
          {dayCount} days
        </span>
        <span className={chipClass}>
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          {setup.amTime}
        </span>
        <span className={chipClass}>
          <Moon className="h-3.5 w-3.5 text-indigo-500" />
          {setup.pmTime}
        </span>
        <span className={chipClass}>
          <span className="text-slate-400">Initials</span>
          <span className="tracking-widest">
            {setup.amInitials || "—"} / {setup.pmInitials || "—"}
          </span>
        </span>

        <Button variant="outline" size="sm" onClick={() => onToggle(true)}>
          <Pencil className="h-3.5 w-3.5" />
          Edit setup
        </Button>
      </section>
    );
  }

  /* ── Full form ── */
  return (
    <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <Settings2 className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
              Setup
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pick the month and the defaults that fill every row. Any cell can
              still be edited afterwards.
            </p>
          </div>
        </div>

        {hasSheet && (
          <Button variant="ghost" size="sm" onClick={() => onToggle(false)}>
            Collapse
          </Button>
        )}
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Location + period */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="xl:col-span-2 space-y-1.5">
            <Label htmlFor="tl-location" className={labelClass}>
              Location name
            </Label>
            <Input
              id="tl-location"
              value={setup.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Bergen Road"
              className="h-10"
            />
            <p className="text-[11px] text-slate-400">
              Used in the sheet title and the exported file name.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className={labelClass}>Month</Label>
            <Select
              value={String(setup.month)}
              onValueChange={(v) => update("month", Number(v))}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={String(i)} className="cursor-pointer">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className={labelClass}>Year</Label>
            <Select
              value={String(setup.year)}
              onValueChange={(v) => update("year", Number(v))}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)} className="cursor-pointer">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Morning / evening defaults */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(["am", "pm"] as const).map((period) => {
            const tone = PERIOD_TONES[period];
            const timeKey = period === "am" ? "amTime" : "pmTime";
            const initialsKey = period === "am" ? "amInitials" : "pmInitials";
            const commentKey = period === "am" ? "amComment" : "pmComment";
            const Icon = tone.Icon;

            return (
              <div
                key={period}
                className={`rounded-xl border p-4 space-y-4 ${tone.card}`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone.icon}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 leading-tight">
                      {tone.title}
                    </p>
                    <p className="text-[11px] text-slate-500 tabular-nums">
                      {tone.range}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-3">
                  <div className="space-y-1.5">
                    <Label className={labelClass}>Reading time</Label>
                    <Select
                      value={setup[timeKey]}
                      onValueChange={(v) => update(timeKey, v)}
                    >
                      <SelectTrigger className="h-10 bg-white tabular-nums">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {tone.slots.map((slot) => (
                          <SelectItem
                            key={slot}
                            value={slot}
                            className="cursor-pointer tabular-nums"
                          >
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`tl-${period}-initials`} className={labelClass}>
                      Staff initials
                    </Label>
                    <Input
                      id={`tl-${period}-initials`}
                      value={setup[initialsKey]}
                      maxLength={4}
                      autoComplete="off"
                      spellCheck={false}
                      onChange={(e) => {
                        const value = sanitizeInitials(e.target.value);
                        if (period === "am") {
                          updateMirrored(
                            { am: "amInitials", pm: "pmInitials" },
                            value,
                          );
                        } else {
                          update("pmInitials", value);
                        }
                      }}
                      placeholder="e.g. IA"
                      className="h-10 bg-white font-semibold uppercase tracking-[0.2em] placeholder:tracking-normal placeholder:font-normal"
                    />
                    {period === "pm" && initialsMirrored && (
                      <p className="text-[11px] text-slate-400">
                        Follows morning until you change it.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor={`tl-${period}-comment`} className={labelClass}>
                      Default comment
                    </Label>
                    <Input
                      id={`tl-${period}-comment`}
                      value={setup[commentKey]}
                      onChange={(e) => {
                        if (period === "am") {
                          updateMirrored(
                            { am: "amComment", pm: "pmComment" },
                            e.target.value,
                          );
                        } else {
                          update("pmComment", e.target.value);
                        }
                      }}
                      placeholder={DEFAULT_COMMENT}
                      className="h-10 bg-white"
                    />
                    {period === "pm" && commentMirrored && (
                      <p className="text-[11px] text-slate-400">
                        Follows morning until you change it.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-xl flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <Table2 className="h-3.5 w-3.5 text-slate-400" />
          Builds {dayCount} rows for {monthLabel}, one per day, each with
          morning and evening readings.
        </p>
        <Button
          onClick={onBuild}
          className="h-10 px-5 bg-slate-900 text-white hover:bg-slate-800"
        >
          {hasSheet ? "Rebuild log sheet" : "Build log sheet"}
        </Button>
      </div>
    </section>
  );
}
