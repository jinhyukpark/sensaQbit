import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Bot, User, Send, FileText, AlertTriangle, 
  Server, Cpu, Database, Activity, Radio, 
  Zap, Router
} from "lucide-react";

// Generate ~100 nodes in a centered radial network layout
const generateNodes = () => {
  const nodes = [];
  const centerX = 600; // Center of the visualization area
  const centerY = 400;

  // Level 0: Main Hub (Center)
  nodes.push({ 
    id: 0, x: centerX, y: centerY, size: 70, 
    color: "bg-blue-600", label: "Central Hub", 
    icon: Server, type: "Server",
    manufacturer: "Cisco Systems", installDate: "2023-01-15",
    firmware: "v12.4.2", location: "Server Room A",
    status: "normal"
  });

  // Level 1: Zone Controllers (6 nodes)
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * 2 * Math.PI;
    const r = 180;
    nodes.push({
      id: i + 1,
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
      size: 50,
      color: "bg-indigo-500",
      label: `Zone Ctrl ${i+1}`,
      icon: Cpu,
      type: "Controller",
      manufacturer: "Siemens", installDate: "2023-02-10",
      firmware: "v4.1.0", location: `Zone ${String.fromCharCode(65+i)}`,
      status: "normal"
    });
  }

  // Level 2: Equipment Nodes (18 nodes)
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * 2 * Math.PI;
    const r = 320;
    nodes.push({
      id: i + 7,
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
      size: 40,
      color: "bg-slate-500",
      label: `EQ-${100+i}`,
      icon: Database,
      type: "Equipment",
      manufacturer: "Fanuc Robotics", installDate: "2023-03-22",
      firmware: "v2.0.1", location: `Line ${Math.floor(i/3)+1}`,
      status: "normal"
    });
  }

  // Level 3: Sensors (75 nodes) - Scattered
  for (let i = 0; i < 75; i++) {
    const angle = (i / 75) * 2 * Math.PI + (Math.random() * 0.2);
    const r = 450 + (Math.random() * 50);
    const isWarning = Math.random() > 0.95;
    nodes.push({
      id: i + 25,
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
      size: 24,
      color: isWarning ? "bg-amber-500" : "bg-emerald-500",
      label: `S-${i}`,
      icon: isWarning ? AlertTriangle : Activity,
      type: "Sensor",
      manufacturer: "Keyence", installDate: "2023-04-05",
      firmware: "v1.1.5", location: `Point ${i}`,
      status: isWarning ? "warning" : "normal"
    });
  }

  return nodes;
};

const generateLinks = (nodes: any[]) => {
  const links = [];
  
  // Connect Hub to Controllers
  for (let i = 1; i <= 6; i++) {
    links.push({ from: 0, to: i, dashed: false });
  }

  // Connect Controllers to Equipment (3 per controller)
  for (let i = 0; i < 6; i++) {
    const controllerId = i + 1;
    for (let j = 0; j < 3; j++) {
      const equipmentId = 7 + (i * 3) + j;
      links.push({ from: controllerId, to: equipmentId, dashed: false });
    }
  }

  // Connect Equipment to Sensors (~4 per equipment)
  for (let i = 0; i < 18; i++) {
    const equipmentId = i + 7;
    for (let j = 0; j < 4; j++) {
      const sensorIndex = (i * 4) + j;
      if (sensorIndex < 75) {
        const sensorId = 25 + sensorIndex;
        links.push({ from: equipmentId, to: sensorId, dashed: true });
      }
    }
  }
  
  return links;
};

const nodes = generateNodes();
const links = generateLinks(nodes);

