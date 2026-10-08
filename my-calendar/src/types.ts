export type Note = {
    id: string;
    text: string;
    done: boolean; // المهمة اتعملت ولا لسه
  };
  
  export type DayData = {
    crossed: boolean; // اليوم متشطب ولا لا
    notes: Note[];
  };
  
  // المفتاح = التاريخ بصيغة "YYYY-MM-DD"
  export type CalendarData = Record<string, DayData>;