// InputWithLabel.js
import React from "react";
import { Text, TouchableOpacity, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";
import { styles } from "../styles/SettingsViewStyles";
import { useTranslation } from "react-i18next";

const InputWithLabel = ({
  control,
  name,
  placeholder,
  errors,
  editable,
  onEdit,
  inputStyle,
  label,
  validationRules,
  defaultValue,
  isWithEditBtn = false,
  isSecure = false,
  isAutoCorrect = false,
}) => {


  const {t} = useTranslation()

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {isWithEditBtn && (
          <TouchableOpacity
            style={styles.buttonEdit}
            activeOpacity={globalStyles.ACTIVE_OPACITY}
            onPress={onEdit}
          >
            <Text style={styles.buttonText}>{t("inputField.editButton")}</Text>
          </TouchableOpacity>
        )}
      </View>

      {errors && errors[name] && (
        <View style={styles.textErrorContainer}>
          <Text style={styles.textError}>{errors[name]?.message}</Text>
        </View>
      )}

      <Controller
        control={control}
        rules={validationRules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={inputStyle}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            autoCapitalize="none"
            autoComplete="given-name"
            inputMode="text"
            editable={editable}
            secureTextEntry={isSecure}
            autoCorrect={isAutoCorrect}
          />
        )}
        name={name}
      />
    </View>
  );
};

export default InputWithLabel;
