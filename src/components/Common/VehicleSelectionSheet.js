import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import CustomText from '../UI/CustomText';
import Button from '../UI/Button';
import { Colors } from '../../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { useVehicle } from '../../context/VehicleContext';

const { height } = Dimensions.get('window');

const VehicleSelectionSheet = ({ visible, onClose, onAddVehicle }) => {
    const { vehicles, selectVehicle, selectedVehicle } = useVehicle();

    const handleSelect = (vehicle) => {
        selectVehicle(vehicle);
        onClose();
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedVehicle?.id === item.id;
        // Determine icon based on vehicle type (case-insensitive check)
        const iconName = item.type?.toLowerCase() === 'bike' ? 'bicycle' : 'car-sport';

        return (
            <TouchableOpacity
                style={[styles.item, isSelected && styles.selectedItem]}
                onPress={() => handleSelect(item)}
            >
                <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
                    <Ionicons
                        name={iconName}
                        size={24}
                        color={isSelected ? Colors.primary : Colors.text.light}
                    />
                </View>
                <View style={styles.itemContent}>
                    <CustomText weight="bold">{item.brand} {item.model}</CustomText>
                    <CustomText type="caption" color={Colors.text.light}>{item.number}</CustomText>
                </View>
                {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                )}
            </TouchableOpacity>
        );
    };

    if (!visible) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <CustomText type="subheading" weight="bold">Select Vehicle</CustomText>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={vehicles}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                    />

                    <Button
                        title="Add New Vehicle"
                        variant="outline"
                        onPress={() => {
                            onClose();
                            onAddVehicle();
                        }}
                        style={styles.addBtn}
                    />
                </View>
            </View>
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
        height: height * 0.6,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    list: {
        paddingBottom: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: 'white',
    },
    selectedItem: {
        borderColor: Colors.primary,
        backgroundColor: '#EEF2FF',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    selectedIconContainer: {
        backgroundColor: 'white',
    },
    itemContent: {
        flex: 1,
    },
    addBtn: {
        marginTop: 10,
    }
});

export default VehicleSelectionSheet;
