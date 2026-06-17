"use client"
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Adding Expense", href: "/Add_expense" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E3DFD2] bg-[#F5F3EC]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D97757] font-serif text-base font-semibold text-white lg:h-9 lg:w-9">
            T
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight text-[#221F1B] lg:text-xl">
            Tally
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[15px] font-medium text-[#6B6457] transition-colors hover:text-[#221F1B]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-5 md:flex">
          <a
            href="/Login"
            className="text-[15px] font-medium text-[#6B6457] transition-colors hover:text-[#221F1B]"
          >
            Log in
          </a>
          <a
            href="/Track_expense"
            className="rounded-full bg-[#D97757] px-5  py-2.5 text-[15px] font-medium text-black shadow-sm transition-colors hover:bg-[#C2613F]"
          >
            Start tracking free
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded-md text-[#221F1B] md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-[#E3DFD2] bg-[#F5F3EC] px-6 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-[15px] font-medium text-[#403C34] hover:bg-[#ECE8DC]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3 border-t border-[#E3DFD2] pt-4">
            <a href="#login" className="text-[15px] font-medium text-[#403C34]">
              Log in
            </a>
            <a
              href="#start"
              className="rounded-full bg-[#D97757] px-5 py-2.5 text-center text-[15px] font-medium text-white"
            >
              Start tracking free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}