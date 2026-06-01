"use client";

import React, { useState, FormEvent } from "react";
import { useBackendAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

interface ProductData {
  name: string;
  slug?: string;
  description?: string;
  basePrice: number;
  category?: string;
  tags?: string;
}

interface Props {
  initial?: Partial<ProductData>;
  productId?: string; // if present, we will PUT
}

export default function ProductForm({ initial = {}, productId }: Props) {
  const { fetchWithAuth } = useBackendAPI();
  const router = useRouter();
  const [form, setForm] = useState<ProductData>({
    name: initial.name || "",
    slug: initial.slug || "",
    description: initial.description || "",
    basePrice: initial.basePrice || 0,
    category: initial.category || "",
    tags: initial.tags || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "basePrice" ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = productId ? `/api/products/${productId}` : "/api/products";
      const method = productId ? "PUT" : "POST";
      await fetchWithAuth(url, {
        method,
        body: JSON.stringify(
          Object.assign({}, form, {
            basePrice: parseFloat(form.basePrice as unknown as string) || 0,
          })
        ),
      });
      router.push("/dashboard/products");
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error)?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Slug</label>
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="optional"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Base Price</label>
        <input
          name="basePrice"
          type="number"
          value={form.basePrice}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
