import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useState } from "react";
import { Bot, User, Send, FileText, AlertTriangle } from "lucide-react";

// Mock Graph Data
const nodes = [
  { id: 1, x: 400, y: 300, size: 60, color: "bg-primary", label: "Main Controller" },
  { id: 2, x: 250, y: 200, size: 40, color: "bg-emerald-500", label: "Sensor A" },
  { id: 3, x: 550, y: 200, size: 40, color: "bg-emerald-500", label: "Sensor B" },
  { id: 4, x: 250, y: 400, size: 40, color: "bg-amber-500", label: "Sensor C (Warn)" },
  { id: 5, x: 550, y: 400, size: 40, color: "bg-emerald-500", label: "Sensor D" },
  { id: 6, x: 400, y: 150, size: 30, color: "bg-emerald-500", label: "Aux 1" },
  { id: 7, x: 400, y: 450, size: 30, color: "bg-emerald-500", label: "Aux 2" },
];

const links = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 1, to: 5 },
  { from: 2, to: 6 },
  { from: 3, to: 6 },
  { from: 4, to: 7 },
  { from: 5, to: 7 },
  { from: 2, to: 4, dashed: true }, // Correlation
];

export default function NetworkPage() {
  const [threshold, setThreshold] = useState([50]);
  const [note, setNote] = useState("");

  return (
    <AppLayout title="Network Graph">
      <div className="relative h-full w-full overflow-hidden bg-background flex">
        
        {/* Left Area: Visualization */}
        <div className="flex-1 relative h-full overflow-hidden">
          {/* Controls Overlay */}
          <div className="absolute top-4 left-4 z-10 w-64 space-y-4">
            <Card className="p-4 shadow-lg bg-background/90 backdrop-blur">
              <h3 className="font-medium mb-4">Graph Filters</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Correlation Threshold</label>
                  <Slider defaultValue={[50]} max={100} step={1} onValueChange={setThreshold} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium">Show Faults Only</label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium">Show Data Flow</label>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </div>

          {/* Graph Visualization Area */}
          <div className="w-full h-full relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {links.map((link, i) => {
                const start = nodes.find(n => n.id === link.from)!;
                const end = nodes.find(n => n.id === link.to)!;
                return (
                  <line
                    key={i}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={link.dashed ? "#fbbf24" : "#cbd5e1"}
                    strokeWidth={2}
                    strokeDasharray={link.dashed ? "5,5" : "0"}
                  />
                );
              })}
            </svg>
            
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                className={`absolute rounded-full flex items-center justify-center shadow-md cursor-pointer hover:ring-4 ring-primary/20 transition-all ${node.color}`}
                style={{
                  width: node.size,
                  height: node.size,
                  left: node.x - node.size / 2,
                  top: node.y - node.size / 2,
                }}
                whileHover={{ scale: 1.1 }}
                drag
                dragConstraints={{ left: 0, right: 800, top: 0, bottom: 600 }}
              >
                <div className="absolute -bottom-6 text-xs font-medium whitespace-nowrap bg-white px-2 py-0.5 rounded shadow-sm border">
                  {node.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Area: Analysis Panel */}
        <div className="w-[400px] h-full border-l bg-background/50 backdrop-blur flex flex-col z-20 shadow-xl">
          {/* Node Details (Top) */}
          <div className="p-4 border-b bg-background/80">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Node Details
            </h3>
            <div className="space-y-4 text-sm">
               <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                 <span className="text-muted-foreground">ID</span>
                 <span className="font-mono font-bold">#SENS-442</span>
               </div>
               <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                 <span className="text-muted-foreground">Status</span>
                 <Badge className="bg-amber-500">Warning</Badge>
               </div>
               <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                 <span className="text-muted-foreground">Health Score</span>
                 <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full w-[70%] bg-amber-500"></div>
                 </div>
               </div>
            </div>
          </div>

          {/* AI Analysis (Middle) */}
          <div className="p-4 border-b bg-primary/5">
            <h3 className="font-medium mb-3 flex items-center gap-2 text-primary">
              <Bot className="w-4 h-4" /> AI Insight
            </h3>
            <Card className="p-3 bg-white border-primary/10 shadow-sm">
              <div className="flex gap-2 items-start">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Anomaly Pattern Detected:</strong> High correlation (0.85) observed between Main Controller load and Sensor C warning state.
                  Suggest checking power distribution unit for potential voltage fluctuations affecting Sensor C.
                </p>
              </div>
            </Card>
          </div>

          {/* Team Notes (Bottom - Flexible) */}
          <div className="flex-1 flex flex-col min-h-0 bg-background">
            <div className="p-4 pb-2">
              <h3 className="font-medium flex items-center gap-2">
                <User className="w-4 h-4" /> Team Notes
              </h3>
            </div>
            
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-3 py-2">
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

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
