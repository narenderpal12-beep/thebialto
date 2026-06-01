import { useState } from "react";
import { useLocation } from "wouter";
import { useGetRooms, useCreateBooking } from "@workspace/api-client-react";
import { storageUrl } from "@/components/ui/image-upload";
import { IndianRupee, CalendarDays, Users, BedDouble, CheckCircle2 } from "lucide-react";
import { PageBanner } from "./About";
import { useToast } from "@/hooks/use-toast";

function getParam(search: string, key: string) {
  const p = new URLSearchParams(search.replace(/^[^?]*/, ""));
  return p.get(key) ?? "";
}

export default function Book() {
  const [location] = useLocation();
  const { data: rooms = [] } = useGetRooms({ published: true, available: true });
  const createBooking = useCreateBooking();
  const { toast } = useToast();

  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    roomId: getParam(location, "roomId") ? Number(getParam(location, "roomId")) : 0,
    roomType: "",
    checkIn: getParam(location, "checkIn") || "",
    checkOut: getParam(location, "checkOut") || "",
    guests: Number(getParam(location, "guests")) || 2,
    specialRequests: "",
  });
  const [done, setDone] = useState(false);

  const selectedRoom = (rooms as any[]).find((r) => r.id === form.roomId);

  const nights = (() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const d = (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000;
    return Math.max(0, Math.round(d));
  })();
  const total = selectedRoom ? selectedRoom.pricePerNight * nights : 0;

  const set = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.roomId || !form.checkIn || !form.checkOut || !form.guestName || !form.guestEmail || !form.guestPhone) {
      toast({ title: "Please fill all required fields." });
      return;
    }
    const roomType = selectedRoom?.roomType || form.roomType || "Standard";
    createBooking.mutate(
      {
        data: {
          ...form,
          roomType,
          totalAmount: total || 0,
          status: "pending",
        },
      },
      {
        onSuccess: () => {
          setDone(true);
          toast({ title: "Booking confirmed!", description: "We'll reach out shortly to confirm your reservation." });
        },
        onError: () => toast({ title: "Something went wrong. Please try again." }),
      }
    );
  };

  if (done) {
    return (
      <div className="pt-[70px] min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6 py-16">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-5" />
          <h2 className="text-3xl font-serif text-[#1a2332] mb-3">Booking Received!</h2>
          <p className="text-[#4a5568] text-sm leading-relaxed mb-6">
            Thank you, <strong>{form.guestName}</strong>! Your booking request for{" "}
            <strong>{selectedRoom?.name ?? "your chosen room"}</strong> has been received. Our team will contact you at{" "}
            <strong>{form.guestEmail}</strong> to confirm your reservation.
          </p>
          <a href="/" className="inline-block bg-[#1a2332] text-white text-xs font-bold tracking-[0.15em] uppercase px-8 py-4 hover:bg-[#1a2332]/80 transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-[70px]">
      <PageBanner title="Book Your Stay" crumb="Book" />

      <section className="bg-[#f5f0e8] py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-5">
            <h2 className="text-2xl font-serif text-[#1a2332] mb-2">Your Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold tracking-[0.15em] text-[#4a5568] uppercase block mb-1.5">Full Name *</label>
                <input required value={form.guestName} onChange={(e) => set("guestName", e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] bg-white focus:outline-none focus:border-primary"
                  placeholder="Your full name" />
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-[0.15em] text-[#4a5568] uppercase block mb-1.5">Email *</label>
                <input required type="email" value={form.guestEmail} onChange={(e) => set("guestEmail", e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] bg-white focus:outline-none focus:border-primary"
                  placeholder="your@email.com" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold tracking-[0.15em] text-[#4a5568] uppercase block mb-1.5">Phone *</label>
              <input required value={form.guestPhone} onChange={(e) => set("guestPhone", e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] bg-white focus:outline-none focus:border-primary"
                placeholder="+91 00000 00000" />
            </div>

            <div>
              <label className="text-[10px] font-semibold tracking-[0.15em] text-[#4a5568] uppercase block mb-1.5">Select Room *</label>
              <select required value={form.roomId} onChange={(e) => set("roomId", Number(e.target.value))}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] bg-white focus:outline-none focus:border-primary">
                <option value={0}>— Choose a Room —</option>
                {(rooms as any[]).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.roomType}) — ₹{r.pricePerNight.toLocaleString("en-IN")}/night
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-semibold tracking-[0.15em] text-[#4a5568] uppercase block mb-1.5">Check-in *</label>
                <input required type="date" value={form.checkIn} onChange={(e) => set("checkIn", e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] bg-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-[0.15em] text-[#4a5568] uppercase block mb-1.5">Check-out *</label>
                <input required type="date" value={form.checkOut} onChange={(e) => set("checkOut", e.target.value)}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] bg-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-[0.15em] text-[#4a5568] uppercase block mb-1.5">Guests</label>
                <select value={form.guests} onChange={(e) => set("guests", Number(e.target.value))}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] bg-white focus:outline-none focus:border-primary">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guest{n>1?"s":""}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold tracking-[0.15em] text-[#4a5568] uppercase block mb-1.5">Special Requests</label>
              <textarea rows={3} value={form.specialRequests} onChange={(e) => set("specialRequests", e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] bg-white focus:outline-none focus:border-primary resize-none"
                placeholder="Any dietary needs, early check-in, etc." />
            </div>

            <button type="submit" disabled={createBooking.isPending}
              className="w-full bg-primary text-[#060d1a] text-xs font-bold tracking-[0.15em] uppercase py-4 hover:bg-primary/90 transition-colors disabled:opacity-60">
              {createBooking.isPending ? "Submitting..." : "Confirm Booking Request"}
            </button>
          </form>

          {/* Summary card */}
          <div>
            <div className="bg-white border border-gray-100 shadow-sm p-6 sticky top-24">
              <h3 className="font-serif text-[#1a2332] text-lg mb-4 pb-3 border-b border-gray-100">Booking Summary</h3>
              {selectedRoom ? (
                <>
                  {selectedRoom.featureImageUrl && (
                    <img src={storageUrl(selectedRoom.featureImageUrl)} alt={selectedRoom.name} className="w-full h-32 object-cover mb-4" />
                  )}
                  <div className="font-serif text-[#1a2332] text-base mb-1">{selectedRoom.name}</div>
                  <div className="text-[#4a5568] text-xs mb-4">{selectedRoom.roomType}</div>
                  <div className="space-y-2 text-xs text-[#4a5568]">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> Check-in</span>
                      <span className="font-medium text-[#1a2332]">{form.checkIn || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> Check-out</span>
                      <span className="font-medium text-[#1a2332]">{form.checkOut || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Guests</span>
                      <span className="font-medium text-[#1a2332]">{form.guests}</span>
                    </div>
                    {nights > 0 && (
                      <div className="flex justify-between pt-2 border-t border-gray-100">
                        <span>₹{selectedRoom.pricePerNight.toLocaleString("en-IN")} × {nights} night{nights>1?"s":""}</span>
                        <span className="font-semibold text-[#1a2332]">₹{total.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center text-[#4a5568] text-xs py-4">
                  <BedDouble className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  Select a room to see pricing
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
