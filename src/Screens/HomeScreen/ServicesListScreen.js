import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../styles/colors';
import CustomText from '../../components/UI/CustomText';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import { useCatalog } from '../../context/CatalogContext';
import { useCart } from '../../context/CartContext';
import ServiceDetailsSheet from '../../components/Common/ServiceDetailsSheet';
import ResourceRequirementSheet from '../../components/Common/ResourceRequirementSheet';
import { Ionicons } from '@expo/vector-icons';

const ServicesListScreen = ({ navigation, route }) => {
    const { category } = route.params || {};
    const categoryName = category?.name || 'Services';

    const { getServicesByCategory } = useCatalog();
    const [filteredServices, setFilteredServices] = useState([]);

    useEffect(() => {
        if (category) {
            setFilteredServices(getServicesByCategory(category.id));
        } else {
            // Fallback or show all? CatalogContext fetches all, so might need a 'getAllServices' or just pass empty
            setFilteredServices([]);
        }
    }, [category]);
    const { addToCart, cartItems } = useCart();
    const [selectedService, setSelectedService] = useState(null);
    const [serviceForRequirement, setServiceForRequirement] = useState(null);

    const isServiceInCart = (serviceId) => {
        return cartItems.some(item => item.id === serviceId && item.type === 'service');
    };

    const handleAdd = (item) => {
        if (!isServiceInCart(item.id)) {
            if (item.water_required || item.electricity_required) {
                setServiceForRequirement(item);
            } else {
                addToCart(item, 'service');
            }
        }
    };

    const handleConfirmRequirement = (availability) => {
        if (serviceForRequirement) {
            addToCart(serviceForRequirement, 'service', availability);
            setServiceForRequirement(null);
        }
    };

    const handleSelect = (item) => {
        setSelectedService(item);
    };

    const handleSheetAdd = () => {
        if (selectedService && !isServiceInCart(selectedService.id)) {
            addToCart(selectedService, 'service');
            setSelectedService(null);
        }
    };

    const renderItem = ({ item }) => {
        const added = isServiceInCart(item.id);
        return (
            <Card style={styles.card}>
                <TouchableOpacity onPress={() => handleSelect(item)}>
                    <View style={styles.row}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.content}>
                            <CustomText weight="bold" size={16}>{item.name}</CustomText>
                            <CustomText type="caption" numberOfLines={2} style={styles.desc}>{item.description}</CustomText>
                            <View style={styles.priceRow}>
                                <CustomText color={Colors.primary} weight="bold">₹{item.discountPrice}</CustomText>
                                {item.price > item.discountPrice && (
                                    <CustomText type="caption" style={styles.originalPrice}>₹{item.price}</CustomText>
                                )}
                            </View>
                        </View>
                        {added ? (
                            <View style={[styles.addButton, styles.addedBtn]}>
                                <Ionicons name="checkmark" size={16} color={Colors.success} />
                                <CustomText size={12} color={Colors.success} weight="bold" style={{ marginLeft: 4 }}>Added</CustomText>
                            </View>
                        ) : (
                            <Button
                                title="Add"
                                variant="primary"
                                style={styles.addButton}
                                textStyle={{ fontSize: 12 }}
                                onPress={() => handleAdd(item)}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <CustomText size={24}>←</CustomText>
                </TouchableOpacity>
                <CustomText type="subheading">{categoryName}</CustomText>
            </View>
            <FlatList
                data={filteredServices}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />

            <ServiceDetailsSheet
                visible={!!selectedService}
                service={selectedService}
                isAdded={selectedService ? isServiceInCart(selectedService.id) : false}
                onClose={() => setSelectedService(null)}
                onAdd={handleSheetAdd}
            />

            <ResourceRequirementSheet
                visible={!!serviceForRequirement}
                service={serviceForRequirement}
                onClose={() => setServiceForRequirement(null)}
                onConfirm={handleConfirmRequirement}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backButton: {
        marginRight: 16,
    },
    list: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        padding: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    desc: {
        marginVertical: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        marginLeft: 8,
    },
    addButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginLeft: 8,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addedBtn: {
        flexDirection: 'row',
        backgroundColor: Colors.tints.successLight,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.success,
    }
});

export default ServicesListScreen;
