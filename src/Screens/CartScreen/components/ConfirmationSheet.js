import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import CustomText from "../../../components/UI/CustomText";
import Button from "../../../components/UI/Button";
import { Colors } from "../../../styles/colors";
import { Ionicons } from "@expo/vector-icons";
import TextInput from "../../../components/UI/TextInput";

const { height } = Dimensions.get("window");

const ConfirmationSheet = ({ visible, onClose, onConfirm, isLoading }) => {
  const [additionalNotes, setAdditionalNotes] = useState("");

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <CustomText type="subheading" weight="bold">
              Confirm Order Requirements
            </CustomText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>


          <TextInput
            value={additionalNotes}
            label={"Additional Notes"}
            placeholder={"Type your message.."}
            multiline
            numberOfLines={4}
            onChangeText={setAdditionalNotes}
          />


          <Button
            title="Confirm Order"
            onPress={() => onConfirm(additionalNotes)}
            style={styles.confirmBtn}
            loading={isLoading}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  confirmBtn: {
    width: "100%",
  },
});

export default ConfirmationSheet;
