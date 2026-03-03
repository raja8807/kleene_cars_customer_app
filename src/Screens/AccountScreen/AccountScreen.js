import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from '../../components/UI/CustomText';
import { Colors } from '../../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const MenuItem = ({ icon, title, isLogout, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuLeft}>
            <View style={[styles.iconContainer, isLogout && styles.logoutIcon]}>
                <Ionicons name={icon} size={20} color={isLogout ? Colors.error : Colors.primary} />
            </View>
            <CustomText style={[styles.menuText, isLogout && { color: Colors.error }]}>{title}</CustomText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
    </TouchableOpacity>
);

const AccountScreen = () => {
    const { logout, userData } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            // Navigation to Auth stack is usually handled by AppNavigator listening to auth state
        } catch (error) {
            console.log("Logout failed", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileInfo}>
                    <Image source={{ uri: userData?.avatar_url || 'https://via.placeholder.com/100' }} style={styles.avatar} />
                    <View>
                        <CustomText type="subheading" weight="bold">{userData?.full_name || 'User'}</CustomText>
                        <CustomText type="caption">{userData?.phone || 'No phone'}</CustomText>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <MenuItem icon="car-sport" title="My Vehicles" />
                    <MenuItem icon="location" title="My Addresses" />
                    <MenuItem icon="person" title="Account Details" />
                </View>

                <View style={styles.section}>
                    <MenuItem icon="help-buoy" title="Support" />
                    <MenuItem icon="document-text" title="Terms & Conditions" />
                </View>

                <View style={styles.section}>
                    <MenuItem icon="log-out" title="Logout" isLogout onPress={handleLogout} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        backgroundColor: Colors.card,
        padding: 20,
        marginBottom: 16,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
        backgroundColor: Colors.tints.primaryLight,
    },
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: Colors.card,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.tints.primaryVeryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    logoutIcon: {
        backgroundColor: Colors.tints.errorLight,
    },
    menuText: {
        fontSize: 16,
    }
});

export default AccountScreen;
