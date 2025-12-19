import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle2, Clock, Server, ArrowRight, Gauge, Zap, Waves, GripVertical, Search, ListFilter, ArrowUpDown, Columns } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilter } from "@/lib/filter-context";
import { useMemo, useState, useRef, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Original Data Sets
const kpiDataAll = [
  { title: "Equipment Status", value: "98.2%", sub: "Operational", icon: Server, color: "text-emerald-500" },
  { title: "Active Faults", value: "3", sub: "Requires Attention", icon: AlertTriangle, color: "text-destructive", isAlert: true },
  { title: "Quality Rate", value: "99.9%", sub: "+0.2% vs last week", icon: CheckCircle2, color: "text-blue-500" },
  { title: "Avg Detection Time", value: "42ms", sub: "Real-time", icon: Clock, color: "text-purple-500" },
];

const kpiDataFiltered = [
  { title: "Equipment Status", value: "94.5%", sub: "Maintenance Req", icon: Server, color: "text-amber-500" },
  { title: "Active Faults", value: "1", sub: "Critical Error", icon: AlertTriangle, color: "text-destructive", isAlert: true },
  { title: "Quality Rate", value: "98.1%", sub: "-1.2% vs last week", icon: CheckCircle2, color: "text-amber-500" },
  { title: "Avg Detection Time", value: "156ms", sub: "Latency Detected", icon: Clock, color: "text-purple-500" },
];

const sensorDataAll = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  vibration: Math.random() * 40 + 20,
  temperature: Math.random() * 20 + 60,
  pressure: Math.random() * 10 + 90,
}));

const sensorDataFiltered = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  vibration: Math.random() * 80 + 40, // Higher vibration
  temperature: Math.random() * 10 + 80, // Higher temp
  pressure: Math.random() * 20 + 40, // Lower pressure
}));

const faultDataAll = [
  { name: "Overheat", count: 12 },
  { name: "Vibration", count: 8 },
  { name: "Pressure Drop", count: 5 },
  { name: "Sensor Drift", count: 3 },
  { name: "Comm Error", count: 2 },
];

const faultDataFiltered = [
  { name: "Overheat", count: 45 },
  { name: "Vibration", count: 2 },
  { name: "Pressure Drop", count: 1 },
  { name: "Sensor Drift", count: 0 },
  { name: "Comm Error", count: 0 },
];

// Updated Alarms with Categories
interface Alarm {
  time: string;
  sensor: string;
  type: string;
  category: 'data' | 'physical' | 'cause';
  color: string;
  factory: string;
  product: string;
  process: string;
  equipment: string;
}

const sensorCategories = [
  { id: "all", label: "All" },
  { id: "temp", label: "Temperature" },
  { id: "pressure", label: "Pressure" },
  { id: "flow", label: "Flow Rate" },
  { id: "power", label: "Power" },
];

const faultySensorsData: Record<string, { name: string; count: number }[]> = {
  all: [
    { name: "Flow Meter #2", count: 22 },
    { name: "Temp Sensor #4", count: 18 },
    { name: "Pressure Gauge A", count: 15 },
    { name: "Temp Sensor #2", count: 12 },
    { name: "Main Rectifier", count: 11 },
  ],
  temp: [
    { name: "Temp Sensor #4", count: 18 },
    { name: "Temp Sensor #2", count: 12 },
    { name: "Temp Sensor #8", count: 7 },
    { name: "Temp Sensor #1", count: 4 },
    { name: "Temp Sensor #5", count: 2 },
  ],
  pressure: [
    { name: "Pressure Gauge A", count: 15 },
    { name: "Pressure Gauge C", count: 9 },
    { name: "Pressure Gauge B", count: 6 },
    { name: "Vacuum Sensor", count: 3 },
  ],
  flow: [
    { name: "Flow Meter #2", count: 22 },
    { name: "Flow Meter #1", count: 8 },
    { name: "Main Valve Flow", count: 5 },
    { name: "Coolant Flow", count: 4 },
  ],
  power: [
    { name: "Main Rectifier", count: 11 },
    { name: "Backup PSU", count: 6 },
    { name: "Surge Protector", count: 4 },
    { name: "Distribution Unit", count: 2 },
  ],
  other: []
};

