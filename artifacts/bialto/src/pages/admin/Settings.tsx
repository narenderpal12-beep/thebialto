import { useState, useEffect } from "react";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload, MultiImageUpload } from "@/components/ui/image-upload";
import { Loader2, Save, Globe, Phone, Image as ImageIcon, Share2, Palette, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { data: settings, isLoading } = useGetSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (settings && !form) setForm({ ...settings });
  }, [settings]);

  if (isLoading || !form) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />Loading settings...</div>;
  }

  const set = (field: string, value: any) => setForm((f: any) => ({ ...f, [field]: value }));

  const handleSave = () => {
    const { id, updatedAt, ...data } = form;
    updateSettings.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
          toast({ title: "Settings saved successfully" });
        },
      }
    );
  };

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="font-serif text-lg">{title}</h2>
      </div>
      {children}
    </div>
  );

  const COLOR_PRESETS: Record<string, { primary: string; secondary: string; accent: string }> = {
    "Gold (Default)": { primary: "#c47c2b", secondary: "#1a2c52", accent: "#162040" },
    "Royal Blue":     { primary: "#3b82f6", secondary: "#1e3a5f", accent: "#0f2044" },
    "Emerald":        { primary: "#10b981", secondary: "#1a3a2e", accent: "#0d2a20" },
    "Rose":           { primary: "#e11d48", secondary: "#2a1a2e", accent: "#1a0d1e" },
    "Teal":           { primary: "#14b8a6", secondary: "#1a2e30", accent: "#0d2022" },
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-wide">Site Settings</h1>
          <p className="text-muted-foreground mt-1">Manage website content, contact information, and theme.</p>
        </div>
        <Button onClick={handleSave} disabled={updateSettings.isPending} className="bg-primary text-primary-foreground">
          {updateSettings.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Settings</>}
        </Button>
      </div>

      <Section title="General Information" icon={Globe}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label>Property Name</Label>
            <Input value={form.propertyName ?? ""} onChange={e => set("propertyName", e.target.value)} />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Tagline</Label>
            <Input value={form.tagline ?? ""} onChange={e => set("tagline", e.target.value)} />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Address</Label>
            <Input value={form.address ?? ""} onChange={e => set("address", e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Contact Details" icon={Phone}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={form.phone ?? ""} onChange={e => set("phone", e.target.value)} placeholder="+91 00000 00000" />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input value={form.whatsapp ?? ""} onChange={e => set("whatsapp", e.target.value)} placeholder="+91 00000 00000" />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Email</Label>
            <Input value={form.email ?? ""} onChange={e => set("email", e.target.value)} type="email" />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Google Maps Embed URL</Label>
            <Input value={form.googleMapsEmbed ?? ""} onChange={e => set("googleMapsEmbed", e.target.value)} placeholder="https://maps.google.com/..." />
          </div>
        </div>
      </Section>

      <Section title="Brand & Images" icon={ImageIcon}>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Logo Image</Label>
            <ImageUpload value={form.logoUrl} onChange={url => set("logoUrl", url)} label="Upload Logo" className="max-w-xs" />
          </div>
          <div className="space-y-2">
            <Label>Hero Slider Images</Label>
            <p className="text-xs text-muted-foreground">Upload images that will rotate in the homepage hero slider.</p>
            <MultiImageUpload value={form.heroImages ?? []} onChange={urls => set("heroImages", urls)} label="Add Hero Image" maxImages={6} />
          </div>
        </div>
      </Section>

      {/* Theme & Appearance */}
      <Section title="Theme & Appearance" icon={Palette}>
        <div className="space-y-6">
          {/* Dark / Light mode toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              {form.darkMode !== false ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-yellow-500" />}
              <div>
                <div className="font-medium text-sm">{form.darkMode !== false ? "Dark Mode" : "Light Mode"}</div>
                <div className="text-xs text-muted-foreground">Toggle between dark and light admin theme</div>
              </div>
            </div>
            <Switch
              checked={form.darkMode !== false}
              onCheckedChange={v => set("darkMode", v)}
              id="darkmode"
            />
          </div>

          {/* Color presets */}
          <div className="space-y-2">
            <Label>Color Presets</Label>
            <p className="text-xs text-muted-foreground">Click a preset to fill the color pickers below.</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(COLOR_PRESETS).map(([name, colors]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => { set("primaryColor", colors.primary); set("secondaryColor", colors.secondary); set("accentColor", colors.accent); }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:border-primary text-xs transition-colors"
                >
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: colors.primary }} />
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Color pickers */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <p className="text-xs text-muted-foreground">Buttons, highlights, gold accents</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.primaryColor || "#c47c2b"}
                  onChange={e => set("primaryColor", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5"
                />
                <Input
                  value={form.primaryColor || ""}
                  onChange={e => set("primaryColor", e.target.value)}
                  placeholder="#c47c2b"
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <p className="text-xs text-muted-foreground">Card backgrounds, secondary UI</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.secondaryColor || "#1a2c52"}
                  onChange={e => set("secondaryColor", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5"
                />
                <Input
                  value={form.secondaryColor || ""}
                  onChange={e => set("secondaryColor", e.target.value)}
                  placeholder="#1a2c52"
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <p className="text-xs text-muted-foreground">Card / popover backgrounds</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.accentColor || "#162040"}
                  onChange={e => set("accentColor", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5"
                />
                <Input
                  value={form.accentColor || ""}
                  onChange={e => set("accentColor", e.target.value)}
                  placeholder="#162040"
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Live preview strip */}
          {(form.primaryColor || form.secondaryColor) && (
            <div className="space-y-1">
              <Label>Preview</Label>
              <div className="flex gap-2 items-center p-3 rounded-lg border border-border bg-muted/20">
                <div className="w-8 h-8 rounded" style={{ background: form.primaryColor || "#c47c2b" }} title="Primary" />
                <div className="w-8 h-8 rounded" style={{ background: form.secondaryColor || "#1a2c52" }} title="Secondary" />
                <div className="w-8 h-8 rounded" style={{ background: form.accentColor || "#162040" }} title="Accent" />
                <div className="ml-2 text-xs text-muted-foreground">Colors will apply after saving</div>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section title="Social Media" icon={Share2}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Facebook URL</Label>
            <Input value={form.facebook ?? ""} onChange={e => set("facebook", e.target.value)} placeholder="https://facebook.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input value={form.instagram ?? ""} onChange={e => set("instagram", e.target.value)} placeholder="https://instagram.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Twitter / X URL</Label>
            <Input value={form.twitter ?? ""} onChange={e => set("twitter", e.target.value)} placeholder="https://x.com/..." />
          </div>
        </div>
      </Section>

      <Section title="SEO" icon={Globe}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Meta Title</Label>
            <Input value={form.metaTitle ?? ""} onChange={e => set("metaTitle", e.target.value)} placeholder="The Bialto by Asemont Estate | Luxury Homestay in Kasauli" />
          </div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <textarea value={form.metaDescription ?? ""} onChange={e => set("metaDescription", e.target.value)}
              className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="A 5-floor luxury heritage homestay in the hills of Kasauli..." />
          </div>
        </div>
      </Section>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateSettings.isPending} size="lg" className="bg-primary text-primary-foreground">
          {updateSettings.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save All Settings</>}
        </Button>
      </div>
    </div>
  );
}
