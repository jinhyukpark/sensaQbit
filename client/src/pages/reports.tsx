import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, MoreHorizontal, FileDown, Eye } from "lucide-react";
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
        <div className="mt-8 p-8 border rounded-lg bg-white shadow-sm max-w-4xl mx-auto min-h-[500px]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Weekly Fault Analysis</h1>
            <p className="text-slate-500">Factory Alpha • Oct 24, 2023</p>
          </div>
          <div className="space-y-6">
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
            <div className="grid grid-cols-2 gap-4 mt-8">
               <div className="h-40 bg-slate-50 border border-slate-200 rounded flex items-center justify-center text-slate-400">Chart Placeholder</div>
               <div className="h-40 bg-slate-50 border border-slate-200 rounded flex items-center justify-center text-slate-400">Chart Placeholder</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
