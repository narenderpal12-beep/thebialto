import { useState } from "react";
import { motion } from "framer-motion";
import { useGetGallery } from "@workspace/api-client-react";
import { storageUrl } from "@/components/ui/image-upload";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PageBanner } from "./About";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "estate-exterior", label: "Estate Exterior" },
  { value: "interior", label: "Interior" },
  { value: "rooms", label: "Rooms" },
  { value: "dining", label: "Dining" },
  { value: "snow-views", label: "Snow Views" },
  { value: "attractions", label: "Attractions" },
];

const FALLBACK = [
  "/images/hero-1.png", "/images/about-balcony.png",
  "/images/about-interior.png", "/images/hero-2.png",
  "/images/hero-1.png", "/images/about-interior.png",
];

export default function Gallery() {
  const [category, setCategory] = useState("all");
  const { data: images = [] } = useGetGallery(category !== "all" ? { category } : {});
  const [lightbox, setLightbox] = useState<number | null>(null);

  const displayed = (images as any[]).length > 0
    ? (images as any[])
    : FALLBACK.map((src, i) => ({ id: i, imageUrl: null, _fallback: src, title: `Estate Photo ${i + 1}` }));

  return (
    <div className="flex flex-col pt-[70px]">
      <PageBanner title="Gallery" crumb="Gallery" />

      <section className="bg-[#f5f0e8] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap justify-center mb-10">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`text-xs font-semibold tracking-[0.12em] px-5 py-2.5 border transition-colors ${
                  category === c.value
                    ? "bg-[#1a2332] text-white border-[#1a2332]"
                    : "border-[#1a2332]/30 text-[#4a5568] hover:border-[#1a2332] hover:text-[#1a2332]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Masonry-style grid */}
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {displayed.map((img: any, i: number) => (
              <motion.button
                key={img.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="w-full block overflow-hidden break-inside-avoid cursor-pointer group"
                onClick={() => setLightbox(i)}
              >
                <img
                  src={img.imageUrl ? storageUrl(img.imageUrl) : img._fallback}
                  alt={img.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ height: i % 3 === 0 ? "220px" : i % 3 === 1 ? "180px" : "260px" }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2" onClick={() => setLightbox(null)}>
            <X className="w-7 h-7" />
          </button>
          <button
            className="absolute left-4 text-white/70 hover:text-white p-3"
            onClick={(e) => { e.stopPropagation(); setLightbox(Math.max(0, lightbox - 1)); }}
          >
            <ChevronLeft className="w-9 h-9" />
          </button>
          <img
            src={displayed[lightbox]?.imageUrl ? storageUrl(displayed[lightbox].imageUrl) : displayed[lightbox]?._fallback}
            alt="Gallery"
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-white/70 hover:text-white p-3"
            onClick={(e) => { e.stopPropagation(); setLightbox(Math.min(displayed.length - 1, lightbox + 1)); }}
          >
            <ChevronRight className="w-9 h-9" />
          </button>
          <div className="absolute bottom-4 text-white/50 text-sm">{lightbox + 1} / {displayed.length}</div>
        </div>
      )}
    </div>
  );
}
