"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-[#E3DFD2] bg-[#EFEBE0]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 pt-4 sm:flex-row">
          <p className="text-sm text-[#8A8473]">
            © {new Date().getFullYear()} Tally. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {/* GitHub */}
            <a
              href="https://github.com/CODEMASTER-ABDULLAH-92"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="group"
            >
              <FaGithub
                size={24}
                className="text-[#8A8473] transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:scale-110 group-hover:text-black"
              />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/muhammad-abdullah-ab33683b2/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="group"
            >
              <FaLinkedin
                size={24}
                className="text-[#8A8473] transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:scale-110 group-hover:text-[#0077B5]"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}