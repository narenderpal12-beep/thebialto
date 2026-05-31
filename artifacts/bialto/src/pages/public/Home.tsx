import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetFeaturedRooms, useGetAmenities, useGetAttractions } from "@workspace/api-client-react";

export default function Home() {
  const { data: featuredRooms } = useGetFeaturedRooms();
  const { data: amenities } = useGetAmenities();

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/50 z-10" />
          <img 
            src="/images/hero-1.png" 
            alt="The Bialto Estate Exterior" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="text-primary font-serif italic text-xl md:text-2xl mb-4 tracking-widest">
              Welcome to
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white mb-6 tracking-wide drop-shadow-lg uppercase">
              The Bialto
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto mb-10 drop-shadow-md font-serif">
              A private heritage mountain estate where old-world colonial architecture meets Himalayan grandeur.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-xl tracking-wider px-10 py-6 rounded-none">
              <Link href="/book">DISCOVER MORE</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">A Handcrafted Experience</h2>
          <p className="text-lg text-foreground/80 leading-relaxed font-light mb-8">
            Nestled in the snowy hills of Kasauli, The Bialto offers a sanctuary of warmth and luxury. Every corner feels unhurried, like a private heritage manor rather than a commercial hotel. Guests don't check in — they arrive.
          </p>
          <img src="/images/about-interior.png" alt="Interior" className="w-full h-[60vh] object-cover rounded-sm shadow-xl" />
        </div>
      </section>
    </div>
  );
}
