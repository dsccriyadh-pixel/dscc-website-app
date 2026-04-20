import type { BilingualString } from "./services";

export interface City {
  key: string;
  name: BilingualString;
}

export const cities: City[] = [
  { key: "Riyadh", name: { en: "Riyadh", ar: "الرياض" } },
  { key: "Jeddah", name: { en: "Jeddah", ar: "جدة" } },
  { key: "Mecca", name: { en: "Mecca", ar: "مكة المكرمة" } },
  { key: "Medina", name: { en: "Medina", ar: "المدينة المنورة" } },
  { key: "Dammam", name: { en: "Dammam", ar: "الدمام" } },
  { key: "Khobar", name: { en: "Khobar", ar: "الخبر" } },
  { key: "Dhahran", name: { en: "Dhahran", ar: "الظهران" } },
  { key: "Tabuk", name: { en: "Tabuk", ar: "تبوك" } },
  { key: "Abha", name: { en: "Abha", ar: "أبها" } },
  { key: "Taif", name: { en: "Taif", ar: "الطائف" } },
  { key: "Yanbu", name: { en: "Yanbu", ar: "ينبع" } },
  { key: "Jubail", name: { en: "Jubail", ar: "الجبيل" } },
  { key: "Hail", name: { en: "Hail", ar: "حائل" } },
  { key: "Buraidah", name: { en: "Buraidah", ar: "بريدة" } },
  { key: "NEOM", name: { en: "NEOM", ar: "نيوم" } },
  { key: "Red Sea", name: { en: "Red Sea Project", ar: "مشروع البحر الأحمر" } },
  { key: "AlUla", name: { en: "AlUla", ar: "العلا" } },
  { key: "Diriyah", name: { en: "Diriyah", ar: "الدرعية" } },
  { key: "Qiddiya", name: { en: "Qiddiya", ar: "القدية" } },
];
