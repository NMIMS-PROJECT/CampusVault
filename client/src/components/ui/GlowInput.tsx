import type { InputHTMLAttributes } from "react";

export function GlowInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`glow-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition-all duration-300 hover:bg-white/10 hover:border-white/20 focus:bg-white/10 focus:border-indigo-400/60 ${props.className ?? ""}`.trim()}
    />
  );
}

