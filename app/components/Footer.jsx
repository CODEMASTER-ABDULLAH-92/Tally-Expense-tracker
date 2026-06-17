"use client"

const columns = [
  {
    heading: "Product",
    links: ["Features", "Pricing", "Integrations", "Changelog"],
  },
  {
    heading: "Resources",
    links: ["Budget Guide", "Help Center", "Blog", "API Docs"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Contact", "Press"],
  },
];

export default function Footer() {


  return (
    <footer className="border-t border-[#E3DFD2] bg-[#EFEBE0]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-5">
          {/* Brand column */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D97757] font-serif text-base font-semibold text-white">
                T
              </span>
              <span className="font-serif text-lg font-semibold tracking-tight text-[#221F1B]">
                Tally
              </span>
            </a>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-[#6B6457]">
              Track every expense without lifting a finger. Tally sorts your
              spending so you don't have to.
            </p>
            {/* <div className="mt-6 flex items-center gap-3">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E3DFD2] text-[#6B6457] transition-colors hover:border-[#D97757] hover:text-[#D97757]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div> */}
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold text-[#221F1B]">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[15px] text-[#6B6457] transition-colors hover:text-[#221F1B]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#E3DFD2] pt-8 sm:flex-row">
          <p className="text-sm text-[#8A8473]">
            © {new Date().getFullYear()} Hafiz Expense Tracker. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-[#8A8473] hover:text-[#221F1B]">
              Privacy
            </a>
            <a href="#" className="text-sm text-[#8A8473] hover:text-[#221F1B]">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}