import { Scale, ShieldCheck, FileText, Sparkles, AlertCircle } from "lucide-react";

export function LegalContentRenderer({ content }: { content: string }) {
  if (!content || !content.trim()) return null;

  // Dividir por bloques de doble salto de línea
  const blocks = content.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  const formatInline = (text: string) => {
    // Manejar **negrita**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Manejar *cursiva*
      if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
        return (
          <em key={i} className="italic text-foreground/90">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        // Encabezado nivel 3 (###) o nivel 2 (##)
        if (block.startsWith("### ") || block.startsWith("## ")) {
          const title = block.replace(/^#{2,3}\s+/, "");
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-2 mt-6 first:mt-0"
            >
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                <Scale className="size-5 text-primary shrink-0" />
                <span>{formatInline(title)}</span>
              </h2>
            </div>
          );
        }

        // Bloque de Cita / Alerta (> )
        if (block.startsWith("> ")) {
          const quoteLines = block
            .split("\n")
            .map((l) => l.replace(/^>\s*/, "").trim())
            .filter(Boolean);
          return (
            <div
              key={idx}
              className="rounded-2xl border-2 border-amber-500/50 bg-amber-950/20 p-5 sm:p-6 shadow-sm space-y-2"
            >
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertCircle className="size-4 shrink-0" /> Cláusula Importante:
              </div>
              <div className="space-y-1.5 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {quoteLines.map((line, qIdx) => (
                  <p key={qIdx}>{formatInline(line)}</p>
                ))}
              </div>
            </div>
          );
        }

        // Listas con viñetas (- o *)
        if (block.startsWith("- ") || block.startsWith("* ") || block.startsWith("• ")) {
          const items = block
            .split("\n")
            .map((l) => l.replace(/^[-*•]\s*/, "").trim())
            .filter(Boolean);
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6 shadow-sm"
            >
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx}>{formatInline(item)}</li>
                ))}
              </ul>
            </div>
          );
        }

        // Párrafo estándar
        return (
          <div
            key={idx}
            className="rounded-2xl border border-border/80 bg-card/80 p-5 sm:p-6 shadow-sm text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-2"
          >
            {block.split("\n").map((line, lineIdx) => (
              <p key={lineIdx}>{formatInline(line)}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
