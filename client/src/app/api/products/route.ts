import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const sort = searchParams.get("sort");
    const category = searchParams.get("category");
    const region = searchParams.get("region");
    const minPrice = parseFloat(searchParams.get("min") || "0");
    const maxPrice = parseFloat(searchParams.get("max") || "9999999");

    const rawSearch = searchParams.get("q") || "";
    const keywords = rawSearch
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !['and', 'the', 'with', 'for'].includes(w));

    const where: any = {
      price: { gte: minPrice, lte: maxPrice },
    };

    if (category && category !== "All") where.category = category;
    if (region && region !== "All") {
      where.artisan = {
        profile: { state: { contains: region, mode: 'insensitive' } }
      };
    }

    if (keywords.length > 0) {
      where.OR = keywords.map(word => ({
        OR: [
          { title: { contains: word, mode: "insensitive" } },
          { description: { contains: word, mode: "insensitive" } },
          { category: { contains: word, mode: "insensitive" } },
          { tags: { has: word } }
        ]
      }));
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    if (sort === 'price-high') orderBy = { price: 'desc' };

    let products = await prisma.product.findMany({
      where,
      include: {
        artisan: { include: { profile: true } }
      },
      orderBy: sort === 'newest' ? undefined : orderBy,
    });

    if (keywords.length > 0) {
      products = products.map((p: any) => {
        let score = 0;
        const text = `${p.title} ${p.description} ${p.category} ${p.tags.join(" ")}`.toLowerCase();
        
        keywords.forEach(word => {
          if (text.includes(word)) score += 1;
          if (p.title.toLowerCase().includes(word)) score += 2;
        });
        
        return { ...p, score };
      })
      .filter((p: any) => p.score > 0) 
      .sort((a: any, b: any) => b.score - a.score);
    }

    if (!keywords.length && sort === 'newest') {
       products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Database query failed" }, { status: 500 });
  }
}