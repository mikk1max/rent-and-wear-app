import { StyleSheet } from "react-native";
import { globalStyles } from "../utils/style";

export const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
    fontSize: 16,
  },
  buttonsHidden: {
    display: "none",
  },
  forgotPass: {
    fontFamily: "Poppins_500Medium",
    textAlign: "right",
    marginBottom: 10,
    color: "blue",
  },
  loginBtn: {
    backgroundColor: globalStyles.primaryColor,
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
  },
  loginBtnText: {
    fontFamily: "WorkSans_900Black",
    color: globalStyles.textOnPrimaryColor,
    fontSize: 18,
    textAlign: "center",
  },
});
