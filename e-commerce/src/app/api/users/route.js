import { connectDb } from "@/lib/db";
import { User } from "@/models/User";
import { withAuth } from "@/lib/withAuth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// ✅ GET: List all users (admin only)
export const GET = withAuth(async () => {
  await connectDb();
  const users = await User.find({}, "-Password").lean(); // omit password
  return NextResponse.json(users);
}, true); // admin only

// ✅ POST: Create a new user
async function handler(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  await connectDb();
  const body = await req.json();

  if (!body.UserName || !body.Password || !body.Role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await User.findOne({ UserName: body.UserName });
  if (existing) {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(body.Password, 12);
  const user = await User.create({
    UserName: body.UserName,
    Password: body.Password,
    Role: body.Role,
    AverageRating: 0,
    Reviews: [],
  });

  return NextResponse.json({ message: "User created", userId: user._id });
}

export const POST = withAuth(handler, true);
