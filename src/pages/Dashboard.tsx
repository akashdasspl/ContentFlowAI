import { useState } from "react";
import { getProfile, getHistory } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { PenTool, BarChart3, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = getProfile();
  const history = getHistory();
  const recent = history.slice(0, 5);

  const stats = {
    total: history.length,
    platforms: [...new Set(history.flatMap(r => r.platforms || []))].length,
    thisWeek: history.filter(r => new Date(r.created_at) > new Date(Date.now() - 7 * 86400000)).length,
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-foreground mb-1">
            Welcome back, {profile.display_name} 👋
          </h1>
          <p className="text-muted-foreground mb-8">Here's what's happening with your content.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: BarChart3, label: "Total Generations", value: stats.total },
            { icon: Star, label: "Platforms Used", value: stats.platforms },
            { icon: Clock, label: "This Week", value: stats.thisWeek },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-0 shadow-[var(--shadow-card)]">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="border-0 shadow-[var(--shadow-card)] bg-gradient-to-r from-primary/5 to-accent/5 mb-8">
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-semibold font-['Space_Grotesk'] text-foreground mb-1">Ready to create?</h3>
              <p className="text-muted-foreground text-sm">Transform your next idea into multi-platform content.</p>
            </div>
            <Button onClick={() => navigate("/generate")} className="mt-4 md:mt-0 bg-gradient-to-r from-primary to-[hsl(200,90%,55%)]">
              <PenTool className="h-4 w-4 mr-2" /> Generate Content
            </Button>
          </CardContent>
        </Card>

        {recent.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold font-['Space_Grotesk'] text-foreground mb-4">Recent Generations</h2>
            <div className="space-y-3">
              {recent.map(item => (
                <Card key={item.id} className="border-0 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-shadow cursor-pointer" onClick={() => navigate("/history")}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.idea}</p>
                      <p className="text-sm text-muted-foreground">{item.platforms.join(", ")} · {new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
