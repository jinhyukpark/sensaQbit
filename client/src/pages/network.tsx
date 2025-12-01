import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";

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

  return (
    <AppLayout title="Network Graph">
      <div className="relative h-full w-full overflow-hidden bg-background">
        
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

        {/* Node Detail Overlay */}
        <div className="absolute top-4 right-4 z-10 w-72">
          <Card className="shadow-lg bg-background/90 backdrop-blur">
            <div className="p-4 border-b">
              <h3 className="font-medium">Node Details</h3>
            </div>
            <div className="p-4 space-y-4">
               <div className="flex justify-between items-center">
                 <span className="text-sm text-muted-foreground">ID</span>
                 <span className="font-mono text-sm">#SENS-442</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm text-muted-foreground">Status</span>
                 <Badge className="bg-amber-500">Warning</Badge>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm text-muted-foreground">Health Score</span>
                 <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full w-[70%] bg-amber-500"></div>
                 </div>
               </div>
               <div className="pt-2">
                 <p className="text-xs text-muted-foreground mb-2">Recent Anomalies</p>
                 <div className="h-12 bg-slate-100 rounded flex items-end px-1 gap-0.5">
                   {[2,4,3,5,7,4,8,6,4,3,2,1].map((h, i) => (
                     <div key={i} className="flex-1 bg-slate-300" style={{ height: `${h * 10}%` }}></div>
                   ))}
                 </div>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
