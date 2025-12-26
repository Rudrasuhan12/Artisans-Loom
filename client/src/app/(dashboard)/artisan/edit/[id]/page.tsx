import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditProductForm from "@/components/artisan/EditProductForm";

export default async function EditPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) return <div>Product not found</div>;

  return <EditProductForm product={product} />;
}