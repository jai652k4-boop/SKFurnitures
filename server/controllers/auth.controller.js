import { User, Product } from '../models/index.js';

export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('cart.product', 'name price images stock')
            .populate('favorites', 'name price images averageRating');

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { name, phone, profileImage } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, profileImage },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const user = await User.findById(req.user._id);

        // Check if product already in cart
        const cartItemIndex = user.cart.findIndex(
            item => item.product.toString() === productId
        );

        if (cartItemIndex > -1) {
            // Update quantity
            user.cart[cartItemIndex].quantity += quantity;
        } else {
            // Add new item
            user.cart.push({ product: productId, quantity });
        }

        await user.save();

        const updatedUser = await User.findById(req.user._id)
            .populate('cart.product', 'name price images stock');

        res.json({ success: true, data: updatedUser.cart });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const user = await User.findById(req.user._id);

        const cartItem = user.cart.find(
            item => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        cartItem.quantity = quantity;
        await user.save();

        const updatedUser = await User.findById(req.user._id)
            .populate('cart.product', 'name price images stock');

        res.json({ success: true, data: updatedUser.cart });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user._id);
        user.cart = user.cart.filter(
            item => item.product.toString() !== productId
        );

        await user.save();

        const updatedUser = await User.findById(req.user._id)
            .populate('cart.product', 'name price images stock');

        res.json({ success: true, data: updatedUser.cart });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('cart.product', 'name price images stock');

        res.json({ success: true, data: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addToFavorites = async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const user = await User.findById(req.user._id);

        if (user.favorites.includes(productId)) {
            return res.status(400).json({ success: false, message: 'Product already in favorites' });
        }

        user.favorites.push(productId);
        await user.save();

        const updatedUser = await User.findById(req.user._id)
            .populate('favorites', 'name price images averageRating');

        res.json({ success: true, data: updatedUser.favorites });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const removeFromFavorites = async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user._id);
        user.favorites = user.favorites.filter(
            favId => favId.toString() !== productId
        );

        await user.save();

        const updatedUser = await User.findById(req.user._id)
            .populate('favorites', 'name price images averageRating');

        res.json({ success: true, data: updatedUser.favorites });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favorites', 'name price images averageRating');

        res.json({ success: true, data: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const userId = req.user._id;

        await User.findByIdAndUpdate(userId, { cart: cartItems });

        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {

        res.json({ success: false, message: error.message });
    }
};

export default {
    getMe,
    updateProfile,
    logout,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCart,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    updateCart
};
