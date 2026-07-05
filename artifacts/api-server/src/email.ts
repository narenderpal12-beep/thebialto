import nodemailer from "nodemailer";
import { logger } from "./lib/logger";

const ADMIN_EMAIL = "nareninsa12@gmail.com";

// function createTransporter() {
//   const user = process.env["EMAIL_USER"];
//   const pass = process.env["EMAIL_PASS"];
//   if (!user || !pass) return null;
//   return nodemailer.createTransport({
//     service: "gmail",
//     auth: { user, pass },
//   });
// }
function createTransporter() {
  const user = "jimanan41@gmail.com";
  const pass = "gcwtjaukvhofhttv";

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",

    auth: {
      user,
      pass,
    },

    tls: {
      rejectUnauthorized: false,
    },
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
    // ========================================
    // 1. SEND BOOKING NOTIFICATION TO ADMIN
    // ========================================
  
    const adminInfo = await transporter.sendMail({
      from: `"The Bialto Booking" <jimanan41@gmail.com>`,
  
      to: ADMIN_EMAIL,
  
      replyTo: data.guestEmail,
  
      subject: `New Booking Request - ${data.guestName} - ${data.roomType}`,
  
      text: `
  New Booking Request
  
  Guest Name: ${data.guestName}
  Email: ${data.guestEmail}
  Phone: ${data.guestPhone}
  
  Room: ${data.roomType}
  
  
  Check-in: ${data.checkIn}
  Check-out: ${data.checkOut}
  Nights: ${data.nights}
  
  Adults: ${data.adults}
  Children: ${data.children}
  
  Total Amount: ₹${finalAmount.toLocaleString("en-IN")}
  
  Special Requests:
  ${data.specialRequests || "None"}
      `,
  
      html,
    });
  
    logger.info(
      {
        messageId: adminInfo.messageId,
        accepted: adminInfo.accepted,
        rejected: adminInfo.rejected,
      },
      "Admin booking notification email sent"
    );
  
  
    // ========================================
    // 2. SEND THANK-YOU EMAIL TO GUEST
    // ========================================
  
    const guestHtml = `
      <div style="
        font-family: Georgia, serif;
        max-width: 600px;
        margin: 0 auto;
        background: #0b1220;
        color: #f5f0e8;
        padding: 32px;
        border-radius: 8px;
      ">
  
        <h1 style="
          color: #c47c2b;
          font-size: 26px;
          margin-bottom: 8px;
        ">
          Thank You for Your Booking Request
        </h1>
  
        <p style="
          color: #9ca3af;
          margin-top: 0;
        ">
          The Bialto by Asemont Estate
        </p>
  
        <hr style="
          border: none;
          border-top: 1px solid #c47c2b55;
          margin: 24px 0;
        " />
  
        <p style="
          color: #f5f0e8;
          font-size: 16px;
          line-height: 1.7;
        ">
          Dear ${data.guestName},
        </p>
  
        <p style="
          color: #d1d5db;
          font-size: 15px;
          line-height: 1.7;
        ">
          Thank you for choosing The Bialto by Asemont Estate.
          We have received your booking request and our team will
          get in touch with you shortly to confirm your reservation.
        </p>
  
        <div style="
          background: #111c2e;
          padding: 20px;
          margin: 24px 0;
          border-left: 3px solid #c47c2b;
          border-radius: 4px;
        ">
  
          <h3 style="
            color: #c47c2b;
            margin-top: 0;
          ">
            Your Booking Details
          </h3>
  
          <table style="
            width: 100%;
            border-collapse: collapse;
          ">
  
            <tr>
              <td style="padding: 6px 0; color: #9ca3af;">
                Room
              </td>
  
              <td style="color: #f5f0e8;">
                ${data.roomType}
              </td>
            </tr>
  
          
  
            <tr>
              <td style="padding: 6px 0; color: #9ca3af;">
                Check-in
              </td>
  
              <td style="color: #f5f0e8;">
                ${data.checkIn}
              </td>
            </tr>
  
            <tr>
              <td style="padding: 6px 0; color: #9ca3af;">
                Check-out
              </td>
  
              <td style="color: #f5f0e8;">
                ${data.checkOut}
              </td>
            </tr>
  
            <tr>
              <td style="padding: 6px 0; color: #9ca3af;">
                Guests
              </td>
  
              <td style="color: #f5f0e8;">
                ${data.adults} Adult(s), ${data.children} Child(ren)
              </td>
            </tr>
  
            <tr>
              <td style="
                padding: 10px 0;
                color: #c47c2b;
                font-weight: bold;
              ">
                Total Amount
              </td>
  
              <td style="
                color: #c47c2b;
                font-weight: bold;
              ">
                ₹${finalAmount.toLocaleString("en-IN")}
              </td>
            </tr>
  
          </table>
  
        </div>
  
        <p style="
          color: #d1d5db;
          font-size: 15px;
          line-height: 1.7;
        ">
          We are happy to welcome you and look forward to making
          your stay comfortable and memorable.
        </p>
  
        <p style="
          color: #d1d5db;
          font-size: 15px;
          line-height: 1.7;
        ">
          If you have any questions or special requests, simply
          reply to this email and our team will be happy to assist you.
        </p>
  
        <div style="
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #c47c2b33;
        ">
  
          <p style="
            color: #f5f0e8;
            margin-bottom: 4px;
          ">
            Warm regards,
          </p>
  
          <p style="
            color: #c47c2b;
            font-weight: bold;
            margin-top: 0;
          ">
            Team The Bialto
          </p>
  
          <p style="
            color: #9ca3af;
            font-size: 13px;
          ">
            Asemont Estate
          </p>
  
        </div>
  
      </div>
    `;
  
  
    const guestInfo = await transporter.sendMail({
      from: `"The Bialto" <jimanan41@gmail.com>`,
  
      to: data.guestEmail,
  
      subject: `Thank You for Your Booking Request - The Bialto`,
  
      text: `
  Dear ${data.guestName},
  
  Thank you for choosing The Bialto by Asemont Estate.
  
  We have received your booking request. Our team will contact you shortly to confirm your reservation.
  
  Booking Details:
  
  Room: ${data.roomType}
 
  Check-in: ${data.checkIn}
  Check-out: ${data.checkOut}
  Adults: ${data.adults}
  Children: ${data.children}
  
  Total Amount: ₹${finalAmount.toLocaleString("en-IN")}
  
  We are happy to welcome you and look forward to making your stay comfortable and memorable.
  
  Warm regards,
  Team The Bialto
  Asemont Estate
      `,
  
      html: guestHtml,
    });
  
  
    logger.info(
      {
        guestEmail: data.guestEmail,
        messageId: guestInfo.messageId,
        accepted: guestInfo.accepted,
        rejected: guestInfo.rejected,
      },
      "Guest confirmation email sent"
    );
  
  } catch (err) {
  
    logger.error(
      { err },
      "Failed to send booking emails"
    );
  
  }
 
}
export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function sendContactNotification(
  data: ContactEmailData
): Promise<void> {
  const transporter = createTransporter();

  if (!transporter) {
    throw new Error("Email transporter not configured");
  }

  // =====================================================
  // ADMIN EMAIL HTML
  // =====================================================

  const adminHtml = `
    <div style="
      font-family: Georgia, serif;
      max-width: 600px;
      margin: 0 auto;
      background: #0b1220;
      color: #f5f0e8;
      padding: 32px;
      border-radius: 8px;
    ">

      <h1 style="
        color: #c47c2b;
        font-size: 24px;
      ">
        New Contact Enquiry
      </h1>

      <p style="color: #9ca3af;">
        The Bialto by Asemont Estate
      </p>

      <hr style="
        border: none;
        border-top: 1px solid #c47c2b55;
        margin: 20px 0;
      " />

      <table style="
        width: 100%;
        border-collapse: collapse;
      ">

        <tr>
          <td style="padding: 8px 0; color: #9ca3af;">
            Name
          </td>

          <td>
            ${data.name}
          </td>
        </tr>

        <tr>
          <td style="padding: 8px 0; color: #9ca3af;">
            Email
          </td>

          <td>
            ${data.email}
          </td>
        </tr>

        <tr>
          <td style="padding: 8px 0; color: #9ca3af;">
            Phone
          </td>

          <td>
            ${data.phone || "Not provided"}
          </td>
        </tr>

        <tr>
          <td style="padding: 8px 0; color: #9ca3af;">
            Subject
          </td>

          <td>
            ${data.subject || "General Enquiry"}
          </td>
        </tr>

      </table>

      <div style="
        margin-top: 20px;
        padding: 16px;
        background: #111c2e;
        border-left: 3px solid #c47c2b;
      ">

        <h3 style="
          color: #c47c2b;
          margin-top: 0;
        ">
          Message
        </h3>

        <p style="line-height: 1.6;">
          ${data.message}
        </p>

      </div>

    </div>
  `;


  // =====================================================
  // CUSTOMER THANK-YOU EMAIL HTML
  // =====================================================

  const customerHtml = `
    <div style="
      font-family: Georgia, serif;
      max-width: 600px;
      margin: 0 auto;
      background: #0b1220;
      color: #f5f0e8;
      padding: 32px;
      border-radius: 8px;
    ">

      <h1 style="
        color: #c47c2b;
        font-size: 26px;
        margin-bottom: 8px;
      ">
        Thank You for Contacting Us
      </h1>

      <p style="
        color: #9ca3af;
        margin-top: 0;
      ">
        The Bialto by Asemont Estate
      </p>

      <hr style="
        border: none;
        border-top: 1px solid #c47c2b55;
        margin: 24px 0;
      " />

      <p style="
        color: #f5f0e8;
        font-size: 16px;
        line-height: 1.7;
      ">
        Dear ${data.name},
      </p>

      <p style="
        color: #d1d5db;
        font-size: 15px;
        line-height: 1.7;
      ">
        Thank you for contacting The Bialto by Asemont Estate.
        We have successfully received your message.
      </p>

      <p style="
        color: #d1d5db;
        font-size: 15px;
        line-height: 1.7;
      ">
        Our team will review your enquiry and respond to you as soon
        as possible.
      </p>

      <div style="
        margin: 24px 0;
        padding: 18px;
        background: #111c2e;
        border-left: 3px solid #c47c2b;
        border-radius: 4px;
      ">

        <p style="
          color: #c47c2b;
          font-weight: bold;
          margin-top: 0;
          margin-bottom: 8px;
        ">
          Your Message
        </p>

        <p style="
          color: #f5f0e8;
          line-height: 1.6;
          margin-bottom: 0;
        ">
          ${data.message}
        </p>

      </div>

      <p style="
        color: #d1d5db;
        font-size: 15px;
        line-height: 1.7;
      ">
        We appreciate your interest in The Bialto and look forward
        to assisting you.
      </p>

      <div style="
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #c47c2b33;
      ">

        <p style="
          color: #f5f0e8;
          margin-bottom: 5px;
        ">
          Warm regards,
        </p>

        <p style="
          color: #c47c2b;
          font-weight: bold;
          margin: 0;
        ">
          Team The Bialto
        </p>

        <p style="
          color: #9ca3af;
          font-size: 13px;
          margin-top: 5px;
        ">
          Asemont Estate
        </p>

      </div>

    </div>
  `;


  try {

    // =====================================================
    // 1. SEND CONTACT ENQUIRY TO ADMIN
    // =====================================================

    const adminInfo = await transporter.sendMail({

      from: `"The Bialto Contact" <jimanan41@gmail.com>`,

      to: ADMIN_EMAIL,

      replyTo: data.email,

      subject:
        `Contact Enquiry - ${data.subject || "General"} - ${data.name}`,

      text: `
New Contact Enquiry

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Subject: ${data.subject || "General Enquiry"}

Message:
${data.message}
      `,

      html: adminHtml,
    });


    logger.info(
      {
        customerEmail: data.email,
        accepted: adminInfo.accepted,
        rejected: adminInfo.rejected,
      },
      "Contact enquiry email sent to admin"
    );


    // =====================================================
    // 2. SEND THANK-YOU EMAIL TO CUSTOMER
    // =====================================================

    const customerInfo = await transporter.sendMail({

      from: `"The Bialto" <jimanan41@gmail.com>`,

      to: data.email,

      subject: "Thank You for Contacting The Bialto",

      text: `
Dear ${data.name},

Thank you for contacting The Bialto by Asemont Estate.

We have successfully received your message.

Our team will review your enquiry and respond to you as soon as possible.

We appreciate your interest in The Bialto and look forward to assisting you.

Warm regards,

Team The Bialto
Asemont Estate
      `,

      html: customerHtml,
    });


    logger.info(
      {
        customerEmail: data.email,
        messageId: customerInfo.messageId,
        accepted: customerInfo.accepted,
        rejected: customerInfo.rejected,
      },
      "Contact thank-you email sent to customer"
    );

  } catch (err) {

    logger.error(
      { err },
      "Failed to send contact emails"
    );

    throw err;
  }
}