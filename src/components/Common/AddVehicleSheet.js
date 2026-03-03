import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import CustomText from '../UI/CustomText';
import Button from '../UI/Button';
import TextInput from '../UI/TextInput';
import { Colors } from '../../styles/colors';
import { Ionicons } from '@expo/vector-icons';
import { useVehicle } from '../../context/VehicleContext';



const AddVehicleSheet = ({ visible, onClose }) => {
    const { addVehicle } = useVehicle();
    const [form, setForm] = useState({
        brand: '',
        model: '',
        number: '',
        type: 'Car', // Default
        fuel: 'Petrol'
    });

    const fuleTyles = {
        Car: ['Petrol', 'Diesel', 'CNG', 'Electric'],
        Bike: ['Petrol', 'Electric']
    }

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        if (!form.brand || !form.model || !form.number) return; // Simple validation
        addVehicle(form);
        setForm({ brand: '', model: '', number: '', type: 'Car', fuel: 'Petrol' }); // Reset
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
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.overlay}
            >
                <View style={styles.sheet}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <CustomText type="subheading" weight="bold">Add Vehicle</CustomText>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView style={styles.form}>
                        {/* Vehicle Type Selector */}
                        <CustomText type="label" style={styles.label}>Vehicle Type</CustomText>
                        <View style={styles.typeContainer}>
                            {['Car', 'Bike'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.typeBtn,
                                        form.type === type && styles.activeTypeBtn
                                    ]}
                                    onPress={() => handleChange('type', type)}
                                >
                                    <Ionicons
                                        name={type === 'Car' ? 'car-sport' : 'bicycle'}
                                        size={20}
                                        color={form.type === type ? 'white' : Colors.text.primary}
                                        style={{ marginRight: 8 }}
                                    />
                                    <CustomText weight="bold" color={form.type === type ? 'white' : Colors.text.primary}>
                                        {type}
                                    </CustomText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <CustomText type="label" style={styles.label}>Select Brand</CustomText>
                        <TextInput
                            placeholder={form.type === 'Car' ? "e.g. Toyota" : "e.g. Honda"}
                            value={form.brand}
                            onChangeText={(text) => handleChange('brand', text)}
                        />

                        <CustomText type="label" style={styles.label}>Select Model</CustomText>
                        <TextInput
                            placeholder={form.type === 'Car' ? "e.g. Fortuner" : "e.g. Activa"}
                            value={form.model}
                            onChangeText={(text) => handleChange('model', text)}
                        />

                        <CustomText type="label" style={styles.label}>Vehicle Number</CustomText>
                        <TextInput
                            placeholder="Ex. GR 789-UKL"
                            value={form.number}
                            onChangeText={(text) => handleChange('number', text)}
                        />

                        <CustomText type="label" style={styles.label}>Fuel Type</CustomText>
                        <View style={styles.fuelContainer}>
                            {fuleTyles[form.type].map(type => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.fuelChip, form.fuel === type && styles.activeChip]}
                                    onPress={() => handleChange('fuel', type)}
                                >
                                    <CustomText color={form.fuel === type ? 'white' : Colors.text.primary}>{type}</CustomText>
                                </TouchableOpacity>
                            ))}
                        </View>

                    </ScrollView>

                    <View style={styles.footer}>
                        <Button title="Add Vehicle" onPress={handleSubmit}
                            disabled={!form.brand || !form.model || !form.number || !form.fuel}
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
    typeContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    typeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        marginRight: 8,
    },
    activeTypeBtn: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    fuelContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    fuelChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        marginRight: 8,
        marginBottom: 8,
    },
    activeChip: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    footer: {
        paddingVertical: 10,
    }
});

export default AddVehicleSheet;
