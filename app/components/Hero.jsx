"use client"
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const categories = [
  { label: "Housing", amount: "$860", pct: 40, color: "#D97757" },
  { label: "Food", amount: "$430", pct: 20, color: "#8A9A7E" },
  { label: "Transport", amount: "$322", pct: 15, color: "#6B86A8" },
  { label: "Shopping", amount: "$536", pct: 25, color: "#C7A24A" },
];

export default function Hero() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="bg-[#F5F3EC]">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-28">
        {/* Left column — copy */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E3DFD2] bg-white px-3.5 py-1.5 text-sm font-medium text-[#8A5A3F]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D97757]" />
            No spreadsheets. No guesswork.
          </div>

          <h1 className="font-serif text-4xl leading-[1.12] tracking-tight text-[#221F1B] sm:text-5xl lg:text-[3.4rem]">
            Know exactly where your money goes.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#6B6457]">
            Tally sorts every transaction into a category the moment it
            happens, so you always know the one number that matters: what's
            left to spend.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <a
              href="/Track_expense"
              className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-[#221F1B]"
              >
              Start tracking free
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          </div>

          <p className="mt-6 text-sm text-[#8A8473]">
            No credit card needed · Free for 30 days
          </p>
        </div>

        {/* Right column — live product preview card */}
        <div className="relative">
          <div className="rounded-2xl border border-[#E3DFD2] bg-white p-7 shadow-[0_20px_50px_-20px_rgba(34,31,27,0.18)] sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#8A8473]">
                This month
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#7C8C6F]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8A9A7E] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#8A9A7E]" />
                </span>
                Updated just now
              </span>
            </div>

            <p className="mt-2 font-serif text-4xl text-[#221F1B]">
              $2,148.30
            </p>
            <p className="text-sm text-[#8A8473]">
              spent across 4 categories
            </p>

            <div className="mt-7 space-y-4">
              {categories.map((cat) => (
                <div key={cat.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-[#403C34]">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.label}
                    </span>
                    <span className="text-[#8A8473]">{cat.amount}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F0EDE3]">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: animate ? `${cat.pct}%` : "0%",
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ambient accent glow */}
          <div className="absolute -right-6 -top-6 -z-10 h-32 w-32 rounded-full bg-[#F3DCCB] blur-2xl sm:h-40 sm:w-40" />
        </div>
      </div>
    </section>
  );
}