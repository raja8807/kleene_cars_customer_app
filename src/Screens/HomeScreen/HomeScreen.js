import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, StatusBar as RNStatusBar, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './components/Header';
import Banner from './components/Banner';
import CategoryList from './components/CategoryList';
import ProductList from './components/ProductList';
import ProductDetailsSheet from '../../components/Common/ProductDetailsSheet';
import { Colors } from '../../styles/colors';
import { useCart } from '../../context/CartContext';
import { useVehicle } from '../../context/VehicleContext';
import { useLocation } from '../../context/LocationContext';
import VehicleSelectionSheet from '../../components/Common/VehicleSelectionSheet';
import AddVehicleSheet from '../../components/Common/AddVehicleSheet';
import AddressSelectionSheet from '../../components/Common/AddressSelectionSheet';
import AddAddressSheet from '../../components/Common/AddAddressSheet';
import CustomText from '../../components/UI/CustomText';

const HomeScreen = ({ navigation }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart } = useCart();
    const { vehicles, loading: loadingVehicles } = useVehicle();
    const { addresses, loading: loadingLocations } = useLocation();

    // Sheet States
    const [showVehicleSelect, setShowVehicleSelect] = useState(false);
    const [showAddVehicle, setShowAddVehicle] = useState(false);
    const [showAddressSelect, setShowAddressSelect] = useState(false);
    const [showAddAddress, setShowAddAddress] = useState(false);

    useEffect(() => {
        if (!loadingLocations && !loadingVehicles) {
            if (addresses.length === 0) {
                setShowAddAddress(true);
            } else if (vehicles.length === 0) {
                setShowAddVehicle(true);
            }
        }
    }, [addresses.length, vehicles.length, loadingLocations, loadingVehicles]);

    const handleCategorySelect = (category) => {
        navigation.navigate('ServicesList', { category });
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
    };

    const closeProductSheet = () => {
        setSelectedProduct(null);
    };

    const handleAddToCart = () => {
        if (selectedProduct) {
            addToCart(selectedProduct, 'product');
            closeProductSheet();
        }
    };

    const [isScrolled, setIsScrolled] = useState(false)

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > 50)
    };



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={Colors.primary} />

            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                >
                    <Header
                        onVehiclePress={() => setShowVehicleSelect(true)}
                        onAddressPress={() => setShowAddressSelect(true)}
                        isScrolled={isScrolled}
                    />
                    <Banner />
                    <CategoryList onSelectCategory={handleCategorySelect} />
                    <ProductList onProductSelect={handleProductSelect} />
                </ScrollView>
            </View>

            {/* Product Sheet */}
            <ProductDetailsSheet
                visible={!!selectedProduct}
                product={selectedProduct}
                onClose={closeProductSheet}
                onAdd={handleAddToCart}
            />

            {/* Vehicle Sheets */}
            <VehicleSelectionSheet
                visible={showVehicleSelect}
                onClose={() => setShowVehicleSelect(false)}
                onAddVehicle={() => setShowAddVehicle(true)}
            />
            <AddVehicleSheet
                visible={showAddVehicle}
                onClose={() => setShowAddVehicle(false)}
            />

            {/* Address Sheets */}
            <AddressSelectionSheet
                visible={showAddressSelect}
                onClose={() => setShowAddressSelect(false)}
                onAddNew={() => setShowAddAddress(true)}
                addresses={addresses || []}
            />
            <AddAddressSheet
                visible={showAddAddress}
                onClose={() => setShowAddAddress(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        // paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
    },
    content: {
        flex: 1,
    }
});

export default HomeScreen;
