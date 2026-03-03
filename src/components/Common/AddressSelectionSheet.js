import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import CustomText from '../UI/CustomText';
import Button from '../UI/Button';
import { Colors } from '../../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../../context/LocationContext';

const { height } = Dimensions.get('window');

const AddressSelectionSheet = ({ visible, onClose, onAddNew }) => {
    const { addresses, selectedAddress, selectAddress } = useLocation();

    const handleSelect = (address) => {
        selectAddress(address);
        onClose();
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
                        <CustomText type="subheading" weight="bold">Select Address</CustomText>
                        <TouchableOpacity style={styles.iconBtn}>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.list}>
                        <TouchableOpacity

                            style={[styles.item, styles.itemAdd]}
                            // onPress={() => handleSelect(address)}
                            onPress={() => { onClose(); onAddNew(); }}
                        >
                            <View style={styles.iconContainer}>
                                <Ionicons name="locate" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.info}>
                                {/* <CustomText weight="bold">{address.label}</CustomText> */}
                                <CustomText type="caption" color={Colors.text.secondary}>
                                    Add New Address
                                </CustomText>
                            </View>
                            <View style={styles.radio}>
                                <Ionicons name="add" size={24} color={Colors.primary} />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {addresses.map((address) => {
                            const isSelected = selectedAddress?.id === address.id;
                            return (
                                <TouchableOpacity
                                    key={address.id}
                                    style={[styles.item, isSelected && styles.selectedItem]}
                                    onPress={() => handleSelect(address)}
                                >
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="location" size={24} color={isSelected ? Colors.primary : '#666'} />
                                    </View>
                                    <View style={styles.info}>
                                        <CustomText weight="bold">{address.label}</CustomText>
                                        <CustomText type="caption" color={Colors.text.secondary}>
                                            {address.house}, {address.street}, {address.area}, {address.city} - {address.pincode}
                                        </CustomText>
                                    </View>
                                    <View style={styles.radio}>
                                        {isSelected ? (
                                            <Ionicons name="radio-button-on" size={24} color={Colors.primary} />
                                        ) : (
                                            <Ionicons name="radio-button-off" size={24} color="#ccc" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <View style={styles.footer}>
                        <Button title="Continue" onPress={onClose} />
                    </View>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    iconBtn: {
        padding: 8,
    },
    list: {
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 12,
    },
    itemAdd: {
        borderStyle: 'dashed',
        marginBottom: 0,
    },
    selectedItem: {
        borderColor: Colors.primary,
        backgroundColor: '#EEF2FF',
    },
    iconContainer: {
        marginRight: 16,
    },
    info: {
        flex: 1,
        paddingRight: 8,
    },
    footer: {
        marginTop: 16,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 18,
    }
});

export default AddressSelectionSheet;
