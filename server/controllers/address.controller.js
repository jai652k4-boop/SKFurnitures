import { Address } from '../models/index.js';

// @desc    Get all addresses for logged-in user
// @route   GET /api/addresses
// @access  Private
export const getUserAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user._id }).sort('-createdAt');
        res.json({ success: true, data: addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new address
// @route   POST /api/addresses
// @access  Private
export const createAddress = async (req, res) => {
    try {
        const address = await Address.create({
            ...req.body,
            user: req.user._id
        });

        res.status(201).json({ success: true, data: address });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        // Check if user owns the address
        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this address' });
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({ success: true, data: updatedAddress });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        // Check if user owns the address
        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this address' });
        }

        await address.deleteOne();

        res.json({ success: true, message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
