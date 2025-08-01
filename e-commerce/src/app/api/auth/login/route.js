import { connectDb } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    await connectDb();

    const user = await User.findOne({ UserName: username });
    if (!user || !user.Password) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({ token });
    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
