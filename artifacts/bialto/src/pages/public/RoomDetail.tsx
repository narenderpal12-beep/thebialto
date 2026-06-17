import { useRoute, Link } from "wouter";
import { useGetRoom } from "@workspace/api-client-react";
import { storageUrl } from "@/components/ui/image-upload";
import { useState, useEffect, useCallback } from "react";
import {
  Users, IndianRupee, CheckCircle2, BedDouble,
  ChevronLeft, ChevronRight, X, Images, Maximize2,
  UtensilsCrossed, Bath, Wifi,
} from "lucide-react";

/** Resolves an image path to a displayable URL, skipping static public assets. */
function imgSrc(path: string): string {
  if (path.startsWith("/images/") || path.startsWith("/api/")) return path;
  return storageUrl(path);
}

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);

  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIdx((i) => Math.min(images.length - 1, i + 1)), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/98 flex flex-col" onClick={onClose}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <span className="text-white/60 text-sm font-medium">{idx + 1} / {images.length}</span>
        <button
          className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded transition-colors"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main image */}
      <div className="flex-1 flex items-center justify-center relative min-h-0 px-16" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 hover:bg-white/10 rounded-full transition-colors disabled:opacity-20"
          onClick={prev}
          disabled={idx === 0}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <img
          src={imgSrc(images[idx])}
          alt={`Photo ${idx + 1}`}
          className="max-h-full max-w-full object-contain"
          style={{ maxHeight: "calc(100vh - 220px)" }}
        />

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 hover:bg-white/10 rounded-full transition-colors disabled:opacity-20"
          onClick={next}
          disabled={idx === images.length - 1}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex-shrink-0 px-6 py-4 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2 justify-center flex-wrap md:flex-nowrap">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`flex-shrink-0 w-16 h-12 overflow-hidden border-2 transition-all ${
                i === idx ? "border-primary scale-105" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img src={imgSrc(src)} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RoomDetail() {
  const [, params] = useRoute("/rooms/:id");
  const id = Number(params?.id);
  const { data: room, isLoading } = useGetRoom(id, { query: { enabled: !!id } });
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (isLoading) return (
    <div className="pt-[70px] min-h-screen bg-[#f5f0e8] flex items-center justify-center">
      <div className="text-[#4a5568]">Loading room details...</div>
    </div>
  );

  if (!room) return (
    <div className="pt-[70px] min-h-screen bg-[#f5f0e8] flex items-center justify-center">
      <div className="text-[#4a5568]">Room not found.</div>
    </div>
  );

  const gallery: string[] = (room as any).galleryImages ?? [];
  const featureUrl: string | undefined = (room as any).featureImageUrl;
  const fallback = "/images/about-interior.png";

  const allImages: string[] = [
    ...(featureUrl ? [featureUrl] : []),
    ...gallery,
  ];
  if (allImages.length === 0) allImages.push(fallback);

  const amenities: string[] = (room as any).amenities ?? [];

  return (
    <div className="flex flex-col pt-[70px]">
      {/* ── Breadcrumb ── */}
      <div className="bg-[#0b1220] px-6 md:px-12 py-3 max-w-7xl w-full mx-auto">
        <div className="text-white/40 text-xs tracking-widest uppercase flex items-center gap-1.5">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/floors" className="hover:text-primary transition-colors">Floors & Rooms</Link>
          <span>/</span>
          <span className="text-white/70">{room.name}</span>
        </div>
      </div>

      {/* ── Photo mosaic ── */}
      <div className="bg-[#060d1a]">
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-4">
          {allImages.length === 1 ? (
            /* Single image — full width */
            <div
              className="relative w-full h-[55vh] overflow-hidden cursor-pointer group"
              onClick={() => setLightboxIdx(0)}
            >
              <img src={imgSrc(allImages[0])} alt={room.name} className="w-full h-full object-cover group-hover:brightness-90 transition" />
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold tracking-wider px-3 py-1.5 flex items-center gap-1.5 border border-white/20">
                <Images className="w-3.5 h-3.5" /> View Photo
              </div>
            </div>
          ) : allImages.length <= 3 ? (
            /* 2–3 images */
            <div className="grid grid-cols-2 gap-1.5 h-[55vh]">
              <div className="relative overflow-hidden cursor-pointer group" onClick={() => setLightboxIdx(0)}>
                <img src={imgSrc(allImages[0])} alt="Main" className="w-full h-full object-cover group-hover:brightness-90 transition" />
              </div>
              <div className={`grid ${allImages.length === 3 ? "grid-rows-2" : ""} gap-1.5`}>
                {allImages.slice(1, 3).map((src, i) => (
                  <div key={i} className="relative overflow-hidden cursor-pointer group" onClick={() => setLightboxIdx(i + 1)}>
                    <img src={imgSrc(src)} alt={`Photo ${i + 2}`} className="w-full h-full object-cover group-hover:brightness-90 transition" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 4+ images — hotel mosaic: 1 large + 2x2 grid */
            <div className="grid grid-cols-2 gap-1.5 h-[55vh]">
              {/* Large main image */}
              <div
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => setLightboxIdx(0)}
              >
                <img
                  src={imgSrc(allImages[0])}
                  alt="Main"
                  className="w-full h-full object-cover group-hover:brightness-90 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 group-hover:to-black/30 transition-all" />
                <div className="absolute top-3 left-3 bg-[#060d1a]/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-primary uppercase border border-primary/30">
                  {(room as any).roomType}
                </div>
              </div>

              {/* 2×2 thumbnail grid */}
              <div className="grid grid-cols-2 grid-rows-2 gap-1.5">
                {allImages.slice(1, 5).map((src, i) => {
                  const isLast = i === 3 && allImages.length > 5;
                  return (
                    <div
                      key={i}
                      className="relative overflow-hidden cursor-pointer group"
                      onClick={() => setLightboxIdx(i + 1)}
                    >
                      <img
                        src={imgSrc(src)}
                        alt={`Photo ${i + 2}`}
                        className="w-full h-full object-cover group-hover:brightness-90 transition duration-300"
                      />
                      {isLast && (
                        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                          <div className="text-white text-center">
                            <Images className="w-6 h-6 mx-auto mb-1 opacity-80" />
                            <span className="text-sm font-semibold">+{allImages.length - 5} more</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* "Show all photos" button */}
              <button
                onClick={() => setLightboxIdx(0)}
                className="absolute bottom-6 right-6 bg-white text-[#1a2332] text-xs font-semibold tracking-[0.1em] uppercase px-4 py-2.5 flex items-center gap-2 shadow-lg hover:bg-primary hover:text-[#060d1a] transition-colors border border-gray-200"
                style={{ position: "absolute" }}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Show all {allImages.length} photos
              </button>
            </div>
          )}
        </div>

        {/* "Show all photos" button for 4+ images — positioned outside the relative grid */}
        {allImages.length >= 4 && (
          <div className="max-w-7xl mx-auto px-4 md:px-12 pb-3 flex justify-end">
            <button
              onClick={() => setLightboxIdx(0)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-[0.1em] uppercase px-4 py-2 flex items-center gap-2 border border-white/20 transition-colors"
            >
              <Images className="w-3.5 h-3.5 text-primary" />
              View all {allImages.length} photos
            </button>
          </div>
        )}
      </div>

      {/* ── Room header ── */}
      <div className="bg-[#0b1220] py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-1">{(room as any).roomType}</div>
            <h1 className="text-3xl md:text-4xl font-serif text-white">{room.name}</h1>
            <div className="flex items-center gap-4 mt-3 text-white/50 text-sm">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                Up to {(room as any).adultCapacity ?? (room as any).capacity ?? 2} guests
              </span>
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-primary" />
                Attached Bathroom
              </span>
              {(room as any).hasKitchen && (
                <span className="flex items-center gap-1.5">
                  <UtensilsCrossed className="w-4 h-4 text-primary" />
                  Kitchen Access
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="text-white/40 text-xs tracking-wide mb-0.5 text-right">Starting from</div>
            <div className="flex items-baseline gap-1 justify-end">
              <IndianRupee className="w-5 h-5 text-primary" />
              <span className="text-4xl font-serif text-white">{(room as any).pricePerNight.toLocaleString("en-IN")}</span>
              <span className="text-white/40 text-sm">/night</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <section className="bg-[#f5f0e8] py-14">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-10">

          {/* Left — description + amenities + photo strip */}
          <div className="md:col-span-2 space-y-10">

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px w-8 bg-primary/40" />
                <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">About This Room</span>
              </div>
              <p className="text-[#4a5568] text-base leading-relaxed">{room.description}</p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <span className="h-px w-8 bg-primary/40" />
                  <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Amenities</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 bg-white px-4 py-3 border border-gray-100 text-sm text-[#4a5568]">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo gallery grid */}
            {allImages.length > 1 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-8 bg-primary/40" />
                    <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Photo Gallery</span>
                  </div>
                  <span className="text-xs text-[#9ca3af]">{allImages.length} photos</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allImages.map((src, i) => (
                    <button
                      key={i}
                      className="relative aspect-video overflow-hidden group"
                      onClick={() => setLightboxIdx(i)}
                    >
                      <img
                        src={imgSrc(src)}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                        <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      {i === 0 && (
                        <div className="absolute bottom-1.5 left-1.5 bg-primary/90 text-[#060d1a] text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5">
                          MAIN
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — booking card */}
          <div>
            <div className="bg-white shadow-lg border border-gray-100 p-6 sticky top-24">
              {/* Availability */}
              <div className={`text-center text-xs font-semibold tracking-widest uppercase py-1.5 mb-5 ${
                (room as any).isAvailable
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}>
                {(room as any).isAvailable ? "✓ Available to Book" : "Currently Unavailable"}
              </div>

              {/* Price */}
              <div className="text-center mb-6 pb-6 border-b border-gray-100">
                <div className="text-[#9ca3af] text-xs tracking-wide mb-1">Price per night</div>
                <div className="flex items-baseline justify-center gap-1 text-primary">
                  <IndianRupee className="w-5 h-5" />
                  <span className="text-4xl font-serif font-medium text-[#1a2332]">
                    {(room as any).pricePerNight.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Quick info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-[#4a5568] text-sm">
                  <Users className="w-4 h-4 text-primary flex-shrink-0" />
                  Up to {(room as any).adultCapacity ?? (room as any).capacity ?? 2} guests
                </div>
                <div className="flex items-center gap-2.5 text-[#4a5568] text-sm">
                  <BedDouble className="w-4 h-4 text-primary flex-shrink-0" />
                  {(room as any).roomType}
                </div>
                <div className="flex items-center gap-2.5 text-[#4a5568] text-sm">
                  <Bath className="w-4 h-4 text-primary flex-shrink-0" />
                  Attached Bathroom
                </div>
                {amenities.slice(0, 2).map((a) => (
                  <div key={a} className="flex items-center gap-2.5 text-[#4a5568] text-sm">
                    <Wifi className="w-4 h-4 text-primary flex-shrink-0" />
                    {a}
                  </div>
                ))}
              </div>

              <Link
                href={`/book?roomId=${room.id}`}
                className="block w-full text-center bg-primary text-[#060d1a] text-xs font-bold tracking-[0.15em] uppercase py-4 hover:bg-primary/90 transition-colors mb-3"
              >
                Book This Room
              </Link>
              <Link
                href="/contact"
                className="block w-full text-center border border-[#1a2332] text-[#1a2332] text-xs font-semibold tracking-[0.12em] uppercase py-3.5 hover:bg-[#1a2332] hover:text-white transition-colors"
              >
                Send Enquiry
              </Link>

              {/* Photo count teaser */}
              {allImages.length > 1 && (
                <button
                  onClick={() => setLightboxIdx(0)}
                  className="mt-4 w-full flex items-center justify-center gap-2 text-[#4a5568] text-xs hover:text-primary transition-colors py-2 border-t border-gray-100"
                >
                  <Images className="w-3.5 h-3.5" />
                  View all {allImages.length} photos
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <Lightbox
          images={allImages}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  );
}
