import ProductForm from "../ProductForm";

export default function AddProductPage() {
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
      <ProductForm />
    </div>
  );
}
