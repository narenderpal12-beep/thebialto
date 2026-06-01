import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, MessageCircle, Mail, Facebook, Instagram, Twitter, Send, UserCircle2, LayoutDashboard, LogIn } from "lucide-react";
import logoGold from "@assets/d6456c74-df9e-4207-9c0b-528151a4c565_1780252264411_(1)_1780337521190.png";

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "ABOUT", href: "/about" },
  { name: "FLOORS & ROOMS", href: "/floors" },
  { name: "AMENITIES", href: "/amenities" },
  { name: "GALLERY", href: "/gallery" },
  { name: "ATTRACTIONS", href: "/attractions" },
  { name: "REVIEWS", href: "/reviews" },
  { name: "CONTACT", href: "/contact" },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Floors & Rooms", href: "/floors" },
  { name: "Amenities", href: "/amenities" },
  { name: "Gallery", href: "/gallery" },
  { name: "Attractions", href: "/attractions" },
  { name: "Reviews", href: "/reviews" },
  { name: "Contact", href: "/contact" },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [location] = useLocation();
  const [email, setEmail] = useState("");
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setLoginMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* ── HEADER ── */}
      <header className="fixed top-0 w-full z-50 bg-[#0b1220]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-[70px]">
          <Link href="/" className="flex-shrink-0">
            <img src={logoGold} alt="The Bialto" className="h-10 md:h-12 object-contain cursor-pointer" />
          </Link>

          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location === link.href || (link.href === "/floors" && (location.startsWith("/floors") || location.startsWith("/rooms")));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] font-medium tracking-[0.12em] transition-colors whitespace-nowrap ${
                    isActive ? "text-primary" : "text-white/80 hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/book"
              className="ml-2 text-[11px] font-medium tracking-[0.12em] bg-primary text-[#060d1a] hover:bg-primary/90 transition-colors px-5 py-2 whitespace-nowrap font-semibold"
            >
              BOOK NOW
            </Link>

            {/* Admin login dropdown */}
            <div className="relative ml-1" ref={loginRef}>
              <button
                onClick={() => setLoginMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 text-white/60 hover:text-primary transition-colors p-1.5 rounded"
                title="Admin Login"
              >
                <UserCircle2 className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {loginMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-[#0d1729] border border-white/10 shadow-2xl py-1 z-50"
                  >
                    <div className="px-3 py-2 border-b border-white/10">
                      <div className="text-[10px] font-semibold tracking-[0.15em] text-white/40 uppercase">Admin Access</div>
                    </div>
                    <Link
                      href="/admin/login"
                      onClick={() => setLoginMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:text-primary hover:bg-white/5 transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      Admin Login
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setLoginMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:text-primary hover:bg-white/5 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <button className="xl:hidden text-white p-2" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[#0b1220] flex flex-col"
          >
            <div className="p-4 flex justify-end border-b border-white/10">
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white">
                <X className="w-7 h-7" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 space-y-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xl font-serif tracking-widest ${location === link.href ? "text-primary" : "text-white/90"}`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-6 text-sm font-medium tracking-[0.15em] border border-primary text-primary px-10 py-3"
              >
                BOOK NOW
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors tracking-widest uppercase"
              >
                <LogIn className="w-3.5 h-3.5" /> Admin Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PAGE CONTENT ── */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#080f1b] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 — Brand */}
          <div>
            <img src={logoGold} alt="The Bialto" className="h-14 object-contain mb-4" />
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              A luxury homestay in Kasauli offering premium rooms, scenic views, and warm hospitality. Your perfect mountain escape.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-primary hover:text-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-[0.15em] text-white mb-5 uppercase">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-primary text-sm transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h4 className="text-sm font-semibold tracking-[0.15em] text-white mb-5 uppercase">Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex gap-2.5">
                <span className="text-primary mt-0.5">📍</span>
                <span>Dochi Road, Kasauli,<br />Himachal Pradesh, India</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:+917117602625" className="hover:text-primary transition-colors">+91 71176 02625</a>
              </li>
              <li className="flex gap-2.5 items-center">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:TheBialto@gmail.com" className="hover:text-primary transition-colors">TheBialto@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div>
            <h4 className="text-sm font-semibold tracking-[0.15em] text-white mb-2 uppercase">Newsletter</h4>
            <p className="text-white/60 text-sm mb-4">Subscribe for offers and updates</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 text-white text-sm px-3 py-2.5 placeholder:text-white/30 focus:outline-none focus:border-primary min-w-0"
              />
              <button type="submit" className="bg-primary px-3 py-2.5 flex items-center justify-center hover:bg-primary/80 transition-colors flex-shrink-0">
                <Send className="w-4 h-4 text-[#0b1220]" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
          © 2024 The Bialto By Asemont Estate. All Rights Reserved. &nbsp;·&nbsp; Designed with ♥ for memorable stays
        </div>
      </footer>

      {/* ── FLOATING CONTACT TABS (right edge) ── */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 hidden md:flex">
        <a
          href="https://wa.me/917117602625"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-[#25d366] text-white text-xs font-semibold tracking-wide pl-3 pr-4 py-2.5 rounded-l-full shadow-lg hover:pl-4 transition-all duration-200"
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          WhatsApp
        </a>
        <Link
          href="/contact"
          className="flex items-center gap-2 bg-[#c47c2b] text-white text-xs font-semibold tracking-wide pl-3 pr-4 py-2.5 rounded-l-full shadow-lg hover:pl-4 transition-all duration-200"
        >
          <Mail className="w-4 h-4 flex-shrink-0" />
          Enquiry
        </Link>
        <a
          href="tel:+917117602625"
          className="flex items-center gap-2 bg-primary text-[#0b1220] text-xs font-semibold tracking-wide pl-3 pr-4 py-2.5 rounded-l-full shadow-lg hover:pl-4 transition-all duration-200"
        >
          <Phone className="w-4 h-4 flex-shrink-0" />
          Call Now
        </a>
      </div>
    </div>
  );
}
