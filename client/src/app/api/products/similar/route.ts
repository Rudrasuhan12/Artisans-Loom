import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productId = searchParams.get("id");
  const category = searchParams.get("category");
  const materialsParam = searchParams.get("materials");

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  const materials = materialsParam ? materialsParam.split(",").filter(Boolean) : [];

  try {
    // Find products with same category or overlapping materials
    const products = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: productId } },
          {
            OR: [
              category ? { category } : {},
              materials.length > 0 ? { materials: { hasSome: materials } } : {},
            ],
          },
        ],
      },
      include: {
        artisan: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: [{ salesCount: "desc" }, { views: "desc" }],
      take: 4,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Similar products error:", error);
    return NextResponse.json({ error: "Failed to fetch similar products" }, { status: 500 });
  }
}
