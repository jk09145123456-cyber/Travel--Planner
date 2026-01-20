import { useState } from "react";
import { useLocation } from "wouter";
import { Plane, Calendar, Gauge, ArrowRight, Wallet, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [city, setCity] = useState("");
  const [days, setDays] = useState<number | "">("");
  const [tempo, setTempo] = useState("보통");
  const [budget, setBudget] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!city.trim()) {
      toast({ title: "입력 오류", description: "도시 이름을 입력해주세요.", variant: "destructive" });
      return;
    }
    if (!days || Number(days) < 1 || Number(days) > 14) {
      toast({ title: "입력 오류", description: "여행 기간은 1~14일 사이로 입력해주세요.", variant: "destructive" });
      return;
    }
    if (budget === "" || Number(budget) < 0) {
      toast({ title: "입력 오류", description: "예산을 입력해주세요.", variant: "destructive" });
      return;
    }

    setLocation(`/result?city=${encodeURIComponent(city)}&days=${days}&tempo=${encodeURIComponent(tempo)}&budget=${budget}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-orange-50/30 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Header with Login Button */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setLocation('/auth/login')} className="rounded-full">
          <LogIn className="w-4 h-4 mr-2" />
          로그인
        </Button>
      </div>

      <div className="w-full max-w-lg mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-block p-3 rounded-2xl bg-primary/10 text-primary mb-2">
            <Plane className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground leading-tight">
            Design Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              Dream Trip
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xs mx-auto">
            AI-powered itineraries tailored to your budget and pace.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-3xl shadow-xl border border-white/20 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Plane className="w-4 h-4 text-primary" />
                여행지
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="예: 도쿄, 파리, 뉴욕"
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  여행 기간
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value) || "")}
                  placeholder="1 - 14일"
                  className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Wallet className="w-4 h-4 text-primary" />
                  예산 (KRW)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value) || "")}
                  placeholder="예: 1000000"
                  className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Gauge className="w-4 h-4 text-primary" />
                여행 템포
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["느긋", "보통", "빡빡"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTempo(t)}
                    className={`
                      py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                      ${tempo === t 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit"
                className="w-full py-6 text-lg rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all group"
              >
                일정 생성하기
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <Button variant="link" onClick={() => setLocation('/saved')} className="text-muted-foreground hover:text-primary">
            저장된 일정 보기
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
