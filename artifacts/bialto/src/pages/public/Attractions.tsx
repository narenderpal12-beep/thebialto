import { motion } from "framer-motion";
import { useGetAttractions } from "@workspace/api-client-react";
import { storageUrl } from "@/components/ui/image-upload";
import { Navigation, Clock, MapPin } from "lucide-react";
import { PageBanner } from "./About";

const FALLBACK_IMAGES = [
  "/images/attr-mall-road.png", "/images/attr-church.png",
  "/images/about-balcony.png", "/images/hero-2.png",
  "/images/hero-1.png", "/images/about-interior.png",
];

export default function Attractions() {
  const { data: attractions = [], isLoading } = useGetAttractions();

  return (
    <div className="flex flex-col pt-[70px]">
      <PageBanner title="Nearby Attractions" crumb="Attractions" />

      <section className="bg-[#f5f0e8] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-10 bg-primary/40" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Explore Around</span>
              <span className="h-px w-10 bg-primary/40" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2332]">Places to Visit Near Kasauli</h2>
            <p className="text-[#4a5568] text-sm max-w-xl mx-auto mt-3">
              Kasauli is surrounded by natural beauty and heritage sites. Here are our top picks within easy reach of The Bialto.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-[#4a5568]">Loading attractions...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {(attractions as any[]).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow flex gap-0 overflow-hidden group"
                >
                  <div className="w-36 md:w-44 flex-shrink-0 overflow-hidden">
                    {a.imageUrl ? (
                      <img src={storageUrl(a.imageUrl)} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <img src={FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-5 flex flex-col justify-center">
                    <h3 className="font-serif text-[#1a2332] text-xl mb-2">{a.name}</h3>
                    <p className="text-[#4a5568] text-xs leading-relaxed line-clamp-3 mb-3">{a.description}</p>
                    <div className="flex gap-4 text-xs text-[#6b7280]">
                      <span className="flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-primary" /> {a.distance}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" /> {a.travelTime}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {attractions.length === 0 && (
                <div className="col-span-2 text-center py-10 text-[#4a5568]">No attractions listed yet.</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Map CTA */}
      <section className="bg-[#0b1220] py-14 text-center">
        <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
        <h3 className="text-xl font-serif text-white mb-2">Find Us on the Map</h3>
        <p className="text-white/60 text-sm mb-6">Dochi Road, Kasauli, Himachal Pradesh, India</p>
        <a href="/contact" className="inline-flex items-center gap-2 bg-primary text-[#060d1a] text-xs font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-primary/90 transition-colors">
          Get Directions
        </a>
      </section>
    </div>
  );
}
