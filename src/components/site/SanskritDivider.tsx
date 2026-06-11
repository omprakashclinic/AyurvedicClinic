export function SanskritDivider({ text }: { text?: string }) {
  return (
    <div className="divider-ornate mx-auto max-w-2xl my-8">
      <span className="text-copper text-lg">❋</span>
      {text && <span className="font-devanagari text-sm tracking-wide whitespace-nowrap">{text}</span>}
      <span className="text-copper text-lg">❋</span>
    </div>
  );
}
