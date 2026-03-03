import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from '../../../components/UI/CustomText';
import { Colors } from '../../../styles/colors';
import { Ionicons } from '@expo/vector-icons';

const ServiceCartItem = ({ item, onRemove }) => {
    const calculateTotalPrice = () => {
        let price = item.discountPrice;
        if (item.resourceAvailability) {
            if (item.water_required && !item.resourceAvailability.water) {
                price += item.water_price || 0;
            }
            if (item.electricity_required && !item.resourceAvailability.electricity) {
                price += item.electricity_price || 0;
            }
        }
        return price;
    };

    const waterExtra = item.resourceAvailability && item.water_required && !item.resourceAvailability.water ? (item.water_price || 0) : 0;
    const electricityExtra = item.resourceAvailability && item.electricity_required && !item.resourceAvailability.electricity ? (item.electricity_price || 0) : 0;
    const totalExtra = waterExtra + electricityExtra;

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <CustomText weight="bold">{item.name}</CustomText>
                <CustomText type="caption" color={Colors.text.secondary}>Service • ₹{item.discountPrice}</CustomText>

                {totalExtra > 0 && (
                    <View style={styles.breakdown}>
                        {waterExtra > 0 && (
                            <CustomText type="caption" color={Colors.text.secondary} size={10}>+ ₹{waterExtra} (Water Fee)</CustomText>
                        )}
                        {electricityExtra > 0 && (
                            <CustomText type="caption" color={Colors.text.secondary} size={10}>+ ₹{electricityExtra} (Electricity Fee)</CustomText>
                        )}
                    </View>
                )}

                <CustomText color={Colors.primary} weight="medium" style={styles.totalPrice}>₹{calculateTotalPrice()}</CustomText>
            </View>
            <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
                <Ionicons name="trash-outline" size={20} color={Colors.error} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: Colors.card,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    info: {
        flex: 1,
    },
    removeBtn: {
        padding: 8,
    },
    breakdown: {
        marginTop: 2,
    },
    totalPrice: {
        marginTop: 4,
    }
});

export default ServiceCartItem;
