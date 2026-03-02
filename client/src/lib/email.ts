import nodemailer from "nodemailer";

// --- TRANSPORTER (Brevo SMTP � 300 free emails/day, reliable inbox delivery) ---
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ─── BASE LAYOUT ───
function baseLayout(title: string, body: string): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#faf7f2;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;padding:32px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#b45309,#92400e);padding:32px 40px;text-align:center;">
                <h1 style="margin:0;font-size:28px;color:#ffffff;letter-spacing:1px;">
                  🪡 The Artisan's Loom
                </h1>
                <p style="margin:8px 0 0;font-size:13px;color:#fde68a;letter-spacing:2px;text-transform:uppercase;">
                  Heritage Handcrafted with Love
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px;">
                ${body}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#fef3c7;padding:24px 40px;text-align:center;border-top:1px solid #fde68a;">
                <p style="margin:0 0 8px;font-size:13px;color:#92400e;">
                  Made with ❤️ in India · Preserving Heritage, One Craft at a Time
                </p>
                <p style="margin:0;font-size:12px;color:#a0835c;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}" style="color:#b45309;text-decoration:none;">Visit our Store</a>
                  &nbsp;·&nbsp;
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/help" style="color:#b45309;text-decoration:none;">Help & FAQ</a>
                  &nbsp;·&nbsp;
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/contact" style="color:#b45309;text-decoration:none;">Contact Us</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

