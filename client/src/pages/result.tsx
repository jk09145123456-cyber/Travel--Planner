import { useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { useGenerateItinerary } from "@/hooks/use-itinerary";
import { ItineraryView } from "@/components/itinerary-view";
import { saveItinerary } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Result() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  
  const city = params.get("city") || "";
  const days = Number(params.get("days")) || 3;
  const tempo = params.get("tempo") || "보통";
  const budget = Number(params.get("budget")) || 0;

  const { mutate, data, isPending, error } = useGenerateItinerary();
  const { toast } = useToast();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (city && !hasFetched.current && !data) {
      hasFetched.current = true;
      mutate({ city, days, tempo, budget });
    }
  }, [city, days, tempo, budget, mutate, data]);

  const handleSave = () => {
    if (!data) return;
    saveItinerary(data);
    toast({
      title: "일정이 저장되었습니다!",
      description: "저장된 일정 페이지에서 언제든 다시 볼 수 있어요.",
    });
  };

  const calculateTotalCost = (plan: any[]) => {
    if (!plan) return 0;
    return plan.reduce((acc, day) => {
      if (!day.activities) return acc;
      return acc + day.activities.reduce((dAcc: number, act: any) => {
        // Handle cost string if it's "20000원" or number
        let costVal = 0;
        if (typeof act.cost === 'string') {
          costVal = parseInt(act.cost.replace(/[^0-9]/g, "")) || 0;
        } else if (typeof act.cost === 'number') {
          costVal = act.cost;
        }
        return dAcc + costVal;
      }, 0);
    }, 0);
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
          <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-display font-bold">{city} 여행 계획을 세우는 중...</h3>
          <p className="text-muted-foreground animate-pulse">{tempo} 여행에 딱 맞는 장소들을 찾고 있어요.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">문제가 발생했습니다.</h2>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Button onClick={() => setLocation("/")}>다시 시도</Button>
      </div>
    );
  }

  if (!data || !data.plan) return null;

  const totalCost = calculateTotalCost(data.plan);
  const remaining = (data.budget || 0) - totalCost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50/20 pb-20">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="-ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로
          </Button>
          <span className="font-display font-bold text-lg hidden sm:block">Travel Gen</span>
          <Button size="sm" onClick={handleSave} className="bg-primary hover:bg-primary/90 shadow-md">
            <Save className="w-4 h-4 mr-2" />
            일정 저장
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8 sm:pt-12">
        <div className="mb-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI 추천 일정</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground">
            {data.city} 여행 일정표
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-muted-foreground text-lg">
            <span>{data.tempo} 여행</span>
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
            <span>{data.days}일 계획</span>
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
            <span className="flex items-center gap-1">
              <Wallet className="w-4 h-4" />
              예산: {(data.budget || 0).toLocaleString()}원
            </span>
          </div>
        </div>

        <ItineraryView data={data} />

        {/* Budget Summary Card */}
        <div className="mt-12 p-6 rounded-3xl bg-white shadow-xl border border-border/50">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            예산 요약
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-secondary/30">
              <p className="text-sm text-muted-foreground mb-1">총 예상 비용</p>
              <p className="text-2xl font-bold text-foreground">{totalCost.toLocaleString()}원</p>
            </div>
            <div className={`p-4 rounded-2xl ${remaining >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <p className="text-sm opacity-80 mb-1">잔액</p>
              <p className="text-2xl font-bold">{remaining.toLocaleString()}원</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
