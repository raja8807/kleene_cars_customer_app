import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../../components/UI/CustomText";
import Button from "../../components/UI/Button";
import TextInput from "../../components/UI/TextInput";
import { Colors } from "../../styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

const FillProfileScreen = ({ navigation }) => {
  const { completeProfile, logout, session, userData } = useAuth();

  const [name, setName] = useState("");
  const phone = session.user.email.split("@")[0];
  const [gender, setGender] = useState(""); // Simple select
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleComplete = async () => {
    if (!name || !phone || !gender || !email)
      return alert("Please fill in all fields");
    try {
      setIsLoading(true);
      await completeProfile({ name, phone, gender, email });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (userData === undefined) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.dark} />
        </TouchableOpacity>
        <CustomText type="subheading" weight="bold">
          Complete Your Profile
        </CustomText>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* <Button title="Logout" onPress={logout} /> */}

          <View style={styles.form}>
            <CustomText type="label" style={styles.label}>
              Phone Number
            </CustomText>
            <View style={styles.phoneContainer}>
              <TextInput
                placeholder="Enter Phone Number"
                value={phone}
                readOnly
                keyboardType="phone-pad"
                style={{ flex: 1, marginBottom: 0 }}
              />

              <View>
                <CustomText type="label" style={styles.label}>
                  Name
                </CustomText>
                <TextInput
                  placeholder="Ex. John Doe"
                  value={name}
                  onChangeText={setName}
                />
                <CustomText type="label" style={styles.label}>
                  Email
                </CustomText>
                <TextInput
                  placeholder="Ex. John Doe"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType={"email-address"}
                />

                <CustomText type="label" style={styles.label}>
                  Gender
                </CustomText>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                >
                  <CustomText
                    color={gender ? Colors.text.primary : Colors.text.light}
                  >
                    {gender || "Select"}
                  </CustomText>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={Colors.text.light}
                  />
                </TouchableOpacity>

                {showGenderDropdown && (
                  <View style={styles.dropdownList}>
                    {["Male", "Female", "Other"].map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setGender(opt);
                          setShowGenderDropdown(false);
                        }}
                      >
                        <CustomText>{opt}</CustomText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Button
                  title="Complete Profile"
                  loading={isLoading}
                  onPress={handleComplete}
                  style={styles.completeBtn}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 24,
    paddingTop: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray[100],
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  form: {
    flex: 1,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
  },
  phoneContainer: {
    gap: 20,
    marginBottom: 16,
  },
  countryCode: {
    height: 50,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    marginRight: 8,
  },
  dropdown: {
    height: 50,
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dropdownList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  completeBtn: {
    marginTop: 24,
  },
});

export default FillProfileScreen;
