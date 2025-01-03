import { Button, View } from "react-native";
import i18n from "../utils/i18n";

export default function LanguageSwitcher() {
  return (
    <View>
      <Button
        title="Switch to English"
        onPress={() => i18n.changeLanguage("en")}
      />
      <Button
        title="Switch to Polish"
        onPress={() => i18n.changeLanguage("pl")}
      />
    </View>
  );
}
