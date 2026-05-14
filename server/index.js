// server/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { GoogleGenAI } = require("@google/genai");
const nodemailer = require('nodemailer');

// Mandatory check for environment variables
if (!process.env.DATABASE_URL) {
  console.error("FATAL ERROR: DATABASE_URL is not defined.");
}
if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY is not defined.");
}

const app = express();

// Restrict CORS to known origins
const allowedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'https://artisans-loom.vercel.app',
  'https://artisans-loom.vercel.app/',
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
}));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email base layout for server-sent emails
function emailBaseLayout(title, body) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${title}</title></head>
  <body style="margin:0;padding:0;background:#faf7f2;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f2;padding:32px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr><td style="background:linear-gradient(135deg,#b45309,#92400e);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;font-size:28px;color:#ffffff;letter-spacing:1px;">\uD83E\uDEA1 The Artisan's Loom</h1>
            <p style="margin:8px 0 0;font-size:13px;color:#fde68a;letter-spacing:2px;text-transform:uppercase;">Heritage Handcrafted with Love</p>
          </td></tr>
          <tr><td style="padding:40px;">${body}</td></tr>
          <tr><td style="background:#fef3c7;padding:24px 40px;text-align:center;border-top:1px solid #fde68a;">
            <p style="margin:0;font-size:13px;color:#92400e;">Made with \u2764\uFE0F in India</p>
            <p style="margin:4px 0 0;font-size:12px;color:#a0835c;"><a href="${appUrl}" style="color:#b45309;text-decoration:none;">Visit Store</a></p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}

async function sendServerEmail(to, subject, title, body) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;
  try {
    await emailTransporter.sendMail({
      from: `"The Artisan's Loom" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html: emailBaseLayout(title, body),
    });
    console.log(`\uD83D\uDCE7 Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error('Server Email Error:', err.message);
  }
}

const server = http.createServer(app);
const io = new Server(server, {
  path: '/socket.io/',
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

//ARTISAN SPOTLIGHT GENERATOR LOGIC
async function generateAutomatedStory() {
  console.log("Starting automated Artisan Spotlight generation...");
  try {
    // Select an artisan who hasn't been featured yet
    const eligibleArtisans = await prisma.user.findMany({
      where: {
        role: 'ARTISAN',
        stories: { none: {} }
      },
      include: {
        profile: true,
        products: { take: 1 }
      }
    });

    if (eligibleArtisans.length === 0) {
      console.log("No new artisans to feature.");
      return "No new artisans to feature.";
    }

    const artisan = eligibleArtisans[Math.floor(Math.random() * eligibleArtisans.length)];
    const prompt = `Write a beautiful 300-word spotlight for artisan ${artisan.name} who does ${artisan.profile?.craftType || 'traditional crafts'}. Return ONLY JSON with keys: "title", "excerpt", "content".`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });
    const responseText = result.text;

    // Extract JSON from potential Markdown formatting
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI failed to return valid JSON.");
    const storyData = JSON.parse(jsonMatch[0]);

    // Save to Database
    await prisma.story.create({
      data: {
        title: storyData.title,
        excerpt: storyData.excerpt,
        content: storyData.content,
        heroImage: artisan.products[0]?.images[0] || "/avatar.png",
        featuredArtisanId: artisan.id
      }
    });

    console.log(`✅ Successfully published spotlight for ${artisan.name}`);
    return `Success: Featured ${artisan.name}`;
  } catch (error) {
    console.error("Story Generation Error:", error);
    return "Generation failed.";
  }
}


function isAuthorizedStoryTrigger(req) {
  if (process.env.NODE_ENV !== 'production') return true;

  const triggerSecret = process.env.STORY_TRIGGER_SECRET || process.env.ADMIN_SECRET;
  const authHeader = req.get('authorization') || '';
  const headerSecret = req.get('x-story-trigger-secret');

  return Boolean(
    triggerSecret &&
    (
      authHeader === `Bearer ${triggerSecret}` ||
      headerSecret === triggerSecret
    )
  );
}

async function handleStoryTrigger(req, res) {
  if (!isAuthorizedStoryTrigger(req)) {
    return res.status(403).json({ error: 'Story trigger is not authorized.' });
  }
  const result = await generateAutomatedStory();
  res.send(result);
}

// Manual Trigger for Testing/Admin use. In production this requires a server-side secret.
app.route('/api/stories/trigger')
  .get(handleStoryTrigger)
  .post(handleStoryTrigger);

// Fetch all stories with mapped IDs for the Reels frontend
app.get('/api/stories', async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        featuredArtisan: {
          select: {
            id: true,
            name: true,
            profile: { select: { location: true } }
          }
        }
      }
    });

    //Crucial mapping to ensure IDs are accessible for redirection
    const responseData = stories.map(story => ({
      ...story,
      // Ensure featuredArtisanId is available at the top level
      featuredArtisanId: story.featuredArtisan.id
    }));

    res.json(responseData);
  } catch (error) {
    console.error("Fetch Stories Error:", error);
    res.status(500).json({ error: "Could not fetch stories." });
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on('join_auction', (auctionId) => socket.join(auctionId));

  socket.on('place_bid', async (data) => {
    const { auctionId, userId, amount } = data;
    const bidAmount = parseFloat(amount);

    try {
      // Verify user exists
      const bidder = await prisma.user.findUnique({ where: { id: userId } });
      if (!bidder) {
        return socket.emit('error', { message: 'Invalid user.' });
      }

      //Fetch auction and validate
      const auction = await prisma.auctionItem.findUnique({ where: { id: auctionId } });

      if (!auction) {
        return socket.emit('error', { message: 'Auction not found.' });
      }
      if (auction.status !== 'ACTIVE') {
        return socket.emit('error', { message: 'This auction has already ended.' });
      }
      if (new Date() > auction.endTime) {
        return socket.emit('error', { message: 'This auction has expired.' });
      }
      if (isNaN(bidAmount) || bidAmount <= 0) {
        return socket.emit('error', { message: 'Invalid bid amount.' });
      }

      // Bid must exceed current highest bid AND base price
      const minimumBid = Math.max(auction.currentBid, auction.basePrice);
      if (bidAmount <= minimumBid) {
        return socket.emit('error', {
          message: `Bid must be greater than ₹${minimumBid.toLocaleString('en-IN')}`
        });
      }

      //Create bid AND update currentBid atomically
      const [newBid] = await prisma.$transaction([
        prisma.bid.create({
          data: { amount: bidAmount, userId, auctionId },
          include: { user: true }
        }),
        prisma.auctionItem.update({
          where: { id: auctionId },
          data: { currentBid: bidAmount }
        }),
      ]);

      io.to(auctionId).emit('new_bid', {
        amount: newBid.amount,
        userName: newBid.user.name,
        timestamp: newBid.timestamp
      });
    } catch (error) {
      console.error("Bid Placement Error:", error);
      socket.emit('error', { message: "Could not place bid." });
    }
  });

  socket.on('disconnect', () => console.log('User Disconnected'));
});

