import React from 'react';
import { View, StyleSheet, Modal, Image, TouchableOpacity, Dimensions } from 'react-native';
import CustomText from '../UI/CustomText';
import Button from '../UI/Button';
import { Colors } from '../../styles/colors';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const ProductDetailsSheet = ({ visible, onClose, product, onAdd }) => {
    if (!product) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>

                    <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />

                    <View style={styles.content}>
                        <CustomText type="heading" style={styles.title}>{product.name}</CustomText>
                        <View style={styles.priceRow}>
                            <CustomText type="subheading" color={Colors.primary} weight="bold">₹{product.discountPrice}</CustomText>
                            {product.price > product.discountPrice && (
                                <CustomText style={styles.originalPrice}>₹{product.price}</CustomText>
                            )}
                        </View>

                        <CustomText style={styles.description}>{product.description}</CustomText>

                        <View style={styles.footer}>
                            <View style={styles.quantity}>
                                <TouchableOpacity style={styles.qtyBtn}><CustomText>-</CustomText></TouchableOpacity>
                                <CustomText style={styles.qtyText}>1</CustomText>
                                <TouchableOpacity style={styles.qtyBtn}><CustomText>+</CustomText></TouchableOpacity>
                            </View>
                            <Button title="Add to Cart" onPress={onAdd} style={styles.addBtn} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: height * 0.6,
        padding: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 4,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 16,
    },
    content: {
        flex: 1,
    },
    title: {
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        marginLeft: 10,
        color: '#999',
    },
    description: {
        lineHeight: 20,
        color: '#666',
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    quantity: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 4,
    },
    qtyBtn: {
        padding: 10,
        minWidth: 40,
        alignItems: 'center',
    },
    qtyText: {
        marginHorizontal: 10,
        fontWeight: 'bold',
    },
    addBtn: {
        flex: 1,
        marginLeft: 16,
    }
});

export default ProductDetailsSheet;
