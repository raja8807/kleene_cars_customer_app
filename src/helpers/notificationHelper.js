import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import navigationRef, { setPendingNotification } from "./navigationRef";

/**
 * Sets up listeners that log all received notification data.
 * Call this once at app startup and call the returned cleanup function on unmount.
 * @returns {{ remove: () => void }} cleanup object
 */
export function setupNotificationListeners() {
  const receivedListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      const { title, body, data } = notification.request.content;
      console.log("📩 Notification received:");
      console.log("  Title  :", title);
      console.log("  Body   :", body);
      console.log("  Data   :", JSON.stringify(data, null, 2));
    }
  );

  const responseListener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const { title, body, data } =
        response.notification.request.content;
      console.log("👆 Notification tapped:");
      console.log("  Title  :", title);
      console.log("  Body   :", body);
      console.log("  Data   :", JSON.stringify(data, null, 2));
      console.log("  Action :", response.actionIdentifier);

      // Store as pending — AppNavigator will consume once auth screens are mounted.
      // Also attempt immediate navigation (works when app is already in foreground/background).
      if (data?.type === "orderUpdate" && data?.orderId) {
        setPendingNotification(data);
        navigationRef.current?.navigate("TrackOrder", { orderId: data.orderId });
      }
    }
  );

  return {
    remove: () => {
      receivedListener.remove();
      responseListener.remove();
    },
  };
}

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    // Project ID is required for Expo Go and EAS builds
    // For now we'll try without it if not available, but usually it's needed in app.json
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    alert("Expo Push Token:" + token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
