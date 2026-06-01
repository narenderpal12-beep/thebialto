import { useRoute, Link } from "wouter";
import { useGetFloor } from "@workspace/api-client-react";
import { storageUrl } from "@/components/ui/image-upload";
import { BedDouble, Users, IndianRupee, ArrowRight, Layers } from "lucide-react";
import { PageBanner } from "./About";

export default function FloorDetail() {
  const [, params] = useRoute("/floors/:id");
  const id = Number(params?.id);
  const { data: floor, isLoading } = useGetFloor(id, { query: { enabled: !!id } });

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

  return (
    <div className="flex flex-col pt-[70px]">
      {/* Banner */}
      <div className="relative h-72 md:h-80 overflow-hidden flex items-end">
        {floor.imageUrl ? (
          <img src={storageUrl(floor.imageUrl)} alt={floor.name} className="absolute inset-0 w-full h-full object-cover" />
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

      {/* Description */}
      <section className="bg-[#f5f0e8] py-14">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl">
            <p className="text-[#4a5568] text-base leading-relaxed">{floor.description}</p>
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="bg-[#faf7f2] py-16">
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
