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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Bell, User, Settings, LogOut, Wifi } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useFilter } from "@/lib/filter-context";
import { Link, useLocation } from "wouter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Header({ title }: { title: string }) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const { factory, setFactory, process, setProcess, equipment, setEquipment } = useFilter();
  const [, setLocation] = useLocation();

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          FDC Module <span className="text-foreground mx-2">/</span> {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* System Status Indicator */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100 mr-2 cursor-help">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-[10px] font-medium text-emerald-700 uppercase tracking-wide">System Normal</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <p className="font-semibold">Data Collection Active</p>
                <p className="text-muted-foreground">All sensors reporting normally</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Context Selectors */}
        <div className="flex items-center gap-2 mr-4">
          <Select value={factory} onValueChange={setFactory}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Select Factory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Factories</SelectItem>
              <SelectItem value="factory-a">Factory Alpha</SelectItem>
              <SelectItem value="factory-b">Factory Beta</SelectItem>
            </SelectContent>
          </Select>

          <Select value={process} onValueChange={setProcess}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Select Process" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Processes</SelectItem>
              <SelectItem value="process-1">Etching Line A</SelectItem>
              <SelectItem value="process-2">Assembly Line B</SelectItem>
            </SelectContent>
          </Select>

          <Select value={equipment} onValueChange={setEquipment}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Select Equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Equipment</SelectItem>
              <SelectItem value="equip-1">Robot Arm K-200</SelectItem>
              <SelectItem value="equip-2">Conveyor Belt M-4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[260px] h-8 justify-start text-left font-normal text-xs",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-3 w-3" />
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
          <PopoverContent className="w-auto p-0" align="end">
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

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Jane Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  jane.doe@sensorqubit.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/fdc/settings">
                <User className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/fdc/settings">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setLocation("/login")} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}