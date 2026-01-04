import api from './api';

// Get user addresses
export const getUserAddresses = async () => {
    const { data } = await api.get('/addresses');
    return data;
};

// Create address
export const createAddress = async (addressData) => {
    const { data } = await api.post('/addresses', addressData);
    return data;
};

// Update address
export const updateAddress = async (id, addressData) => {
    const { data } = await api.put(`/addresses/${id}`, addressData);
    return data;
};

// Delete address
export const deleteAddress = async (id) => {
    const { data } = await api.delete(`/addresses/${id}`);
    return data;
};

export default {
    getUserAddresses,
    createAddress,
    updateAddress,
    deleteAddress
};
