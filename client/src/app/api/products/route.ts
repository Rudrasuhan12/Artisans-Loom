import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const sort = searchParams.get("sort");
    const category = searchParams.get("category");
    const material = searchParams.get("material");
    const region = searchParams.get("region");
    const minPrice = parseFloat(searchParams.get("min") || "0");
    const maxPrice = parseFloat(searchParams.get("max") || "9999999");
    const search = searchParams.get("q");

    const where: any = {
      price: { gte: minPrice, lte: maxPrice },
    };

    if (category && category !== "All") where.category = category;

    if (material && material !== "All") {
      where.materials = { has: material };
    }

    if (region && region !== "All") {
      where.artisan = {
        profile: {
          state: { contains: region, mode: 'insensitive' }
        }
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };

    if (sort === 'price-low') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-high') {
      orderBy = { price: 'desc' };
    }
    const products = await prisma.product.findMany({
      where,
      include: {
        artisan: {
          include: { profile: true }
        }
      },
      orderBy: orderBy,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Database query failed" }, { status: 500 });
  }
}