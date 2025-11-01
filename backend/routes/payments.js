const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { protect } = require("../middleware/auth");
const Order = require("../models/Order");
const User = require("../models/User");
const emailService = require("../services/emailService");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent for Stripe
// @access  Private
router.post("/create-payment-intent", protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Order already paid" });
    }

    // Create payment intent with detailed description for Indian compliance
    const itemNames = order.orderItems.map((item) => item.name).join(", ");

    // Create or retrieve customer
    let customer;
    try {
      // Try to find existing customer by email
      const existingCustomers = await stripe.customers.list({
        email: order.user.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          name: order.user.name,
          email: order.user.email,
          address: {
            line1: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            postal_code: order.shippingAddress.zipCode,
            country: order.shippingAddress.country,
          },
        });
      }
    } catch (customerError) {
      console.error("Customer creation/retrieval error:", customerError);
      // Continue without customer if there's an error
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: "usd",
      description: `Ram Vatika purchase - Order #${order.orderNumber}`,
      statement_descriptor: "RAMVATIKA",
      customer: customer ? customer.id : undefined,
      shipping: {
        name: order.user.name,
        address: {
          line1: order.shippingAddress.street,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          postal_code: order.shippingAddress.zipCode,
          country: order.shippingAddress.country,
        },
      },
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
        orderNumber: order.orderNumber,
        items: itemNames,
        itemCount: order.orderItems.length.toString(),
        customerEmail: order.user.email || "",
        customerName: order.user.name || "",
        customerAddress: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Webhook handler function
const webhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  console.log("Webhook received:", req.body ? "Body present" : "No body");
  console.log("Webhook signature:", sig ? "Present" : "Missing");
  console.log("Raw body type:", typeof req.body);
  console.log("Raw body length:", req.body ? req.body.length : 0);

  try {
    const webhookSecret =
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_secret";
    console.log("Webhook secret:", webhookSecret ? "Set" : "Not set");
    console.log(
      "Webhook secret value:",
      webhookSecret.substring(0, 10) + "..."
    );

    if (!webhookSecret || webhookSecret === "whsec_your_webhook_secret_here") {
      console.error("Webhook secret not properly configured");
      return res.status(400).send("Webhook secret not configured");
    }

    // Use the raw body buffer
    const rawBody = req.body;
    console.log("Constructing event with raw body...");
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    console.log("Event constructed successfully:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      console.log("Payment failed:", failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

const handlePaymentSuccess = async (paymentIntent) => {
  try {
    const orderId = paymentIntent.metadata.orderId;
    const order = await Order.findById(orderId).populate("user");

    if (order && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = "confirmed"; // Set status to confirmed after payment
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: paymentIntent.receipt_email,
      };

      await order.save();
      console.log(`Order ${orderId} marked as paid and confirmed`);

      // Send order confirmation email with invoice PDF
      try {
        const pdfBuffer = await emailService.generateInvoicePDF(order);

        // Prepare attachments (pdf + inline logo if available)
        const attachments = [
          {
            filename: `invoice-${order.orderNumber || order._id}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ];
        const logoPath = path.resolve(
          __dirname,
          "..",
          "..",
          "frontend",
          "public",
          "Products",
          "Logo.jpg"
        );
        if (fs.existsSync(logoPath)) {
          attachments.push({
            filename: "logo.jpg",
            path: logoPath,
            cid: "ramvatika-logo",
          });
        }

        await emailService.transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: order.user.email,
          subject: `Your Ram Vatika Order Confirmation (#${order.orderNumber})`,
          html: emailService.generateEmailTemplate(
            order,
            fs.existsSync(logoPath) ? "cid:ramvatika-logo" : null
          ),
          attachments,
        });
        console.log(`Order confirmation email sent to ${order.user.email}`);
      } catch (emailErr) {
        console.error("Failed to send order confirmation email:", emailErr);
      }
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
};
module.exports = router;
module.exports.webhookHandler = webhookHandler;
