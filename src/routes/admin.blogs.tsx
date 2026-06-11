import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Bold, Italic, List, Image as ImageIcon, Link2, Heading, X } from "lucide-react";
import { blogPosts } from "@/lib/site-data";

export const Route = createFileRoute("/admin/blogs")({
  component: BlogAdmin,
});

function BlogAdmin() {
  const [editing, setEditing] = useState(false);

  if (editing) return <BlogEditor onClose={() => setEditing(false)}/>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl">Blog Management</h1>
          <p className="text-charcoal/60 mt-1">Create, edit and publish Marathi articles.</p>
        </div>
        <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-saffron text-ivory rounded-full">
          <Plus size={16}/> New Article
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sand/50 text-left">
            <tr>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {blogPosts.map((p) => (
              <tr key={p.slug} className="hover:bg-sand/30">
                <td className="px-6 py-4 font-devanagari font-medium">{p.title}</td>
                <td className="px-6 py-4 font-devanagari text-charcoal/70">{p.category}</td>
                <td className="px-6 py-4 font-devanagari text-charcoal/70">{p.date}</td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-forest/10 text-forest">Published</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-sand rounded-lg"><Eye size={14}/></button>
                    <button onClick={() => setEditing(true)} className="p-2 hover:bg-sand rounded-lg"><Edit size={14}/></button>
                    <button className="p-2 hover:bg-sand rounded-lg text-destructive"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BlogEditor({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">New Article</h1>
        <button onClick={onClose} className="p-2 hover:bg-sand rounded-lg"><X/></button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <input placeholder="लेखाचे शीर्षक..." className="w-full px-5 py-4 text-2xl font-devanagari font-serif bg-card border border-border rounded-xl focus:outline-none focus:border-saffron"/>
          <input placeholder="URL slug (e.g. panchakarma-process)" className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron"/>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-sand/30">
              {[Heading, Bold, Italic, List, Link2, ImageIcon].map((Icon, i) => (
                <button key={i} className="p-2 hover:bg-card rounded"><Icon size={16}/></button>
              ))}
              <div className="ml-auto text-xs text-charcoal/50">Marathi · Devanagari</div>
            </div>
            <textarea rows={18} placeholder="आपला लेख येथे लिहा..." className="w-full px-5 py-4 font-devanagari text-lg leading-relaxed bg-card focus:outline-none resize-none"/>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-serif text-lg mb-4">SEO</h3>
            <div className="space-y-3">
              <Field label="Meta Title" placeholder="60 characters max"/>
              <Field label="Meta Description" placeholder="160 characters max" textarea/>
              <Field label="Keywords" placeholder="ayurveda, panchakarma, ..."/>
              <Field label="OG Image URL"/>
              <Field label="Canonical URL"/>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <button className="w-full px-5 py-3 bg-gradient-saffron text-ivory rounded-full">Publish</button>
          <button className="w-full px-5 py-3 bg-card border border-border rounded-full">Save Draft</button>

          <Panel title="Schedule">
            <input type="datetime-local" className="w-full px-3 py-2 bg-sand/40 border border-border rounded text-sm"/>
          </Panel>

          <Panel title="Featured Image">
            <div className="aspect-video rounded-lg border-2 border-dashed border-border grid place-items-center text-charcoal/50 text-xs">
              <div className="text-center"><ImageIcon className="mx-auto mb-2"/> Click to upload</div>
            </div>
          </Panel>

          <Panel title="Category">
            <select className="w-full px-3 py-2 bg-sand/40 border border-border rounded text-sm font-devanagari">
              <option>आयुर्वेद</option><option>पंचकर्म</option><option>आरोग्य टिप्स</option>
              <option>जीवनशैली</option><option>आहार</option><option>योग</option>
            </select>
          </Panel>

          <Panel title="Tags">
            <input placeholder="comma, separated, tags" className="w-full px-3 py-2 bg-sand/40 border border-border rounded text-sm"/>
          </Panel>

          <Panel title="Social Share">
            <p className="text-xs text-charcoal/60">Enabled: Facebook, Instagram, WhatsApp, X, LinkedIn</p>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, placeholder, textarea }: { label: string; placeholder?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-copper">{label}</label>
      {textarea ? (
        <textarea rows={2} placeholder={placeholder} className="mt-1.5 w-full px-3 py-2 bg-sand/40 border border-border rounded text-sm focus:outline-none focus:border-saffron resize-none"/>
      ) : (
        <input placeholder={placeholder} className="mt-1.5 w-full px-3 py-2 bg-sand/40 border border-border rounded text-sm focus:outline-none focus:border-saffron"/>
      )}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h4 className="text-xs uppercase tracking-widest text-copper mb-3">{title}</h4>
      {children}
    </div>
  );
}
