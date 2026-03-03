import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform, Linking, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../../components/UI/CustomText';
import Button from '../../components/UI/Button';
import { Colors } from '../../styles/colors';
import Card from '../../components/UI/Card';


import { useCart } from '../../context/CartContext';
import { STATUS_STEPS } from '../../constants/constants';
import { getStatusIndex } from '../../helpers/status_helper';



const TrackOrderScreen = ({ navigation, route }) => {
    const { orderId } = route.params;
    const { orders, refreshOrder } = useCart();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await refreshOrder(orderId);
        setRefreshing(false);
    }, [orderId, refreshOrder]);

    const order = orders.find(o => o.id === orderId);



    if (!order) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text.dark} />
                    </TouchableOpacity>
                    <CustomText type="subheading" weight="bold">Order Not Found</CustomText>
                </View>
            </SafeAreaView>
        );
    }

    const currentStatusIndex = getStatusIndex(order.status);

    const worker = order?.worker_assignments?.[0]?.workers




    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.dark} />
                </TouchableOpacity>
                <CustomText type="subheading" weight="bold">Track Order</CustomText>
                <TouchableOpacity onPress={() => { }} style={styles.supportButton}>
                    <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.orderHeader}>
                    <View>
                        <CustomText type="label" style={styles.orderId}>Order #{order.id.slice(0, 8)}</CustomText>
                        <CustomText type="caption" color={Colors.text.light}>
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                        </CustomText>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: Colors.tints.primaryLight }]}>
                        <CustomText size={12} color={Colors.primary} weight="bold">{order.status}</CustomText>
                    </View>
                </View>

                <View style={styles.timelineContainer}>
                    {order.status === 'Cancelled' ? (
                        <View style={styles.cancelledContainer}>
                            <View style={styles.cancelledIcon}>
                                <Ionicons name="close-circle" size={40} color={Colors.error} />
                            </View>
                            <CustomText weight="bold" color={Colors.error} size={18}>Order Cancelled</CustomText>
                            <CustomText color={Colors.text.secondary} align="center" style={{ marginTop: 8 }}>
                                This order has been cancelled and will not be processed further.
                            </CustomText>
                        </View>
                    ) : (
                        STATUS_STEPS.map((step, index) => {
                            const isCompleted = index <= currentStatusIndex;
                            const isCurrent = index === currentStatusIndex;
                            const isLast = index === STATUS_STEPS.length - 1;

                            return (
                                <View key={index} style={styles.stepRow}>
                                    <View style={styles.stepIndicator}>
                                        <View style={[
                                            styles.circle,
                                            isCompleted ? styles.activeCircle : styles.inactiveCircle
                                        ]}>
                                            {isCompleted && !isCurrent ? (
                                                <Ionicons name="checkmark" size={14} color="white" />
                                            ) : isCurrent ? (
                                                <View style={styles.currentDot} />
                                            ) : null}
                                        </View>
                                        {!isLast && (
                                            <View style={[
                                                styles.line,
                                                isCompleted && (index < currentStatusIndex) ? styles.activeLine : styles.inactiveLine
                                            ]} />
                                        )}
                                    </View>
                                    <View style={styles.stepContent}>
                                        <CustomText weight={isCurrent ? "bold" : "regular"} color={isCompleted ? Colors.text.primary : Colors.text.light}>
                                            {step.title}
                                        </CustomText>
                                        {isCurrent && (
                                            <CustomText type="caption" color={Colors.primary}>Currently here</CustomText>
                                        )}
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>

                {/* Worker Details - Show only if Worker Assigned or later */}
                {worker && ( // Index 2 is 'Worker Assigned'
                    <View style={styles.section}>
                        <CustomText type="label" weight="bold" style={styles.sectionTitle}>Worker Details</CustomText>
                        <Card style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <View style={styles.workerAvatar}>
                                    <Ionicons name="person" size={24} color={Colors.primary} />
                                </View>
                                <View style={styles.infoText}>
                                    <CustomText weight="bold">{order.worker_assignments[0].workers.name}</CustomText>
                                    <View style={styles.ratingRow}>
                                        <Ionicons name="star" size={14} color={Colors.warning} />
                                        <CustomText size={12} style={{ marginLeft: 4 }}>{worker.rating} • {worker.experience} years exp</CustomText>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.callButton}
                                    onPress={() => {
                                        Linking.openURL(`tel:${worker.phone}`)
                                    }}
                                >
                                    <Ionicons name="call" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    </View>
                )}

                {/* Vehicle Details */}
                {order.vehicles && (
                    <View style={styles.section}>
                        <CustomText type="label" weight="bold" style={styles.sectionTitle}>Vehicle</CustomText>
                        <Card style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <Ionicons name="car-sport" size={20} color={Colors.primary} />
                                <View style={styles.infoText}>
                                    <CustomText weight="bold">{order.vehicles.brand} {order.vehicles.model}</CustomText>
                                    <CustomText type="caption">{order.vehicles.number} • {order.vehicles.fuel}</CustomText>
                                </View>
                            </View>
                        </Card>
                    </View>
                )}



                {/* Address Details */}
                {order.addresses && (
                    <View style={styles.section}>
                        <CustomText type="label" weight="bold" style={styles.sectionTitle}>Service Location</CustomText>
                        <Card style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <Ionicons name="location" size={20} color={Colors.primary} />
                                <View style={styles.infoText}>
                                    <CustomText weight="bold">{order.addresses.label}</CustomText>
                                    <CustomText type="caption">
                                        {order.addresses.house}, {order.addresses.street}, {order.addresses.area}, {order.addresses.city} - {order.addresses.pincode}
                                    </CustomText>
                                </View>
                            </View>
                        </Card>
                    </View>
                )}

                {/* Scheduled Time */}
                {(order.scheduled_date || order.scheduled_time) && (
                    <View style={styles.section}>
                        <CustomText type="label" weight="bold" style={styles.sectionTitle}>Scheduled Slot</CustomText>
                        <Card style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <Ionicons name="calendar" size={20} color={Colors.primary} />
                                <View style={styles.infoText}>
                                    <CustomText weight="bold">{order.scheduled_date}</CustomText>
                                    <CustomText type="caption">{order.scheduled_time}</CustomText>
                                </View>
                            </View>
                        </Card>
                    </View>
                )}

                {/* Order Items */}
                <View style={styles.section}>
                    <CustomText type="label" weight="bold" style={styles.sectionTitle}>Bill Details</CustomText>
                    <Card style={styles.billCard}>
                        {order.order_items?.map((item, idx) => {
                            const isService = item.item_type === 'service';
                            return (
                                <View key={idx} style={styles.itemContainer}>
                                    <View style={styles.itemRow}>
                                        <CustomText>{item.name} x {item.quantity}</CustomText>
                                        <CustomText weight="bold">₹{item.price * item.quantity}</CustomText>
                                    </View>
                                    {isService && (
                                        <View style={styles.itemBreakdown}>
                                            {(item.electricity_available === false) && (
                                                <CustomText type="caption" color={Colors.text.secondary} size={10}>
                                                    • Includes Electricity Fee
                                                </CustomText>
                                            )}
                                            {(item.water_available === false) && (
                                                <CustomText type="caption" color={Colors.text.secondary} size={10}>
                                                    • Includes Water Fee
                                                </CustomText>
                                            )}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                        <View style={styles.divider} />
                        <View style={styles.totalRow}>
                            <CustomText weight="bold">Total Amount</CustomText>
                            <CustomText weight="bold" color={Colors.primary} size={18}>₹{order.total_amount}</CustomText>
                        </View>
                    </Card>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Need Help?"
                    onPress={() => { }}
                    outline
                    style={styles.helpBtn}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: Colors.card,
    },
    backButton: {
        padding: 8,
    },
    supportButton: {
        padding: 8,
    },
    scrollContent: {
        padding: 16,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    orderId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    timelineContainer: {
        marginBottom: 32,
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 12,
    },
    cancelledContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    cancelledIcon: {
        marginBottom: 12,
    },
    stepRow: {
        flexDirection: 'row',
        minHeight: 50,
    },
    stepIndicator: {
        alignItems: 'center',
        marginRight: 16,
        width: 24,
    },
    circle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    activeCircle: {
        backgroundColor: Colors.primary,
    },
    inactiveCircle: {
        backgroundColor: Colors.gray[200],
    },
    currentDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    line: {
        width: 2,
        flex: 1,
        backgroundColor: Colors.gray[200],
    },
    activeLine: {
        backgroundColor: Colors.primary,
    },
    inactiveLine: {
        backgroundColor: Colors.gray[200],
    },
    stepContent: {
        flex: 1,
        paddingBottom: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 12,
        fontSize: 14,
        color: Colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    infoCard: {
        padding: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        marginLeft: 12,
        flex: 1,
    },
    billCard: {
        padding: 16,
    },
    itemContainer: {
        marginBottom: 12,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemBreakdown: {
        marginTop: 2,
        paddingLeft: 8,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footer: {
        padding: 16,
        backgroundColor: Colors.card,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    helpBtn: {
        width: '100%',
    },
    workerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.tints.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    callButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.success,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default TrackOrderScreen;
