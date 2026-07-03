"use client";
import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = [
  { key: "food", label: "Food", color: "#8A9A7E" },
  { key: "transport", label: "Transport", color: "#6B86A8" },
  { key: "shopping", label: "Shopping", color: "#C7A24A" },
  { key: "bills", label: "Bills", color: "#D97757" },
  { key: "other", label: "Other", color: "#A38FA6" },
];

function toISODate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function toHHMM(d) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(
    2,
    "0"
  )}`;
}

export default function ExpenseForm() {
  const now = new Date();
  const [form, setForm] = useState({
    date: toISODate(now),
    time: toHHMM(now),
    category: "food",
    amount: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  // Check for token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Save expense to database
  const saveExpenseToDatabase = async (entry) => {
    if (!token) {
      throw new Error("Please log in first");
    }

    const response = await fetch("/api/expense", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(entry),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please log in again.");
      }
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save expense");
    }
    
    const result = await response.json();
    return result.data;
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Check authentication first
    if (!isAuthenticated || !token) {
      toast.warning('Please log in to add expenses', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const amountValue = parseFloat(form.amount);
    if (!amountValue || amountValue <= 0) {
      toast.error('Please enter an amount greater than 0', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    // Check if description is provided
    if (!form.description.trim()) {
      toast.error('Please add a description for the expense', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    setSaving(true);

    const entry = {
      date: form.date,
      time: form.time,
      category: form.category,
      amount: amountValue,
      description: form.description.trim(),
    };

    try {
      await saveExpenseToDatabase(entry);
      
      // Reset form
      setForm({
        ...form,
        time: toHHMM(new Date()),
        amount: "",
        description: "",
      });
      
      toast.success('Expense added successfully! 🎉', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
    } catch (err) {
      console.error("Error saving expense:", err);
      toast.error(err.message || 'Could not save expense. Try again.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-[#F5F3EC] via-[#F0EDE3] to-[#F5F3EC] px-4 py-16">
        <div className="mx-auto max-w-lg">
          <div className="mb-8 text-center">
            <div className="inline-block rounded-full bg-[#D97757]/10 px-4 py-1.5 text-sm font-medium text-[#D97757] mb-3">
              ✨ Track Your Expenses
            </div>
            <h1 className="font-serif text-4xl text-[#221F1B] mb-2">
              Add an expense
            </h1>
            <p className="text-[15px] text-[#6B6457]">
              Log what you spent — keep your finances in check
            </p>
            
            {!isAuthenticated && (
              <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                🔒 Please log in to add expenses
              </div>
            )}
          </div>

          {/* Form card */}
          <div className="expense-form-card rounded-2xl border border-[#E3DFD2] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(34,31,27,0.15)] sm:p-8 hover:shadow-[0_30px_60px_-30px_rgba(34,31,27,0.2)] transition-shadow duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#403C34]">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className="w-full rounded-xl border border-[#E3DFD2] bg-[#FBFAF6] px-3.5 py-3 text-[15px] text-[#221F1B] outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 transition-all duration-200"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#403C34]">
                  Time
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => updateField("time", e.target.value)}
                  className="w-full rounded-xl border border-[#E3DFD2] bg-[#FBFAF6] px-3.5 py-3 text-[15px] text-[#221F1B] outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 transition-all duration-200"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-[#403C34]">
                Category
              </label>
              <div className="grid grid-cols-5 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => updateField("category", c.key)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition-all duration-200 ${
                      form.category === c.key
                        ? "border-[#D97757] bg-[#FBF3EC] text-[#221F1B] shadow-sm scale-95"
                        : "border-[#E3DFD2] bg-[#FBFAF6] text-[#8A8473] hover:bg-[#F0EDE3] hover:scale-105"
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[120px_1fr] gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#403C34]">
                  Amount ($)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#8A8473] font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => updateField("amount", e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-xl border border-[#E3DFD2] bg-[#FBFAF6] py-3 pl-7 pr-3 text-[15px] text-[#221F1B] outline-none placeholder:text-[#A39E8E] focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#403C34]">
                  What was it for?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning coffee, bus fare"
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-xl border border-[#E3DFD2] bg-[#FBFAF6] px-3.5 py-3 text-[15px] text-[#221F1B] outline-none placeholder:text-[#A39E8E] focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || !isAuthenticated}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-[15px] font-medium text-black shadow-lg transition-all duration-300 ${
                !isAuthenticated
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#D97757] to-[#C2613F] hover:from-[#C2613F] hover:to-[#B3493A] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              } disabled:opacity-60`}
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  {!isAuthenticated ? "Please Log In First" : "Add expense"}
                </>
              )}
            </button>

            {!isAuthenticated && (
              <p className="mt-3 text-center text-xs text-[#8A8473]">
                🔐 You need to be logged in to add expenses
              </p>
            )}
          </div>

          {/* Stats Card */}
          <div className="mt-6 rounded-xl bg-white/70 backdrop-blur-sm border border-[#E3DFD2] p-4 text-center">
            <p className="text-sm text-[#6B6457]">
              💡 Track your daily expenses easily. Stay on top of your budget!
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}