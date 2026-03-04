const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// 1. Manually load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is missing in .env.local");
  process.exit(1);
}

// 2. Initialize the Postgres Adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("--- Starting Seed ---");

  // Expanded list of Artisans covering more regions
  const artisans = [
    {
      email: "ramesh.mohap@example.com",
      name: "Ramesh Mohapatra",
      state: "Odisha",
      craft: "Pattachitra & Filigree"
    },
    {
      email: "suresh.potter@example.com",
      name: "Suresh Sharma",
      state: "Rajasthan",
      craft: "Blue Pottery"
    },
    {
      email: "ananya.silk@example.com",
      name: "Ananya Devi",
      state: "Uttar Pradesh",
      craft: "Banarasi Weaving"
    },
    {
      email: "sita.art@example.com",
      name: "Sita Das",
      state: "Bihar",
      craft: "Madhubani Painting"
    },
    {
      email: "rk.bronze@example.com",
      name: "Ramesh Kulkarni",
      state: "Karnataka",
      craft: "Bronze Casting"
    }
  ];

  for (const a of artisans) {
    // Create or find the Artisan
    const user = await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        email: a.email,
        name: a.name,
        role: "ARTISAN",
        profile: {
          create: {
            state: a.state,
            craftType: a.craft,
            bio: `Master artisan from ${a.state} specializing in traditional ${a.craft}.`
          }
        }
      }
    });

    console.log(`Processing products for: ${a.name} (${a.state})`);

    // Add specific products for each state to test filters
    if (a.state === "Odisha") {
      await prisma.product.createMany({
        data: [
          {
            title: "Traditional Pattachitra Scroll",
            description: "Hand-painted scroll on treated cloth depicting the life of Lord Krishna.",
            price: 4500.00,
            category: "Home Decor",
            materials: ["Cotton", "Natural Pigments"],
            images: ["/p1.png"],
            artisanId: user.id,
            stock: 5
          },
          {
            title: "Silver Filigree Peacock",
            description: "Intricate Tarakasi work handmade in Cuttack.",
            price: 8500.00,
            category: "Jewelry",
            materials: ["Silver"],
            images: ["/p2.png"],
            artisanId: user.id,
            stock: 2
          }
        ]
      });
    } else if (a.state === "Rajasthan") {
      await prisma.product.createMany({
        data: [
          {
            title: "Jaipur Blue Pottery Vase",
            description: "Turquoise blue pottery with traditional floral cobalt designs.",
            price: 2200.00,
            category: "Pottery",
            materials: ["Clay", "Quartz"],
            images: ["/p3.png"],
            artisanId: user.id,
            stock: 12
          }
        ]
      });
    } else if (a.state === "Uttar Pradesh") {
      await prisma.product.createMany({
        data: [
          {
            title: "Banarasi Silk Saree",
            description: "Hand-woven pure silk saree with real zari work.",
            price: 15000.00,
            category: "Textiles",
            materials: ["Silk", "Gold Thread"],
            images: ["/p1.png"],
            artisanId: user.id,
            stock: 3
          }
        ]
      });
    } else if (a.state === "Bihar") {
      await prisma.product.createMany({
        data: [
          {
            title: "Mithila Folk Painting",
            description: "Madhubani style art on handmade paper using natural dyes.",
            price: 3500.00,
            category: "Home Decor",
            materials: ["Handmade Paper", "Natural Dyes"],
            images: ["/p4.png"],
            artisanId: user.id,
            stock: 7
          }
        ]
      });
    } else if (a.state === "Karnataka") {
      await prisma.product.createMany({
        data: [
          {
            title: "Bronze Ganesha Idol",
            description: "Lost-wax casted bronze idol with temple finish.",
            price: 12500.00,
            category: "Home Decor",
            materials: ["Bronze", "Copper"],
            images: ["/p2.png"],
            artisanId: user.id,
            stock: 1
          }
        ]
      });
    }
  }

  console.log("--- Seed Complete: Database is now rich with diverse crafts ---");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });