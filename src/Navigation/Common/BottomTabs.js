import React, { useState } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../../Screens/HomeScreen/HomeScreen";
import OrdersScreen from "../../Screens/OrdersScreen/OrdersScreen";
import CartScreen from "../../Screens/CartScreen/CartScreen";
import AccountScreen from "../../Screens/AccountScreen/AccountScreen";
import { Colors } from "../../styles/colors";
import CustomText from "../../components/UI/CustomText";

const Tab = createBottomTabNavigator();

import ActiveOrdersTracker from "../../components/Common/ActiveOrdersTracker";
import { useCart } from "../../context/CartContext";

const BottomTabs = () => {
  const { cartItems } = useCart();
  const cartCount = cartItems.length;

  const [showActiveOrdersTracker, setShowActiveOrdersTracker] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {showActiveOrdersTracker && <ActiveOrdersTracker />}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.text.light,
          tabBarLabelStyle: {
            fontFamily: "System",
            fontSize: 10,
            marginBottom: 4,
          },
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            height: 90,
            paddingBottom: 4,
            paddingTop: 0,
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Orders") {
              iconName = focused ? "file-tray-full" : "file-tray-full-outline";
            } else if (route.name === "Cart") {
              iconName = focused ? "cart" : "cart-outline";
            } else if (route.name === "Account") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={24} color={color} />;
          },
          tabBarLabel: ({ focused, color }) => (
            <CustomText
              size={10}
              color={color}
              weight={focused ? "medium" : "regular"}
              style={{ marginBottom: 4 }}
            >
              {route.name}
            </CustomText>
          ),
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          listeners={({ navigation }) => {
            setShowActiveOrdersTracker(navigation.isFocused());
          }}
        />
        <Tab.Screen name="Orders" component={OrdersScreen} />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{ tabBarBadge: cartCount > 0 ? cartCount : null }}
        />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </View>
  );
};

export default BottomTabs;
