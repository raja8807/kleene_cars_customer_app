import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../context/CartContext';
import CustomText from '../../components/UI/CustomText';
import OrderCard from './components/OrderCard';
import { Colors } from '../../styles/colors';

const OrdersScreen = () => {
    const { orders } = useCart();
    const [activeTab, setActiveTab] = useState('Ongoing');

    const displayOrders = orders.filter(order => {
        if (activeTab === 'Ongoing') {
            return order.status !== 'Completed' && order.status !== 'Cancelled';
        }
        return order.status === 'Completed' || order.status === 'Cancelled';
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <CustomText type="heading">My Orders</CustomText>
            </View>

            <View style={styles.tabs}>
                {['Ongoing', 'Completed'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <CustomText
                            color={activeTab === tab ? Colors.primary : Colors.text.secondary}
                            weight={activeTab === tab ? 'bold' : 'regular'}
                        >
                            {tab}
                        </CustomText>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={displayOrders}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <OrderCard order={item} />}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <CustomText>No {activeTab.toLowerCase()} orders</CustomText>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: 16,
        backgroundColor: 'white',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    tab: {
        marginRight: 24,
        paddingVertical: 12,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
    },
    list: {
        padding: 16,
    },
    empty: {
        alignItems: 'center',
        marginTop: 40,
    }
});

export default OrdersScreen;
