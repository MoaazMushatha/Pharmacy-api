const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  //يقرأ الهيدر Authorization اللي المفروض يحتوي على التوكن
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    // بادي ب Bearer
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // هاد بفصل التوكن بعدين بشتغل
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //هات البيانات من الداتا بيز
    req.user = await User.findById(decoded.id).select("-password"); //بدون ما يجيب الباسورد

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (req.user.email !== "moaaz1@example.com") {
      return res
        .status(403)
        .json({ message: "Admins only. You are not authorized." });
    }

    next(); //مرر يحج
  } catch (err) {
    res.status(401).json({ message: "Not authorized!! " });
  }
};
