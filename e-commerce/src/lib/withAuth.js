// src/lib/withAuth.js
import { verifyToken } from "./auth";

export function withAuth(handler, requireAdmin = false) {
  return async (req, res) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);

    if (!user) {
      return Response.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    if (requireAdmin && user.role !== "admin") {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    // Inject user into request for the handler
    req.user = user;

    return handler(req, res);
  };
}
