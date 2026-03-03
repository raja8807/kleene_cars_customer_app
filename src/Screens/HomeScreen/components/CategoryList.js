import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import CustomText from '../../../components/UI/CustomText';
import { useCatalog } from '../../../context/CatalogContext';
import { Colors } from '../../../styles/colors';
import SectionHeader from './sectionHead/SectionHead';


const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const GAP = 12;
const ITEM_WIDTH = (width - 32 - (GAP * (COLUMN_COUNT - 1))) / COLUMN_COUNT; // 32 for container padding

const CategoryList = ({ onSelectCategory }) => {
    const { categories } = useCatalog();
    return (
        <View>
            <SectionHeader
                title="Categories"
                onPress={() => { }}
            />
            <View style={styles.container}>

                <View style={styles.grid}>
                    {categories.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.item}
                            onPress={() => onSelectCategory(item)}
                        >
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                                <View style={styles.overlay} />
                                <View style={styles.textContainer}>
                                    <CustomText weight="bold" style={styles.text}>{item.name}</CustomText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GAP,
    },
    item: {
        width: ITEM_WIDTH,
        height: 150, // Reduced height for grid balance
        marginBottom: 4, // Gap handle by parent gap or margin
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 12,
        overflow: 'hidden'

    },
    imageContainer: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        // backgroundColor: 'rgba(0,0,0,0.3)',


    },
    textContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        height: 30,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: Colors.text.white,
        fontSize: 14,
        textAlign: 'center',
    }
});

export default CategoryList;
