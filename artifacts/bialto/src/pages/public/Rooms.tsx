import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetRooms, useGetFloors } from "@workspace/api-client-react";
import { storageUrl } from "@/components/ui/image-upload";
import { BedDouble, Users, IndianRupee, Filter } from "lucide-react";
import { PageBanner } from "./About";

export default function Rooms() {
  const { data: rooms = [], isLoading } = useGetRooms({ published: true });
  const { data: floors = [] } = useGetFloors();
  const [floorFilter, setFloorFilter] = useState<number | null>(null);

  const filtered = floorFilter
    ? (rooms as any[]).filter((r) => r.floorId === floorFilter)
    : (rooms as any[]);

  return (
    <div className="flex flex-col pt-[70px]">
      <PageBanner title="Our Rooms" crumb="Rooms" />

      <section className="bg-[#f5f0e8] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Filter bar */}
          <div className="flex items-center gap-3 mb-10 flex-wrap">
            <div className="flex items-center gap-2 text-[#4a5568] text-xs font-medium mr-2">
              <Filter className="w-3.5 h-3.5" /> Filter by floor:
            </div>
            <button
              onClick={() => setFloorFilter(null)}
              className={`text-xs font-semibold tracking-wide px-4 py-2 border transition-colors ${!floorFilter ? "bg-[#1a2332] text-white border-[#1a2332]" : "border-[#1a2332]/30 text-[#4a5568] hover:border-[#1a2332]"}`}
            >
              All Rooms
            </button>
            {(floors as any[]).map((f) => (
              <button
                key={f.id}
                onClick={() => setFloorFilter(f.id)}
                className={`text-xs font-semibold tracking-wide px-4 py-2 border transition-colors ${floorFilter === f.id ? "bg-[#1a2332] text-white border-[#1a2332]" : "border-[#1a2332]/30 text-[#4a5568] hover:border-[#1a2332]"}`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center text-[#4a5568] py-12">Loading rooms...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((room: any, i: number) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/rooms/${room.id}`} className="group block bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="relative h-56 overflow-hidden">
                      {room.featureImageUrl ? (
                        <img src={storageUrl(room.featureImageUrl)} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                      ) : (
                        <img src="/images/about-interior.png" alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                      )}
                      <div className="absolute top-3 left-3 bg-primary text-[#060d1a] text-[10px] font-bold tracking-widest px-2.5 py-1">
                        {room.roomType?.toUpperCase()}
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#1a2332] text-xs font-semibold px-2.5 py-1">
                        <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{room.pricePerNight.toLocaleString("en-IN")}/night</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-[#1a2332] text-xl mb-1.5">{room.name}</h3>
                      <p className="text-[#4a5568] text-xs leading-relaxed line-clamp-2 mb-4">{room.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-[#4a5568] text-xs">
                          <Users className="w-3.5 h-3.5 text-primary" /> {room.capacity} guests
                        </div>
                        <span className="text-primary text-xs font-semibold tracking-wide uppercase">View Details →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-3 text-center py-12 text-[#4a5568]">No rooms found for this filter.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
