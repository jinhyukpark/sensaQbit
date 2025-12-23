import { AppLayout } from "@/components/layout/AppLayout";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Search, Cpu, Factory, Settings2, AlertCircle, CheckSquare, Square, ArrowUpDown, Columns, ListFilter, Calendar as CalendarIcon, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { addDays, subDays, subMonths, subYears, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import robotArmImage from '@assets/generated_images/semiconductor_robot_arm_in_cleanroom.png';

// Mock Tree Data
const treeData = [
  {
    id: "fac-1",
    name: "Factory Alpha",
    type: "factory",
    children: [
      {
        id: "proc-1-1",
        name: "Etching Line A",
        type: "process",
        children: [
          { id: "eq-1-1", name: "Robot Arm K-200", type: "equipment", hasAlert: true },
          { id: "eq-1-2", name: "Conveyor Belt M-4", type: "equipment" },
        ]
      },
      {
        id: "proc-1-2",
        name: "Assembly Line B",
        type: "process",
        children: []
      }
    ]
  },
  {
    id: "fac-2",
    name: "Factory Beta",
    type: "factory",
    children: [
      {
        id: "proc-2-1",
        name: "Welding Unit C",
        type: "process",
        children: [
          { id: "eq-2-1", name: "Spot Welder X-90", type: "equipment" },
          { id: "eq-2-2", name: "Cooling System", type: "equipment" },
        ]
      }
    ]
  },
  {
    id: "fac-3",
    name: "Factory Gamma",
    type: "factory",
    children: [
      {
        id: "proc-3-1",
        name: "Packaging Line D",
        type: "process",
        children: [
          { id: "eq-3-1", name: "Packer Arm Z-10", type: "equipment" },
          { id: "eq-3-2", name: "Label Printer P-5", type: "equipment", hasAlert: true },
        ]
      }
    ]
  },
  {
    id: "fac-4",
    name: "Factory Delta",
    type: "factory",
    children: [
      {
        id: "proc-4-1",
        name: "Quality Control E",
        type: "process",
        children: [
          { id: "eq-4-1", name: "Vision Scanner V-8", type: "equipment" },
        ]
      }
    ]
  },
  {
    id: "fac-5",
    name: "Factory Epsilon",
    type: "factory",
    children: [
      {
        id: "proc-5-1",
        name: "Logistics Hub F",
        type: "process",
        children: [
          { id: "eq-5-1", name: "AGV Unit 04", type: "equipment" },
          { id: "eq-5-2", name: "AGV Unit 09", type: "equipment" },
        ]
      }
    ]
  }
];

const sensorCategories = [
  { id: "all", label: "All", count: 37 },
  { id: "temp", label: "Temperature", count: 9 },
  { id: "pressure", label: "Pressure", count: 9 },
  { id: "flow", label: "Flow Rate", count: 10 },
  { id: "power", label: "Power", count: 9 },
  { id: "other", label: "Other", count: 0 },
];

const mockSensors: Record<string, { id: string; name: string; code: string }[]> = {
  "temp": Array.from({ length: 9 }, (_, i) => ({ id: `temp-${i}`, name: `Sensor ${i * 4 + 3}`, code: `EQP-2005-S${(i * 4 + 3).toString().padStart(2, '0')}` })),
  "pressure": Array.from({ length: 9 }, (_, i) => ({ id: `press-${i}`, name: `Pressure ${i * 2 + 1}`, code: `EQP-2005-P${(i * 2 + 1).toString().padStart(2, '0')}` })),
  "flow": Array.from({ length: 10 }, (_, i) => ({ id: `flow-${i}`, name: `Flow Meter ${i + 1}`, code: `EQP-2005-F${(i + 1).toString().padStart(2, '0')}` })),
  "power": Array.from({ length: 9 }, (_, i) => ({ id: `pwr-${i}`, name: `Power Unit ${i + 5}`, code: `EQP-2005-W${(i + 5).toString().padStart(2, '0')}` })),
  "other": [],
};

// Mock Data for Table
const generateTableData = (count: number) => {
  const zones = [
    "Zone A - Pre-Heat", 
    "Zone B - Main Chamber", 
    "Zone C - Cooling", 
    "Zone D - Exhaust", 
    "Zone E - Input Buffer"
  ];
  const locations = [
    "EQP-2005-S03 (Vibration)", 
    "EQP-2005-S15 (Temp)", 
    "EQP-2005-P01 (Pressure)", 
    "EQP-2005-F02 (Flow)", 
    "EQP-2005-W05 (Power)"
  ];
  const factories = ["Factory Alpha", "Factory Beta", "Factory Gamma"];
  const products = ["Wafer-200mm", "Wafer-300mm", "PCB-MultiLayer"];
  const processes = ["Etching", "Deposition", "Cleaning", "Lithography", "Assembly"];

  return Array.from({ length: count }, (_, i) => {
    const isDefective = Math.random() > 0.85; // 15% defect rate
    let status = "Normal";
    if (isDefective) {
      const defects = ["Spike Detected", "Drift Warning", "Low Signal", "Out of Spec", "Communication Error"];
      status = defects[Math.floor(Math.random() * defects.length)];
    }

    return {
      productId: `LOT-${new Date().getFullYear()}${(Math.floor(Math.random() * 10000)).toString().padStart(4, '0')}-${(i + 1).toString().padStart(3, '0')}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      section: zones[Math.floor(Math.random() * zones.length)],
      isDefective: isDefective,
      statusText: status,
      date: new Date(Date.now() - i * 45000).toLocaleString('en-US', { 
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
      }),
      factory: factories[Math.floor(Math.random() * factories.length)],
      product: products[Math.floor(Math.random() * products.length)],
      process: processes[Math.floor(Math.random() * processes.length)],
    };
  });
};

const initialTableData = generateTableData(20);

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Area, AreaChart, ComposedChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from "recharts";

// Mock DRT Data Generator
const generateDRTData = (isDefective = false) => {
  const points: any[] = [];
  let currentValue = 50;
  
  for (let i = 0; i < 60; i++) {
    // Smooth transitions for "rising/falling" lines
    let target = 50;
    if (i >= 10 && i < 15) target = 80;
    else if (i >= 15 && i < 30) target = 70;
    else if (i >= 30 && i < 45) target = 20;
    else if (i >= 45) target = 60;
    
    // Move current value towards target (smoothing)
    currentValue = currentValue + (target - currentValue) * 0.4;
    
    // Add noise
    const noise = (Math.random() - 0.5) * 5;
    
    // Calculate range (band) based on the EXPECTED trend, not the actual faulty value
    // This ensures the band stays "normal" even when signal spikes
    const bandWidth = 10; 
    let min = currentValue - bandWidth;
    let max = currentValue + bandWidth;
    
    // Inject Fault if defective
    // We add the fault offset to the ACTUAL value, but leave the BAND alone
    let actualValue = currentValue + noise;
    
    if (isDefective) {
      // Create a ramped spike anomaly around index 32-45
      if (i >= 32 && i <= 45) {
         let offset = 0;
         // Ramp up
         if (i < 36) {
           offset = (i - 31) * 8; // 8, 16, 24, 32
         } 
         // Plateau
         else if (i <= 41) {
           offset = 35;
         }
         // Ramp down
         else {
           offset = (45 - i) * 8; // 24, 16, 8
         }
         
         actualValue = currentValue + offset + noise;
      }
    }

    const isAnomaly = actualValue > max || actualValue < min;

    points.push({
      time: i,
      value: actualValue,
      min: min,
      max: max,
      range: [min, max],
      isAnomaly,
      // We will set anomalyValue in a second pass to ensure connected lines
      anomalyValue: null
    });
  }
  
  // Second pass: Connect anomaly lines
  // If a point is an anomaly, we want the line connecting to it to be red.
  // We include the previous and next points in the "anomaly" dataset to draw the full transition.
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const prev = points[i-1];
    const next = points[i+1];
    
    if (p.isAnomaly) {
      p.anomalyValue = p.value;
      // Connect backward to start of violation
      if (prev && !prev.isAnomaly) {
        prev.anomalyValue = prev.value;
      }
      // Connect forward to end of violation
      if (next && !next.isAnomaly) {
        next.anomalyValue = next.value;
      }
    }
  }

  return points;
};

export default function HistoryPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>("eq-1");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  // Default select some sensors to show data immediately
  const [selectedSensors, setSelectedSensors] = useState<string[]>(["temp-0", "temp-1"]);
  const [filterStatus, setFilterStatus] = useState<"all" | "fault">("all");
  
  const [selectedSensorForChart, setSelectedSensorForChart] = useState<any>(null);
  
  const drtData = useMemo(() => {
    if (!selectedSensorForChart) return [];
    return generateDRTData(selectedSensorForChart.isDefective);
  }, [selectedSensorForChart]);
  
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  // Chart Selection State
  const [refAreaLeft, setRefAreaLeft] = useState<number | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  
  // Mock List of "Sensors in Area"
  const [sensorsInArea, setSensorsInArea] = useState<any[]>([]);

  const handleSelection = () => {
    if (refAreaLeft === null || refAreaRight === null) return;
    
    // Ensure left is smaller
    const left = Math.min(refAreaLeft, refAreaRight);
    const right = Math.max(refAreaLeft, refAreaRight);
    
    if (right - left < 1) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      setSensorsInArea([]);
      return;
    }

    // Mock finding sensors in this time range
    // In a real app, we'd query the backend for sensors with events in [left, right]
    const mockFound = [
      { id: "s1", name: "Temp Sensor A1", value: "85.2°C", status: "Critical", time: left + 2 },
      { id: "s2", name: "Pressure Gauge P2", value: "1200 PSI", status: "Warning", time: left + 5 },
      { id: "s3", name: "Flow Meter F5", value: "45.0 L/m", status: "Normal", time: right - 2 },
    ];
    setSensorsInArea(mockFound);
  };

  // Toolbar State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  
  // Date Range State
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    factory: true,
    product: true,
    process: true,
    productId: true,
    location: true,
    section: true,
    status: true,
    date: true,
  });

  // Resizable Columns State
  // Default sizes for: factory, product, process, productId, location, section, status, date
  const [colWidths, setColWidths] = useState<number[]>([120, 120, 120, 180, 200, 150, 120, 180]);
  const isResizing = useRef<number>(-1);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  // Column resize handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing.current >= 0) {
        const delta = e.clientX - startX.current;
        const newWidths = [...colWidths];
        newWidths[isResizing.current] = Math.max(80, startWidth.current + delta);
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

  // Update column widths when visibility changes
  useEffect(() => {
    const visibleCount = Object.values(visibleColumns).filter(v => v).length;
    if (colWidths.length !== visibleCount) {
       // Reset widths if column count changes
       // This is a simplification; in a real app we'd map IDs to widths
       const newWidths = Array(visibleCount).fill(150);
       setColWidths(newWidths);
    }
  }, [visibleColumns]);

  const startResize = (index: number, e: React.MouseEvent) => {
    isResizing.current = index;
    startX.current = e.clientX;
    startWidth.current = colWidths[index];
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Filter logic
  const currentSensors = useMemo(() => {
    if (activeCategory === "all") {
      return Object.values(mockSensors).flat();
    }
    return mockSensors[activeCategory] || [];
  }, [activeCategory]);

  const handleSelectAll = () => {
    if (selectedSensors.length === currentSensors.length) {
      setSelectedSensors([]);
    } else {
      setSelectedSensors(currentSensors.map(s => s.id));
    }
  };

  const toggleSensor = (id: string) => {
    setSelectedSensors(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // Filtered table data (mock)
  const tableData = useMemo(() => {
    if (selectedSensors.length === 0) return [];
    
    let data = initialTableData;
    
    // Status Filter
    if (filterStatus === "fault") {
      data = data.filter(d => d.isDefective);
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(d => 
        d.productId.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.section.toLowerCase().includes(q) ||
        d.factory.toLowerCase().includes(q) ||
        d.product.toLowerCase().includes(q) ||
        d.process.toLowerCase().includes(q)
      );
    }

    // Sorting
    return [...data].sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOrder === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOrder === "factory") return a.factory.localeCompare(b.factory);
      if (sortOrder === "product") return a.product.localeCompare(b.product);
      return 0;
    });
  }, [selectedSensors, filterStatus, searchQuery, sortOrder]);

  // Dynamic grid style
  const gridTemplateColumns = colWidths.map(w => `${w}px`).join(' ');

  // Column Definition helper
  const allColumns = [
    { id: 'factory', label: 'Factory' },
    { id: 'product', label: 'Product Type' },
    { id: 'process', label: 'Process' },
    { id: 'productId', label: 'Product ID' },
    { id: 'location', label: 'Sensor Location' },
    { id: 'section', label: 'Zone / Step' },
    { id: 'status', label: 'Status' },
    { id: 'date', label: 'Timestamp' },
  ];

  // Date preset helper
  const setPreset = (days?: number, months?: number, years?: number) => {
    const to = new Date();
    let from = new Date();
    if (days) from = subDays(to, days);
    if (months) from = subMonths(to, months);
    if (years) from = subYears(to, years);
    setDate({ from, to });
  };

  const activeColumns = allColumns.filter(col => visibleColumns[col.id]);

  return (
    <AppLayout title="History Analysis" hideFilters={true}>
      <div className="h-[calc(100vh-100px)] border rounded-lg overflow-hidden bg-card shadow-sm">
        <ResizablePanelGroup direction="horizontal">
          
          {/* Left Sidebar: Tree */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search sensors..." className="pl-8" />
                </div>
              </div>
              <ScrollArea className="flex-1 p-2">
                <div className="space-y-1">
                  {treeData.map((factory) => (
                    <div key={factory.id} className="text-sm">
                      <div className="flex items-center gap-2 p-2 hover:bg-accent rounded-md font-medium">
                        <Factory className="w-4 h-4 text-muted-foreground" />
                        {factory.name}
                      </div>
                      <div className="pl-4 space-y-1 mt-1">
                        {factory.children.map((process) => (
                          <div key={process.id}>
                            <div className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-muted-foreground">
                              <Settings2 className="w-3 h-3" />
                              {process.name}
                            </div>
                            <div className="pl-4 space-y-1 mt-1">
                              {process.children.map((eq) => (
                                <div 
                                  key={eq.id}
                                  onClick={() => setSelectedNode(eq.id)}
                                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${selectedNode === eq.id ? "bg-primary/10 text-primary" : "hover:bg-accent text-muted-foreground"}`}
                                >
                                  <Cpu className="w-3 h-3" />
                                  <span className="flex-1">{eq.name}</span>
                                  {eq.hasAlert && <AlertCircle className="w-3 h-3 text-amber-500" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>
          
          <ResizableHandle />

          {/* Right Content: Analytics */}
          <ResizablePanel defaultSize={isDetailsOpen ? 60 : 80} className="relative">
            {!isDetailsOpen && (
              <div className="absolute right-6 top-6 z-20 animate-in fade-in slide-in-from-right-8 duration-500">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="rounded-full shadow-lg border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-10 pl-2 pr-4 gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 group"
                   onClick={() => setIsDetailsOpen(true)}
                 >
                   <div className="bg-primary/10 p-1.5 rounded-full group-hover:bg-primary/20 transition-colors">
                     <PanelRightOpen className="h-3.5 w-3.5 text-primary" />
                   </div>
                   <span className="text-xs font-medium text-foreground/80 group-hover:text-primary transition-colors">View Details</span>
                 </Button>
              </div>
            )}
            <div className="h-full p-6 overflow-y-auto space-y-6 bg-background/50">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-background border-l-4 border-l-primary shadow-sm">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-primary">15,240</div>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Total Processed</p>
                  </CardContent>
                </Card>
                <Card className="bg-emerald-50/50 border-l-4 border-l-emerald-500 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-emerald-700">13,716 <span className="text-lg font-medium text-emerald-600/80 ml-1">(90%)</span></div>
                    <p className="text-sm font-medium text-emerald-600/80 mt-1">Normal Products</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50/50 border-l-4 border-l-destructive shadow-sm">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-destructive">1,524 <span className="text-lg font-medium text-destructive/80 ml-1">(10%)</span></div>
                    <p className="text-sm font-medium text-destructive/80 mt-1">Defective Products</p>
                  </CardContent>
                </Card>
              </div>

              {/* Sensor Telemetry Analysis Section */}
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle>Sensor Telemetry Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* 1. Category Selection */}
                  <div className="flex items-center justify-between">
                    <ToggleGroup 
                      type="single" 
                      value={activeCategory} 
                      onValueChange={(val) => val && setActiveCategory(val)}
                      className="justify-start gap-2"
                    >
                      {sensorCategories.map((cat) => (
                        <ToggleGroupItem 
                          key={cat.id} 
                          value={cat.id} 
                          className="rounded-full px-4 h-8 text-xs border data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        >
                          {cat.label} <span className="ml-1.5 opacity-70 bg-primary-foreground/20 px-1.5 rounded-full text-[10px]">{cat.count}</span>
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleSelectAll}>
                        Select All
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setSelectedSensors([])}>
                        Clear
                      </Button>
                    </div>
                  </div>

                  {/* 2. Sensor Grid Selection */}
                  <div className="grid grid-cols-4 gap-2 p-4 bg-muted/30 rounded-lg border max-h-[240px] overflow-y-auto">
                    {currentSensors.length > 0 ? (
                      currentSensors.map((sensor) => (
                        <div key={sensor.id} className="flex items-center space-x-2 p-2 hover:bg-background rounded border border-transparent hover:border-border transition-colors">
                          <Checkbox 
                            id={sensor.id} 
                            checked={selectedSensors.includes(sensor.id)}
                            onCheckedChange={() => toggleSensor(sensor.id)}
                          />
                          <div className="grid gap-0.5 leading-none">
                            <label
                              htmlFor={sensor.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {sensor.name}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {sensor.code}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-8 text-muted-foreground text-sm">
                        No sensors available in this category.
                      </div>
                    )}
                  </div>

                  {/* 3. Detailed Data Table */}
                  <div className="space-y-4">
                    {/* Toolbar */}
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="relative w-64">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search alarms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 text-sm"
                          />
                        </div>
                        
                        {/* Filter Popover */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 border-dashed">
                              <ListFilter className="mr-2 h-4 w-4" />
                              Filters
                              {filterStatus !== "all" && (
                                <span className="ml-1 rounded-full bg-primary/10 w-2 h-2" />
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0" align="end">
                            <div className="p-2">
                              <div className="space-y-2">
                                <h4 className="font-medium text-xs leading-none text-muted-foreground mb-2 px-2 pt-1">Status</h4>
                                <Select value={filterStatus} onValueChange={(val: "all" | "fault") => setFilterStatus(val)}>
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">View All</SelectItem>
                                    <SelectItem value="fault">Fault Only</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        {/* Columns Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 border-dashed">
                              <Columns className="mr-2 h-4 w-4" />
                              Columns
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[150px]">
                            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {allColumns.map((col) => (
                              <DropdownMenuCheckboxItem
                                key={col.id}
                                checked={visibleColumns[col.id]}
                                onCheckedChange={(checked) => 
                                  setVisibleColumns(prev => ({ ...prev, [col.id]: checked }))
                                }
                              >
                                {col.label}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Date Range Picker */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="date"
                              variant={"outline"}
                              size="sm"
                              className={cn(
                                "w-[240px] h-9 justify-start text-left font-normal border-dashed",
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
                            <div className="flex">
                              <div className="border-r p-2 space-y-1 w-[140px]">
                                <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 py-1">Quick Select</div>
                                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-7" onClick={() => setPreset(0)}>
                                  Today
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-7" onClick={() => setPreset(7)}>
                                  Last 7 Days
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-7" onClick={() => setPreset(undefined, 1)}>
                                  Last Month
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-7" onClick={() => setPreset(undefined, 3)}>
                                  Last 3 Months
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-7" onClick={() => setPreset(undefined, 6)}>
                                  Last 6 Months
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-7" onClick={() => setPreset(undefined, undefined, 1)}>
                                  Last Year
                                </Button>
                              </div>
                              <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Sort Dropdown - Moved to the right */}
                      <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-[160px] h-9 border-dashed">
                          <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-3.5 w-3.5" />
                            <span className="truncate">Sort: {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="factory">Factory</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Table */}
                    <div className="border rounded-md overflow-auto">
                      <div className="min-w-max">
                        {/* Table Header */}
                        <div className="grid border-b bg-muted/50 text-xs font-medium text-muted-foreground" style={{ gridTemplateColumns }}>
                          {activeColumns.map((col, index) => (
                            <div key={col.id} className="relative px-4 py-2 border-r border-border/50 flex items-center justify-between group select-none">
                              <span className="truncate">{col.label}</span>
                              <div 
                                className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors z-10"
                                onMouseDown={(e) => startResize(index, e)}
                              />
                            </div>
                          ))}
                        </div>
                        {/* Table Body */}
                        <div className="divide-y">
                          {tableData.length > 0 ? (
                            tableData.map((row, i) => (
                              <div key={i} className="grid hover:bg-muted/50 items-center transition-colors" style={{ gridTemplateColumns }}>
                                {visibleColumns.factory && (
                                  <div className="px-4 py-3 font-medium text-xs border-r border-border/50 h-full flex items-center truncate">
                                    {row.factory}
                                  </div>
                                )}
                                {visibleColumns.product && (
                                  <div className="px-4 py-3 font-medium text-xs border-r border-border/50 h-full flex items-center truncate">
                                    {row.product}
                                  </div>
                                )}
                                {visibleColumns.process && (
                                  <div className="px-4 py-3 font-medium text-xs border-r border-border/50 h-full flex items-center truncate">
                                    {row.process}
                                  </div>
                                )}
                                {visibleColumns.productId && (
                                  <div className="px-4 py-3 font-medium text-xs border-r border-border/50 h-full flex items-center truncate">
                                    {row.productId}
                                  </div>
                                )}
                                {visibleColumns.location && (
                                  <div className="px-4 py-3 border-r border-border/50 h-full flex items-center truncate">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="h-6 text-xs font-mono bg-muted/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors px-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSensorForChart(row);
                                      }}
                                    >
                                      {row.location}
                                    </Button>
                                  </div>
                                )}
                                {visibleColumns.section && (
                                  <div className="px-4 py-3 border-r border-border/50 h-full flex items-center text-muted-foreground text-xs truncate">
                                    {row.section}
                                  </div>
                                )}
                                {visibleColumns.status && (
                                  <div className="px-4 py-3 border-r border-border/50 h-full flex items-center truncate">
                                    {row.isDefective ? (
                                      <Badge variant="destructive" className="font-normal text-[10px]">{row.statusText}</Badge>
                                    ) : (
                                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-normal text-[10px]">Normal</Badge>
                                    )}
                                  </div>
                                )}
                                {visibleColumns.date && (
                                  <div className="px-4 py-3 text-muted-foreground text-xs font-mono h-full flex items-center truncate">
                                    {row.date}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                              No data found matching your filters.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {tableData.length > 0 && (
                      <div className="flex justify-end text-xs text-muted-foreground animate-pulse">
                        Live Update: Refreshing every 3s
                      </div>
                    )}
                  </div>

                </CardContent>
              </Card>

            </div>
          </ResizablePanel>
          
          {isDetailsOpen && (
            <>
              <ResizableHandle />
              
              {/* Right Sidebar: Equipment Detail */}
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <div className="h-full flex flex-col border-l">
                  <Tabs defaultValue="equipment" className="flex-1 flex flex-col w-full h-full">
                    <div className="border-b bg-muted/10 px-2 flex items-center justify-between">
                      <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0 h-11">
                        <TabsTrigger 
                          value="equipment" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-4 h-11 text-xs font-medium"
                        >
                          Equipment
                        </TabsTrigger>
                        <TabsTrigger 
                          value="product" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-4 h-11 text-xs font-medium"
                        >
                          Product
                        </TabsTrigger>
                        <TabsTrigger 
                          value="process" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-4 h-11 text-xs font-medium"
                        >
                          Process
                        </TabsTrigger>
                      </TabsList>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsDetailsOpen(false)}>
                        <PanelRightClose className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <ScrollArea className="flex-1">
                      <TabsContent value="equipment" className="m-0 p-4 space-y-6">
                        {/* Equipment Header */}
                        <div className="space-y-2">
                          <div className="h-40 bg-muted/20 rounded-lg border overflow-hidden mb-4 relative group">
                            <img 
                              src={robotArmImage} 
                              alt="Robot Arm K-200" 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                              <Badge variant="secondary" className="text-[10px] bg-white/90 text-black">Live Feed</Badge>
                            </div>
                          </div>
                          <h3 className="font-bold text-lg">{selectedNode ? "Robot Arm K-200" : "Select Equipment"}</h3>
                          <Badge variant="outline" className="font-mono text-xs">EQP-2005-S03</Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            Operational
                          </div>
                        </div>

                        {/* Specifications */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Settings2 className="w-3 h-3" /> Specifications
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm bg-muted/20 p-3 rounded-md border">
                            <div className="text-muted-foreground">Model</div>
                            <div className="font-medium text-right">K-Series 200</div>
                            
                            <div className="text-muted-foreground">Install Date</div>
                            <div className="font-medium text-right">2023-05-15</div>
                            
                            <div className="text-muted-foreground">Last Maint</div>
                            <div className="font-medium text-right">2024-11-20</div>
                            
                            <div className="text-muted-foreground">Cycle Time</div>
                            <div className="font-medium text-right">4.2s</div>
                          </div>
                        </div>

                        <div className="border-t pt-4 space-y-3">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Cpu className="w-3 h-3" /> Current Status
                          </h4>
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs">
                                <span>Load</span>
                                <span className="font-medium">78%</span>
                              </div>
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[78%] rounded-full"></div>
                              </div>
                            </div>
                            
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs">
                                <span>Temperature</span>
                                <span className="font-medium">42°C</span>
                              </div>
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[42%] rounded-full"></div>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs">
                                <span>Vibration</span>
                                <span className="font-medium text-amber-600">Warning</span>
                              </div>
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 w-[85%] rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                           <Button className="w-full" variant="outline" size="sm">View Maintenance Log</Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="product" className="m-0 p-4 space-y-6">
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg">Product Information</h3>
                          <p className="text-sm text-muted-foreground">Currently processing batch details</p>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lot Details</h4>
                          <div className="bg-card border rounded-lg p-3 space-y-3 shadow-sm">
                            <div className="flex justify-between items-center border-b pb-2">
                              <span className="text-xs text-muted-foreground">Lot ID</span>
                              <span className="text-sm font-mono font-medium">LOT-20254152-001</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                              <span className="text-xs text-muted-foreground">Product Type</span>
                              <span className="text-sm font-medium">Wafer-300mm</span>
                            </div>
                             <div className="flex justify-between items-center border-b pb-2">
                              <span className="text-xs text-muted-foreground">Quantity</span>
                              <span className="text-sm font-medium">25 Units</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Priority</span>
                              <Badge variant="secondary" className="text-[10px] bg-purple-100 text-purple-700">High</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Production Status</h4>
                          <div className="space-y-4">
                             <div className="bg-muted/30 p-3 rounded-lg border">
                               <div className="flex justify-between text-xs mb-2">
                                 <span className="text-muted-foreground">Completion</span>
                                 <span className="font-medium">85%</span>
                               </div>
                               <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-1">
                                 <div className="h-full bg-primary w-[85%] rounded-full"></div>
                               </div>
                               <p className="text-[10px] text-muted-foreground text-right">Est. 45 mins remaining</p>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-3">
                               <div className="bg-muted/30 p-3 rounded-lg border">
                                  <div className="text-[10px] text-muted-foreground mb-1">Total Yield</div>
                                  <div className="text-lg font-bold text-emerald-600">99.2%</div>
                               </div>
                               <div className="bg-muted/30 p-3 rounded-lg border">
                                  <div className="text-[10px] text-muted-foreground mb-1">Defects</div>
                                  <div className="text-lg font-bold text-muted-foreground">2</div>
                               </div>
                             </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="process" className="m-0 p-4 space-y-6">
                         <div className="space-y-2">
                          <h3 className="font-bold text-lg">Process Parameters</h3>
                          <div className="flex items-center gap-2">
                             <Badge variant="outline">Etching</Badge>
                             <span className="text-xs text-muted-foreground">Step 4 of 12</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Recipe</h4>
                          <div className="p-3 bg-muted/40 border rounded-lg font-mono text-xs flex items-center justify-between">
                            <span>RECIPE-ETCH-STD-V2</span>
                            <Badge variant="secondary" className="h-5 text-[10px]">Running</Badge>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Parameters</h4>
                          <div className="space-y-2">
                            <div className="p-3 border rounded-lg bg-card shadow-sm hover:border-primary/50 transition-colors">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium">Chamber Pressure</span>
                                <span className="text-xs text-muted-foreground">Set: 45.0</span>
                              </div>
                              <div className="flex items-baseline gap-1">
                                 <span className="text-xl font-bold">44.8</span>
                                 <span className="text-xs text-muted-foreground">mTorr</span>
                              </div>
                            </div>

                             <div className="p-3 border rounded-lg bg-card shadow-sm hover:border-primary/50 transition-colors">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium">RF Power</span>
                                <span className="text-xs text-muted-foreground">Set: 1200</span>
                              </div>
                              <div className="flex items-baseline gap-1">
                                 <span className="text-xl font-bold">1198</span>
                                 <span className="text-xs text-muted-foreground">Watts</span>
                              </div>
                            </div>

                             <div className="p-3 border rounded-lg bg-card shadow-sm hover:border-primary/50 transition-colors">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium">Gas Flow (Ar)</span>
                                <span className="text-xs text-muted-foreground">Set: 50</span>
                              </div>
                              <div className="flex items-baseline gap-1">
                                 <span className="text-xl font-bold">49.9</span>
                                 <span className="text-xs text-muted-foreground">sccm</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                </div>
              </ResizablePanel>
            </>
          )}

        </ResizablePanelGroup>
      </div>
      {/* DRT Chart Dialog */}
      <Dialog open={!!selectedSensorForChart} onOpenChange={(open) => !open && setSelectedSensorForChart(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              Dynamic Response Trend (DRT) Analysis
            </DialogTitle>
            <DialogDescription>
              Real-time sensor behavior analysis for <span className="font-mono font-medium text-foreground">{selectedSensorForChart?.location}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
             {/* Chart Header Info */}
             <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
                <div className="grid grid-cols-4 gap-8">
                   <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Value</div>
                      <div className="text-xl font-bold font-mono">
                        {selectedSensorForChart?.isDefective ? '85.4' : '54.2'} <span className="text-xs text-muted-foreground font-normal">mV</span>
                      </div>
                   </div>
                   <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Signal Stability</div>
                      <div className={`text-xl font-bold ${selectedSensorForChart?.isDefective ? 'text-destructive' : 'text-emerald-600'}`}>
                        {selectedSensorForChart?.isDefective ? '76.4%' : '99.8%'}
                      </div>
                   </div>
                   <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Noise Floor</div>
                      <div className="text-xl font-bold text-muted-foreground">-92 dBm</div>
                   </div>
                   <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</div>
                      <Badge variant="outline" className={`${selectedSensorForChart?.isDefective ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {selectedSensorForChart?.isDefective ? 'Critical Fault' : 'Optimal'}
                      </Badge>
                   </div>
                </div>
             </div>

             {/* Chart */}
             <div className="h-[400px] w-full border rounded-lg bg-card p-4 relative select-none">
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                   <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">Tolerance Band</Badge>
                   <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Actual Signal</Badge>
                   {selectedSensorForChart?.isDefective && (
                     <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200">Anomaly</Badge>
                   )}
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart 
                    data={drtData} 
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    onMouseDown={(e) => {
                       if(e && e.activeLabel) {
                         setRefAreaLeft(Number(e.activeLabel));
                         setIsSelecting(true);
                         setSensorsInArea([]); // Clear previous selection
                       }
                    }}
                    onMouseMove={(e) => {
                       if(isSelecting && e && e.activeLabel) {
                         setRefAreaRight(Number(e.activeLabel));
                       }
                    }}
                    onMouseUp={(e) => {
                       setIsSelecting(false);
                       handleSelection();
                    }}
                  >
                    <defs>
                      <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                       dataKey="time" 
                       type="number" 
                       domain={[0, 60]} 
                       tickCount={12} 
                       stroke="hsl(var(--muted-foreground))" 
                       fontSize={12}
                       label={{ value: 'Time Sequence (s)', position: 'insideBottomRight', offset: -10, fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                       allowDataOverflow={true}
                    />
                    <YAxis 
                       domain={[0, 100]} 
                       stroke="hsl(var(--muted-foreground))" 
                       fontSize={12}
                       label={{ value: 'Response Amplitude', angle: -90, position: 'insideLeft', fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                       allowDataOverflow={true}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }}
                      labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                    />
                    
                    {/* Tolerance Band Area - Monotone for smooth envelope */}
                    <Area 
                      type="monotone" 
                      dataKey="range" 
                      stroke="none" 
                      fill="#3b82f6" 
                      fillOpacity={0.15} 
                      isAnimationActive={true}
                    />

                    {/* Actual Signal Line - Green */}
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      dot={false} 
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      isAnimationActive={true}
                    />

                    {/* Anomaly Overlay Line - Red */}
                    {selectedSensorForChart?.isDefective && (
                      <Line 
                        type="monotone" 
                        dataKey="anomalyValue" 
                        stroke="#ef4444" 
                        strokeWidth={4} 
                        dot={false}
                        activeDot={{ r: 8, fill: "#ef4444" }}
                        isAnimationActive={true}
                        connectNulls={true}
                      />
                    )}

                    {/* Selection Area */}
                    { (refAreaLeft !== null && refAreaRight !== null) && (
                      <ReferenceArea 
                        x1={refAreaLeft} 
                        x2={refAreaRight} 
                        strokeOpacity={0.3} 
                        fill="#8884d8" 
                        fillOpacity={0.3} 
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
             </div>
             
             {/* Selected Range Info */}
             {sensorsInArea.length > 0 && (
               <div className="bg-muted/20 border rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                 <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                   <ListFilter className="w-4 h-4 text-primary" />
                   Sensors in Selected Range ({Math.min(Number(refAreaLeft), Number(refAreaRight))}s - {Math.max(Number(refAreaLeft), Number(refAreaRight))}s)
                 </h4>
                 <div className="grid gap-2">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="h-8 text-xs">Sensor Name</TableHead>
                          <TableHead className="h-8 text-xs">Value</TableHead>
                          <TableHead className="h-8 text-xs">Time Offset</TableHead>
                          <TableHead className="h-8 text-xs text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sensorsInArea.map((sensor) => (
                          <TableRow key={sensor.id} className="hover:bg-muted/50">
                            <TableCell className="py-2 text-xs font-medium">{sensor.name}</TableCell>
                            <TableCell className="py-2 text-xs font-mono">{sensor.value}</TableCell>
                            <TableCell className="py-2 text-xs text-muted-foreground">T+{sensor.time}s</TableCell>
                            <TableCell className="py-2 text-xs text-right">
                              <Badge variant={sensor.status === 'Critical' ? 'destructive' : sensor.status === 'Warning' ? 'outline' : 'secondary'} className="text-[10px] h-5">
                                {sensor.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </div>
               </div>
             )}
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setSelectedSensorForChart(null)}>Close Analysis</Button>
             <Button>Export Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
