import React from "react";
import { TextInput as RNTextInput, View, StyleSheet } from "react-native";
import CustomText from "./CustomText";

const TextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  style,
  maxLength,
  keyboardType,
  readOnly,
  multiline,
  numberOfLines,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <CustomText type="label" style={styles.label}>
          {label}
        </CustomText>
      )}
      <RNTextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#999"
        maxLength={maxLength}
        keyboardType={keyboardType}
        readOnly={readOnly}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});

export default TextInput;
