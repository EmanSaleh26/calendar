import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  // نقرا من localStorage مرة واحدة بس عند أول تحميل
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initial;
    } catch {
      return initial; // لو الداتا باظت منرميش error
    }
  });

  // كل ما value تتغير، نحفظها
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}