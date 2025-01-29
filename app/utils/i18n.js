import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../lang/en.json";
import pl from "../lang/pl.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      ...en,
    },
    pl: { ...pl },
  },
  interpolation: {
    escapeValue: false,
  },
  debug: false,
});

export default i18n;
