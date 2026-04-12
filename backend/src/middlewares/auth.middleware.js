import jwt from "jsonwebtoken";
import { Lawyer } from "../modules/lawyers/lawyer.model.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload; // { sub, role, iat, exp }
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/**
 * Unified middleware to check if the requester is either a User or a Lawyer.
 * It will set req.user if a regular user, or req.lawyer if a lawyer.
 */
export async function requireUserOrLawyer(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (payload.role === "lawyer") {
      const lawyer = await Lawyer.findById(payload.sub);
      if (!lawyer || !lawyer.isActive) {
        return res.status(403).json({ message: "Lawyer not active or not found" });
      }
      req.lawyer = lawyer;
      return next();
    } else {
      req.user = payload;
      return next();
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user?.role) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
    return next();
  };
}