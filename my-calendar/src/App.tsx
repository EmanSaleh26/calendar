import { useState } from "react";
import DayModal from "./DayModal";
import MonthCard from "./MonthCard";
import type { CalendarData, DayData } from "./types";
import { useLocalStorage } from "./useLocalStorage";

const EMPTY_DAY: DayData = { crossed: false, notes: [] };

export default function App() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useLocalStorage<CalendarData>("calendar-data", {});
  const [selected, setSelected] = useState<string | null>(null);

  // function مساعدة: تعدل يوم معين من غير ما نلمس باقي الأيام
  const updateDay = (key: string, fn: (d: DayData) => DayData) => {
    setData((prev) => ({ ...prev, [key]: fn(prev[key] ?? EMPTY_DAY) }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-center gap-4">
          <button onClick={() => setYear(year - 1)} className="rounded bg-white px-3 py-1 shadow">→</button>
          <h1 className="text-2xl font-bold">{year}</h1>
          <button onClick={() => setYear(year + 1)} className="rounded bg-white px-3 py-1 shadow">←</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, month) => (
            <MonthCard
              key={month}
              year={year}
              month={month}
              data={data}
              onDayClick={setSelected}
            />
          ))}
        </div>
      </div>

      {selected && (
        <DayModal
          dateKey={selected}
          day={data[selected] ?? EMPTY_DAY}
          onClose={() => setSelected(null)}
          onToggleCross={() => updateDay(selected, (d) => ({ ...d, crossed: !d.crossed }))}
          onAddNote={(text) =>
            updateDay(selected, (d) => ({
              ...d,
              notes: [...d.notes, { id: crypto.randomUUID(), text, done: false }],
            }))
          }
          onToggleNote={(id) =>
            updateDay(selected, (d) => ({
              ...d,
              notes: d.notes.map((n) => (n.id === id ? { ...n, done: !n.done } : n)),
            }))
          }
          onDeleteNote={(id) =>
            updateDay(selected, (d) => ({
              ...d,
              notes: d.notes.filter((n) => n.id !== id),
            }))
          }
        />
      )}
    </div>
  );
}