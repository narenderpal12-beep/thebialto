import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetFloors } from "@workspace/api-client-react";
import {  imageUrl } from "@/components/ui/image-upload";
import { BedDouble, ArrowRight, Layers } from "lucide-react";
import { PageBanner } from "./About";

export default function Floors() {
  const { data: floors = [], isLoading } = useGetFloors();

  return (
    <div className="flex flex-col pt-[70px]">
      <PageBanner title="Floors & Rooms" crumb="Floors & Rooms" />

      <section className="bg-[#f5f0e8] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-10 bg-primary/40" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Our Estate</span>
              <span className="h-px w-10 bg-primary/40" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2332]">Five Floors of Luxury & Comfort</h2>
            <p className="text-[#4a5568] text-sm max-w-xl mx-auto mt-3">
              Each floor of The Bialto tells its own story — from the Heritage Lounge on the ground level to the Sky Suite & Dining on the top floor.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-[#4a5568]">Loading floors...</div>
          ) : (
            <div className="space-y-8">
              {(floors as any[]).map((floor, i) => (
                <motion.div
                  key={floor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className={`grid md:grid-cols-2 gap-0 overflow-hidden shadow-md ${i % 2 === 1 ? "md:grid-flow-col-dense" : ""}`}
                >
                  {/* Image */}
                  <div className={`relative h-64 md:h-72 overflow-hidden ${i % 2 === 1 ? "md:order-2" : ""}`}>
                    {floor.imageUrl ? (
                      <img src={ imageUrl(floor.imageUrl)} alt={floor.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <img
                        src={["/images/hero-1.png","/images/about-interior.png","/images/about-balcony.png","/images/hero-2.png","/images/about-interior.png"][i % 5]}
                        alt={floor.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute top-4 left-4 bg-primary text-[#060d1a] text-xs font-bold tracking-widest px-3 py-1">
                      FLOOR {floor.floorNumber}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`bg-white p-8 md:p-10 flex flex-col justify-center ${i % 2 === 1 ? "md:order-1" : ""}`}>
                    <h3 className="text-2xl md:text-3xl font-serif text-[#1a2332] mb-3">{floor.name}</h3>
                    <p className="text-[#4a5568] text-sm leading-relaxed mb-6">{floor.description}</p>
                    <div className="flex items-center gap-2 mb-6 text-[#4a5568] text-sm">
                      <BedDouble className="w-4 h-4 text-primary" />
                      <span>{floor.rooms?.length ?? 0} Room{(floor.rooms?.length ?? 0) !== 1 ? "s" : ""} on this floor</span>
                    </div>
                    <Link
                      href={`/floors/${floor.id}`}
                      className="inline-flex items-center gap-2 border border-[#1a2332] text-[#1a2332] text-xs font-semibold tracking-[0.15em] uppercase px-6 py-3 hover:bg-[#1a2332] hover:text-white transition-colors w-fit"
                    >
                      View Rooms <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
