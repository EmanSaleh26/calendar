import { useState } from "react";
import type { DayData } from "./types";

type Props = {
  dateKey: string;
  day: DayData;
  onClose: () => void;
  onToggleCross: () => void;
  onAddNote: (text: string) => void;
  onToggleNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
};

export default function DayModal({
  dateKey, day, onClose, onToggleCross, onAddNote, onToggleNote, onDeleteNote,
}: Props) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return; // نمنع الملاحظة الفاضية
    onAddNote(trimmed);
    setText("");
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose} // الضغط على الخلفية يقفل
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-4 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()} // نمنع القفل لما نضغط جوه النافذة
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold" dir="ltr">{dateKey}</h3>
          <button onClick={onClose} className="text-2xl leading-none">×</button>
        </div>

        <button
          onClick={onToggleCross}
          className={`mb-4 w-full rounded-lg py-2 font-semibold text-white ${
            day.crossed ? "bg-gray-500" : "bg-red-500"
          }`}
        >
          {day.crossed ? "إلغاء الشطب" : "شطب اليوم"}
        </button>

        <ul className="mb-3 max-h-60 space-y-2 overflow-y-auto">
          {day.notes.map((note) => (
            <li key={note.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={note.done}
                onChange={() => onToggleNote(note.id)}
              />
              <span className={`flex-1 ${note.done ? "text-gray-400 line-through" : ""}`}>
                {note.text}
              </span>
              <button onClick={() => onDeleteNote(note.id)} className="text-red-500">
                حذف
              </button>
            </li>
          ))}
          {day.notes.length === 0 && (
            <li className="text-sm text-gray-400">مفيش ملاحظات لسه</li>
          )}
        </ul>

        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="اكتبي ملاحظة أو مهمة..."
            className="flex-1 rounded-lg border px-3 py-2"
          />
          <button onClick={handleAdd} className="rounded-lg bg-black px-4 text-white">
            إضافة
          </button>
        </div>
      </div>
    </div>
  );
}