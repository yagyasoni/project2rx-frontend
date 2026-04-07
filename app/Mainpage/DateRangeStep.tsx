import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DateRangeStepProps {
  inventoryStartDate: Date | undefined;
  setInventoryStartDate: (date: Date | undefined) => void;
  inventoryEndDate: Date | undefined;
  setInventoryEndDate: (date: Date | undefined) => void;
  wholesalerStartDate: Date | undefined;
  setWholesalerStartDate: (date: Date | undefined) => void;
  wholesalerEndDate: Date | undefined;
  setWholesalerEndDate: (date: Date | undefined) => void;
  onContinue: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const pad = (n: number) => String(n).padStart(2, "0");

function formatDisplay(d: Date | undefined) {
  if (!d) return "";
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

function parseInput(raw: string): Date | undefined {
  // Accept MM/DD/YYYY or MM-DD-YYYY
  const clean = raw.replace(/-/g, "/").trim();
  const parts = clean.split("/");
  if (parts.length !== 3) return undefined;
  const [m, d, y] = parts.map(Number);
  if (!m || !d || !y || y < 1900 || y > 2100) return undefined;
  const date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) return undefined;
  return date;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date | undefined, b: Date | undefined) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInRange(d: Date, start: Date | undefined, end: Date | undefined) {
  if (!start || !end) return false;
  const t = d.getTime();
  return t > start.getTime() && t < end.getTime();
}

// ─── Custom Calendar ──────────────────────────────────────────────────────────

interface CalendarDropdownProps {
  selected: Date | undefined;
  onSelect: (d: Date) => void;
  rangeStart?: Date;
  rangeEnd?: Date;
  onClose: () => void;
}

function CalendarDropdown({
  selected,
  onSelect,
  rangeStart,
  rangeEnd,
  onClose,
}: CalendarDropdownProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(
    selected?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    selected?.getMonth() ?? today.getMonth(),
  );
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const yearRange = Array.from(
    { length: 30 },
    (_, i) => today.getFullYear() - 10 + i,
  );

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-72 select-none"
      style={{ minWidth: 280 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        <div className="flex gap-1">
          <button
            onClick={() => {
              setShowMonthPicker((v) => !v);
              setShowYearPicker(false);
            }}
            className="px-2 py-1 text-sm font-semibold hover:bg-gray-100 rounded-lg transition"
          >
            {MONTHS[viewMonth]}
          </button>
          <button
            onClick={() => {
              setShowYearPicker((v) => !v);
              setShowMonthPicker(false);
            }}
            className="px-2 py-1 text-sm font-semibold hover:bg-gray-100 rounded-lg transition"
          >
            {viewYear}
          </button>
        </div>

        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Month Picker Overlay */}
      {showMonthPicker && (
        <div className="grid grid-cols-3 gap-1 mb-3">
          {MONTHS.map((m, i) => (
            <button
              key={m}
              onClick={() => {
                setViewMonth(i);
                setShowMonthPicker(false);
              }}
              className={`py-1.5 text-xs rounded-lg transition font-medium ${
                i === viewMonth
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
      )}

      {/* Year Picker Overlay */}
      {showYearPicker && (
        <div className="grid grid-cols-4 gap-1 mb-3 max-h-40 overflow-y-auto">
          {yearRange.map((y) => (
            <button
              key={y}
              onClick={() => {
                setViewYear(y);
                setShowYearPicker(false);
              }}
              className={`py-1.5 text-xs rounded-lg transition font-medium ${
                y === viewYear
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      {!showMonthPicker && !showYearPicker && (
        <>
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-medium text-gray-400 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const thisDate = new Date(viewYear, viewMonth, day);
              const isSelected = isSameDay(thisDate, selected);
              const isStart = isSameDay(thisDate, rangeStart);
              const isEnd = isSameDay(thisDate, rangeEnd);
              const inRange = isInRange(thisDate, rangeStart, rangeEnd);
              const isToday = isSameDay(thisDate, today);

              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelect(thisDate);
                    onClose();
                  }}
                  className={`
                    relative h-9 w-full flex items-center justify-center text-sm rounded-lg transition-all
                    ${
                      isSelected || isStart || isEnd
                        ? "bg-gray-900 text-white font-semibold shadow-md"
                        : inRange
                          ? "bg-gray-100 text-gray-800"
                          : "hover:bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  {day}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Today shortcut */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => {
                onSelect(today);
                onClose();
              }}
              className="w-full text-xs text-center text-gray-500 hover:text-gray-900 transition font-medium"
            >
              Today — {MONTHS[today.getMonth()]} {today.getDate()},{" "}
              {today.getFullYear()}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Smart Date Input ─────────────────────────────────────────────────────────

interface SmartDateInputProps {
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
  rangeStart?: Date;
  rangeEnd?: Date;
  placeholder?: string;
}

function SmartDateInput({
  date,
  setDate,
  rangeStart,
  rangeEnd,
  placeholder = "MM/DD/YYYY",
}: SmartDateInputProps) {
  const [inputVal, setInputVal] = useState(formatDisplay(date));
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync when external date changes
  useEffect(() => {
    setInputVal(formatDisplay(date));
    setError(false);
  }, [date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Auto-insert slashes on typing digits
    val = val.replace(/[^0-9/]/g, "");
    if (val.length === 2 && inputVal.length === 1) val += "/";
    if (val.length === 5 && inputVal.length === 4) val += "/";
    if (val.length > 10) val = val.slice(0, 10);

    setInputVal(val);
    setError(false);

    if (val.length === 10) {
      const parsed = parseInput(val);
      if (parsed) {
        setDate(parsed);
        setError(false);
      } else {
        setError(true);
      }
    } else if (val === "") {
      setDate(undefined);
    }
  };

  const handleBlur = () => {
    if (inputVal && inputVal.length < 10) {
      const parsed = parseInput(inputVal);
      if (parsed) {
        setDate(parsed);
        setInputVal(formatDisplay(parsed));
        setError(false);
      } else if (inputVal.length > 0) {
        setError(true);
      }
    }
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDate(undefined);
    setInputVal("");
    setError(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`
          flex items-center gap-2 w-full h-10 px-3 rounded-lg border text-sm transition-all cursor-text
          ${error ? "border-red-400 bg-red-50" : open ? "border-gray-900 ring-2 ring-gray-900/10" : "border-gray-200 hover:border-gray-300 bg-white"}
        `}
        onClick={() => setOpen(true)}
      >
        <CalendarIcon
          className={`w-4 h-4 flex-shrink-0 ${error ? "text-red-400" : "text-gray-400"}`}
        />
        <input
          type="text"
          value={inputVal}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          maxLength={10}
          className={`flex-1 bg-transparent outline-none placeholder:text-gray-300 ${error ? "text-red-500" : "text-gray-800"}`}
        />
        {(inputVal || date) && (
          <button
            onClick={clear}
            className="p-0.5 hover:bg-gray-100 rounded transition flex-shrink-0"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">
          Invalid date. Use MM/DD/YYYY
        </p>
      )}

      {date && !error && (
        <p className="text-xs text-gray-400 mt-1 font-medium">
          {MONTHS[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
        </p>
      )}

      {open && (
        <CalendarDropdown
          selected={date}
          onSelect={(d) => {
            setDate(d);
            setInputVal(formatDisplay(d));
            setError(false);
          }}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const DateRangeStep = ({
  inventoryStartDate,
  setInventoryStartDate,
  inventoryEndDate,
  setInventoryEndDate,
  wholesalerStartDate,
  setWholesalerStartDate,
  wholesalerEndDate,
  setWholesalerEndDate,
  onContinue,
}: DateRangeStepProps) => {
  const formatDate = (date?: Date) =>
    date
      ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
      : "";

  const handleSubmit = async () => {
    try {
      const id = localStorage.getItem("auditId");
      const res = await axios.patch(
        `https://api.auditprorx.com/api/audits/${id}/dates`,
        {
          inventory_start_date: formatDate(inventoryStartDate),
          inventory_end_date: formatDate(inventoryEndDate),
          wholesaler_start_date: formatDate(wholesalerStartDate),
          wholesaler_end_date: formatDate(wholesalerEndDate),
        },
      );
      console.log(res.data);
      onContinue();
    } catch (err) {
      toast("Failed to save dates. Please try again.");
    }
  };

  const allFilled =
    inventoryStartDate &&
    inventoryEndDate &&
    wholesalerStartDate &&
    wholesalerEndDate;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="mb-7">
          <span className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">
            Inventory Report
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            Select Dates
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Type or click to pick dates. Navigate months and years freely.
          </p>
        </div>

        <div className="space-y-8">
          {/* Inventory Dates */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">
                Inventory Dates
              </h3>
              <Badge
                variant="outline"
                className="text-[11px] font-semibold tracking-wide"
              >
                BILLED
              </Badge>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-1.5">
                <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">
                  Start Date
                </Label>
                <SmartDateInput
                  date={inventoryStartDate}
                  setDate={setInventoryStartDate}
                  rangeEnd={inventoryEndDate}
                />
              </div>
              <span className="text-gray-300 mt-[38px] text-lg">→</span>
              <div className="flex-1 space-y-1.5">
                <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">
                  End Date
                </Label>
                <SmartDateInput
                  date={inventoryEndDate}
                  setDate={setInventoryEndDate}
                  rangeStart={inventoryStartDate}
                />
              </div>
            </div>
            {inventoryStartDate && inventoryEndDate && (
              <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                📅 {MONTHS[inventoryStartDate.getMonth()]}{" "}
                {inventoryStartDate.getDate()} –{" "}
                {MONTHS[inventoryEndDate.getMonth()]}{" "}
                {inventoryEndDate.getDate()}, {inventoryEndDate.getFullYear()}
                <span className="ml-2 font-medium text-gray-600">
                  (
                  {Math.round(
                    (inventoryEndDate.getTime() -
                      inventoryStartDate.getTime()) /
                      86400000,
                  )}{" "}
                  days)
                </span>
              </div>
            )}
          </div>

          {/* Wholesaler Dates */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">
                Wholesaler Dates
              </h3>
              <Badge
                variant="outline"
                className="text-[11px] font-semibold tracking-wide"
              >
                ORDERED
              </Badge>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-1.5">
                <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">
                  Start Date
                </Label>
                <SmartDateInput
                  date={wholesalerStartDate}
                  setDate={setWholesalerStartDate}
                  rangeEnd={wholesalerEndDate}
                />
              </div>
              <span className="text-gray-300 mt-[38px] text-lg">→</span>
              <div className="flex-1 space-y-1.5">
                <Label className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">
                  End Date
                </Label>
                <SmartDateInput
                  date={wholesalerEndDate}
                  setDate={setWholesalerEndDate}
                  rangeStart={wholesalerStartDate}
                />
              </div>
            </div>
            {wholesalerStartDate && wholesalerEndDate && (
              <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                📅 {MONTHS[wholesalerStartDate.getMonth()]}{" "}
                {wholesalerStartDate.getDate()} –{" "}
                {MONTHS[wholesalerEndDate.getMonth()]}{" "}
                {wholesalerEndDate.getDate()}, {wholesalerEndDate.getFullYear()}
                <span className="ml-2 font-medium text-gray-600">
                  (
                  {Math.round(
                    (wholesalerEndDate.getTime() -
                      wholesalerStartDate.getTime()) /
                      86400000,
                  )}{" "}
                  days)
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              disabled={!allFilled}
              className="px-8 text-white bg-gradient-to-r from-[#0D0D0D] to-[#404040] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangeStep;
