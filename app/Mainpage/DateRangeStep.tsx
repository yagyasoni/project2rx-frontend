import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import axios from "axios";

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
  const formatDate = (date?: Date) => (date ? format(date, "yyyy-MM-dd") : "");

  const handleSubmit = async () => {
    const inventory_start_date = formatDate(inventoryStartDate);
    const inventory_end_date = formatDate(inventoryEndDate);
    const wholesaler_start_date = formatDate(wholesalerStartDate);
    const wholesaler_end_date = formatDate(wholesalerEndDate);

    try {
      const id = localStorage.getItem("auditId");
      const res = await axios.patch(
        `http://localhost:5000/api/audits/${id}/dates`,
        {
          inventory_start_date,
          inventory_end_date,
          wholesaler_start_date,
          wholesaler_end_date,
        },
      );
      console.log(res.data);
      alert("success");
      onContinue();
    } catch (err) {
      alert("failed");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
        <div className="mb-6">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            INVENTORY REPORT
          </span>
          <h2 className="text-2xl font-bold text-foreground mt-1">
            Select Dates
          </h2>
        </div>

        <div className="space-y-8">
          {/* Inventory Dates */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                Inventory Dates
              </h3>
              <Badge variant="outline" className="text-xs">
                BILLED
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  START DATE
                </Label>
                <DatePicker
                  date={inventoryStartDate}
                  setDate={setInventoryStartDate}
                />
              </div>

              <span className="text-muted-foreground mt-6">to</span>

              <div className="flex-1 space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  END DATE
                </Label>
                <DatePicker
                  date={inventoryEndDate}
                  setDate={setInventoryEndDate}
                />
              </div>
            </div>
          </div>

          {/* Wholesaler Dates */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                Wholesaler Dates
              </h3>
              <Badge variant="outline" className="text-xs">
                ORDERED
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  START DATE
                </Label>
                <DatePicker
                  date={wholesalerStartDate}
                  setDate={setWholesalerStartDate}
                />
              </div>

              <span className="text-muted-foreground mt-6">to</span>

              <div className="flex-1 space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  END DATE
                </Label>
                <DatePicker
                  date={wholesalerEndDate}
                  setDate={setWholesalerEndDate}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => {
                handleSubmit();
                // onContinue;
              }}
              className="px-8 text-white bg-gradient-to-r from-[#0D0D0D] to-[#404040] transition"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const DatePicker = ({ date, setDate }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MM/dd/yyyy") : "mm/dd/yyyy"}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0 bg-white">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          classNames={{
            months: "flex flex-col",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            table: "w-full border-collapse",
            head_row: "grid grid-cols-7",
            head_cell:
              "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "grid grid-cols-7 mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative",
            day: "h-9 w-9 p-0 font-normal",
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeStep;
