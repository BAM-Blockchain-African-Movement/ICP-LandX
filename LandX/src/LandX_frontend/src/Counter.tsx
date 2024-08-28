import React, { useState, useEffect } from 'react';
import { LandX_backend } from "../../declarations/LandX_backend";

const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    fetchCount();
  }, []);

  async function fetchCount() {
    const currentCount = await LandX_backend.get();
    setCount(Number(currentCount));
  }

  async function handleIncrement() {
    const newCount = await LandX_backend.increment();
    setCount(Number(newCount));
  }

  async function handleDecrement() {
    const newCount = await LandX_backend.decrement();
    setCount(Number(newCount));
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Compteur : {count}</h1>
      <div className="flex space-x-4">
        <button
          onClick={handleDecrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Décrémenter
        </button>
        <button
          onClick={handleIncrement}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Incrémenter
        </button>
      </div>
    </div>
  );
}

export default Counter;