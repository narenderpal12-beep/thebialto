import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetGallery } from "@workspace/api-client-react";
import { imageUrl } from "@/components/ui/image-upload";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
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
  { id: -1, imageUrl: null, _src: "/images/hero-1.png",          title: "Estate View 1",   category: "estate-exterior" },
  { id: -2, imageUrl: null, _src: "/images/about-balcony.png",   title: "Balcony",          category: "interior" },
  { id: -3, imageUrl: null, _src: "/images/about-interior.png",  title: "Interior",         category: "rooms" },
  { id: -4, imageUrl: null, _src: "/images/hero-2.png",          title: "Estate View 2",   category: "estate-exterior" },
  { id: -5, imageUrl: null, _src: "/images/hero-1.png",          title: "Estate View 3",   category: "estate-exterior" },
  { id: -6, imageUrl: null, _src: "/images/about-interior.png",  title: "Interior 2",       category: "interior" },
];

export default function Gallery() {
  const [category, setCategory] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Fetch ALL images once — filter client-side so category switching is instant
  const { data: allImages = [] } = useGetGallery({});

  const realImages = (allImages as any[]);
  const useFallback = realImages.length === 0;

  const source = useFallback ? FALLBACK : realImages;

  const filtered = category === "all"
    ? source
    : source.filter((img: any) => img.category === category);

  const getSrc = (img: any) =>
    img._src ?? (img.imageUrl ? imageUrl(img.imageUrl) : "/images/hero-1.png");

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
                onClick={() => { setCategory(c.value); setLightbox(null); }}
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

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-[#9ca3af]">
              <Images className="w-12 h-12" />
              <p className="text-sm font-medium">No images in this category yet.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3"
              >
                {filtered.map((img: any, i: number) => (
                  <button
                    key={img.id}
                    className="w-full block overflow-hidden break-inside-avoid cursor-pointer group"
                    onClick={() => setLightbox(i)}
                  >
                    <img
                      src={getSrc(img)}
                      alt={img.title}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ height: i % 3 === 0 ? "220px" : i % 3 === 1 ? "180px" : "260px" }}
                    />
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
            onClick={() => setLightbox(null)}
          >
            <X className="w-7 h-7" />
          </button>
          <button
            className="absolute left-4 text-white/70 hover:text-white p-3 disabled:opacity-30"
            disabled={lightbox === 0}
            onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
          >
            <ChevronLeft className="w-9 h-9" />
          </button>
          <img
            src={getSrc(filtered[lightbox])}
            alt={filtered[lightbox]?.title}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-white/70 hover:text-white p-3 disabled:opacity-30"
            disabled={lightbox === filtered.length - 1}
            onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
          >
            <ChevronRight className="w-9 h-9" />
          </button>
          <div className="absolute bottom-4 text-white/50 text-sm">
            {lightbox + 1} / {filtered.length}
          </div>
        </div>
      )}
    </div>
  );
}
