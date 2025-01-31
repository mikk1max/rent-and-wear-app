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
  loginPanel: {
    flex: 1,
    width: "100%",
  },
  imgStyles: {
    resizeMode: "cover",
    width: "100%",
    height: 250,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 20,
    color: globalStyles.primaryColor,
  },
  inputStyle: {
    color: globalStyles.primaryColor,
    backgroundColor: globalStyles.secondaryColor,
    padding: 15,
    borderRadius: globalStyles.BORDER_RADIUS,
  },
  forgotPass: {
    color: globalStyles.primaryColor,
    alignSelf: "flex-end",
    fontWeight: "bold",
    marginVertical: 15,
  },
  orText: {
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    alignSelf: "center",
    fontWeight: "bold",
    color: globalStyles.primaryColor,
  },
  mainBtns: {
    paddingVertical: 15,
    borderRadius: globalStyles.BORDER_RADIUS,
    alignItems: "center",
  },
  loginBtn: {
    backgroundColor: globalStyles.primaryColor,
  },
  anotherBtn: {
    backgroundColor: globalStyles.secondaryColor,
    flex: 1,
    justifyContent: "center",
  },
  mainBtnText: {
    color: globalStyles.textOnPrimaryColor,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
