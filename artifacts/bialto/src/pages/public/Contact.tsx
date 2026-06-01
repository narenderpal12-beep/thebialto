import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { PageBanner } from "./About";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
  };

  return (
    <div className="flex flex-col pt-[70px]">
      <PageBanner title="Contact Us" crumb="Contact" />

      <section className="bg-[#f5f0e8] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-5 gap-12">
          {/* Info */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-px w-8 bg-primary/50" />
                <span className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Get In Touch</span>
              </div>
              <h2 className="text-3xl font-serif text-[#1a2332] mb-4">We'd Love to Hear From You</h2>
              <p className="text-[#4a5568] text-sm leading-relaxed">
                Whether you're planning a visit, have a special request, or just want to learn more about The Bialto — we're here to help.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { icon: MapPin, label: "Address", value: "Dochi Road, Kasauli, Himachal Pradesh 173204" },
                { icon: Phone, label: "Phone / WhatsApp", value: "+91 71176 02625" },
                { icon: Mail, label: "Email", value: "TheBialto@gmail.com" },
                { icon: Clock, label: "Office Hours", value: "9:00 AM – 8:00 PM (All Days)" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase mb-0.5">{label}</div>
                    <div className="text-[#4a5568] text-sm">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/917117602625"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25d366] text-white text-xs font-bold tracking-[0.12em] uppercase px-6 py-3.5 hover:bg-[#1fba58] transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>

          {/* Form */}
          <div className="md:col-span-3 bg-white p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-serif text-[#1a2332] mb-6">Send Us a Message</h3>
            {sent ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">✉️</div>
                <h4 className="font-serif text-[#1a2332] text-xl mb-2">Message Sent!</h4>
                <p className="text-[#4a5568] text-sm">Thank you for reaching out. We'll respond within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-4 text-primary text-sm hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold tracking-[0.15em] text-[#4a5568] uppercase block mb-1.5">Full Name *</label>
                    <input required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] focus:outline-none focus:border-primary bg-white"
                      placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold tracking-[0.15em] text-[#4a5568] uppercase block mb-1.5">Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] focus:outline-none focus:border-primary bg-white"
                      placeholder="your@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold tracking-[0.15em] text-[#4a5568] uppercase block mb-1.5">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] focus:outline-none focus:border-primary bg-white"
                      placeholder="+91 00000 00000" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold tracking-[0.15em] text-[#4a5568] uppercase block mb-1.5">Subject</label>
                    <select value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] focus:outline-none focus:border-primary bg-white">
                      <option value="">Select…</option>
                      <option>Booking Enquiry</option>
                      <option>Room Information</option>
                      <option>Event / Group Booking</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold tracking-[0.15em] text-[#4a5568] uppercase block mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] focus:outline-none focus:border-primary resize-none bg-white"
                    placeholder="Tell us how we can help..." />
                </div>
                <button type="submit" className="w-full bg-[#1a2332] text-white text-xs font-bold tracking-[0.15em] uppercase py-4 hover:bg-[#1a2332]/80 transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map */}
      <div className="h-72 md:h-80 w-full">
        <iframe
          src="https://maps.google.com/maps?q=Kasauli,Himachal+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
          width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="The Bialto Location"
        />
      </div>
    </div>
  );
}
