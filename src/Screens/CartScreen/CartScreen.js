import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";
import CustomText from "../../components/UI/CustomText";
import Button from "../../components/UI/Button";
import ServiceCartItem from "./components/ServiceCartItem";
import ProductCartItem from "./components/ProductCartItem";
import { Colors } from "../../styles/colors";
import TextInput from "../../components/UI/TextInput";
import SlotSelection from "../../components/Common/SlotSelection";
import ConfirmationSheet from "./components/ConfirmationSheet";

const CartScreen = ({ navigation }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    placeOrder,
    getCartTotal,
  } = useCart();
  const [coupon, setCoupon] = useState("");
  const [slot, setSlot] = useState(null); // { date, time }
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const services = cartItems.filter((item) => item.type === "service");
  const products = cartItems.filter((item) => item.type === "product");

  const subtotal = getCartTotal();
  const discount = 0; // Dummy discount logic
  const total = subtotal - discount;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    if (services.length > 0 && !slot) {
      Alert.alert(
        "Selection Required",
        "Please select a date and time slot for your service.",
      );
      return;
    }

    setIsConfirmationVisible(true);
  };

  const handleConfirmOrder = async (additionalNotes) => {
    // setIsConfirmationVisible(false);
    setIsLoading(true);
    try {
      await placeOrder({ slot, additionalNotes }); // Pass slot and availability details to placeOrder
      navigation.navigate("OrderSuccess");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <CustomText type="subheading">Your Cart is Empty</CustomText>
          <Button
            title="Start Booking"
            onPress={() => navigation.navigate("Home")}
            style={{ marginTop: 20, width: 200 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomText type="heading">My Cart</CustomText>
      </View>

      <ScrollView style={styles.content}>
        {services.length > 0 && (
          <View style={styles.section}>
            <CustomText type="subheading" style={styles.sectionTitle}>
              Services
            </CustomText>
            {services.map((item) => (
              <ServiceCartItem
                key={`${item.id}-${item.type}`}
                item={item}
                onRemove={() => removeFromCart(item.id, "service")}
              />
            ))}
          </View>
        )}

        {products.length > 0 && (
          <View style={styles.section}>
            <CustomText type="subheading" style={styles.sectionTitle}>
              Products
            </CustomText>
            {products.map((item) => (
              <ProductCartItem
                key={`${item.id}-${item.type}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={() => removeFromCart(item.id, "product")} // Changed to pass function correctly
              />
            ))}
          </View>
        )}

        {services.length > 0 && <SlotSelection onSlotSelect={setSlot} />}

        <View style={styles.billSection}>
          <CustomText type="subheading" style={styles.sectionTitle}>
            Bill Details
          </CustomText>
          <View style={styles.row}>
            <CustomText>Subtotal</CustomText>
            <CustomText>₹{subtotal}</CustomText>
          </View>
          <View style={styles.row}>
            <CustomText>Discount</CustomText>
            <CustomText color={Colors.success}>-₹{discount}</CustomText>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <CustomText weight="bold">Total Amount</CustomText>
            <CustomText weight="bold" color={Colors.primary}>
              ₹{total}
            </CustomText>
          </View>
        </View>

        <View style={styles.couponSection}>
          <TextInput
            placeholder="Enter Coupon Code"
            value={coupon}
            onChangeText={setCoupon}
            style={{ flex: 1, marginBottom: 0 }}
          />
          <Button title="Apply" variant="secondary" style={styles.applyBtn} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title={`Place Order • ₹${total}`} onPress={handlePlaceOrder} />
      </View>

      <ConfirmationSheet
        visible={isConfirmationVisible}
        onClose={() => setIsConfirmationVisible(false)}
        onConfirm={handleConfirmOrder}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  billSection: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
  },
  couponSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  applyBtn: {
    marginLeft: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.text.primary, // Black button for Apply
    borderWidth: 0,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});

export default CartScreen;
