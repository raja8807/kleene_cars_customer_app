import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "../../../components/UI/CustomText";
import { Colors } from "../../../styles/colors";
import { useVehicle } from "../../../context/VehicleContext";
import { useLocation } from "../../../context/LocationContext";
import { TextInput } from "react-native-gesture-handler";

const Header = ({ onAddressPress, onVehiclePress, isScrolled }) => {
  const { selectedAddress } = useLocation();
  const { selectedVehicle } = useVehicle();

  const addressLabel = selectedAddress
    ? `${selectedAddress.label} - ${selectedAddress.street}...`
    : "Select Location";

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.locationContainer}>
          <View style={styles.locationTextContainer}>
            <CustomText type="caption" color={"white"}>
              Location
            </CustomText>
            <TouchableOpacity style={styles.selector} onPress={onAddressPress}>
              <Ionicons name="location" size={20} color={"#fbd542"} />
              <CustomText
                type="label"
                style={styles.locationText}
                numberOfLines={1}
                weight="bold"
                color="white"
                size={16}
              >
                {addressLabel}
              </CustomText>
              <Ionicons
                name="chevron-down"
                size={16}
                color={Colors.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.vehicleSelector}
          onPress={onVehiclePress}
        >
          {/* Show selected vehicle or generic icon */}
          {selectedVehicle ? (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Ionicons
                name={selectedVehicle.type === "Car" ? "car-sport" : "bicycle"}
                size={24}
                color={"yellow"}
              />
              <View style={{ alignItems: "flex-end" }}>
                <CustomText size={14} weight="bold" color={Colors.secondary}>
                  {selectedVehicle.model}
                </CustomText>
                <CustomText size={10} color={"white"}>
                  {selectedVehicle.number}
                </CustomText>
              </View>
            </View>
          ) : (
            <Ionicons name="car-sport" size={20} color={Colors.secondary} />
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search"
        style={{ backgroundColor: "white", padding: 10, borderRadius: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 16,
    gap: 24,
  },

  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Allow text to take space
    marginRight: 16,
  },
  locationTextContainer: {
    marginLeft: 8,
    flex: 1,
    gap: 6,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    marginRight: 4,
    maxWidth: "90%",
  },
  vehicleSelector: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Header;
