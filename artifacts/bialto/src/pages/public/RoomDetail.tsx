import { useRoute, Link } from "wouter";
import { useGetRoom } from "@workspace/api-client-react";
import { storageUrl } from "@/components/ui/image-upload";
import { useState } from "react";
import { Users, IndianRupee, CheckCircle2, ArrowRight, BedDouble, ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const allImages = [
    ...((room as any).featureImageUrl ? [(room as any).featureImageUrl] : []),
    ...gallery,
  ];

  const amenities: string[] = (room as any).amenities ?? [];

  return (
    <div className="flex flex-col pt-[70px]">
      {/* Hero */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {(room as any).featureImageUrl ? (
          <img src={storageUrl((room as any).featureImageUrl)} alt={room.name} className="w-full h-full object-cover" />
        ) : (
          <img src="/images/about-interior.png" alt={room.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060d1a]/80 via-[#060d1a]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 pb-8">
          <div className="text-white/50 text-xs tracking-widest mb-2 uppercase">
            <Link href="/" className="hover:text-primary">Home</Link> /{" "}
            <Link href="/floors" className="hover:text-primary">Rooms</Link> / {room.name}
          </div>
          <div className="text-primary text-xs font-semibold tracking-widest mb-1 uppercase">{(room as any).roomType}</div>
          <h1 className="text-4xl md:text-5xl font-serif text-white">{room.name}</h1>
        </div>
      </div>

      {/* Main content */}
      <section className="bg-[#f5f0e8] py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-10">
          {/* Left — description + gallery */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-serif text-[#1a2332] mb-4">About This Room</h2>
              <p className="text-[#4a5568] leading-relaxed">{room.description}</p>
            </div>

            {amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-serif text-[#1a2332] mb-4">Room Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-[#4a5568] text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {gallery.length > 0 && (
              <div>
                <h3 className="text-lg font-serif text-[#1a2332] mb-4">Gallery</h3>
                <div className="grid grid-cols-3 gap-2">
                  {gallery.map((path, i) => (
                    <button key={i} className="aspect-square overflow-hidden" onClick={() => setLightboxIdx(i + 1)}>
                      <img src={storageUrl(path)} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — booking card */}
          <div>
            <div className="bg-white shadow-lg p-6 sticky top-24">
              <div className="text-center mb-5 pb-5 border-b border-gray-100">
                <div className="text-[#4a5568] text-xs tracking-wide mb-1">Starting from</div>
                <div className="flex items-center justify-center gap-1 text-primary">
                  <IndianRupee className="w-5 h-5" />
                  <span className="text-3xl font-serif font-medium">{(room as any).pricePerNight.toLocaleString("en-IN")}</span>
                </div>
                <div className="text-[#4a5568] text-xs">per night</div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-[#4a5568] text-sm">
                  <Users className="w-4 h-4 text-primary" /> Up to {(room as any).capacity} guests
                </div>
                <div className="flex items-center gap-2 text-[#4a5568] text-sm">
                  <BedDouble className="w-4 h-4 text-primary" /> {(room as any).roomType}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className={(room as any).isAvailable ? "text-green-700 font-medium" : "text-red-500 font-medium"}>
                    {(room as any).isAvailable ? "Available to Book" : "Currently Unavailable"}
                  </span>
                </div>
              </div>
              <Link
                href={`/book?roomId=${room.id}`}
                className="block w-full text-center bg-primary text-[#060d1a] text-xs font-bold tracking-[0.15em] uppercase py-4 hover:bg-primary/90 transition-colors"
              >
                Book This Room
              </Link>
              <Link
                href="/contact"
                className="block w-full text-center border border-[#1a2332] text-[#1a2332] text-xs font-semibold tracking-[0.12em] uppercase py-3.5 mt-3 hover:bg-[#1a2332] hover:text-white transition-colors"
              >
                Send Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIdx !== null && allImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxIdx(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2" onClick={() => setLightboxIdx(null)}>
            <X className="w-7 h-7" />
          </button>
          <button className="absolute left-4 text-white/70 hover:text-white p-2" onClick={(e) => { e.stopPropagation(); setLightboxIdx(Math.max(0, lightboxIdx - 1)); }}>
            <ChevronLeft className="w-8 h-8" />
          </button>
          <img
            src={storageUrl(allImages[lightboxIdx])}
            alt="Gallery"
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="absolute right-4 text-white/70 hover:text-white p-2" onClick={(e) => { e.stopPropagation(); setLightboxIdx(Math.min(allImages.length - 1, lightboxIdx + 1)); }}>
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="absolute bottom-4 text-white/50 text-sm">{lightboxIdx + 1} / {allImages.length}</div>
        </div>
      )}
    </div>
  );
}
