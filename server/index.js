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

// Mandatory check for environment variables
if (!process.env.DATABASE_URL) {
  console.error("FATAL ERROR: DATABASE_URL is not defined.");
}
if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY is not defined.");
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Prisma 7 + PostgreSQL Driver Adapter Setup
// This configuration is optimized for connection pooling on platforms like Render/Supabase
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 2. AI Initialization (Using the latest Google AI SDK)
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// --- ARTISAN SPOTLIGHT GENERATOR LOGIC ---
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

    // Using gemini-1.5-flash for stable free-tier performance
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text(); 
    
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

// --- API ENDPOINTS ---

// Manual Trigger for Testing
app.get('/api/stories/trigger', async (req, res) => {
  const result = await generateAutomatedStory();
  res.send(result);
});

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
    
    // [FIX]: Crucial mapping to ensure IDs are accessible for redirection
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

// --- SOCKET.IO LOGIC ---
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on('join_auction', (auctionId) => socket.join(auctionId));
  
  socket.on('place_bid', async (data) => {
    const { auctionId, userId, amount } = data;
    try {
      const newBid = await prisma.bid.create({
        data: { amount: parseFloat(amount), userId, auctionId },
        include: { user: true }
      });
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

// --- CRON JOBS ---

// Every minute: Close expired auctions
cron.schedule('* * * * *', async () => {
  const now = new Date();
  try {
    const expiredAuctions = await prisma.auctionItem.findMany({
      where: { endTime: { lt: now }, status: 'ACTIVE' }
    });
    for (let auction of expiredAuctions) {
      await prisma.auctionItem.update({ 
        where: { id: auction.id }, 
        data: { status: 'SOLD' } 
      });
      console.log(`Closed auction: ${auction.id}`);
    }
  } catch (error) { console.error("Auction Cron Error:", error); }
});

// Every hour: Generate a new spotlight
cron.schedule('0 * * * *', () => generateAutomatedStory());

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));