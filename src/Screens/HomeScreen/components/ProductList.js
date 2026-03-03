import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useCatalog } from '../../../context/CatalogContext';
import CustomText from '../../../components/UI/CustomText';
import Button from '../../../components/UI/Button';
import Card from '../../../components/UI/Card';
import { Colors } from '../../../styles/colors';
import { useCart } from '../../../context/CartContext';
import SectionHeader from './sectionHead/SectionHead';

const ProductList = ({ onProductSelect }) => {
    const { products } = useCatalog();
    const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();

    const getProductInCart = (product) => {
        return cartItems.find(item => item.id === product.id && item.type === 'product');
    };

    const handleAdd = (product) => {
        addToCart(product, 'product');
    };

    const handleIncrement = (item) => {
        updateQuantity(item.id, 'product', item.quantity + 1);
    };

    const handleDecrement = (item) => {
        if (item.quantity > 1) {
            updateQuantity(item.id, 'product', item.quantity - 1);
        } else {
            removeFromCart(item.id, 'product');
        }
    };

    return (
        <View>
            <SectionHeader
                title={'Recommended Products'}
                onPress={() => { }}
            />
            <View style={styles.container}>


                <View style={styles.list}>
                    {products.map((prod) => {
                        const cartItem = getProductInCart(prod);
                        const quantity = cartItem ? cartItem.quantity : 0;


                        return (
                            <Card key={prod.id} style={styles.card}>
                                <TouchableOpacity onPress={() => onProductSelect(prod)}>
                                    <Image source={{ uri: prod.image }} style={styles.image} resizeMode="cover" />
                                    <View style={styles.details}>
                                        <CustomText type="label" numberOfLines={1}>{prod.name}</CustomText>
                                        <View style={styles.priceContainer}>
                                            <CustomText weight="bold" color={Colors.primary}>₹{prod.discountPrice}</CustomText>
                                            {prod.price > prod.discountPrice && (
                                                <CustomText
                                                    size={12}
                                                    color={Colors.text.light}
                                                    style={styles.originalPrice}
                                                >
                                                    ₹{prod.price}
                                                </CustomText>
                                            )}
                                        </View>

                                        {quantity > 0 ? (
                                            <View style={styles.qtyContainer}>
                                                <TouchableOpacity onPress={() => handleDecrement(cartItem)} style={styles.qtyBtn}>
                                                    <CustomText weight="bold" color={Colors.text.white}>-</CustomText>
                                                </TouchableOpacity>
                                                <CustomText weight="bold" style={{ marginHorizontal: 8 }}>{quantity}</CustomText>
                                                <TouchableOpacity onPress={() => handleIncrement(cartItem)} style={styles.qtyBtn}>
                                                    <CustomText weight="bold" color={Colors.text.white}>+</CustomText>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <Button
                                                title="Add"
                                                variant="primary"
                                                style={styles.addButton}
                                                textStyle={{ fontSize: 12 }}
                                                onPress={() => handleAdd(prod)}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Card>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 80,
    },

    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        padding: 0,
        overflow: 'hidden',
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    details: {
        padding: 10,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        marginLeft: 6,
    },
    addButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginTop: 8,
        borderRadius: 6,
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    qtyBtn: {
        backgroundColor: Colors.text.dark,
        width: 40,
        height: 24,
        borderRadius: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default ProductList;
