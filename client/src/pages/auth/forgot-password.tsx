import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast({
      title: "비밀번호 재설정 이메일 전송",
      description: "입력하신 이메일로 재설정 링크가 전송되었습니다.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Button variant="ghost" onClick={() => setLocation("/auth/login")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          로그인으로 돌아가기
        </Button>
        <Card className="rounded-3xl shadow-2xl border-white/20 overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground pt-10 pb-8 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Key className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-3xl font-display font-bold">비밀번호 찾기</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 px-8">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full py-6 rounded-2xl font-bold">재설정 링크 보내기</Button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100">
                  <p className="font-medium">이메일이 전송되었습니다!</p>
                  <p className="text-sm opacity-90">{email} 주소를 확인해주세요.</p>
                </div>
                <Button variant="outline" onClick={() => setLocation("/auth/login")} className="w-full rounded-xl">
                  로그인 페이지로 이동
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="pb-8 px-8 flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              도움이 필요하신가요?{" "}
              <Button variant="link" className="p-0 h-auto font-bold text-primary">
                고객센터 문의
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
