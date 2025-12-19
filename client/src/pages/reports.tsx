import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, MoreHorizontal, FileDown, Eye, BarChart3, Activity, CheckCircle, AlertCircle } from "lucide-react";
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
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const reports = [
  { 
    id: "R-2023-001", 
    title: "Weekly Fault Analysis - Factory A", 
    date: "2023-10-24", 
    author: "Jane Doe", 
    status: "Completed",
    type: "Fault Analysis",
    summary: "Stable production environment with 98.2% OEE. Recurring vibration anomaly in Robot Arm K-200.",
    findings: [
      { title: "Vibration Spike Detected (Zone B)", description: "15% increase in vibration amplitude on Conveyor Belt M-4 due to heavier components.", severity: "warning" },
      { title: "Process Efficiency Improvement", description: "Packaging Line D cycle times improved by 4% after software update.", severity: "positive" }
    ]
  },
  { 
    id: "R-2023-002", 
    title: "Incident Report: Robot Arm K-200 Overheat", 
    date: "2023-10-22", 
    author: "John Smith", 
    status: "Completed",
    type: "Incident Report",
    summary: "Critical thermal event detected in Unit K-200. System auto-shutdown initiated at 14:02 PM.",
    findings: [
      { title: "Cooling Fan Failure", description: "Primary intake fan obstructed by debris buildup.", severity: "critical" },
      { title: "Thermal Sensor Response", description: "Sensor T-203 correctly triggered emergency stop within 500ms.", severity: "positive" }
    ]
  },
  { 
    id: "R-2023-003", 
    title: "Monthly Performance Review", 
    date: "2023-10-01", 
    author: "System Auto", 
    status: "Draft",
    type: "Performance Review",
    summary: "September 2023 aggregate performance metrics across all zones.",
    findings: []
  },
];

export default function ReportsPage() {
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0].id);
  const selectedReport = reports.find(r => r.id === selectedReportId);

  return (
    <AppLayout title="Reports" hideFilters={true}>
      <div className="flex h-[calc(100vh-100px)] gap-6">
        
        {/* Left Panel: Report List */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="flex items-center justify-between shrink-0">
            <h2 className="text-lg font-medium">Generated Reports</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" /> New Report
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

          <Card className="flex-1 overflow-hidden flex flex-col">
            <div className="p-0 flex-1">
              <ScrollArea className="h-full">
                <div className="divide-y">
                  {reports.map((report) => (
                    <div 
                      key={report.id}
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedReportId === report.id ? "bg-muted border-l-4 border-l-primary" : "border-l-4 border-l-transparent"}`}
                      onClick={() => setSelectedReportId(report.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-medium text-sm line-clamp-1 ${selectedReportId === report.id ? "text-primary" : ""}`}>
                          {report.title}
                        </h3>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ml-2 ${
                          report.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-xs text-muted-foreground">
                          {report.date} • {report.author}
                        </div>
                        {selectedReportId === report.id && (
                          <Eye className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </div>

        {/* Right Panel: Report Preview */}
        <div className="flex-1 h-full overflow-hidden flex flex-col">
          {selectedReport ? (
            <div className="h-full border rounded-lg bg-white shadow-sm flex flex-col overflow-hidden">
              {/* Report Actions Bar */}
              <div className="bg-slate-50 border-b px-6 py-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-600">Previewing: {selectedReport.id}</span>
                </div>
                <Button size="sm" variant="outline" className="gap-2 h-8" onClick={() => window.print()}>
                  <FileDown className="w-3 h-3" /> Export PDF
                </Button>
              </div>

              {/* Report Content */}
              <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                <div className="max-w-[210mm] mx-auto bg-white shadow-lg min-h-[297mm] p-[20mm] relative">
                  {/* Header */}
                  <div className="text-center mb-12 pb-8 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SensorQubit FDC Module</div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{selectedReport.title}</h1>
                    <div className="flex justify-center gap-4 text-sm text-slate-500">
                      <span>Date: {selectedReport.date}</span>
                      <span>•</span>
                      <span>Author: {selectedReport.author}</span>
                      <span>•</span>
                      <span>Type: {selectedReport.type}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Executive Summary */}
                    <section>
                      <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase text-xs tracking-wider border-l-4 border-primary pl-3">Executive Summary</h3>
                      <p className="text-slate-600 leading-relaxed text-sm text-justify">
                        {selectedReport.summary}
                        {selectedReport.status === "Draft" && " [This section is pending final review]"}
                      </p>
                    </section>

                    {/* Charts Grid (Visual Placeholder) */}
                    <section className="grid grid-cols-2 gap-6 my-8">
                       <div className="h-48 bg-slate-50 border border-slate-100 rounded flex flex-col items-center justify-center text-slate-400 gap-2">
                          <BarChart3 className="w-8 h-8 opacity-30" />
                          <span className="text-xs font-medium">Fault Statistics</span>
                       </div>
                       <div className="h-48 bg-slate-50 border border-slate-100 rounded flex flex-col items-center justify-center text-slate-400 gap-2">
                          <Activity className="w-8 h-8 opacity-30" />
                          <span className="text-xs font-medium">Sensor Trends</span>
                       </div>
                    </section>

                    {/* Detailed Findings */}
                    <section>
                      <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase text-xs tracking-wider border-l-4 border-primary pl-3">Detailed Findings & Recommendations</h3>
                      <div className="space-y-6">
                        {selectedReport.findings.length > 0 ? (
                          selectedReport.findings.map((finding, index) => (
                            <div key={index} className="flex gap-4 items-start">
                               <div className={`w-1 shrink-0 rounded-full mt-1.5 h-12 ${
                                 finding.severity === 'critical' ? 'bg-destructive' : 
                                 finding.severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                               }`}></div>
                               <div>
                                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                    {finding.title}
                                    {finding.severity === 'critical' && <AlertCircle className="w-3 h-3 text-destructive" />}
                                    {finding.severity === 'positive' && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                                  </h4>
                                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                     {finding.description}
                                  </p>
                               </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400 italic">No detailed findings recorded for this report.</p>
                        )}
                      </div>
                    </section>
                  </div>
                  
                  {/* Footer */}
                  <div className="absolute bottom-[20mm] left-[20mm] right-[20mm] pt-4 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 uppercase tracking-wider">
                    <span>Generated by SensorQubit FDC System</span>
                    <span>CONFIDENTIAL</span>
                    <span>Page 1 of 1</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full border rounded-lg bg-muted/10 border-dashed flex items-center justify-center text-muted-foreground">
              Select a report to view details
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
