import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const VehicleContext = createContext();

export const useVehicle = () => useContext(VehicleContext);

export const VehicleProvider = ({ children }) => {
    const { session } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetchVehicles();
        } else {
            setVehicles([]);
            setSelectedVehicle(null);
        }
    }, [session]);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setVehicles(data || []);
            if (data?.length > 0) {
                // Keep selected vehicle if it still exists, otherwise select first
                setSelectedVehicle(prev => {
                    if (prev && data.find(v => v.id === prev.id)) return prev;
                    return data[0];
                });
            }
        } catch (error) {
            console.log('Error fetching vehicles:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const addVehicle = async (vehicle) => {
        try {
            const { data, error } = await supabase
                .from('vehicles')
                .insert([{
                    ...vehicle,
                    user_id: session.user.id
                }])
                .select()
                .single();

            if (error) throw error;

            setVehicles(prev => [data, ...prev]);
            setSelectedVehicle(data);
            return true;
        } catch (error) {
            console.log('Error adding vehicle:', error.message);
            return false;
        }
    };

    const selectVehicle = (vehicle) => {
        setSelectedVehicle(vehicle);
    };

    return (
        <VehicleContext.Provider value={{
            vehicles,
            selectedVehicle,
            addVehicle,
            selectVehicle,
            loading
        }}>
            {children}
        </VehicleContext.Provider>
    );
};
