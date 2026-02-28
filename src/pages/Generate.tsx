import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import { Sparkles, Copy, Download, Loader2, Hash, FileText, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { addToHistory } from "@/lib/storage";

const PLATFORMS = [
  { id: "twitter", label: "Twitter / X", icon: "𝕏" },
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "linkedin", label: "LinkedIn", icon: "💼" },
  { id: "blog", label: "Blog Post", icon: "📝" },
  { id: "youtube", label: "YouTube Script", icon: "🎬" },
];

const TONES = ["informational", "promotional", "educational", "entertainment", "professional", "casual", "witty"];

type GeneratedContent = Record<string, { text: string; hashtags?: string[]; wordCount: number; tone: string }>;

export default function Generate() {
  const { toast } = useToast();
  const [idea, setIdea] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter", "linkedin"]);
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedContent | null>(null);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!idea.trim() || selectedPlatforms.length === 0) {
      toast({ title: "Missing info", description: "Enter an idea and select at least one platform.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { idea, platforms: selectedPlatforms, tone },
      });

      if (error) throw error;

      const generated = data.content as GeneratedContent;
      setResults(generated);

      // Save to localStorage history
      addToHistory({
        idea,
        platforms: selectedPlatforms,
        generated_content: generated,
        tone,
      });
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const downloadContent = (text: string, platform: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contentflow-${platform}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-foreground mb-1">Generate Content</h1>
          <p className="text-muted-foreground mb-8">Transform your idea into multi-platform content.</p>
        </motion.div>

        <Card className="border-0 shadow-[var(--shadow-card)] mb-6">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Your Content Idea</Label>
              <Textarea
                placeholder="Describe your content idea... (e.g., 'Tips for productivity while working from home')"
                value={idea}
                onChange={e => setIdea(e.target.value.slice(0, 500))}
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">{idea.length}/500</p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-medium">Tone / Style</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TONES.map(t => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-foreground font-medium">Target Platforms</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {PLATFORMS.map(p => (
                  <label
                    key={p.id}
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedPlatforms.includes(p.id)
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <Checkbox checked={selectedPlatforms.includes(p.id)} onCheckedChange={() => togglePlatform(p.id)} />
                    <span className="text-sm">{p.icon} {p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !idea.trim() || selectedPlatforms.length === 0}
              className="w-full bg-gradient-to-r from-primary to-[hsl(200,90%,55%)] h-12 text-base"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Generate Content</>
              )}
            </Button>
          </CardContent>
        </Card>

        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="font-['Space_Grotesk']">Generated Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={selectedPlatforms[0]}>
                  <TabsList className="mb-4 flex-wrap">
                    {selectedPlatforms.map(p => (
                      <TabsTrigger key={p} value={p} className="capitalize">{PLATFORMS.find(pl => pl.id === p)?.icon} {p}</TabsTrigger>
                    ))}
                  </TabsList>
                  {selectedPlatforms.map(p => {
                    const content = results[p];
                    if (!content) return null;
                    return (
                      <TabsContent key={p} value={p}>
                        <div className="space-y-4">
                          <div className="bg-muted rounded-xl p-4">
                            <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">{content.text}</pre>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm">
                            {content.hashtags && content.hashtags.length > 0 && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Hash className="h-3.5 w-3.5" /> {content.hashtags.join(" ")}
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <FileText className="h-3.5 w-3.5" /> {content.wordCount} words
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground capitalize">
                              <BarChart className="h-3.5 w-3.5" /> {content.tone}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(content.text)}>
                              <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => downloadContent(content.text, p)}>
                              <Download className="h-3.5 w-3.5 mr-1" /> Download
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
