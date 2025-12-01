import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Bell } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Header({ title }: { title: string }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          FDC Module <span className="text-foreground mx-2">/</span> {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Context Selectors */}
        <div className="flex items-center gap-2 mr-4">
          <Select defaultValue="factory-a">
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Select Factory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="factory-a">Factory Alpha</SelectItem>
              <SelectItem value="factory-b">Factory Beta</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="process-1">
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Select Process" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="process-1">Etching Line A</SelectItem>
              <SelectItem value="process-2">Assembly Line B</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="equip-1">
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Select Equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equip-1">Robot Arm K-200</SelectItem>
              <SelectItem value="equip-2">Conveyor Belt M-4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[140px] h-8 justify-start text-left font-normal text-xs",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-3 w-3" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
        </Button>
      </div>
    </header>
  );
}
