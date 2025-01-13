import { Button, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import i18n from "../utils/i18n";
import { globalStyles } from "../utils/style";
import { useTranslation } from "react-i18next";
import { Divider } from "react-native-elements";

export default function LanguageSwitcher({ toggleDropdown }) {
  const { t } = useTranslation();

  return (
    <View style={styles.dropdown}>
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => {
          i18n.changeLanguage("en");
          toggleDropdown();
        }}
        disabled={i18n.language === "en" && true}
      >
        {/* <Icon name="settings" {...iconParams} /> */}
        <Text
          style={[
            styles.dropdownText,
            i18n.language === "en" && styles.currentLangText,
          ]}
        >
          {t("languages.en")}
        </Text>
      </TouchableOpacity>

      <Divider style={{ borderWidth: 0.2 }} />

      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => {
          i18n.changeLanguage("pl");
          toggleDropdown();
        }}
        disabled={i18n.language === "pl" && true}
      >
        {/* <Icon name="settings" {...iconParams} /> */}
        <Text
          style={[
            styles.dropdownText,
            i18n.language === "pl" && styles.currentLangText,
          ]}
        >
          {t("languages.pl")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: globalStyles.secondaryColor,
    marginTop: -30,
    paddingTop: 20,
    zIndex: -1,
    borderBottomLeftRadius: globalStyles.BORDER_RADIUS,
    borderBottomRightRadius: globalStyles.BORDER_RADIUS,
  },
  dropdownItem: {
    margin: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: globalStyles.primaryColor,
    textAlign: "center",
  },
  currentLangText: {
    fontWeight: "800",
  },
  currentLangItem: {
    backgroundColor: "grey",
  },
});
