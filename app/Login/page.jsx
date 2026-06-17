'use client'
import { useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hook this up to your auth flow
    console.log({ email, password, remember });
  };

  return (
    <>
      <Navbar/>
    <div className="flex min-h-screen items-center justify-center bg-[#F5F3EC] px-6 py-16">
      <div className="relative w-full max-w-sm">
        <div className="absolute -right-10 -top-10 -z-10 h-40 w-40 rounded-full bg-[#F3DCCB] blur-2xl" />

        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#D97757] font-serif text-lg font-semibold text-white">
            T
          </span>
          <h1 className="font-serif text-3xl text-[#221F1B]">Welcome back</h1>
          <p className="mt-2 text-[15px] text-[#6B6457]">
            Log in to keep tracking your spending.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E3DFD2] bg-white p-7 shadow-[0_20px_50px_-30px_rgba(34,31,27,0.18)] sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#403C34]"
                >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#E3DFD2] bg-[#FBFAF6] px-3.5 py-2.5 text-[15px] text-[#221F1B] outline-none placeholder:text-[#A39E8E] focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757]"
                />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#403C34]"
                  >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#E3DFD2] bg-[#FBFAF6] px-3.5 py-2.5 pr-10 text-[15px] text-[#221F1B] outline-none placeholder:text-[#A39E8E] focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757]"
                  />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#8A8473] hover:text-[#403C34]"
                  >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-[#6B6457]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-[#E3DFD2] text-[#D97757] focus:ring-[#D97757]"
                />
              Remember me
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-[#D97757] px-5 py-3 text-[15px] font-medium text-gray-600 shadow-sm transition-colors hover:bg-[#C2613F]"
              >
              Log in
            </button>
          </form>

        </div>

      </div>
    </div>
    <Footer/>
            </>
  );
}