// ─── HELPER: CTA BUTTON ───
function ctaButton(text: string, url: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td align="center">
        <a href="${url}" style="display:inline-block;padding:14px 36px;background:#b45309;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.5px;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

// ─── HELPER: INFO ROW ───
function infoRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:8px 0;font-size:14px;color:#78716c;border-bottom:1px solid #f5f0eb;">${label}</td>
    <td style="padding:8px 0;font-size:14px;color:#292524;font-weight:600;text-align:right;border-bottom:1px solid #f5f0eb;">${value}</td>
  </tr>`;
}

// ═══════════════════════════════════════════════════════════════
// 1. ORDER CONFIRMATION — sent to customer
// ═══════════════════════════════════════════════════════════════
interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: { title: string; quantity: number; price: number }[];
  total: number;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const itemRows = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 0;font-size:14px;color:#292524;border-bottom:1px solid #f5f0eb;">
        ${item.title} <span style="color:#78716c;">× ${item.quantity}</span>
      </td>
      <td style="padding:10px 0;font-size:14px;color:#292524;font-weight:600;text-align:right;border-bottom:1px solid #f5f0eb;">
        ₹${item.price.toLocaleString("en-IN")}
      </td>
    </tr>`
    )
    .join("");

  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#292524;">Order Confirmed! 🎉</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#57534e;line-height:1.6;">
      Namaste <strong>${data.customerName}</strong>, your order has been placed successfully. 
      Our artisans are preparing your handcrafted treasures with love.
    </p>

    <div style="background:#fef3c7;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#92400e;">
        <strong>Order ID:</strong> ${data.orderId}
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:8px 0;font-size:12px;color:#78716c;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #b45309;">Item</td>
        <td style="padding:8px 0;font-size:12px;color:#78716c;text-transform:uppercase;letter-spacing:1px;text-align:right;border-bottom:2px solid #b45309;">Price</td>
      </tr>
      ${itemRows}
      <tr>
        <td style="padding:14px 0;font-size:16px;color:#292524;font-weight:700;">Total</td>
        <td style="padding:14px 0;font-size:18px;color:#b45309;font-weight:700;text-align:right;">₹${data.total.toLocaleString("en-IN")}</td>
      </tr>
    </table>

    ${ctaButton("Track Your Order →", `${appUrl}/track-order`)}

    <p style="margin:0;font-size:13px;color:#a0835c;text-align:center;">
      Each piece is handcrafted — please allow artisans time to create your masterpiece.
    </p>`;

  try {
    await getTransporter().sendMail({
      from: `"The Artisan's Loom" <${process.env.EMAIL_FROM}>`,
      to: data.customerEmail,
      subject: `✅ Order Confirmed — ${data.orderId}`,
      html: baseLayout("Order Confirmation", body),
    });
    console.log(`📧 Order confirmation sent to ${data.customerEmail}`);
  } catch (err) {
    console.error("Email Error (Order Confirmation):", err);
  }
}

// ═══════════════════════════════════════════════════════════════
// 2. ARTISAN NEW ORDER NOTIFICATION — sent to artisan
// ═══════════════════════════════════════════════════════════════
interface ArtisanOrderData {
  artisanName: string;
  artisanEmail: string;
  orderId: string;
  items: { title: string; quantity: number; price: number }[];
  customerName: string;
}

export async function sendArtisanNewOrderNotification(data: ArtisanOrderData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const itemRows = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 0;font-size:14px;color:#292524;border-bottom:1px solid #f5f0eb;">
        ${item.title} <span style="color:#78716c;">× ${item.quantity}</span>
      </td>
      <td style="padding:10px 0;font-size:14px;color:#292524;font-weight:600;text-align:right;border-bottom:1px solid #f5f0eb;">
        ₹${item.price.toLocaleString("en-IN")}
      </td>
    </tr>`
    )
    .join("");

  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#292524;">New Order Received! 🛍️</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#57534e;line-height:1.6;">
      Namaste <strong>${data.artisanName}</strong>! A patron named <strong>${data.customerName}</strong> 
      has ordered your handcrafted creations.
    </p>

    <div style="background:#ecfdf5;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#065f46;">
        <strong>Order ID:</strong> ${data.orderId}
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:8px 0;font-size:12px;color:#78716c;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #059669;">Item Ordered</td>
        <td style="padding:8px 0;font-size:12px;color:#78716c;text-transform:uppercase;letter-spacing:1px;text-align:right;border-bottom:2px solid #059669;">Amount</td>
      </tr>
      ${itemRows}
    </table>

    ${ctaButton("View Orders in Studio →", `${appUrl}/artisan/orders`)}

    <p style="margin:0;font-size:13px;color:#a0835c;text-align:center;">
      Please prepare the order for dispatch. The patron is eagerly waiting!
    </p>`;

  try {
    await getTransporter().sendMail({
      from: `"The Artisan's Loom" <${process.env.EMAIL_FROM}>`,
      to: data.artisanEmail,
      subject: `🛍️ New Order Received — ${data.orderId}`,
      html: baseLayout("New Order", body),
    });
    console.log(`📧 Artisan order notification sent to ${data.artisanEmail}`);
  } catch (err) {
    console.error("Email Error (Artisan Order):", err);
  }
}

// ═══════════════════════════════════════════════════════════════
// 3. OUTBID ALERT — sent to previous highest bidder
// ═══════════════════════════════════════════════════════════════
interface OutbidData {
  previousBidderName: string;
  previousBidderEmail: string;
  auctionId: string;
  productTitle: string;
  previousBid: number;
  newBid: number;
}

export async function sendOutbidAlert(data: OutbidData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#292524;">You've Been Outbid! ⚡</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#57534e;line-height:1.6;">
      Namaste <strong>${data.previousBidderName}</strong>, another collector has placed a higher bid 
      on <strong>"${data.productTitle}"</strong>.
    </p>

    <div style="background:#fef2f2;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Your Bid", `₹${data.previousBid.toLocaleString("en-IN")}`)}
        ${infoRow("New Highest Bid", `₹${data.newBid.toLocaleString("en-IN")}`)}
      </table>
    </div>

    <p style="font-size:14px;color:#57534e;line-height:1.6;margin:0 0 8px;">
      Don't let this heritage masterpiece slip away — place a higher bid now!
    </p>

    ${ctaButton("Bid Again →", `${appUrl}/auction/${data.auctionId}`)}

    <p style="margin:0;font-size:13px;color:#a0835c;text-align:center;">
      Auctions are time-limited. Act fast to claim your treasure.
    </p>`;

  try {
    await getTransporter().sendMail({
      from: `"The Artisan's Loom — Auctions" <${process.env.EMAIL_FROM}>`,
      to: data.previousBidderEmail,
      subject: `⚡ Outbid on "${data.productTitle}" — Bid again!`,
      html: baseLayout("Outbid Alert", body),
    });
    console.log(`📧 Outbid alert sent to ${data.previousBidderEmail}`);
  } catch (err) {
    console.error("Email Error (Outbid):", err);
  }
}

