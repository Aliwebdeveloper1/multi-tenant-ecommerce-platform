import { useEffect, useState } from "react";
import Link from "next/link";
import { useBackendAPI } from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  slug: string;
  basePrice: number;
  isActive: boolean;
}

export default function ProductsPage() {
  const { fetchWithAuth } = useBackendAPI();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchWithAuth("/api/products");
        setProducts(data || []);
      } catch (err: unknown) {
        setError((err as Error).message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchWithAuth]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Link
          href="/dashboard/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Product
        </Link>
      </div>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p._id}>
                <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">${p.basePrice.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.isActive ? "Yes" : "No"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/dashboard/products/${p._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
