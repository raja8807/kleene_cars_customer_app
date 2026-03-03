import React from 'react';
import { View, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useCatalog } from '../../../context/CatalogContext';
import { Colors } from '../../../styles/colors';
import SectionHeader from './sectionHead/SectionHead';



const { width } = Dimensions.get('window');

const Banner = () => {
    const { banners } = useCatalog();
    return (
        <View>
            <SectionHeader
                title="Special For You"
                onPress={() => { }}
            />
            <View style={styles.container}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                >
                    {banners.map((banner) => (
                        <View key={banner.id} style={styles.bannerContainer}>
                            <Image
                                source={{ uri: banner.image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    bannerContainer: {
        width: width - 32, // Full width minus padding
        height: 160,
        marginHorizontal: 16,
        marginBottom: 24,

        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: Colors.border, // Placeholder color
    },
    image: {
        width: '100%',
        height: '100%',
    }
});

export default Banner;
