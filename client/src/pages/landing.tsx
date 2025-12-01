import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Ruler, PieChart, Wrench, Eye, Cpu, ArrowRight, LogOut, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

const modules = [
  {
    id: "fdc",
    acronym: "FDC",
    title: "Fault Detection and Classification",
    description: "공정에서 발생하는 실시간 센서 데이터를 분석해 제품의 이상 여부와 불량 유형을 자동으로 감지 분류하는 엔진이다.",
    icon: Activity,
    href: "/fdc",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/50"
  },
  {
    id: "vm",
    acronym: "VM",
    title: "Virtual Metrology",
    description: "측정 장비를 사용하지 않아도 공정 데이터를 기반으로 제품의 품질 특성을 예측하는 가상 계측 엔진이다.",
    icon: Ruler,
    href: "#",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "hover:border-emerald-500/50"
  },
  {
    id: "yms",
    acronym: "YMS",
    title: "Yield Management System",
    description: "전체 공정 데이터를 통합 분석해 수율에 영향을 주는 주요 인자와 불량 설비를 빠르게 찾아내는 엔진이다.",
    icon: PieChart,
    href: "#",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "hover:border-purple-500/50"
  },
  {
    id: "pdm",
    acronym: "PdM",
    title: "Predictive Maintenance",
    description: "설비의 센서 데이터를 실시간으로 모니터링하여 이상 징후를 감지하고, 고장을 사전에 예측해 보전 시점을 추천한다.",
    icon: Wrench,
    href: "#",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-500/50"
  },
  {
    id: "adc",
    acronym: "ADC",
    title: "Automatic Defect Classification",
    description: "제품 이미지 데이터를 딥러닝 기반으로 분석해 불량 여부, 종류, 위치를 자동으로 판별하는 영상 분석 엔진이다.",
    icon: Eye,
    href: "#",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "hover:border-rose-500/50"
  },
  {
    id: "apc",
    acronym: "APC",
    title: "Advanced Process Control",
    description: "공정 전반의 품질을 예측하고 최적의 제어 조건을 자동으로 계산해 실행하는 고도화된 공정 제어 엔진이다.",
    icon: Cpu,
    href: "#",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "hover:border-cyan-500/50"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden relative selection:bg-blue-500/30">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[30%] w-[20%] h-[20%] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen p-8">
        {/* Header */}
        <header className="max-w-7xl mx-auto w-full flex justify-between items-start mb-16 pt-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-mono tracking-wider uppercase">Intelligent Manufacturing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400">
              Welcome Back, Engineer
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Select an AI module to begin your analysis.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </motion.div>
        </header>

        {/* Grid */}
        <motion.main 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12"
        >
          {modules.map((mod) => (
            <motion.div key={mod.id} variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <Card className={`h-full flex flex-col bg-slate-900/40 backdrop-blur-xl border-slate-800 transition-all duration-300 ${mod.border} hover:shadow-2xl hover:shadow-blue-900/20 group overflow-hidden relative`}>
                
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-white to-transparent pointer-events-none`} />
                
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${mod.bg} ${mod.color} flex items-center justify-center ring-1 ring-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <mod.icon className="w-7 h-7" />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className={`w-5 h-5 ${mod.color}`} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">{mod.acronym}</h2>
                    <p className={`text-sm font-medium ${mod.color}`}>{mod.title}</p>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 relative z-10">
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 group-hover:text-slate-300 transition-colors">
                    {mod.description}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-4 border-t border-white/5 relative z-10">
                  <Button 
                    className={`w-full bg-slate-800 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 font-medium border border-white/5 ${mod.href !== "#" ? "group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500" : ""}`}
                    onClick={() => mod.href !== "#" && setLocation(mod.href)}
                    disabled={mod.href === "#"}
                  >
                    {mod.href === "#" ? (
                      <span className="text-slate-500">Coming Soon</span>
                    ) : (
                      <span className="flex items-center">
                        Launch Module
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.main>
        
        <footer className="max-w-7xl mx-auto w-full mt-auto text-center py-6">
          <p className="text-xs text-slate-600 font-mono">
            SENSORQUBIT INTELLIGENT PLATFORM • V2.4.0
          </p>
        </footer>
      </div>
    </div>
  );
}
