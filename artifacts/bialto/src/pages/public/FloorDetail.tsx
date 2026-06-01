import { useRoute, Link } from "wouter";
import { useGetFloor } from "@workspace/api-client-react";
import { storageUrl } from "@/components/ui/image-upload";
import { useState } from "react";
import { BedDouble, Users, IndianRupee, ArrowRight, UtensilsCrossed, CheckCircle2, XCircle, X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { PageBanner } from "./About";

export default function FloorDetail() {
  const [, params] = useRoute("/floors/:id");
  const id = Number(params?.id);
  const { data: floor, isLoading } = useGetFloor(id, { query: { enabled: !!id } });
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="pt-[70px]">
        <div className="h-56 bg-[#0b1220] animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center text-[#4a5568]">Loading floor details...</div>
      </div>
    );
  }

  if (!floor) {
    return (
      <div className="pt-[70px]">
        <PageBanner title="Not Found" crumb="Floors" />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center text-[#4a5568]">Floor not found.</div>
      </div>
    );
  }

  const gallery: string[] = (floor as any).galleryImages ?? [];

  return (
    <div className="flex flex-col pt-[70px]">
      {/* Banner */}
      <div className="relative h-72 md:h-80 overflow-hidden flex items-end">
        {(floor as any).imageUrl ? (
          <img src={storageUrl((floor as any).imageUrl)} alt={floor.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <img src="/images/hero-1.png" alt={floor.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060d1a]/90 via-[#060d1a]/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pb-8">
          <div className="text-white/50 text-xs tracking-widest mb-2 uppercase">
            <Link href="/" className="hover:text-primary">Home</Link> /{" "}
            <Link href="/floors" className="hover:text-primary">Floors</Link> / {floor.name}
          </div>
          <div className="text-primary text-xs font-semibold tracking-widest mb-1 uppercase">Floor {floor.floorNumber}</div>
          <h1 className="text-4xl md:text-5xl font-serif text-white">{floor.name}</h1>
        </div>
      </div>

      {/* Info strip */}
      <div className="bg-[#0b1220] py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-wrap items-center gap-6 text-sm">
          <div className={`flex items-center gap-2 ${(floor as any).isAvailable ? "text-green-400" : "text-red-400"}`}>
            {(floor as any).isAvailable ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {(floor as any).isAvailable ? "Rooms Available" : "Currently Fully Booked"}
          </div>
          {(floor as any).hasKitchen && (
            <div className="flex items-center gap-2 text-primary">
              <UtensilsCrossed className="w-4 h-4" />
              Kitchen Available on this Floor
            </div>
          )}
          <div className="flex items-center gap-2 text-white/60">
            <BedDouble className="w-4 h-4 text-primary" />
            {(floor as any).rooms?.length ?? 0} Room{((floor as any).rooms?.length ?? 0) !== 1 ? "s" : ""} · All with Attached Bathroom
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="bg-[#f5f0e8] py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-[#4a5568] text-base leading-relaxed max-w-2xl">{floor.description}</p>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="bg-[#faf7f2] py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center gap-2 mb-6">
              <Images className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-serif text-[#1a2332]">Floor Gallery</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {gallery.map((path, i) => (
                <button key={i} className="overflow-hidden aspect-video" onClick={() => setLightbox(i)}>
                  <img src={storageUrl(path)} alt={`${floor.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rooms */}
      <section className="bg-[#f5f0e8] py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-serif text-[#1a2332]">
              Rooms on {floor.name}
            </h2>
            <div className="flex items-center gap-1.5 text-[#4a5568] text-sm">
              <BedDouble className="w-4 h-4 text-primary" />
              {(floor as any).rooms?.length ?? 0} room(s)
            </div>
          </div>

          {!(floor as any).rooms?.length ? (
            <p className="text-[#4a5568]">No rooms listed on this floor yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {((floor as any).rooms as any[]).map((room: any) => (
                <Link key={room.id} href={`/rooms/${room.id}`} className="group block bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                  <div className="relative h-52 overflow-hidden">
                    {room.featureImageUrl ? (
                      <img src={storageUrl(room.featureImageUrl)} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <img src="/images/about-interior.png" alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-[#1a2332]">
                      {room.roomType}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-[#1a2332] text-xl mb-1">{room.name}</h3>
                    <p className="text-[#4a5568] text-xs line-clamp-2 mb-4">{room.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-primary font-semibold text-sm">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {room.pricePerNight.toLocaleString("en-IN")}<span className="text-[#4a5568] font-normal text-xs">/night</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#4a5568] text-xs">
                        <Users className="w-3.5 h-3.5" /> {room.capacity} guests
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3 text-xs text-[#6b7280]">
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Attached Bathroom</span>
                      {(floor as any).hasKitchen && <span className="flex items-center gap-1"><UtensilsCrossed className="w-3 h-3 text-primary" /> Shared Kitchen</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && gallery.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2" onClick={() => setLightbox(null)}>
            <X className="w-7 h-7" />
          </button>
          <button className="absolute left-4 text-white/70 hover:text-white p-3" onClick={(e) => { e.stopPropagation(); setLightbox(Math.max(0, lightbox - 1)); }}>
            <ChevronLeft className="w-9 h-9" />
          </button>
          <img src={storageUrl(gallery[lightbox])} alt="Gallery" className="max-h-[85vh] max-w-[90vw] object-contain" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 text-white/70 hover:text-white p-3" onClick={(e) => { e.stopPropagation(); setLightbox(Math.min(gallery.length - 1, lightbox + 1)); }}>
            <ChevronRight className="w-9 h-9" />
          </button>
          <div className="absolute bottom-4 text-white/50 text-sm">{lightbox + 1} / {gallery.length}</div>
        </div>
      )}
    </div>
  );
}
