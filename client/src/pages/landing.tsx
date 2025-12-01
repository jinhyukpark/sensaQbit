import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Ruler, PieChart, Wrench, Eye, Cpu, ArrowRight, LogOut } from "lucide-react";
import { useLocation } from "wouter";

const modules = [
  {
    id: "fdc",
    acronym: "FDC",
    title: "Fault Detection and Classification",
    description: "공정에서 발생하는 실시간 센서 데이터를 분석해 제품의 이상 여부와 불량 유형을 자동으로 감지 분류하는 엔진이다. 정상 패턴과 이상 패턴을 비교하여 초기 단계에서 문제를 조기에 발견하고, 품질 저하나 설비 이상이 발생하기 전에 대응할 수 있도록 지원한다.",
    icon: Activity,
    href: "/fdc"
  },
  {
    id: "vm",
    acronym: "VM",
    title: "Virtual Metrology",
    description: "측정 장비를 사용하지 않아도 공정 데이터를 기반으로 제품의 품질 특성을 예측하는 가상 계측 엔진이다. 실제 측정값이 없을 때에도 빠르고 비용 효율적인 품질 판단이 가능하며, 생산성을 높이고 검사 시간을 줄이는 데 기여한다.",
    icon: Ruler,
    href: "#"
  },
  {
    id: "yms",
    acronym: "YMS",
    title: "Yield Management System",
    description: "전체 공정 데이터를 통합 분석해 수율에 영향을 주는 주요 인자와 불량 설비를 빠르게 찾아내는 엔진이다. 공정 조건-설비 정보 이력 데이터를 활용하여 수율 저하 원인을 추적하고, 향후 수율을 예측함으로써 생산 최적화를 돕는다.",
    icon: PieChart,
    href: "#"
  },
  {
    id: "pdm",
    acronym: "PdM",
    title: "Predictive Maintenance",
    description: "설비의 센서 데이터를 실시간으로 모니터링하여 이상 징후를 감지하고, 고장을 사전에 예측해 보전 시점을 추천하는 엔진이다. 계획되지 않은 다운타임을 줄이고 유지보수 효율을 높이며, 설비 수명 연장과 안정적 운영을 지원한다.",
    icon: Wrench,
    href: "#"
  },
  {
    id: "adc",
    acronym: "ADC",
    title: "Automatic Defect Classification",
    description: "제품 이미지 데이터를 딥러닝 기반으로 분석해 불량 여부, 종류, 위치를 자동으로 판별하는 영상 분석 엔진이다. 사람의 육안 검사보다 빠르고 정확하며, 다양한 패턴의 결함을 지속적으로 학습해 검사 품질을 점진적으로 향상시킨다.",
    icon: Eye,
    href: "#"
  },
  {
    id: "apc",
    acronym: "APC",
    title: "Advanced Process Control",
    description: "공정 전반의 품질을 예측하고 최적의 제어 조건을 자동으로 계산해 실행하는 고도화된 공정 제어 엔진이다. 공정 변동을 실시간으로 보정하고 품질 편차를 최소화하여 안정적인 생산성과 고품질 제품 출력을 가능하게 한다.",
    icon: Cpu,
    href: "#"
  }
];

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background p-8 flex flex-col">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-start mb-12">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">안녕하세요, jh.park@illunex.com님</h1>
          <p className="text-muted-foreground">원하는 모듈을 선택해 주세요.</p>
        </div>
        <Button variant="ghost" className="text-muted-foreground">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <Card key={mod.id} className="flex flex-col hover:shadow-lg transition-all duration-300 border-muted hover:border-primary/50 group bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <mod.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{mod.acronym}</h2>
                </div>
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground">{mod.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {mod.description}
              </p>
            </CardContent>
            <CardFooter className="pt-4 border-t bg-muted/20">
              <Button 
                className="w-full group-hover:translate-x-1 transition-all duration-300" 
                onClick={() => mod.href !== "#" && setLocation(mod.href)}
                variant={mod.href === "#" ? "outline" : "default"}
                disabled={mod.href === "#"}
              >
                {mod.href === "#" ? "Coming Soon" : "바로가기"}
                {mod.href !== "#" && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </main>
      
      <footer className="max-w-7xl mx-auto w-full mt-12 text-center text-xs text-muted-foreground">
        <p>카드를 클릭하거나 오른쪽 아래 버튼으로 알 수 있어요.</p>
      </footer>
    </div>
  );
}
