import "server-only";

import { persistBooking } from "@/lib/storage";
import type {
  BookingPayload,
  BookingRecord,
  BookingResult,
  BookingValidationErrors,
} from "@/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-EG", {
    currency: "EGP",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function validateBooking(payload: BookingPayload): BookingValidationErrors {
  const errors: BookingValidationErrors = {};

  if (!payload?.customer?.name || payload.customer.name.trim().length < 3) {
    errors.name = "Please enter a valid name.";
  }

  if (!payload?.customer?.phone || !/^[0-9+\s()-]{8,20}$/.test(payload.customer.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!payload?.customer?.address || payload.customer.address.trim().length < 8) {
    errors.address = "Please enter a complete address.";
  }

  if (!Array.isArray(payload?.items) || payload.items.length === 0) {
    errors.items = "Add at least one product before submitting.";
  }

  return errors;
}

function formatBookingMessage(booking: BookingRecord) {
  const total = booking.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const products = booking.items
    .map(
      (item) =>
        `- ${item.name} | Category: ${item.category} | Qty: ${item.quantity} | Unit Price: ${formatCurrency(item.price)} | Line Total: ${formatCurrency(item.quantity * item.price)}`,
    )
    .join("\n");

  return [
    `Booking ID: ${booking.id}`,
    `Created At: ${booking.createdAt}`,
    `Customer Name: ${booking.customer.name}`,
    `Phone: ${booking.customer.phone}`,
    `Address: ${booking.customer.address}`,
    `Notes: ${booking.customer.notes || "N/A"}`,
    `Shipping Method: ${booking.shippingMethod.label}`,
    `Shipping Fee: ${formatCurrency(booking.shippingMethod.fee)}`,
    `Shipping ETA: ${booking.shippingMethod.eta}`,
    `Payment Method: ${booking.paymentMethod.label} (${booking.paymentMethod.feeLabel})`,
    `Order Total: ${formatCurrency(total)}`,
    "",
    "Booked Items:",
    products,
  ].join("\n");
}

function formatBookingHtml(booking: BookingRecord) {
  const total = booking.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const rows = booking.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">${item.name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">${item.category}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">${item.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">${formatCurrency(item.price)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">${formatCurrency(item.price * item.quantity)}</td>
        </tr>
      `,
    )
    .join("");

  return `
    <div style="font-family:Segoe UI,Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;">
        <div style="padding:24px 28px;background:linear-gradient(135deg,#0f766e,#14b8a6);color:#ffffff;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;">New Booking Request</p>
          <h1 style="margin:0;font-size:28px;line-height:1.2;">RZ Dental booking ${booking.id}</h1>
        </div>
        <div style="padding:24px 28px;">
          <h2 style="margin:0 0 12px;font-size:20px;">Customer Details</h2>
          <p style="margin:0 0 8px;"><strong>Name:</strong> ${booking.customer.name}</p>
          <p style="margin:0 0 8px;"><strong>Phone:</strong> ${booking.customer.phone}</p>
          <p style="margin:0 0 8px;"><strong>Address:</strong> ${booking.customer.address}</p>
          <p style="margin:0 0 8px;"><strong>Notes:</strong> ${booking.customer.notes || "N/A"}</p>
          <p style="margin:0 0 8px;"><strong>Shipping Method:</strong> ${booking.shippingMethod.label}</p>
          <p style="margin:0 0 8px;"><strong>Shipping Fee:</strong> ${formatCurrency(booking.shippingMethod.fee)}</p>
          <p style="margin:0 0 8px;"><strong>Arrival Window:</strong> ${booking.shippingMethod.eta}</p>
          <p style="margin:0 0 8px;"><strong>Payment Method:</strong> ${booking.paymentMethod.label} (${booking.paymentMethod.feeLabel})</p>
          <p style="margin:0 0 24px;"><strong>Created At:</strong> ${booking.createdAt}</p>

          <h2 style="margin:0 0 12px;font-size:20px;">Booked Products</h2>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
            <thead style="background:#f1f5f9;text-align:left;">
              <tr>
                <th style="padding:10px 12px;">Product</th>
                <th style="padding:10px 12px;">Category</th>
                <th style="padding:10px 12px;">Qty</th>
                <th style="padding:10px 12px;">Unit Price</th>
                <th style="padding:10px 12px;">Line Total</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <div style="margin-top:20px;padding:16px 18px;border-radius:16px;background:#ecfeff;border:1px solid #a5f3fc;">
            <strong>Products Total:</strong> ${formatCurrency(total)}<br />
            <strong>Shipping Fee:</strong> ${formatCurrency(booking.shippingMethod.fee)}<br />
            <strong>Final Total:</strong> ${formatCurrency(total + booking.shippingMethod.fee)}
          </div>
        </div>
      </div>
    </div>
  `;
}

async function sendEmailNotification(booking: BookingRecord) {
  const adminEmail = process.env.ADMIN_EMAIL || "mostafaa.mhmd12@gmail.com";
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return false;
  }

  try {
    const nodemailer = (await import("nodemailer")) as {
      createTransport: (config: Record<string, unknown>) => {
        sendMail: (config: Record<string, unknown>) => Promise<unknown>;
      };
    };

    const transporter = nodemailer.createTransport({
      auth: {
        pass: smtpPass,
        user: smtpUser,
      },
      host: smtpHost,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpUser,
      html: formatBookingHtml(booking),
      subject: `New RZ Dental booking #${booking.id}`,
      text: formatBookingMessage(booking),
      to: adminEmail,
    });

    return true;
  } catch (error) {
    console.error("Email notification skipped", error);
    return false;
  }
}

async function sendWhatsAppNotification(booking: BookingRecord) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = process.env.ADMIN_WHATSAPP_TO || "whatsapp:+201021535882";

  if (!accountSid || !authToken || !from) {
    return false;
  }

  const body = new URLSearchParams({
    Body: formatBookingMessage(booking),
    From: from,
    To: to,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    },
  );

  return response.ok;
}

export async function createBooking(payload: BookingPayload): Promise<BookingResult> {
  const fieldErrors = validateBooking(payload);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please review the booking form and cart details.",
      ok: false,
    };
  }

  const booking: BookingRecord = {
    createdAt: new Date().toISOString(),
    customer: {
      address: payload.customer.address.trim(),
      name: payload.customer.name.trim(),
      notes: payload.customer.notes?.trim() || "",
      phone: payload.customer.phone.trim(),
    },
    id: `RZD-${Date.now()}`,
    items: payload.items.map((item) => ({
      brand: item.brand,
      category: item.category,
      categoryTags: item.categoryTags,
      description: item.description,
      id: item.id,
      image: item.image,
      inStock: item.inStock,
      name: item.name,
      originalPrice: item.originalPrice,
      price: item.price,
      quantity: item.quantity,
      warranty: item.warranty,
    })),
    paymentMethod: payload.paymentMethod,
    shippingMethod: payload.shippingMethod,
  };

  await persistBooking(booking);

  const [emailSent, whatsappSent] = await Promise.all([
    sendEmailNotification(booking),
    sendWhatsAppNotification(booking),
  ]);

  return {
    bookingId: booking.id,
    message: "Your booking has been successfully submitted",
    notifications: {
      emailSent,
      whatsappSent,
    },
    ok: true,
  };
}
