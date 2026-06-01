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
import { Switch } from "@/components/ui/switch";
import { ImageUpload, MultiImageUpload, storageUrl } from "@/components/ui/image-upload";
import { Plus, Pencil, Trash2, Layers, BedDouble, CheckCircle2, XCircle, UtensilsCrossed, Images } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FloorForm {
  name: string;
  floorNumber: number;
  description: string;
  imageUrl: string | null;
  galleryImages: string[];
  isAvailable: boolean;
  hasKitchen: boolean;
}

const defaultForm: FloorForm = {
  name: "",
  floorNumber: 1,
  description: "",
  imageUrl: null,
  galleryImages: [],
  isAvailable: true,
  hasKitchen: true,
};

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
    setForm({
      name: floor.name,
      floorNumber: floor.floorNumber,
      description: floor.description,
      imageUrl: floor.imageUrl ?? null,
      galleryImages: floor.galleryImages ?? [],
      isAvailable: floor.isAvailable ?? true,
      hasKitchen: floor.hasKitchen ?? true,
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    const data = { ...form, floorNumber: Number(form.floorNumber) };
    if (editId) {
      updateFloor.mutate({ id: editId, data }, {
        onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Floor updated" }); }
      });
    } else {
      createFloor.mutate({ data }, {
        onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Floor created" }); }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this floor? All rooms on this floor will also be deleted.")) return;
    deleteFloor.mutate({ id }, { onSuccess: () => { invalidate(); toast({ title: "Floor deleted" }); } });
  };

  const toggleAvailability = (floor: any) => {
    updateFloor.mutate(
      { id: floor.id, data: { isAvailable: !floor.isAvailable } },
      { onSuccess: () => { invalidate(); toast({ title: floor.isAvailable ? "Floor marked unavailable" : "Floor marked available" }); } }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-wide">Floors</h1>
          <p className="text-muted-foreground mt-1">Manage floors, availability, photos and rooms.</p>
        </div>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Floor
        </Button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(floors as any[]).map(floor => (
            <div key={floor.id} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-colors flex flex-col">
              {/* Feature image */}
              <div className="relative h-44 overflow-hidden">
                {floor.imageUrl ? (
                  <img src={storageUrl(floor.imageUrl)} alt={floor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Layers className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                {/* Availability badge */}
                <div className={`absolute top-2 left-2 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${floor.isAvailable ? "bg-green-900/80 text-green-300" : "bg-red-900/80 text-red-300"}`}>
                  {floor.isAvailable ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {floor.isAvailable ? "Available" : "Unavailable"}
                </div>
                {/* Gallery count badge */}
                {(floor.galleryImages?.length ?? 0) > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-xs bg-black/60 text-white px-2 py-1 rounded">
                    <Images className="w-3 h-3" /> {floor.galleryImages.length}
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="text-xs text-primary font-medium mb-0.5">Floor {floor.floorNumber}</div>
                <h3 className="font-serif text-lg">{floor.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">{floor.description}</p>

                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5" /> {floor.rooms?.length ?? 0} room{(floor.rooms?.length ?? 0) !== 1 ? "s" : ""}
                  </span>
                  {floor.hasKitchen && (
                    <span className="flex items-center gap-1 text-primary/70">
                      <UtensilsCrossed className="w-3.5 h-3.5" /> Kitchen
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`text-xs ${floor.isAvailable ? "border-green-600/40 text-green-400 hover:bg-green-900/20" : "border-red-600/40 text-red-400 hover:bg-red-900/20"}`}
                    onClick={() => toggleAvailability(floor)}
                    disabled={updateFloor.isPending}
                  >
                    {floor.isAvailable ? "Mark Unavailable" : "Mark Available"}
                  </Button>
                  <div className="flex-1" />
                  <Button variant="outline" size="sm" onClick={() => openEdit(floor)}>
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
              No floors yet. Click "Add Floor" to get started.
            </div>
          )}
        </div>
      )}

      {/* Edit / Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editId ? "Edit Floor" : "Add New Floor"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Name & Number */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label>Floor Name</Label>
                <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Heritage Lounge" />
              </div>
              <div className="space-y-2">
                <Label>Floor No.</Label>
                <Input type="number" value={form.floorNumber} onChange={e => set("floorNumber", Number(e.target.value))} min={1} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                value={form.description}
                onChange={e => set("description", e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Describe this floor — its character, views, facilities..."
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-md border border-border bg-background/50">
                <div>
                  <div className="text-sm font-medium">Availability</div>
                  <div className="text-xs text-muted-foreground">Show as bookable</div>
                </div>
                <Switch checked={form.isAvailable} onCheckedChange={v => set("isAvailable", v)} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border border-border bg-background/50">
                <div>
                  <div className="text-sm font-medium">Kitchen</div>
                  <div className="text-xs text-muted-foreground">Kitchen on this floor</div>
                </div>
                <Switch checked={form.hasKitchen} onCheckedChange={v => set("hasKitchen", v)} />
              </div>
            </div>

            {/* Feature image */}
            <div className="space-y-2">
              <Label>Feature Photo</Label>
              <p className="text-xs text-muted-foreground">Main photo shown on floors listing page</p>
              <ImageUpload value={form.imageUrl} onChange={url => set("imageUrl", url)} label="Upload Feature Photo" />
            </div>

            {/* Gallery images */}
            <div className="space-y-2">
              <Label>Gallery Photos</Label>
              <p className="text-xs text-muted-foreground">Additional photos for the floor detail page (up to 8)</p>
              <MultiImageUpload
                value={form.galleryImages}
                onChange={urls => set("galleryImages", urls)}
                label="Add Gallery Photo"
                maxImages={8}
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground"
              disabled={createFloor.isPending || updateFloor.isPending}
            >
              {editId ? "Save Changes" : "Create Floor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
