import { useState } from "react";
import {
  useGetRooms, useGetFloors, useCreateRoom, useUpdateRoom, useDeleteRoom,
  getGetRoomsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ImageUpload, MultiImageUpload, storageUrl } from "@/components/ui/image-upload";
import { Plus, Pencil, Trash2, BedDouble, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ROOM_TYPES = ["Classic", "Premium", "Deluxe", "Family Suite", "Sky Suite"];

interface RoomForm {
  name: string;
  floorId: number;
  roomType: string;
  featureImageUrl: string | null;
  galleryImages: string[];
  pricePerNight: number;
  adultCapacity: number;
  childCapacity: number;
  amenities: string;
  description: string;
  isAvailable: boolean;
  isPublished: boolean;
  isFeatured: boolean;
}

const defaultForm: RoomForm = {
  name: "", floorId: 0, roomType: "Deluxe", featureImageUrl: null,
  galleryImages: [], pricePerNight: 5000, adultCapacity: 2, childCapacity: 0,
  amenities: "", description: "", isAvailable: true, isPublished: true, isFeatured: false,
};

export default function AdminRooms() {
  const { data: rooms = [], isLoading } = useGetRooms();
  const { data: floors = [] } = useGetFloors();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<RoomForm>(defaultForm);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetRoomsQueryKey() });

  const openCreate = () => { setEditId(null); setForm(defaultForm); setOpen(true); };
  const openEdit = (room: any) => {
    setEditId(room.id);
    setForm({
      name: room.name, floorId: room.floorId, roomType: room.roomType,
      featureImageUrl: room.featureImageUrl ?? null,
      galleryImages: room.galleryImages ?? [],
      pricePerNight: room.pricePerNight,
      adultCapacity: room.adultCapacity ?? 2,
      childCapacity: room.childCapacity ?? 0,
      amenities: (room.amenities ?? []).join(", "),
      description: room.description,
      isAvailable: room.isAvailable, isPublished: room.isPublished, isFeatured: room.isFeatured,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      amenities: form.amenities ? form.amenities.split(",").map(a => a.trim()).filter(Boolean) : [],
      floorId: Number(form.floorId),
    };
    if (editId) {
      updateRoom.mutate({ id: editId, data }, { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Room updated" }); } });
    } else {
      createRoom.mutate({ data }, { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Room created" }); } });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this room?")) return;
    deleteRoom.mutate({ id }, { onSuccess: () => { invalidate(); toast({ title: "Room deleted" }); } });
  };

  const set = (field: keyof RoomForm, value: any) => setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-wide">Rooms</h1>
          <p className="text-muted-foreground mt-1">Manage all estate rooms and their details.</p>
        </div>
        <Button onClick={openCreate} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Room
        </Button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading rooms...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Room</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Floor</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Capacity</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(rooms as any[]).map((room: any) => (
                <tr key={room.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {room.featureImageUrl ? (
                        <img src={storageUrl(room.featureImageUrl)} alt={room.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <BedDouble className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <span className="font-medium">{room.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{room.floorName || `Floor ${room.floorId}`}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{room.roomType}</Badge></td>
                  <td className="px-4 py-3">₹{room.pricePerNight.toLocaleString("en-IN")}/night</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{room.adultCapacity ?? 2} adults</span>
                      {(room.childCapacity ?? 0) > 0 && <span className="text-muted-foreground">+ {room.childCapacity} children</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {room.isPublished && <Badge className="bg-green-900/50 text-green-300 border-green-800">Published</Badge>}
                      {!room.isPublished && <Badge variant="secondary">Draft</Badge>}
                      {room.isFeatured && <Badge className="bg-primary/20 text-primary border-primary/30">Featured</Badge>}
                      {!room.isAvailable && <Badge variant="destructive">Unavailable</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(room)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(room.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(rooms as any[]).length === 0 && (
            <div className="p-12 text-center text-muted-foreground">No rooms yet. Click "Add Room" to create the first one.</div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editId ? "Edit Room" : "Add New Room"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Room Name</Label>
              <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Mountain Retreat" />
            </div>
            <div className="space-y-2">
              <Label>Floor</Label>
              <Select value={String(form.floorId)} onValueChange={v => set("floorId", Number(v))}>
                <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
                <SelectContent>
                  {(floors as any[]).map((f: any) => (
                    <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Room Type</Label>
              <Select value={form.roomType} onValueChange={v => set("roomType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price Per Night (₹)</Label>
              <Input type="number" value={form.pricePerNight} onChange={e => set("pricePerNight", Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Adult Capacity</Label>
              <Input type="number" min={1} value={form.adultCapacity} onChange={e => set("adultCapacity", Number(e.target.value))} placeholder="2" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Child Capacity <span className="text-muted-foreground text-xs font-normal">(under 12, set to 0 if children not allowed)</span></Label>
              <Input type="number" min={0} value={form.childCapacity} onChange={e => set("childCapacity", Number(e.target.value))} placeholder="0" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <textarea
                value={form.description}
                onChange={e => set("description", e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Room description..."
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Amenities <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
              <Input value={form.amenities} onChange={e => set("amenities", e.target.value)} placeholder="Free Wi-Fi, Balcony Views, Smart TV..." />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Feature Image</Label>
              <ImageUpload value={form.featureImageUrl} onChange={url => set("featureImageUrl", url)} label="Upload Feature Image" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Gallery Images</Label>
              <MultiImageUpload value={form.galleryImages} onChange={urls => set("galleryImages", urls)} label="Add Gallery Image" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isAvailable} onCheckedChange={v => set("isAvailable", v)} id="available" />
              <Label htmlFor="available">Available</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isPublished} onCheckedChange={v => set("isPublished", v)} id="published" />
              <Label htmlFor="published">Published</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isFeatured} onCheckedChange={v => set("isFeatured", v)} id="featured" />
              <Label htmlFor="featured">Featured on Homepage</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground" disabled={createRoom.isPending || updateRoom.isPending}>
              {editId ? "Save Changes" : "Create Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
