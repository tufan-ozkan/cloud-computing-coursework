import { connectDb } from "@/lib/db";
import { Item } from "@/models/Item";
import { withAuth } from "@/lib/withAuth";
import { User } from "@/models/User";


// ---------- POST: Create Item (Admin only) ----------
async function handler(req) {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  await connectDb();
  const body = await req.json();

  const newItem = new Item({
    ...body,
    Rating: 0,
    Reviews: [],
    Seller: req.user.userId,
  });

  const saved = await newItem.save();
  return Response.json(saved, { status: 201 });
}

export const POST = withAuth(handler, true); // true = admin required

// ---------- GET: List All Items (with optional ?category=...) ----------
export async function GET(request) {
  await connectDb();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = {};
  if (category) {
    // Use regex to match case-insensitively and support spaces
    query.Category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  const items = await Item.find(query).lean();
  return Response.json(items);
}

