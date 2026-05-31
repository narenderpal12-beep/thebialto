import { useState, useEffect } from "react";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload, MultiImageUpload, storageUrl } from "@/components/ui/image-upload";
import { Loader2, Save, Globe, Phone, Image as ImageIcon, Share2 } from "lucide-react";
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

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-wide">Site Settings</h1>
          <p className="text-muted-foreground mt-1">Manage website content and contact information.</p>
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
            {form.logoUrl && (
              <div className="mt-2 p-3 bg-muted/30 rounded flex items-center gap-3">
                <div className="text-xs text-muted-foreground">Current logo URL:</div>
                <code className="text-xs break-all">/api/storage{form.logoUrl}</code>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Hero Slider Images</Label>
            <p className="text-xs text-muted-foreground">Upload images that will rotate in the homepage hero slider.</p>
            <MultiImageUpload value={form.heroImages ?? []} onChange={urls => set("heroImages", urls)} label="Add Hero Image" max={6} />
          </div>
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
