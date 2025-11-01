const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail", // You can change this to other services
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async generateInvoicePDF(order) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Generate HTML for invoice. Provide logo file path so puppeteer can load it via file://
    const logoPath = path.resolve(
      __dirname,
      "..",
      "..",
      "frontend",
      "public",
      "Products",
      "Logo.jpg"
    );
    const logoUrl = fs.existsSync(logoPath)
      ? `file://${logoPath.replace(/\\/g, "/")}`
      : null;
    // Generate HTML for invoice
    const htmlContent = this.generateInvoiceHTML(order, logoUrl);

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();
    return pdfBuffer;
  }

  generateInvoiceHTML(order, logoUrl) {
    const currentDate = new Date().toLocaleDateString();
    const orderDate = new Date(order.createdAt).toLocaleDateString();

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - Order #${order.orderNumber}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            background: #fff;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .company-info {
            font-size: 14px;
            color: #666;
          }
          .invoice-title {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .invoice-details div {
            flex: 1;
          }
          .invoice-details h3 {
            margin: 0 0 10px 0;
            color: #2563eb;
            font-size: 16px;
          }
          .invoice-details p {
            margin: 5px 0;
            font-size: 14px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .items-table th,
          .items-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          .items-table th {
            background-color: #f8f9fa;
            font-weight: bold;
            color: #2563eb;
          }
          .items-table tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          .total-section {
            text-align: right;
            margin-top: 20px;
          }
          .total-row {
            display: flex;
            justify-content: flex-end;
            margin: 5px 0;
          }
          .total-label {
            width: 150px;
            text-align: right;
            margin-right: 20px;
            font-weight: bold;
          }
          .total-value {
            width: 100px;
            text-align: right;
          }
          .grand-total {
            font-size: 18px;
            font-weight: bold;
            color: #2563eb;
            border-top: 2px solid #2563eb;
            padding-top: 10px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-confirmed {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status-processing {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status-shipped {
            background-color: #dbeafe;
            color: #1e40af;
          }
          .status-delivered {
            background-color: #d1fae5;
            color: #065f46;
          }
        </style>
      </head>
      <body>
          <div class="header">
          <div style="display:flex;align-items:center;justify-content:center;flex-direction:column;">
            ${
              logoUrl
                ? `<img src="${logoUrl}" alt="Ram Vatika" style="max-width:140px;display:block;margin-bottom:10px;"/>`
                : `<div class="logo">Ram Vatika</div>`
            }
            <div class="company-info">
              Love at First Smell<br>
              Email: support@ramvatika.com | Phone: +1 (555) 123-4567
            </div>
          </div>
        </div>

        <div class="invoice-title">INVOICE</div>

        <div class="invoice-details">
          <div>
            <h3>Bill To:</h3>
            <p><strong>${order.user.name}</strong></p>
            <p>${order.shippingAddress.street}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${
      order.shippingAddress.zipCode
    }</p>
            <p>${order.shippingAddress.country}</p>
            <p>Email: ${order.user.email}</p>
          </div>
          <div>
            <h3>Invoice Details:</h3>
            <p><strong>Invoice #:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Invoice Date:</strong> ${currentDate}</p>
            <p><strong>Status:</strong> 
              <span class="status-badge status-${order.status}">${
      order.status
    }</span>
            </p>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
             ${order.orderItems
               .map(
                 (item) => `
               <tr>
                 <td>${item.name}</td>
                 <td>${item.name}</td>
                 <td>${item.quantity}</td>
                 <td>$${item.price.toFixed(2)}</td>
                 <td>$${(item.quantity * item.price).toFixed(2)}</td>
               </tr>
             `
               )
               .join("")}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <span class="total-label">Subtotal:</span>
            <span class="total-value">$${order.totalPrice.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Shipping:</span>
            <span class="total-value">$0.00</span>
          </div>
          <div class="total-row">
            <span class="total-label">Tax:</span>
            <span class="total-value">$0.00</span>
          </div>
          <div class="total-row grand-total">
            <span class="total-label">Total:</span>
            <span class="total-value">$${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

          <div class="footer">
          <p>Thank you for your business!</p>
          <p>For any questions about this invoice, please contact us at support@ramvatika.com</p>
          <p>This invoice was generated on ${currentDate}</p>
        </div>
      </body>
      </html>
    `;
  }

  async sendOrderConfirmation(order) {
    try {
      // Generate PDF invoice
      const pdfBuffer = await this.generateInvoicePDF(order);

      // Attach logo inline if available so email shows brand logo
      const logoPath = path.resolve(
        __dirname,
        "..",
        "..",
        "frontend",
        "public",
        "Products",
        "Logo.jpg"
      );
      const attachments = [
        {
          filename: `invoice-${order.orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ];
      if (fs.existsSync(logoPath)) {
        attachments.push({
          filename: "logo.jpg",
          path: logoPath,
          cid: "ramvatika-logo",
        });
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.user.email,
        subject: `Order Confirmation - #${order.orderNumber}`,
        html: this.generateEmailTemplate(
          order,
          fs.existsSync(logoPath) ? "cid:ramvatika-logo" : null
        ),
        attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("Order confirmation email sent:", result.messageId);
      return result;
    } catch (error) {
      console.error("Error sending order confirmation email:", error);
      throw error;
    }
  }

  generateEmailTemplate(order, logoCid) {
    const orderDate = new Date(order.createdAt).toLocaleDateString();

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .content {
            padding: 30px;
          }
          .order-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .item:last-child {
            border-bottom: none;
          }
          .total {
            font-size: 18px;
            font-weight: bold;
            color: #2563eb;
            text-align: right;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #2563eb;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
            <div class="header">
              <div style="text-align:center;">
                <img src="cid:ramvatika-logo" alt="Ram Vatika" style="max-width:140px;display:block;margin:0 auto 10px;"/>
                <div class="logo">Ram Vatika</div>
                <h1 style="margin:8px 0 4px;">Order Confirmation</h1>
                <p style="margin:0;">Love at First Smell</p>
              </div>
            </div>
          
          <div class="content">
            <h2>Hello ${order.user.name}!</h2>
            <p>We're excited to confirm that your order has been received and is being processed.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order Number:</strong> #${order.orderNumber}</p>
              <p><strong>Order Date:</strong> ${orderDate}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              
               <h4>Items Ordered:</h4>
               ${order.orderItems
                 .map(
                   (item) => `
                 <div class="item">
                   <span>${item.name} x ${item.quantity}</span>
                   <span>$${(item.quantity * item.price).toFixed(2)}</span>
                 </div>
               `
                 )
                 .join("")}
              
              <div class="total">
                Total: $${order.totalPrice.toFixed(2)}
              </div>
            </div>
            
            <h3>Shipping Address</h3>
            <p>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${
      order.shippingAddress.zipCode
    }<br>
              ${order.shippingAddress.country}
            </p>
            
            <p>We'll send you another email when your order ships with tracking information.</p>
            
            <a href="${process.env.FRONTEND_URL}/order/${
      order._id
    }" class="button">View Order Details</a>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing Ram Vatika!</p>
            <p>If you have any questions, please contact us at support@ramvatika.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
