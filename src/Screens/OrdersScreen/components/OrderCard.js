import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from '../../../components/UI/CustomText';
import { Colors } from '../../../styles/colors';
import { useNavigation } from '@react-navigation/native';

const OrderCard = ({ order }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('TrackOrder', { orderId: order.id })}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <CustomText weight="bold">Order {order.id.slice(0, 8)}</CustomText>
                    <CustomText type="caption" color={Colors.text.light}>{new Date(order.created_at).toLocaleDateString()}</CustomText>
                </View>

                <View style={styles.divider} />

                <View style={styles.details}>
                    <CustomText>Items: {order.order_items ? order.order_items.length : 0}</CustomText>
                    <CustomText weight="bold" color={Colors.primary}>₹{order.total_amount}</CustomText>
                </View>

                <View style={styles.footer}>
                    <View style={[
                        styles.statusBadge,
                        {
                            backgroundColor:
                                order.status === 'Completed' ? Colors.tints.successLight :
                                    order.status === 'Cancelled' ? Colors.tints.errorLight :
                                        Colors.tints.infoLight
                        }
                    ]}>
                        <CustomText
                            size={12}
                            weight="bold"
                            color={
                                order.status === 'Completed' ? Colors.success :
                                    order.status === 'Cancelled' ? Colors.error :
                                        Colors.primary
                            }
                        >
                            {order.status}
                        </CustomText>
                    </View>
                    <View>
                        <CustomText color={Colors.primary} size={12}>View Details</CustomText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.card,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 12,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    }
});

export default OrderCard;
