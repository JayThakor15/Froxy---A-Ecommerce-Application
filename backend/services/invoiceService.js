const PDFDocument = require("pdfkit");
const Order = require("../models/Order");
const User = require("../models/User");

// Generate PDF invoice for an order
async function generateInvoice(req, res) {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order.orderNumber || order._id}.pdf`
    );

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    // Header with color
    doc.rect(0, 0, doc.page.width, 60).fill("#2563eb");
    doc
      .fillColor("white")
      .fontSize(28)
      .font("Helvetica-Bold")
      .text("Froxy", 40, 18, { align: "left", continued: false });
    doc.moveDown(2);
    doc.fillColor("black").font("Helvetica");

    // Invoice title and meta
    doc.fontSize(20).text("INVOICE", { align: "right" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Order Number: ${order.orderNumber || order._id}`, {
      align: "right",
    });
    doc.text(`Order Date: ${order.createdAt.toLocaleDateString()}`, {
      align: "right",
    });
    doc.text(`Customer: ${order.user.name} (${order.user.email})`, {
      align: "right",
    });

    // Divider
    doc.moveDown(1);
    doc
      .lineWidth(1)
      .moveTo(40, doc.y)
      .lineTo(doc.page.width - 40, doc.y)
      .stroke("#e5e7eb");
    doc.moveDown(1);

    // Shipping Address
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Shipping Address:", 40, doc.y);
    doc.font("Helvetica").fontSize(12).text(`${order.shippingAddress.street}`);
    doc.text(
      `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`
    );
    doc.text(`${order.shippingAddress.country}`);

    // Divider
    doc.moveDown(1);
    doc
      .lineWidth(1)
      .moveTo(40, doc.y)
      .lineTo(doc.page.width - 40, doc.y)
      .stroke("#e5e7eb");
    doc.moveDown(1);

    // Items Table Header
    doc.fontSize(14).font("Helvetica-Bold").text("Order Items:", 40, doc.y);
    doc.moveDown(0.5);
    const tableTop = doc.y;
    const itemX = 40,
      qtyX = 300,
      priceX = 370,
      totalX = 450;
    doc.fontSize(12).font("Helvetica-Bold");
    doc.text("Item", itemX, tableTop, { width: 200 });
    doc.text("Qty", qtyX, tableTop, { width: 40, align: "right" });
    doc.text("Price", priceX, tableTop, { width: 60, align: "right" });
    doc.text("Total", totalX, tableTop, { width: 80, align: "right" });
    doc.moveDown(0.2);
    doc
      .lineWidth(0.5)
      .moveTo(itemX, doc.y)
      .lineTo(doc.page.width - 40, doc.y)
      .stroke("#cbd5e1");

    // Items Table Rows
    doc.font("Helvetica").fontSize(12);
    let y = doc.y + 2;
    order.orderItems.forEach((item) => {
      doc.text(item.name, itemX, y, { width: 200 });
      doc.text(item.quantity.toString(), qtyX, y, {
        width: 40,
        align: "right",
      });
      doc.text(`$${item.price.toFixed(2)}`, priceX, y, {
        width: 60,
        align: "right",
      });
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, totalX, y, {
        width: 80,
        align: "right",
      });
      y += 20;
    });

    // Divider
    doc
      .moveTo(itemX, y)
      .lineTo(doc.page.width - 40, y)
      .stroke("#cbd5e1");
    y += 10;

    // Summary
    doc
      .font("Helvetica-Bold")
      .text("Subtotal", priceX, y, { width: 60, align: "right" });
    doc.font("Helvetica").text(`$${order.itemsPrice.toFixed(2)}`, totalX, y, {
      width: 80,
      align: "right",
    });
    y += 18;
    doc
      .font("Helvetica-Bold")
      .text("Tax", priceX, y, { width: 60, align: "right" });
    doc.font("Helvetica").text(`$${order.taxPrice.toFixed(2)}`, totalX, y, {
      width: 80,
      align: "right",
    });
    y += 18;
    doc
      .font("Helvetica-Bold")
      .text("Shipping", priceX, y, { width: 60, align: "right" });
    doc
      .font("Helvetica")
      .text(`$${order.shippingPrice.toFixed(2)}`, totalX, y, {
        width: 80,
        align: "right",
      });
    y += 18;
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#2563eb")
      .text("Total", priceX, y, { width: 60, align: "right" });
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#2563eb")
      .text(`$${order.totalPrice.toFixed(2)}`, totalX, y, {
        width: 80,
        align: "right",
      });
    doc.fillColor("black").fontSize(12);

    // Footer
    doc.moveDown(4);
    doc
      .fontSize(12)
      .fillColor("#64748b")
      .text("Thank you for your purchase!", { align: "center" });
    doc
      .fontSize(10)
      .fillColor("#94a3b8")
      .text("For support, contact support@froxy.com", { align: "center" });
    doc.end();
  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { generateInvoice };
