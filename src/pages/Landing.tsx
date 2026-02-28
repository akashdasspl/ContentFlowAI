import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Globe, Palette, Brain, ArrowRight, Sparkles } from "lucide-react";

const features = [
  { icon: Brain, title: "AI-Powered Generation", desc: "Transform a single idea into platform-optimized content using advanced AI models." },
  { icon: Globe, title: "Multi-Platform Output", desc: "Generate tailored content for Twitter/X, Instagram, LinkedIn, Blog, and YouTube simultaneously." },
  { icon: Palette, title: "Brand Voice Matching", desc: "Maintain your unique brand identity across every piece of content you create." },
  { icon: Zap, title: "Instant Optimization", desc: "Get hashtags, word counts, and tone indicators — all optimized per platform." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-['Space_Grotesk'] text-foreground">ContentFlow AI</span>
        </div>
        <Button onClick={() => navigate("/dashboard")} className="bg-gradient-to-r from-primary to-[hsl(200,90%,55%)] hover:opacity-90">
          Go to Dashboard
        </Button>
      </nav>

      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium mb-6">
            <Sparkles className="h-4 w-4" /> AI-Powered Content Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 font-['Space_Grotesk'] leading-tight">
            One Idea.<br />
            <span className="bg-gradient-to-r from-primary to-[hsl(172,66%,50%)] bg-clip-text text-transparent">
              Every Platform.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            ContentFlow AI transforms your content ideas into platform-optimized posts for Twitter/X, Instagram, LinkedIn, Blog, and YouTube — in seconds.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/generate")} className="bg-gradient-to-r from-primary to-[hsl(200,90%,55%)] hover:opacity-90 text-lg px-8 h-14">
              Start Creating <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")} className="text-lg px-8 h-14">
              Dashboard
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-['Space_Grotesk'] mb-4">
            Everything You Need to Scale Content
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Built for creators, marketers, and businesses who want to maximize their content reach.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full border-0 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 font-['Space_Grotesk']">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 ContentFlow AI. All rights reserved.
      </footer>
    </div>
  );
}
