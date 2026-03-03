import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../../context/CartContext";
import CustomText from "../UI/CustomText";
import { Colors } from "../../styles/colors";
import { Ionicons } from "@expo/vector-icons";

const ActiveOrdersTracker = () => {
  const { orders } = useCart();
  const navigation = useNavigation();

  const activeOrders = orders.filter(
    (order) => order.status !== "Completed" && order.status !== "Cancelled",
  );

  const order = activeOrders?.[0];

  if (!order) return null;

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("TrackOrder", { orderId: order.id })}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="time" size={20} color={Colors.primary} />
        </View>
        <View style={styles.details}>
          <CustomText size={12} weight="bold">
            Order {order.id.slice(0, 8)}
          </CustomText>
          <CustomText size={10} color={Colors.text.light}>
            {order.status}
          </CustomText>
        </View>
        <View style={styles.chevron}>
          <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    bottom: 100, // Just above bottom tabs (height 60 + some margin)
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    // marginRight: 10,
    marginHorizontal: 8,
    marginVertical: 4,
    // Premium shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.tints.primaryVeryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  chevron: {
    marginLeft: 4,
  },
});

export default ActiveOrdersTracker;
