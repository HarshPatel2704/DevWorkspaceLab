import { Sparkles, Zap, GitBranch } from "lucide-react";
import Logo from "./Logo.jsx";

const FEATURES = [
  "Cloud dev environments that boot in seconds",
  "An AI pair programmer wired into every repo",
  "One workspace, from first commit to production",
];

export default function AuthLayout({ eyebrow, title, description, children, footer }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      <aside className="relative hidden overflow-hidden bg-panel px-12 py-10 lg:flex lg:w-[46%] lg:flex-col lg:justify-between xl:px-16">
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-accent-soft), transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/4 rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(circle, #fce7f3, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: "radial-gradient(circle, rgb(109 94 252 / 0.12) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />

        <div className="relative animate-fade-up">
          <Logo />
        </div>

        <div className="relative animate-fade-up animate-delay-1">
          <h2 className="max-w-sm text-[28px] font-bold leading-[1.25] tracking-tight text-ink xl:text-[32px]">
            Ship code with an AI teammate that never leaves your side.
          </h2>

          <ul className="mt-7 space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-[14.5px] text-ink-muted">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/70 text-accent shadow-soft">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="relative mt-10 h-56">
            <div className="absolute left-0 top-0 w-64 animate-float rounded-2xl border border-white/60 bg-white/90 p-4 shadow-card backdrop-blur-sm animate-fade-up animate-delay-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Zap className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[13.5px] font-semibold text-ink">Workspace booted</p>
                  <p className="text-[12px] text-ink-muted">1.2s cold start</p>
                </div>
              </div>
            </div>

            <div
              className="absolute left-16 top-28 w-60 animate-float rounded-2xl border border-white/60 bg-white/90 p-4 shadow-card backdrop-blur-sm animate-fade-up animate-delay-3"
              style={{ animationDelay: "1.4s" }}
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-soft text-success">
                  <GitBranch className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[13.5px] font-semibold text-ink">PR reviewed by AI</p>
                  <p className="text-[12px] text-ink-muted">3 suggestions applied</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-ink-faint">© {new Date().getFullYear()} DevWorkspaceLab. All rights reserved.</p>
      </aside>

      <main className="flex flex-1 items-center justify-center bg-surface-sunken px-6 py-12 sm:px-10 lg:px-12">
        <div className="w-full max-w-[420px] animate-fade-up">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>

          <div className="rounded-3xl border border-border bg-surface-raised p-7 shadow-card transition-shadow duration-300 hover:shadow-card-hover sm:p-9">
            <div className="mb-7">
              {eyebrow && (
                <p className="mb-2 inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent">
                  {eyebrow}
                </p>
              )}
              <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
              {description && <p className="mt-1.5 text-[14.5px] text-ink-muted">{description}</p>}
            </div>

            {children}
          </div>

          {footer && <div className="mt-6 text-center text-[14.5px] text-ink-muted">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
