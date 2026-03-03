import React from 'react';
import { View, StyleSheet, Modal, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import CustomText from '../UI/CustomText';
import Button from '../UI/Button';
import { Colors } from '../../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import ResourceRequirementSheet from './ResourceRequirementSheet';

const { height } = Dimensions.get('window');

const ServiceDetailsSheet = ({ visible, onClose, service, onAdd, isAdded }) => {
    const [showRequirement, setShowRequirement] = React.useState(false);
    if (!service) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Image source={{ uri: service.image }} style={styles.image} resizeMode="cover" />

                        <View style={styles.content}>
                            <CustomText type="heading" style={styles.title}>{service.name}</CustomText>
                            <View style={styles.priceRow}>
                                <CustomText type="subheading" color={Colors.primary} weight="bold">₹{service.discountPrice}</CustomText>
                                {service.price > service.discountPrice && (
                                    <CustomText style={styles.originalPrice}>₹{service.price}</CustomText>
                                )}
                            </View>

                            <CustomText type="label" style={styles.sectionTitle}>Description</CustomText>
                            <CustomText style={styles.description}>{service.description}</CustomText>

                            <CustomText type="label" style={styles.sectionTitle}>What's Included</CustomText>
                            <View style={styles.bulletPoint}>
                                <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
                                <CustomText style={styles.bulletText}>Complete Exterior Wash</CustomText>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
                                <CustomText style={styles.bulletText}>Tyre Dressing</CustomText>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Ionicons name="checkmark-circle" size={16} color={Colors.secondary} />
                                <CustomText style={styles.bulletText}>Interior Vacuum</CustomText>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        {isAdded ? (
                            <View style={styles.addedContainer}>
                                <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                                <CustomText color={Colors.success} weight="bold" style={{ marginLeft: 8 }}>Added to Cart</CustomText>
                            </View>
                        ) : (
                            <Button title="Add Service to Cart" onPress={() => {
                                if (service.water_required || service.electricity_required) {
                                    setShowRequirement(true);
                                } else {
                                    onAdd();
                                }
                            }} style={styles.addBtn} />
                        )}
                    </View>
                </View>
            </View>

            <ResourceRequirementSheet
                visible={showRequirement}
                service={service}
                onClose={() => setShowRequirement(false)}
                onConfirm={(availability) => {
                    setShowRequirement(false);
                    onAdd(availability);
                }}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: height * 0.75,
        padding: 20,
        paddingBottom: 40,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
        zIndex: 1,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 16,
    },
    content: {
        flex: 1,
    },
    title: {
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        marginLeft: 10,
        color: '#999',
    },
    sectionTitle: {
        marginTop: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    description: {
        lineHeight: 20,
        color: '#666',
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    bulletText: {
        marginLeft: 8,
        color: '#555',
    },
    footer: {
        marginTop: 16,
    },
    addBtn: {
        width: '100%',
    },
    addedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#E8F5E9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.success,
    }
});

export default ServiceDetailsSheet;
