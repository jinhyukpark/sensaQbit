import { AppLayout } from "@/components/layout/AppLayout";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Search, Cpu, Factory, Settings2, AlertCircle, CheckSquare, Square } from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  return Array.from({ length: count }, (_, i) => ({
    productId: `PROD-${20240000 + i}`,
    location: `EQP-2005-S${Math.floor(Math.random() * 50).toString().padStart(2, '0')}`,
    section: Math.random() > 0.5 ? "Zone A - Heater" : "Zone B - Cooler",
    isDefective: Math.random() > 0.9, // 10% defect rate
    date: new Date(Date.now() - i * 10000).toLocaleString(),
  }));
};

const initialTableData = generateTableData(20);

export default function HistoryPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>("eq-1");
  const [activeCategory, setActiveCategory] = useState<string>("temp");
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  
  // Filter logic
  const currentSensors = mockSensors[activeCategory] || [];

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
    // In a real app, this would filter based on selectedSensors
    // For mockup, we just return the static list or regenerate if empty
    if (selectedSensors.length === 0) return [];
    return initialTableData; 
  }, [selectedSensors]);

  return (
    <AppLayout title="History Analysis">
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
          <ResizablePanel defaultSize={80}>
            <div className="h-full p-6 overflow-y-auto space-y-6 bg-background/50">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">15,240</div>
                    <p className="text-xs text-muted-foreground">총가공수 (Total Processed)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-emerald-600">13,716 (90%)</div>
                    <p className="text-xs text-muted-foreground">정상제품 (Normal Products)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-destructive">1,524 (10%)</div>
                    <p className="text-xs text-muted-foreground">불량 제품 (Defective Products)</p>
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
                  <div className="grid grid-cols-3 gap-2 p-4 bg-muted/30 rounded-lg border">
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
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">상세 히스토리 테이블 (Detailed History)</h3>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-[150px]">제품 ID (ID)</TableHead>
                            <TableHead>어디 센서 (Location)</TableHead>
                            <TableHead>센서 구간 (Section)</TableHead>
                            <TableHead className="w-[120px]">불량여부 (Status)</TableHead>
                            <TableHead className="w-[180px] text-right">날짜 (Date)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tableData.length > 0 ? (
                            tableData.map((row, i) => (
                              <TableRow key={i}>
                                <TableCell className="font-medium">{row.productId}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="font-normal bg-slate-50 text-slate-600">
                                    {row.location}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{row.section}</TableCell>
                                <TableCell>
                                  {row.isDefective ? (
                                    <Badge variant="destructive" className="font-normal">Defective</Badge>
                                  ) : (
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-normal">Normal</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground text-xs">
                                  {row.date}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-sm">
                                Please select sensors to view detailed telemetry data.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    {tableData.length > 0 && (
                      <div className="flex justify-end text-xs text-muted-foreground animate-pulse">
                        실시간 업데이트: 3초마다 갱신됩니다.
                      </div>
                    )}
                  </div>

                </CardContent>
              </Card>

            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </AppLayout>
  );
}
