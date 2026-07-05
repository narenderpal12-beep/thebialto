import { useState } from "react";
import { useLocation } from "wouter";
import { useGetRooms, useGetFloors, useCreateBooking } from "@workspace/api-client-react";
import {  imageUrl } from "@/components/ui/image-upload";
import { IndianRupee, CalendarDays, Users, BedDouble, CheckCircle2, Layers, AlertTriangle, ChevronDown, UtensilsCrossed, Tag, X } from "lucide-react";
import { PageBanner } from "./About";
import { useToast } from "@/hooks/use-toast";

function getParam(search: string, key: string) {
  const p = new URLSearchParams(search.replace(/^[^?]*/, ""));
  return p.get(key) ?? "";
}

type BookMode = "room" | "floor";

interface CouponData {
  code: string;
  discountType: string;
  discountValue: number;
}

export default function Book() {
  const [location] = useLocation();
  const { data: rooms = [] } = useGetRooms({ published: true, available: true });
  const { data: floors = [] } = useGetFloors();
  const createBooking = useCreateBooking();
  const { toast } = useToast();

  const presetFloorId = getParam(location, "floorId") ? Number(getParam(location, "floorId")) : 0;
  const presetRoomId = getParam(location, "roomId") ? Number(getParam(location, "roomId")) : 0;

  const [mode, setMode] = useState<BookMode>(presetFloorId ? "floor" : "room");

  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    roomId: presetRoomId,
    floorId: presetFloorId,
    roomType: "",
    checkIn: getParam(location, "checkIn") || "",
    checkOut: getParam(location, "checkOut") || "",
    adults: 2,
    children: 0,
    specialRequests: "",
  });

  const [couponInput, setCouponInput] = useState("");
  const [couponData, setCouponData] = useState<CouponData | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const selectedRoom = (rooms as any[]).find((r) => r.id === form.roomId);
  const selectedFloor = (floors as any[]).find((f) => f.id === form.floorId);

  const maxAdults = mode === "room" ? (selectedRoom?.adultCapacity ?? 0) : 0;
  const maxChildren = mode === "room" ? (selectedRoom?.childCapacity ?? 0) : 0;
  const totalGuests = form.adults + form.children;

  const adultError = maxAdults > 0 && form.adults > maxAdults
    ? `Maximum ${maxAdults} adult${maxAdults !== 1 ? "s" : ""} for this room`
    : null;
  const childError = maxChildren !== null && form.children > (maxChildren ?? 99)
    ? `Maximum ${maxChildren} children for this room`
    : null;

  const nights = (() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const d = (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000;
    return Math.max(0, Math.round(d));
  })();

  const basePrice = mode === "room"
    ? (selectedRoom ? selectedRoom.pricePerNight * nights : 0)
    : mode === "floor" && selectedFloor
      ? ((selectedFloor.rooms as any[] ?? []).reduce((sum: number, r: any) => sum + (r.pricePerNight ?? 0), 0)) * nights
      : 0;

  const discountAmount = couponData
    ? couponData.discountType === "percentage"
      ? Math.round(basePrice * couponData.discountValue / 100)
      : couponData.discountValue
    : 0;

  const totalPrice = Math.max(0, basePrice - discountAmount);

  const today = new Date().toISOString().split("T")[0];

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch(`/api/coupons/validate/${encodeURIComponent(couponInput.trim().toUpperCase())}`);
      if (res.ok) {
        const data = await res.json();
        setCouponData(data);
        setCouponError(null);
        toast({ title: `Coupon "${data.code}" applied!`, description: `${data.discountType === "percentage" ? `${data.discountValue}% off` : `₹${data.discountValue} off`}` });
      } else {
        const err = await res.json();
        setCouponError(err.error || "Invalid coupon code");
        setCouponData(null);
      }
    } catch {
      setCouponError("Could not validate coupon. Please try again.");
      setCouponData(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponData(null);
    setCouponInput("");
    setCouponError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "room" && !form.roomId) {
      toast({ title: "Please select a room." }); return;
    }
    if (mode === "floor" && !form.floorId) {
      toast({ title: "Please select a floor." }); return;
    }
    if (!form.checkIn || !form.checkOut) {
      toast({ title: "Please select check-in and check-out dates." }); return;
    }
    if (new Date(form.checkOut) <= new Date(form.checkIn)) {
      toast({ title: "Check-out must be after check-in." }); return;
    }
    if (!form.guestName || !form.guestEmail || !form.guestPhone) {
      toast({ title: "Please fill all required fields." }); return;
    }
    if (adultError) { toast({ title: adultError }); return; }
    if (childError) { toast({ title: childError }); return; }

    const roomType = mode === "room"
      ? (selectedRoom?.roomType || "Standard")
      : `Full Floor — ${selectedFloor?.name ?? ""}`;

    const roomId = mode === "room"
      ? form.roomId
      : (selectedFloor?.rooms?.[0]?.id ?? 0);

    createBooking.mutate(
      {
        data: {
          guestName: form.guestName,
          guestEmail: form.guestEmail,
          guestPhone: form.guestPhone,
          roomId,
          roomType,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          adults: form.adults,
          children: form.children,
          guests: totalGuests,
          specialRequests: form.specialRequests,
          couponCode: couponData?.code ?? null,
          discountAmount,
          totalAmount: basePrice,
          status: "pending",
        },
      },
      {
        onSuccess: () => {
          setDone(true);
          toast({ title: "Booking received!", description: "We'll confirm your reservation shortly." });
        },
        onError: () => toast({ title: "Something went wrong. Please try again." }),
      }
    );
  };

  if (done) {
    const label = mode === "room" ? (selectedRoom?.name ?? "your room") : (selectedFloor?.name ?? "the floor");
    return (
      <div className="pt-[70px] min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6 py-16">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-5" />
          <h2 className="text-3xl font-serif text-[#1a2332] mb-3">Booking Received!</h2>
          <p className="text-[#4a5568] text-sm leading-relaxed mb-6">
            Thank you, <strong>{form.guestName}</strong>! Your booking request for <strong>{label}</strong> ({nights} night{nights !== 1 ? "s" : ""}, {totalGuests} guest{totalGuests !== 1 ? "s" : ""}) has been received. We'll reach out at <strong>{form.guestEmail}</strong> to confirm.
          </p>
          {couponData && discountAmount > 0 && (
            <div className="mb-5 bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700">
              Coupon <strong>{couponData.code}</strong> saved you <strong>₹{discountAmount.toLocaleString("en-IN")}</strong>!
            </div>
          )}
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

      <section className="bg-[#f5f0e8] py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Mode toggle */}
          <div className="flex gap-0 mb-10 border border-[#1a2332]/20 w-fit overflow-hidden">
            <button
              type="button"
              onClick={() => { setMode("room"); set("floorId", 0); }}
              className={`flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase px-6 py-3 transition-colors ${mode === "room" ? "bg-[#1a2332] text-white" : "text-[#4a5568] hover:text-[#1a2332]"}`}
            >
              <BedDouble className="w-4 h-4" /> Book a Room
            </button>
            <button
              type="button"
              onClick={() => { setMode("floor"); set("roomId", 0); }}
              className={`flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase px-6 py-3 transition-colors ${mode === "floor" ? "bg-[#1a2332] text-white" : "text-[#4a5568] hover:text-[#1a2332]"}`}
            >
              <Layers className="w-4 h-4" /> Book Entire Floor
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
              <h2 className="text-2xl font-serif text-[#1a2332] mb-1">Your Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input required value={form.guestName} onChange={(e) => set("guestName", e.target.value)}
                    className="field" placeholder="Your full name" />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input required type="email" value={form.guestEmail} onChange={(e) => set("guestEmail", e.target.value)}
                    className="field" placeholder="your@email.com" />
                </div>
              </div>

              <div>
                <label className="label">Phone *</label>
                <input required value={form.guestPhone} onChange={(e) => set("guestPhone", e.target.value)}
                  className="field" placeholder="+91 00000 00000" />
              </div>

              {/* Room or Floor picker */}
              {mode === "room" ? (
                <div>
                  <label className="label">Select Room *</label>
                  <div className="relative">
                    <select
                      required
                      value={form.roomId}
                      onChange={(e) => set("roomId", Number(e.target.value))}
                      className="field appearance-none pr-8"
                    >
                      <option value={0}>— Choose a Room —</option>
                      {(rooms as any[]).map((r: any) => (
                        <option key={r.id} value={r.id}>
                          {r.name} · {r.roomType} · ₹{r.pricePerNight.toLocaleString("en-IN")}/night · {r.adultCapacity} adults{r.childCapacity > 0 ? ` + ${r.childCapacity} children` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5568] pointer-events-none" />
                  </div>
                  {selectedRoom && (
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#4a5568]">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-primary" /> {selectedRoom.adultCapacity} adult{selectedRoom.adultCapacity !== 1 ? "s" : ""}</span>
                      {selectedRoom.childCapacity > 0 && (
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-primary" /> {selectedRoom.childCapacity} children</span>
                      )}
                      <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5 text-primary" /> ₹{selectedRoom.pricePerNight.toLocaleString("en-IN")}/night</span>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="label">Select Floor *</label>
                  <div className="relative">
                    <select
                      required
                      value={form.floorId}
                      onChange={(e) => set("floorId", Number(e.target.value))}
                      className="field appearance-none pr-8"
                    >
                      <option value={0}>— Choose a Floor —</option>
                      {(floors as any[]).filter((f: any) => f.isAvailable !== false).map((f: any) => {
                        const floorRooms: any[] = f.rooms ?? [];
                        const totalCap = floorRooms.reduce((s: number, r: any) => s + (r.adultCapacity ?? 2), 0);
                        const totalFloorPrice = floorRooms.reduce((s: number, r: any) => s + (r.pricePerNight ?? 0), 0);
                        return (
                          <option key={f.id} value={f.id}>
                            Floor {f.floorNumber} — {f.name} · {floorRooms.length} room{floorRooms.length !== 1 ? "s" : ""} · ₹{totalFloorPrice.toLocaleString("en-IN")}/night · Up to {totalCap} adults
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5568] pointer-events-none" />
                  </div>
                  {selectedFloor && (
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#4a5568]">
                      <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 text-primary" /> {(selectedFloor.rooms as any[] ?? []).length} rooms</span>
                      {selectedFloor.hasKitchen && <span className="flex items-center gap-1"><UtensilsCrossed className="w-3.5 h-3.5 text-primary" /> Kitchen included</span>}
                    </div>
                  )}
                </div>
              )}

              {/* Dates row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Check-in *</label>
                  <input required type="date" min={today} value={form.checkIn}
                    onChange={(e) => set("checkIn", e.target.value)} className="field" />
                </div>
                <div>
                  <label className="label">Check-out *</label>
                  <input required type="date" min={form.checkIn || today} value={form.checkOut}
                    onChange={(e) => set("checkOut", e.target.value)} className="field" />
                </div>
              </div>

              {/* Guests row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Adults *</label>
                  <div className="relative">
                    <select
                      value={form.adults}
                      onChange={(e) => set("adults", Number(e.target.value))}
                      className={`field appearance-none pr-8 ${adultError ? "border-red-400 bg-red-50" : ""}`}
                    >
                      {[1,2,3,4,5,6,7,8,10,12,15,20].map(n => (
                        <option key={n} value={n}>{n} Adult{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5568] pointer-events-none" />
                  </div>
                  {adultError && <p className="text-red-500 text-[11px] mt-1">{adultError}</p>}
                </div>
                <div>
                  <label className="label">Children <span className="text-[10px] text-[#9ca3af] font-normal normal-case">(under 12)</span></label>
                  <div className="relative">
                    <select
                      value={form.children}
                      onChange={(e) => set("children", Number(e.target.value))}
                      className={`field appearance-none pr-8 ${childError ? "border-red-400 bg-red-50" : ""}`}
                    >
                      {[0,1,2,3,4,5,6,8,10].map(n => (
                        <option key={n} value={n}>{n === 0 ? "No children" : `${n} Child${n > 1 ? "ren" : ""}`}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5568] pointer-events-none" />
                  </div>
                  {childError && <p className="text-red-500 text-[11px] mt-1">{childError}</p>}
                </div>
              </div>

              {/* Capacity warning */}
              {mode === "room" && selectedRoom && !adultError && !childError && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-2.5 rounded">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  {form.adults} adult{form.adults !== 1 ? "s" : ""}
                  {form.children > 0 ? ` + ${form.children} child${form.children !== 1 ? "ren" : ""}` : ""}
                  {" "}fits within the room capacity.
                </div>
              )}
              {(adultError || childError) && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{adultError || childError}</span>
                </div>
              )}

              {/* Coupon code */}
              <div>
                <label className="label">Coupon Code <span className="text-[10px] text-[#9ca3af] font-normal normal-case">(optional)</span></label>
                {couponData ? (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-300 px-3 py-2.5 rounded">
                    <Tag className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-green-800 text-sm">{couponData.code}</span>
                      <span className="text-green-700 text-xs ml-2">
                        {couponData.discountType === "percentage" ? `${couponData.discountValue}% off` : `₹${couponData.discountValue} off`}
                        {basePrice > 0 && ` = −₹${discountAmount.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                    <button type="button" onClick={removeCoupon} className="text-green-600 hover:text-red-500 transition-colors flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(null); }}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
                      className={`field flex-1 uppercase tracking-widest ${couponError ? "border-red-400" : ""}`}
                      placeholder="ENTER CODE"
                      maxLength={30}
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="bg-[#1a2332] text-white text-xs font-bold tracking-[0.1em] uppercase px-5 py-2 hover:bg-[#1a2332]/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {couponLoading ? "…" : "Apply"}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
              </div>

              {/* Special requests */}
              <div>
                <label className="label">Special Requests</label>
                <textarea rows={3} value={form.specialRequests} onChange={(e) => set("specialRequests", e.target.value)}
                  className="field resize-none"
                  placeholder="Early check-in, dietary needs, celebration setup, etc." />
              </div>

              <button
                type="submit"
                disabled={createBooking.isPending || !!adultError || !!childError}
                className="w-full bg-primary text-[#060d1a] text-xs font-bold tracking-[0.15em] uppercase py-4 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createBooking.isPending ? "Submitting…" : "Confirm Booking Request"}
              </button>

              <p className="text-[#6b7280] text-xs text-center">
                This is a booking request. Our team will contact you within a few hours to confirm and share payment details.
              </p>
            </form>

            {/* ── Summary card ── */}
            <div>
              <div className="bg-white border border-gray-100 shadow-sm p-6 sticky top-24">
                <h3 className="font-serif text-[#1a2332] text-lg mb-4 pb-3 border-b border-gray-100">Booking Summary</h3>

                {mode === "room" && selectedRoom ? (
                  <>
                    {selectedRoom.featureImageUrl && (
                      <img src={ imageUrl(selectedRoom.featureImageUrl)} alt={selectedRoom.name} className="w-full h-28 object-cover mb-3" />
                    )}
                    <div className="font-serif text-[#1a2332] text-base mb-0.5">{selectedRoom.name}</div>
                    <div className="text-[#4a5568] text-xs mb-1">{selectedRoom.roomType}</div>
                    <div className="text-xs text-[#4a5568] mb-4 flex flex-wrap gap-2">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {selectedRoom.adultCapacity} adults</span>
                      {selectedRoom.childCapacity > 0 && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {selectedRoom.childCapacity} children</span>}
                    </div>
                    <SummaryRows form={form} nights={nights} pricePerNight={selectedRoom.pricePerNight} baseTotal={basePrice} discountAmount={discountAmount} couponData={couponData} finalTotal={totalPrice} />
                  </>
                ) : mode === "floor" && selectedFloor ? (
                  <>
                    {selectedFloor.imageUrl && (
                      <img src={ imageUrl(selectedFloor.imageUrl)} alt={selectedFloor.name} className="w-full h-28 object-cover mb-3" />
                    )}
                    <div className="font-serif text-[#1a2332] text-base mb-0.5">{selectedFloor.name}</div>
                    <div className="text-[#4a5568] text-xs mb-1">Floor {selectedFloor.floorNumber} — Entire floor</div>
                    <div className="flex gap-3 text-xs text-[#4a5568] mb-4">
                      <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {(selectedFloor.rooms as any[] ?? []).length} rooms</span>
                    </div>
                    <div className="text-xs text-[#4a5568] mb-3">
                      <span className="font-medium text-[#1a2332]">Rooms included:</span>
                      <ul className="mt-1 space-y-1">
                        {(selectedFloor.rooms as any[] ?? []).map((r: any) => (
                          <li key={r.id} className="flex justify-between">
                            <span>{r.name}</span>
                            <span className="text-primary">₹{r.pricePerNight?.toLocaleString("en-IN")}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <SummaryRows
                      form={form}
                      nights={nights}
                      pricePerNight={(selectedFloor.rooms as any[] ?? []).reduce((s: number, r: any) => s + (r.pricePerNight ?? 0), 0)}
                      baseTotal={basePrice}
                      discountAmount={discountAmount}
                      couponData={couponData}
                      finalTotal={totalPrice}
                      label="All rooms/night"
                    />
                  </>
                ) : (
                  <div className="text-center text-[#4a5568] text-xs py-4">
                    {mode === "room"
                      ? <><BedDouble className="w-8 h-8 mx-auto mb-2 text-gray-300" />Select a room to see pricing</>
                      : <><Layers className="w-8 h-8 mx-auto mb-2 text-gray-300" />Select a floor to see pricing</>
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryRows({
  form, nights, pricePerNight, baseTotal, discountAmount, couponData, finalTotal, label,
}: {
  form: any; nights: number; pricePerNight: number;
  baseTotal: number; discountAmount: number; couponData: CouponData | null;
  finalTotal: number; label?: string;
}) {
  return (
    <div className="space-y-2 text-xs text-[#4a5568] border-t border-gray-100 pt-3">
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
        <span className="font-medium text-[#1a2332]">
          {form.adults} adult{form.adults !== 1 ? "s" : ""}
          {form.children > 0 ? ` + ${form.children} child${form.children !== 1 ? "ren" : ""}` : ""}
        </span>
      </div>
      {nights > 0 && pricePerNight > 0 && (
        <>
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span>₹{pricePerNight.toLocaleString("en-IN")} × {nights} night{nights > 1 ? "s" : ""}</span>
            <span className="font-semibold text-[#1a2332]">₹{baseTotal.toLocaleString("en-IN")}</span>
          </div>
          {label && <div className="text-[10px] text-[#9ca3af] text-right -mt-1">{label}</div>}
          {couponData && discountAmount > 0 && (
            <div className="flex justify-between text-green-700">
              <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {couponData.code}</span>
              <span>−₹{discountAmount.toLocaleString("en-IN")}</span>
            </div>
          )}
          {couponData && discountAmount > 0 && (
            <div className="flex justify-between pt-2 border-t border-gray-100 font-bold text-[#1a2332] text-sm">
              <span>Total</span>
              <span>₹{finalTotal.toLocaleString("en-IN")}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
