import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Modal, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../UI/CustomText';
import Button from '../UI/Button';
import { Colors } from '../../styles/colors';

const { width, height } = Dimensions.get('window');

const LocationPicker = ({ visible, onClose, onLocationSelect }) => {
    const [mapRegion, setMapRegion] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const webViewRef = useRef(null);

    useEffect(() => {
        if (visible) {
            getUserLocation();
        }
    }, [visible]);

    const getUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        let newLocation;

        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            newLocation = {
                latitude: 13.0843, // Bangalore fallback
                longitude: 80.2705,
            };
        } else {
            let location = await Location.getCurrentPositionAsync({});
            newLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
        }

        if (!mapRegion) {
            // First load: set the initial region so WebView mounts
            setMapRegion(newLocation);
        } else {
            // Subsequent loads: inject JS to pan the existing map
            if (webViewRef.current) {
                webViewRef.current.injectJavaScript(`
                    if (window.map) {
                        window.map.setView([${newLocation.latitude}, ${newLocation.longitude}], 15);
                    }
                    true;
                `);
            }
        }
        setSelectedLocation(newLocation);
    };

    const confirmLocation = () => {
        if (selectedLocation) {
            onLocationSelect(selectedLocation);
            onClose();
        }
    };

    const handleMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'locationChanged') {
                setSelectedLocation({
                    latitude: data.latitude,
                    longitude: data.longitude,
                });
            }
        } catch (e) {
            console.error("Error parsing webview message", e);
        }
    };

    const generateMapHTML = (region) => {
        const lat = region.latitude;
        const lng = region.longitude;

        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="" />
                    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
                    <style>
                        body { padding: 0; margin: 0; }
                        html, body, #map { height: 100vh; width: 100vw; }
                    </style>
                </head>
                <body>
                    <div id="map"></div>
                    <script>
                        window.map = L.map('map', { zoomControl: false }).setView([${lat}, ${lng}], 15);
                        
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 19,
                            attribution: '© OpenStreetMap'
                        }).addTo(window.map);

                        window.map.on('moveend', function() {
                            var center = window.map.getCenter();
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'locationChanged',
                                latitude: center.lat,
                                longitude: center.lng
                            }));
                        });
                    </script>
                </body>
            </html>
        `;
    };

    const mapSource = useMemo(() => {
        if (!mapRegion) return null;
        return { html: generateMapHTML(mapRegion) };
    }, [mapRegion]);

    if (!visible) return null;

    return (
        <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
            <View style={styles.container}>
                {mapSource ? (
                    <WebView
                        ref={webViewRef}
                        style={styles.map}
                        source={mapSource}
                        onMessage={handleMessage}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        originWhitelist={['*']}
                        scrollEnabled={false}
                        bounces={false}
                    />
                ) : (
                    <View style={[styles.map, { justifyContent: 'center', alignItems: 'center' }]}>
                        <CustomText>Loading map...</CustomText>
                    </View>
                )}

                <View style={styles.markerFixed}>
                    <Ionicons name="location" size={36} color={Colors.primary} />
                </View>

                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close-circle" size={36} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.locateBtn} onPress={getUserLocation}>
                        <Ionicons name="locate" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                    <View style={styles.addressBox}>
                        <CustomText type="caption" style={{ marginBottom: 10, textAlign: 'center' }}>
                            Move map to adjust location
                        </CustomText>
                        <Button title="Confirm Location" onPress={confirmLocation} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: width,
        height: height,
    },
    header: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    addressBox: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    markerFixed: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -18,
        marginTop: -36,
    },
    locateBtn: {
        backgroundColor: 'white',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});

export default LocationPicker;
