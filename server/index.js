// server/index.js
require('dotenv').config(); // Automatically looks for .env in the same folder
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient(); // This connects to Supabase using server/.env
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // During development, allows all connections
    methods: ["GET", "POST"]
  }
});

// --- SOCKET.IO LOGIC ---
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // 1. Join Auction Room
  socket.on('join_auction', (auctionId) => {
    socket.join(auctionId);
    console.log(`User joined auction: ${auctionId}`);
  });

  // 2. Place Bid Logic
  socket.on('place_bid', async (data) => {
    const { auctionId, userId, amount } = data;

    try {
      // Create the bid in the database
      const newBid = await prisma.bid.create({
        data: {
          amount: parseFloat(amount),
          userId: userId,
          auctionId: auctionId
        },
        include: { user: true } // Include user details to show who bid
      });

      // Broadcast the new bid to everyone in the room
      io.to(auctionId).emit('new_bid', {
        amount: newBid.amount,
        userName: newBid.user.name,
        timestamp: newBid.timestamp
      });

    } catch (error) {
      console.error("Bid Error:", error);
      socket.emit('error', { message: "Could not place bid." });
    }
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  });
});

// --- CRON JOB: AUCTION CLOSER ---
// Runs every minute to check for expired auctions
cron.schedule('* * * * *', async () => {
  console.log('Checking for expired auctions...');
  const now = new Date();

  try {
    const expiredAuctions = await prisma.auctionItem.findMany({
      where: {
        endTime: { lt: now },
        status: 'ACTIVE'
      }
    });

    for (let auction of expiredAuctions) {
      await prisma.auctionItem.update({
        where: { id: auction.id },
        data: { status: 'SOLD' } // Or 'UNSOLD' if no bids exist
      });
      console.log(`Auction ${auction.id} closed.`);
    }
  } catch (error) {
    console.error("Cron Error:", error);
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});