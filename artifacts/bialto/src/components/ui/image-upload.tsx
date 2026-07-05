import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

/**
 * Resolves a stored image value to a displayable URL.
 * - New uploads: stored as "/api/images/123" → returned as-is
 * - Legacy Object Storage paths: "/some/path.jpg" → "/api/storage/some/path.jpg"
 */
export function imageUrl(value: string): string {
  if (value.startsWith("/api/images/")) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `/api/storage${value.startsWith("/") ? "" : "/"}${value}`;
}

/** @deprecated Use imageUrl() instead. Kept for backward compatibility. */
// export function  imageUrl(objectPath: string): string {
//   return imageUrl(objectPath);
// }

async function uploadImageToDb(file: File): Promise<string> {
  const token = localStorage.getItem("bialto_admin_token");
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/images", { method: "POST", 
     headers: token ? { Authorization: `Bearer ${token}` } : {},
     body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? "Upload failed");
  }
  const json = await res.json();
  return json.url as string; // e.g. "/api/images/42"
}

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label = "Upload Image", className = "" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setProgress(0);
    try {
      // Simulate progress since fetch doesn't give upload progress
      const ticker = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 200);
      const url = await uploadImageToDb(file);
      clearInterval(ticker);
      setProgress(100);
      onChange(url);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const displayUrl = value ? imageUrl(value) : null;

  return (
    <div className={`space-y-2 ${className}`}>
      {displayUrl ? (
        <div className="relative group w-full aspect-video rounded-md overflow-hidden border border-border bg-muted">
          <img src={displayUrl} alt="Uploaded" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-background/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className="w-full aspect-video rounded-md border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <ImageIcon className="w-10 h-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click to upload image</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="w-full"
      >
        {isUploading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading {progress}%</>
        ) : (
          <><Upload className="w-4 h-4 mr-2" /> {label}</>
        )}
      </Button>
    </div>
  );
}

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
}

export function MultiImageUpload({ value, onChange, label = "Add Image", maxImages = 10 }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImageToDb(file);
      onChange([...value, url]);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {value.map((v, i) => (
          <div key={i} className="relative group aspect-square rounded-md overflow-hidden border border-border bg-muted">
            <img src={imageUrl(v)} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 bg-background/90 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {value.length < maxImages && (
          <div
            className="aspect-square rounded-md border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex items-center justify-center cursor-pointer transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            {isUploading
              ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              : <Upload className="w-6 h-6 text-muted-foreground" />}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {value.length < maxImages && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</>
            : <><Upload className="w-4 h-4 mr-2" />{label}</>}
        </Button>
      )}
    </div>
  );
}
