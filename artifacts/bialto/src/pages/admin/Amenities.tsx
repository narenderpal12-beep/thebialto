import { useState } from "react";
import {
  useGetAmenities, useCreateAmenity, useUpdateAmenity, useDeleteAmenity,
  getGetAmenitiesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AmenityForm { name: string; icon: string; description: string; sortOrder: number; }
const defaultForm: AmenityForm = { name: "", icon: "star", description: "", sortOrder: 0 };

const ICON_SUGGESTIONS = ["wifi", "utensils", "flame", "car", "zap", "shield", "bell", "mountain", "droplets", "tv", "sparkles", "coffee", "wind", "bath", "phone", "star", "heart"];

export default function AdminAmenities() {
  const { data: amenities = [], isLoading } = useGetAmenities();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createAmenity = useCreateAmenity();
  const updateAmenity = useUpdateAmenity();
  const deleteAmenity = useDeleteAmenity();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<AmenityForm>(defaultForm);
  const set = (f: keyof AmenityForm, v: any) => setForm(p => ({ ...p, [f]: v }));
  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetAmenitiesQueryKey() });

  const openCreate = () => { setEditId(null); setForm(defaultForm); setOpen(true); };
  const openEdit = (a: any) => {
    setEditId(a.id);
    setForm({ name: a.name, icon: a.icon, description: a.description, sortOrder: a.sortOrder ?? 0 });
    setOpen(true);
  };
  const handleSubmit = () => {
    const data = { ...form, sortOrder: Number(form.sortOrder) };
    if (editId) {
      updateAmenity.mutate({ id: editId, data }, { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Amenity updated" }); } });
    } else {
      createAmenity.mutate({ data }, { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Amenity created" }); } });
    }
  };
  const handleDelete = (id: number) => {
    if (!confirm("Delete this amenity?")) return;
    deleteAmenity.mutate({ id }, { onSuccess: () => { invalidate(); toast({ title: "Amenity deleted" }); } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-wide">Amenities</h1>
          <p className="text-muted-foreground mt-1">Manage estate amenities shown on the website.</p>
        </div>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Amenity
        </Button>
      </div>

      {isLoading ? <div className="text-muted-foreground">Loading...</div> : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Icon</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Description</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(amenities as any[]).map(a => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-medium">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{a.icon}</code></td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs max-w-xs truncate">{a.description}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {amenities.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">No amenities yet.</div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editId ? "Edit Amenity" : "Add Amenity"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name</Label>
              <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Free Wi-Fi" />
            </div>
            <div className="space-y-2">
              <Label>Icon <span className="text-muted-foreground text-xs">(Lucide icon name)</span></Label>
              <Input value={form.icon} onChange={e => set("icon", e.target.value)} placeholder="e.g. wifi" />
              <div className="flex flex-wrap gap-1 mt-1">
                {ICON_SUGGESTIONS.map(ic => (
                  <button key={ic} type="button" onClick={() => set("icon", ic)}
                    className={`text-xs px-2 py-0.5 rounded border transition-colors ${form.icon === ic ? "border-primary bg-primary/20 text-primary" : "border-border hover:border-primary/50"}`}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2"><Label>Description</Label>
              <Input value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief description..." />
            </div>
            <div className="space-y-2"><Label>Sort Order</Label>
              <Input type="number" value={form.sortOrder} onChange={e => set("sortOrder", Number(e.target.value))} min={0} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground" disabled={createAmenity.isPending || updateAmenity.isPending}>
              {editId ? "Save Changes" : "Add Amenity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
