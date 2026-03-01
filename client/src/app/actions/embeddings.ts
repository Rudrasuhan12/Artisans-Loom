"use server";

import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Generate embedding vector for text using Gemini
 * Returns a 768-dimensional vector
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Create a searchable text representation of a product
 */
function createProductSearchText(product: {
  title: string;
  description: string;
  category: string;
  materials: string[];
  tags: string[];
}): string {
  return [
    product.title,
    product.description,
    `Category: ${product.category}`,
    `Materials: ${product.materials.join(", ")}`,
    `Tags: ${product.tags.join(", ")}`,
  ].join(" | ");
}

/**
 * Generate and store embedding for a single product
 */
export async function generateProductEmbedding(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      materials: true,
      tags: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const searchText = createProductSearchText(product);
  const embedding = await generateEmbedding(searchText);

  // Store embedding using raw SQL since Prisma doesn't natively support vector operations
  await prisma.$executeRawUnsafe(
    `UPDATE "Product" SET embedding = $1::vector WHERE id = $2`,
    `[${embedding.join(",")}]`,
    productId
  );

  return { success: true, productId };
}

/**
 * Generate embeddings for all products that don't have one
 */
export async function generateAllProductEmbeddings() {
  // Get products without embeddings
  const products = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM "Product" WHERE embedding IS NULL
  `;

  const results = {
    total: products.length,
    success: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (const product of products) {
    try {
      await generateProductEmbedding(product.id);
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push(`${product.id}: ${error}`);
    }
    
    // Add small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Perform semantic search using vector similarity
 * Returns products that are semantically similar to the query
 */
export async function semanticProductSearch(
  query: string,
  limit: number = 10,
  minSimilarity: number = 0.5
) {
  // Generate embedding for the search query
  const queryEmbedding = await generateEmbedding(query);

  // Perform vector similarity search using cosine distance
  // Lower distance = more similar
  const products = await prisma.$queryRaw<
    {
      id: string;
      title: string;
      description: string;
      price: number;
      category: string;
      materials: string[];
      images: string[];
      tags: string[];
      views: number;
      salesCount: number;
      artisanId: string;
      similarity: number;
    }[]
  >`
    SELECT 
      p.id,
      p.title,
      p.description,
      p.price,
      p.category,
      p.materials,
      p.images,
      p.tags,
      p.views,
      p."salesCount",
      p."artisanId",
      1 - (p.embedding <=> ${`[${queryEmbedding.join(",")}]`}::vector) as similarity
    FROM "Product" p
    WHERE p.embedding IS NOT NULL
    ORDER BY p.embedding <=> ${`[${queryEmbedding.join(",")}]`}::vector
    LIMIT ${limit}
  `;

  // Filter by minimum similarity and fetch artisan details
  const filteredProducts = products.filter((p) => p.similarity >= minSimilarity);

  // Get artisan details for the products
  const artisanIds = [...new Set(filteredProducts.map((p) => p.artisanId))];
  const artisans = await prisma.user.findMany({
    where: { id: { in: artisanIds } },
    include: { profile: true },
  });

  const artisanMap = new Map(artisans.map((a) => [a.id, a]));

  return filteredProducts.map((product) => ({
    ...product,
    artisan: artisanMap.get(product.artisanId) || null,
  }));
}

/**
 * Find products similar to a given product
 */
export async function findSimilarProducts(
  productId: string,
  limit: number = 4
) {
  // Get the product's embedding
  const productWithEmbedding = await prisma.$queryRaw<
    { embedding: string }[]
  >`
    SELECT embedding::text FROM "Product" WHERE id = ${productId}
  `;

  if (!productWithEmbedding[0]?.embedding) {
    // Product doesn't have embedding, generate one first
    await generateProductEmbedding(productId);
    return findSimilarProducts(productId, limit);
  }

  // Find similar products (excluding the current product)
  const products = await prisma.$queryRaw<
    {
      id: string;
      title: string;
      description: string;
      price: number;
      category: string;
      materials: string[];
      images: string[];
      tags: string[];
      artisanId: string;
      similarity: number;
    }[]
  >`
    SELECT 
      p.id,
      p.title,
      p.description,
      p.price,
      p.category,
      p.materials,
      p.images,
      p.tags,
      p."artisanId",
      1 - (p.embedding <=> (SELECT embedding FROM "Product" WHERE id = ${productId})) as similarity
    FROM "Product" p
    WHERE p.id != ${productId}
      AND p.embedding IS NOT NULL
    ORDER BY p.embedding <=> (SELECT embedding FROM "Product" WHERE id = ${productId})
    LIMIT ${limit}
  `;

  // Get artisan details
  const artisanIds = [...new Set(products.map((p) => p.artisanId))];
  const artisans = await prisma.user.findMany({
    where: { id: { in: artisanIds } },
    include: { profile: true },
  });

  const artisanMap = new Map(artisans.map((a) => [a.id, a]));

  return products.map((product) => ({
    ...product,
    artisan: artisanMap.get(product.artisanId) || null,
  }));
}

/**
 * Get personalized recommendations based on user's purchase history using semantic search
 * This combines the user's past preferences into a semantic query
 */
export async function getSemanticRecommendations(
  userId: string,
  limit: number = 8
) {
  // Get user's order history
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      orders: {
        include: {
          items: {
            include: {
              product: {
                select: {
                  title: true,
                  category: true,
                  materials: true,
                  tags: true,
                },
              },
            },
          },
        },
        take: 5,
      },
    },
  });

  if (!user || user.orders.length === 0) {
    // Return popular products for users without history
    return prisma.product.findMany({
      orderBy: { salesCount: "desc" },
      take: limit,
      include: { artisan: { include: { profile: true } } },
    });
  }

  // Build a semantic query from user's purchase history
  const purchasedItems = user.orders.flatMap((order) =>
    order.items.map((item) => ({
      title: item.product.title,
      category: item.product.category,
      materials: item.product.materials,
      tags: item.product.tags,
    }))
  );

  // Create a combined query text representing user preferences
  const categories = [...new Set(purchasedItems.map((i) => i.category))];
  const materials = [...new Set(purchasedItems.flatMap((i) => i.materials))];
  const tags = [...new Set(purchasedItems.flatMap((i) => i.tags))];

  const semanticQuery = [
    `Interested in: ${categories.join(", ")}`,
    `Prefers materials: ${materials.slice(0, 10).join(", ")}`,
    `Likes: ${tags.slice(0, 10).join(", ")}`,
    `Similar to: ${purchasedItems.slice(0, 3).map((i) => i.title).join(", ")}`,
  ].join(" | ");

  // Perform semantic search with this combined preference query
  return semanticProductSearch(semanticQuery, limit, 0.3);
}
