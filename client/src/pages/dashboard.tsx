import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle2, Clock, Server, ArrowRight, Gauge, Zap, Waves } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const kpiData = [
  { title: "Equipment Status", value: "98.2%", sub: "Operational", icon: Server, color: "text-emerald-500" },
  { title: "Active Faults", value: "3", sub: "Requires Attention", icon: AlertTriangle, color: "text-destructive", isAlert: true },
  { title: "Quality Rate", value: "99.9%", sub: "+0.2% vs last week", icon: CheckCircle2, color: "text-blue-500" },
  { title: "Avg Detection Time", value: "42ms", sub: "Real-time", icon: Clock, color: "text-purple-500" },
];

const sensorData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  vibration: Math.random() * 40 + 20,
  temperature: Math.random() * 20 + 60,
  pressure: Math.random() * 10 + 90,
}));

const faultData = [
  { name: "Overheat", count: 12 },
  { name: "Vibration", count: 8 },
  { name: "Pressure Drop", count: 5 },
  { name: "Sensor Drift", count: 3 },
  { name: "Comm Error", count: 2 },
];

const recentAlarms = [
  { time: "6:48:50 AM", sensor: "S1", type: "Drift", color: "bg-blue-100 text-blue-800" },
  { time: "6:47:50 AM", sensor: "S2", type: "Spike", color: "bg-blue-100 text-blue-800" },
  { time: "6:46:50 AM", sensor: "S3", type: "LowSignal", color: "bg-blue-100 text-blue-800" },
  { time: "6:45:50 AM", sensor: "S1", type: "Drift", color: "bg-blue-100 text-blue-800" },
  { time: "6:44:50 AM", sensor: "S2", type: "Spike", color: "bg-blue-100 text-blue-800" },
  { time: "6:43:50 AM", sensor: "S3", type: "LowSignal", color: "bg-blue-100 text-blue-800" },
  { time: "6:42:50 AM", sensor: "S1", type: "Drift", color: "bg-blue-100 text-blue-800" },
  { time: "6:41:50 AM", sensor: "S2", type: "Spike", color: "bg-blue-100 text-blue-800" },
];

const processSteps = [
  { name: "Input Feeder", status: "normal", metric: "120 units/min", efficiency: 99, icon: Zap },
  { name: "Etching", status: "normal", metric: "45°C Avg", efficiency: 98, icon: Waves },
  { name: "Washing", status: "warning", metric: "Pressure Low", efficiency: 82, icon: Gauge, issue: "Check Pump" },
  { name: "Assembly", status: "normal", metric: "0.2s Cycle", efficiency: 99, icon: Activity },
  { name: "Packaging", status: "normal", metric: "Queue: 45", efficiency: 100, icon: Server },
];

export default function Dashboard() {
  return (
    <AppLayout title="Overview">
      <div className="space-y-6">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi) => (
            <Card 
              key={kpi.title} 
              className={`shadow-sm border-border/60 ${kpi.isAlert ? 'bg-destructive/10 border-destructive/50' : ''}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className={`text-sm font-medium ${kpi.isAlert ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                  {kpi.title}
                </CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${kpi.isAlert ? 'text-destructive' : ''}`}>{kpi.value}</div>
                <p className={`text-xs mt-1 ${kpi.isAlert ? 'text-destructive/80 font-medium' : 'text-muted-foreground'}`}>{kpi.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Overview Panel - Enhanced */}
        <Card className="shadow-sm border-border/60 overflow-hidden">
          <CardHeader className="pb-4 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Real-time Process Insights</CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                 <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Normal</span>
                 <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Warning</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 overflow-x-auto">
            <div className="min-w-[800px] flex items-center justify-between">
              
              {processSteps.map((step, i) => {
                const isWarning = step.status === "warning";
                return (
                  <div key={step.name} className="flex items-center flex-1 last:flex-none">
                     <div className={`
                        relative w-40 p-3 rounded-lg border-2 bg-background transition-all duration-300 hover:shadow-md hover:-translate-y-1 z-10
                        ${isWarning ? 'border-amber-500/50 bg-amber-50/50' : 'border-border hover:border-primary/50'}
                     `}>
                        <div className="flex items-center justify-between mb-2">
                           <span className={`text-xs font-bold uppercase ${isWarning ? 'text-amber-600' : 'text-muted-foreground'}`}>
                             {step.name}
                           </span>
                           {isWarning ? 
                             <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" /> : 
                             <step.icon className="w-4 h-4 text-emerald-500" />
                           }
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-end gap-1">
                             <span className="text-lg font-bold leading-none">{step.efficiency}%</span>
                             <span className="text-[10px] text-muted-foreground mb-0.5">Eff.</span>
                          </div>
                          <div className={`text-xs font-medium ${isWarning ? 'text-amber-600' : 'text-primary'}`}>
                             {step.metric}
                          </div>
                          {step.issue && (
                            <div className="text-[10px] text-red-500 font-bold mt-1 bg-red-50 px-1 py-0.5 rounded inline-block">
                              ! {step.issue}
                            </div>
                          )}
                        </div>
                     </div>

                     {/* Connection Line */}
                     {i < processSteps.length - 1 && (
                       <div className="flex-1 h-[2px] bg-secondary relative mx-2 overflow-hidden">
                         <motion.div 
                           className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 w-1/2"
                           initial={{ x: "-100%" }}
                           animate={{ x: "200%" }}
                           transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
                         />
                         <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-1 text-border z-10">
                           <ArrowRight className="w-4 h-4" />
                         </div>
                       </div>
                     )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Sensor Chart */}
          <Card className="lg:col-span-2 shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Real-time Sensor Telemetry</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sensorData}>
                  <defs>
                    <linearGradient id="colorVib" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }}
                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  />
                  <Area type="monotone" dataKey="vibration" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVib)" strokeWidth={2} />
                  <Area type="monotone" dataKey="temperature" stroke="hsl(var(--chart-2))" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Fault Distribution */}
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Fault Type Frequency</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={faultData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))' }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>

        {/* Recent Alarms Table */}
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-4 border-b bg-muted/20 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Default Detection Alarms</CardTitle>
            <div className="text-xs text-muted-foreground animate-pulse">
              2s 간격 자동 갱신
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Time</TableHead>
                  <TableHead>Sensor</TableHead>
                  <TableHead>Fault Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAlarms.map((alarm, i) => (
                  <TableRow key={i} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-xs">{alarm.time}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-normal bg-slate-100 text-slate-600 border-slate-200">
                        {alarm.sensor}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-xs font-normal border-none ${alarm.color}`}>
                        {alarm.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
