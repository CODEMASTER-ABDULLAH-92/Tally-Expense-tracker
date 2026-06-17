"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, RefreshCw, Edit2, X } from "lucide-react";
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

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplayDate(dateStr) {
  return parseLocalDate(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatDisplayTime(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
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
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Fetch all expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Fetch expenses from API
  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/expense?limit=1000&sort=-date,-time");
      if (!response.ok) throw new Error("Failed to fetch expenses");
      
      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Failed to fetch expenses");
      
      // Sort entries by date (newest first) and then by time
      const sortedEntries = result.data.sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return b.time.localeCompare(a.time);
      });
      
      setEntries(sortedEntries);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to load expenses. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  // Save expense to database
  const saveExpenseToDatabase = async (entry) => {
    const response = await fetch("/api/expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save expense");
    }
    
    const result = await response.json();
    return result.data;
  };

  // Update expense in database
  const updateExpenseInDatabase = async (id, entry) => {
    const response = await fetch(`/api/expense/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update expense");
    }
    
    const result = await response.json();
    return result.data;
  };

  // Delete expense from database
  const deleteExpenseFromDatabase = async (id) => {
    const response = await fetch(`/api/expense/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete expense");
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const amountValue = parseFloat(form.amount);
    if (!amountValue || amountValue <= 0) {
      setError("Enter an amount greater than 0.");
      setSuccess("");
      return;
    }
    
    // Check if description is provided
    if (!form.description.trim()) {
      setError("Please add a description for the expense.");
      setSuccess("");
      return;
    }
    
    setError("");
    setSuccess("");
    setSaving(true);

    const entry = {
      date: form.date,
      time: form.time,
      category: form.category,
      amount: amountValue,
      description: form.description.trim(),
    };

    try {
      let saved;
      if (editingId) {
        // Update existing expense
        saved = await updateExpenseInDatabase(editingId, entry);
        setEntries((prev) => 
          prev.map((e) => e.id === editingId ? saved : e)
        );
        setSuccess("Expense updated successfully!");
      } else {
        // Create new expense
        saved = await saveExpenseToDatabase(entry);
        setEntries((prev) => [saved, ...prev]);
        setSuccess("Expense added successfully!");
      }
      
      // Reset form
      setForm({
        ...form,
        time: toHHMM(new Date()),
        amount: "",
        description: "",
      });
      setEditingId(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error("Error saving expense:", err);
      setError(err.message || "Couldn't save that expense. Try again.");
      setSuccess("");





      
    } finally {
      setSaving(false);
    }
  };

  // Handle edit
  const handleEdit = (entry) => {
    setForm({
      date: entry.date,
      time: entry.time,
      category: entry.category,
      amount: entry.amount.toString(),
      description: entry.description,
    });
    setEditingId(entry.id);
    setError("");
    setSuccess("");
    
    // Scroll to form
    document.querySelector('.expense-form-card')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    
    setDeleting(id);
    setError("");
    setSuccess("");
    
    try {
      await deleteExpenseFromDatabase(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      setSuccess("Expense deleted successfully!");
      
      // If we're editing this expense, reset form
      if (editingId === id) {
        resetForm();
      }
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError(err.message || "Couldn't delete expense. Try again.");
    } finally {
      setDeleting(null);
    }
  };

  // Reset form
  const resetForm = () => {
    const now = new Date();
    setForm({
      date: toISODate(now),
      time: toHHMM(now),
      category: "food",
      amount: "",
      description: "",
    });
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    resetForm();
  };

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const categoryMeta = (key) => categories.find((c) => c.key === key) ?? categories[4];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F5F3EC] px-6 py-16">
        <div className="mx-auto max-w-xl">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#8A5A3F]">
                {editingId ? "Edit entry" : "New entry"}
              </p>
              <h1 className="font-serif text-3xl text-[#221F1B]">
                {editingId ? "Update expense" : "Add an expense"}
              </h1>
              <p className="mt-2 text-[15px] text-[#6B6457]">
                {editingId 
                  ? "Update the expense details below." 
                  : "Log what you spent — it'll show up in your daily ledger automatically."}
              </p>
            </div>
            <button
              onClick={fetchExpenses}
              disabled={loading}
              className="flex items-center gap-2 rounded-full border border-[#E3DFD2] bg-white px-3 py-1.5 text-sm text-[#6B6457] hover:bg-[#F0EDE3] disabled:opacity-50"
              title="Refresh expenses"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200">
              ✓ {success}
            </div>
          )}
          
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              ❌ {error}
            </div>
          )}

          {/* Form card */}
          <div className="expense-form-card rounded-2xl border border-[#E3DFD2] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(34,31,27,0.15)] sm:p-7">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#403C34]">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className="w-full rounded-lg border border-[#E3DFD2] bg-[#FBFAF6] px-3.5 py-2.5 text-[15px] text-[#221F1B] outline-none focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757]"
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
                  className="w-full rounded-lg border border-[#E3DFD2] bg-[#FBFAF6] px-3.5 py-2.5 text-[15px] text-[#221F1B] outline-none focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757]"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-[#403C34]">
                Category
              </label>
              <div className="grid grid-cols-5 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => updateField("category", c.key)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors ${
                      form.category === c.key
                        ? "border-[#D97757] bg-[#FBF3EC] text-[#221F1B]"
                        : "border-[#E3DFD2] bg-[#FBFAF6] text-[#8A8473] hover:bg-[#F0EDE3]"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-[120px_1fr] gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#403C34]">
                  Amount ($)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#8A8473]">
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
                    className="w-full rounded-lg border border-[#E3DFD2] bg-[#FBFAF6] py-2.5 pl-7 pr-3 text-[15px] text-[#221F1B] outline-none placeholder:text-[#A39E8E] focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757]"
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
                  className="w-full rounded-lg border border-[#E3DFD2] bg-[#FBFAF6] px-3.5 py-2.5 text-[15px] text-[#221F1B] outline-none placeholder:text-[#A39E8E] focus:border-[#D97757] focus:ring-1 focus:ring-[#D97757]"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#D97757] px-5 py-3 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-[#C2613F] disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {editingId ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    {editingId ? "Update expense" : "Add expense"}
                  </>
                )}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-full border border-[#E3DFD2] px-5 py-3 text-[15px] font-medium text-[#6B6457] hover:bg-[#F0EDE3] transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Logged entries */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#E3DFD2] bg-white">
            <div className="flex items-center justify-between border-b border-[#EFEBE0] px-5 py-4">
              <h2 className="text-sm font-semibold text-[#221F1B]">
                Logged entries ({entries.length})
              </h2>
              <span className="font-serif text-base text-[#D97757]">
                ${total.toFixed(2)}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-[#D97757]" />
                <span className="ml-2 text-sm text-[#8A8473]">Loading expenses...</span>
              </div>
            ) : entries.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[#8A8473]">
                Nothing logged yet — add your first expense above.
              </p>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                {entries.map((entry) => {
                  const meta = categoryMeta(entry.category);
                  const isDeleting = deleting === entry.id;
                  const isEditing = editingId === entry.id;
                  
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between gap-4 border-b border-[#EFEBE0] px-5 py-3.5 last:border-b-0 transition-colors ${
                        isEditing ? "bg-[#FBF3EC]" : "hover:bg-[#FBFBF7]"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="h-2 w-2 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#221F1B]">
                            {entry.description || meta.label}
                          </p>
                          <p className="text-xs text-[#8A8473]">
                            {meta.label} · {formatDisplayTime(entry.time)} ·{" "}
                            {formatDisplayDate(entry.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        <span className="font-serif text-base text-[#221F1B]">
                          ${entry.amount.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(entry)}
                            aria-label="Edit entry"
                            disabled={isDeleting}
                            className="p-1 text-[#C7C2B3] hover:text-[#D97757] disabled:opacity-50"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(entry.id)}
                            aria-label="Delete entry"
                            disabled={isDeleting}
                            className="p-1 text-[#C7C2B3] hover:text-[#B3493A] disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}