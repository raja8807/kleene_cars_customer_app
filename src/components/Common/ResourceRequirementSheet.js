import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import CustomText from "../UI/CustomText";
import Button from "../UI/Button";
import { Colors } from "../../styles/colors";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const ResourceRequirementSheet = ({ visible, onClose, onConfirm, service }) => {



    const [availability, setAvailability] = useState({
        electricity: service?.electricity_required || null,
        water: service?.water_required || null,
    });



    useEffect(() => {
        if (visible) {
            setAvailability({
                electricity: service?.electricity_required || null,
                water: service?.water_required || null,
            });
        }
    }, [visible]);


    if (!service) return null;

    const needsElectricity = service.electricity_required;
    const needsWater = service.water_required;

    const toggleElectricity = () => {
        setAvailability((prev) => ({ ...prev, electricity: !prev.electricity }));
    };

    const toggleWater = () => {
        setAvailability((prev) => ({ ...prev, water: !prev.water }));
    };

    const calculateTotal = () => {
        let total = service.discountPrice;
        if (needsElectricity && !availability.electricity) {
            total += service.electricity_price || 0;
        }
        if (needsWater && !availability.water) {
            total += service.water_price || 0;
        }
        return total;
    };

    const handleConfirm = () => {
        onConfirm(availability);
    };


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
                        <CustomText type="subheading" weight="bold">
                            Resource Availability
                        </CustomText>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={Colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <CustomText style={styles.description}>
                        This service requires certain resources. Please confirm if they are available at your location.
                    </CustomText>

                    <View style={styles.optionsContainer}>
                        {needsElectricity && (
                            <TouchableOpacity
                                style={styles.optionRow}
                                onPress={toggleElectricity}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        availability.electricity && styles.checkboxSelected,
                                    ]}
                                >
                                    {availability.electricity && (
                                        <Ionicons name="checkmark" size={18} color="white" />
                                    )}
                                </View>
                                <View style={styles.optionContent}>
                                    <CustomText style={styles.optionText}>
                                        Electricity Available
                                    </CustomText>
                                    {!availability.electricity && (
                                        <CustomText type="caption" color={Colors.error}
                                            size={10}

                                        >
                                            + ₹{service.electricity_price} extra charge
                                        </CustomText>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}

                        {needsWater && (
                            <TouchableOpacity
                                style={styles.optionRow}
                                onPress={toggleWater}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        availability.water && styles.checkboxSelected,
                                    ]}
                                >
                                    {availability.water && (
                                        <Ionicons name="checkmark" size={18} color="white" />
                                    )}
                                </View>
                                <View style={styles.optionContent}>
                                    <CustomText style={styles.optionText}>
                                        Water Available
                                    </CustomText>
                                    {!availability.water && (
                                        <CustomText type="caption" color={Colors.error}
                                            size={10}
                                        >
                                            + ₹{service.water_price} extra charge
                                        </CustomText>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.warningContainer}>
                        <Ionicons
                            name="information-circle-outline"
                            size={20}
                            color={Colors.warning}
                        />
                        <CustomText
                            type="caption"
                            color={Colors.text.secondary}
                            style={styles.warningText}
                        >
                            Unchecking an option will add a resource fee to your service total.
                        </CustomText>
                    </View>

                    <Button
                        title={`Add to Cart • ₹${calculateTotal()}`}
                        onPress={handleConfirm}
                        style={styles.confirmBtn}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "white",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    description: {
        marginBottom: 24,
        color: Colors.text.secondary,
    },
    optionsContainer: {
        marginBottom: 24,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.border,
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    checkboxSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    optionContent: {
        flex: 1,
    },
    optionText: {
        fontSize: 16,
        color: Colors.text.primary,
    },
    warningContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.tints.secondaryLight,
        padding: 12,
        borderRadius: 12,
        marginBottom: 24,
    },
    warningText: {
        marginLeft: 8,
        flex: 1,
    },
    confirmBtn: {
        width: "100%",
    },
});

export default ResourceRequirementSheet;
