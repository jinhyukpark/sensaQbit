import { AppLayout } from "@/components/layout/AppLayout";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Search, Cpu, Factory, Settings2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

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

const historyData = Array.from({ length: 100 }, (_, i) => ({
  time: i,
  value: Math.sin(i / 10) * 50 + 100 + (Math.random() * 10 - 5),
  anomaly: i > 40 && i < 50
}));

export default function HistoryPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>("eq-1");

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

              {/* Main Chart */}
              <Card className="flex-1 min-h-[400px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Sensor Telemetry Analysis</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Zoom In</Button>
                    <Button variant="outline" size="sm">Reset</Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" type="number" domain={['auto', 'auto']} stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }} />
                      <ReferenceArea x1={40} x2={50} strokeOpacity={0.3} fill="hsl(var(--destructive))" fillOpacity={0.1} />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </AppLayout>
  );
}
