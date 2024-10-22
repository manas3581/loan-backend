import { User } from "../model/User.js";
import { sendToken } from "../utils/sendToken.js";
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please enter all fields",
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).send({
        success: false,
        message: "user already exist",
      });
    }

    user = await User.create({
      name,
      email,
      password,
    });

    sendToken(res, user, "register successfully", 201);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "internal server error",
      e,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please enter all fields",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "incorrect password or email",
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "incorrect password or email",
      });
    }

    sendToken(res, user, `Welcome back ${user.name}`, 200);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "internal server error",
      e,
    });
  }
};

export const logoutController = (req, res) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      secure: true,
      httpOnly: true,
      sameSite: "none",
    })
    .send({
      success: true,
      message: "logged out successfully",
    });
};

export const getMyProfileController = async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user._id);
    res.status(200).send({
      success: true,
      user,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "internal server error ",
    });
  }
};
