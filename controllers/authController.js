const User = require("../models/User");
const { validateRegister, validateLogin } = require("../validators/auth");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

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
    return res.status(422).json({
      message: "Validation failed",
      details: error.details.map((d) => d.message),
    });
  }

  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return next(createError(409, "Email already in use"));
      // return returnJson(res, 400, false, "Email already in use", null)
      // return res.status(400).json({ message: "Email already in use" });
    }

    user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return returnJson(res, 201, true, "Registered Successfully!", {
      token,
      user,
    });
    // return res.status(201).json({ token, user });
  } catch (err) {
    return next(createError(500, err.message));
    // return returnJson(res, 500, false, err.message, null)
    // return res.status(500).json({ message: err.message });
  }
};

//Login user

exports.login = async (req, res) => {
  const { error } = validateLogin(req.body);

  if (error) {
    return next(createError(422, "Validation failed"));

    // return res.status(400).json({
    //   message: "Validation failed",
    //   details: error.details.map((d) => d.message),
    // });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return next(createError(401, "Invalid credentials"));

      // return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    return returnJson(res, 201, true, "Logged in Successfully!", {
      token,
      user,
    });

    // res.json({ token, user });
  } catch (err) {
    return next(createError(500, err.message));

    // res.status(500).json({ message: err.message });
  }
};

// Logout user

exports.logout = (req, res) => {
  // Stateless JWT: instruct client to delete token
  return returnJson(res, 200, true, "Logged out!", null);

  // res.json({ message: "Logged out" }); // الclient  بحذف التوكن
};
