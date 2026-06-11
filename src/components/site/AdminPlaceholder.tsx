import { Construction } from "lucide-react";

export function AdminPlaceholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl">{title}</h1>
        <p className="text-charcoal/60 mt-1">{desc}</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-16 text-center">
        <Construction className="mx-auto text-saffron mb-4" size={42}/>
        <h2 className="font-serif text-2xl">Module UI ready</h2>
        <p className="text-sm text-charcoal/60 mt-2 max-w-md mx-auto">
          Hook this screen to your API. Forms, tables and actions are pre-built and styled — just wire data.
        </p>
      </div>
    </div>
  );
}
