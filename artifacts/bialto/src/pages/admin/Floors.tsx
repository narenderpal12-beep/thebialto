import { useState } from "react";
import {
  useGetFloors, useCreateFloor, useUpdateFloor, useDeleteFloor,
  getGetFloorsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload, storageUrl } from "@/components/ui/image-upload";
import { Plus, Pencil, Trash2, Layers, BedDouble } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FloorForm {
  name: string;
  floorNumber: number;
  description: string;
  imageUrl: string | null;
}
const defaultForm: FloorForm = { name: "", floorNumber: 1, description: "", imageUrl: null };

export default function AdminFloors() {
  const { data: floors = [], isLoading } = useGetFloors();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createFloor = useCreateFloor();
  const updateFloor = useUpdateFloor();
  const deleteFloor = useDeleteFloor();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FloorForm>(defaultForm);
  const set = (f: keyof FloorForm, v: any) => setForm(p => ({ ...p, [f]: v }));
  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetFloorsQueryKey() });

  const openCreate = () => { setEditId(null); setForm(defaultForm); setOpen(true); };
  const openEdit = (floor: any) => {
    setEditId(floor.id);
    setForm({ name: floor.name, floorNumber: floor.floorNumber, description: floor.description, imageUrl: floor.imageUrl ?? null });
    setOpen(true);
  };
  const handleSubmit = () => {
    const data = { ...form, floorNumber: Number(form.floorNumber) };
    if (editId) {
      updateFloor.mutate({ id: editId, data }, { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Floor updated" }); } });
    } else {
      createFloor.mutate({ data }, { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Floor created" }); } });
    }
  };
  const handleDelete = (id: number) => {
    if (!confirm("Delete this floor?")) return;
    deleteFloor.mutate({ id }, { onSuccess: () => { invalidate(); toast({ title: "Floor deleted" }); } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-wide">Floors</h1>
          <p className="text-muted-foreground mt-1">Manage the floors of The Bialto estate.</p>
        </div>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Floor
        </Button>
      </div>

      {isLoading ? <div className="text-muted-foreground">Loading...</div> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(floors as any[]).map(floor => (
            <div key={floor.id} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
              {floor.imageUrl ? (
                <img src={storageUrl(floor.imageUrl)} alt={floor.name} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-muted flex items-center justify-center">
                  <Layers className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
              <div className="p-4">
                <div className="text-xs text-primary font-medium mb-1">Floor {floor.floorNumber}</div>
                <h3 className="font-serif text-lg">{floor.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{floor.description}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <BedDouble className="w-3.5 h-3.5" />
                  <span>{floor.rooms?.length ?? 0} rooms</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(floor)}>
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(floor.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {floors.length === 0 && (
            <div className="col-span-3 p-12 text-center text-muted-foreground border border-dashed border-border rounded-lg">
              No floors yet.
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editId ? "Edit Floor" : "Add New Floor"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Floor Name</Label>
              <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Heritage Lounge" />
            </div>
            <div className="space-y-2">
              <Label>Floor Number</Label>
              <Input type="number" value={form.floorNumber} onChange={e => set("floorNumber", Number(e.target.value))} min={1} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Describe this floor..." />
            </div>
            <div className="space-y-2">
              <Label>Floor Image</Label>
              <ImageUpload value={form.imageUrl} onChange={url => set("imageUrl", url)} label="Upload Floor Image" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground" disabled={createFloor.isPending || updateFloor.isPending}>
              {editId ? "Save Changes" : "Create Floor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
