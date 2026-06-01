import { useState } from "react";
import { motion } from "framer-motion";
import { useGetReviews, useCreateReview } from "@workspace/api-client-react";
import { Star, Quote } from "lucide-react";
import { PageBanner } from "./About";
import { useToast } from "@/hooks/use-toast";

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
        >
          <Star className={`w-6 h-6 transition-colors ${n <= (hover || value) ? "fill-primary text-primary" : "text-gray-300"}`} />
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { data: reviews = [], isLoading, refetch } = useGetReviews({ approved: true });
  const createReview = useCreateReview();
  const { toast } = useToast();

  const [form, setForm] = useState({ guestName: "", guestLocation: "", reviewText: "", rating: 5 });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guestName || !form.reviewText) {
      toast({ title: "Please fill in your name and review." });
      return;
    }
    createReview.mutate(
      { data: form },
      {
        onSuccess: () => {
          setSubmitted(true);
          setForm({ guestName: "", guestLocation: "", reviewText: "", rating: 5 });
          toast({ title: "Thank you for your review!", description: "It will appear after moderation." });
        },
      }
    );
  };

  const approved = (reviews as any[]).filter((r) => r.isApproved);

  return (
    <div className="flex flex-col pt-[70px]">
      <PageBanner title="Guest Reviews" crumb="Reviews" />

      <section className="bg-[#f5f0e8] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-10 bg-primary/40" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">What Guests Say</span>
              <span className="h-px w-10 bg-primary/40" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2332]">Stories from Our Guests</h2>
          </div>

          {isLoading ? (
            <div className="text-center text-[#4a5568]">Loading reviews...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {approved.map((r: any, i: number) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 shadow-sm border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all"
                >
                  <Quote className="w-8 h-8 text-primary/30 mb-3" />
                  <p className="text-[#4a5568] text-sm leading-relaxed italic mb-5">"{r.reviewText}"</p>
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? "fill-primary text-primary" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <div className="font-semibold text-[#1a2332] text-sm">{r.guestName}</div>
                  {r.guestLocation && <div className="text-[#6b7280] text-xs">{r.guestLocation}</div>}
                  <div className="text-[#9ca3af] text-xs mt-1">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </motion.div>
              ))}
              {approved.length === 0 && (
                <div className="col-span-3 text-center text-[#4a5568] py-8">Be the first to leave a review!</div>
              )}
            </div>
          )}

          {/* Write a review */}
          <div className="max-w-2xl mx-auto bg-white shadow-sm border border-gray-100 p-8">
            <h3 className="text-2xl font-serif text-[#1a2332] mb-6">Share Your Experience</h3>
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🙏</div>
                <h4 className="font-serif text-[#1a2332] text-xl mb-2">Thank You!</h4>
                <p className="text-[#4a5568] text-sm">Your review has been submitted and will appear after moderation.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-primary text-sm hover:underline">Submit another review</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold tracking-wide text-[#1a2332] uppercase block mb-1.5">Your Name *</label>
                    <input
                      value={form.guestName}
                      onChange={(e) => setForm((f) => ({ ...f, guestName: e.target.value }))}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] focus:outline-none focus:border-primary bg-white"
                      placeholder="Ananya Sharma"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-wide text-[#1a2332] uppercase block mb-1.5">Location</label>
                    <input
                      value={form.guestLocation}
                      onChange={(e) => setForm((f) => ({ ...f, guestLocation: e.target.value }))}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] focus:outline-none focus:border-primary bg-white"
                      placeholder="New Delhi"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-wide text-[#1a2332] uppercase block mb-1.5">Your Rating *</label>
                  <StarPicker value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-wide text-[#1a2332] uppercase block mb-1.5">Your Review *</label>
                  <textarea
                    value={form.reviewText}
                    onChange={(e) => setForm((f) => ({ ...f, reviewText: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm text-[#1a2332] focus:outline-none focus:border-primary resize-none bg-white"
                    placeholder="Tell others about your stay..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={createReview.isPending}
                  className="w-full bg-[#1a2332] text-white text-xs font-bold tracking-[0.15em] uppercase py-4 hover:bg-[#1a2332]/80 transition-colors disabled:opacity-60"
                >
                  {createReview.isPending ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
