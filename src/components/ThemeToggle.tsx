import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoredTheme, toggleTheme, type Theme } from "@/lib/theme";

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export function ThemeToggle({ compact = false, className = "" }: ThemeToggleProps) {
  const [theme, setLocalTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocalTheme(getStoredTheme());

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<Theme>;
      if (customEvent.detail) {
        setLocalTheme(customEvent.detail);
      }
    };

    window.addEventListener("aval_theme_changed", handleThemeChange);
    return () => window.removeEventListener("aval_theme_changed", handleThemeChange);
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setLocalTheme(next);
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 p-0 text-muted-foreground opacity-50 ${className}`}
        aria-label="Cambiar modo de color"
      >
        <Sun className="size-4" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className={`h-8 w-8 p-0 rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer ${className}`}
        title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
        aria-label={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
      >
        {isDark ? (
          <Sun className="size-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="size-4 text-slate-700 transition-transform rotate-0 hover:-rotate-12" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={`h-8 px-2.5 sm:px-3 text-xs font-semibold rounded-full border border-border/80 bg-background/80 hover:bg-secondary text-foreground transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${className}`}
      title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
      aria-label={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
    >
      {isDark ? (
        <>
          <Sun className="size-3.5 text-amber-400" />
          <span className="hidden sm:inline text-xs text-foreground/90 font-medium">Modo Claro</span>
        </>
      ) : (
        <>
          <Moon className="size-3.5 text-slate-700" />
          <span className="hidden sm:inline text-xs text-foreground/90 font-medium">Modo Oscuro</span>
        </>
      )}
    </Button>
  );
}
