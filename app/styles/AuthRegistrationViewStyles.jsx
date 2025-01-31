import { StyleSheet } from "react-native";
import { globalStyles } from "../utils/style";

export const styles = StyleSheet.create({
  registerPanel: {
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
  mainBtns: {
    paddingVertical: 15,
    borderRadius: globalStyles.BORDER_RADIUS,
    alignItems: "center",
  },
  registerBtn: {
    backgroundColor: globalStyles.primaryColor,
    marginTop: 20,
  },
  mainBtnText: {
    color: globalStyles.textOnPrimaryColor,
    fontSize: 16,
    fontWeight: "bold",
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: globalStyles.backgroundColor,
    padding: 20,
    borderRadius: globalStyles.BORDER_RADIUS,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: globalStyles.primaryColor,
    padding: 10,
    borderRadius: globalStyles.BORDER_RADIUS,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
