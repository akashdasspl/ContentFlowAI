import { useState } from "react";
import { getProfile, saveProfile } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

const VOICE_OPTIONS = ["professional", "casual", "witty", "authoritative", "friendly", "inspirational"];
const TONE_OPTIONS = ["informational", "promotional", "educational", "entertainment"];
const PLATFORM_OPTIONS = [
  { id: "twitter", label: "Twitter / X" },
  { id: "instagram", label: "Instagram" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "blog", label: "Blog" },
  { id: "youtube", label: "YouTube" },
];

export default function Profile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState(getProfile());

  const togglePlatform = (id: string) => {
    setProfile(prev => ({
      ...prev,
      preferred_platforms: prev.preferred_platforms.includes(id)
        ? prev.preferred_platforms.filter(p => p !== id)
        : [...prev.preferred_platforms, id],
    }));
  };

  const handleSave = () => {
    saveProfile(profile);
    toast({ title: "Profile updated!" });
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-foreground mb-1">Profile & Preferences</h1>
          <p className="text-muted-foreground mb-8">Configure your brand voice and content preferences.</p>
        </motion.div>

        <div className="space-y-6">
          <Card className="border-0 shadow-[var(--shadow-card)]">
            <CardHeader><CardTitle className="font-['Space_Grotesk'] text-lg">Basic Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input value={profile.display_name} onChange={e => setProfile(p => ({ ...p, display_name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input placeholder="e.g., Tech, Marketing, Education..." value={profile.industry} onChange={e => setProfile(p => ({ ...p, industry: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Input placeholder="e.g., Young professionals, small business owners..." value={profile.target_audience} onChange={e => setProfile(p => ({ ...p, target_audience: e.target.value }))} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-[var(--shadow-card)]">
            <CardHeader><CardTitle className="font-['Space_Grotesk'] text-lg">Brand Voice & Tone</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Brand Voice</Label>
                <Select value={profile.brand_voice} onValueChange={v => setProfile(p => ({ ...p, brand_voice: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {VOICE_OPTIONS.map(v => <SelectItem key={v} value={v} className="capitalize">{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default Tone</Label>
                <Select value={profile.tone_preference} onValueChange={v => setProfile(p => ({ ...p, tone_preference: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-[var(--shadow-card)]">
            <CardHeader><CardTitle className="font-['Space_Grotesk'] text-lg">Platform Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {PLATFORM_OPTIONS.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2">
                  <Label className="cursor-pointer">{p.label}</Label>
                  <Switch checked={profile.preferred_platforms.includes(p.id)} onCheckedChange={() => togglePlatform(p.id)} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-primary to-[hsl(200,90%,55%)] h-12">
            <Save className="h-4 w-4 mr-2" /> Save Preferences
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
