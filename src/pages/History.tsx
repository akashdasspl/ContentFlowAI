import { useState } from "react";
import { getHistory, deleteFromHistory, type ContentGeneration } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/AppLayout";
import { Search, Copy, Trash2, Hash, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function History() {
  const { toast } = useToast();
  const [items, setItems] = useState<ContentGeneration[]>(getHistory());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContentGeneration | null>(null);

  const filtered = items.filter(i => i.idea.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    setItems(prev => prev.filter(i => i.id !== id));
    setSelected(null);
    toast({ title: "Content deleted" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-foreground mb-1">Content History</h1>
          <p className="text-muted-foreground mb-6">All your generated content in one place.</p>
        </motion.div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by idea..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            {items.length === 0 ? "No content generated yet. Start creating!" : "No results found."}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="border-0 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-shadow cursor-pointer" onClick={() => setSelected(item)}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.idea}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.platforms.join(", ")} · {item.tone} · {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); handleDelete(item.id); }}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-['Space_Grotesk']">{selected?.idea}</DialogTitle>
            </DialogHeader>
            {selected && (
              <Tabs defaultValue={selected.platforms[0]}>
                <TabsList className="flex-wrap">
                  {selected.platforms.map(p => (
                    <TabsTrigger key={p} value={p} className="capitalize">{p}</TabsTrigger>
                  ))}
                </TabsList>
                {selected.platforms.map(p => {
                  const content = selected.generated_content?.[p];
                  if (!content) return null;
                  return (
                    <TabsContent key={p} value={p} className="space-y-3">
                      <div className="bg-muted rounded-xl p-4">
                        <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">{content.text}</pre>
                      </div>
                      {content.hashtags && content.hashtags.length > 0 && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Hash className="h-3.5 w-3.5" /> {content.hashtags.join(" ")}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" /> {content.wordCount} words
                      </div>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(content.text)}>
                        <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                      </Button>
                    </TabsContent>
                  );
                })}
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
