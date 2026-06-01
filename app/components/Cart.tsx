'use client';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { addItem, removeItem, updateQuantity, clearCart } from '@/app/store/slices/cartSlice';
import { useState } from 'react';

export function Cart() {
  const dispatch = useAppDispatch();
  const { items, totalPrice } = useAppSelector((state) => state.cart);
  const [nameInput, setNameInput] = useState('');
  const [priceInput, setPriceInput] = useState('');

  const handleAddItem = () => {
    if (nameInput && priceInput) {
      dispatch(
        addItem({
          id: Date.now().toString(),
          name: nameInput,
          price: parseFloat(priceInput),
          quantity: 1,
        })
      );
      setNameInput('');
      setPriceInput('');
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Item name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={priceInput}
          onChange={(e) => setPriceInput(e.target.value)}
          className="w-24 rounded border border-gray-300 px-3 py-2"
        />
        <button
          onClick={handleAddItem}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-600 transition"
        >
          Add Item
        </button>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-gray-900">Items ({items.length})</h3>
        {items.length === 0 ? (
          <p className="text-gray-500">Cart is empty</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded bg-gray-50 p-3"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} x {item.quantity} = $
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity - 1,
                        })
                      )
                    }
                    className="rounded bg-yellow-500 px-2 py-1 text-white text-sm hover:bg-yellow-600"
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity + 1,
                        })
                      )
                    }
                    className="rounded bg-yellow-500 px-2 py-1 text-white text-sm hover:bg-yellow-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => dispatch(removeItem(item.id))}
                    className="rounded bg-red-500 px-2 py-1 text-white text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 border-t pt-4">
        <p className="text-lg font-bold text-gray-900">
          Total: ${totalPrice.toFixed(2)}
        </p>
        <button
          onClick={() => dispatch(clearCart())}
          className="mt-2 rounded-lg bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700 transition"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
