import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, MoreHorizontal, FileDown, Eye, BarChart3, Activity } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const reports = [
  { id: "R-2023-001", title: "Weekly Fault Analysis - Factory A", date: "2023-10-24", author: "Jane Doe", status: "Completed" },
  { id: "R-2023-002", title: "Incident Report: Robot Arm K-200 Overheat", date: "2023-10-22", author: "John Smith", status: "Completed" },
  { id: "R-2023-003", title: "Monthly Performance Review", date: "2023-10-01", author: "System Auto", status: "Draft" },
];

export default function ReportsPage() {
  return (
    <AppLayout title="Reports">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Generated Reports</h2>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Create New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Configure the parameters for your analysis report.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input id="title" defaultValue="New Report" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Include</Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="c1" defaultChecked />
                      <label htmlFor="c1" className="text-sm">Fault Statistics</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="c2" defaultChecked />
                      <label htmlFor="c2" className="text-sm">Sensor Telemetry Charts</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="c3" />
                      <label htmlFor="c3" className="text-sm">Model Predictions</label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Generate Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        {report.title}
                      </div>
                    </TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.author}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${report.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <FileDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Mock Report Preview */}
        <div className="mt-8 border rounded-lg bg-white shadow-sm max-w-4xl mx-auto overflow-hidden">
          {/* Report Actions Bar */}
          <div className="bg-slate-50 border-b px-8 py-4 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-500">Previewing: R-2023-001</span>
            <Button size="sm" className="gap-2" onClick={() => window.print()}>
              <FileDown className="w-4 h-4" /> Export PDF / Print
            </Button>
          </div>

          {/* Report Content */}
          <div className="p-8 min-h-[500px]">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Weekly Fault Analysis</h1>
              <p className="text-slate-500">Factory Alpha • Oct 24, 2023</p>
            </div>
            
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Executive Summary</h3>
                <p className="text-slate-600 leading-relaxed">
                  This week's analysis indicates a stable production environment with a <strong>98.2%</strong> overall equipment efficiency (OEE). 
                  However, a recurring vibration anomaly was detected in <strong>Robot Arm K-200</strong> during the shift changeovers. 
                  Immediate maintenance is recommended to prevent potential downtime.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                 <div className="h-48 bg-slate-50 border border-slate-200 rounded flex flex-col items-center justify-center text-slate-400 gap-2">
                    <BarChart3 className="w-8 h-8 opacity-50" />
                    <span className="text-xs font-medium">Fault Frequency by Hour</span>
                 </div>
                 <div className="h-48 bg-slate-50 border border-slate-200 rounded flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Activity className="w-8 h-8 opacity-50" />
                    <span className="text-xs font-medium">Vibration Trends (K-200)</span>
                 </div>
              </div>

              {/* Detailed Findings */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Detailed Findings & Recommendations</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                     <div className="w-1.5 bg-amber-500 rounded-full h-auto min-h-[3rem]"></div>
                     <div>
                        <h4 className="font-medium text-slate-900">Vibration Spike Detected (Zone B)</h4>
                        <p className="text-sm text-slate-600 mt-1">
                           Sensors recorded a 15% increase in vibration amplitude on Conveyor Belt M-4. 
                           This correlates with the new batch of heavier components introduced on Tuesday.
                           <strong>Recommendation:</strong> Calibrate tension settings for M-4.
                        </p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-1.5 bg-emerald-500 rounded-full h-auto min-h-[3rem]"></div>
                     <div>
                        <h4 className="font-medium text-slate-900">Process Efficiency Improvement</h4>
                        <p className="text-sm text-slate-600 mt-1">
                           Cycle times in the Packaging Line D have improved by 4% following the software update on Monday.
                           Throughput has reached an all-time high for this quarter.
                        </p>
                     </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="mt-12 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                <span>Generated by SensorQubit FDC System</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
