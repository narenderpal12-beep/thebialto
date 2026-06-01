import { useState, useEffect } from "react";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload, MultiImageUpload } from "@/components/ui/image-upload";
import {
  Loader2, Save, Globe, Phone, Image as ImageIcon, Share2, Palette,
  Moon, Sun, Home, Info, Layers, FootprintsIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TABS = [
  { id: "general",  label: "General",         icon: Globe },
  { id: "homepage", label: "Homepage",         icon: Home },
  { id: "brand",    label: "Brand & Images",   icon: ImageIcon },
  { id: "theme",    label: "Theme",            icon: Palette },
  { id: "social",   label: "Social & SEO",     icon: Share2 },
] as const;

type Tab = typeof TABS[number]["id"];

export default function AdminSettings() {
  const { data: settings, isLoading } = useGetSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("general");

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

  const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );

  const Row = ({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) => (
    <div className={`grid grid-cols-${cols} gap-4`}>{children}</div>
  );

  const COLOR_PRESETS: Record<string, { primary: string; secondary: string; accent: string }> = {
    "Gold (Default)": { primary: "#c47c2b", secondary: "#1a2c52", accent: "#162040" },
    "Royal Blue":     { primary: "#3b82f6", secondary: "#1e3a5f", accent: "#0f2044" },
    "Emerald":        { primary: "#10b981", secondary: "#1a3a2e", accent: "#0d2a20" },
    "Rose":           { primary: "#e11d48", secondary: "#2a1a2e", accent: "#1a0d1e" },
    "Teal":           { primary: "#14b8a6", secondary: "#1a2e30", accent: "#0d2022" },
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-wide">Site Settings</h1>
          <p className="text-muted-foreground mt-1">Manage website content, homepage sections, branding, and theme.</p>
        </div>
        <Button onClick={handleSave} disabled={updateSettings.isPending} className="bg-primary text-primary-foreground">
          {updateSettings.isPending
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
            : <><Save className="w-4 h-4 mr-2" />Save Settings</>}
        </Button>
      </div>

      {/* Tab strip */}
      <div className="flex gap-1 border-b border-border overflow-x-auto pb-px">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">

        {/* ── GENERAL ─────────────────────────────────── */}
        {activeTab === "general" && (
          <>
            <SectionHead icon={Globe} title="General Information" />
            <div className="space-y-4">
              <Field label="Property Name">
                <Input value={form.propertyName ?? ""} onChange={e => set("propertyName", e.target.value)} />
              </Field>
              <Field label="Tagline" hint="Short phrase shown in browser tab and meta.">
                <Input value={form.tagline ?? ""} onChange={e => set("tagline", e.target.value)} />
              </Field>
              <Field label="Address">
                <Input value={form.address ?? ""} onChange={e => set("address", e.target.value)} />
              </Field>
            </div>

            <SectionHead icon={Phone} title="Contact Details" />
            <div className="space-y-4">
              <Row>
                <Field label="Phone">
                  <Input value={form.phone ?? ""} onChange={e => set("phone", e.target.value)} placeholder="+91 00000 00000" />
                </Field>
                <Field label="WhatsApp">
                  <Input value={form.whatsapp ?? ""} onChange={e => set("whatsapp", e.target.value)} placeholder="+91 00000 00000" />
                </Field>
              </Row>
              <Field label="Email">
                <Input value={form.email ?? ""} onChange={e => set("email", e.target.value)} type="email" />
              </Field>
              <Field label="Google Maps Embed URL">
                <Input value={form.googleMapsEmbed ?? ""} onChange={e => set("googleMapsEmbed", e.target.value)} placeholder="https://maps.google.com/..." />
              </Field>
            </div>
          </>
        )}

        {/* ── HOMEPAGE ────────────────────────────────── */}
        {activeTab === "homepage" && (
          <>
            {/* Hero Section */}
            <SectionHead icon={Home} title="Hero Section" desc="The full-screen banner at the top of the homepage." />
            <div className="space-y-4">
              <Field label="Small Tag Label" hint="Tiny uppercase text above the headline (e.g. 'Luxury Homestay in Kasauli').">
                <Input
                  value={form.heroTagline ?? ""}
                  onChange={e => set("heroTagline", e.target.value)}
                  placeholder="Luxury Homestay in Kasauli"
                />
              </Field>
              <Field label="Main Headline" hint="The large H1 title. Use | to split into two lines.">
                <Input
                  value={form.heroTitle ?? ""}
                  onChange={e => set("heroTitle", e.target.value)}
                  placeholder="Experience Luxury | in the Hills of Kasauli"
                />
              </Field>
              <Field label="Subtitle / Description" hint="The paragraph of text beneath the headline.">
                <textarea
                  value={form.heroDescription ?? ""}
                  onChange={e => set("heroDescription", e.target.value)}
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="The Bialto By Asemont Estate is a classic 5-floor luxury homestay..."
                />
              </Field>
              <Field label="CTA Button Text" hint="The primary call-to-action button label.">
                <Input
                  value={form.heroCtaText ?? ""}
                  onChange={e => set("heroCtaText", e.target.value)}
                  placeholder="Explore the Estate"
                />
              </Field>
            </div>

            <div className="border-t border-border pt-6" />

            {/* About Section */}
            <SectionHead icon={Info} title="About Section" desc="The two-column section below the hero." />
            <div className="space-y-4">
              <Row>
                <Field label="Section Label" hint="Small label above the title.">
                  <Input
                    value={form.aboutLabel ?? ""}
                    onChange={e => set("aboutLabel", e.target.value)}
                    placeholder="About the Estate"
                  />
                </Field>
                <Field label="CTA Button Text">
                  <Input
                    value={form.aboutCtaText ?? ""}
                    onChange={e => set("aboutCtaText", e.target.value)}
                    placeholder="Know More About Us"
                  />
                </Field>
              </Row>
              <Field label="Section Title">
                <Input
                  value={form.aboutTitle ?? ""}
                  onChange={e => set("aboutTitle", e.target.value)}
                  placeholder="A Timeless Escape Surrounded by Nature"
                />
              </Field>
              <Field label="Description Paragraph">
                <textarea
                  value={form.aboutDescription ?? ""}
                  onChange={e => set("aboutDescription", e.target.value)}
                  className="w-full min-h-[90px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Nestled in the serene hills of Kasauli..."
                />
              </Field>
              <Field label="Section Image" hint="The photo shown on the right side of the About section.">
                <ImageUpload
                  value={form.aboutImage}
                  onChange={url => set("aboutImage", url)}
                  label="Upload About Image"
                  className="max-w-xs"
                />
              </Field>
            </div>

            <div className="border-t border-border pt-6" />

            {/* Floors Section */}
            <SectionHead icon={Layers} title="Floors Section" desc="The grid of estate floors shown below the About section." />
            <div className="space-y-4">
              <Row>
                <Field label="Section Label" hint="Small uppercase label above the title.">
                  <Input
                    value={form.floorsSectionLabel ?? ""}
                    onChange={e => set("floorsSectionLabel", e.target.value)}
                    placeholder="Our Estate"
                  />
                </Field>
                <Field label="Section Title">
                  <Input
                    value={form.floorsSectionTitle ?? ""}
                    onChange={e => set("floorsSectionTitle", e.target.value)}
                    placeholder="Five Floors of Luxury & Comfort"
                  />
                </Field>
              </Row>
            </div>

            <div className="border-t border-border pt-6" />

            {/* Footer */}
            <SectionHead icon={FootprintsIcon} title="Footer" desc="Content shown in the website footer." />
            <div className="space-y-4">
              <Field label="Footer Description" hint="Short paragraph shown beneath the logo in the footer.">
                <textarea
                  value={form.footerTagline ?? ""}
                  onChange={e => set("footerTagline", e.target.value)}
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="A luxury heritage homestay in Kasauli, Himachal Pradesh..."
                />
              </Field>
            </div>
          </>
        )}

        {/* ── BRAND & IMAGES ──────────────────────────── */}
        {activeTab === "brand" && (
          <>
            <SectionHead icon={ImageIcon} title="Logo" desc="The logo shown in the navigation bar and footer." />
            <ImageUpload value={form.logoUrl} onChange={url => set("logoUrl", url)} label="Upload Logo" className="max-w-xs" />

            <div className="border-t border-border pt-6" />

            <SectionHead icon={ImageIcon} title="Hero Slider Images" desc="Images that rotate as the homepage background. Recommended: at least 3, landscape orientation." />
            <MultiImageUpload
              value={form.heroImages ?? []}
              onChange={urls => set("heroImages", urls)}
              label="Add Hero Image"
              maxImages={6}
            />
          </>
        )}

        {/* ── THEME ───────────────────────────────────── */}
        {activeTab === "theme" && (
          <>
            <SectionHead icon={Palette} title="Theme & Appearance" />
            <div className="space-y-6">
              {/* Dark / Light mode toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  {form.darkMode !== false ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                  <div>
                    <div className="font-medium text-sm">{form.darkMode !== false ? "Dark Mode" : "Light Mode"}</div>
                    <div className="text-xs text-muted-foreground">Toggle site-wide dark / light theme</div>
                  </div>
                </div>
                <Switch checked={form.darkMode !== false} onCheckedChange={v => set("darkMode", v)} />
              </div>

              {/* Presets */}
              <Field label="Color Presets" hint="Click a preset to load the colors below.">
                <div className="flex flex-wrap gap-2 mt-1">
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
              </Field>

              {/* Pickers */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: "primaryColor",   label: "Primary",   hint: "Buttons, highlights",     def: "#c47c2b" },
                  { key: "secondaryColor", label: "Secondary", hint: "Card backgrounds",         def: "#1a2c52" },
                  { key: "accentColor",    label: "Accent",    hint: "Popover / deep bg",        def: "#162040" },
                ].map(({ key, label, hint, def }) => (
                  <div key={key} className="space-y-1.5">
                    <Label>{label}</Label>
                    <p className="text-xs text-muted-foreground">{hint}</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form[key] || def}
                        onChange={e => set(key, e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-border bg-transparent p-0.5"
                      />
                      <Input
                        value={form[key] || ""}
                        onChange={e => set(key, e.target.value)}
                        placeholder={def}
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview strip */}
              {(form.primaryColor || form.secondaryColor) && (
                <div className="space-y-1">
                  <Label>Preview</Label>
                  <div className="flex gap-2 items-center p-3 rounded-lg border border-border bg-muted/20">
                    <div className="w-8 h-8 rounded" style={{ background: form.primaryColor || "#c47c2b" }} title="Primary" />
                    <div className="w-8 h-8 rounded" style={{ background: form.secondaryColor || "#1a2c52" }} title="Secondary" />
                    <div className="w-8 h-8 rounded" style={{ background: form.accentColor || "#162040" }} title="Accent" />
                    <div className="ml-2 text-xs text-muted-foreground">Colors apply site-wide after saving</div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── SOCIAL & SEO ────────────────────────────── */}
        {activeTab === "social" && (
          <>
            <SectionHead icon={Share2} title="Social Media" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Facebook URL">
                <Input value={form.facebook ?? ""} onChange={e => set("facebook", e.target.value)} placeholder="https://facebook.com/..." />
              </Field>
              <Field label="Instagram URL">
                <Input value={form.instagram ?? ""} onChange={e => set("instagram", e.target.value)} placeholder="https://instagram.com/..." />
              </Field>
              <Field label="Twitter / X URL">
                <Input value={form.twitter ?? ""} onChange={e => set("twitter", e.target.value)} placeholder="https://x.com/..." />
              </Field>
            </div>

            <div className="border-t border-border pt-6" />

            <SectionHead icon={Globe} title="SEO" desc="These values appear in search engine results and link previews." />
            <div className="space-y-4">
              <Field label="Meta Title">
                <Input value={form.metaTitle ?? ""} onChange={e => set("metaTitle", e.target.value)} placeholder="The Bialto by Asemont Estate | Luxury Homestay in Kasauli" />
              </Field>
              <Field label="Meta Description">
                <textarea
                  value={form.metaDescription ?? ""}
                  onChange={e => set("metaDescription", e.target.value)}
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="A 5-floor luxury heritage homestay in the hills of Kasauli..."
                />
              </Field>
            </div>
          </>
        )}

      </div>

      <div className="flex justify-end pb-6">
        <Button onClick={handleSave} disabled={updateSettings.isPending} size="lg" className="bg-primary text-primary-foreground">
          {updateSettings.isPending
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
            : <><Save className="w-4 h-4 mr-2" />Save All Settings</>}
        </Button>
      </div>
    </div>
  );
}

function SectionHead({ icon: Icon, title, desc }: { icon: any; title: string; desc?: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-border pb-3">
      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <h3 className="font-medium text-sm">{title}</h3>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
    </div>
  );
}
