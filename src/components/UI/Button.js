import React, { Activity } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import CustomText from './CustomText';
import { Colors } from '../../styles/colors';

const Button = ({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle,
    disabled,
    loading
}) => {
    const isPrimary = variant === 'primary';
    const backgroundColor = isPrimary ? Colors.primary : 'transparent';
    const textColor = isPrimary ? '#FFFFFF' : Colors.primary;
    const borderColor = isPrimary ? 'transparent' : Colors.primary;

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor, borderColor, borderWidth: isPrimary ? 0 : 1, opacity: disabled ? 0.5 : 1 },
                style
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled || loading}
        >
            {
                loading ?
                    <ActivityIndicator />
                    : <CustomText
                        type="label"
                        style={[styles.text, { color: textColor }, textStyle]}
                        weight="medium"
                        size={16}
                    >
                        {title}
                    </CustomText>
            }
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
    }
});

export default Button;
