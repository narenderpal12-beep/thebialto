import nodemailer from "nodemailer";
import { logger } from "./lib/logger";

const ADMIN_EMAIL = "nareninsa12@gmail.com";

function createTransporter() {
  const user = process.env["EMAIL_USER"];
  const pass = process.env["EMAIL_PASS"];
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  nights: number;
  totalAmount: number;
  discountAmount: number;
  couponCode?: string | null;
  specialRequests?: string | null;
}

export async function sendBookingNotification(data: BookingEmailData): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) {
    logger.warn("Email not configured (EMAIL_USER / EMAIL_PASS missing) — skipping notification");
    return;
  }

  const nights = data.nights;
  const finalAmount = data.totalAmount - data.discountAmount;

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0b1220; color: #f5f0e8; padding: 32px; border-radius: 8px;">
      <h1 style="color: #c47c2b; font-size: 24px; margin-bottom: 4px;">New Booking Request</h1>
      <p style="color: #9ca3af; margin-top: 0;">The Bialto by Asemont Estate</p>
      <hr style="border-color: #c47c2b33; margin: 20px 0;" />

      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #9ca3af; width: 160px;">Guest Name</td><td style="color: #f5f0e8; font-weight: bold;">${data.guestName}</td></tr>
        <tr><td style="padding: 8px 0; color: #9ca3af;">Email</td><td style="color: #f5f0e8;">${data.guestEmail}</td></tr>
        <tr><td style="padding: 8px 0; color: #9ca3af;">Phone</td><td style="color: #f5f0e8;">${data.guestPhone}</td></tr>
        <tr><td style="padding: 8px 0; color: #9ca3af;">Room / Floor</td><td style="color: #f5f0e8;">${data.roomType}</td></tr>
        <tr><td style="padding: 8px 0; color: #9ca3af;">Check-in</td><td style="color: #f5f0e8;">${data.checkIn}</td></tr>
        <tr><td style="padding: 8px 0; color: #9ca3af;">Check-out</td><td style="color: #f5f0e8;">${data.checkOut}</td></tr>
        <tr><td style="padding: 8px 0; color: #9ca3af;">Nights</td><td style="color: #f5f0e8;">${nights}</td></tr>
        <tr><td style="padding: 8px 0; color: #9ca3af;">Adults</td><td style="color: #f5f0e8;">${data.adults}</td></tr>
        <tr><td style="padding: 8px 0; color: #9ca3af;">Children</td><td style="color: #f5f0e8;">${data.children}</td></tr>
        ${data.couponCode ? `<tr><td style="padding: 8px 0; color: #9ca3af;">Coupon</td><td style="color: #c47c2b;">${data.couponCode} (−₹${data.discountAmount.toLocaleString("en-IN")})</td></tr>` : ""}
        <tr><td style="padding: 8px 0; color: #9ca3af;">Base Amount</td><td style="color: #f5f0e8;">₹${data.totalAmount.toLocaleString("en-IN")}</td></tr>
        ${data.discountAmount > 0 ? `<tr><td style="padding: 8px 0; color: #9ca3af;">Discount</td><td style="color: #22c55e;">−₹${data.discountAmount.toLocaleString("en-IN")}</td></tr>` : ""}
        <tr style="border-top: 1px solid #c47c2b33;">
          <td style="padding: 12px 0 8px; color: #c47c2b; font-weight: bold; font-size: 16px;">Total Amount</td>
          <td style="color: #c47c2b; font-weight: bold; font-size: 16px;">₹${finalAmount.toLocaleString("en-IN")}</td>
        </tr>
        ${data.specialRequests ? `<tr><td style="padding: 8px 0; color: #9ca3af; vertical-align: top;">Special Requests</td><td style="color: #f5f0e8;">${data.specialRequests}</td></tr>` : ""}
      </table>

      <div style="margin-top: 24px; padding: 16px; background: #c47c2b22; border-left: 3px solid #c47c2b; border-radius: 4px;">
        <p style="margin: 0; color: #c47c2b; font-size: 14px;">Please log in to the admin panel to confirm or manage this booking.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"The Bialto Booking" <${process.env["EMAIL_USER"]}>`,
      to: ADMIN_EMAIL,
      subject: `New Booking Request — ${data.guestName} · ${data.roomType} · ${data.checkIn}`,
      html,
    });
    logger.info({ guestEmail: data.guestEmail }, "Booking notification email sent");
  } catch (err) {
    logger.error({ err }, "Failed to send booking notification email");
  }
}