const recentAlarmsAll: Alarm[] = [
  { time: "6:48:50 AM", sensor: "Vibration Sensor X-Axis", type: "Drift", category: 'data', color: "bg-blue-100 text-blue-800", factory: "Factory Alpha", product: "Wafer-200mm", process: "Etching", equipment: "Etcher-A" },
  { time: "6:47:50 AM", sensor: "Temp Sensor #4", type: "Spike", category: 'data', color: "bg-blue-100 text-blue-800", factory: "Factory Beta", product: "Wafer-300mm", process: "Deposition", equipment: "Depo-Chamber-1" },
  { time: "6:46:50 AM", sensor: "Pressure Gauge A", type: "LowSignal", category: 'data', color: "bg-blue-100 text-blue-800", factory: "Factory Alpha", product: "Wafer-200mm", process: "Etching", equipment: "Pump-Main" },
  { time: "6:45:50 AM", sensor: "Vibration Sensor Y-Axis", type: "Drift", category: 'data', color: "bg-blue-100 text-blue-800", factory: "Factory Alpha", product: "Wafer-200mm", process: "Cleaning", equipment: "Washer-2" },
  { time: "6:44:50 AM", sensor: "Cooling Fan RPM", type: "Equipment Failure", category: 'cause', color: "bg-red-100 text-red-800", factory: "Factory Beta", product: "Wafer-300mm", process: "Lithography", equipment: "Scanner-X" },
  { time: "6:43:50 AM", sensor: "Flow Rate Meter", type: "Dimensional Fault", category: 'physical', color: "bg-amber-100 text-amber-800", factory: "Factory Alpha", product: "Wafer-200mm", process: "Etching", equipment: "Flow-Controller-2" },
  { time: "6:42:50 AM", sensor: "Vibration Sensor Z-Axis", type: "Drift", category: 'data', color: "bg-blue-100 text-blue-800", factory: "Factory Alpha", product: "Wafer-200mm", process: "Etching", equipment: "Etcher-A" },
  { time: "6:41:50 AM", sensor: "Temp Sensor #2", type: "Spike", category: 'data', color: "bg-blue-100 text-blue-800", factory: "Factory Beta", product: "Wafer-300mm", process: "Deposition", equipment: "Depo-Chamber-1" },
  { time: "6:40:50 AM", sensor: "Surface Scanner", type: "Scratch Detected", category: 'physical', color: "bg-amber-100 text-amber-800", factory: "Factory Alpha", product: "Wafer-200mm", process: "Inspection", equipment: "AOI-System-1" },
  { time: "6:39:50 AM", sensor: "Gas Flow Controller", type: "Process Recipe Error", category: 'cause', color: "bg-red-100 text-red-800", factory: "Factory Beta", product: "Wafer-300mm", process: "Deposition", equipment: "MFC-Cluster" },
];

const recentAlarmsFiltered: Alarm[] = [
  { time: "6:48:50 AM", sensor: "Vibration Sensor X-Axis", type: "Critical Spike", category: 'data', color: "bg-red-100 text-red-800", factory: "Factory Alpha", product: "Wafer-200mm", process: "Etching", equipment: "Etcher-A" },
  { time: "6:45:50 AM", sensor: "Vibration Sensor X-Axis", type: "Equipment Malfunction", category: 'cause', color: "bg-red-100 text-red-800", factory: "Factory Alpha", product: "Wafer-200mm", process: "Etching", equipment: "Etcher-A" },
  { time: "6:42:50 AM", sensor: "Vibration Sensor X-Axis", type: "Surface Crack", category: 'physical', color: "bg-amber-100 text-amber-800", factory: "Factory Alpha", product: "Wafer-200mm", process: "Etching", equipment: "Etcher-A" },
];

const processSteps = [
  { name: "Input Feeder", status: "normal", metric: "120 units/min", efficiency: 99, icon: Zap },
  { name: "Etching", status: "normal", metric: "45°C Avg", efficiency: 98, icon: Waves },
  { name: "Washing", status: "warning", metric: "Pressure Low", efficiency: 82, icon: Gauge, issue: "Check Pump" },
  { name: "Assembly", status: "normal", metric: "0.2s Cycle", efficiency: 99, icon: Activity },
  { name: "Packaging", status: "normal", metric: "Queue: 45", efficiency: 100, icon: Server },
];

