import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Clock, ArrowLeft, Facebook, Instagram, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SanskritDivider } from "@/components/site/SanskritDivider";
import { blogPosts } from "@/lib/site-data";
import shirodhara from "@/assets/treatment-shirodhara.jpg";
import herbs from "@/assets/herbs.jpg";
import abhyanga from "@/assets/treatment-abhyanga.jpg";
import clinic from "@/assets/clinic-interior.jpg";

const imageMap: Record<string, string> = { shirodhara, herbs, abhyanga, clinic };

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetail,
  notFoundComponent: () => (
    <SiteShell><div className="py-32 text-center font-devanagari">लेख सापडला नाही.</div></SiteShell>
  ),
});

function BlogDetail() {
  const { slug } = Route.useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) throw notFound();
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const copy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shares = [
    { Icon: Facebook, label: "Facebook", count: "1.2K", href: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { Icon: Instagram, label: "Instagram", count: "843", href: "#" },
    { Icon: () => <span className="text-lg font-bold">𝕏</span>, label: "X", count: "412", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}` },
    { Icon: Linkedin, label: "LinkedIn", count: "256", href: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { Icon: () => <span className="text-lg">📱</span>, label: "WhatsApp", count: "2.4K", href: `https://wa.me/?text=${encodeURIComponent(post.title + " " + url)}` },
  ];

  return (
    <SiteShell>
      <article className="bg-sand/10 min-h-screen pb-24">
        {/* Banner */}
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <img src={imageMap[post.image] || shirodhara} alt="" width={1920} height={1280} className="absolute inset-0 w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-charcoal/30"/>
          <div className="relative h-full mx-auto max-w-4xl px-6 lg:px-10 flex flex-col justify-end pb-16 text-ivory">
            <Link to="/blog" className="inline-flex items-center gap-2 text-ivory/80 hover:text-saffron mb-6 w-fit transition duration-300 transform hover:-translate-x-1">
              <ArrowLeft size={16}/> <span className="font-devanagari font-semibold">सर्व लेख</span>
            </Link>
            <span className="font-devanagari px-3.5 py-1 bg-saffron rounded-full text-xs w-fit font-bold shadow-md">{post.category}</span>
            <h1 className="font-devanagari font-serif text-4xl md:text-5xl lg:text-6xl mt-4 leading-tight max-w-3xl font-bold">{post.title}</h1>
            <div className="mt-6 flex items-center gap-5 text-xs md:text-sm text-ivory/80 font-devanagari">
              <span className="font-semibold">{post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14}/> {post.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={14}/> {post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="mx-auto max-w-3xl px-6 lg:px-10 py-16">
          <div className="font-devanagari text-lg leading-[1.95] text-charcoal/85 space-y-8">
            {post.content ? (
              post.content.map((block, idx) => {
                if (block.type === "paragraph") {
                  if (idx === 0) {
                    return (
                      <p key={idx} className="text-xl md:text-2xl text-charcoal/90 font-serif leading-[1.8] first-letter:text-7xl first-letter:font-serif first-letter:text-saffron first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                        {block.text}
                      </p>
                    );
                  }
                  return (
                    <p key={idx} className="whitespace-pre-line">
                      {block.text}
                    </p>
                  );
                }
                if (block.type === "heading") {
                  return (
                    <h2 key={idx} className="font-serif text-2xl md:text-3xl text-charcoal font-bold mt-12 mb-4">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "blockquote") {
                  return (
                    <blockquote key={idx} className="border-l-4 border-saffron pl-6 italic text-lg md:text-xl text-charcoal/80 my-8 bg-sand/20 py-4 pr-4 rounded-r-2xl">
                      {block.text}
                    </blockquote>
                  );
                }
                return null;
              })
            ) : (
              // Fallback
              <>
                <p className="text-2xl text-charcoal first-letter:text-6xl first-letter:font-serif first-letter:text-saffron first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                  {post.excerpt}
                </p>
                <p>आयुर्वेद हा केवळ एक उपचार पद्धत नसून संपूर्ण जीवनशैली आहे. हजारो वर्षांपासून भारतीय ऋषीमुनींनी या ज्ञानाचा अभ्यास करून ते आपल्यापर्यंत पोहोचवले आहे.</p>
              </>
            )}
          </div>

          <SanskritDivider text="सर्वे भवन्तु सुखिनः"/>

          {/* Social shares */}
          <div className="mt-12 bg-card border border-border rounded-2xl p-6 shadow-luxe">
            <div className="text-xs uppercase tracking-widest text-copper font-bold mb-4 font-serif">Share this wisdom</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {shares.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener" className="group flex flex-col items-center gap-1 p-4 rounded-xl border border-border hover:border-saffron hover:bg-sand transition">
                  <s.Icon size={20} />
                  <span className="text-xs font-medium">{s.label}</span>
                  <span className="text-[10px] text-charcoal/50">{s.count}</span>
                </a>
              ))}
              <button onClick={copy} className="flex flex-col items-center gap-1 p-4 rounded-xl border border-border hover:border-saffron hover:bg-sand transition">
                {copied ? <Check size={20} className="text-forest"/> : <Link2 size={20}/>}
                <span className="text-xs font-medium">{copied ? "Copied" : "Copy"}</span>
                <span className="text-[10px] text-charcoal/50">link</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
