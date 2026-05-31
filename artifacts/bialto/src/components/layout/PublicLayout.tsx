import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, MessageCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoGold from "@assets/d6456c74-df9e-4207-9c0b-528151a4c565_1780252264411.png";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Floors", href: "/floors" },
  { name: "Rooms", href: "/rooms" },
  { name: "Amenities", href: "/amenities" },
  { name: "Gallery", href: "/gallery" },
  { name: "Attractions", href: "/attractions" },
  { name: "Reviews", href: "/reviews" },
  { name: "Contact", href: "/contact" },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border/50 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link href="/">
            <img src={logoGold} alt="The Bialto" className="h-10 md:h-12 object-contain cursor-pointer" />
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-foreground/90"}`}>
                {link.name.toUpperCase()}
              </Link>
            ))}
            <Button asChild variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-lg tracking-wider px-8">
              <Link href="/book">BOOK NOW</Link>
            </Button>
          </nav>

          <button className="lg:hidden text-foreground" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-background flex flex-col"
          >
            <div className="p-4 flex justify-end">
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-foreground">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 space-y-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`text-2xl font-serif tracking-widest ${location === link.href ? "text-primary" : "text-foreground"}`}>
                  {link.name}
                </Link>
              ))}
              <Button asChild variant="default" className="mt-8 bg-primary text-primary-foreground font-serif text-xl tracking-wider px-12 py-6" onClick={() => setMobileMenuOpen(false)}>
                <Link href="/book">BOOK NOW</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="bg-card border-t border-border py-12 mt-auto">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div>
            <img src={logoGold} alt="The Bialto" className="h-12 object-contain mb-4 mx-auto md:mx-0" />
            <p className="text-muted-foreground text-sm max-w-sm font-serif italic">
              Where old-world colonial architecture meets Himalayan grandeur.
            </p>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Kasauli, Himachal Pradesh, India</p>
            <p>+91 98765 43210</p>
            <p>reservations@thebialto.com</p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <Button size="icon" className="rounded-full w-12 h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg" asChild>
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
            <MessageCircle className="w-5 h-5" />
          </a>
        </Button>
        <Button size="icon" className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg" asChild>
          <a href="tel:+919876543210">
            <Phone className="w-5 h-5" />
          </a>
        </Button>
        <Button size="icon" className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg" asChild>
          <Link href="/contact">
            <HelpCircle className="w-5 h-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
