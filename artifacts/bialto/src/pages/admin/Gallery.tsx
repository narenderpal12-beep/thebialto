import { useState, useRef } from "react";
import {
  useGetGallery, useCreateGalleryImage, useDeleteGalleryImage,
  getGetGalleryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useUpload } from "@workspace/object-storage-web";
import {  imageUrl } from "@/components/ui/image-upload";
import { Plus, Trash2, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { value: "estate-exterior", label: "Estate Exterior" },
  { value: "interior", label: "Interior" },
  { value: "rooms", label: "Rooms" },
  { value: "dining", label: "Dining" },
  { value: "snow-views", label: "Snow Views" },
  { value: "attractions", label: "Attractions" },
];

export default function AdminGallery() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { data: images = [], isLoading } = useGetGallery(categoryFilter !== "all" ? { category: categoryFilter } : {});
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createImage = useCreateGalleryImage();
  const deleteImage = useDeleteGalleryImage();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetGalleryQueryKey() });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: "estate-exterior", sortOrder: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, progress } = useUpload({
    onError: (e) => toast({ title: "Upload failed", description: e.message, variant: "destructive" }),
  });

  const handleUpload = async (file: File) => {
    const res = await uploadFile(file);
    if (!res) return;
    createImage.mutate(
      { data: { imageUrl: res.objectPath, title: form.title || file.name, category: form.category, sortOrder: form.sortOrder } },
      { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Image added to gallery" }); } }
    );
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Remove this image from the gallery?")) return;
    deleteImage.mutate({ id }, { onSuccess: () => { invalidate(); toast({ title: "Image removed" }); } });
  };

  const categoryCounts = CATEGORIES.map(c => ({
    ...c,
    count: (images as any[]).filter(i => i.category === c.value).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-wide">Gallery</h1>
          <p className="text-muted-foreground mt-1">Manage estate photography and images.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Image
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant={categoryFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter("all")}>
          All ({images.length})
        </Button>
        {CATEGORIES.map(c => (
          <Button key={c.value} variant={categoryFilter === c.value ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter(c.value)}>
            {c.label}
          </Button>
        ))}
      </div>

      {isLoading ? <div className="text-muted-foreground">Loading...</div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {(images as any[]).map(img => (
            <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
              <img src={ imageUrl(img.imageUrl)} alt={img.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <p className="text-white text-xs text-center line-clamp-2">{img.title}</p>
                <Badge variant="secondary" className="text-xs">{CATEGORIES.find(c => c.value === img.category)?.label ?? img.category}</Badge>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(img.id)}>
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-4 p-12 text-center text-muted-foreground border border-dashed border-border rounded-lg">
              No images in this category.
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Add Gallery Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Image title..." />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} min={0} />
            </div>
            <div
              className="w-full aspect-video rounded-md border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              {isUploading ? (
                <><Loader2 className="w-8 h-8 text-muted-foreground animate-spin" /><p className="text-sm text-muted-foreground">Uploading {progress}%...</p></>
              ) : (
                <><ImageIcon className="w-8 h-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">Click to select image</p></>
              )}
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => inputRef.current?.click()} disabled={isUploading || createImage.isPending} className="bg-primary text-primary-foreground">
              <Upload className="w-4 h-4 mr-2" /> Upload & Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