export default function Dashboard() {
  const { factory, process, equipment } = useFilter();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeFaultCategory, setActiveFaultCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  
  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    time: true,
    sensor: true,
    type: true,
    category: true,
    factory: false,
    product: false,
    process: false,
    equipment: false,
  });

  // Resizable Columns State
  // Default sizes: time, sensor, type, category
  // We'll manage column widths dynamically based on visible columns
  const [colWidths, setColWidths] = useState<number[]>([150, 300, 300, 200]);
  const isResizing = useRef<number>(-1);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  // Update column widths when visibility changes
  useEffect(() => {
    // Reset or adjust widths based on visible columns count
    // This is a simple reset logic, a more complex one would preserve existing widths
    const baseWidths = [150, 250, 250, 150]; // Base widths for core columns
    const optionalWidths = Object.values(visibleColumns).slice(4).filter(v => v).map(() => 150);
    
    // Only reset if the length doesn't match (simple heuristic to avoid resetting on every render if we were to improve this)
    // For now, let's just ensure we have enough width entries
    const visibleCount = Object.values(visibleColumns).filter(v => v).length;
    if (colWidths.length !== visibleCount) {
       // Re-calculate widths
       const newWidths: number[] = [];
       if (visibleColumns.time) newWidths.push(150);
       if (visibleColumns.sensor) newWidths.push(250);
       if (visibleColumns.type) newWidths.push(250);
       if (visibleColumns.category) newWidths.push(150);
       if (visibleColumns.factory) newWidths.push(150);
       if (visibleColumns.product) newWidths.push(150);
       if (visibleColumns.process) newWidths.push(150);
       if (visibleColumns.equipment) newWidths.push(150);
       setColWidths(newWidths);
    }
  }, [visibleColumns]);

  // Column resize handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing.current >= 0) {
        const delta = e.clientX - startX.current;
        const newWidths = [...colWidths];
        newWidths[isResizing.current] = Math.max(100, startWidth.current + delta);
        setColWidths(newWidths);
      }
    };

    const handleMouseUp = () => {
      if (isResizing.current >= 0) {
        isResizing.current = -1;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [colWidths]);

  const startResize = (index: number, e: React.MouseEvent) => {
    isResizing.current = index;
    startX.current = e.clientX;
    startWidth.current = colWidths[index];
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Simple logic to switch data based on filters
  const isFiltered = factory !== "all" || process !== "all" || equipment !== "all";
  
  const kpiData = isFiltered ? kpiDataFiltered : kpiDataAll;
  const sensorData = isFiltered ? sensorDataFiltered : sensorDataAll;
  const faultData = isFiltered ? faultDataFiltered : faultDataAll;
  const recentAlarmsRaw = isFiltered ? recentAlarmsFiltered : recentAlarmsAll;

  // Fault Data based on category
  const currentFaultData = useMemo(() => {
    return faultySensorsData[activeFaultCategory] || [];
  }, [activeFaultCategory]);

  const recentAlarms = useMemo(() => {
    let filtered = recentAlarmsRaw;
    
    // Category Filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(alarm => alarm.category === activeFilter);
    }
    
    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(alarm => 
        alarm.sensor.toLowerCase().includes(q) || 
        alarm.type.toLowerCase().includes(q)
      );
    }

    // Sort
    return [...filtered].sort((a, b) => {
      // Assuming time format "6:48:50 AM" - simple string compare works for same day
      // For robust sorting we'd parse dates, but this is mockup data
      if (sortOrder === "newest") return b.time.localeCompare(a.time);
      if (sortOrder === "oldest") return a.time.localeCompare(b.time);
      if (sortOrder === "sensor") return a.sensor.localeCompare(b.sensor);
      if (sortOrder === "type") return a.type.localeCompare(b.type);
      return 0;
    });
  }, [recentAlarmsRaw, activeFilter, searchQuery, sortOrder]);

  const filteredTitle = useMemo(() => {
    if (!isFiltered) return "Overview (All Factories)";
    const parts = [];
    if (factory !== "all") parts.push(factory === "factory-a" ? "Factory Alpha" : "Factory Beta");
    if (process !== "all") parts.push(process === "process-1" ? "Etching Line A" : "Assembly Line B");
    if (equipment !== "all") parts.push(equipment === "equip-1" ? "Robot Arm K-200" : "Conveyor Belt M-4");
    return `Overview: ${parts.join(" > ")}`;
  }, [factory, process, equipment, isFiltered]);

  // Dynamic grid style
  const gridTemplateColumns = colWidths.map(w => `${w}px`).join(' ');

  return (
    <AppLayout title={filteredTitle}>
      <div className="space-y-6">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi) => (
            <Card 
              key={kpi.title} 
              className={`shadow-sm border-border/60 ${kpi.isAlert ? 'bg-destructive/10 border-destructive/50' : ''}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className={`text-sm font-medium ${kpi.isAlert ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                  {kpi.title}
                </CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${kpi.isAlert ? 'text-destructive' : ''}`}>{kpi.value}</div>
                <p className={`text-xs mt-1 ${kpi.isAlert ? 'text-destructive/80 font-medium' : 'text-muted-foreground'}`}>{kpi.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Overview Panel - Enhanced */}
        <Card className="shadow-sm border-border/60 overflow-hidden">
          <CardHeader className="pb-4 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Real-time Process Insights</CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                 <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Normal</span>
                 <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Warning</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 overflow-x-auto">
            <div className="min-w-[800px] flex items-center justify-between">
              
              {processSteps.map((step, i) => {
                const isWarning = step.status === "warning";
                return (
                  <div key={step.name} className="flex items-center flex-1 last:flex-none">
                     <div className={`
                        relative w-40 p-3 rounded-lg border-2 bg-background transition-all duration-300 hover:shadow-md hover:-translate-y-1 z-10
                        ${isWarning ? 'border-amber-500/50 bg-amber-50/50' : 'border-border hover:border-primary/50'}
                     `}>
                        <div className="flex items-center justify-between mb-2">
                           <span className={`text-xs font-bold uppercase ${isWarning ? 'text-amber-600' : 'text-muted-foreground'}`}>
                             {step.name}
                           </span>
                           {isWarning ? 
                             <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" /> : 
                             <step.icon className="w-4 h-4 text-emerald-500" />
                           }
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-end gap-1">
                             <span className="text-lg font-bold leading-none">{step.efficiency}%</span>
                             <span className="text-[10px] text-muted-foreground mb-0.5">Eff.</span>
                          </div>
                          <div className={`text-xs font-medium ${isWarning ? 'text-amber-600' : 'text-primary'}`}>
                             {step.metric}
                          </div>
                          {step.issue && (
                            <div className="text-[10px] text-red-500 font-bold mt-1 bg-red-50 px-1 py-0.5 rounded inline-block">
                              ! {step.issue}
                            </div>
                          )}
                        </div>
                     </div>

                     {/* Connection Line */}
                     {i < processSteps.length - 1 && (
                       <div className="flex-1 h-[2px] bg-secondary relative mx-2 overflow-hidden">
                         <motion.div 
                           className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 w-1/2"
                           initial={{ x: "-100%" }}
                           animate={{ x: "200%" }}
                           transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
                         />
                         <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-1 text-border z-10">
                           <ArrowRight className="w-4 h-4" />
                         </div>
                       </div>
                     )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Sensor Chart */}
          <Card className="lg:col-span-2 shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Real-time Sensor Telemetry</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sensorData}>
                  <defs>
                    <linearGradient id="colorVib" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }}
                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  />
                  <Area type="monotone" dataKey="vibration" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVib)" strokeWidth={2} />
                  <Area type="monotone" dataKey="temperature" stroke="hsl(var(--chart-2))" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Fault Distribution */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Top Faulty Sensors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <ToggleGroup 
                  type="single" 
                  value={activeFaultCategory} 
                  onValueChange={(val) => val && setActiveFaultCategory(val)}
                  className="justify-start flex-wrap gap-2"
                >
                  {sensorCategories.map((cat) => {
                    // Calculate total count for the category
                    const count = faultySensorsData[cat.id]?.reduce((sum, item) => sum + item.count, 0) || 0;
                    
                    return (
                      <ToggleGroupItem 
                        key={cat.id} 
                        value={cat.id} 
                        size="sm" 
                        className="text-[10px] h-6 px-3 rounded-full border data-[state=on]:bg-primary data-[state=on]:text-primary-foreground gap-2"
                      >
                        {cat.label}
                        <span className="bg-primary-foreground/20 px-1.5 rounded-full text-[9px] font-semibold opacity-80">
                          {count}
                        </span>
                      </ToggleGroupItem>
                    );
                  })}
                </ToggleGroup>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentFaultData} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={110} 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip 
                      cursor={{fill: 'transparent'}} 
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }} 
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                      {currentFaultData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.count > 15 ? "#ef4444" : entry.count > 10 ? "#f97316" : "#f59e0b"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Recent Alarms Table */}
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-4 border-b bg-muted/20 flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between w-full">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Default Detection Alarms</CardTitle>
              <div className="text-xs text-muted-foreground animate-pulse">
                2s 간격 자동 갱신
              </div>
            </div>
            
            {/* Filter and Ordering Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search alarms..." 
                    className="pl-8 h-9 text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={activeFilter} onValueChange={setActiveFilter}>
                  <SelectTrigger className="w-[140px] h-9 text-xs">
                    <ListFilter className="w-3.5 h-3.5 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="data">Data Patterns</SelectItem>
                    <SelectItem value="physical">Physical Faults</SelectItem>
                    <SelectItem value="cause">Root Cause</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 text-xs ml-auto">
                      <Columns className="w-3.5 h-3.5 mr-2" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[150px]">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.keys(visibleColumns).map((key) => (
                      <DropdownMenuCheckboxItem
                        key={key}
                        className="capitalize"
                        checked={visibleColumns[key]}
                        onCheckedChange={(checked) => {
                          setVisibleColumns((prev) => ({
                            ...prev,
                            [key]: checked,
                          }));
                        }}
                      >
                        {key}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline-block">Sort by:</span>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[140px] h-9 text-xs">
                    <ArrowUpDown className="w-3.5 h-3.5 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Time (Newest)</SelectItem>
                    <SelectItem value="oldest">Time (Oldest)</SelectItem>
                    <SelectItem value="sensor">Sensor Name</SelectItem>
                    <SelectItem value="type">Fault Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-auto">
            <div className="min-w-max">
              <div className="grid border-b bg-muted/50 text-xs font-medium text-muted-foreground" style={{ gridTemplateColumns }}>
                {/* Header with Resizers */}
                {Object.keys(visibleColumns).filter(k => visibleColumns[k]).map((header, index) => (
                  <div key={header} className="relative px-4 py-2 border-r border-border/50 flex items-center justify-between group select-none capitalize">
                    <span className={header === 'Category' ? 'text-left' : ''}>{header}</span>
                    <div 
                      className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors z-10"
                      onMouseDown={(e) => startResize(index, e)}
                    />
                  </div>
                ))}
              </div>
              <div className="divide-y">
                {recentAlarms.length > 0 ? (
                  recentAlarms.map((alarm, i) => (
                    <div key={i} className="grid hover:bg-muted/50 items-center transition-colors" style={{ gridTemplateColumns }}>
                      {visibleColumns.time && <div className="px-4 py-3 font-medium text-xs border-r border-border/50 h-full flex items-center truncate">{alarm.time}</div>}
                      {visibleColumns.sensor && (
                        <div className="px-4 py-3 border-r border-border/50 h-full flex items-center truncate">
                          <Badge variant="outline" className="text-xs font-normal bg-slate-100 text-slate-600 border-slate-200">
                            {alarm.sensor}
                          </Badge>
                        </div>
                      )}
                      {visibleColumns.type && (
                        <div className="px-4 py-3 border-r border-border/50 h-full flex items-center truncate">
                          <Badge variant="secondary" className={`text-xs font-normal border-none ${alarm.color}`}>
                            {alarm.type}
                          </Badge>
                        </div>
                      )}
                      {visibleColumns.category && (
                        <div className="px-4 py-3 text-left text-xs text-muted-foreground capitalize h-full flex items-center truncate border-r border-border/50">
                          {alarm.category}
                        </div>
                      )}
                      {visibleColumns.factory && <div className="px-4 py-3 text-xs text-muted-foreground border-r border-border/50 h-full flex items-center truncate">{alarm.factory}</div>}
                      {visibleColumns.product && <div className="px-4 py-3 text-xs text-muted-foreground border-r border-border/50 h-full flex items-center truncate">{alarm.product}</div>}
                      {visibleColumns.process && <div className="px-4 py-3 text-xs text-muted-foreground border-r border-border/50 h-full flex items-center truncate">{alarm.process}</div>}
                      {visibleColumns.equipment && <div className="px-4 py-3 text-xs text-muted-foreground border-r border-border/50 h-full flex items-center truncate">{alarm.equipment}</div>}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No alarms found for this category.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
