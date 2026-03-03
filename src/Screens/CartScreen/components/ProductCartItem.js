import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CustomText from '../../../components/UI/CustomText';
import { Colors } from '../../../styles/colors';
import { Ionicons } from '@expo/vector-icons';

const ProductCartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <CustomText weight="bold" numberOfLines={1}>{item.name}</CustomText>
                <CustomText type="caption" color={Colors.text.secondary}>Product</CustomText>
                <CustomText color={Colors.primary} weight="medium">₹{item.discountPrice}</CustomText>
            </View>

            <View style={styles.actions}>
                <View style={styles.quantity}>
                    <TouchableOpacity onPress={() => onUpdateQuantity(item.id, 'product', -1)} style={styles.qtyBtn}>
                        <CustomText>-</CustomText>
                    </TouchableOpacity>
                    <CustomText style={styles.qtyText}>{item.quantity}</CustomText>
                    <TouchableOpacity onPress={() => onUpdateQuantity(item.id, 'product', 1)} style={styles.qtyBtn}>
                        <CustomText>+</CustomText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: Colors.card,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 6,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    actions: {
        alignItems: 'flex-end',
    },
    quantity: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray[100],
        borderRadius: 6,
    },
    qtyBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    qtyText: {
        marginHorizontal: 4,
        fontWeight: 'bold',
    }
});

export default ProductCartItem;
