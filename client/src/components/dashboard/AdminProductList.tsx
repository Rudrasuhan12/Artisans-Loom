"use client";

import { useState, useTransition, useMemo } from "react";
import { deleteProductAction } from "@/app/actions/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Search,
  Trash2,
  Package,
  User,
  IndianRupee,
  Eye,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  views: number;
  salesCount: number;
  createdAt: string;
  artisan: { id: string; name: string | null; email: string | null };
  _count: { orderItems: number };
};

export default function AdminProductList({
  products: initialProducts,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.artisan.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && p.stock > 0) ||
        (stockFilter === "out-of-stock" && p.stock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, categoryFilter, stockFilter]);

  function handleDelete() {
    if (!deleteTarget) return;

    startTransition(async () => {
      try {
        await deleteProductAction(deleteTarget.id);
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        toast.success(`"${deleteTarget.title}" deleted successfully`);
        setDeleteTarget(null);
      } catch (err: any) {
        toast.error(err.message || "Failed to delete product");
      }
    });
  }

  return (
    <>
      {/* Filters */}
      <Card className="border-none shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B70]" />
              <Input
                placeholder="Search by product name, artisan, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-[#4A3526] flex items-center gap-2">
            <Package className="w-5 h-5" />
            Products ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#8C7B70]">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white border">
                      <Image
                        src={product.images[0] || "/p1.png"}
                        alt={product.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-semibold text-[#4A3526] truncate max-w-[200px] sm:max-w-none">
                          {product.title}
                        </p>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {product.category}
                        </Badge>
                        {product.stock === 0 && (
                          <Badge variant="destructive" className="shrink-0 text-xs">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#8C7B70]">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {product.artisan.name || product.artisan.email || "Unknown"}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {product.price.toLocaleString("en-IN")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5" />
                          {product.stock} in stock
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {product.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingCart className="w-3.5 h-3.5" />
                          {product.salesCount} sold
                        </span>
                      </div>
                    </div>

                    {/* Actions — always visible */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(product)}
                      className="shrink-0 whitespace-nowrap flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              <strong>&quot;{deleteTarget?.title}&quot;</strong> by{" "}
              <strong>{deleteTarget?.artisan.name || "Unknown"}</strong>?
              <br />
              <br />
              This will also remove all related bids, auction items, and order
              history. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
