import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Package, ShoppingCart } from "lucide-react";

export default async function OrdersPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600">
              Start shopping to see your orders here
            </p>
          </div>
        </div>

        {/* Sample Order Cards (Demo) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #ORD-001
                </h3>
                <p className="text-sm text-gray-600">Feb 20, 2026</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                Pending
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Items:</span> 2
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Total:</span> $99.99
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
