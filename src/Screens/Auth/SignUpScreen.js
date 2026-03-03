import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from '../../components/UI/CustomText';
import Button from '../../components/UI/Button';
import TextInput from '../../components/UI/TextInput';
import { Colors } from '../../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const SignUpScreen = ({ navigation }) => {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password) return alert('Please fill in all fields');
        if (password !== confirmPassword) return alert('Passwords do not match');

        setLoading(true);
        try {
            const { session, user } = await signUp(email, password);

            if (session) {
                // Auto-logged in
                // Navigation to FillProfile handled by AppNavigator state change or distinct nav if persistent
                // For now, let's wait for state change or nudge it? 
                // Actually AppNavigator handles it if session updates in context.
            } else if (user && !session) {
                // User created but no session -> Likely email confirmation required
                alert('Account created! Please check your email to verify your account before logging in.');
                navigation.navigate('SignIn');
            }
        } catch (error) {
            alert(error.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.backContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.dark} />
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <CustomText type="heading" size={24} weight="bold" style={styles.title}>Create Account</CustomText>
                        <CustomText type="label" color={Colors.text.secondary} style={styles.subtitle}>
                            Fill your information below or register with your social account.
                        </CustomText>
                    </View>

                    <View style={styles.form}>
                        <CustomText type="label" style={styles.label}>Email</CustomText>
                        <TextInput
                            placeholder="example@gmail.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <CustomText type="label" style={styles.label}>Password</CustomText>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="*************"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                style={{ flex: 1, marginBottom: 0 }}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={Colors.text.light} />
                            </TouchableOpacity>
                        </View>

                        <CustomText type="label" style={styles.label}>Confirm Password</CustomText>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="*************"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                                style={{ flex: 1, marginBottom: 0 }}
                            />
                        </View>

                        <Button
                            title={loading ? "Signing Up..." : "Sign Up"}
                            onPress={handleSignUp}
                            style={styles.signUpBtn}
                            disabled={loading}
                        />

                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <CustomText type="caption" color={Colors.text.light} style={styles.orText}>Or sign up with</CustomText>
                            <View style={styles.divider} />
                        </View>

                        <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialBtn}>
                                <Ionicons name="logo-apple" size={24} color={Colors.social.apple} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialBtn}>
                                <Ionicons name="logo-google" size={24} color={Colors.social.google} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialBtn}>
                                <Ionicons name="logo-facebook" size={24} color={Colors.social.facebook} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <CustomText type="label">Already have an account? </CustomText>
                            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                                <CustomText type="label" color={Colors.primary} weight="bold">Sign In</CustomText>
                            </TouchableOpacity>
                        </View>
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
    backContainer: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 24,
        paddingTop: 10,
        flexGrow: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        maxWidth: '80%',
    },
    form: {
        flex: 1,
    },
    label: {
        marginBottom: 8,
        fontWeight: '500',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    eyeIcon: {
        position: 'absolute',
        right: 12,
        top: 14,
    },
    signUpBtn: {
        marginTop: 16,
        marginBottom: 40,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    orText: {
        marginHorizontal: 12,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    socialBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    }
});

export default SignUpScreen;
