import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/Navigation/Navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';
import { VehicleProvider } from './src/context/VehicleContext';
import { LocationProvider } from './src/context/LocationContext';
import { AuthProvider } from './src/context/AuthContext';
import { CatalogProvider } from './src/context/CatalogContext';
import { setupNotificationListeners } from './src/helpers/notificationHelper';

export default function App() {
  useEffect(() => {
    const listeners = setupNotificationListeners();
    return () => listeners.remove();
  }, []);
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AuthProvider>
        <CatalogProvider>
          <LocationProvider>
            <VehicleProvider>
              <CartProvider>
                <AppNavigator />
              </CartProvider>
            </VehicleProvider>
          </LocationProvider>
        </CatalogProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
