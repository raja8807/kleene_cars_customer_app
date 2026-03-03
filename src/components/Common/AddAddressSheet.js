import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import CustomText from '../UI/CustomText';
import Button from '../UI/Button';
import TextInput from '../UI/TextInput';
import { Colors } from '../../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../../context/LocationContext';

import LocationPicker from './LocationPicker';

const { height } = Dimensions.get('window');

const AddAddressSheet = ({ visible, onClose }) => {
    const { addAddress, addresses } = useLocation();
    const [showMap, setShowMap] = useState(false);

    const [form, setForm] = useState({
        label: 'Home',
        house: '',
        street: '',
        area: '',
        city: '',
        pincode: '',
        latitude: null,
        longitude: null
    });

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        if (!form.house || !form.city || !form.pincode || !form.label || !form.latitude || !form.longitude) return;
        addAddress(form);
        setForm({ label: 'Home', house: '', street: '', area: '', city: '', pincode: '' });
        onClose();
    };

    const handleLocationSelect = (location) => {
        setForm(prev => ({
            ...prev,
            latitude: location.latitude,
            longitude: location.longitude
        }));
        // Optional: You could add reverse geocoding here to fill address text
    };

    const handleClose = () => {
        if (addresses.length > 0) {
            onClose();
        }
    }

    if (!visible) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <LocationPicker
                visible={showMap}
                onClose={() => setShowMap(false)}
                onLocationSelect={handleLocationSelect}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.overlay}
            >
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleClose} style={styles.iconBtn}>
                            {
                                addresses.length > 0 &&
                                <Ionicons name="arrow-back" size={24} color="#333" />
                            }
                        </TouchableOpacity>
                        <CustomText type="subheading" weight="bold">Add Your Address</CustomText>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView style={styles.form}>
                        <TouchableOpacity
                            style={[styles.locationBtn, form.latitude && styles.locationBtnActive]}
                            onPress={() => setShowMap(true)}
                        >
                            <Ionicons name={form.latitude ? "locate" : "map-outline"} size={20} color={form.latitude ? 'white' : Colors.primary} style={{ marginRight: 8 }} />
                            <CustomText color={form.latitude ? 'white' : Colors.primary} weight="medium">
                                {form.latitude ? "Location Selected" : "Select Location on Map"}
                            </CustomText>
                        </TouchableOpacity>


                        <TextInput
                            placeholder="House / Flat No.*"
                            value={form.house}
                            onChangeText={(text) => handleChange('house', text)}
                        />
                        <TextInput
                            placeholder="Street Name"
                            value={form.street}
                            onChangeText={(text) => handleChange('street', text)}
                        />
                        <TextInput
                            placeholder="Area / Colony"
                            value={form.area}
                            onChangeText={(text) => handleChange('area', text)}
                        />
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <TextInput
                                    placeholder="City*"
                                    value={form.city}
                                    onChangeText={(text) => handleChange('city', text)}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <TextInput
                                    placeholder="Pincode*"
                                    value={form.pincode}
                                    onChangeText={(text) => handleChange('pincode', text)}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>

                        <CustomText type="label" style={styles.label}>Label (Home, Office, etc.)</CustomText>
                        <View style={styles.labelContainer}>
                            {['Home', 'Office', 'Other'].map(lbl => (
                                <TouchableOpacity
                                    key={lbl}
                                    style={[styles.labelChip, form.label === lbl && styles.activeChip]}
                                    onPress={() => handleChange('label', lbl)}

                                >
                                    <CustomText color={form.label === lbl ? 'white' : Colors.text.primary}>{lbl}</CustomText>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Button title="Save Address" onPress={handleSubmit}
                            disabled={!form.house || !form.city || !form.pincode || !form.label || !form.latitude || !form.longitude}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
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
        height: '100%',
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
    form: {
        flex: 1,
    },
    label: {
        marginBottom: 8,
        marginLeft: 4,
    },
    labelContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    labelChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        marginRight: 8,
    },
    activeChip: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    row: {
        flexDirection: 'row',
    },
    footer: {
        paddingVertical: 10,
    },
    locationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        marginBottom: 20,
        backgroundColor: '#EEF2FF'
    },
    locationBtnActive: {
        backgroundColor: Colors.success,
        borderWidth: 0
    }
});

export default AddAddressSheet;
