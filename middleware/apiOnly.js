export const apiOnly = (req, res, next) => {
  // const accept = req.headers.accept || "";
  // if (!accept.includes("application/json")) {
  //   return res.status(403).json({ error: "Browser access not allowed" });
  // }
  next();
};
