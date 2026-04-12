import type { ButtonHTMLAttributes } from "react";

export function GlowButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`glow-ring relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none before:absolute before:inset-0 before:bg-white/20 before:opacity-0 hover:before:opacity-10 before:transition-opacity ${props.className ?? ""}`.trim()}
    />
  );
}

