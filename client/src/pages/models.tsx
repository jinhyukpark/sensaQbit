import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrainCircuit, Play, Download } from "lucide-react";

const models = [
  { id: "m-01", name: "Vibration_Anomaly_V2", version: "2.1.0", precision: "98.2%", recall: "96.5%", status: "Active", updated: "2h ago" },
  { id: "m-02", name: "Temp_Spike_Detector", version: "1.0.4", precision: "94.1%", recall: "92.8%", status: "Staging", updated: "1d ago" },
  { id: "m-03", name: "Pressure_Drop_LSTM", version: "3.2.1", precision: "99.0%", recall: "98.5%", status: "Active", updated: "3d ago" },
];

export default function ModelsPage() {
  return (
    <AppLayout title="AI Models">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* Left: Model List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Models</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Precision</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <BrainCircuit className="w-4 h-4 text-primary" />
                          {model.name}
                        </div>
                      </TableCell>
                      <TableCell>{model.version}</TableCell>
                      <TableCell>{model.precision}</TableCell>
                      <TableCell>
                        <Badge variant={model.status === "Active" ? "default" : "secondary"}>
                          {model.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Select</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Confusion Matrix Visual (Mock) */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics (Last Run)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8">
                <div className="aspect-square bg-accent/20 rounded-lg flex items-center justify-center border border-dashed">
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-mono font-bold text-primary">0.98</div>
                    <div className="text-sm text-muted-foreground">F1 Score</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                  <div className="bg-primary/10 p-4 rounded flex flex-col justify-center">
                    <span className="text-2xl font-bold">420</span>
                    <span className="text-xs text-muted-foreground">True Positive</span>
                  </div>
                  <div className="bg-muted p-4 rounded flex flex-col justify-center">
                    <span className="text-2xl font-bold">12</span>
                    <span className="text-xs text-muted-foreground">False Positive</span>
                  </div>
                  <div className="bg-muted p-4 rounded flex flex-col justify-center">
                    <span className="text-2xl font-bold">8</span>
                    <span className="text-xs text-muted-foreground">False Negative</span>
                  </div>
                  <div className="bg-primary/10 p-4 rounded flex flex-col justify-center">
                    <span className="text-2xl font-bold">1.2k</span>
                    <span className="text-xs text-muted-foreground">True Negative</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Test Bench */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Test Bench</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Sensor Data</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sensor source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="s1">Robot Arm K-200 (Hist)</SelectItem>
                    <SelectItem value="s2">Conveyor Belt M-4 (Live)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Last 1 Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last 1 Hour</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button className="w-full" size="lg">
                  <Play className="w-4 h-4 mr-2" /> Run Model Test
                </Button>
              </div>

              <div className="pt-8 border-t mt-8">
                 <h4 className="text-sm font-medium mb-2">Last Result</h4>
                 <div className="bg-accent/50 p-3 rounded-md text-sm font-mono">
                    Test ID: #T-8829<br/>
                    Status: Completed<br/>
                    Anomalies Found: 3
                 </div>
                 <Button variant="outline" className="w-full mt-2">
                   <Download className="w-4 h-4 mr-2" /> Download Report
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </AppLayout>
  );
}
