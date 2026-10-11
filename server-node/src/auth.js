import jwt from "jsonwebtoken";

const SECRET = "busan-blog-secret";

export function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: "7d",
  });
}

function parse(req) {
  const header = req.headers.authorization; // "Bearer xxx"
  if (!header || !header.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(header.replace("Bearer ", ""), SECRET, { algorithms: ["HS256"] });
  } catch {
    return null;
  }
}

export function requireAuth(req, res, next) {
  const user = parse(req);
  if (!user) {
    return res
      .status(401)
      .json({ status: 401, msg: "인증되지 않았습니다", body: null });
  }
  req.sessionUser = user;
  next();
}

export function optionalAuth(req, res, next) {
  req.sessionUser = parse(req); // null 가능
  next();
}
