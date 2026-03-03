import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const { session } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetchAddresses();
        } else {
            setAddresses([]);
            setSelectedAddress(null);
        }
    }, [session]);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setAddresses(data || []);
            if (data?.length > 0) {
                setSelectedAddress(prev => {
                    if (prev && data.find(a => a.id === prev.id)) return prev;
                    return data[0];
                });
            }
        } catch (error) {
            console.log('Error fetching addresses:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const addAddress = async (address) => {
        try {
            const { data, error } = await supabase
                .from('addresses')
                .insert([{
                    ...address,
                    user_id: session.user.id
                }])
                .select()
                .single();

            if (error) throw error;

            setAddresses(prev => [data, ...prev]);
            setSelectedAddress(data);
            return true;
        } catch (error) {
            console.log('Error adding address:', error.message);
            return false;
        }
    };

    const selectAddress = (address) => {
        setSelectedAddress(address);
    };

    return (
        <LocationContext.Provider value={{
            addresses,
            selectedAddress,
            addAddress,
            selectAddress,
            loading
        }}>
            {children}
        </LocationContext.Provider>
    );
};
