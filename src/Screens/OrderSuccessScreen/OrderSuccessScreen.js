import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../../components/UI/CustomText';
import Button from '../../components/UI/Button';
import { Colors } from '../../styles/colors';

const { width } = Dimensions.get('window');

const OrderSuccessScreen = ({ navigation }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const timeoutInSeconds = 5;

    const [seconds, setSeconds] = useState(timeoutInSeconds);

    useEffect(() => {
        // Start Animation
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto Close Timer
        const timer = setTimeout(() => {
            handleClose();
        }, 5000);

        const interval = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        }
    }, []);

    const handleClose = () => {
        // Reset navigation to Home/Orders to prevent going back to Success screen
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }], // Assuming Main is the Tab Navigator, which defaults to Home
        });
        // Alternatively Navigate to Orders specifically:
        // navigation.navigate('TrackOrder'); // Or Orders Tab
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <Ionicons name="checkmark-circle" size={100} color={Colors.success} />
                </Animated.View>

                <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                    <CustomText type="heading" style={styles.title}>Order Placed!</CustomText>
                    <CustomText color={Colors.text.secondary} style={styles.subtitle}>
                        Your order has been placed successfully.
                    </CustomText>
                    <CustomText color={Colors.text.light} size={12} style={{ marginTop: 20 }}>
                        Redirecting in {seconds} seconds...
                    </CustomText>
                </Animated.View>
            </View>

            <View style={styles.footer}>
                <Button title="Go to Home" onPress={handleClose} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        marginBottom: 30,
    },
    title: {
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
    },
    footer: {
        width: '100%',
        padding: 20,
    }
});

export default OrderSuccessScreen;
