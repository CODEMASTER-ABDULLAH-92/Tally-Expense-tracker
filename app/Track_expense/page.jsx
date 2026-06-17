"use client"
import { useState, useMemo, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2, RefreshCw, X, Plus, Minus } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const categories = [
  { key: "food", label: "Food", color: "#8A9A7E" },
  { key: "transport", label: "Transport", color: "#6B86A8" },
  { key: "shopping", label: "Shopping", color: "#C7A24A" },
  { key: "bills", label: "Bills", color: "#D97757" },
  { key: "other", label: "Other", color: "#A38FA6" },
];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatCurrency(value) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDisplayTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export default function ExpenseTable() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDays, setExpandedDays] = useState({});

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return {
        day: i + 1,
        dateKey: getDateKey(year, month, i + 1),
        weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      };
    });
  }, [year, month, daysInMonth]);

  const fetchMonthData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const startDate = getDateKey(year, month, 1);
      const endDate = getDateKey(year, month, daysInMonth);

      const response = await fetch(
        `/api/expense?startDate=${startDate}&endDate=${endDate}&limit=1000`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch expenses");
      }

      const formattedData = {};
      result.data.forEach((expense) => {
        const dateKey = expense.date;
        if (!formattedData[dateKey]) formattedData[dateKey] = {};
        if (!formattedData[dateKey][expense.category]) {
          formattedData[dateKey][expense.category] = [];
        }
        formattedData[dateKey][expense.category].push({
          id: expense.id,
          amount: expense.amount,
          description: expense.description,
          time: expense.time,
        });
      });

      setData(formattedData);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [year, month, daysInMonth]);

  useEffect(() => {
    fetchMonthData();
  }, [fetchMonthData]);

  const deleteExpense = async (dateKey, category, expenseId) => {
    if (!confirm("Delete this expense?")) return;

    try {
      const response = await fetch(`/api/expense/${expenseId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete expense");

      setData((prev) => {
        const newData = { ...prev };
        if (newData[dateKey] && newData[dateKey][category]) {
          newData[dateKey][category] = newData[dateKey][category].filter(
            (item) => item.id !== expenseId
          );
          if (newData[dateKey][category].length === 0) {
            delete newData[dateKey][category];
          }
          if (Object.keys(newData[dateKey]).length === 0) {
            delete newData[dateKey];
          }
        }
        return newData;
      });
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError(err.message);
    }
  };

  const toggleDayExpand = (dateKey) => {
    setExpandedDays(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }));
  };

  const rowTotal = (day) => {
    const dateKey = getDateKey(year, month, day);
    let total = 0;
    categories.forEach((c) => {
      if (data[dateKey]?.[c.key]) {
        data[dateKey][c.key].forEach((item) => (total += item.amount));
      }
    });
    return total;
  };

  const columnTotal = (categoryKey) => {
    let total = 0;
    days.forEach((d) => {
      if (data[d.dateKey]?.[categoryKey]) {
        data[d.dateKey][categoryKey].forEach((item) => (total += item.amount));
      }
    });
    return total;
  };

  const grandTotal = categories.reduce((sum, c) => sum + columnTotal(c.key), 0);

  const shiftMonth = (delta) => {
    setCursor(new Date(year, month + delta, 1));
    setData({});
    setError(null);
    setExpandedDays({});
  };

  const getCellItems = (dateKey, categoryKey) => data[dateKey]?.[categoryKey] || [];

  const hasExpenses = (dateKey) => {
    return categories.some(c => getCellItems(dateKey, c.key).length > 0);
  };

  return (
    <>
      <Navbar />
      <section className="bg-[#F5F3EC] px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#8A5A3F]">Daily ledger</p>
              <h2 className="font-serif text-3xl text-[#221F1B]">
                {monthNames[month]} {year}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchMonthData}
                disabled={loading}
                className="flex items-center gap-2 rounded-full border border-[#E3DFD2] bg-white px-3 py-1.5 text-sm text-[#6B6457] hover:bg-[#F0EDE3] disabled:opacity-50"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <div className="flex items-center gap-1 rounded-full border border-[#E3DFD2] bg-white p-1">
                <button
                  onClick={() => shiftMonth(-1)}
                  aria-label="Previous month"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B6457] hover:bg-[#F0EDE3]"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-2 text-sm font-medium text-[#403C34]">
                  {monthNames[month].slice(0, 3)} {year}
                </span>
                <button
                  onClick={() => shiftMonth(1)}
                  aria-label="Next month"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B6457] hover:bg-[#F0EDE3]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-[#E3DFD2] bg-white shadow-[0_20px_50px_-30px_rgba(34,31,27,0.15)]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#D97757]" />
                <span className="ml-3 text-[#6B6457]">Loading expenses...</span>
              </div>
            ) : (
              <div className="max-h-[640px] overflow-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 z-10 bg-[#F0EDE3]">
                    <tr>
                      <th className="w-14 px-3 py-3 text-left font-medium text-[#6B6457]">
                        Date
                      </th>
                      <th className="w-16 px-2 py-3 text-left font-medium text-[#6B6457]">
                        Day
                      </th>
                      {categories.map((c) => (
                        <th
                          key={c.key}
                          className="min-w-[200px] px-3 py-3 text-left font-medium text-[#6B6457]"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: c.color }}
                            />
                            {c.label}
                          </span>
                        </th>
                      ))}
                      <th className="min-w-[100px] px-4 py-3 text-right font-semibold text-[#221F1B]">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((d) => {
                      const dayHasExpenses = hasExpenses(d.dateKey);
                      const isExpanded = expandedDays[d.dateKey] || false;
                      const dayTotal = rowTotal(d.day);
                      
                      return (
                        <tr
                          key={d.day}
                          className={`border-t border-[#EFEBE0] transition-colors ${
                            d.isWeekend ? "bg-[#FBF3EC]" : ""
                          } ${dayHasExpenses ? "hover:bg-[#F8F6F0]" : ""}`}
                        >
                          <td className="px-3 py-3 align-top font-medium text-[#221F1B]">
                            {d.day}
                          </td>
                          <td className="px-2 py-3 align-top text-[#8A8473]">
                            {d.weekday}
                          </td>
                          {categories.map((c) => {
                            const items = getCellItems(d.dateKey, c.key);
                            const total = items.reduce((sum, item) => sum + item.amount, 0);
                            
                            if (items.length === 0) {
                              return (
                                <td key={c.key} className="px-3 py-3 align-top">
                                  <span className="text-xs text-[#C7C2B3]">—</span>
                                </td>
                              );
                            }

                            const showExpand = items.length > 2;
                            const displayItems = isExpanded ? items : items.slice(0, 2);

                            return (
                              <td key={c.key} className="px-3 py-3 align-top">
                                <div className="space-y-2">
                                  {displayItems.map((item, idx) => (
                                    <div
                                      key={item.id}
                                      className="relative rounded-lg border border-[#E8E4D8] bg-white px-3 py-2 transition-all hover:border-[#D97757] hover:shadow-sm"
                                    >
                                      {/* Entry divider line */}
                                      {idx > 0 && (
                                        <div className="absolute -top-2 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#E3DFD2] to-transparent" />
                                      )}
                                      
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs leading-relaxed text-[#403C34]">
                                            {item.description}
                                          </p>
                                          {item.time && (
                                            <p className="mt-0.5 text-[10px] text-[#A39E8E]">
                                              {formatDisplayTime(item.time)}
                                            </p>
                                          )}
                                        </div>
                                        <div className="flex flex-shrink-0 items-center gap-2">
                                          <span className="text-xs font-semibold text-[#221F1B]">
                                            {formatCurrency(item.amount)}
                                          </span>
                                          <button
                                            onClick={() =>
                                              deleteExpense(d.dateKey, c.key, item.id)
                                            }
                                            aria-label="Delete entry"
                                            className="rounded-full p-0.5 text-[#C7C2B3] opacity-0 transition-all hover:bg-[#F5F0E8] hover:text-[#B3493A] group-hover:opacity-100"
                                          >
                                            <X size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {showExpand && (
                                    <button
                                      onClick={() => toggleDayExpand(d.dateKey)}
                                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#E3DFD2] px-3 py-1.5 text-[10px] font-medium text-[#8A8473] transition-all hover:border-[#C7C2B3] hover:bg-[#F8F6F0] hover:text-[#6B6457]"
                                    >
                                      {isExpanded ? (
                                        <>
                                          <Minus size={13} />
                                          <span>Show fewer entries</span>
                                          <span className="ml-1 rounded-full bg-[#EFEBE0] px-2 py-0.5 text-[9px]">
                                            {items.length}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <Plus size={13} />
                                          <span>Show {items.length - 2} more entries</span>
                                          <span className="ml-1 rounded-full bg-[#EFEBE0] px-2 py-0.5 text-[9px]">
                                            {items.length}
                                          </span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                  
                                  {items.length > 1 && (
                                    <div className="flex items-center justify-end gap-2 pt-1">
                                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#EFEBE0] to-transparent" />
                                      <span className="text-[10px] font-semibold text-[#8A8473]">
                                        Subtotal: {formatCurrency(total)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-right align-top">
                            {dayTotal > 0 ? (
                              <span className="inline-flex items-center rounded-full bg-[#F0EDE3] px-3 py-1.5 text-xs font-semibold text-[#221F1B]">
                                {formatCurrency(dayTotal)}
                              </span>
                            ) : (
                              <span className="text-xs text-[#C7C2B3]">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="sticky bottom-0 bg-[#F0EDE3]">
                    <tr className="border-t-2 border-[#E3DFD2]">
                      <td className="px-3 py-3 font-semibold text-[#221F1B]" colSpan={2}>
                        Monthly Total
                      </td>
                      {categories.map((c) => (
                        <td
                          key={c.key}
                          className="px-3 py-3 text-right font-semibold text-[#221F1B]"
                        >
                          {formatCurrency(columnTotal(c.key))}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right font-serif text-lg text-[#D97757]">
                        {formatCurrency(grandTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#8A8473]">
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#D97757]" />
                <span>Weekend</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#8A9A7E]" />
                <span>Has expenses</span>
              </span>
              <span className="inline-flex items-center gap-2 text-[#A39E8E]">
                <span className="inline-block h-px w-8 bg-[#E3DFD2]" />
                <span>Entry divider</span>
              </span>
            </div>
            <p className="text-xs text-[#A39E8E]">
              Click <span className="font-medium text-[#8A8473]">"Show more"</span> to view all entries
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}