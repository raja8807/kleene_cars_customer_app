export const CATEGORIES = [
    { id: '1', name: 'Washing', icon: 'water', image: 'https://via.placeholder.com/100?text=Wash' },
    { id: '2', name: 'Interior', icon: 'car-seat', image: 'https://via.placeholder.com/100?text=Interior' },
    { id: '3', name: 'Polishing', icon: 'sparkles', image: 'https://via.placeholder.com/100?text=Polish' },
    { id: '4', name: 'Services', icon: 'construct', image: 'https://via.placeholder.com/100?text=Service' },
];

export const PRODUCTS = [
    {
        id: '1',
        name: 'Car Wax Polish',
        price: 499,
        discountPrice: 399,
        image: 'https://via.placeholder.com/150?text=Wax',
        description: 'Premium car wax for long lasting shine.'
    },
    {
        id: '2',
        name: 'Microfiber Cloth',
        price: 199,
        discountPrice: 149,
        image: 'https://via.placeholder.com/150?text=Cloth',
        description: 'Soft microfiber cloth for scratch-free cleaning.'
    },
    {
        id: '3',
        name: 'Tyre Inflator',
        price: 2999,
        discountPrice: 2499,
        image: 'https://via.placeholder.com/150?text=Inflator',
        description: 'Portable tyre inflator for emergencies.'
    },
];

export const BANNERS = [
    { id: '1', image: 'https://via.placeholder.com/600x300/4F46E5/FFFFFF?text=Get+50%25+Off+First+Service' },
    { id: '2', image: 'https://via.placeholder.com/600x300/10B981/FFFFFF?text=Premium+Wash+Available' },
];

export const SERVICES = [
    {
        id: '1',
        name: 'Premium Foam Wash',
        price: 499,
        discountPrice: 399,
        image: 'https://via.placeholder.com/150?text=Foam+Wash',
        description: 'Complete exterior foam wash with tyre dressing.',
        categoryId: '1',
    },
    {
        id: '2',
        name: 'Interior Deep Clean',
        price: 999,
        discountPrice: 899,
        image: 'https://via.placeholder.com/150?text=Interior',
        description: 'Deep vacuum and upholstery cleaning.',
        categoryId: '2',
    },
    {
        id: '3',
        name: 'Ceramic Coating',
        price: 4999,
        discountPrice: 3999,
        image: 'https://via.placeholder.com/150?text=Ceramic',
        description: 'Long lasting protection and shine.',
        categoryId: '3',
    }
];
