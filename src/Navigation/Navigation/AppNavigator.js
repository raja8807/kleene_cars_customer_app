import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import BottomTabs from "../Common/BottomTabs";
import ServicesListScreen from "../../Screens/HomeScreen/ServicesListScreen";
import TrackOrderScreen from "../../Screens/OrdersScreen/TrackOrderScreen";
import SignInScreen from "../../Screens/Auth/SignInScreen";
import SignUpScreen from "../../Screens/Auth/SignUpScreen";
import FillProfileScreen from "../../Screens/Auth/FillProfileScreen";
import { useAuth } from "../../context/AuthContext";
import navigationRef, { setPendingNotification, consumePendingNotification } from "../../helpers/navigationRef";

import OrderSuccessScreen from "../../Screens/OrderSuccessScreen/OrderSuccessScreen";



// Initialize Stack Navigator
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="SignIn" component={SignInScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
  </AuthStack.Navigator>
);

const AppNavigator = () => {
  const { session, userData } = useAuth();

  // When the authenticated screens become available, consume any
  // notification that arrived before TrackOrder was registered.
  useEffect(() => {
    if (session && userData?.full_name) {
      const data = consumePendingNotification();
      if (data?.type === "orderUpdate" && data?.orderId) {
        // Small delay ensures the stack has finished mounting
        setTimeout(() => {
          navigationRef.current?.navigate("TrackOrder", { orderId: data.orderId });
        }, 300);
      }
    }
  }, [session, userData?.full_name]);
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={async () => {
        // Handle cold-start: app opened by tapping a notification.
        // Store as pending — the useEffect below will consume it once
        // the authenticated screens are registered.
        const response = await Notifications.getLastNotificationResponseAsync();
        if (response) {
          const data = response.notification.request.content.data;
          if (data?.type === "orderUpdate" && data?.orderId) {
            setPendingNotification(data);
          }
        }
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !userData?.full_name ? (
          <Stack.Screen name="FillProfile" component={FillProfileScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={BottomTabs} />
            <Stack.Screen name="ServicesList" component={ServicesListScreen} />
            <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
