// app/utils/fonts.js
import { useFonts } from "expo-font";
import {
  WorkSans_900Black,
} from "@expo-google-fonts/work-sans";
import {
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";

// Custom hook for loading fonts
export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    WorkSans_900Black,
    Poppins_500Medium,
  });

  return fontsLoaded;
};
