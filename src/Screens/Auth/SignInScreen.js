import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "../../components/UI/CustomText";
import Button from "../../components/UI/Button";
import TextInput from "../../components/UI/TextInput";
import { Colors } from "../../styles/colors";
import { supabase } from "../../lib/supabase";
import axios from "axios";
import { API_URL } from "../../constants/api";

const SignInScreen = ({ navigation }) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const sendotp = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/otp/send`,
        {
          phone,
        },
      );

      setOtp(res?.data?.otp);
      setIsOtpSent(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      await supabase.auth.verifyOtp({
        email: `${phone}@kleenecars.app`,
        type: "magiclink",
        token: otp,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(true);
    }
  };

  const handleChangeNumber = () => {
    setIsOtpSent(false);
    setOtp("");
    setPhone("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <CustomText>{API_URL}</CustomText>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            <View style={styles.mobile}>
              <Image
                source={require("../../../assets/mobile_verification.png")}
                style={styles.image}
              />

              <View style={styles.text}>
                <CustomText
                  type="heading"
                  size={24}
                  weight="bold"
                  style={styles.title}
                >
                  {isOtpSent
                    ? "Enter Verification Code"
                    : "Enter Your Mobile Number"}
                </CustomText>
                <CustomText
                  type="label"
                  color={Colors.text.secondary}
                  style={styles.subtitle}
                >
                  A confirmation code has been sent to ypur mobile
                </CustomText>
              </View>

              {!isOtpSent && (
                <View>
                  <TextInput
                    placeholder={"Phone Number"}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType={"number-pad"}
                  />
                  <Button
                    title={"Send OTP"}
                    loading={loading}
                    onPress={sendotp}
                    style={styles.signInBtn}
                    disabled={loading}
                  />
                </View>
              )}

              {isOtpSent && (
                <View>
                  <TextInput
                    placeholder={"Verification Code"}
                    maxLength={8}
                    keyboardType={"number-pad"}
                    value={otp}
                    onChangeText={setOtp}
                  />
                  <Button
                    title={"Verify"}
                    onPress={verifyOtp}
                    loading={loading}
                    style={styles.signInBtn}
                    disabled={loading}
                  />
                  <View style={styles.resend}>
                    <TouchableOpacity onPress={handleChangeNumber}>
                      <CustomText
                        type="label"
                        color={Colors.gray}
                        weight="bold"
                      >
                        Change number
                      </CustomText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={sendotp}>
                      <CustomText
                        type="label"
                        color={Colors.primary}
                        weight="bold"
                      >
                        Resend OTP
                      </CustomText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* <View style={styles.footer}>
              <CustomText type="label">
                By continue you are agreeing to the{" "}
              </CustomText>
              <TouchableOpacity onPress={() => {}}>
                <CustomText type="label" color={Colors.primary} weight="bold">
                  Terms & Conditions
                </CustomText>
              </TouchableOpacity>
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },

  image: {
    height: 180,
    width: 180,
    margin: "auto",
    marginTop: 20,
  },
  form: {
    flex: 1,
    justifyContent: "space-between",
  },

  mobile: {
    gap: 20,
  },

  text: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },

  resend: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default SignInScreen;
