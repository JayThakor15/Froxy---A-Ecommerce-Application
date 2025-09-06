const express = require("express");
const { body, validationResult } = require("express-validator");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post(
  "/",
  protect,
  [
    body("orderItems")
      .isArray({ min: 1 })
      .withMessage("Order items are required"),
    body("shippingAddress.street")
      .notEmpty()
      .withMessage("Street address is required"),
    body("shippingAddress.city").notEmpty().withMessage("City is required"),
    body("shippingAddress.state").notEmpty().withMessage("State is required"),
    body("shippingAddress.zipCode")
      .notEmpty()
      .withMessage("Zip code is required"),
    body("paymentMethod")
      .isIn(["stripe", "paypal", "cash_on_delivery"])
      .withMessage("Invalid payment method"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { orderItems, shippingAddress, paymentMethod } = req.body;

      // Calculate prices
      let itemsPrice = 0;
      const orderItemsWithDetails = [];

      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res
            .status(404)
            .json({ message: `Product ${item.product} not found` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          });
        }

        const itemTotal = product.price * item.quantity;
        itemsPrice += itemTotal;

        orderItemsWithDetails.push({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: item.quantity,
        });
      }

      const taxPrice = itemsPrice * 0.08; // 8% tax
      const shippingPrice = itemsPrice > 50 ? 0 : 10; // Free shipping over $50
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      const order = new Order({
        user: req.user._id,
        orderItems: orderItemsWithDetails,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      // Update product stock
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      res.status(201).json(createdOrder);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns the order or is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = req.body;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Update order payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (admin only)
// @access  Private (Admin)
router.put(
  "/:id/status",
  protect,
  admin,
  [
    body("status")
      .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
      .withMessage("Invalid status"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status, trackingNumber, notes } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.status = status;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (notes) order.notes = notes;

      if (status === "delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/orders/admin/all
// @desc    Get all orders (admin only)
// @access  Private (Admin)
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const { generateInvoice } = require("../services/invoiceService");

// @route   GET /api/orders/:id/invoice
// @desc    Download invoice PDF for order
// @access  Private
router.get("/:id/invoice", protect, generateInvoice);

module.exports = router;
