import { motion } from "framer-motion";
import { Link } from "wouter";
import { Mountain, BedDouble, Heart, Building2, ArrowRight, CheckCircle2 } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

function PageBanner({ title, crumb }: { title: string; crumb: string }) {
  return (
    <div className="relative h-56 md:h-64 flex items-end overflow-hidden">
      <img src="/images/hero-2.png" alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[#060d1a]/70" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pb-8">
        <div className="text-white/50 text-xs tracking-widest mb-2 uppercase">Home / {crumb}</div>
        <h1 className="text-4xl md:text-5xl font-serif text-white">{title}</h1>
      </div>
    </div>
  );
}

export { PageBanner };

export default function About() {
  return (
    <div className="flex flex-col pt-[70px]">
      <PageBanner title="About The Estate" crumb="About" />

      {/* Story section */}
      <section className="bg-[#f5f0e8] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-14 items-center">
          <motion.div initial="hidden" whileInView="show" variants={fadeUp} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Our Story</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2332] leading-snug mb-5">
              A Heritage Retreat<br />in the Himalayan Hills
            </h2>
            <p className="text-[#4a5568] text-sm md:text-base leading-relaxed mb-5">
              The Bialto by Asemont Estate is a lovingly restored colonial mansion nestled in the serene hills of Kasauli, Himachal Pradesh. Built in the era of British India, the estate's timeless architecture tells stories of a golden age — now reimagined as a premium luxury homestay.
            </p>
            <p className="text-[#4a5568] text-sm md:text-base leading-relaxed mb-8">
              Spanning five thoughtfully designed floors, each with its own unique character, The Bialto offers an experience that blends old-world charm with modern comforts — panoramic Himalayan views, curated interiors, and warm, personalised hospitality.
            </p>
            <ul className="space-y-2.5 mb-8">
              {["5-Floor Heritage Mansion on 1.2 acres", "7 Premium Rooms with Mountain Views", "In-house Dining & Bonfire Evenings", "Just 60 km from Chandigarh"].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-[#4a5568] text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/floors" className="inline-flex items-center gap-2 bg-[#1a2332] text-white text-xs font-semibold tracking-[0.15em] uppercase px-7 py-3.5 hover:bg-[#1a2332]/80 transition-colors">
              Explore Our Floors <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" variants={fadeUp} transition={{ duration: 0.7, delay: 0.15 }} viewport={{ once: true }} className="grid grid-cols-2 gap-3">
            <img src="/images/hero-1.png" alt="Estate exterior" className="w-full h-52 object-cover col-span-2" />
            <img src="/images/about-balcony.png" alt="Balcony" className="w-full h-40 object-cover" />
            <img src="/images/about-interior.png" alt="Interior" className="w-full h-40 object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="bg-[#0b1220] py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Mountain, title: "Scenic Views", desc: "Panoramic vistas of the Himalayan ranges from every floor" },
              { icon: BedDouble, title: "Luxury Rooms", desc: "7 uniquely styled rooms with premium bedding and décor" },
              { icon: Heart, title: "Warm Hospitality", desc: "Personalised service with a family estate feel" },
              { icon: Building2, title: "5 Floors", desc: "Each floor has its own unique character and charm" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 border border-white/10 hover:border-primary/40 transition-colors">
                <div className="w-12 h-12 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-white text-lg mb-2">{title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-[#faf7f2] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-8 bg-primary/50" />
              <span className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Our Location</span>
            </div>
            <h2 className="text-3xl font-serif text-[#1a2332] mb-5">Dochi Road, Kasauli</h2>
            <p className="text-[#4a5568] text-sm leading-relaxed mb-4">
              Kasauli is a charming hill station in Himachal Pradesh, known for its colonial architecture, dense forests, and breathtaking views. The Bialto sits on Dochi Road, offering privacy and tranquility while being minutes from the main market.
            </p>
            <ul className="space-y-2 text-[#4a5568] text-sm mb-6">
              <li>📍 Dochi Road, Kasauli, Himachal Pradesh 173204</li>
              <li>🚗 ~60 km from Chandigarh (1.5 hrs)</li>
              <li>✈️ ~65 km from Chandigarh Airport</li>
              <li>🚂 ~35 km from Kalka Railway Station</li>
            </ul>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-[#1a2332] text-[#1a2332] text-xs font-semibold tracking-[0.15em] uppercase px-7 py-3 hover:bg-[#1a2332] hover:text-white transition-colors">
              Get Directions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="aspect-video bg-muted rounded overflow-hidden shadow-lg">
            <iframe
              src="https://maps.google.com/maps?q=Kasauli,Himachal+Pradesh&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%" height="100%" style={{ border: 0 }}
              loading="lazy"
              title="Location Map"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
