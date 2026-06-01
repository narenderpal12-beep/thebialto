import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  useGetFloors, useGetAmenities, useGetAttractions, useGetReviews, useGetGallery, useGetSettings,
} from "@workspace/api-client-react";
import { storageUrl } from "@/components/ui/image-upload";
import {
  Mountain, BedDouble, Heart, Building2, Wifi, UtensilsCrossed, Flame, Car,
  Zap, Shield, Star, ChevronRight, Play, CalendarDays, Users, ArrowRight,
} from "lucide-react";

const AMENITY_ICONS: Record<string, any> = {
  wifi: Wifi, utensils: UtensilsCrossed, flame: Flame, car: Car,
  zap: Zap, shield: Shield, star: Star,
};

function SectionLabel({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <div className={`flex items-center justify-center gap-3 mb-3`}>
      <span className={`h-px w-10 ${dark ? "bg-primary/60" : "bg-primary/40"}`} />
      <span className={`text-xs font-semibold tracking-[0.2em] uppercase ${dark ? "text-primary" : "text-primary"}`}>{children}</span>
      <span className={`h-px w-10 ${dark ? "bg-primary/60" : "bg-primary/40"}`} />
    </div>
  );
}

export default function Home() {
  const { data: floors = [] } = useGetFloors();
  const { data: amenities = [] } = useGetAmenities();
  const { data: attractions = [] } = useGetAttractions();
  const { data: reviews = [] } = useGetReviews({ approved: true });
  const { data: gallery = [] } = useGetGallery({});
  const { data: settings } = useGetSettings();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const approvedReviews = (reviews as any[]).filter((r) => r.isApproved);
  const firstReview = approvedReviews[0];
  const galleryPreview = (gallery as any[]).slice(0, 4);
  const attractionsList = (attractions as any[]).slice(0, 4);

  // Hero section content
  const heroTagline = (settings as any)?.heroTagline || "Luxury Homestay in Kasauli";
  const heroTitleRaw = (settings as any)?.heroTitle || "Experience Luxury | in the Hills of Kasauli";
  const heroParts = heroTitleRaw.split("|").map((s: string) => s.trim());
  const heroLine1 = heroParts[0] ?? "Experience Luxury";
  const heroLine2 = heroParts[1] ?? "in the Hills of Kasauli";
  const heroDescription = (settings as any)?.heroDescription || "The Bialto By Asemont Estate is a classic 5-floor luxury homestay offering breathtaking views, premium comfort and unforgettable memories.";
  const heroCtaText = (settings as any)?.heroCtaText || "Explore the Estate";

  // About section content
  const aboutLabel = (settings as any)?.aboutLabel || "About the Estate";
  const aboutTitle = (settings as any)?.aboutTitle || "A Timeless Escape\nSurrounded by Nature";
  const aboutDescription = (settings as any)?.aboutDescription || "Nestled in the serene hills of Kasauli, The Bialto is where classic architecture meets modern comfort. Our estate blends beautiful landscapes, warm hospitality and world-class amenities to create the perfect getaway.";
  const aboutCtaText = (settings as any)?.aboutCtaText || "Know More About Us";
  const aboutImage = (settings as any)?.aboutImage;

  // Floors section content
  const floorsSectionLabel = (settings as any)?.floorsSectionLabel || "Our Estate";
  const floorsSectionTitle = (settings as any)?.floorsSectionTitle || "Five Floors of Luxury & Comfort";

  return (
    <div className="flex flex-col">
      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background photo — Ken Burns zoom-pan effect */}
        <div className="absolute inset-0 z-0">
          <motion.img
            src="/images/hero-1.png"
            alt="The Bialto Estate"
            className="w-full h-full object-cover object-center"
            initial={{ scale: 1.12, x: "2%" }}
            animate={{ scale: 1.0, x: "0%" }}
            transition={{ duration: 14, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060d1a]/90 via-[#060d1a]/60 to-[#060d1a]/20" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="max-w-xl"
            >
              {/* Tag */}
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-primary/70" />
                <span className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">{heroTagline}</span>
                <span className="h-px w-8 bg-primary/70" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-white leading-tight mb-5">
                {heroLine1}<br />
                <span className="text-white/90">{heroLine2.replace(/Kasauli$/, "").trimEnd()}</span>
                {heroLine2.endsWith("Kasauli") && <>{" "}<span className="text-primary">Kasauli</span></>}
                {!heroLine2.endsWith("Kasauli") && heroLine2 && <span className="text-white/90"> {heroLine2}</span>}
              </h1>

              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-md">
                {heroDescription}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-primary text-[#060d1a] text-xs font-semibold tracking-[0.15em] uppercase px-7 py-3.5 hover:bg-primary/90 transition-colors"
                >
                  {heroCtaText}
                </Link>
                <button className="inline-flex items-center gap-2 border border-white/30 text-white text-xs font-semibold tracking-[0.15em] uppercase px-7 py-3.5 hover:bg-white/10 transition-colors">
                  <Play className="w-3.5 h-3.5" /> Watch Video
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Booking bar */}
        <div className="relative z-10 pb-0">
          <div className="max-w-7xl mx-auto px-4 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="bg-white shadow-2xl flex flex-col md:flex-row items-stretch"
            >
              <div className="flex-1 flex flex-col md:flex-row">
                {/* Check-in */}
                <div className="flex-1 flex items-center gap-3 px-5 py-4 border-b md:border-b-0 md:border-r border-gray-200">
                  <CalendarDays className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-0.5">Check-in</div>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="text-sm font-medium text-gray-800 bg-transparent focus:outline-none w-full"
                    />
                  </div>
                </div>
                {/* Check-out */}
                <div className="flex-1 flex items-center gap-3 px-5 py-4 border-b md:border-b-0 md:border-r border-gray-200">
                  <CalendarDays className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-0.5">Check-out</div>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="text-sm font-medium text-gray-800 bg-transparent focus:outline-none w-full"
                    />
                  </div>
                </div>
                {/* Guests */}
                <div className="flex-1 flex items-center gap-3 px-5 py-4 border-b md:border-b-0 md:border-r border-gray-200">
                  <Users className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0 w-full">
                    <div className="text-[10px] font-semibold tracking-[0.15em] text-gray-400 uppercase mb-0.5">Guests</div>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="text-sm font-medium text-gray-800 bg-transparent focus:outline-none w-full"
                    >
                      {[1,2,3,4,5,6,7,8].map(n => (
                        <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* CTA */}
              <Link
                href={`/book?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                className="flex items-center justify-center gap-2 bg-primary text-[#060d1a] font-semibold text-xs tracking-[0.15em] uppercase px-8 py-5 hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Check Availability
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. ABOUT THE ESTATE
      ══════════════════════════════════════════ */}
      <section className="bg-[#f5f0e8] py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{aboutLabel}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2332] leading-snug mb-5">
              {aboutTitle.split("\n").map((line: string, i: number) => (
                <span key={i}>{line}{i < aboutTitle.split("\n").length - 1 && <br />}</span>
              ))}
            </h2>
            <p className="text-[#4a5568] text-sm md:text-base leading-relaxed mb-8">
              {aboutDescription}
            </p>

            {/* Feature icons */}
            <div className="grid grid-cols-4 gap-4 mb-10">
              {[
                { icon: Mountain, label: "Scenic Views" },
                { icon: BedDouble, label: "Luxury Rooms" },
                { icon: Heart, label: "Warm Hospitality" },
                { icon: Building2, label: "5 Floors Estate" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[11px] text-[#4a5568] font-medium leading-tight">{label}</span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-[#1a2332] text-[#1a2332] text-xs font-semibold tracking-[0.15em] uppercase px-7 py-3 hover:bg-[#1a2332] hover:text-white transition-colors"
            >
              {aboutCtaText} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right — image */}
          <div className="relative">
            <img
              src={aboutImage ? storageUrl(aboutImage) : "/images/about-balcony.png"}
              alt="The Bialto Estate View"
              className="w-full h-[420px] md:h-[500px] object-cover shadow-2xl"
            />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-primary/40 hidden md:block" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. FIVE FLOORS
      ══════════════════════════════════════════ */}
      <section className="bg-[#faf7f2] py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <SectionLabel>{floorsSectionLabel}</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2332]">{floorsSectionTitle}</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {(floors as any[]).slice(0, 5).map((floor, i) => (
              <Link key={floor.id} href={`/floors/${floor.id}`} className="group block">
                <div className="relative h-44 md:h-52 overflow-hidden">
                  {floor.imageUrl ? (
                    <img
                      src={storageUrl(floor.imageUrl)}
                      alt={floor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <img
                      src={["/images/hero-1.png","/images/about-interior.png","/images/about-balcony.png","/images/hero-2.png","/images/about-interior.png"][i % 5]}
                      alt={floor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-[10px] font-semibold tracking-[0.15em] text-primary uppercase mb-0.5">Floor {floor.floorNumber}</div>
                    <h3 className="text-white font-serif text-sm leading-tight">{floor.name}</h3>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 px-3 py-3 group-hover:border-primary/30 transition-colors">
                  <p className="text-[#4a5568] text-xs leading-relaxed line-clamp-2">{floor.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. AMENITIES STRIP
      ══════════════════════════════════════════ */}
      <section className="bg-[#0b1220] py-14">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap justify-center md:justify-between gap-8">
            {(amenities as any[]).slice(0, 6).map((a) => {
              const Icon = AMENITY_ICONS[a.icon] ?? Star;
              return (
                <div key={a.id} className="flex flex-col items-center gap-2 min-w-[80px]">
                  <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[11px] font-medium tracking-wide text-white/80 text-center">{a.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. GALLERY  |  ATTRACTIONS  |  REVIEWS
      ══════════════════════════════════════════ */}
      <section className="bg-[#f5f0e8] py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-10 md:gap-8">
          {/* Gallery */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-[0.18em] text-[#1a2332] uppercase">Gallery</span>
              <Link href="/gallery" className="text-xs text-primary font-medium tracking-wide hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {galleryPreview.length > 0 ? galleryPreview.map((img: any) => (
                <div key={img.id} className="aspect-square overflow-hidden">
                  <img
                    src={storageUrl(img.imageUrl)}
                    alt={img.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )) : (
                ["/images/hero-1.png", "/images/about-balcony.png", "/images/about-interior.png", "/images/hero-2.png"].map((src, i) => (
                  <div key={i} className="aspect-square overflow-hidden">
                    <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Attractions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-[0.18em] text-[#1a2332] uppercase">Attractions Nearby</span>
              <Link href="/attractions" className="text-xs text-primary font-medium tracking-wide hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {attractionsList.map((a: any, i: number) => (
                <div key={a.id} className="flex gap-3 items-center">
                  <div className="w-14 h-14 flex-shrink-0 overflow-hidden rounded">
                    {a.imageUrl ? (
                      <img src={storageUrl(a.imageUrl)} alt={a.name} className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={["/images/attr-mall-road.png", "/images/attr-church.png", "/images/about-balcony.png", "/images/hero-2.png"][i % 4]}
                        alt={a.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-[#1a2332] text-sm font-medium">{a.name}</p>
                    <p className="text-[#6b7280] text-xs mt-0.5">{a.travelTime || a.distance}</p>
                  </div>
                </div>
              ))}
              {attractionsList.length === 0 && (
                <p className="text-[#6b7280] text-sm">Explore nearby places soon.</p>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold tracking-[0.18em] text-[#1a2332] uppercase">Guest Reviews</span>
              <Link href="/reviews" className="text-xs text-primary font-medium tracking-wide hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {firstReview ? (
              <div className="bg-white p-5 shadow-sm border border-gray-100">
                <div className="text-primary text-3xl font-serif leading-none mb-3">"</div>
                <p className="text-[#4a5568] text-sm leading-relaxed mb-4 italic">
                  {firstReview.reviewText}
                </p>
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i <= firstReview.rating ? "fill-primary text-primary" : "text-gray-300"}`} />
                  ))}
                </div>
                <div className="text-[#1a2332] text-sm font-semibold">{firstReview.guestName}</div>
                {firstReview.guestLocation && (
                  <div className="text-[#6b7280] text-xs">{firstReview.guestLocation}</div>
                )}
              </div>
            ) : (
              <div className="bg-white p-5 shadow-sm border border-gray-100 text-[#6b7280] text-sm">
                Be the first to leave a review!
              </div>
            )}
            <Link
              href="/reviews"
              className="mt-4 inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
            >
              Read all reviews <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
