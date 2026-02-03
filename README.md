# 🧵 Artisans Loom

A full-stack e-commerce and community platform connecting traditional artisans with global customers. Built with Next.js 16, PostgreSQL, Socket.IO, and Google AI integration, featuring real-time auctions, AI-powered assistants, and an interactive craft atlas.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://artisans-loom.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-98.3%25-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#%EF%B8%8F-architecture)
- [Technology Stack](#%EF%B8%8F-technology-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Core Features](#-core-features)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Deployment](#-deployment)
- [Usage Guide](#-usage-guide)
- [API Routes](#-api-routes)
- [Real-Time Features](#-real-time-features)
- [Configuration](#%EF%B8%8F-configuration)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

**Artisans Loom** is a comprehensive digital marketplace designed to empower traditional artisans by connecting them with global audiences. The platform combines e-commerce functionality with community features, AI-powered assistance, and real-time auction capabilities.

### Core Concept

- **For Artisans**: Create profiles, list handcrafted products, participate in auctions, and tell their stories
- **For Customers**: Discover authentic handmade products, bid in live auctions, and connect with artisans
- **For Community**: Engage through forums, share stories, and explore craft traditions via interactive atlas
- **AI Integration**: Get personalized shopping assistance and learn about traditional crafts

### Live Demo

🌐 **[artisans-loom.vercel.app](https://artisans-loom.vercel.app/)**

## ✨ Key Features

### 🎨 For Artisans

- **Profile Management**: Showcase craft type, experience, location, and business details
- **Product Listings**: Upload multiple images, set prices, manage stock, and categorize products
- **Auction Participation**: Create time-bound auctions with base and reserve prices
- **Story Sharing**: Publish featured stories about craft journey and traditions
- **Analytics Dashboard**: Track product views, sales count, and performance metrics
- **Order Management**: Manage orders, update status, and communicate with customers

### 🛒 For Customers

- **Advanced Product Discovery**: Browse by category, materials, and tags
- **Real-Time Auctions**: Participate in live bidding with Socket.IO
- **AI Shopping Assistant**: Get personalized product recommendations via Google AI
- **Artisan Profiles**: View detailed artisan information and follow favorites
- **Order Tracking**: Monitor order status from placement to delivery
- **Review System**: Rate and review artisans and products
- **Secure Checkout**: Streamlined checkout with order history

### 🤖 AI-Powered Features

- **Shopping Assistant**: Natural language product search and recommendations
- **Craft Information Bot**: Learn about traditional craft techniques and history
- **Visual Tour Guide**: Interactive explanations of craft processes
- **Personalized Chat History**: Saved conversation context per user

### 🌍 Community Features

- **Interactive Craft Atlas**: D3.js-powered map showing craft traditions by Indian state
- **Community Forum**: Threaded discussions with likes, replies, and moderation
- **Artisan Stories**: Featured articles highlighting craft journeys
- **Follow System**: Connect with favorite artisans
- **Social Engagement**: Like, comment, and share content

### ⚡ Real-Time Features

- **Live Auctions**: WebSocket-powered bidding with instant updates
- **Bid Notifications**: Real-time alerts for outbid scenarios
- **Auction Countdown**: Live timer synchronization across clients
- **Chat Support**: Real-time customer support messaging

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Client Application                       │
│         (Next.js 16 + React 19 + TypeScript)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages: Shop, Auction, Profile, Forum, Stories       │  │
│  │  Components: Product Cards, Bid UI, Chat Interface   │  │
│  │  State: Zustand + React Context                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────────────┐
│              Authentication & Authorization                 │
│                  (Clerk Auth + JWT)                         │
└─────────────────────┬──────────────────────────────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
        ▼                            ▼
┌──────────────────┐       ┌──────────────────┐
│   Next.js API    │       │  WebSocket Server│
│   Routes         │       │   (Socket.IO)    │
│  - REST APIs     │       │  - Auction Bids  │
│  - Server Actions│       │  - Chat          │
│  - Webhooks      │       │  - Notifications │
└────────┬─────────┘       └────────┬─────────┘
         │                          │
         └──────────┬───────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────────┐
│              Database Layer (PostgreSQL)                    │
│        Prisma ORM + Connection Pooling                      │
│  Tables: Users, Products, Orders, Auctions, Forum, etc.    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                  External Services                          │
│  ├─ Google Generative AI (Gemini)                          │
│  ├─ Clerk Authentication                                    │
│  ├─ Supabase Storage (Images)                              │
│  └─ Vercel Hosting & Edge Functions                        │
└────────────────────────────────────────────────────────────┘
```

### Data Flow

**Product Purchase:**
```
Customer → Browse Products → Add to Cart → Checkout → 
Payment Processing → Order Creation → Artisan Notification → 
Order Fulfillment → Delivery Tracking
```

**Auction Flow:**
```
Artisan → Create Auction Item → Set Time Window → 
Customers Join → Real-Time Bidding → Auction Closes → 
Winner Notification → Order Processing
```

**AI Assistant Flow:**
```
User Query → AI Assistant → Gemini API → Context Processing → 
Product Recommendations → Chat History Storage → Response Display
```

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.0 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4 | Utility-first styling |
| **Framer Motion** | ^12.23.26 | Animations |
| **Radix UI** | Latest | Accessible component primitives |
| **Lucide React** | ^0.562.0 | Icon library |
| **D3.js** | ^7.9.0 | Data visualization (Craft Atlas) |
| **Recharts** | ^3.6.0 | Chart components |
| **React Confetti** | ^6.4.0 | Celebration effects |
| **Zustand** | ^5.0.9 | State management |
| **date-fns** | ^4.1.0 | Date formatting |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Compatible with Next.js 16 | Runtime environment |
| **Express.js** | ^5.2.1 | WebSocket server |
| **Socket.IO** | ^4.8.2 | Real-time bidirectional communication |
| **Prisma** | ^7.2.0 | ORM and database toolkit |
| **PostgreSQL** | Latest | Relational database |
| **@prisma/adapter-pg** | ^7.2.0 | PostgreSQL adapter |

### AI & Services

| Service | Purpose |
|---------|---------|
| **Google Generative AI** | AI assistant and recommendations |
| **Clerk** | Authentication and user management |
| **Supabase** | Cloud storage for images |
| **node-cron** | Scheduled tasks (auction cleanup) |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **PostCSS** | CSS processing |
| **Nodemon** | Development server hot reload |
| **dotenv** | Environment variable management |

## 📁 Project Structure

```
Artisans-Loom/
│
├── client/                           # Next.js Frontend Application
│   ├── src/
│   │   └── app/
│   │       ├── (dashboard)/         # Dashboard routes (protected)
│   │       │   ├── analytics/       # Sales & performance analytics
│   │       │   ├── community/       # Forum and discussions
│   │       │   ├── create-auction/  # Auction creation
│   │       │   ├── inventory/       # Product management
│   │       │   ├── my-auctions/     # Auction management
│   │       │   ├── orders/          # Order management
│   │       │   └── settings/        # User settings
│   │       │
│   │       ├── actions/             # Server actions
│   │       │   ├── bid.action.ts
│   │       │   ├── chat.action.ts
│   │       │   ├── forum.action.ts
│   │       │   ├── order.action.ts
│   │       │   ├── product.action.ts
│   │       │   ├── profile.action.ts
│   │       │   ├── story.action.ts
│   │       │   └── user.action.ts
│   │       │
│   │       ├── api/                 # API routes
│   │       │   ├── chat/           # AI chat endpoints
│   │       │   ├── tts/            # Text-to-speech
│   │       │   └── webhooks/       # Clerk webhooks
│   │       │
│   │       ├── artisans/           # Artisan discovery
│   │       │   └── [id]/          # Individual artisan profiles
│   │       │
│   │       ├── assistants/         # AI assistant interfaces
│   │       │   ├── craft-info/    # Craft information bot
│   │       │   ├── shopping/      # Shopping assistant
│   │       │   └── visual-tour/   # Visual tour guide
│   │       │
│   │       ├── atlas/              # Craft atlas (deprecated)
│   │       ├── craft-atlas/        # Interactive D3 map
│   │       ├── auction/            # Live auction interface
│   │       ├── shop/               # Product browsing
│   │       │   └── [id]/          # Product detail pages
│   │       │
│   │       ├── stories/            # Artisan stories
│   │       ├── profile/            # User profiles
│   │       ├── checkout/           # Order checkout
│   │       ├── track-order/        # Order tracking
│   │       ├── trending/           # Trending products
│   │       │
│   │       ├── onboarding/         # New user setup
│   │       ├── sign-in/            # Authentication
│   │       ├── sign-up/            # Registration
│   │       │
│   │       ├── about/              # Static pages
│   │       ├── contact/
│   │       ├── help/
│   │       ├── careers/
│   │       ├── press-media/
│   │       ├── privacy-policy/
│   │       ├── terms-of-service/
│   │       ├── returns-exchanges/
│   │       ├── shipping-delivery/
│   │       └── size-guide/
│   │       │
│   │       ├── globals.css         # Global styles
│   │       ├── layout.tsx          # Root layout
│   │       └── page.tsx            # Homepage
│   │
│   ├── prisma/
│   │   └── schema.prisma           # Database schema
│   │
│   ├── public/                     # Static assets
│   │   └── map-data/              # GeoJSON for craft atlas
│   │
│   ├── scripts/
│   │   └── update-schema.js       # Database migration helper
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── seed.ts                     # Database seeding script
│
├── server/                          # WebSocket Server
│   ├── index.js                    # Express + Socket.IO server
│   ├── prisma.config.js            # Prisma client config
│   └── package.json
│
└── README.md                        # This file
```

## 🗄️ Database Schema

### User Management

**User Model**
```prisma
model User {
  id              String        @id @default(cuid())
  clerkId         String        @unique
  email           String        @unique
  name            String?
  role            Role          @default(PENDING)
  languages       String[]
  preferences     Json?
  image           String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum Role {
  ARTISAN
  CUSTOMER
  ADMIN
  PENDING
}
```

**Profile Model**
```prisma
model Profile {
  id                String  @id @default(cuid())
  userId            String  @unique
  businessName      String?
  craftType         String?
  bio               String?
  location          String?
  yearsOfExperience Int?
  phoneNumber       String?
  streetAddress     String?
}
```

### E-Commerce

**Product Model**
```prisma
model Product {
  id          String       @id @default(cuid())
  title       String
  description String
  price       Float
  category    String
  materials   String[]
  images      String[]
  stock       Int          @default(1)
  tags        String[]
  views       Int          @default(0)
  salesCount  Int          @default(0)
  artisanId   String
  createdAt   DateTime     @default(now())
}
```

**Order Model**
```prisma
model Order {
  id         String      @id @default(cuid())
  total      Float
  status     String      @default("PENDING")
  customerId String
  createdAt  DateTime    @default(now())
  items      OrderItem[]
}
```

### Auction System

**AuctionItem Model**
```prisma
model AuctionItem {
  id           String        @id @default(cuid())
  productId    String        @unique
  basePrice    Float
  reservePrice Float?
  currentBid   Float         @default(0)
  startTime    DateTime      @default(now())
  endTime      DateTime
  status       AuctionStatus @default(ACTIVE)
  bids         Bid[]
}

enum AuctionStatus {
  ACTIVE
  SOLD
  UNSOLD
}
```

**Bid Model**
```prisma
model Bid {
  id        String      @id @default(cuid())
  amount    Float
  timestamp DateTime    @default(now())
  userId    String
  auctionId String
}
```

### Community

**ForumPost Model**
```prisma
model ForumPost {
  id        String      @id @default(cuid())
  content   String
  tags      String[]
  flagged   Boolean     @default(false)
  userId    String
  parentId  String?
  likes     ForumLike[]
  children  ForumPost[] @relation("PostReplies")
}
```

**Story Model**
```prisma
model Story {
  id                String   @id @default(cuid())
  title             String
  content           String
  category          String   @default("Artisan Spotlights")
  excerpt           String
  author            String
  featuredArtisanId String
  heroImage         String?
}
```

## 🎪 Core Features

### Real-Time Auction System

**Server-Side (server/index.js)**
```javascript
io.on("connection", (socket) => {
  // Join auction room
  socket.on("joinAuction", async (auctionId) => {
    socket.join(`auction-${auctionId}`);
  });

  // Handle new bids
  socket.on("placeBid", async ({ auctionId, userId, amount }) => {
    // Validate and process bid
    // Update database
    // Broadcast to all participants
    io.to(`auction-${auctionId}`).emit("bidUpdate", bidData);
  });
});
```

**Client-Side Integration**
```typescript
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

socket.emit("joinAuction", auctionId);
socket.on("bidUpdate", (data) => {
  // Update UI with new bid
});
```

### AI Shopping Assistant

**Google Gemini Integration**
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const chat = model.startChat({
  history: previousMessages,
  generationConfig: {
    maxOutputTokens: 500,
  },
});

const result = await chat.sendMessage(userMessage);
```

**Conversation Context**
- Stored in `ChatHistory` model per user
- Maintains context across sessions
- Personalized product recommendations

### Interactive Craft Atlas

**D3.js Map Rendering**
```typescript
import * as d3 from "d3";
import * as topojson from "topojson-client";

// Load India TopoJSON
const topology = await d3.json("/map-data/india.json");
const geojson = topojson.feature(topology, topology.objects.states);

// Render map
const svg = d3.select("svg");
const projection = d3.geoMercator().fitSize([width, height], geojson);
const path = d3.geoPath().projection(projection);

svg.selectAll("path")
  .data(geojson.features)
  .enter()
  .append("path")
  .attr("d", path)
  .on("click", (event, d) => {
    displayCraftInfo(d.properties.state);
  });
```

**State-Based Craft Data**
- Maps Indian states to traditional crafts
- Interactive tooltips with craft descriptions
- Links to artisans by region

## 🔧 Prerequisites

### Required Software

- **Node.js**: v18.x or higher ([Download](https://nodejs.org/))
- **npm**: v9.x or higher (comes with Node.js)
- **PostgreSQL**: v14.x or higher ([Download](https://www.postgresql.org/download/))
- **Git**: Latest version ([Download](https://git-scm.com/))

### Required Accounts

- **Clerk Account**: For authentication ([Sign up](https://clerk.com/))
- **Supabase Account**: For image storage ([Sign up](https://supabase.com/))
- **Google AI Studio**: For Gemini API key ([Get API Key](https://ai.google.dev/))
- **PostgreSQL Database**: Local or cloud (e.g., Neon, Supabase, Railway)

### Recommended Tools

- **VS Code**: Code editor with TypeScript/React extensions
- **Postman**: API testing (optional)
- **pgAdmin**: PostgreSQL management (optional)

## 📥 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Sambit-Kumar-Mohanty-26/Artisans-Loom.git
cd Artisans-Loom
```

### 2. Frontend Setup (Client)

#### Install Dependencies

```bash
cd client
npm install
```

#### Configure Environment Variables

Create `.env.local` in the `client/` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/artisans_loom"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# Google AI
GEMINI_API_KEY=AIzaSyxxxxx

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9xxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9xxxxx

# WebSocket Server
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

#### Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npm run seed
```

**Seed Script** (`seed.ts`) populates:
- Sample artisans and customers
- Products across categories
- Active auction items
- Forum posts and stories

### 3. Backend Setup (Server)

#### Install Dependencies

```bash
cd ../server
npm install
```

#### Configure Environment

Create `.env` in the `server/` directory:

```env
# Database (same as client)
DATABASE_URL="postgresql://user:password@localhost:5432/artisans_loom"

# Server Port
PORT=3001

# Google AI
GEMINI_API_KEY=AIzaSyxxxxx
```

#### Prisma Setup

The server automatically syncs schema from client on `npm install` via postinstall script.

```bash
npm install  # Runs prisma generate
```

### 4. Clerk Webhook Configuration

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Webhooks** → **Add Endpoint**
3. Set URL: `https://your-domain.com/api/webhooks/clerk`
4. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy signing secret to `.env.local` as `CLERK_WEBHOOK_SECRET`

### 5. Supabase Storage Setup

1. Create Supabase project
2. Go to **Storage** → **Create Bucket**
3. Create bucket named `artisan-products` with public access
4. Copy URL and keys to `.env.local`

## 🚀 Running the Application

### Development Mode

#### Start Frontend (Client)

```bash
cd client
npm run dev
```

Access at: **http://localhost:3000**

#### Start WebSocket Server

In a separate terminal:

```bash
cd server
npm run dev
```

WebSocket server runs on: **http://localhost:3001**

### Production Build

#### Build Frontend

```bash
cd client
npm run build
npm start
```

#### Start Production Server

```bash
cd server
npm start
```

### Database Management

**View Database**
```bash
npx prisma studio
```
Opens Prisma Studio at http://localhost:5555

**Reset Database**
```bash
npx prisma migrate reset
```

**Create Migration**
```bash
npx prisma migrate dev --name migration_name
```

## 🌍 Deployment

### Deploy Frontend to Vercel

#### Via Vercel CLI

```bash
cd client
npm install -g vercel
vercel
```

#### Via GitHub Integration

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. **Import Project** → Select repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add environment variables from `.env.local`
6. Deploy

**Environment Variables Required:**
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SOCKET_URL`

### Deploy WebSocket Server

**Options:**
1. **Railway**: Supports WebSocket and PostgreSQL
2. **Render**: Free tier with persistent WebSocket
3. **Heroku**: With Redis for scaling
4. **DigitalOcean**: Droplet with PM2

**Example: Deploy to Railway**

```bash
cd server
railway login
railway init
railway add
railway up
```

Add environment variables in Railway dashboard.

### Database Hosting

**Recommended Options:**
- **Neon**: Serverless PostgreSQL (free tier available)
- **Supabase**: PostgreSQL with built-in storage
- **Railway**: PostgreSQL addon
- **Render**: Managed PostgreSQL

Update `DATABASE_URL` in both client and server `.env` files.

## 📖 Usage Guide

### For Artisans

#### 1. Registration & Onboarding

1. Navigate to **Sign Up** page
2. Create account via Clerk (email/social login)
3. Complete **Onboarding** form:
   - Select role: **Artisan**
   - Enter business name
   - Specify craft type (e.g., "Handloom Weaving")
   - Add bio and location
   - Set years of experience

#### 2. Creating Products

1. Go to **Dashboard** → **Inventory**
2. Click **Add Product**
3. Fill details:
   - **Title**: Product name
   - **Description**: Detailed description
   - **Price**: In INR
   - **Category**: Select from dropdown
   - **Materials**: Add tags (e.g., "Cotton", "Natural Dyes")
   - **Stock**: Available quantity
   - **Images**: Upload up to 5 images
4. **Publish** product

#### 3. Creating Auctions

1. Go to **Dashboard** → **Create Auction**
2. Select existing product or create new
3. Set auction parameters:
   - **Base Price**: Starting bid amount
   - **Reserve Price**: Minimum acceptable price (optional)
   - **Start Time**: Auction begins
   - **End Time**: Auction closes
4. **Launch Auction**

Real-time bids appear during auction period.

#### 4. Managing Orders

1. Go to **Dashboard** → **Orders**
2. View order list with status:
   - **PENDING**: Awaiting confirmation
   - **PROCESSING**: Being prepared
   - **SHIPPED**: In transit
   - **DELIVERED**: Completed
3. Click order to view details and update status

### For Customers

#### 1. Discovering Products

**Browse Shop**
```
Navigate to Shop → Filter by:
- Category (Textiles, Pottery, Jewelry, etc.)
- Price range
- Materials
- Artisan location
```

**Search Products**
```
Use AI Shopping Assistant:
"Show me handwoven cotton sarees under ₹5000"
"Find terracotta pottery from Rajasthan"
```

#### 2. Participating in Auctions

1. Go to **Auction** page
2. View active auctions with countdown timers
3. Click **Place Bid** on desired item
4. Enter bid amount (must exceed current bid)
5. Confirm bid
6. Receive real-time updates when outbid
7. Winner notified at auction close

#### 3. Making Purchases

1. Click product card → **View Details**
2. Review product information and images
3. **Add to Cart** (or **Buy Now** for direct checkout)
4. Proceed to **Checkout**
5. Enter shipping address
6. Review order summary
7. **Place Order**
8. Track order status from **Profile** → **Orders**

#### 4. Using AI Assistants

**Shopping Assistant**
```
Location: /assistants/shopping
Use cases:
- "I'm looking for a gift for my mother who loves traditional art"
- "Find sustainable home decor items"
- "Show me products from artisans in Kerala"
```

**Craft Information Bot**
```
Location: /assistants/craft-info
Use cases:
- "Tell me about Madhubani painting"
- "What is the history of Pashmina weaving?"
- "How is blue pottery made?"
```

**Visual Tour Guide**
```
Location: /assistants/visual-tour
Use cases:
- Upload image of craft item for identification
- Get step-by-step craft process explanations
```

### For Community Members

#### 1. Exploring Craft Atlas

1. Go to **Craft Atlas**
2. Click on Indian states on the D3 map
3. View traditional crafts from that region
4. Click craft names to see related products
5. Discover artisans by location

#### 2. Engaging in Forums

1. Navigate to **Dashboard** → **Community**
2. Browse existing threads
3. **Create Post**:
   - Write content
   - Add tags (e.g., "handloom", "tips", "showcase")
   - Attach images (optional)
4. **Reply** to posts
5. **Like** posts you find helpful
6. Report inappropriate content

#### 3. Reading Stories

1. Go to **Stories** page
2. Browse featured artisan stories
3. Click story to read full article
4. Categories:
   - Artisan Spotlights
   - Craft Techniques
   - Sustainability Stories
   - Community Impact

## 🔌 API Routes

### Authentication

**POST `/api/webhooks/clerk`**
- Handles Clerk user lifecycle events
- Creates/updates User records in database

### AI Chat

**POST `/api/chat/shopping`**
```json
{
  "message": "Find handwoven sarees under 3000 rupees",
  "userId": "user_123",
  "chatHistory": [...]
}
```
**Response:**
```json
{
  "response": "Here are some beautiful handwoven sarees...",
  "products": [...],
  "chatHistory": [...]
}
```

**POST `/api/chat/craft-info`**
- Ask questions about craft traditions
- Get historical and technical information

**POST `/api/chat/visual-tour`**
- Upload images for craft identification
- Get visual explanations of techniques

### Text-to-Speech

**POST `/api/tts`**
```json
{
  "text": "Welcome to Artisans Loom"
}
```
**Response:** Audio file buffer

## ⚡ Real-Time Features

### WebSocket Events

**Client → Server**

| Event | Payload | Description |
|-------|---------|-------------|
| `joinAuction` | `{ auctionId }` | Join auction room |
| `leaveAuction` | `{ auctionId }` | Leave auction room |
| `placeBid` | `{ auctionId, userId, amount }` | Submit new bid |
| `joinChat` | `{ userId }` | Join support chat |
| `sendMessage` | `{ userId, message }` | Send chat message |

**Server → Client**

| Event | Payload | Description |
|-------|---------|-------------|
| `bidUpdate` | `{ auctionId, currentBid, bidderId, timestamp }` | New bid placed |
| `auctionEnded` | `{ auctionId, winnerId, finalBid }` | Auction concluded |
| `outbidNotification` | `{ userId, auctionId, newBid }` | User outbid alert |
| `messageReceived` | `{ message, timestamp }` | Chat message |

### Cron Jobs

**Auction Cleanup** (runs every minute)
```javascript
cron.schedule("* * * * *", async () => {
  const now = new Date();
  // Find expired auctions
  // Update status to SOLD/UNSOLD
  // Notify winners
  // Create orders for winning bids
});
```

## ⚙️ Configuration

### Next.js Configuration (`next.config.ts`)

```typescript
const nextConfig: NextConfig = {
  images: {
    domains: [
      'img.clerk.com',
      'your-supabase-project.supabase.co',
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  webpack: (config) => {
    // Custom webpack config
    return config;
  },
};
```

### Tailwind Configuration

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#8B4513',    // Saddle Brown
        secondary: '#DAA520',   // Goldenrod
        accent: '#CD853F',      // Peru
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};
```

### Prisma Configuration

```typescript
// client/prisma.config.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## 🧪 Testing

### Unit Testing (To Be Implemented)

**Setup Jest + React Testing Library**

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Example Test:**
```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const product = {
      id: '1',
      title: 'Handwoven Saree',
      price: 2500,
      images: ['image.jpg'],
    };
    
    render(<ProductCard product={product} />);
    expect(screen.getByText('Handwoven Saree')).toBeInTheDocument();
    expect(screen.getByText('₹2,500')).toBeInTheDocument();
  });
});
```

### E2E Testing

**Setup Playwright**

```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Example E2E Test:**
```typescript
// e2e/auction.spec.ts
import { test, expect } from '@playwright/test';

test('user can place bid in auction', async ({ page }) => {
  await page.goto('/auction');
  await page.click('button:has-text("Place Bid")');
  await page.fill('input[name="bidAmount"]', '5000');
  await page.click('button:has-text("Confirm Bid")');
  await expect(page.locator('.toast')).toContainText('Bid placed successfully');
});
```

### Manual Testing Checklist

#### Authentication
- [ ] Sign up with email
- [ ] Sign up with Google/GitHub
- [ ] Sign in with credentials
- [ ] Sign out
- [ ] Redirect to protected routes

#### Products
- [ ] Create product as artisan
- [ ] Upload multiple images
- [ ] Edit product details
- [ ] Delete product
- [ ] View product details
- [ ] Filter products by category
- [ ] Search products

#### Auctions
- [ ] Create auction
- [ ] Join auction as customer
- [ ] Place bid
- [ ] Receive outbid notification
- [ ] Win auction
- [ ] Auction auto-closes at end time

#### Orders
- [ ] Add product to cart
- [ ] Checkout process
- [ ] View order history
- [ ] Update order status (artisan)
- [ ] Track order (customer)

#### Community
- [ ] Create forum post
- [ ] Reply to post
- [ ] Like post
- [ ] Follow artisan
- [ ] Read stories

#### AI Features
- [ ] Chat with shopping assistant
- [ ] Get product recommendations
- [ ] Ask craft information bot
- [ ] Upload image to visual tour

## 🤝 Contributing

We welcome contributions! Follow these steps:

### 1. Fork the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Artisans-Loom.git
cd Artisans-Loom
```

### 2. Create Feature Branch

```bash
git checkout -b feature/amazing-feature
```

### 3. Make Changes

- Write clean, documented code
- Follow existing code style
- Update documentation if needed
- Add tests for new features

### 4. Commit Changes

```bash
git commit -m "feat: Add amazing feature"
```

**Commit Convention:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Maintenance tasks

### 5. Push to Branch

```bash
git push origin feature/amazing-feature
```

### 6. Open Pull Request

- Describe changes in detail
- Reference related issues
- Ensure CI checks pass
- Request review

### Code Style Guidelines

**TypeScript:**
```typescript
// Use explicit types
const fetchProducts = async (): Promise<Product[]> => {
  // Implementation
};

// Use interfaces for objects
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}
```

**React Components:**
```typescript
// Use functional components with TypeScript
export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="product-card">
      {/* JSX */}
    </div>
  );
}
```

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Sambit Kumar Mohanty

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Contact & Support

**Developer**: Sambit Kumar Mohanty  
**GitHub**: [@Sambit-Kumar-Mohanty-26](https://github.com/Sambit-Kumar-Mohanty-26)  
**Email**: [sambitkumarmohanty25@gmail.com](mailto:sambitkumarmohanty25@gmail.com)  
**LinkedIn**: [Connect on LinkedIn](https://www.linkedin.com/in/sambit-kumar-mohanty)

### Get Help

- 🐛 **Report Bugs**: [Open an Issue](https://github.com/Sambit-Kumar-Mohanty-26/Artisans-Loom/issues)
- 💡 **Feature Requests**: [Open a Discussion](https://github.com/Sambit-Kumar-Mohanty-26/Artisans-Loom/discussions)
- 📧 **Email**: [sambitkumarmohanty25@gmail.com](mailto:sambitkumarmohanty25@gmail.com)

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) - React framework
- [Vercel](https://vercel.com/) - Hosting and deployment
- [Clerk](https://clerk.com/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [Google AI](https://ai.google.dev/) - Generative AI
- [Supabase](https://supabase.com/) - Cloud storage
- [Socket.IO](https://socket.io/) - Real-time communication
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Shadcn UI](https://ui.shadcn.com/) - Component library
- [D3.js](https://d3js.org/) - Data visualization

## 🗺️ Roadmap

### Phase 1 (Current - MVP)
- ✅ User authentication and onboarding
- ✅ Product listings and shop
- ✅ Real-time auction system
- ✅ AI shopping assistant
- ✅ Community forum
- ✅ Craft atlas
- ✅ Order management

### Phase 2 (Q2 2026)
- 🔲 Payment gateway integration (Razorpay/Stripe)
- 🔲 Advanced analytics dashboard
- 🔲 Mobile app (React Native)
- 🔲 Multi-language support
- 🔲 Push notifications
- 🔲 Artisan verification system
- 🔲 Wholesale/bulk order module

### Phase 3 (Q3-Q4 2026)
- 🔲 Video product demonstrations
- 🔲 Live streaming craft workshops
- 🔲 Artisan collaboration marketplace
- 🔲 Sustainability certifications
- 🔲 Export documentation assistance
- 🔲 AR product visualization
- 🔲 Blockchain-based authenticity certificates

### Phase 4 (2027+)
- 🔲 Global expansion (international shipping)
- 🔲 B2B enterprise portal
- 🔲 Craft education platform
- 🔲 Artisan financing programs
- 🔲 Supply chain transparency tracking
- 🔲 Community-driven craft preservation initiatives

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Total Files** | 200+ |
| **Lines of Code** | ~15,000+ |
| **Languages** | TypeScript 98.3%, JavaScript 1.3%, CSS 0.4% |
| **Database Models** | 13 |
| **API Routes** | 20+ |
| **Pages/Routes** | 30+ |
| **Real-Time Events** | 8 |

## 🔍 FAQ

### Q: What makes Artisans Loom different from other e-commerce platforms?

A: We focus exclusively on connecting traditional artisans with customers, combining e-commerce with community features, AI assistance, and educational content about craft traditions.

### Q: Is there a mobile app?

A: Currently, the platform is web-based and mobile-responsive. A native mobile app is planned for Phase 2 (Q2 2026).

### Q: How do artisans receive payments?

A: Payment gateway integration (Razorpay/Stripe) is under development. Currently, the platform handles order coordination, with direct payment arrangements between artisans and customers.

### Q: Can international customers purchase?

A: Yes, but international shipping depends on individual artisan capabilities. Global expansion with standardized international shipping is planned for 2027.

### Q: How are auction winners determined?

A: The highest bidder when the auction timer expires wins. If the reserve price (if set) is not met, the auction is marked as UNSOLD.

### Q: Is the AI assistant data private?

A: Yes. Chat history is stored per user and not shared. We follow privacy best practices and comply with data protection regulations.

### Q: Can I sell products if I'm not a registered artisan?

A: You must register as an artisan during onboarding. We verify artisan credentials to maintain platform authenticity (verification system coming in Phase 2).

### Q: What types of products can be sold?

A: Handcrafted items including textiles, pottery, jewelry, home decor, artwork, woodwork, metalcraft, and traditional crafts. Mass-produced items are not allowed.

---

**Built with ❤️ for artisans and craft lovers**

⭐ **Star this repository** if you find it helpful!  
🍴 **Fork to create** your own version  
🐛 **Report issues** to help improve the project  

**Follow the journey:** [GitHub Repository](https://github.com/Sambit-Kumar-Mohanty-26/Artisans-Loom)