//CRON JOBS

// Every minute: Close expired auctions & notify winners
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const expiredAuctions = await prisma.auctionItem.findMany({
      where: { endTime: { lt: now }, status: 'ACTIVE' },
      include: {
        product: { include: { artisan: true } },
        bids: { orderBy: { amount: 'desc' }, take: 1, include: { user: true } },
      },
    });
    for (let auction of expiredAuctions) {
      if (auction.bids.length > 0) {
        const winner = auction.bids[0];

        // Mark as SOLD and create order
        await prisma.$transaction([
          prisma.auctionItem.update({ where: { id: auction.id }, data: { status: 'SOLD' } }),
          prisma.order.create({
            data: {
              customerId: winner.userId,
              total: winner.amount,
              status: 'Auction Won',
              items: { create: { productId: auction.product.id, quantity: 1, price: winner.amount } },
            },
          }),
          prisma.product.update({ where: { id: auction.product.id }, data: { stock: 0, salesCount: { increment: 1 } } }),
        ]);

        // Email the winner
        const winPrice = winner.amount.toLocaleString('en-IN');
        sendServerEmail(
          winner.user.email,
          `\uD83C\uDFC6 You Won \u2014 "${auction.product.title}"!`,
          'Auction Won',
          `<h2 style="margin:0 0 8px;font-size:22px;color:#292524;">Congratulations! \uD83C\uDFC6</h2>
           <p style="font-size:15px;color:#57534e;line-height:1.6;">
             <strong>${winner.user.name || 'Collector'}</strong>, you won the auction for
             <strong>"${auction.product.title}"</strong> with a bid of <strong>\u20B9${winPrice}</strong>!
           </p>
           <div style="background:#ecfdf5;border-radius:10px;padding:16px 20px;margin:20px 0;text-align:center;">
             <p style="margin:0;font-size:13px;color:#065f46;">An order has been created in your account.</p>
           </div>
           <table width="100%" style="margin:20px 0;"><tr><td align="center">
             <a href="${appUrl}/customer/orders" style="display:inline-block;padding:14px 36px;background:#b45309;color:#fff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">View Your Order \u2192</a>
           </td></tr></table>`
        );

        // Email the artisan
        sendServerEmail(
          auction.product.artisan.email,
          `\uD83C\uDF89 Auction Sold \u2014 "${auction.product.title}"`,
          'Auction Sold',
          `<h2 style="margin:0 0 8px;font-size:22px;color:#292524;">Your Auction Sold! \uD83C\uDF89</h2>
           <p style="font-size:15px;color:#57534e;line-height:1.6;">
             <strong>${auction.product.artisan.name || 'Artisan'}</strong>, your item
             <strong>"${auction.product.title}"</strong> sold for <strong>\u20B9${winPrice}</strong>.
           </p>
           <table width="100%" style="margin:20px 0;"><tr><td align="center">
             <a href="${appUrl}/artisan/orders" style="display:inline-block;padding:14px 36px;background:#b45309;color:#fff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">View in Studio \u2192</a>
           </td></tr></table>`
        );

        console.log(`\u2705 Closed auction ${auction.id} \u2014 winner: ${winner.user.name}`);
      } else {
        // No bids \u2014 mark as UNSOLD
        await prisma.auctionItem.update({ where: { id: auction.id }, data: { status: 'UNSOLD' } });
        console.log(`\u274C Auction ${auction.id} ended with no bids (UNSOLD)`);
      }
    }
  } catch (error) { console.error("Auction Cron Error:", error); }
});

// Every hour: Generate a new spotlight
cron.schedule('0 * * * *', () => generateAutomatedStory());

// ── Gemini Live Voice WebSocket ──────────────────────────────────────────
const { mountVoiceLive } = require('./voice-live');
mountVoiceLive(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
