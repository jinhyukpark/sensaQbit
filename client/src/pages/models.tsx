import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrainCircuit, Play, Download, CheckCircle2, AlertTriangle, XCircle, Loader2, BarChart3, Activity } from "lucide-react";
import { useState } from "react";

const models = [
  { id: "m-01", name: "Vibration_Anomaly_V2", version: "2.1.0", precision: "98.2%", recall: "96.5%", status: "Active", updated: "2h ago" },
  { id: "m-02", name: "Temp_Spike_Detector", version: "1.0.4", precision: "94.1%", recall: "92.8%", status: "Staging", updated: "1d ago" },
  { id: "m-03", name: "Pressure_Drop_LSTM", version: "3.2.1", precision: "99.0%", recall: "98.5%", status: "Active", updated: "3d ago" },
];

export default function ModelsPage() {
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const selectedModel = models.find(m => m.id === selectedModelId);

  const handleRunModel = () => {
    setIsRunning(true);
    setLastResult(null);
    
    // Mock simulation
    setTimeout(() => {
      setIsRunning(false);
      setLastResult({
        id: `T-${Math.floor(Math.random() * 10000)}`,
        status: "Completed",
        timestamp: new Date().toLocaleString(),
        anomalies: 3,
        accuracy: "98.5%",
        f1Score: "0.97",
        confusionMatrix: {
          tp: 420,
          fp: 12,
          fn: 8,
          tn: 1200
        },
        confidence: [0.98, 0.92, 0.99, 0.85, 0.94],
        predictions: [
           { time: "10:00:01", type: "Normal", conf: "99%" },
           { time: "10:00:02", type: "Normal", conf: "98%" },
           { time: "10:00:03", type: "Anomaly", conf: "92%" }, // Anomaly
           { time: "10:00:04", type: "Normal", conf: "97%" },
           { time: "10:00:05", type: "Anomaly", conf: "88%" }, // Anomaly
        ]
      });
    }, 1500);
  };

  return (
    <AppLayout title="AI Models">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* Left: Model List */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Available Models</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow 
                      key={model.id} 
                      className={selectedModelId === model.id ? "bg-muted/50" : ""}
                      onClick={() => setSelectedModelId(model.id)}
                    >
                      <TableCell className="font-medium cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <BrainCircuit className={`w-4 h-4 ${selectedModelId === model.id ? "text-primary" : "text-muted-foreground"}`} />
                            <span className="text-sm">{model.name}</span>
                          </div>
                          <div className="flex gap-2 text-xs text-muted-foreground ml-6">
                            <span>v{model.version}</span>
                            <span>•</span>
                            <span>{model.precision}</span>
                            <span>•</span>
                            <Badge variant={model.status === "Active" ? "default" : "secondary"} className="h-4 text-[10px] px-1 py-0">
                              {model.status}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right align-top pt-4">
                        <Button 
                          variant={selectedModelId === model.id ? "default" : "ghost"} 
                          size="sm"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedModelId(model.id);
                          }}
                        >
                          {selectedModelId === model.id ? "Selected" : "Select"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {!selectedModelId && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Please select a model from the list to enable the Test Bench.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Test Bench */}
        <div className="lg:col-span-2 space-y-6">
          <Card className={`h-full flex flex-col transition-opacity duration-300 ${!selectedModelId ? "opacity-50 pointer-events-none grayscale" : ""}`}>
            <CardHeader className="bg-muted/20 border-b pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Test Bench
                </CardTitle>
                {selectedModel && (
                  <Badge variant="outline" className="text-xs font-normal bg-background">
                    {selectedModel.name}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 flex-1 pt-6 overflow-y-auto">
              {/* Inputs */}
              <div className="grid gap-4 p-4 border rounded-lg bg-muted/10">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase text-muted-foreground">Select Sensor Data</label>
                  <Select defaultValue="s1">
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select sensor source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s1">Robot Arm K-200 (Historical Data)</SelectItem>
                      <SelectItem value="s2">Conveyor Belt M-4 (Live Stream)</SelectItem>
                      <SelectItem value="s3">Welding Unit C (Sample Set)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase text-muted-foreground">Time Range</label>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground">Start Time</span>
                        <input 
                          type="datetime-local" 
                          step="1"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground">End Time</span>
                        <input 
                          type="datetime-local" 
                          step="1"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full mt-2" 
                  size="lg" 
                  onClick={handleRunModel}
                  disabled={isRunning || !selectedModelId}
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running Inference...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2 fill-current" /> Run Model Test
                    </>
                  )}
                </Button>
              </div>

              {/* Results Area */}
              {lastResult ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                     <h4 className="text-sm font-semibold flex items-center gap-2">
                       <BarChart3 className="w-4 h-4 text-muted-foreground" />
                       Last Result
                     </h4>
                     <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                       {lastResult.status}
                     </Badge>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-primary/5 rounded border text-center">
                      <div className="text-2xl font-bold text-primary">{lastResult.accuracy}</div>
                      <div className="text-[10px] uppercase text-muted-foreground font-medium">Accuracy</div>
                    </div>
                    <div className="p-3 bg-primary/5 rounded border text-center">
                      <div className="text-2xl font-bold text-primary">{lastResult.f1Score}</div>
                      <div className="text-[10px] uppercase text-muted-foreground font-medium">F1 Score</div>
                    </div>
                  </div>

                  {/* Confusion Matrix Mini */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground">Confusion Matrix</h5>
                    <div className="grid grid-cols-2 gap-1 text-center text-xs">
                      <div className="bg-emerald-100/50 p-2 rounded text-emerald-900">
                        <div className="font-bold text-lg">{lastResult.confusionMatrix.tp}</div>
                        <div className="text-[10px] opacity-70">True Pos</div>
                      </div>
                      <div className="bg-red-100/50 p-2 rounded text-red-900">
                        <div className="font-bold text-lg">{lastResult.confusionMatrix.fp}</div>
                        <div className="text-[10px] opacity-70">False Pos</div>
                      </div>
                      <div className="bg-red-100/50 p-2 rounded text-red-900">
                        <div className="font-bold text-lg">{lastResult.confusionMatrix.fn}</div>
                        <div className="text-[10px] opacity-70">False Neg</div>
                      </div>
                      <div className="bg-emerald-100/50 p-2 rounded text-emerald-900">
                        <div className="font-bold text-lg">{lastResult.confusionMatrix.tn}</div>
                        <div className="text-[10px] opacity-70">True Neg</div>
                      </div>
                    </div>
                  </div>

                  {/* Sample Log */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground">Recent Inference Log</h5>
                    <div className="text-xs space-y-1 border rounded p-2 bg-muted/20 max-h-[120px] overflow-y-auto font-mono">
                      {lastResult.predictions.map((p: any, i: number) => (
                        <div key={i} className="flex justify-between items-center border-b border-dashed last:border-0 pb-1 last:pb-0">
                          <span className="text-muted-foreground">{p.time}</span>
                          <span className={p.type === "Anomaly" ? "text-destructive font-bold" : "text-emerald-600"}>
                            {p.type}
                          </span>
                          <span className="opacity-70">{p.conf}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full text-xs h-8">
                    <Download className="w-3 h-3 mr-2" /> Download Full Report
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg m-4 p-8 bg-muted/5 min-h-[200px]">
                  <BarChart3 className="w-10 h-10 mb-3 opacity-20" />
                  <p className="text-sm text-center max-w-[200px]">
                    Run a model test to view detailed performance metrics and results here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </AppLayout>
  );
}
