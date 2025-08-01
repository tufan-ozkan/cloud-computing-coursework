export const dynamic = "force-dynamic";
import { connectDb } from "@/lib/db";
import { Item } from "@/models/Item";
import Link from "next/link";

export default async function ItemsPage() {
  await connectDb();
  const items = await Item.find().lean();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link
            key={item._id}
            href={`/items/${item._id}`}
            className="border rounded-xl p-4 shadow hover:bg-gray-50 transition block"
          >
            {item.Image && (
              <img
                src={item.Image}
                alt={item.Name}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}
            <h2 className="text-xl font-semibold">{item.Name}</h2>
            <p className="text-gray-500">{item.Category}</p>
            <p className="text-green-600 font-bold">${item.Price}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
