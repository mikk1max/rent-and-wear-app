import React from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { globalStyles } from "../utils/style";

const ErrorModal = ({ isVisible, onClose, title, message }) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {title}
          </Text>
          <Text style={styles.modalMessage}>
            {message}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>{t("universal.closeBtn")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: globalStyles.textOnPrimaryColor,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: globalStyles.primaryColor,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: globalStyles.textOnSecondaryColor,
  },
  modalButton: {
    backgroundColor: globalStyles.primaryColor,
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: globalStyles.textOnPrimaryColor,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ErrorModal;
