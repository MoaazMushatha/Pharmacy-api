const User = require("../models/User");
const { validateRegister, validateLogin } = require('../validators/auth');
const jwt = require("jsonwebtoken");

// JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

// Register new user
exports.register = async (req, res) => {
  // التحقق من البيانات
  const { error } = validateRegister(req.body);

  if (error) {

    return res.status(400).json({
      message: "Validation failed",
      details: error.details.map((d) => d.message),

    });
  }

  const { name, email, password } = req.body;
  try {

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already in use" });
    }
    user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return res.status(201).json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Login user

exports.login = async (req, res) => {
  
   const { error } = validateLogin(req.body);

  if (error) {
    
    return res.status(400).json({
      message: "Validation failed",
      details: error.details.map((d) => d.message),
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  // التحقق من البيانات
  const { error } = validateLogin(req.body);

  if (error) {

    return res.status(400).json({
      message: "Validation failed",
      details: error.details.map((d) => d.message),
    });

  }

  const { email, password } = req.body;
  try {
    // بحث عن المستخدم ومقارنة كلمة المرور
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    return res.json({ token, user });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Logout user

exports.logout = (req, res) => {
  // Stateless JWT: instruct client to delete token
  res.json({ message: "Logged out" }); // الclient  بحذف التوكن
};
