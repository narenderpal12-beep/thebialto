import { useState } from "react";
import {
  useGetAttractions, useCreateAttraction, useUpdateAttraction, useDeleteAttraction,
  getGetAttractionsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload, storageUrl } from "@/components/ui/image-upload";
import { Plus, Pencil, Trash2, MapPin, Clock, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttractionForm {
  name: string; description: string; distance: string; travelTime: string;
  imageUrl: string | null; sortOrder: number;
}
const defaultForm: AttractionForm = { name: "", description: "", distance: "", travelTime: "", imageUrl: null, sortOrder: 0 };

export default function AdminAttractions() {
  const { data: attractions = [], isLoading } = useGetAttractions();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createAttraction = useCreateAttraction();
  const updateAttraction = useUpdateAttraction();
  const deleteAttraction = useDeleteAttraction();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<AttractionForm>(defaultForm);
  const set = (f: keyof AttractionForm, v: any) => setForm(p => ({ ...p, [f]: v }));
  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetAttractionsQueryKey() });

  const openCreate = () => { setEditId(null); setForm(defaultForm); setOpen(true); };
  const openEdit = (a: any) => {
    setEditId(a.id);
    setForm({ name: a.name, description: a.description, distance: a.distance, travelTime: a.travelTime, imageUrl: a.imageUrl ?? null, sortOrder: a.sortOrder ?? 0 });
    setOpen(true);
  };
  const handleSubmit = () => {
    const data = { ...form, sortOrder: Number(form.sortOrder) };
    if (editId) {
      updateAttraction.mutate({ id: editId, data }, { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Attraction updated" }); } });
    } else {
      createAttraction.mutate({ data }, { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Attraction created" }); } });
    }
  };
  const handleDelete = (id: number) => {
    if (!confirm("Delete this attraction?")) return;
    deleteAttraction.mutate({ id }, { onSuccess: () => { invalidate(); toast({ title: "Attraction deleted" }); } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-wide">Nearby Attractions</h1>
          <p className="text-muted-foreground mt-1">Manage local highlights and places of interest.</p>
        </div>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Attraction
        </Button>
      </div>

      {isLoading ? <div className="text-muted-foreground">Loading...</div> : (
        <div className="space-y-3">
          {(attractions as any[]).map(a => (
            <div key={a.id} className="bg-card border border-border rounded-lg p-4 flex gap-4 hover:border-primary/30 transition-colors">
              {a.imageUrl ? (
                <img src={storageUrl(a.imageUrl)} alt={a.name} className="w-20 h-20 rounded object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded bg-muted flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-8 h-8 text-muted-foreground/30" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg">{a.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{a.description}</p>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Navigation className="w-3 h-3" />{a.distance}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.travelTime}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
          {attractions.length === 0 && (
            <div className="p-12 text-center text-muted-foreground border border-dashed border-border rounded-lg">No attractions yet.</div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editId ? "Edit Attraction" : "Add Attraction"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name</Label>
              <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Monkey Point" />
            </div>
            <div className="space-y-2"><Label>Description</Label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Describe this attraction..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Distance</Label>
                <Input value={form.distance} onChange={e => set("distance", e.target.value)} placeholder="e.g. 5 km" />
              </div>
              <div className="space-y-2"><Label>Travel Time</Label>
                <Input value={form.travelTime} onChange={e => set("travelTime", e.target.value)} placeholder="e.g. 10 mins drive" />
              </div>
            </div>
            <div className="space-y-2"><Label>Sort Order</Label>
              <Input type="number" value={form.sortOrder} onChange={e => set("sortOrder", Number(e.target.value))} min={0} />
            </div>
            <div className="space-y-2"><Label>Image</Label>
              <ImageUpload value={form.imageUrl} onChange={url => set("imageUrl", url)} label="Upload Attraction Image" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground" disabled={createAttraction.isPending || updateAttraction.isPending}>
              {editId ? "Save Changes" : "Add Attraction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
