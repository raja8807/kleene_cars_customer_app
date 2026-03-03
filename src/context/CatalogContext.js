import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CatalogContext = createContext();

export const useCatalog = () => useContext(CatalogContext);

export const CatalogProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [services, setServices] = useState([]); // All services or fetched on demand? Fetching all for now for simplicity
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {

        try {
            setLoading(true);
            const [cats, prods, bans, servs] = await Promise.all([
                supabase.from('categories').select('*').order('name'),
                supabase.from('products').select('*').order('name'),
                supabase.from('banners').select('*'),
                supabase.from('services').select('*')
            ]);

            if (cats.error) throw cats.error;
            if (prods.error) throw prods.error;
            if (bans.error) throw bans.error;
            if (servs.error) throw servs.error;

            setCategories(cats.data || []);

            // Map Products: snake_case -> camelCase
            const mappedProducts = (prods.data || []).map(p => ({
                ...p,
                discountPrice: p.discount_price,
            }));
            setProducts(mappedProducts);

            setBanners(bans.data || []);

            // Map Services: snake_case -> camelCase
            const mappedServices = (servs.data || []).map(s => ({
                ...s,
                discountPrice: s.discount_price,
                categoryId: s.category_id,
            }));
            setServices(mappedServices);

        } catch (error) {
            console.log('Error fetching catalog:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const getServicesByCategory = (categoryId) => {
        return services.filter(s => s.categoryId === categoryId);
    };

    return (
        <CatalogContext.Provider value={{
            categories,
            products,
            banners,
            services,
            loading,
            refreshCatalog: fetchAllData,
            getServicesByCategory
        }}>
            {children}
        </CatalogContext.Provider>
    );
};
