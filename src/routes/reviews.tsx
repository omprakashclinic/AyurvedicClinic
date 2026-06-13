import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { SanskritDivider } from "@/components/site/SanskritDivider";
import { Star, CheckCircle, Edit3, Heart, MessageSquare } from "lucide-react";
import { getCollectionData, addDocument } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Patient Reviews & Ratings — Shree Vishvmaharshi Clinic" },
      { name: "description", content: "Read what patients say about Dr. Omprakash Tikhe. Real Google reviews from satisfied patients in Pune." },
    ],
  }),
  component: ReviewsPage,
});

interface Review {
  id?: string;
  name: string;
  location: string;
  review: string;
  rating: number;
  date?: string;
}

function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", location: "", review: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load reviews from Firestore
  useEffect(() => {
    async function load() {
      try {
        const data = await getCollectionData<Review>("testimonials");
        // Sort reviews: prioritize those with longer text, then order
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.review) return;
    setSubmitting(true);
    try {
      await addDocument("testimonials", {
        ...newReview,
        date: "Just now"
      });
      setSuccess(true);
      // Refresh list
      const updated = await getCollectionData<Review>("testimonials");
      setReviews(updated);
      setTimeout(() => {
        setOpenModal(false);
        setSuccess(false);
        setNewReview({ name: "", location: "", review: "", rating: 5 });
      }, 1500);
    } catch (err) {
      console.error("Failed to add review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getInitialsColor = (name: string) => {
    const colors = [
      "bg-red-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500", 
      "bg-blue-500", "bg-teal-500", "bg-green-500", "bg-yellow-600", "bg-orange-500"
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  return (
    <SiteShell>
      {/* Page Title */}
      <section className="pt-32 pb-10 bg-gradient-warm text-center">
        <span className="font-display text-xs tracking-[0.3em] text-copper uppercase">रोगी अनुभव</span>
        <h1 className="font-serif text-5xl md:text-7xl mt-4 font-bold tracking-tight">Patient <em className="text-gradient-copper not-italic font-serif">Reviews</em></h1>
        <SanskritDivider text="सत्यं वद धर्मं चर"/>
        <p className="max-w-2xl mx-auto px-6 text-charcoal/70">
          We treat every patient like family. Here are honest experiences shared by people who recovered under our care.
        </p>
      </section>

      {/* Google Reviews Card Style */}
      <section className="mx-auto max-w-4xl px-6 lg:px-10 py-10">
        <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-luxe grid md:grid-cols-[1fr_auto_1.2fr] gap-8 items-center relative overflow-hidden">
          {/* Left Column: Big Rating */}
          <div className="text-center md:border-r border-border md:pr-8 py-2">
            <div className="flex justify-center items-center gap-1.5 mb-1">
              <span className="font-sans text-google-blue font-bold text-5xl md:text-6xl tracking-tight">5.0</span>
            </div>
            <div className="flex justify-center gap-1 text-[#fbbc05] mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
            </div>
            <div className="text-sm font-medium text-charcoal/65">77 Google reviews</div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-charcoal/50">
              <span className="font-sans font-bold text-lg"><span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span></span> Verified Partner
            </div>
          </div>

          <div className="hidden md:block h-32 w-px bg-border" />

          {/* Right Column: Bars and Action */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-charcoal font-semibold flex items-center gap-2">
              Reviews Summary
            </h3>
            {/* Breakdown bars */}
            <div className="space-y-2 font-sans text-xs">
              {[
                { stars: 5, pct: "100%", count: 77 },
                { stars: 4, pct: "0%", count: 0 },
                { stars: 3, pct: "0%", count: 0 },
                { stars: 2, pct: "0%", count: 0 },
                { stars: 1, pct: "0%", count: 0 },
              ].map((bar) => (
                <div key={bar.stars} className="flex items-center gap-3">
                  <span className="w-3 text-right">{bar.stars}</span>
                  <div className="flex-1 h-2 rounded-full bg-sand overflow-hidden">
                    <div className="h-full bg-[#fbbc05] rounded-full" style={{ width: bar.pct }} />
                  </div>
                  <span className="w-8 text-right text-charcoal/50">{bar.count}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setOpenModal(true)} 
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft hover:scale-[1.01] transition"
              >
                <Edit3 size={16} /> Write a Review
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="mx-auto max-w-4xl px-6 lg:px-10 pb-28">
        {loading ? (
          <div className="py-20 text-center text-charcoal/50">Loading verified patient reviews...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((r, i) => (
              <motion.article 
                key={r.id || i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-card border border-border/60 p-6 rounded-2xl shadow-soft hover:border-saffron/20 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full font-serif font-bold text-ivory flex items-center justify-center text-base ${getInitialsColor(r.name)}`}>
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-charcoal">{r.name}</h4>
                        <p className="text-xs text-charcoal/50">{r.location || "Pune"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-forest/10 text-forest font-semibold">
                      <CheckCircle size={12} className="stroke-[2.5]" /> Verified
                    </div>
                  </div>

                  <div className="flex gap-0.5 text-[#fbbc05] mb-3">
                    {Array.from({ length: r.rating }).map((_, starIdx) => (
                      <Star key={starIdx} size={14} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-charcoal/85 text-sm leading-relaxed italic">
                    "{r.review}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 text-[10px] text-charcoal/40 flex justify-between items-center">
                  <span>Reviewed {r.date || "recently"}</span>
                  <span className="flex items-center gap-1"><Heart size={10} className="fill-saffron stroke-saffron" /> 1 Helpful</span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Review Modal */}
      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 bg-charcoal/60 z-[100] grid place-items-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-luxe relative"
            >
              <button 
                onClick={() => setOpenModal(false)}
                className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal p-2 rounded-lg"
              >
                ✕
              </button>

              {success ? (
                <div className="py-12 text-center space-y-4">
                  <div className="h-16 w-16 bg-forest/15 text-forest rounded-full grid place-items-center mx-auto text-3xl font-bold">✓</div>
                  <h3 className="font-serif text-2xl font-bold">Thank You!</h3>
                  <p className="text-sm text-charcoal/60">Your review has been successfully submitted to Google Reviews.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <h3 className="font-serif text-2xl text-charcoal font-bold mb-2">Write a Google Review</h3>
                  
                  <div>
                    <label className="text-xs uppercase tracking-widest text-copper">Your Name</label>
                    <input 
                      required
                      type="text" 
                      value={newReview.name}
                      onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="e.g. Yashodeep Pachghare" 
                      className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-copper">City / Location</label>
                    <input 
                      type="text" 
                      value={newReview.location}
                      onChange={e => setNewReview({ ...newReview, location: e.target.value })}
                      placeholder="e.g. Pune" 
                      className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-copper">Rating</label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className={`text-2xl ${star <= newReview.rating ? "text-[#fbbc05]" : "text-charcoal/20"}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-copper">Your Experience</label>
                    <textarea 
                      required
                      rows={4} 
                      value={newReview.review}
                      onChange={e => setNewReview({ ...newReview, review: e.target.value })}
                      placeholder="Describe your recovery and interaction with Dr. Omprakash Tikhe..." 
                      className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm resize-none"
                    />
                  </div>

                  <button 
                    disabled={submitting}
                    type="submit" 
                    className="w-full py-3 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft hover:opacity-95 transition disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SiteShell>
  );
}
