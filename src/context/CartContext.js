import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import { useVehicle } from "./VehicleContext";
import { useLocation } from "./LocationContext";
import { getStatusIndex } from "../helpers/status_helper";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { session } = useAuth();
  const { selectedVehicle } = useVehicle();
  const { selectedAddress } = useLocation();

  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Load orders on session change and setup subscription
  useEffect(() => {
    let subscription;

    if (session?.user) {
      fetchOrders();

      // Set up real-time subscription
      subscription = supabase
        .channel("orders-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            handleRealtimeUpdate(payload);
          },
        )
        .subscribe();
    } else {
      setOrders([]);
      setCartItems([]);
    }

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [session]);

  const fetchFullOrder = async (orderId) => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
      *,
      order_items (*),
      vehicles (*),
      addresses (*),
      worker_assignments (
                        *,
                        workers (*)
                    )
    `,
      )
      .eq("id", orderId)
      .single();

    if (!error) return data;
    return null;
  };

  const handleRealtimeUpdate = async (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    if (eventType === "INSERT") {
      const fullOrder = await fetchFullOrder(newRecord.id);

      if (fullOrder) {
        setOrders((prev) => [fullOrder, ...prev]);
      }
    } else if (eventType === "UPDATE") {
      const fullOrder = await fetchFullOrder(newRecord.id);

      console.log("full---->>", fullOrder);

      if (fullOrder) {
        setOrders((prev) =>
          prev.map((order) => (order.id === fullOrder.id ? fullOrder : order)),
        );
      }
    } else if (eventType === "DELETE") {
      setOrders((prev) => prev.filter((order) => order.id !== oldRecord.id));
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
                    *,
                    order_items (*),
                    vehicles (*),
                    addresses (*),
                    worker_assignments (
                        *,
                        workers (*)
                    )
                `,
        )
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (error) {
      console.log("Error fetching orders:", error.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Add item to cart
  const addToCart = (item, type = "product", resourceAvailability = null) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.type === type,
      );
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id && i.type === type
            ? {
              ...i,
              quantity: i.quantity + (type === "product" ? 1 : 0),
              resourceAvailability: resourceAvailability || i.resourceAvailability,
            }
            : i,
        );
      }
      return [
        ...prevItems,
        { ...item, type, quantity: 1, resourceAvailability },
      ];
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId, type) => {
    setCartItems((prevItems) =>
      prevItems.filter((i) => !(i.id === itemId && i.type === type)),
    );
  };

  // Update quantity
  const updateQuantity = (itemId, type, change) => {
    setCartItems((prevItems) =>
      prevItems.map((i) => {
        if (i.id === itemId && i.type === type) {
          const newQty = change;
          return newQty > 0 ? { ...i, quantity: newQty } : i;
        }
        return i;
      }),
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => {
      let itemPrice = item.discountPrice;

      if (item.type === "service" && item.resourceAvailability) {
        if (item.water_required && !item.resourceAvailability.water) {
          itemPrice += item.water_price || 0;
        }
        if (
          item.electricity_required &&
          !item.resourceAvailability.electricity
        ) {
          itemPrice += item.electricity_price || 0;
        }
      }

      return sum + itemPrice * item.quantity;
    }, 0);
  };

  // Place order
  const placeOrder = async ({
    slot = null,
    availability,
    additionalNotes = "",
  } = {}) => {
    if (!session?.user) {
      alert("Please sign in to place an order");
      return null;
    }

    try {
      const total = getCartTotal();

      // 1. Create Order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: session.user.id,
            vehicle_id: selectedVehicle?.id,
            address_id: selectedAddress?.id,
            total_amount: total,
            status: "Booked",
            scheduled_date: slot?.date || null,
            scheduled_time: slot?.time || null,
            electricity_available: availability?.electricity || false,
            water_available: availability?.water || false,
            additional_notes: additionalNotes,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItemsData = cartItems.map((item) => {
        let itemPrice = item.discountPrice;

        if (item.type === "service" && item.resourceAvailability) {
          if (item.water_required && !item.resourceAvailability.water) {
            itemPrice += item.water_price || 0;
          }
          if (
            item.electricity_required &&
            !item.resourceAvailability.electricity
          ) {
            itemPrice += item.electricity_price || 0;
          }
        }

        return {
          order_id: orderData.id,
          item_id: item.id,
          item_type: item.type,
          name: item.name,
          price: itemPrice,
          quantity: item.quantity,
          image: item.image,
          electricity_available: item.resourceAvailability?.electricity ?? null,
          water_available: item.resourceAvailability?.water ?? null,
        };
      });

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      // Success
      setCartItems([]);
      fetchOrders(); // Refresh order list
      return orderData;
    } catch (error) {
      console.log("Error placing order:", error.message);
      alert("Failed to place order: " + error.message);
      return null;
    }
  };

  const refreshOrder = async (orderId) => {
    try {
      const data = await fetchFullOrder(orderId);
      if (data) {
        setOrders((prev) => {
          const exists = prev.find((o) => o.id === data.id);
          if (exists) {
            return prev.map((o) => (o.id === data.id ? data : o));
          }
          return [data, ...prev];
        });
        return data;
      }
    } catch (error) {
      console.log("Error refreshing order", error);
    }
    return null;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        placeOrder,
        getCartTotal,
        refreshOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
