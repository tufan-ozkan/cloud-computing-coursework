'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

const categories = [
  {
    name: "Vinyls",
    image: "https://www.voyou.fr/wp-content/uploads/2015/02/100-vinyls-21.jpg"
  },
  {
    name: "Antique Furniture",
    image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.u-3PIkLyE4dGz702xpvlXgHaJQ%26pid%3DApi&f=1&ipt=a1f4ab50269828aaf494596f49e8cab5a6a198151ebf157383f894831a412711&ipo=images"
  },
  {
    name: "GPS Sport Watches",
    image: "https://ae01.alicdn.com/kf/HLB16uhTaynrK1RjSsziq6xptpXaU/SMA-M1-GPS-Sports-Watch-Bluetooth-Call-Multi-Sports-Mode-Compass-Altitude-Outdoor-Sports-Smart-Watch.jpg"
  },
  {
    name: "Running Shoes",
    image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.7O42Tk0Wqch3I33hBwcGLgHaE8%26pid%3DApi&f=1&ipt=33bcb02957420c0117d7949b7b25b1b71849cb4f62a92331b4c8c28c57d34685&ipo=images"
  }
];

export default function HomePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      const res = await fetch("/api/items");
      const data = await res.json();
      setItems(data.slice(3, 5)); // get 4 featured items
    }

    fetchItems();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome to the Store !</h1>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/items/category/${encodeURIComponent(cat.name)}`}
            className="block border rounded-xl shadow overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-36 object-cover"
            />
            <div className="p-3 text-center font-medium text-gray-800">
              {cat.name}
            </div>
          </Link>
        ))}
      </div>

      {/* For Sale Section */}
      <h2 className="text-xl font-semibold mb-4">🛒 For Sale !!!</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Loading items...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link
              key={item._id}
              href={`/items/${item._id}`}
              className="block border rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {item.Image && (
                <img
                  src={item.Image}
                  alt={item.Name}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-3">
                <h3 className="font-semibold text-lg">{item.Name}</h3>
                <p className="text-sm text-gray-500">{item.Category}</p>
                <p className="text-green-600 font-bold">${item.Price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
