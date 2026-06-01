import ProductForm from "../ProductForm";
import { useEffect, useState } from "react";
import { useBackendAPI } from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  slug: string;
  basePrice: number;
  description?: string;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { fetchWithAuth } = useBackendAPI();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchWithAuth(`/api/products/${params.id}`);
        setProduct(data);
      } catch (err: unknown) {
        setError((err as Error).message || "Unable to load product");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchWithAuth, params.id]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
      <ProductForm initial={product} productId={product._id} />
    </div>
  );
}
