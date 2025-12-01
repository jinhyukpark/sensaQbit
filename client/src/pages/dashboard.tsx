import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle2, Clock, Server } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

        {/* Process Overview Panel */}
        <Card className="shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Process Flow Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-24 flex items-center justify-between px-10">
              {/* Simple Process Flow Visualization */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10 transform -translate-y-1/2"></div>
              
              {["Input Feeder", "Etching", "Washing", "Assembly", "Packaging"].map((step, i) => (
                <div key={step} className="flex flex-col items-center gap-2 bg-background px-2">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${i === 2 ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-emerald-500 bg-emerald-50 text-emerald-600'}`}>
                    {i === 2 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-medium">{step}</span>
                </div>
              ))}
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
      </div>
    </AppLayout>
  );
}
