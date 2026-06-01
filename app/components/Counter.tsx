'use client';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { increment, decrement, incrementByAmount, reset } from '@/app/store/slices/counterSlice';

export function Counter() {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.counter.value);

  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">Counter Example</h2>
      <p className="text-5xl font-bold text-blue-600">{count}</p>
      <div className="flex gap-4">
        <button
          onClick={() => dispatch(decrement())}
          className="rounded-lg bg-red-500 px-4 py-2 text-white font-semibold hover:bg-red-600 transition"
        >
          - Decrement
        </button>
        <button
          onClick={() => dispatch(reset())}
          className="rounded-lg bg-gray-500 px-4 py-2 text-white font-semibold hover:bg-gray-600 transition"
        >
          Reset
        </button>
        <button
          onClick={() => dispatch(increment())}
          className="rounded-lg bg-green-500 px-4 py-2 text-white font-semibold hover:bg-green-600 transition"
        >
          + Increment
        </button>
      </div>
      <button
        onClick={() => dispatch(incrementByAmount(5))}
        className="rounded-lg bg-purple-500 px-4 py-2 text-white font-semibold hover:bg-purple-600 transition"
      >
        Add 5
      </button>
    </div>
  );
}
