import { motion } from "framer-motion";
import { useGetAmenities } from "@workspace/api-client-react";
import { Wifi, UtensilsCrossed, Flame, Car, Zap, Shield, Star, Coffee, Wind, Bath, Phone, Heart, Mountain, Sparkles, BedDouble, Tv } from "lucide-react";
import { PageBanner } from "./About";

const ICONS: Record<string, any> = {
  wifi: Wifi, utensils: UtensilsCrossed, flame: Flame, car: Car, zap: Zap, shield: Shield,
  star: Star, coffee: Coffee, wind: Wind, bath: Bath, phone: Phone, heart: Heart,
  mountain: Mountain, sparkles: Sparkles, tv: Tv, bell: BedDouble, droplets: Bath,
};

export default function Amenities() {
  const { data: amenities = [], isLoading } = useGetAmenities();

  return (
    <div className="flex flex-col pt-[70px]">
      <PageBanner title="Estate Amenities" crumb="Amenities" />

      <section className="bg-[#f5f0e8] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-10 bg-primary/40" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">What We Offer</span>
              <span className="h-px w-10 bg-primary/40" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2332]">Curated for Your Comfort</h2>
            <p className="text-[#4a5568] text-sm max-w-xl mx-auto mt-3">
              Every amenity at The Bialto is thoughtfully chosen to enhance your stay and make your time here truly memorable.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-[#4a5568]">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {(amenities as any[]).map((a, i) => {
                const Icon = ICONS[a.icon] ?? Star;
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 text-center border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-[#1a2332] text-lg mb-1">{a.name}</h3>
                    {a.description && (
                      <p className="text-[#4a5568] text-xs leading-relaxed">{a.description}</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Dark strip CTA */}
      <section className="bg-[#0b1220] py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-serif text-white mb-3">Ready for a Luxury Getaway?</h2>
        <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">Book your stay at The Bialto and experience every amenity firsthand.</p>
        <a href="/book" className="inline-flex items-center gap-2 bg-primary text-[#060d1a] text-xs font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-primary/90 transition-colors">
          Book Your Stay
        </a>
      </section>
    </div>
  );
}
