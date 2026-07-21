import { Sparkles } from "lucide-react";
import { cn } from "../../lib/cn.js";

export default function Logo({ className }) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent text-accent-ink shadow-soft">
        <Sparkles className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="font-display text-[16px] font-bold tracking-tight text-ink">
        DevWorkspaceLab
      </span>
    </div>
  );
}