export default function NetworkPage() {
  const [threshold, setThreshold] = useState([50]);
  const [note, setNote] = useState("");
  const [selectedNode, setSelectedNode] = useState<any>(nodes[0]);
  const [showFaultsOnly, setShowFaultsOnly] = useState(false);

  // Calculate statistics
  const stats = {
    total: nodes.length,
    controllers: nodes.filter(n => n.type === "Server" || n.type === "Controller").length,
    equipment: nodes.filter(n => n.type === "Equipment").length,
    sensors: nodes.filter(n => n.type === "Sensor").length,
    faults: {
      total: nodes.filter(n => n.status === "warning").length,
      controllers: nodes.filter(n => (n.type === "Server" || n.type === "Controller") && n.status === "warning").length,
      equipment: nodes.filter(n => n.type === "Equipment" && n.status === "warning").length,
      sensors: nodes.filter(n => n.type === "Sensor" && n.status === "warning").length,
    }
  };

  // Calculate dynamic node positions
  const getDisplayNodes = () => {
    if (showFaultsOnly) {
      // Filter for warning nodes
      const faultNodes = nodes.filter(n => n.status === 'warning');
      const centerX = 600;
      const centerY = 400;
      const radius = 200;

      return nodes.map(node => {
        // If not a fault node, hide it or keep original position but invisible
        if (node.status !== 'warning') {
          return { ...node, visible: false };
        }
        
        // If it is a fault node, calculate new circular position
        const index = faultNodes.findIndex(n => n.id === node.id);
        const angle = (index / faultNodes.length) * 2 * Math.PI - (Math.PI / 2); // Start from top
        
        return {
          ...node,
          visible: true,
          // Override position for the circular layout
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });
    }
    
    // Default mode: Show all nodes in original positions
    return nodes.map(node => ({ ...node, visible: true }));
  };

  const displayNodes = getDisplayNodes();

  return (
    <AppLayout title="Network Graph">
      <div className="relative h-full w-full overflow-hidden bg-slate-50 flex">
        
        {/* Left Area: Visualization */}
        <div className="flex-1 relative h-full overflow-hidden cursor-grab active:cursor-grabbing">
          {/* Controls Overlay */}
          <div className="absolute top-4 left-4 z-10 w-64 space-y-4">
            {/* Network Status Card */}
            <Card className="p-4 shadow-lg bg-background/90 backdrop-blur">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Network Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Total Nodes</span>
                  <span className="font-bold">{stats.total}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      Controllers
                    </span>
                    <div className="flex items-center gap-2">
                      {stats.faults.controllers > 0 && (
                        <span 
                          className="text-amber-500 font-bold cursor-pointer hover:underline"
                          onClick={handleFaultClick}
                        >
                          {stats.faults.controllers} err
                        </span>
                      )}
                      <span className="text-muted-foreground">{stats.controllers}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                      Equipment
                    </span>
                    <div className="flex items-center gap-2">
                      {stats.faults.equipment > 0 && (
                        <span 
                          className="text-amber-500 font-bold cursor-pointer hover:underline"
                          onClick={handleFaultClick}
                        >
                          {stats.faults.equipment} err
                        </span>
                      )}
                      <span className="text-muted-foreground">{stats.equipment}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      Sensors
                    </span>
                    <div className="flex items-center gap-2">
                      {stats.faults.sensors > 0 && (
                        <span 
                          className="text-amber-500 font-bold cursor-pointer hover:underline"
                          onClick={handleFaultClick}
                        >
                          {stats.faults.sensors} err
                        </span>
                      )}
                      <span className="text-muted-foreground">{stats.sensors}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {stats.faults.total > 0 && (
                 <div 
                   className="mt-4 pt-3 border-t flex items-center gap-2 text-xs text-amber-600 font-medium cursor-pointer hover:bg-amber-50 p-1 rounded transition-colors"
                   onClick={handleFaultClick}
                 >
                   <AlertTriangle className="w-3 h-3" />
                   {stats.faults.total} nodes require attention
                 </div>
              )}
            </Card>

            <Card className="p-4 shadow-lg bg-background/90 backdrop-blur">
              <h3 className="font-medium mb-4">Graph Filters</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Correlation Threshold</label>
                  <Slider defaultValue={[50]} max={100} step={1} onValueChange={setThreshold} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium">Show Faults Only</label>
                  <Switch 
                    checked={showFaultsOnly}
                    onCheckedChange={setShowFaultsOnly}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium">Show Data Flow</label>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </div>

          {/* Graph Visualization Area */}
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
            {/* Using a large fixed size SVG centered via flexbox, but using generated coordinates */}
            <div className="relative w-[1200px] h-[800px] scale-75 origin-center">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {links.map((link, i) => {
                  // Find nodes in displayNodes array which has updated positions
                  const start = displayNodes.find(n => n.id === link.from)!;
                  const end = displayNodes.find(n => n.id === link.to)!;
                  
                  // Check visibility
                  if (!start.visible || !end.visible) return null;

                  return (
                    <motion.line
                      key={i}
                      initial={false}
                      animate={{
                        x1: start.x,
                        y1: start.y,
                        x2: end.x,
                        y2: end.y
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      stroke={link.dashed ? "#94a3b8" : "#cbd5e1"}
                      strokeWidth={link.dashed ? 1 : 2}
                      strokeDasharray={link.dashed ? "4,4" : "0"}
                      opacity={0.6}
                    />
                  );
                })}
              </svg>
              
              {displayNodes.map((node) => {
                const Icon = node.icon;
                const isSelected = selectedNode?.id === node.id;
                
                if (!node.visible) return null;

                return (
                  <motion.div
                    key={node.id}
                    className={`absolute rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all ${node.color} text-white ${isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-primary' : 'hover:ring-4 hover:ring-primary/20'}`}
                    initial={false}
                    animate={{
                      left: node.x - node.size / 2,
                      top: node.y - node.size / 2,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{
                      width: node.size,
                      height: node.size,
                      zIndex: node.type === 'hub' ? 30 : node.type === 'controller' ? 20 : 10
                    }}
                    whileHover={{ scale: 1.2, zIndex: 50 }}
                    onClick={() => setSelectedNode(node)}
                    drag
                    dragConstraints={{ left: 0, right: 1200, top: 0, bottom: 800 }}
                  >
                    <Icon className={`${node.size > 30 ? "w-6 h-6" : "w-3 h-3"}`} />
                    
                    {node.size > 30 && (
                      <div className="absolute -bottom-6 text-[10px] font-bold whitespace-nowrap bg-white/90 text-slate-700 px-2 py-0.5 rounded shadow-sm border backdrop-blur-sm">
                        {node.label}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: Analysis Panel */}
        <div className="w-[400px] h-full border-l bg-background/80 backdrop-blur flex flex-col z-20 shadow-xl">
          {/* Node Details (Fixed Top) */}
          <div className="p-4 border-b bg-background/80 shrink-0">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Node Details
            </h3>
            {selectedNode ? (
              <div className="space-y-4 text-sm animate-in fade-in slide-in-from-right-4 duration-300" key={selectedNode.id}>
                 <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                   <span className="text-muted-foreground">ID</span>
                   <span className="font-mono font-bold">#{selectedNode.type.substring(0,4).toUpperCase()}-{selectedNode.id}</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2">
                   <div className="p-2 bg-muted/30 rounded flex flex-col">
                     <span className="text-[10px] text-muted-foreground uppercase mb-1">Type</span>
                     <div className="font-medium">{selectedNode.type}</div>
                   </div>
                   <div className="p-2 bg-muted/30 rounded flex flex-col">
                     <span className="text-[10px] text-muted-foreground uppercase mb-1">Status</span>
                     <div className="flex-1 flex items-center">
                       <Badge variant={selectedNode.status === "warning" ? "destructive" : "default"} className={selectedNode.status === "warning" ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"}>
                         {selectedNode.status === "warning" ? "Warning" : "Normal"}
                       </Badge>
                     </div>
                   </div>
                 </div>

                 <div className="p-3 bg-muted/30 rounded space-y-2">
                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium text-right">{selectedNode.location}</span>
                      
                      <span className="text-muted-foreground">Manufacturer:</span>
                      <span className="font-medium text-right">{selectedNode.manufacturer}</span>
                      
                      <span className="text-muted-foreground">Installed:</span>
                      <span className="font-medium text-right">{selectedNode.installDate}</span>
                      
                      <span className="text-muted-foreground">Firmware:</span>
                      <span className="font-medium text-right">{selectedNode.firmware}</span>
                    </div>
                 </div>

                 <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                   <span className="text-muted-foreground">Health Score</span>
                   <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div 
                       className={`h-full w-[${selectedNode.status === 'warning' ? '70%' : '98%'}] transition-all duration-500 ${selectedNode.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                       style={{ width: selectedNode.status === 'warning' ? '70%' : '98%' }}
                     ></div>
                   </div>
                 </div>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground text-sm italic">
                Select a node to view details
              </div>
            )}
          </div>

          {/* Tabs Area (Flexible) */}
          <div className="flex-1 flex flex-col min-h-0">
            <Tabs defaultValue="ai" className="flex-1 flex flex-col">
              <div className="px-4 pt-4 border-b">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="ai" className="text-xs">
                    <Bot className="w-3 h-3 mr-2" /> AI Insight
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs">
                    <User className="w-3 h-3 mr-2" /> Team Notes
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* AI Tab Content */}
              <TabsContent value="ai" className="flex-1 p-4 m-0 overflow-y-auto">
                <div className="space-y-4">
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center gap-2 mb-3 text-primary font-medium text-sm">
                      <AlertTriangle className="w-4 h-4" /> Anomaly Pattern Detected
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      High correlation (0.85) observed between Main Controller load and Sensor C warning state.
                      Suggest checking power distribution unit for potential voltage fluctuations affecting Sensor C.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase">Recommended Actions</h4>
                    <div className="text-xs space-y-2">
                      <div className="p-2 bg-white border rounded shadow-sm flex items-start gap-2">
                        <span className="bg-primary/10 text-primary px-1.5 rounded text-[10px] font-bold mt-0.5">1</span>
                        <span>Inspect voltage stability on Power Unit B-2</span>
                      </div>
                      <div className="p-2 bg-white border rounded shadow-sm flex items-start gap-2">
                        <span className="bg-primary/10 text-primary px-1.5 rounded text-[10px] font-bold mt-0.5">2</span>
                        <span>Calibrate Sensor C sensitivity thresholds</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Notes Tab Content */}
              <TabsContent value="notes" className="flex-1 flex flex-col m-0">
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-3">
                    <div className="bg-muted/30 p-3 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span className="font-semibold text-foreground">Alice Engineer</span>
                        <span>2h ago</span>
                      </div>
                      <p>Checked sensor C manually. Readings seem stable but slightly drifting. Will monitor.</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span className="font-semibold text-foreground">Bob Operator</span>
                        <span>1d ago</span>
                      </div>
                      <p>Scheduled maintenance for next Tuesday as per AI recommendation.</p>
                    </div>
                  </div>
                </ScrollArea>
                <div className="p-4 border-t bg-background mt-auto">
                  <div className="space-y-2">
                    <Textarea 
                      placeholder="Add your observation..." 
                      className="min-h-[80px] text-xs resize-none focus-visible:ring-primary"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button size="sm" className="h-8 text-xs gap-2">
                        <Send className="w-3 h-3" /> Save Note
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
