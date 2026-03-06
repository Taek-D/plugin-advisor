type Props = {
  text: string;
  keywords: string[];
  color: string;
};

export default function HighlightedText({ text, keywords, color }: Props) {
  if (!keywords.length) return <span>{text}</span>;

  const escaped = keywords.map((k) =>
    k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <span>
      {parts.map((part, i) => {
        const isMatch = keywords.some(
          (kw) => part.toLowerCase() === kw.toLowerCase()
        );
        return isMatch ? (
          <mark
            key={i}
            className="rounded-sm px-0.5 font-bold"
            style={{ background: color + "30", color }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
}
