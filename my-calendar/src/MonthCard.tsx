import { DAY_NAMES, MONTH_COLORS, MONTH_NAMES } from "./constants";
import type { CalendarData } from "./types";
import { dateKey } from "./utils";

type Props = {
  year: number;
  month: number; // 0-11
  data: CalendarData;
  onDayClick: (key: string) => void;
};

export default function MonthCard({ year, month, data, onDayClick }: Props) {
  const colors = MONTH_COLORS[month];
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = أحد
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    // شلنا overflow-hidden من هنا، لأنه كان هيقص الـ tooltip اللي بتطلع بره الكارت
    <div className="rounded-2xl bg-white shadow">
      {/* rounded-t-2xl بدل overflow-hidden عشان الهيدر يفضل مدور من فوق */}
      <h2 className={`${colors.header} rounded-t-2xl py-2 text-center text-lg font-bold text-white`}>
        {MONTH_NAMES[month]} {year}
      </h2>

      <div dir="ltr" className="grid grid-cols-7 gap-1 p-3 text-center text-sm">
        {DAY_NAMES.map((name) => (
          <div key={name} className="text-xs font-semibold text-gray-500">
            {name}
          </div>
        ))}

        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const key = dateKey(year, month, day);
          const info = data[key];
          const isToday = key === todayKey;
          const hasNotes = !!info && info.notes.length > 0;

          // رقم العمود (0 لـ 6) عشان نعرف اليوم ده على الحافة ولا في النص
          const column = (firstWeekday + i) % 7;
          const tooltipPosition =
            column <= 1
              ? "left-0" // أول عمودين: الـ tooltip تبدأ من الشمال
              : column >= 5
              ? "right-0" // آخر عمودين: تنتهي عند اليمين
              : "left-1/2 -translate-x-1/2"; // النص: متوسطة

          return (
            <button
              key={key}
              onClick={() => onDayClick(key)}
              className={`group relative aspect-square rounded-lg ${colors.day} ${
                isToday ? "ring-2 ring-black" : ""
              }`}
            >
              <span className={info?.crossed ? "opacity-50" : ""}>{day}</span>

              {/* الخط الأحمر المائل */}
              {info?.crossed && (
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0" y1="100" x2="100" y2="0"
                    stroke="red"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              )}

              {/* نقطة صغيرة لو فيه ملاحظات */}
              {hasNotes && (
                <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-black" />
              )}

              {/* الملاحظات: مخفية، وتظهر لما نعمل hover على الزرار */}
              {hasNotes && (
                <span
                  dir="rtl"
                  className={`pointer-events-none absolute bottom-full z-20 mb-1 hidden w-max max-w-48 rounded-lg bg-gray-900 px-3 py-2 text-right text-xs text-white shadow-lg group-hover:block ${tooltipPosition}`}
                >
                  {info.notes.map((note) => (
                    <span
                      key={note.id}
                      className={`block break-words ${note.done ? "text-gray-400 line-through" : ""}`}
                    >
                      • {note.text}
                    </span>
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}