// ═══════════════════════════════════════════════════════════════
// 4. AUCTION WON — sent to winner
// ═══════════════════════════════════════════════════════════════
interface AuctionWonData {
  winnerName: string;
  winnerEmail: string;
  productTitle: string;
  winningBid: number;
  auctionId: string;
}

export async function sendAuctionWonEmail(data: AuctionWonData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#292524;">Congratulations, You Won! 🏆</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#57534e;line-height:1.6;">
      Namaste <strong>${data.winnerName}</strong>! You've won the auction for 
      <strong>"${data.productTitle}"</strong>. This heritage masterpiece is now yours!
    </p>

    <div style="background:#ecfdf5;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow("Item", data.productTitle)}
        ${infoRow("Winning Bid", `₹${data.winningBid.toLocaleString("en-IN")}`)}
      </table>
    </div>

    <p style="font-size:14px;color:#57534e;line-height:1.6;margin:0 0 8px;">
      An order has been automatically created in your account. You can view it in your dashboard.
    </p>

    ${ctaButton("View Your Order →", `${appUrl}/customer/orders`)}

    <p style="margin:0;font-size:13px;color:#a0835c;text-align:center;">
      Thank you for supporting India's artisan heritage. Your masterpiece is on its way!
    </p>`;

  try {
    await getTransporter().sendMail({
      from: `"The Artisan's Loom — Auctions" <${process.env.EMAIL_FROM}>`,
      to: data.winnerEmail,
      subject: `🏆 You Won — "${data.productTitle}"!`,
      html: baseLayout("Auction Won", body),
    });
    console.log(`📧 Auction won email sent to ${data.winnerEmail}`);
  } catch (err) {
    console.error("Email Error (Auction Won):", err);
  }
}

// ═══════════════════════════════════════════════════════════════
// 5. VERIFICATION STATUS — sent to artisan
// ═══════════════════════════════════════════════════════════════
interface VerificationEmailData {
  artisanName: string;
  artisanEmail: string;
  status: "approved" | "rejected";
  note?: string;
}

export async function sendVerificationStatusEmail(data: VerificationEmailData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const isApproved = data.status === "approved";

  const body = isApproved
    ? `
    <h2 style="margin:0 0 8px;font-size:22px;color:#292524;">You're Verified! ✅</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#57534e;line-height:1.6;">
      Namaste <strong>${data.artisanName}</strong>! Your identity has been verified successfully. 
      You now have the <strong>Verified Artisan</strong> badge on your profile.
    </p>

    <div style="background:#ecfdf5;border-radius:10px;padding:20px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;font-size:40px;">🛡️</p>
      <p style="margin:8px 0 0;font-size:15px;color:#065f46;font-weight:600;">Verified Heritage Artisan</p>
      <p style="margin:4px 0 0;font-size:13px;color:#059669;">Your profile now carries the trust badge</p>
    </div>

    <p style="font-size:14px;color:#57534e;line-height:1.6;margin:0 0 8px;">
      <strong>What this means for you:</strong>
    </p>
    <ul style="color:#57534e;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
      <li>Verified badge visible on your profile & products</li>
      <li>Higher trust with customers — more sales</li>
      <li>Priority listing in search results</li>
      <li>Access to Heritage Auctions</li>
    </ul>

    ${ctaButton("Go to Your Studio →", `${appUrl}/artisan`)}
    `
    : `
    <h2 style="margin:0 0 8px;font-size:22px;color:#292524;">Verification Update 📋</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#57534e;line-height:1.6;">
      Namaste <strong>${data.artisanName}</strong>, unfortunately your verification could not be 
      approved at this time.
    </p>

    <div style="background:#fef2f2;border-radius:10px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#991b1b;font-weight:600;">Reason:</p>
      <p style="margin:8px 0 0;font-size:14px;color:#292524;line-height:1.6;">
        ${data.note || "The submitted verification video did not meet our requirements."}
      </p>
    </div>

    <p style="font-size:14px;color:#57534e;line-height:1.6;margin:0 0 8px;">
      <strong>You can resubmit!</strong> Please record a new video showing:
    </p>
    <ul style="color:#57534e;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
      <li>Your face clearly visible</li>
      <li>Your workshop / workspace</li>
      <li>You working on a craft piece</li>
      <li>A brief introduction of yourself</li>
    </ul>

    ${ctaButton("Resubmit Verification →", `${appUrl}/artisan/settings`)}
    `;

  try {
    await getTransporter().sendMail({
      from: `"The Artisan's Loom" <${process.env.EMAIL_FROM}>`,
      to: data.artisanEmail,
      subject: isApproved
        ? `✅ Verification Approved — Welcome, Verified Artisan!`
        : `📋 Verification Update — Action Required`,
      html: baseLayout("Verification Status", body),
    });
    console.log(`📧 Verification ${data.status} email sent to ${data.artisanEmail}`);
  } catch (err) {
    console.error("Email Error (Verification):", err);
  }
}

// ═══════════════════════════════════════════════════════════════
// 6. WELCOME EMAIL — sent on first sign-up / onboarding
// ═══════════════════════════════════════════════════════════════
interface WelcomeEmailData {
  name: string;
  email: string;
  role: "ARTISAN" | "CUSTOMER";
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const isArtisan = data.role === "ARTISAN";

  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#292524;">
      Welcome to The Artisan's Loom! 🪡
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#57534e;line-height:1.6;">
      Namaste <strong>${data.name}</strong>! We're thrilled to have you join 
      India's premier heritage handcraft marketplace.
    </p>

    <div style="background:#fffbeb;border-radius:10px;padding:20px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;font-size:36px;">${isArtisan ? "🎨" : "🛍️"}</p>
      <p style="margin:8px 0 0;font-size:16px;color:#92400e;font-weight:600;">
        ${isArtisan ? "Artisan Account" : "Patron Account"}
      </p>
    </div>

    ${
      isArtisan
        ? `
    <p style="font-size:14px;color:#57534e;line-height:1.8;margin:0 0 16px;">
      As an artisan, you can:
    </p>
    <ul style="color:#57534e;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
      <li>List your handcrafted products</li>
      <li>Get verified with a trust badge</li>
      <li>Access business analytics</li>
      <li>List items in Heritage Auctions</li>
      <li>Connect with artisan community</li>
    </ul>
    ${ctaButton("Set Up Your Studio →", `${appUrl}/artisan`)}`
        : `
    <p style="font-size:14px;color:#57534e;line-height:1.8;margin:0 0 16px;">
      As a patron, you can:
    </p>
    <ul style="color:#57534e;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
      <li>Browse 1000+ handcrafted masterpieces</li>
      <li>Bid on rare items in Heritage Auctions</li>
      <li>Get AI-powered craft recommendations</li>
      <li>Explore India's Craft Atlas</li>
      <li>Read artisan stories & spotlights</li>
    </ul>
    ${ctaButton("Start Exploring →", `${appUrl}/shop`)}`
    }`;

  try {
    await getTransporter().sendMail({
      from: `"The Artisan's Loom" <${process.env.EMAIL_FROM}>`,
      to: data.email,
      subject: `🪡 Welcome to The Artisan's Loom, ${data.name}!`,
      html: baseLayout("Welcome", body),
    });
    console.log(`📧 Welcome email sent to ${data.email}`);
  } catch (err) {
    console.error("Email Error (Welcome):", err);
  }
}
